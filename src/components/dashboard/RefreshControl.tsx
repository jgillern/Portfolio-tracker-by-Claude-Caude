'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { REFRESH_INTERVAL_MS } from '@/hooks/useMarketData';

interface Props {
  lastUpdated: number | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export function RefreshControl({ lastUpdated, isLoading, onRefresh }: Props) {
  const { t } = useLanguage();
  const [remaining, setRemaining] = useState(REFRESH_INTERVAL_MS);

  useEffect(() => {
    if (!lastUpdated) return;

    const tick = () => {
      const elapsed = Date.now() - lastUpdated;
      const left = Math.max(0, REFRESH_INTERVAL_MS - elapsed);
      setRemaining(left);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lastUpdated]);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
      <span>{t('dashboard.autoRefresh')} {timeStr}</span>
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        title={t('dashboard.refreshNow')}
      >
        <svg
          className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    </div>
  );
}
