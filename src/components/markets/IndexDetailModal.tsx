'use client';

import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useLanguage } from '@/context/LanguageContext';
import { Spinner } from '@/components/ui/Spinner';
import { cn, formatCurrency } from '@/lib/utils';
import type { Quote, TimePeriod, ChartDataPoint } from '@/types/market';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  symbol: string | null;
  quote: Quote | null;
}

interface IndexProfile {
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  description: string | null;
  localizedDescription: string | null;
  keyStats: {
    fiftyTwoWeekHigh: number | null;
    fiftyTwoWeekLow: number | null;
    fiftyDayAverage: number | null;
    twoHundredDayAverage: number | null;
    averageVolume: number | null;
  };
}

const CHART_PERIODS: { key: TimePeriod; label: string }[] = [
  { key: '1mo', label: '1M' },
  { key: '1y', label: '1Y' },
  { key: '5y', label: '5Y' },
  { key: 'max', label: 'MAX' },
];

function fmtBigNum(v: number | null | undefined): string {
  if (v == null) return '—';
  const abs = Math.abs(v);
  if (abs >= 1e12) return `${(v / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${(v / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${(v / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
  return v.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

export function IndexDetailModal({ isOpen, onClose, symbol, quote }: Props) {
  const { t, locale } = useLanguage();
  const [profile, setProfile] = useState<IndexProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<TimePeriod>('1y');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (!isOpen || !symbol) return;
    setIsLoading(true);
    setShowMore(false);
    fetch(`/api/profile?symbol=${encodeURIComponent(symbol)}&lang=${locale}`)
      .then((r) => r.json())
      .then((d) => setProfile(d))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [isOpen, symbol, locale]);

  useEffect(() => {
    if (!isOpen || !symbol) return;
    setChartLoading(true);
    fetch(`/api/chart?symbols=${encodeURIComponent(symbol)}&period=${chartPeriod}`)
      .then((r) => r.json())
      .then((d) => setChartData(Array.isArray(d) ? d : []))
      .catch(() => setChartData([]))
      .finally(() => setChartLoading(false));
  }, [isOpen, symbol, chartPeriod]);

  if (!isOpen || !symbol) return null;

  const price = quote?.price ?? 0;
  const currency = quote?.currency || profile?.currency || 'USD';
  const name = profile?.name || quote?.name || symbol;
  const desc = profile?.localizedDescription || profile?.description;
  const ks = profile?.keyStats;

  const fiftyTwoHigh = ks?.fiftyTwoWeekHigh;
  const fiftyTwoLow = ks?.fiftyTwoWeekLow;
  const rangePercent = fiftyTwoHigh && fiftyTwoLow && fiftyTwoHigh !== fiftyTwoLow
    ? ((price - fiftyTwoLow) / (fiftyTwoHigh - fiftyTwoLow)) * 100
    : 50;

  const performancePills = [
    { label: '1W', value: quote?.change1w },
    { label: '1M', value: quote?.change1m },
    { label: '1Y', value: quote?.change1y },
    { label: 'YTD', value: quote?.changeYtd },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner className="h-8 w-8" />
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{name}</h2>
                    <p className="text-sm text-gray-500">{symbol} · {profile?.exchange}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(price, currency)}
                  </span>
                  {quote?.change24h != null && (
                    <span className={cn(
                      'ml-2 text-sm font-semibold',
                      quote.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                    )}>
                      {quote.change24h >= 0 ? '+' : ''}{quote.change24h.toFixed(2)}%
                    </span>
                  )}
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Performance pills */}
            <div className="flex gap-2 flex-wrap">
              {performancePills.map(({ label, value }) => {
                if (value == null || value === 0) return null;
                const positive = value >= 0;
                return (
                  <span
                    key={label}
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-semibold',
                      positive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    )}
                  >
                    {label}: {positive ? '+' : ''}{value.toFixed(2)}%
                  </span>
                );
              })}
            </div>

            {/* 52-Week Range */}
            {fiftyTwoLow != null && fiftyTwoHigh != null && (
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{formatCurrency(fiftyTwoLow, currency)}</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">52W Range</span>
                  <span>{formatCurrency(fiftyTwoHigh, currency)}</span>
                </div>
                <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full border-2 border-white dark:border-gray-800 shadow"
                    style={{ left: `${Math.min(Math.max(rangePercent, 0), 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Description */}
            {desc && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{t('profile.about')}</h3>
                <p className={cn('text-sm text-gray-600 dark:text-gray-400 leading-relaxed', !showMore && 'line-clamp-3')}>
                  {desc}
                </p>
                {desc.length > 200 && (
                  <button onClick={() => setShowMore(!showMore)} className="text-xs text-blue-600 hover:underline mt-1">
                    {showMore ? t('profile.showLess') : t('profile.showMore')}
                  </button>
                )}
              </div>
            )}

            {/* Key stats grid */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{t('profile.keyStatistics')}</h3>
              <div className="grid grid-cols-2 gap-3">
                <StatCard label={t('profile.sma50')} value={ks?.fiftyDayAverage != null ? formatCurrency(ks.fiftyDayAverage, currency) : '—'} />
                <StatCard label={t('profile.sma200')} value={ks?.twoHundredDayAverage != null ? formatCurrency(ks.twoHundredDayAverage, currency) : '—'} />
                <StatCard label={t('profile.volume')} value={fmtBigNum(ks?.averageVolume)} />
                <StatCard label="24h" value={quote?.change24h != null ? `${quote.change24h >= 0 ? '+' : ''}${quote.change24h.toFixed(2)}%` : '—'} />
              </div>
            </div>

            {/* Chart */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t('dashboard.performance')}</h3>
                <div className="flex gap-1">
                  {CHART_PERIODS.map((p) => (
                    <button
                      key={p.key}
                      onClick={() => setChartPeriod(p.key)}
                      className={cn(
                        'px-2 py-1 text-xs rounded-md font-medium transition-colors',
                        chartPeriod === p.key
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-48">
                {chartLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Spinner className="h-6 w-6" />
                  </div>
                ) : chartData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-sm text-gray-400">
                    {t('errors.fetchFailed')}
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.15} vertical={false} />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(ts: number) =>
                          new Date(ts).toLocaleDateString(locale === 'cs' ? 'cs-CZ' : 'en-US', { month: 'short', year: '2-digit' })
                        }
                        tick={{ fontSize: 10, fill: '#9CA3AF' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: '#9CA3AF' }}
                        axisLine={false}
                        tickLine={false}
                        width={40}
                        tickFormatter={(v: number) => v.toFixed(0)}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(17,24,39,0.9)',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '12px',
                          color: '#fff',
                        }}
                        labelFormatter={(ts: any) =>
                          new Date(Number(ts)).toLocaleDateString(locale === 'cs' ? 'cs-CZ' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                        }
                        formatter={(value: any) => [Number(value).toFixed(2), name]}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
      <div className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{value}</div>
    </div>
  );
}
