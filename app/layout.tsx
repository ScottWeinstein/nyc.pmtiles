import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NYC.protomaps ',
  description: 'via nextjs and vercel',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" async></script>
        <script src="https://unpkg.com/leaflet-hash@0.2.1/leaflet-hash.js" async></script>
        <script src="https://unpkg.com/protomaps-leaflet@1.24.2/dist/protomaps-leaflet.min.js" async></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
