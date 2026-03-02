import type { Metadata, Viewport } from 'next';
import './globals.css';
import { BottomNav } from '@/components/layout/BottomNav';

export const metadata: Metadata = {
  title: 'ECA — Sistema Mental',
  description: 'Tu mente. Reclamada.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ECA',
    startupImage: [
      { url: '/icons/splash.svg' },
    ],
  },
  icons: {
    icon: '/icons/icon-512.svg',
    apple: '/icons/icon-192.svg',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#07070A',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" style={{ height: '100%', overflow: 'hidden' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        style={{
          overflow: 'hidden',
          background: '#09090E',
          position: 'fixed',
          width: '100%',
          height: '100dvh',
          top: 0,
          left: 0,
        }}
      >
        {/* Centred app shell — 430px max on desktop */}
        <div
          id="app-shell"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '430px',
            height: '100dvh',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: '#09090E',
          }}
        >
          {/* Page content — scrollable region */}
          <div
            id="page-content"
            className="page-scroll"
            style={{ flex: 1, position: 'relative', overflow: 'hidden auto', paddingBottom: 'calc(var(--nav-height) + env(safe-area-inset-bottom, 0px))' }}
          >
            {children}
          </div>

          {/* Fixed bottom nav inside shell */}
          <BottomNav />
        </div>

        {/* Desktop sidebar blur for > 430px screens */}
        <style>{`
          @media (min-width: 431px) {
            body::before {
              content: '';
              position: fixed;
              inset: 0;
              background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(61,219,130,0.04) 0%, transparent 70%), #07070A;
              z-index: -1;
            }
          }
        `}</style>
      </body>
    </html>
  );
}
