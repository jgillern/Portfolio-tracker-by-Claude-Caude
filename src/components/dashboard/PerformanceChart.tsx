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
  Label,
} from 'recharts';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { useChart } from '@/hooks/useChart';
import { TimePeriod, ChartDataPoint } from '@/types/market';
import { TimePeriodSelector } from './TimePeriodSelector';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { InstrumentSearch } from '@/components/portfolio/InstrumentSearch';
import { getPortfolioWeights } from '@/lib/utils';
import { InstrumentType } from '@/types/portfolio';

const DATE_LOCALE_MAP: Record<string, string> = {
  en: 'en-US',
  cs: 'cs-CZ',
  sk: 'sk-SK',
  uk: 'uk-UA',
  zh: 'zh-CN',
  mn: 'mn-MN',
};

const COMPARISON_COLORS = ['#8B5CF6', '#F59E0B', '#EC4899', '#14B8A6', '#F97316'];

interface ComparisonInstrument {
  symbol: string;
  name: string;
  type: InstrumentType;
}

interface Props {
  refreshSignal?: number;
}

export function PerformanceChart({ refreshSignal }: Props) {
  const { t, locale } = useLanguage();
  const { activePortfolio } = usePortfolio();
  const [period, setPeriod] = useState<TimePeriod>('1mo');
  const [comparisonInstruments, setComparisonInstruments] = useState<ComparisonInstrument[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  const symbols = activePortfolio?.instruments.map((i) => i.symbol) ?? [];
  const weights = activePortfolio
    ? getPortfolioWeights(activePortfolio)
    : [];

  const { data: portfolioData, isLoading: portfolioLoading, refetch } = useChart(symbols, period, weights);

  // Fetch comparison data
  const [comparisonData, setComparisonData] = useState<Record<string, ChartDataPoint[]>>({});
  const [comparisonLoading, setComparisonLoading] = useState(false);

  useEffect(() => {
    if (comparisonInstruments.length === 0) {
      setComparisonData({});
      return;
    }

    const fetchComparisonData = async () => {
      setComparisonLoading(true);
      const results: Record<string, ChartDataPoint[]> = {};

      for (const instrument of comparisonInstruments) {
        try {
          const res = await fetch(`/api/chart?symbols=${instrument.symbol}&range=${period}`);
          if (res.ok) {
            const data = await res.json();
            results[instrument.symbol] = data;
          }
        } catch (err) {
          console.error(`Failed to fetch data for ${instrument.symbol}`, err);
        }
      }

      setComparisonData(results);
      setComparisonLoading(false);
    };

    fetchComparisonData();
  }, [comparisonInstruments, period]);

  // Refetch chart when refreshSignal changes (manual refresh from parent)
  const prevSignal = useRef(refreshSignal);
  useEffect(() => {
    if (refreshSignal !== undefined && refreshSignal !== prevSignal.current) {
      prevSignal.current = refreshSignal;
      refetch();
    }
  }, [refreshSignal, refetch]);

  const handleAddComparison = (result: any) => {
    if (comparisonInstruments.some(i => i.symbol === result.symbol)) {
      return;
    }
    setComparisonInstruments([...comparisonInstruments, {
      symbol: result.symbol,
      name: result.name,
      type: result.type,
    }]);
    setShowSearch(false);
  };

  const handleRemoveComparison = (symbol: string) => {
    setComparisonInstruments(comparisonInstruments.filter(i => i.symbol !== symbol));
  };

  // Merge all data into single chart dataset
  const mergedChartData = React.useMemo(() => {
    if (portfolioData.length === 0) return [];

    const dataMap = new Map<number, any>();

    // Add portfolio data
    portfolioData.forEach((d) => {
      dataMap.set(d.timestamp, { time: d.timestamp, portfolio: d.value });
    });

    // Add comparison data
    Object.entries(comparisonData).forEach(([symbol, data]) => {
      data.forEach((d) => {
        const existing = dataMap.get(d.timestamp) || { time: d.timestamp };
        existing[symbol] = d.value;
        dataMap.set(d.timestamp, existing);
      });
    });

    return Array.from(dataMap.values()).sort((a, b) => a.time - b.time);
  }, [portfolioData, comparisonData]);

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

  // Calculate performance percentages
  const calculatePerformance = (data: any[], key: string) => {
    const values = data.filter(d => d[key] != null).map(d => d[key]);
    if (values.length < 2) return null;
    const first = values[0];
    const last = values[values.length - 1];
    return ((last - first) / first) * 100;
  };

  const portfolioPerformance = calculatePerformance(mergedChartData, 'portfolio');
  const isPositive = portfolioPerformance !== null && portfolioPerformance >= 0;

  const isLoading = portfolioLoading || comparisonLoading;

  const CustomDot = ({ cx, cy, payload, dataKey }: any) => {
    const values = mergedChartData.filter(d => d[dataKey] != null).map(d => d[dataKey]);
    const isLast = payload[dataKey] === values[values.length - 1];

    if (!isLast) return null;

    const perf = calculatePerformance(mergedChartData, dataKey);
    if (perf === null) return null;

    // Calculate vertical offset to prevent text overlap
    const allKeys = ['portfolio', ...comparisonInstruments.map(i => i.symbol)];
    const keyIndex = allKeys.indexOf(dataKey);
    const verticalOffset = keyIndex * 16; // 16px spacing between labels

    const color = dataKey === 'portfolio'
      ? (isPositive ? '#10B981' : '#EF4444')
      : COMPARISON_COLORS[comparisonInstruments.findIndex(i => i.symbol === dataKey) % COMPARISON_COLORS.length];

    return (
      <g>
        <circle cx={cx} cy={cy} r={4} fill={color} />
        <text
          x={cx + 8}
          y={cy + 4 - verticalOffset}
          fill={color}
          fontSize={11}
          fontWeight="600"
        >
          {perf >= 0 ? '+' : ''}{perf.toFixed(2)}%
        </text>
      </g>
    );
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('dashboard.performance')}
        </h2>
        <TimePeriodSelector selected={period} onChange={setPeriod} />
      </div>

      {/* Comparison instruments */}
      {(comparisonInstruments.length > 0 || symbols.length > 0) && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {symbols.length > 0 && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: isPositive ? '#10B981' : '#EF4444' }} />
              {t('dashboard.portfolio')}
            </div>
          )}
          {comparisonInstruments.map((instrument, idx) => (
            <div
              key={instrument.symbol}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COMPARISON_COLORS[idx % COMPARISON_COLORS.length] }} />
              <span>{instrument.symbol}</span>
              <button
                onClick={() => handleRemoveComparison(instrument.symbol)}
                className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          {comparisonInstruments.length < 5 && (
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('dashboard.compare')}
            </button>
          )}
        </div>
      )}

      {/* Search dropdown */}
      {showSearch && (
        <div className="mb-4 relative">
          <InstrumentSearch
            onSelect={handleAddComparison}
            existingSymbols={[...symbols, ...comparisonInstruments.map(i => i.symbol)]}
          />
        </div>
      )}

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
                formatter={(value: any, name?: string) => {
                  const displayName = name === 'portfolio' ? t('dashboard.portfolio') : (name || '');
                  return [Number(value).toFixed(2), displayName];
                }}
              />
              <Line
                type="monotone"
                dataKey="portfolio"
                stroke={isPositive ? '#10B981' : '#EF4444'}
                strokeWidth={2}
                dot={<CustomDot dataKey="portfolio" />}
                activeDot={{ r: 4 }}
                connectNulls={true}
              />
              {comparisonInstruments.map((instrument, idx) => (
                <Line
                  key={instrument.symbol}
                  type="monotone"
                  dataKey={instrument.symbol}
                  stroke={COMPARISON_COLORS[idx % COMPARISON_COLORS.length]}
                  strokeWidth={2}
                  dot={<CustomDot dataKey={instrument.symbol} />}
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
