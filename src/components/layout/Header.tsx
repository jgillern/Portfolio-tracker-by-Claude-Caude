'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { useAuth } from '@/context/AuthContext';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { PortfolioSwitcher } from '@/components/portfolio/PortfolioSwitcher';
import { CreatePortfolioModal } from '@/components/portfolio/CreatePortfolioModal';
import { cn } from '@/lib/utils';

export function Header() {
  const { t } = useLanguage();
  const { state } = usePortfolio();
  const { profile, signOut } = useAuth();
  const pathname = usePathname();
  const [showCreate, setShowCreate] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '/', label: t('header.dashboard') },
    { href: '/news', label: t('header.news') },
    { href: '/calendar', label: t('header.calendar') },
  ];

  const initials = profile
    ? `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase()
    : '?';

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
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      pathname === link.href
                        ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              {state.portfolios.length > 0 && (
                <PortfolioSwitcher onCreateNew={() => setShowCreate(true)} />
              )}
              <LanguageToggle />
              <ThemeToggle />

              {/* User menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                  title={profile ? `${profile.first_name} ${profile.last_name}` : ''}
                >
                  {initials}
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    {profile && (
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {profile.first_name} {profile.last_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {profile.email}
                        </p>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        signOut();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {t('auth.signOut')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile nav */}
          <nav className="flex sm:hidden items-center gap-1 pb-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <CreatePortfolioModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </>
  );
}
