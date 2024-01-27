'use client';

import dynamic from 'next/dynamic';
const NYCMap = dynamic(() => import('./NYCMap'), { ssr: false });
export default function Home() {
  return (
    <main>
      <h1>NYC Map</h1>
      <p>
        using{' '}
        <a href="https://docs.protomaps.com/" target="_blank">
          pmtiles
        </a>
        . Src on{' '}
        <a href="https://github.com/ScottWeinstein/nyc.pmtiles" target="_blank">
          github
        </a>
        .
      </p>

      <NYCMap />
    </main>
  );
}
