'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { useMetrics } from '@/hooks/useMetrics';
import { getPortfolioWeights } from '@/lib/utils';
import { MetricGauge } from './MetricGauge';
import { Spinner } from '@/components/ui/Spinner';

export function PortfolioMetrics() {
  const { t } = useLanguage();
  const { activePortfolio } = usePortfolio();

  const instruments = activePortfolio?.instruments ?? [];
  const symbols = instruments.map((i) => i.symbol);
  const weights = activePortfolio ? getPortfolioWeights(activePortfolio) : [];

  const { metrics, isLoading } = useMetrics(symbols, weights);

  if (!activePortfolio || instruments.length === 0) return null;

  // Piecewise linear gauge: center (neutral) maps to 40% of the bar.
  // [min, center] → [0%, 40%]  and  [center, max] → [40%, 100%]
  // This ensures extreme negative values stay visible (not clamped at 2%)
  // while neutral (0) sits at a natural "below-average" position.
  const metricConfigs = [
    {
      key: 'sharpeRatio',
      name: t('metrics.sharpeRatio'),
      tooltip: t('metrics.sharpeRatioTooltip'),
      value: metrics?.sharpeRatio ?? null,
      min: -8,
      max: 3,
      center: 0,
    },
    {
      key: 'beta',
      name: t('metrics.beta'),
      tooltip: t('metrics.betaTooltip'),
      value: metrics?.beta ?? null,
      min: 0,
      max: 2,
      center: 1,
    },
    {
      key: 'alpha',
      name: t('metrics.alpha'),
      tooltip: t('metrics.alphaTooltip'),
      value: metrics?.alpha ?? null,
      min: -120,
      max: 40,
      center: 0,
      format: (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`,
    },
    {
      key: 'sortinoRatio',
      name: t('metrics.sortinoRatio'),
      tooltip: t('metrics.sortinoRatioTooltip'),
      value: metrics?.sortinoRatio ?? null,
      min: -8,
      max: 4,
      center: 0,
    },
    {
      key: 'treynorRatio',
      name: t('metrics.treynorRatio'),
      tooltip: t('metrics.treynorRatioTooltip'),
      value: metrics?.treynorRatio ?? null,
      min: -1,
      max: 0.5,
      center: 0,
    },
    {
      key: 'calmarRatio',
      name: t('metrics.calmarRatio'),
      tooltip: t('metrics.calmarRatioTooltip'),
      value: metrics?.calmarRatio ?? null,
      min: -3,
      max: 3,
      center: 0,
      format: (v: number) => v.toFixed(2),
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">
        {t('metrics.title')}
      </h2>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          {metricConfigs.map((config) => (
            <MetricGauge
              key={config.key}
              name={config.name}
              value={config.value}
              tooltip={config.tooltip}
              min={config.min}
              max={config.max}
              center={config.center}
              format={config.format}
            />
          ))}
        </div>
      )}
    </div>
  );
}
