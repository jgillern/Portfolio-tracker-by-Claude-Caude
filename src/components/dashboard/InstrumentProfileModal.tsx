'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Cell,
  Legend,
} from 'recharts';
import { Modal } from '@/components/ui/Modal';
import { InstrumentLogo } from '@/components/ui/InstrumentLogo';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { useLanguage } from '@/context/LanguageContext';
import { Instrument } from '@/types/portfolio';
import { Quote } from '@/types/market';
import { formatCurrency, formatPercent, cn } from '@/lib/utils';

/* ---------- types ---------- */
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
  localizedDescription: string | null;
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

/* ---------- Tooltip wrapper ---------- */
function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex ml-1 cursor-help">
      <svg className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
      </svg>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-lg bg-gray-900 dark:bg-gray-700 text-white text-[11px] leading-snug px-3 py-2 shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-50">
        {text}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
      </span>
    </span>
  );
}

/* ---------- Stat card ---------- */
function StatCard({ label, value, tooltip, colored }: { label: string; value: string; tooltip?: string; colored?: boolean }) {
  const isNeg = colored && value.startsWith('-');
  const isPos = colored && !value.startsWith('-') && value !== '—' && value !== '0.00%';
  return (
    <div className="rounded-lg bg-gray-50 dark:bg-gray-700/20 border border-gray-100 dark:border-gray-700/40 px-3 py-2.5">
      <div className="flex items-center gap-0.5">
        <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{label}</span>
        {tooltip && <InfoTooltip text={tooltip} />}
      </div>
      <div className={cn(
        'text-sm font-semibold mt-1 truncate',
        colored && isPos && 'text-green-600 dark:text-green-400',
        colored && isNeg && 'text-red-600 dark:text-red-400',
        !colored && 'text-gray-900 dark:text-white',
        colored && !isPos && !isNeg && 'text-gray-900 dark:text-white',
      )}>
        {value}
      </div>
    </div>
  );
}

/* ---------- Section ---------- */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

/* ---------- 52-week range bar ---------- */
function RangeBar({ low, high, current, currency }: { low: number; high: number; current: number; currency: string }) {
  const range = high - low;
  const pct = range > 0 ? ((current - low) / range) * 100 : 50;
  return (
    <div className="mt-3 mb-4">
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
        <span>{formatCurrency(low, currency)}</span>
        <span className="font-medium text-gray-700 dark:text-gray-300">52W Range</span>
        <span>{formatCurrency(high, currency)}</span>
      </div>
      <div className="relative h-2.5 rounded-full bg-gray-200 dark:bg-gray-700">
        <div className="absolute h-full rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 w-full" />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white dark:bg-gray-900 border-2 border-blue-500 shadow-md"
          style={{ left: `${Math.min(Math.max(pct, 0), 100)}%`, transform: 'translate(-50%, -50%)' }}
        />
      </div>
    </div>
  );
}

/* ---------- Recommendation badge ---------- */
function RecBadge({ rec, t }: { rec: string | null; t: (k: string) => string }) {
  if (!rec) return null;
  const map: Record<string, { bg: string; key: string }> = {
    strong_buy: { bg: 'bg-green-600', key: 'profile.strongBuy' },
    buy: { bg: 'bg-green-500', key: 'profile.buy' },
    hold: { bg: 'bg-yellow-500', key: 'profile.hold' },
    underperform: { bg: 'bg-orange-500', key: 'profile.sell' },
    sell: { bg: 'bg-red-500', key: 'profile.sell' },
  };
  const info = map[rec];
  if (!info) return null;
  return (
    <span className={`${info.bg} text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide`}>
      {t(info.key)}
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
      <div className="relative h-7 rounded-lg bg-gray-100 dark:bg-gray-700/50">
        <div
          className="absolute h-full bg-blue-100 dark:bg-blue-900/30 rounded-lg"
          style={{ left: `${toPct(low)}%`, width: `${toPct(high) - toPct(low)}%` }}
        />
        <div className="absolute top-0 h-full w-0.5 bg-blue-500" style={{ left: `${toPct(mean)}%` }} />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gray-900 dark:bg-white border border-white dark:border-gray-800 shadow z-10"
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

/* ---------- Recharts tooltip style ---------- */
const chartTooltipStyle = {
  backgroundColor: '#1F2937',
  border: 'none',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#F9FAFB',
};

/* ========== MAIN COMPONENT ========== */

interface Props {
  isOpen: boolean;
  onClose: () => void;
  instrument: Instrument | null;
  quote: Quote | null;
}

export function InstrumentProfileModal({ isOpen, onClose, instrument, quote }: Props) {
  const { t, locale } = useLanguage();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  const fetchProfile = useCallback(async (symbol: string, lang: string) => {
    setIsLoading(true);
    setProfile(null);
    setDescExpanded(false);
    try {
      const res = await fetch(`/api/profile?symbol=${encodeURIComponent(symbol)}&lang=${lang}`);
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
      fetchProfile(instrument.symbol, locale);
    }
  }, [isOpen, instrument?.symbol, locale, fetchProfile]);

  if (!instrument) return null;

  const cur = profile?.currency || quote?.currency || 'USD';
  const desc = profile?.localizedDescription || profile?.description;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={instrument.symbol}
      className="max-w-4xl max-h-[90vh] flex flex-col"
    >
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : !profile ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
          {t('errors.fetchFailed')}
        </p>
      ) : (
        <div className="overflow-y-auto -mx-6 px-6 pb-4 custom-scrollbar" style={{ maxHeight: 'calc(90vh - 120px)' }}>
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
                <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                  {profile.name}
                </h3>
                <Badge type={instrument.type} label={t(`types.${instrument.type}`)} />
                <RecBadge rec={profile.financials.recommendationKey} t={t} />
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

          {/* ── PRICE + 24h ── */}
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(profile.financials.currentPrice ?? quote?.price ?? 0, cur)}
            </span>
            {quote && (
              <span
                className={cn(
                  'text-base font-semibold',
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
                  className="rounded-lg bg-gray-50 dark:bg-gray-700/20 border border-gray-100 dark:border-gray-700/40 p-2.5 text-center"
                >
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-medium tracking-wide">
                    {p.label}
                  </div>
                  <div
                    className={cn(
                      'text-base font-bold mt-0.5',
                      p.value > 0 ? 'text-green-600 dark:text-green-400' : p.value < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500'
                    )}
                  >
                    {formatPercent(p.value)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── DESCRIPTION ── */}
          {desc && (
            <div className="mb-5 rounded-lg bg-gray-50 dark:bg-gray-700/20 border border-gray-100 dark:border-gray-700/40 p-4">
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">{t('profile.about')}</h4>
              <p
                className={cn(
                  'text-sm text-gray-600 dark:text-gray-300 leading-relaxed',
                  !descExpanded && 'line-clamp-3'
                )}
              >
                {desc}
              </p>
              {desc.length > 200 && (
                <button
                  className="text-xs text-blue-500 hover:text-blue-600 mt-2 font-medium"
                  onClick={() => setDescExpanded(!descExpanded)}
                >
                  {descExpanded ? t('profile.showLess') : t('profile.showMore')}
                </button>
              )}
            </div>
          )}

          {/* ── KEY STATISTICS ── */}
          <Section title={t('profile.keyStatistics')}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              <StatCard label={t('profile.marketCap')} value={fmtBigNum(profile.keyStats.marketCap)} tooltip={t('profile.tip_marketCap')} />
              <StatCard label={t('profile.pe')} value={fmtNum(profile.keyStats.trailingPE)} tooltip={t('profile.tip_pe')} />
              <StatCard label={t('profile.forwardPE')} value={fmtNum(profile.keyStats.forwardPE)} tooltip={t('profile.tip_forwardPE')} />
              <StatCard label={t('profile.peg')} value={fmtNum(profile.keyStats.pegRatio)} tooltip={t('profile.tip_peg')} />
              <StatCard label={t('profile.pb')} value={fmtNum(profile.keyStats.priceToBook)} tooltip={t('profile.tip_pb')} />
              <StatCard label={t('profile.eps')} value={fmtNum(profile.keyStats.trailingEps)} tooltip={t('profile.tip_eps')} />
              <StatCard label={t('profile.forwardEps')} value={fmtNum(profile.keyStats.forwardEps)} tooltip={t('profile.tip_forwardEps')} />
              <StatCard label="Beta" value={fmtNum(profile.keyStats.beta)} tooltip={t('profile.tip_beta')} />
              <StatCard label={t('profile.divYield')} value={profile.keyStats.dividendYield != null ? fmtPct(profile.keyStats.dividendYield) : '—'} tooltip={t('profile.tip_divYield')} />
              <StatCard label={t('profile.volume')} value={fmtBigNum(profile.keyStats.averageVolume)} tooltip={t('profile.tip_volume')} />
              <StatCard label={t('profile.sma50')} value={profile.keyStats.fiftyDayAverage != null ? formatCurrency(profile.keyStats.fiftyDayAverage, cur) : '—'} tooltip={t('profile.tip_sma50')} />
              <StatCard label={t('profile.sma200')} value={profile.keyStats.twoHundredDayAverage != null ? formatCurrency(profile.keyStats.twoHundredDayAverage, cur) : '—'} tooltip={t('profile.tip_sma200')} />
            </div>
          </Section>

          {/* ── FINANCIALS ── */}
          {(profile.financials.totalRevenue != null || profile.financials.profitMargins != null) && (
            <Section title={t('profile.financials')}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                <StatCard label={t('profile.revenue')} value={fmtBigNum(profile.financials.totalRevenue)} tooltip={t('profile.tip_revenue')} />
                <StatCard label={t('profile.revenueGrowth')} value={profile.financials.revenueGrowth != null ? fmtPct(profile.financials.revenueGrowth) : '—'} colored tooltip={t('profile.tip_revenueGrowth')} />
                <StatCard label={t('profile.grossMargin')} value={profile.financials.grossMargins != null ? fmtPct(profile.financials.grossMargins) : '—'} tooltip={t('profile.tip_grossMargin')} />
                <StatCard label={t('profile.profitMargin')} value={profile.financials.profitMargins != null ? fmtPct(profile.financials.profitMargins) : '—'} colored tooltip={t('profile.tip_profitMargin')} />
                <StatCard label={t('profile.roe')} value={profile.financials.returnOnEquity != null ? fmtPct(profile.financials.returnOnEquity) : '—'} colored tooltip={t('profile.tip_roe')} />
                <StatCard label={t('profile.roa')} value={profile.financials.returnOnAssets != null ? fmtPct(profile.financials.returnOnAssets) : '—'} colored tooltip={t('profile.tip_roa')} />
                <StatCard label={t('profile.fcf')} value={fmtBigNum(profile.financials.freeCashflow)} tooltip={t('profile.tip_fcf')} />
                <StatCard label={t('profile.debtEquity')} value={fmtNum(profile.financials.debtToEquity)} tooltip={t('profile.tip_debtEquity')} />
              </div>
            </Section>
          )}

          {/* ── REVENUE & EARNINGS CHART ── */}
          {profile.revenueHistory.length > 0 && (
            <Section title={t('profile.revenueEarnings')}>
              <div className="h-52 rounded-lg bg-gray-50 dark:bg-gray-700/20 border border-gray-100 dark:border-gray-700/40 p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={profile.revenueHistory} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => fmtBigNum(v)} width={55} />
                    <RechartsTooltip contentStyle={chartTooltipStyle} formatter={(value) => [fmtBigNum(value as number), '']} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="revenue" name={t('profile.revenue')} fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="earnings" name={t('profile.netIncome')} radius={[4, 4, 0, 0]}>
                      {profile.revenueHistory.map((entry, idx) => (
                        <Cell key={idx} fill={(entry.earnings ?? 0) >= 0 ? '#10B981' : '#EF4444'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Section>
          )}

          {/* ── EARNINGS HISTORY ── */}
          {profile.earningsHistory.length > 0 && (
            <Section title={t('profile.earningsHistory')}>
              <div className="rounded-lg bg-gray-50 dark:bg-gray-700/20 border border-gray-100 dark:border-gray-700/40 p-3">
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={profile.earningsHistory} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={40} />
                      <RechartsTooltip contentStyle={chartTooltipStyle} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Bar dataKey="estimate" name={t('profile.estimate')} fill="#9CA3AF" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="actual" name={t('profile.actual')} radius={[4, 4, 0, 0]}>
                        {profile.earningsHistory.map((entry, idx) => (
                          <Cell key={idx} fill={entry.actual != null && entry.estimate != null ? (entry.actual >= entry.estimate ? '#10B981' : '#EF4444') : '#3B82F6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {/* Beat/miss pills */}
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {profile.earningsHistory.map((q) => {
                    const beat = q.actual != null && q.estimate != null ? q.actual >= q.estimate : null;
                    const surprise =
                      q.actual != null && q.estimate != null && q.estimate !== 0
                        ? ((q.actual - q.estimate) / Math.abs(q.estimate)) * 100
                        : null;
                    return (
                      <div key={q.date} className={cn(
                        'text-center rounded-md py-1.5 px-1',
                        beat === true && 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40',
                        beat === false && 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40',
                        beat === null && 'bg-gray-50 dark:bg-gray-700/30'
                      )}>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{q.date}</div>
                        {beat !== null && (
                          <div className={cn('text-[11px] font-bold', beat ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')}>
                            {beat ? 'BEAT' : 'MISS'}
                            {surprise != null && ` ${surprise > 0 ? '+' : ''}${surprise.toFixed(1)}%`}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Section>
          )}

          {/* ── EARNINGS ESTIMATES ── */}
          {profile.earningsEstimates.length > 0 && (
            <Section title={t('profile.earningsEstimates')}>
              <div className="rounded-lg bg-gray-50 dark:bg-gray-700/20 border border-gray-100 dark:border-gray-700/40 overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-500 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-700/30">
                      <th className="text-left px-3 py-2 font-medium">{t('profile.period')}</th>
                      <th className="text-right px-3 py-2 font-medium">EPS Est.</th>
                      <th className="text-right px-3 py-2 font-medium">{t('profile.range')}</th>
                      <th className="text-right px-3 py-2 font-medium">{t('profile.growth')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.earningsEstimates.map((e) => (
                      <tr key={e.period} className="border-t border-gray-100 dark:border-gray-700/40">
                        <td className="px-3 py-2 text-gray-700 dark:text-gray-300 font-medium">{e.period}</td>
                        <td className="px-3 py-2 text-right text-gray-900 dark:text-white font-semibold">
                          {e.earningsEstimateAvg != null ? e.earningsEstimateAvg.toFixed(2) : '—'}
                        </td>
                        <td className="px-3 py-2 text-right text-gray-500 dark:text-gray-400">
                          {e.earningsEstimateLow != null && e.earningsEstimateHigh != null
                            ? `${e.earningsEstimateLow.toFixed(2)} – ${e.earningsEstimateHigh.toFixed(2)}`
                            : '—'}
                        </td>
                        <td className={cn(
                          'px-3 py-2 text-right font-semibold',
                          e.growth != null && e.growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        )}>
                          {e.growth != null ? fmtPct(e.growth) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {/* ── ANALYST RECOMMENDATIONS ── */}
          {profile.analystTrend.length > 0 && (
            <Section title={t('profile.analystRatings')}>
              {/* Price target */}
              {profile.financials.targetLowPrice != null &&
                profile.financials.targetMeanPrice != null &&
                profile.financials.targetHighPrice != null && (
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-700/20 border border-gray-100 dark:border-gray-700/40 p-4 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{t('profile.priceTarget')}</span>
                      {profile.financials.numberOfAnalystOpinions != null && (
                        <span className="text-[10px] text-gray-400">({profile.financials.numberOfAnalystOpinions} {t('profile.analysts')})</span>
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

              {/* Recommendation bars */}
              <div className="rounded-lg bg-gray-50 dark:bg-gray-700/20 border border-gray-100 dark:border-gray-700/40 p-4">
                <div className="space-y-3">
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
                        <div className="text-[11px] text-gray-500 dark:text-gray-400 mb-1 font-medium">{r.period}</div>
                        <div className="flex h-6 rounded-full overflow-hidden">
                          {segments.map((seg) => (
                            <div
                              key={seg.key}
                              className={`${seg.color} flex items-center justify-center text-[10px] font-bold text-white`}
                              style={{ width: `${(seg.count / total) * 100}%` }}
                              title={`${seg.label}: ${seg.count}`}
                            >
                              {(seg.count / total) * 100 > 10 ? seg.count : ''}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-3 mt-3 flex-wrap">
                  {[
                    { color: 'bg-green-600', label: t('profile.strongBuy') },
                    { color: 'bg-green-400', label: t('profile.buy') },
                    { color: 'bg-yellow-400', label: t('profile.hold') },
                    { color: 'bg-orange-400', label: t('profile.sell') },
                    { color: 'bg-red-500', label: t('profile.strongSell') },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      <span className="text-[11px] text-gray-500 dark:text-gray-400">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          )}

          {/* ── FOOTER ── */}
          {(profile.website || profile.employees) && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-4 flex-wrap text-xs text-gray-500 dark:text-gray-400">
              {profile.employees && <span>{t('profile.employees')}: {profile.employees.toLocaleString()}</span>}
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 truncate">
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
