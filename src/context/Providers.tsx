'use client';

import React from 'react';
import { LanguageProvider } from './LanguageContext';
import { ThemeProvider } from './ThemeContext';
import { PortfolioProvider } from './PortfolioContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <PortfolioProvider>{children}</PortfolioProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
