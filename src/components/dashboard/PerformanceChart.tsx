'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { useChart } from '@/hooks/useChart';
import { TimePeriod } from '@/types/market';
import { TimePeriodSelector } from './TimePeriodSelector';
import { Spinner } from '@/components/ui/Spinner';
import { getPortfolioWeights } from '@/lib/utils';

const DATE_LOCALE_MAP: Record<string, string> = {
  en: 'en-US',
  cs: 'cs-CZ',
  sk: 'sk-SK',
  uk: 'uk-UA',
  zh: 'zh-CN',
  mn: 'mn-MN',
};

interface Props {
  refreshSignal?: number;
}

export function PerformanceChart({ refreshSignal }: Props) {
  const { t, locale } = useLanguage();
  const { activePortfolio } = usePortfolio();
  const [period, setPeriod] = useState<TimePeriod>('1mo');

  const symbols = activePortfolio?.instruments.map((i) => i.symbol) ?? [];
  const weights = activePortfolio
    ? getPortfolioWeights(activePortfolio)
    : [];

  const { data, isLoading, refetch } = useChart(symbols, period, weights);

  // Refetch chart when refreshSignal changes (manual refresh from parent)
  const prevSignal = useRef(refreshSignal);
  useEffect(() => {
    if (refreshSignal !== undefined && refreshSignal !== prevSignal.current) {
      prevSignal.current = refreshSignal;
      refetch();
    }
  }, [refreshSignal, refetch]);

  const chartData = data.map((d) => ({
    time: d.timestamp,
    value: d.value,
  }));

  const dateLocale = DATE_LOCALE_MAP[locale] || 'en-US';

  const formatTime = (ts: number) => {
    const date = new Date(ts);
    if (period === '1d') {
      return date.toLocaleTimeString(dateLocale, {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return date.toLocaleDateString(dateLocale, {
      month: 'short',
      day: 'numeric',
    });
  };

  const isPositive = chartData.length > 1 && chartData[chartData.length - 1].value >= chartData[0].value;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('dashboard.performance')}
        </h2>
        <TimePeriodSelector selected={period} onChange={setPeriod} />
      </div>

      {symbols.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
          {t('dashboard.noInstruments')}
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Spinner className="h-8 w-8" />
        </div>
      ) : (
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis
                dataKey="time"
                tickFormatter={formatTime}
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                domain={['auto', 'auto']}
                tickFormatter={(v: number) => v.toFixed(1)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--background, #fff)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelFormatter={(label) => formatTime(Number(label))}
                formatter={(value) => [Number(value).toFixed(2), 'Value']}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={isPositive ? '#10B981' : '#EF4444'}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
