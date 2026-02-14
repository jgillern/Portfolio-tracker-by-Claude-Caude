'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { PortfolioProvider } from '@/context/PortfolioContext';
import { Header } from '@/components/layout/Header';
import { SatoshiEasterEgg } from '@/components/SatoshiEasterEgg';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <Header />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6">{children}</main>
        <SatoshiEasterEgg />
      </PortfolioProvider>
    </AuthProvider>
  );
}
