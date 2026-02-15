'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Spinner } from '@/components/ui/Spinner';
import { cn, formatCurrency } from '@/lib/utils';

interface Mover {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number | null;
  marketCapChange: number | null;
}

function fmtBigNum(v: number | null): string {
  if (v == null) return '—';
  const abs = Math.abs(v);
  if (abs >= 1e12) return `${(v / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${(v / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${(v / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
  return v.toLocaleString('en-US');
}

export function WinnersLosers() {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'percent' | 'value'>('percent');
  const [data, setData] = useState<{ gainers: Mover[]; losers: Mover[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/movers?mode=${mode}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.gainers) setData(d);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [mode]);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('markets.winnersLosers')}
        </h2>
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
          <button
            onClick={() => setMode('percent')}
            className={cn(
              'px-3 py-1.5 text-xs font-medium transition-colors',
              mode === 'percent'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            )}
          >
            %
          </button>
          <button
            onClick={() => setMode('value')}
            className={cn(
              'px-3 py-1.5 text-xs font-medium transition-colors',
              mode === 'value'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            )}
          >
            {t('markets.marketCap')}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      ) : !data ? (
        <p className="text-sm text-gray-400 text-center py-8">{t('errors.fetchFailed')}</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gainers */}
          <div>
            <h3 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
              {t('markets.topGainers')}
            </h3>
            <div className="space-y-1">
              {data.gainers.map((m, idx) => (
                <MoverRow key={m.symbol} mover={m} rank={idx + 1} mode={mode} isGainer />
              ))}
            </div>
          </div>

          {/* Losers */}
          <div>
            <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
              </svg>
              {t('markets.topLosers')}
            </h3>
            <div className="space-y-1">
              {data.losers.map((m, idx) => (
                <MoverRow key={m.symbol} mover={m} rank={idx + 1} mode={mode} isGainer={false} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MoverRow({ mover, rank, mode, isGainer }: { mover: Mover; rank: number; mode: 'percent' | 'value'; isGainer: boolean }) {
  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
      <span className="text-xs font-bold text-gray-400 w-5 text-right">{rank}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{mover.symbol}</span>
          <span className="text-xs text-gray-400 truncate">{mover.name}</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        {mode === 'percent' ? (
          <span
            className={cn(
              'text-sm font-bold',
              isGainer ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            )}
          >
            {mover.changePercent >= 0 ? '+' : ''}{mover.changePercent.toFixed(2)}%
          </span>
        ) : (
          <span
            className={cn(
              'text-sm font-bold',
              isGainer ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            )}
          >
            {(mover.marketCapChange ?? 0) >= 0 ? '+' : ''}${fmtBigNum(mover.marketCapChange)}
          </span>
        )}
      </div>
    </div>
  );
}
