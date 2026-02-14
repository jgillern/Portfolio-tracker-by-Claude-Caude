'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Modal } from '@/components/ui/Modal';
import { InstrumentLogo } from '@/components/ui/InstrumentLogo';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { useLanguage } from '@/context/LanguageContext';
import { Instrument } from '@/types/portfolio';
import { Quote } from '@/types/market';
import { formatCurrency, formatPercent, cn } from '@/lib/utils';

/* ---------- types for API response ---------- */
interface ProfileData {
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  marketCap: number | null;
  sector: string | null;
  industry: string | null;
  website: string | null;
  description: string | null;
  employees: number | null;
  country: string | null;
  financials: {
    currentPrice: number | null;
    targetHighPrice: number | null;
    targetLowPrice: number | null;
    targetMeanPrice: number | null;
    targetMedianPrice: number | null;
    recommendationKey: string | null;
    numberOfAnalystOpinions: number | null;
    totalRevenue: number | null;
    revenueGrowth: number | null;
    grossMargins: number | null;
    operatingMargins: number | null;
    profitMargins: number | null;
    ebitda: number | null;
    totalDebt: number | null;
    totalCash: number | null;
    freeCashflow: number | null;
    operatingCashflow: number | null;
    returnOnEquity: number | null;
    returnOnAssets: number | null;
    earningsGrowth: number | null;
    revenuePerShare: number | null;
    debtToEquity: number | null;
  };
  keyStats: {
    trailingPE: number | null;
    forwardPE: number | null;
    pegRatio: number | null;
    priceToBook: number | null;
    trailingEps: number | null;
    forwardEps: number | null;
    bookValue: number | null;
    beta: number | null;
    fiftyTwoWeekHigh: number | null;
    fiftyTwoWeekLow: number | null;
    fiftyDayAverage: number | null;
    twoHundredDayAverage: number | null;
    dividendYield: number | null;
    dividendRate: number | null;
    exDividendDate: string | null;
    payoutRatio: number | null;
    averageVolume: number | null;
    marketCap: number | null;
    enterpriseValue: number | null;
    sharesOutstanding: number | null;
    floatShares: number | null;
    shortRatio: number | null;
  };
  earningsHistory: { date: string; actual: number | null; estimate: number | null }[];
  revenueHistory: { date: string; revenue: number | null; earnings: number | null }[];
  earningsEstimates: {
    period: string;
    growth: number | null;
    earningsEstimateAvg: number | null;
    earningsEstimateLow: number | null;
    earningsEstimateHigh: number | null;
    revenueEstimateAvg: number | null;
  }[];
  analystTrend: {
    period: string;
    strongBuy: number;
    buy: number;
    hold: number;
    sell: number;
    strongSell: number;
  }[];
}

/* ---------- helpers ---------- */
function fmtNum(v: number | null | undefined, dec = 2): string {
  if (v == null) return '—';
  return v.toLocaleString('en-US', { maximumFractionDigits: dec });
}

function fmtPct(v: number | null | undefined): string {
  if (v == null) return '—';
  return `${(v * 100).toFixed(2)}%`;
}

function fmtBigNum(v: number | null | undefined): string {
  if (v == null) return '—';
  const abs = Math.abs(v);
  if (abs >= 1e12) return `${(v / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${(v / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${(v / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
  return v.toLocaleString('en-US');
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700/40 last:border-0">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-xs font-medium text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 mt-6 first:mt-0">
      {children}
    </h3>
  );
}

/* ---------- 52-week range bar ---------- */
function RangeBar({ low, high, current, currency }: { low: number; high: number; current: number; currency: string }) {
  const range = high - low;
  const pct = range > 0 ? ((current - low) / range) * 100 : 50;
  return (
    <div className="mt-3 mb-4">
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
        <span>{formatCurrency(low, currency)}</span>
        <span className="font-medium text-gray-700 dark:text-gray-300">52W Range</span>
        <span>{formatCurrency(high, currency)}</span>
      </div>
      <div className="relative h-2 rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="absolute h-2 rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400"
          style={{ width: '100%' }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white dark:bg-gray-900 border-2 border-blue-500 shadow"
          style={{ left: `${Math.min(Math.max(pct, 0), 100)}%`, transform: 'translate(-50%, -50%)' }}
        />
      </div>
    </div>
  );
}

/* ---------- Recommendation badge ---------- */
function RecBadge({ rec }: { rec: string | null }) {
  if (!rec) return null;
  const map: Record<string, { bg: string; label: string }> = {
    strong_buy: { bg: 'bg-green-600', label: 'Strong Buy' },
    buy: { bg: 'bg-green-500', label: 'Buy' },
    hold: { bg: 'bg-yellow-500', label: 'Hold' },
    underperform: { bg: 'bg-orange-500', label: 'Underperform' },
    sell: { bg: 'bg-red-500', label: 'Sell' },
  };
  const info = map[rec] || { bg: 'bg-gray-500', label: rec };
  return (
    <span className={`${info.bg} text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase`}>
      {info.label}
    </span>
  );
}

/* ---------- Price target visual ---------- */
function PriceTargetBar({ low, mean, high, current, currency }: {
  low: number; mean: number; high: number; current: number; currency: string;
}) {
  const min = Math.min(low, current) * 0.95;
  const max = Math.max(high, current) * 1.05;
  const range = max - min;
  const toPct = (v: number) => ((v - min) / range) * 100;

  return (
    <div className="mt-2 mb-1">
      <div className="relative h-6 rounded bg-gray-100 dark:bg-gray-700/50">
        {/* Range bar */}
        <div
          className="absolute h-full bg-blue-100 dark:bg-blue-900/30 rounded"
          style={{ left: `${toPct(low)}%`, width: `${toPct(high) - toPct(low)}%` }}
        />
        {/* Mean marker */}
        <div
          className="absolute top-0 h-full w-0.5 bg-blue-500"
          style={{ left: `${toPct(mean)}%` }}
        />
        {/* Current price marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-gray-900 dark:bg-white border border-white dark:border-gray-800 shadow z-10"
          style={{ left: `${toPct(current)}%`, transform: 'translate(-50%, -50%)' }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
        <span>Low: {formatCurrency(low, currency)}</span>
        <span>Avg: {formatCurrency(mean, currency)}</span>
        <span>High: {formatCurrency(high, currency)}</span>
      </div>
    </div>
  );
}

/* ========== MAIN COMPONENT ========== */

interface Props {
  isOpen: boolean;
  onClose: () => void;
  instrument: Instrument | null;
  quote: Quote | null;
}

export function InstrumentProfileModal({ isOpen, onClose, instrument, quote }: Props) {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  const fetchProfile = useCallback(async (symbol: string) => {
    setIsLoading(true);
    setProfile(null);
    setDescExpanded(false);
    try {
      const res = await fetch(`/api/profile?symbol=${encodeURIComponent(symbol)}`);
      if (!res.ok) throw new Error();
      const data: ProfileData = await res.json();
      setProfile(data);
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && instrument) {
      fetchProfile(instrument.symbol);
    }
  }, [isOpen, instrument?.symbol, fetchProfile]);

  if (!instrument) return null;

  const cur = profile?.currency || quote?.currency || 'USD';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={instrument.symbol}
      className="max-w-2xl max-h-[90vh] flex flex-col"
    >
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      ) : !profile ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
          {t('errors.fetchFailed')}
        </p>
      ) : (
        <div className="overflow-y-auto -mx-6 px-6 pb-2" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          {/* ── HEADER ── */}
          <div className="flex items-start gap-4 mb-4">
            <InstrumentLogo
              symbol={instrument.symbol}
              name={instrument.name}
              type={instrument.type}
              logoUrl={instrument.logoUrl}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                  {profile.name}
                </h3>
                <Badge type={instrument.type} label={t(`types.${instrument.type}`)} />
                <RecBadge rec={profile.financials.recommendationKey} />
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                {profile.exchange && <span>{profile.exchange}</span>}
                {profile.sector && (
                  <>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <span>{profile.sector}</span>
                  </>
                )}
                {profile.industry && (
                  <>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <span>{profile.industry}</span>
                  </>
                )}
                {profile.country && (
                  <>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <span>{profile.country}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── PRICE ROW ── */}
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(profile.financials.currentPrice ?? quote?.price ?? 0, cur)}
            </span>
            {quote && (
              <span
                className={cn(
                  'text-sm font-semibold',
                  quote.change24h >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                )}
              >
                {formatPercent(quote.change24h)}
              </span>
            )}
          </div>

          {/* 52-week range */}
          {profile.keyStats.fiftyTwoWeekLow != null && profile.keyStats.fiftyTwoWeekHigh != null && (
            <RangeBar
              low={profile.keyStats.fiftyTwoWeekLow}
              high={profile.keyStats.fiftyTwoWeekHigh}
              current={profile.financials.currentPrice ?? quote?.price ?? 0}
              currency={cur}
            />
          )}

          {/* ── PERFORMANCE PILLS ── */}
          {quote && (
            <div className="grid grid-cols-4 gap-2 mb-5">
              {[
                { label: t('dashboard.change1w'), value: quote.change1w },
                { label: t('dashboard.change1m'), value: quote.change1m },
                { label: t('dashboard.change1y'), value: quote.change1y },
                { label: t('dashboard.changeYtd'), value: quote.changeYtd },
              ].map((p) => (
                <div
                  key={p.label}
                  className="rounded-lg bg-gray-50 dark:bg-gray-700/30 p-2 text-center"
                >
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-medium">
                    {p.label}
                  </div>
                  <div
                    className={cn(
                      'text-sm font-semibold mt-0.5',
                      p.value > 0
                        ? 'text-green-600 dark:text-green-400'
                        : p.value < 0
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-500'
                    )}
                  >
                    {formatPercent(p.value)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── DESCRIPTION ── */}
          {profile.description && (
            <div className="mb-5">
              <SectionTitle>{t('profile.about')}</SectionTitle>
              <p
                className={cn(
                  'text-xs text-gray-600 dark:text-gray-300 leading-relaxed',
                  !descExpanded && 'line-clamp-3'
                )}
              >
                {profile.description}
              </p>
              {profile.description.length > 200 && (
                <button
                  className="text-xs text-blue-500 hover:text-blue-600 mt-1"
                  onClick={() => setDescExpanded(!descExpanded)}
                >
                  {descExpanded ? t('profile.showLess') : t('profile.showMore')}
                </button>
              )}
            </div>
          )}

          {/* ── KEY STATISTICS ── */}
          <SectionTitle>{t('profile.keyStatistics')}</SectionTitle>
          <div className="grid grid-cols-2 gap-x-6">
            <div>
              <StatRow label={t('profile.marketCap')} value={fmtBigNum(profile.keyStats.marketCap)} />
              <StatRow label={t('profile.pe')} value={fmtNum(profile.keyStats.trailingPE)} />
              <StatRow label={t('profile.forwardPE')} value={fmtNum(profile.keyStats.forwardPE)} />
              <StatRow label={t('profile.peg')} value={fmtNum(profile.keyStats.pegRatio)} />
              <StatRow label={t('profile.pb')} value={fmtNum(profile.keyStats.priceToBook)} />
              <StatRow label={t('profile.eps')} value={fmtNum(profile.keyStats.trailingEps)} />
              <StatRow label={t('profile.forwardEps')} value={fmtNum(profile.keyStats.forwardEps)} />
              <StatRow label="Beta" value={fmtNum(profile.keyStats.beta)} />
            </div>
            <div>
              <StatRow label={t('profile.divYield')} value={profile.keyStats.dividendYield != null ? fmtPct(profile.keyStats.dividendYield) : '—'} />
              <StatRow label={t('profile.volume')} value={fmtBigNum(profile.keyStats.averageVolume)} />
              <StatRow label={t('profile.shares')} value={fmtBigNum(profile.keyStats.sharesOutstanding)} />
              <StatRow label={t('profile.sma50')} value={profile.keyStats.fiftyDayAverage != null ? formatCurrency(profile.keyStats.fiftyDayAverage, cur) : '—'} />
              <StatRow label={t('profile.sma200')} value={profile.keyStats.twoHundredDayAverage != null ? formatCurrency(profile.keyStats.twoHundredDayAverage, cur) : '—'} />
              <StatRow label={t('profile.shortRatio')} value={fmtNum(profile.keyStats.shortRatio)} />
              <StatRow label={t('profile.ev')} value={fmtBigNum(profile.keyStats.enterpriseValue)} />
              <StatRow label={t('profile.bookValue')} value={fmtNum(profile.keyStats.bookValue)} />
            </div>
          </div>

          {/* ── FINANCIALS ── */}
          {(profile.financials.totalRevenue != null || profile.financials.profitMargins != null) && (
            <>
              <SectionTitle>{t('profile.financials')}</SectionTitle>
              <div className="grid grid-cols-2 gap-x-6">
                <div>
                  <StatRow label={t('profile.revenue')} value={fmtBigNum(profile.financials.totalRevenue)} />
                  <StatRow label={t('profile.revenueGrowth')} value={profile.financials.revenueGrowth != null ? fmtPct(profile.financials.revenueGrowth) : '—'} />
                  <StatRow label={t('profile.grossMargin')} value={profile.financials.grossMargins != null ? fmtPct(profile.financials.grossMargins) : '—'} />
                  <StatRow label={t('profile.operatingMargin')} value={profile.financials.operatingMargins != null ? fmtPct(profile.financials.operatingMargins) : '—'} />
                  <StatRow label={t('profile.profitMargin')} value={profile.financials.profitMargins != null ? fmtPct(profile.financials.profitMargins) : '—'} />
                  <StatRow label="EBITDA" value={fmtBigNum(profile.financials.ebitda)} />
                </div>
                <div>
                  <StatRow label={t('profile.roe')} value={profile.financials.returnOnEquity != null ? fmtPct(profile.financials.returnOnEquity) : '—'} />
                  <StatRow label={t('profile.roa')} value={profile.financials.returnOnAssets != null ? fmtPct(profile.financials.returnOnAssets) : '—'} />
                  <StatRow label={t('profile.fcf')} value={fmtBigNum(profile.financials.freeCashflow)} />
                  <StatRow label={t('profile.totalDebt')} value={fmtBigNum(profile.financials.totalDebt)} />
                  <StatRow label={t('profile.totalCash')} value={fmtBigNum(profile.financials.totalCash)} />
                  <StatRow label={t('profile.debtEquity')} value={fmtNum(profile.financials.debtToEquity)} />
                </div>
              </div>
            </>
          )}

          {/* ── REVENUE & EARNINGS CHART ── */}
          {profile.revenueHistory.length > 0 && (
            <>
              <SectionTitle>{t('profile.revenueEarnings')}</SectionTitle>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={profile.revenueHistory}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: '#9CA3AF' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#9CA3AF' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => fmtBigNum(v)}
                      width={50}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#F9FAFB',
                      }}
                      formatter={(value) => [fmtBigNum(value as number), '']}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '11px' }}
                    />
                    <Bar
                      dataKey="revenue"
                      name={t('profile.revenue')}
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="earnings"
                      name={t('profile.netIncome')}
                      radius={[4, 4, 0, 0]}
                    >
                      {profile.revenueHistory.map((entry, idx) => (
                        <Cell
                          key={idx}
                          fill={(entry.earnings ?? 0) >= 0 ? '#10B981' : '#EF4444'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {/* ── EARNINGS HISTORY (EPS actual vs estimate) ── */}
          {profile.earningsHistory.length > 0 && (
            <>
              <SectionTitle>{t('profile.earningsHistory')}</SectionTitle>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={profile.earningsHistory}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: '#9CA3AF' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#9CA3AF' }}
                      axisLine={false}
                      tickLine={false}
                      width={40}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#F9FAFB',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar
                      dataKey="estimate"
                      name={t('profile.estimate')}
                      fill="#9CA3AF"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="actual"
                      name={t('profile.actual')}
                      radius={[4, 4, 0, 0]}
                    >
                      {profile.earningsHistory.map((entry, idx) => (
                        <Cell
                          key={idx}
                          fill={
                            entry.actual != null && entry.estimate != null
                              ? entry.actual >= entry.estimate
                                ? '#10B981'
                                : '#EF4444'
                              : '#3B82F6'
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Beat/miss table */}
              <div className="grid grid-cols-4 gap-1 mt-2">
                {profile.earningsHistory.map((q) => {
                  const beat = q.actual != null && q.estimate != null ? q.actual >= q.estimate : null;
                  const surprise =
                    q.actual != null && q.estimate != null && q.estimate !== 0
                      ? ((q.actual - q.estimate) / Math.abs(q.estimate)) * 100
                      : null;
                  return (
                    <div key={q.date} className="text-center">
                      <div className="text-[10px] text-gray-500 dark:text-gray-400">{q.date}</div>
                      {beat !== null && (
                        <div
                          className={cn(
                            'text-[10px] font-bold',
                            beat ? 'text-green-500' : 'text-red-500'
                          )}
                        >
                          {beat ? 'BEAT' : 'MISS'}{' '}
                          {surprise != null && `${surprise > 0 ? '+' : ''}${surprise.toFixed(1)}%`}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ── EARNINGS ESTIMATES ── */}
          {profile.earningsEstimates.length > 0 && (
            <>
              <SectionTitle>{t('profile.earningsEstimates')}</SectionTitle>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-1.5 font-medium">{t('profile.period')}</th>
                      <th className="text-right py-1.5 font-medium">EPS Est.</th>
                      <th className="text-right py-1.5 font-medium">{t('profile.range')}</th>
                      <th className="text-right py-1.5 font-medium">{t('profile.growth')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.earningsEstimates.map((e) => (
                      <tr
                        key={e.period}
                        className="border-b border-gray-100 dark:border-gray-700/40"
                      >
                        <td className="py-1.5 text-gray-700 dark:text-gray-300">{e.period}</td>
                        <td className="py-1.5 text-right text-gray-900 dark:text-white font-medium">
                          {e.earningsEstimateAvg != null ? e.earningsEstimateAvg.toFixed(2) : '—'}
                        </td>
                        <td className="py-1.5 text-right text-gray-500 dark:text-gray-400">
                          {e.earningsEstimateLow != null && e.earningsEstimateHigh != null
                            ? `${e.earningsEstimateLow.toFixed(2)} – ${e.earningsEstimateHigh.toFixed(2)}`
                            : '—'}
                        </td>
                        <td
                          className={cn(
                            'py-1.5 text-right font-medium',
                            e.growth != null && e.growth >= 0
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          )}
                        >
                          {e.growth != null ? fmtPct(e.growth) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ── ANALYST RECOMMENDATIONS ── */}
          {profile.analystTrend.length > 0 && (
            <>
              <SectionTitle>{t('profile.analystRatings')}</SectionTitle>
              {/* Price target bar */}
              {profile.financials.targetLowPrice != null &&
                profile.financials.targetMeanPrice != null &&
                profile.financials.targetHighPrice != null && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {t('profile.priceTarget')}
                      </span>
                      {profile.financials.numberOfAnalystOpinions != null && (
                        <span className="text-[10px] text-gray-400">
                          ({profile.financials.numberOfAnalystOpinions} {t('profile.analysts')})
                        </span>
                      )}
                    </div>
                    <PriceTargetBar
                      low={profile.financials.targetLowPrice}
                      mean={profile.financials.targetMeanPrice}
                      high={profile.financials.targetHighPrice}
                      current={profile.financials.currentPrice ?? quote?.price ?? 0}
                      currency={cur}
                    />
                  </div>
                )}

              {/* Stacked horizontal bar for recommendations */}
              <div className="space-y-2">
                {profile.analystTrend.map((r) => {
                  const total = r.strongBuy + r.buy + r.hold + r.sell + r.strongSell;
                  if (total === 0) return null;
                  const segments = [
                    { key: 'strongBuy', count: r.strongBuy, color: 'bg-green-600', label: t('profile.strongBuy') },
                    { key: 'buy', count: r.buy, color: 'bg-green-400', label: t('profile.buy') },
                    { key: 'hold', count: r.hold, color: 'bg-yellow-400', label: t('profile.hold') },
                    { key: 'sell', count: r.sell, color: 'bg-orange-400', label: t('profile.sell') },
                    { key: 'strongSell', count: r.strongSell, color: 'bg-red-500', label: t('profile.strongSell') },
                  ].filter((s) => s.count > 0);
                  return (
                    <div key={r.period}>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">{r.period}</div>
                      <div className="flex h-5 rounded-full overflow-hidden">
                        {segments.map((seg) => (
                          <div
                            key={seg.key}
                            className={`${seg.color} flex items-center justify-center text-[9px] font-bold text-white`}
                            style={{ width: `${(seg.count / total) * 100}%` }}
                            title={`${seg.label}: ${seg.count}`}
                          >
                            {seg.count > 0 && (seg.count / total) * 100 > 8 ? seg.count : ''}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Legend */}
              <div className="flex gap-3 mt-2 flex-wrap">
                {[
                  { color: 'bg-green-600', label: t('profile.strongBuy') },
                  { color: 'bg-green-400', label: t('profile.buy') },
                  { color: 'bg-yellow-400', label: t('profile.hold') },
                  { color: 'bg-orange-400', label: t('profile.sell') },
                  { color: 'bg-red-500', label: t('profile.strongSell') },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">{item.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── COMPANY INFO FOOTER ── */}
          {(profile.website || profile.employees) && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-4 flex-wrap text-xs text-gray-500 dark:text-gray-400">
              {profile.employees && (
                <span>{t('profile.employees')}: {profile.employees.toLocaleString()}</span>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 truncate"
                >
                  {profile.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
