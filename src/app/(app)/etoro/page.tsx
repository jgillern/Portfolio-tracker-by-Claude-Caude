'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useEToroPortfolio } from '@/hooks/useEToroPortfolio';
import { EToroSearch } from '@/components/etoro/EToroSearch';
import { EToroProfileCard } from '@/components/etoro/EToroProfileCard';
import { EToroPositionsTable } from '@/components/etoro/EToroPositionsTable';
import { EToroStatsCards } from '@/components/etoro/EToroStatsCards';
import { EToroMetrics } from '@/components/etoro/EToroMetrics';
import { EToroAllocation } from '@/components/etoro/EToroAllocation';
import { Spinner } from '@/components/ui/Spinner';
import type { EToroUser } from '@/types/etoro';

export default function EToroPage() {
  const { t } = useLanguage();
  const { data, isLoading, error, fetchPortfolio, clear } = useEToroPortfolio();

  const handleSelect = (user: EToroUser) => {
    fetchPortfolio(user.username);
  };

  const handleBack = () => {
    clear();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {t('etoro.title')}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('etoro.subtitle')}
        </p>
      </div>

      {/* Search - always visible when no portfolio is loaded */}
      {!data && !isLoading && (
        <EToroSearch onSelect={handleSelect} />
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Spinner className="h-8 w-8" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('etoro.loading')}
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6 text-center">
          <p className="text-sm text-red-700 dark:text-red-300 mb-3">{error}</p>
          <button
            onClick={handleBack}
            className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
          >
            {t('etoro.tryAgain')}
          </button>
        </div>
      )}

      {/* Portfolio data */}
      {data && !isLoading && (
        <>
          <EToroProfileCard profile={data.profile} onBack={handleBack} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EToroStatsCards stats={data.stats} />
            <EToroAllocation positions={data.positions} />
          </div>

          <EToroPositionsTable positions={data.positions} />

          {data.positions.length > 0 && (
            <EToroMetrics positions={data.positions} />
          )}
        </>
      )}
    </div>
  );
}
