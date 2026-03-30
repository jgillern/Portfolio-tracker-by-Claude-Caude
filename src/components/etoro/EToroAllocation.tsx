'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import type { EToroPosition } from '@/types/etoro';

interface Props {
  positions: EToroPosition[];
}

const TYPE_COLORS: Record<string, string> = {
  stock: '#3b82f6',
  etf: '#a855f7',
  crypto: '#f97316',
  commodity: '#eab308',
  currency: '#22c55e',
};

const TYPE_BG_CLASSES: Record<string, string> = {
  stock: 'bg-blue-500',
  etf: 'bg-purple-500',
  crypto: 'bg-orange-500',
  commodity: 'bg-yellow-500',
  currency: 'bg-green-500',
};

export function EToroAllocation({ positions }: Props) {
  const { t } = useLanguage();

  if (positions.length === 0) return null;

  // Type allocation
  const typeMap = new Map<string, number>();
  for (const pos of positions) {
    typeMap.set(pos.type, (typeMap.get(pos.type) ?? 0) + pos.allocationPct);
  }
  const types = Array.from(typeMap.entries())
    .map(([type, pct]) => ({ type, pct }))
    .sort((a, b) => b.pct - a.pct);

  // Top positions
  const top10 = positions.slice(0, 10);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('etoro.allocation')}
      </h2>

      {/* Type allocation bar */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('dashboard.typeAllocation')}
        </h3>
        <div className="flex h-4 rounded-full overflow-hidden mb-3">
          {types.map((item) => (
            <div
              key={item.type}
              style={{
                width: `${item.pct}%`,
                backgroundColor: TYPE_COLORS[item.type] ?? '#6b7280',
              }}
              title={`${item.type}: ${item.pct.toFixed(1)}%`}
              className="transition-all"
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {types.map((item) => (
            <div key={item.type} className="flex items-center gap-1.5">
              <div className={`h-2.5 w-2.5 rounded-full ${TYPE_BG_CLASSES[item.type] ?? 'bg-gray-500'}`} />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {t(`types.${item.type}`) || item.type}
              </span>
              <span className="text-xs font-medium text-gray-900 dark:text-white">
                {item.pct.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top positions bar chart */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Top {Math.min(10, positions.length)} {t('etoro.positions')}
        </h3>
        <div className="space-y-2">
          {top10.map((pos, idx) => (
            <div key={`${pos.instrumentId}-${idx}`} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 dark:text-gray-400 w-20 truncate font-mono">
                {pos.ticker}
              </span>
              <div className="flex-1 h-5 rounded bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full rounded transition-all"
                  style={{
                    width: `${pos.allocationPct}%`,
                    backgroundColor: TYPE_COLORS[pos.type] ?? '#6b7280',
                  }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-14 text-right tabular-nums">
                {pos.allocationPct.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
