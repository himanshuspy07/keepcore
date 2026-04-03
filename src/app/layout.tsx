import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import PwaRegistry from '@/components/pwa-registry';

export const metadata: Metadata = {
  title: 'KeepCore',
  description: 'Your personal offline media vault.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#1C1E22" />
      </head>
      <body className="font-body antialiased">
        <PwaRegistry />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
