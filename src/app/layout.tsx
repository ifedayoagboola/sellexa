import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import GlobalLoader from '@/components/GlobalLoader';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sellexa - The digital home for diaspora commerce',
  description: 'The digital home for diaspora commerce - discover handpicked products from verified merchants worldwide',
  keywords: 'authentic commerce, niche marketplace, curated products, verified merchants, exclusive network, authentic products, premium marketplace',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Sellexa - The digital home for diaspora commerce',
    description: 'The digital home for diaspora commerce - discover handpicked products from verified merchants worldwide',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        {children}
        <GlobalLoader />
        <Toaster />
      </body>
    </html>
  );
}
