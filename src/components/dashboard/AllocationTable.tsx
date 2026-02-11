'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { DEFAULT_SECTORS, SECTOR_LABELS } from '@/config/sectors';
import { getPortfolioWeights } from '@/lib/utils';

export function AllocationTable() {
  const { t, locale } = useLanguage();
  const { activePortfolio } = usePortfolio();

  if (!activePortfolio || activePortfolio.instruments.length === 0) return null;

  const { instruments } = activePortfolio;
  const weights = getPortfolioWeights(activePortfolio);

  // Group by sector with weighted percentages
  const sectorMap = new Map<string, number>();
  instruments.forEach((instrument, idx) => {
    const sector = instrument.sector || DEFAULT_SECTORS[instrument.type] || 'Other';
    const current = sectorMap.get(sector) || 0;
    sectorMap.set(sector, current + weights[idx]);
  });

  // Normalize to 100%
  const total = Array.from(sectorMap.values()).reduce((a, b) => a + b, 0);
  const sectors = Array.from(sectorMap.entries())
    .map(([name, weight]) => ({
      name,
      percentage: total > 0 ? (weight / total) * 100 : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-orange-500',
    'bg-purple-500',
    'bg-red-500',
    'bg-cyan-500',
    'bg-yellow-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('dashboard.allocation')}
      </h2>

      {/* Stacked bar */}
      <div className="flex h-4 rounded-full overflow-hidden mb-4">
        {sectors.map((sector, i) => (
          <div
            key={sector.name}
            className={`${colors[i % colors.length]} transition-all`}
            style={{ width: `${sector.percentage}%` }}
            title={`${getSectorLabel(sector.name, locale)}: ${sector.percentage.toFixed(1)}%`}
          />
        ))}
      </div>

      {/* Legend table */}
      <div className="space-y-2">
        {sectors.map((sector, i) => (
          <div key={sector.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${colors[i % colors.length]}`} />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {getSectorLabel(sector.name, locale)}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {sector.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getSectorLabel(sector: string, locale: string): string {
  const labels = SECTOR_LABELS[sector];
  if (labels) return locale === 'cs' ? labels.cs : labels.en;
  return sector;
}
