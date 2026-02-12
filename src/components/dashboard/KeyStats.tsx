'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { Spinner } from '@/components/ui/Spinner';
import { getPortfolioWeights } from '@/lib/utils';
import { TimePeriod } from '@/types/market';

interface PerformanceData {
  period: TimePeriod;
  label: string;
  value: number | null;
}

export function KeyStats() {
  const { t } = useLanguage();
  const { activePortfolio } = usePortfolio();
  const [stats, setStats] = useState<PerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const symbols = activePortfolio?.instruments.map((i) => i.symbol) ?? [];
  const weights = activePortfolio ? getPortfolioWeights(activePortfolio) : [];

  useEffect(() => {
    if (symbols.length === 0) {
      setStats([]);
      return;
    }

    const fetchStats = async () => {
      setIsLoading(true);
      const periods: { period: TimePeriod; label: string }[] = [
        { period: '5y', label: t('dashboard.period5y') },
        { period: '1y', label: t('dashboard.period1y') },
        { period: 'ytd', label: t('periods.ytd') },
        { period: '1mo', label: t('dashboard.period1mo') },
        { period: '1w', label: t('dashboard.period1w') },
      ];

      const results: PerformanceData[] = [];

      for (const { period, label } of periods) {
        try {
          let url = `/api/chart?symbols=${symbols.join(',')}&range=${period}`;
          if (weights && weights.length > 0) {
            url += `&weights=${weights.join(',')}`;
          }

          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            if (data.length >= 2) {
              const first = data[0].value;
              const last = data[data.length - 1].value;
              const performance = ((last - first) / first) * 100;
              results.push({ period, label, value: performance });
            } else {
              results.push({ period, label, value: null });
            }
          } else {
            results.push({ period, label, value: null });
          }
        } catch (err) {
          console.error(`Failed to fetch performance for ${period}`, err);
          results.push({ period, label, value: null });
        }
      }

      setStats(results);
      setIsLoading(false);
    };

    fetchStats();
  }, [symbols.join(','), weights.join(',')]);

  if (symbols.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('dashboard.keyStats')}
      </h2>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner className="h-6 w-6" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.period}
              className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
            >
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                {stat.label}
              </div>
              {stat.value !== null ? (
                <div
                  className={`text-2xl font-bold ${
                    stat.value >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {stat.value >= 0 ? '+' : ''}
                  {stat.value.toFixed(2)}%
                </div>
              ) : (
                <div className="text-2xl font-bold text-gray-400">—</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
