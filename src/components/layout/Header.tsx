'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { PortfolioSwitcher } from '@/components/portfolio/PortfolioSwitcher';
import { CreatePortfolioModal } from '@/components/portfolio/CreatePortfolioModal';
import { cn } from '@/lib/utils';

export function Header() {
  const { t } = useLanguage();
  const { state } = usePortfolio();
  const pathname = usePathname();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-lg font-bold text-gray-900 dark:text-white">
                {t('app.title')}
              </Link>
              <nav className="hidden sm:flex items-center gap-1">
                <Link
                  href="/"
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    pathname === '/'
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  )}
                >
                  {t('header.dashboard')}
                </Link>
                <Link
                  href="/news"
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    pathname === '/news'
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  )}
                >
                  {t('header.news')}
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-2">
              {state.portfolios.length > 0 && <PortfolioSwitcher />}
              <Button size="sm" onClick={() => setShowCreate(true)}>
                + {t('header.createPortfolio')}
              </Button>
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile nav */}
          <nav className="flex sm:hidden items-center gap-1 pb-2">
            <Link
              href="/"
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                pathname === '/'
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400'
              )}
            >
              {t('header.dashboard')}
            </Link>
            <Link
              href="/news"
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                pathname === '/news'
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400'
              )}
            >
              {t('header.news')}
            </Link>
          </nav>
        </div>
      </header>

      <CreatePortfolioModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </>
  );
}
