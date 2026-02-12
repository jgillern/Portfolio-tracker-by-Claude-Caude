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

  const metricConfigs = [
    {
      key: 'peRatio',
      name: t('metrics.peRatio'),
      tooltip: t('metrics.peRatioTooltip'),
      value: metrics?.peRatio ?? null,
      min: 0,
      max: 50,
      invertScale: true,
      format: (v: number) => v.toFixed(1),
    },
    {
      key: 'sharpeRatio',
      name: t('metrics.sharpeRatio'),
      tooltip: t('metrics.sharpeRatioTooltip'),
      value: metrics?.sharpeRatio ?? null,
      min: -1,
      max: 3,
    },
    {
      key: 'beta',
      name: t('metrics.beta'),
      tooltip: t('metrics.betaTooltip'),
      value: metrics?.beta ?? null,
      min: 0,
      max: 2,
      invertScale: true,
    },
    {
      key: 'alpha',
      name: t('metrics.alpha'),
      tooltip: t('metrics.alphaTooltip'),
      value: metrics?.alpha ?? null,
      min: -10,
      max: 10,
      format: (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`,
    },
    {
      key: 'sortinoRatio',
      name: t('metrics.sortinoRatio'),
      tooltip: t('metrics.sortinoRatioTooltip'),
      value: metrics?.sortinoRatio ?? null,
      min: -1,
      max: 3,
    },
    {
      key: 'treynorRatio',
      name: t('metrics.treynorRatio'),
      tooltip: t('metrics.treynorRatioTooltip'),
      value: metrics?.treynorRatio ?? null,
      min: -0.1,
      max: 0.3,
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
              format={config.format}
              invertScale={config.invertScale}
            />
          ))}
        </div>
      )}
    </div>
  );
}
