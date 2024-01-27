import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
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
      <head></head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
