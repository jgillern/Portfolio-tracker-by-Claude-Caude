'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { getPortfolioWeights } from '@/lib/utils';
import { InstrumentType } from '@/types/portfolio';

const TYPE_COLORS: Record<InstrumentType, string> = {
  stock: 'bg-blue-500',
  etf: 'bg-purple-500',
  crypto: 'bg-orange-500',
  bond: 'bg-green-500',
  commodity: 'bg-yellow-500',
};

export function TypeAllocation() {
  const { t, locale } = useLanguage();
  const { activePortfolio } = usePortfolio();

  if (!activePortfolio || activePortfolio.instruments.length === 0) return null;

  const { instruments } = activePortfolio;
  const weights = getPortfolioWeights(activePortfolio);

  const typeMap = new Map<InstrumentType, number>();
  instruments.forEach((instrument, idx) => {
    const current = typeMap.get(instrument.type) || 0;
    typeMap.set(instrument.type, current + weights[idx]);
  });

  const total = Array.from(typeMap.values()).reduce((a, b) => a + b, 0);
  const types = Array.from(typeMap.entries())
    .map(([type, weight]) => ({
      type,
      percentage: total > 0 ? (weight / total) * 100 : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('dashboard.typeAllocation')}
      </h2>

      <div className="flex h-4 rounded-full overflow-hidden mb-4">
        {types.map((item) => (
          <div
            key={item.type}
            className={`${TYPE_COLORS[item.type]} transition-all`}
            style={{ width: `${item.percentage}%` }}
            title={`${getTypeLabel(item.type, locale, t)}: ${item.percentage.toFixed(1)}%`}
          />
        ))}
      </div>

      <div className="space-y-2">
        {types.map((item) => (
          <div key={item.type} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${TYPE_COLORS[item.type]}`} />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {getTypeLabel(item.type, locale, t)}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {item.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getTypeLabel(type: InstrumentType, locale: string, t: (key: string) => string): string {
  return t(`types.${type}`) || type;
}
