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
  ReferenceLine,
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
import { COMPARISON_INDEXES } from '@/lib/indexConstants';

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
  const [failedComparisons, setFailedComparisons] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (comparisonInstruments.length === 0) {
      setComparisonData({});
      setFailedComparisons(new Set());
      return;
    }

    const controller = new AbortController();

    const fetchComparisonData = async () => {
      setComparisonLoading(true);
      const results: Record<string, ChartDataPoint[]> = {};
      const failed = new Set<string>();

      await Promise.allSettled(
        comparisonInstruments.map(async (instrument) => {
          try {
            const res = await fetch(
              `/api/chart?symbols=${encodeURIComponent(instrument.symbol)}&range=${period}`,
              { signal: controller.signal }
            );
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data) && data.length > 0) {
                results[instrument.symbol] = data;
              } else {
                failed.add(instrument.symbol);
              }
            } else {
              failed.add(instrument.symbol);
            }
          } catch (err) {
            if ((err as Error).name !== 'AbortError') {
              failed.add(instrument.symbol);
            }
          }
        })
      );

      if (!controller.signal.aborted) {
        setComparisonData(results);
        setFailedComparisons(failed);
        setComparisonLoading(false);
      }
    };

    fetchComparisonData();
    return () => controller.abort();
  }, [comparisonInstruments, period]);

  // Refetch chart when refreshSignal changes (manual refresh from parent)
  const prevSignal = useRef(refreshSignal);
  useEffect(() => {
    if (refreshSignal !== undefined && refreshSignal !== prevSignal.current) {
      prevSignal.current = refreshSignal;
      refetch();
    }
  }, [refreshSignal, refetch]);

  const [validating, setValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAddComparison = async (result: any) => {
    if (comparisonInstruments.some(i => i.symbol === result.symbol)) {
      return;
    }

    // Pre-built comparison indexes are known to work — skip validation
    const isPrebuilt = COMPARISON_INDEXES.some(idx => idx.symbol === result.symbol);
    if (isPrebuilt) {
      setComparisonInstruments([...comparisonInstruments, {
        symbol: result.symbol,
        name: result.name,
        type: result.type,
      }]);
      setShowSearch(false);
      return;
    }

    // Validate that Yahoo Finance has data for this symbol
    setValidating(true);
    setValidationError(null);
    try {
      const res = await fetch(`/api/quote?symbols=${encodeURIComponent(result.symbol)}`);
      if (res.ok) {
        const quotes = await res.json();
        if (Array.isArray(quotes) && quotes.length > 0) {
          setComparisonInstruments([...comparisonInstruments, {
            symbol: result.symbol,
            name: result.name,
            type: result.type,
          }]);
          setShowSearch(false);
          setValidationError(null);
        } else {
          setValidationError(t('markets.noDataAvailable'));
        }
      } else {
        setValidationError(t('markets.noDataAvailable'));
      }
    } catch {
      setValidationError(t('markets.noDataAvailable'));
    } finally {
      setValidating(false);
    }
  };

  const handleRemoveComparison = (symbol: string) => {
    setComparisonInstruments(comparisonInstruments.filter(i => i.symbol !== symbol));
  };

  // Merge all data into single chart dataset
  const mergedChartData = React.useMemo(() => {
    if (portfolioData.length === 0) return [];

    const dataMap = new Map<number, any>();

    // Add portfolio data (convert from index-100 to percentage change)
    portfolioData.forEach((d) => {
      dataMap.set(d.timestamp, { time: d.timestamp, portfolio: d.value - 100 });
    });

    // Trim comparison data to portfolio time range so longer-history instruments
    // (e.g. S&P 500 from 1985) don't stretch the chart beyond the portfolio start
    const portfolioStart = portfolioData[0].timestamp;

    // Add comparison data (convert from index-100 to percentage change)
    Object.entries(comparisonData).forEach(([symbol, data]) => {
      // Find data points within portfolio range, re-normalize from portfolio start
      const trimmed = data.filter((d) => d.timestamp >= portfolioStart);
      if (trimmed.length === 0) return;

      // Re-normalize: the first point after trim becomes the new base (0%)
      const baseValue = trimmed[0].value;

      trimmed.forEach((d) => {
        const existing = dataMap.get(d.timestamp) || { time: d.timestamp };
        existing[symbol] = baseValue > 0 ? ((d.value / baseValue) * 100) - 100 : 0;
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
    if (period === 'max' || period === '5y') {
      return date.toLocaleDateString(dateLocale, {
        month: 'short',
        year: '2-digit',
      });
    }
    return date.toLocaleDateString(dateLocale, {
      month: 'short',
      day: 'numeric',
    });
  };

  // Get final performance percentage (data is already in % change from 0)
  const calculatePerformance = (data: any[], key: string) => {
    const values = data.filter(d => d[key] != null).map(d => d[key]);
    if (values.length < 2) return null;
    return values[values.length - 1];
  };

  const portfolioPerformance = calculatePerformance(mergedChartData, 'portfolio');
  const isPositive = portfolioPerformance !== null && portfolioPerformance >= 0;

  const isLoading = portfolioLoading || comparisonLoading;

  const CustomDot = ({ cx, cy, payload, dataKey }: any) => {
    // Find the last data point that has a value for this key (by timestamp, not value)
    const pointsWithData = mergedChartData.filter(d => d[dataKey] != null);
    if (pointsWithData.length === 0) return null;
    const lastPoint = pointsWithData[pointsWithData.length - 1];
    const isLast = payload.time === lastPoint.time;

    if (!isLast) return null;

    const perf = calculatePerformance(mergedChartData, dataKey);
    if (perf === null) return null;

    const color = dataKey === 'portfolio'
      ? (isPositive ? '#10B981' : '#EF4444')
      : COMPARISON_COLORS[comparisonInstruments.findIndex(i => i.symbol === dataKey) % COMPARISON_COLORS.length];

    return (
      <g>
        <circle cx={cx} cy={cy} r={4} fill={color} />
        <text
          x={cx + 8}
          y={cy + 4}
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
          {comparisonInstruments.map((instrument, idx) => {
            const hasFailed = failedComparisons.has(instrument.symbol);
            return (
            <div
              key={instrument.symbol}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                hasFailed
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: hasFailed ? '#9CA3AF' : COMPARISON_COLORS[idx % COMPARISON_COLORS.length] }} />
              <span>{COMPARISON_INDEXES.find(i => i.symbol === instrument.symbol)?.shortName || instrument.name}</span>
              {hasFailed && <span className="text-xs opacity-70">({t('markets.noData')})</span>}
              <button
                onClick={() => handleRemoveComparison(instrument.symbol)}
                className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
          })}
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

      {/* Search dropdown + index suggestions */}
      {showSearch && (
        <div className="mb-4 space-y-3">
          {validating && (
            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
              <Spinner className="h-4 w-4" />
              {t('markets.validatingIndex')}
            </div>
          )}
          {validationError && (
            <div className="text-sm text-red-600 dark:text-red-400">
              {validationError}
            </div>
          )}
          {/* Recommended indexes */}
          {(() => {
            const existingSet = new Set([...symbols, ...comparisonInstruments.map(i => i.symbol)]);
            const available = COMPARISON_INDEXES.filter(idx => !existingSet.has(idx.symbol));
            if (available.length === 0) return null;
            return (
              <div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{t('dashboard.suggestedIndexes')}</div>
                <div className="flex flex-wrap gap-1.5">
                  {available.map((idx) => (
                    <button
                      key={idx.symbol}
                      onClick={() => handleAddComparison({ symbol: idx.symbol, name: idx.name, type: 'etf' as InstrumentType, exchange: '' })}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 text-xs font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      {idx.shortName}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
          <InstrumentSearch
            onSelect={handleAddComparison}
            existingSymbols={[...symbols, ...comparisonInstruments.map(i => i.symbol)]}
            availableTypes={['index', 'stock', 'etf', 'crypto']}
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
                  let displayName: string;
                  if (name === 'portfolio') {
                    displayName = t('dashboard.portfolio');
                  } else {
                    const idx = COMPARISON_INDEXES.find(i => i.symbol === name);
                    const ci = comparisonInstruments.find(i => i.symbol === name);
                    displayName = idx?.shortName || ci?.name || name || '';
                  }
                  const v = Number(value);
                  return [`${v >= 0 ? '+' : ''}${v.toFixed(2)}%`, displayName];
                }}
              />
              <ReferenceLine y={0} stroke="#6B7280" strokeDasharray="3 3" opacity={0.5} />
              <Line
                type="monotone"
                dataKey="portfolio"
                stroke={isPositive ? '#10B981' : '#EF4444'}
                strokeWidth={2}
                dot={<CustomDot dataKey="portfolio" />}
                activeDot={{ r: 4 }}
                connectNulls={true}
              />
              {comparisonInstruments.filter((i) => comparisonData[i.symbol]?.length > 0).map((instrument, idx) => (
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
