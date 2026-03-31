'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useEToroSearch } from '@/hooks/useEToroSearch';
import { Spinner } from '@/components/ui/Spinner';
import type { EToroUser } from '@/types/etoro';

interface Props {
  onSelect: (user: EToroUser) => void;
}

export function EToroSearch({ onSelect }: Props) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const { results, isLoading } = useEToroSearch(query);

  const handleDirectLoad = () => {
    const username = query.trim();
    if (username.length >= 2) {
      onSelect({
        username,
        fullName: username,
        avatarUrl: '',
        copiers: 0,
        gainPct: 0,
        riskScore: 0,
        isPro: false,
        country: '',
      });
      setQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleDirectLoad();
    }
  };

  return (
    <div className="relative">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('etoro.searchPlaceholder')}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Spinner className="h-4 w-4" />
            </div>
          )}
        </div>
        {query.trim().length >= 2 && (
          <button
            onClick={handleDirectLoad}
            className="px-4 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors flex-shrink-0"
          >
            {t('etoro.loadProfile')}
          </button>
        )}
      </div>

      <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
        {t('etoro.searchHint')}
      </p>

      {results.length > 0 && (
        <div className="absolute z-20 mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
          <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
            {results.map((user) => (
              <li key={user.username}>
                <button
                  onClick={() => {
                    onSelect(user);
                    setQuery('');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      className="h-9 w-9 rounded-full object-cover bg-gray-200 dark:bg-gray-700 flex-shrink-0"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-green-700 dark:text-green-400">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user.fullName || user.username}
                      </span>
                      {user.isPro && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                          PI
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      @{user.username}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0 text-xs">
                    <div className="text-right">
                      <div className={`font-semibold ${user.gainPct >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {user.gainPct >= 0 ? '+' : ''}{user.gainPct.toFixed(1)}%
                      </div>
                      <div className="text-gray-400">{t('etoro.gain')}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-700 dark:text-gray-300">
                        {user.copiers.toLocaleString()}
                      </div>
                      <div className="text-gray-400">{t('etoro.copiers')}</div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {query.trim().length >= 2 && !isLoading && results.length === 0 && (
        <div className="absolute z-20 mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            {t('etoro.noResults')}
          </p>
        </div>
      )}
    </div>
  );
}
