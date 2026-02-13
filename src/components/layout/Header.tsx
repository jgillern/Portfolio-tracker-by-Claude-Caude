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
import { SettingsModal } from '@/components/settings/SettingsModal';
import { FunAvatar, getDefaultAvatarId } from '@/components/settings/FunAvatars';
import { getItem } from '@/lib/localStorage';
import { STORAGE_KEYS } from '@/config/constants';
import type { AvatarId } from '@/config/constants';
import { cn } from '@/lib/utils';

export function Header() {
  const { t } = useLanguage();
  const { state } = usePortfolio();
  const { profile, signOut } = useAuth();
  const pathname = usePathname();
  const [showCreate, setShowCreate] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [avatarId, setAvatarId] = useState<AvatarId>(getDefaultAvatarId());
  const menuRef = useRef<HTMLDivElement>(null);

  // Load avatar from localStorage
  useEffect(() => {
    const saved = getItem<AvatarId | null>(STORAGE_KEYS.AVATAR, null);
    if (saved) setAvatarId(saved);
  }, [showSettings]); // Re-read when settings closes (avatar may have changed)

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

  const fullName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : '';

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

              {/* User menu with avatar + name */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title={fullName}
                >
                  <FunAvatar avatarId={avatarId} className="w-7 h-7" />
                  <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[120px] truncate">
                    {fullName}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    {/* User info header */}
                    {profile && (
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                        <FunAvatar avatarId={avatarId} className="w-10 h-10 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {fullName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {profile.email}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Settings button */}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowSettings(true);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {t('settings.title')}
                    </button>

                    {/* Divider */}
                    <div className="border-t border-gray-100 dark:border-gray-700" />

                    {/* Logout button */}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        signOut();
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
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
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}
