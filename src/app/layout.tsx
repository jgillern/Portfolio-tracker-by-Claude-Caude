import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/context/Providers';
import { Header } from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'Portfolio Tracker',
  description: 'Track your investment portfolio performance',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
        <Providers>
          <Header />
          <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
