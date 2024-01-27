'use client';
import { useEffect, useRef } from 'react';

export default function Home() {
  const mapInitialized = useRef(false);
  const mapDiv = useRef(null);
  useEffect(() => {
    if (!mapDiv.current || mapInitialized.current) {
      return;
    }
    const w = global as any;
    const map = w.L.map(mapDiv.current);
    mapInitialized.current = true;
    const layer = w.protomapsL.leafletLayer({ url: '/api/nyx/{z}/{x}/{y}.pbf' });
    layer.addTo(map);
    map.setView(new w.L.LatLng(40.697104, -73.9795379), 16);
    const hash = new w.L.Hash(map);
    layer.addInspector(map);
  }, [mapDiv, mapInitialized]);

  return (
    <main>
      <h1>Map</h1>
      <div
        ref={mapDiv}
        style={{
          height: '100vh',
          margin: '10px',
        }}
      ></div>
    </main>
  );
}
