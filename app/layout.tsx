import type { Metadata, Viewport } from 'next';
import './globals.css';
import { BottomNav } from '@/components/layout/BottomNav';

export const metadata: Metadata = {
  title: 'ECA — Mental Reclaim System',
  description: 'Your mind. Reclaimed.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ECA',
  },
  icons: {
    apple: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#07070A',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body style={{ background: '#0D0D12', overflowX: 'hidden' }}>
        <main style={{ maxWidth: '430px', margin: '0 auto', position: 'relative', height: '100dvh' }}>
          {children}
          <BottomNav />
        </main>
      </body>
    </html>
  );
}
