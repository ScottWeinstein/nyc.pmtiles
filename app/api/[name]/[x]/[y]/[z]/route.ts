// adapted from https://github.com/protomaps/PMTiles/blob/main/serverless/cloudflare/src/index.ts
import { PMTiles, Source, RangeResponse, ResolvedValueCache, TileType, Compression } from 'pmtiles';
import { tile_path, tileJSON } from './pmtilesshared';

class KeyNotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

async function nativeDecompress(buf: ArrayBuffer, compression: Compression): Promise<ArrayBuffer> {
  if (compression === Compression.None || compression === Compression.Unknown) {
    return buf;
  } else if (compression === Compression.Gzip) {
    let stream = new Response(buf).body!;
    let result = stream.pipeThrough(new DecompressionStream('gzip'));
    return new Response(result).arrayBuffer();
  } else {
    throw Error('Compression method not supported');
  }
}

const CACHE = new ResolvedValueCache(25, undefined, nativeDecompress);

class HTTPSource implements Source {
  url: string;

  constructor(url: string) {
    this.url = url;
  }
  getKey() {
    return this.url;
  }
  async getBytes(position: number, length: number): Promise<RangeResponse> {
    const headers = { Range: `bytes=${position}-${position + length - 1}` };
    const response = await fetch(this.url, { headers });
    if (!response.ok || length !== Number(response.headers.get('content-length'))) {
      console.log(
        'fetched',
        headers.Range,
        position,
        length,
        response.status,
        response.statusText,
        response.headers.get('content-length'),
        response.headers.get('content-range'),
      );
    }
    const data = await response.arrayBuffer();
    return { data, etag: response.headers.get('etag')!, cacheControl: response.headers.get('cache-control')! };
  }
}

const source = new HTTPSource('https://kcofm6b7gtcm3osv.public.blob.vercel-storage.com/nyc.pmtiles');
const p = new PMTiles(source, CACHE, nativeDecompress);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tilePath = tile_path(url.pathname);
  const { ok, name, tile, ext } = tilePath;
  if (!ok) {
    return new Response('Invalid URL', { status: 404 });
  }

  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=86400',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  try {
    const p_header = await p.getHeader();
    if (!tile) {
      const t = tileJSON(p_header, await p.getMetadata(), url.hostname, name); //env.PUBLIC_HOSTNAME ||
      return new Response(JSON.stringify(t), {
        status: 200,
        headers,
      });
    }

    if (tile[0] < p_header.minZoom || tile[0] > p_header.maxZoom) {
      return new Response('undefined', { status: 404 });
    }

    for (const pair of [
      [TileType.Mvt, 'mvt'],
      [TileType.Png, 'png'],
      [TileType.Jpeg, 'jpg'],
      [TileType.Webp, 'webp'],
      [TileType.Avif, 'avif'],
    ]) {
      if (p_header.tileType === pair[0] && ext !== pair[1]) {
        if (p_header.tileType == TileType.Mvt && ext === 'pbf') {
          // allow this for now. Eventually we will delete this in favor of .mvt
          continue;
        }
        return new Response(`Bad request: requested .${ext} but archive has type .${pair[1]}`, {
          headers,
          status: 400,
        });
      }
    }

    const tiledata = await p.getZxy(tile[0], tile[1], tile[2]);
    switch (p_header.tileType) {
      case TileType.Mvt:
        headers['Content-Type'] = 'application/x-protobuf';
        break;
      case TileType.Png:
        headers['Content-Type'] = 'image/png';
        break;
      case TileType.Jpeg:
        headers['Content-Type'] = 'image/jpeg';
        break;
      case TileType.Webp:
        headers['Content-Type'] = 'image/webp';
        break;
    }
    if (tiledata) {
      return new Response(tiledata.data, { headers, status: 200 });
    } else {
      console.log('no tile data for', tilePath);
      return new Response(undefined, { headers, status: 204 });
    }
  } catch (e) {
    if (e instanceof KeyNotFoundError) {
      return new Response('Archive not found', { headers, status: 404 });
    } else {
      throw e;
    }
  }
}
