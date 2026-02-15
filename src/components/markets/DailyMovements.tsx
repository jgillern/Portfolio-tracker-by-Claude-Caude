'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Spinner } from '@/components/ui/Spinner';
import { MARKET_INDEXES } from '@/lib/indexConstants';
import { Quote } from '@/types/market';
import { cn } from '@/lib/utils';

export function DailyMovements() {
  const { t } = useLanguage();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const symbols = MARKET_INDEXES.map((i) => i.symbol).join(',');
    fetch(`/api/quote?symbols=${symbols}`)
      .then((r) => r.json())
      .then((data) => setQuotes(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('markets.dailyMovements')}
      </h2>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner className="h-6 w-6" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {MARKET_INDEXES.map((index) => {
            const quote = quotes.find((q) => q.symbol === index.symbol);
            const change = quote?.change24h ?? null;
            return (
              <div
                key={index.symbol}
                className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                  {index.shortName}
                </div>
                {change !== null ? (
                  <div
                    className={cn(
                      'text-2xl font-bold',
                      change >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    )}
                  >
                    {change >= 0 ? '+' : ''}
                    {change.toFixed(2)}%
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-gray-400">—</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
