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
import { withBasePath } from './base-path';

const configuredSiteOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN?.trim();
const socialCard = withBasePath('/brand/aussiecare-share-v1.png');

export const metadata: Metadata = {
  metadataBase: configuredSiteOrigin
    ? new URL(configuredSiteOrigin.endsWith('/') ? configuredSiteOrigin : `${configuredSiteOrigin}/`)
    : undefined,
  title: 'AussieCare · Periquitos Australianos',
  description: 'Una guía visual cinematográfica y offline para comprender y cuidar periquitos australianos.',
  manifest: withBasePath('/manifest.webmanifest'),
  applicationName: 'AussieCare',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AussieCare',
  },
  icons: {
    icon: [
      { url: withBasePath('/icons/favicon-64.png'), sizes: '64x64', type: 'image/png' },
    ],
    apple: [{ url: withBasePath('/icons/apple-touch-icon.png'), sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: withBasePath('/'),
    siteName: 'AussieCare',
    title: 'AussieCare · Periquitos Australianos',
    description: 'Guía visual para comprender y cuidar a tu periquito.',
    images: [{ url: socialCard, width: 1200, height: 630, alt: 'Firma de Luics415 para AussieCare junto a dos periquitos ilustrados' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AussieCare · Periquitos Australianos',
    description: 'Guía visual para comprender y cuidar a tu periquito.',
    images: [socialCard],
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
