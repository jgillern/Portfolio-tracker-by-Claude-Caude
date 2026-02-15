'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { DailyMovements } from '@/components/markets/DailyMovements';
import { MarketsChart } from '@/components/markets/MarketsChart';
import { FearGreedIndex } from '@/components/markets/FearGreedIndex';
import { WinnersLosers } from '@/components/markets/WinnersLosers';

export default function MarketsPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {t('markets.title')}
      </h1>

      <DailyMovements />
      <MarketsChart />
      <FearGreedIndex />
      <WinnersLosers />
    </div>
  );
}
