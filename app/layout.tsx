import type { Metadata, Viewport } from 'next';
import './globals.css';
import './pwa-status.css';
import './audio-controls.css';
import './beats.css';
import './phase-c.css';
import './phase-d.css';
import './phase-e.css';
import './phase-f.css';
import './phase-g.css';
import './reading-accessibility.css';
import './aussiecare-brand.css';
import ServiceWorkerRegistration from './service-worker-registration';

export const metadata: Metadata = {
  title: 'AussieCare · Periquitos Australianos',
  description: 'Una guía visual cinematográfica y offline para comprender y cuidar periquitos australianos.',
  manifest: '/manifest.webmanifest',
  applicationName: 'AussieCare',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AussieCare',
  },
  icons: {
    icon: [
      { url: '/icons/favicon-64.png', sizes: '64x64', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    title: 'AussieCare · Periquitos Australianos',
    description: 'Guía visual para comprender y cuidar a tu periquito.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'BUD-HERO en un paisaje australiano al amanecer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AussieCare · Periquitos Australianos',
    description: 'Guía visual para comprender y cuidar a tu periquito.',
    images: ['/og.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#587665' },
    { media: '(prefers-color-scheme: dark)', color: '#171915' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
