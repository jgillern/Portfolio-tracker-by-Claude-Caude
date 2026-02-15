'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { useLanguage } from '@/context/LanguageContext';
import { TimePeriod, ChartDataPoint } from '@/types/market';
import { TimePeriodSelector } from '@/components/dashboard/TimePeriodSelector';
import { Spinner } from '@/components/ui/Spinner';
import { InstrumentSearch } from '@/components/portfolio/InstrumentSearch';
import { MARKET_INDEXES, DEFAULT_ENABLED_INDEXES } from '@/lib/indexConstants';
import { cn } from '@/lib/utils';

const DATE_LOCALE_MAP: Record<string, string> = {
  en: 'en-US', cs: 'cs-CZ', sk: 'sk-SK', uk: 'uk-UA', zh: 'zh-CN', mn: 'mn-MN',
};

const INDEX_COLORS: Record<string, string> = {
  '^GSPC': '#3B82F6',
  '^IXIC': '#8B5CF6',
  'URTH': '#10B981',
  'EEM': '#F59E0B',
  'ACWI': '#EC4899',
};

const CUSTOM_COLORS = ['#F97316', '#14B8A6', '#6366F1', '#EF4444', '#84CC16'];

interface CustomIndex {
  symbol: string;
  name: string;
}

export function MarketsChart() {
  const { t, locale } = useLanguage();
  const [period, setPeriod] = useState<TimePeriod>('1mo');
  const [enabledIndexes, setEnabledIndexes] = useState<Set<string>>(
    new Set(DEFAULT_ENABLED_INDEXES)
  );
  const [customIndexes, setCustomIndexes] = useState<CustomIndex[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [chartData, setChartData] = useState<Record<string, ChartDataPoint[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  // All symbols that need data (enabled predefined + custom)
  const activeSymbols = useMemo(() => {
    const syms = MARKET_INDEXES
      .filter((idx) => enabledIndexes.has(idx.symbol))
      .map((idx) => idx.symbol);
    return [...syms, ...customIndexes.map((c) => c.symbol)];
  }, [enabledIndexes, customIndexes]);

  // Track symbols that failed to load data
  const [failedSymbols, setFailedSymbols] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (activeSymbols.length === 0) {
      setChartData({});
      setFailedSymbols(new Set());
      return;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      const results: Record<string, ChartDataPoint[]> = {};
      const failed = new Set<string>();

      await Promise.allSettled(
        activeSymbols.map(async (symbol) => {
          try {
            const res = await fetch(
              `/api/chart?symbols=${encodeURIComponent(symbol)}&range=${period}`,
              { signal: controller.signal }
            );
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data) && data.length > 0) {
                results[symbol] = data;
              } else {
                failed.add(symbol);
              }
            } else {
              failed.add(symbol);
            }
          } catch (err) {
            if ((err as Error).name !== 'AbortError') {
              failed.add(symbol);
            }
          }
        })
      );

      if (!controller.signal.aborted) {
        setChartData(results);
        setFailedSymbols(failed);
        setIsLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [activeSymbols.join(','), period]);

  const toggleIndex = (symbol: string) => {
    setEnabledIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(symbol)) {
        next.delete(symbol);
      } else {
        next.add(symbol);
      }
      return next;
    });
  };

  const handleAddCustom = (result: { symbol: string; name: string }) => {
    if (customIndexes.some((c) => c.symbol === result.symbol)) return;
    setCustomIndexes([...customIndexes, { symbol: result.symbol, name: result.name }]);
    setShowSearch(false);
  };

  const handleRemoveCustom = (symbol: string) => {
    setCustomIndexes(customIndexes.filter((c) => c.symbol !== symbol));
  };

  // Merge data
  const mergedChartData = useMemo(() => {
    const dataMap = new Map<number, Record<string, number | undefined>>();

    Object.entries(chartData).forEach(([symbol, data]) => {
      data.forEach((d) => {
        const existing = dataMap.get(d.timestamp) || { time: d.timestamp } as Record<string, number | undefined>;
        existing[symbol] = d.value - 100;
        existing.time = d.timestamp;
        dataMap.set(d.timestamp, existing);
      });
    });

    return Array.from(dataMap.values()).sort((a, b) => (a.time as number) - (b.time as number));
  }, [chartData]);

  const dateLocale = DATE_LOCALE_MAP[locale] || 'en-US';

  const formatTime = (ts: number) => {
    const date = new Date(ts);
    if (period === '1d') {
      return date.toLocaleTimeString(dateLocale, { hour: '2-digit', minute: '2-digit' });
    }
    if (period === 'max' || period === '5y') {
      return date.toLocaleDateString(dateLocale, { month: 'short', year: '2-digit' });
    }
    return date.toLocaleDateString(dateLocale, { month: 'short', day: 'numeric' });
  };

  const getColor = (symbol: string) => {
    if (INDEX_COLORS[symbol]) return INDEX_COLORS[symbol];
    const idx = customIndexes.findIndex((c) => c.symbol === symbol);
    return CUSTOM_COLORS[idx % CUSTOM_COLORS.length];
  };

  const getName = (symbol: string) => {
    const idx = MARKET_INDEXES.find((i) => i.symbol === symbol);
    if (idx) return idx.shortName;
    const custom = customIndexes.find((c) => c.symbol === symbol);
    return custom?.name || symbol;
  };

  const existingSymbols = [
    ...MARKET_INDEXES.map((i) => i.symbol),
    ...customIndexes.map((c) => c.symbol),
  ];

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('markets.indexPerformance')}
        </h2>
        <TimePeriodSelector selected={period} onChange={setPeriod} />
      </div>

      {/* Index toggle buttons */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {MARKET_INDEXES.map((index) => {
          const isEnabled = enabledIndexes.has(index.symbol);
          return (
            <button
              key={index.symbol}
              onClick={() => toggleIndex(index.symbol)}
              className={cn(
                'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                isEnabled
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 opacity-60'
              )}
            >
              <div
                className={cn('w-3 h-3 rounded-full transition-opacity', !isEnabled && 'opacity-30')}
                style={{ backgroundColor: INDEX_COLORS[index.symbol] }}
              />
              {index.shortName}
            </button>
          );
        })}

        {/* Custom indexes */}
        {customIndexes.map((ci) => {
          const hasFailed = failedSymbols.has(ci.symbol);
          return (
            <div
              key={ci.symbol}
              className={cn(
                'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium',
                hasFailed
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              )}
              title={hasFailed ? t('markets.noDataAvailable') : ci.name}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: hasFailed ? '#9CA3AF' : getColor(ci.symbol) }} />
              <span>{ci.symbol}</span>
              {hasFailed && (
                <span className="text-xs opacity-70">({t('markets.noData')})</span>
              )}
              <button
                onClick={() => handleRemoveCustom(ci.symbol)}
                className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}

        {/* Add custom index */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('markets.addIndex')}
        </button>
      </div>

      {/* Search */}
      {showSearch && (
        <div className="mb-4">
          <InstrumentSearch
            onSelect={handleAddCustom}
            existingSymbols={existingSymbols}
            searchMode="index"
            placeholder={t('markets.searchIndexPlaceholder')}
          />
        </div>
      )}

      {/* Chart */}
      {activeSymbols.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
          {t('markets.enableIndex')}
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Spinner className="h-8 w-8" />
        </div>
      ) : (
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mergedChartData} margin={{ right: 60 }}>
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
                domain={[(min: number) => Math.min(min, 0), (max: number) => Math.max(max, 0)]}
                tickFormatter={(v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--background, #fff)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelFormatter={(label) => formatTime(Number(label))}
                formatter={(value: any, name?: string) => {
                  const displayName = getName(name || '');
                  const v = Number(value);
                  return [`${v >= 0 ? '+' : ''}${v.toFixed(2)}%`, displayName];
                }}
              />
              <ReferenceLine y={0} stroke="#6B7280" strokeDasharray="3 3" opacity={0.5} />
              {activeSymbols.filter((s) => chartData[s]?.length > 0).map((symbol) => (
                <Line
                  key={symbol}
                  type="monotone"
                  dataKey={symbol}
                  stroke={getColor(symbol)}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  connectNulls={true}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
