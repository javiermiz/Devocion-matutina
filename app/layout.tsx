import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import InstallPWA from '../components/InstallPWA';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
  display: 'swap', // Mejor práctica para carga de fuentes
  preload: true,
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
  display: 'swap',
  preload: true,
});

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Permitir zoom para accesibilidad
  userScalable: true, // Mejor para accesibilidad
  themeColor: '#ffffff',
  viewportFit: 'cover', // Mejor soporte para dispositivos modernos
};

export const metadata: Metadata = {
  metadataBase: new URL('https://tudominio.com'), // Reemplaza con tu dominio
  title: {
    default: 'Devocional Matutino',
    template: '%s | Devocional Matutino',
  },
  description: 'Proyecto que simplifica devocionmatutina.com',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Devocional Matutino',
  },
  // Favicons y aplicación
  icons: {
    icon: [
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon.ico', sizes: 'any' },
    ],
    apple: [
      {
        url: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icons/safari-pinned-tab.svg',
        color: '#5bbad5',
      },
    ],
  },
  // OpenGraph metadata
  openGraph: {
    title: 'Devocional Matutino',
    description: 'Proyecto que simplifica devocionmatutina.com',
    url: 'https://tudominio.com',
    siteName: 'Devocional Matutino',
    type: 'website',
    locale: 'es_ES',
    images: [
      {
        url: '/og-image.png', // Asegúrate de crear esta imagen
        width: 1200,
        height: 630,
        alt: 'Devocional Matutino',
      },
    ],
  },
  // Twitter metadata
  twitter: {
    card: 'summary_large_image',
    title: 'Devocional Matutino',
    description: 'Proyecto que simplifica devocionmatutina.com',
    images: ['/og-image.png'],
  },
  // Otros metadatos útiles
  keywords: ['devocional', 'matutino', 'religión', 'fe', 'cristianismo'],
  authors: [{ name: 'Tu Nombre' }],
  category: 'religión',
  formatDetection: {
    telephone: false, // Deshabilita la detección automática de números de teléfono
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='es' // Cambiado a español
      suppressHydrationWarning // Evita advertencias de hidratación
      className='scroll-smooth' // Scroll suave
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <div className='flex-grow'>{children}</div>
        <InstallPWA />
      </body>
    </html>
  );
}
