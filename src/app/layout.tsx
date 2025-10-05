import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import GlobalLoader from '@/components/GlobalLoader';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EthniqRootz - African Marketplace',
  description: 'Discover authentic African products from local sellers across the UK',
  keywords: 'African marketplace, African products, UK, fashion, food, culture',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'EthniqRootz - African Marketplace',
    description: 'Discover authentic African products from local sellers across the UK',
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
