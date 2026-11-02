import type { Metadata } from 'next';
import './globals.css';
import { DineProvider } from '../context/DineContext';

export const metadata: Metadata = {
  title: 'SmartDine — Intelligent Restaurant Management & Digital Dining OS',
  description: 'A complete contactless digital dining experience connecting customers, table QR ordering, waiters, kitchen KDS, and management.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#0a0e17] text-slate-100 antialiased font-sans">
        <DineProvider>
          {children}
        </DineProvider>
      </body>
    </html>
  );
}
