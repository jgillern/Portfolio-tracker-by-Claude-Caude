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
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 rounded-lg bg-gray-900 dark:bg-gray-700 text-white text-[11px] leading-snug px-3 py-2.5 shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-50">
        {text}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
      </span>
    </span>
  );
}

/* ---------- Stat card (enhanced) ---------- */
function StatCard({ label, value, tooltip, colored, icon }: {
  label: string; value: string; tooltip?: string; colored?: boolean; icon?: React.ReactNode;
}) {
  const isNeg = colored && value.startsWith('-');
  const isPos = colored && !value.startsWith('-') && value !== '—' && value !== '0.00%';
  return (
    <div className={cn(
      'relative rounded-xl border px-4 py-3 transition-all duration-200',
      'bg-white dark:bg-gray-800/60',
      'border-gray-200/80 dark:border-gray-700/50',
      'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600',
      'group/card',
    )}>
      {colored && (isPos || isNeg) && (
        <div className={cn(
          'absolute top-0 left-0 w-1 h-full rounded-l-xl',
          isPos && 'bg-green-500',
          isNeg && 'bg-red-500',
        )} />
      )}
      <div className="flex items-center gap-1 mb-1.5">
        {icon && <span className="text-gray-400 dark:text-gray-500 mr-0.5">{icon}</span>}
        <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</span>
        {tooltip && <InfoTooltip text={tooltip} />}
      </div>
      <div className={cn(
        'text-[15px] font-bold truncate',
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
function Section({ title, children, accentColor = 'blue' }: {
  title: string; children: React.ReactNode; accentColor?: 'blue' | 'emerald' | 'purple' | 'amber';
}) {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    emerald: 'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-purple-600',
    amber: 'from-amber-500 to-amber-600',
  };
  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className={cn('w-1 h-5 rounded-full bg-gradient-to-b', colors[accentColor])} />
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

/* ---------- 52-week range bar ---------- */
function RangeBar({ low, high, current, currency }: { low: number; high: number; current: number; currency: string }) {
  const range = high - low;
  const pct = range > 0 ? ((current - low) / range) * 100 : 50;
  return (
    <div className="rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-700/40 p-4">
      <div className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">52-Week Range</div>
      <div className="flex justify-between text-xs font-medium mb-2">
        <span className="text-red-500 dark:text-red-400">{formatCurrency(low, currency)}</span>
        <span className="text-green-500 dark:text-green-400">{formatCurrency(high, currency)}</span>
      </div>
      <div className="relative h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className="absolute h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 w-full opacity-80" />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white dark:bg-gray-900 border-[3px] border-blue-500 shadow-lg ring-2 ring-blue-500/20"
          style={{ left: `${Math.min(Math.max(pct, 2), 98)}%`, transform: 'translate(-50%, -50%)' }}
        />
      </div>
      <div className="mt-2 text-center">
        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
          {formatCurrency(current, currency)}
        </span>
      </div>
    </div>
  );
}

/* ---------- Recommendation badge ---------- */
function RecBadge({ rec, t }: { rec: string | null; t: (k: string) => string }) {
  if (!rec) return null;
  const map: Record<string, { bg: string; key: string }> = {
    strong_buy: { bg: 'bg-gradient-to-r from-green-500 to-emerald-600', key: 'profile.strongBuy' },
    buy: { bg: 'bg-gradient-to-r from-green-400 to-green-500', key: 'profile.buy' },
    hold: { bg: 'bg-gradient-to-r from-yellow-400 to-amber-500', key: 'profile.hold' },
    underperform: { bg: 'bg-gradient-to-r from-orange-400 to-orange-500', key: 'profile.sell' },
    sell: { bg: 'bg-gradient-to-r from-red-400 to-red-500', key: 'profile.sell' },
  };
  const info = map[rec];
  if (!info) return null;
  return (
    <span className={cn(info.bg, 'text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm')}>
      {t(info.key)}
    </span>
  );
}

/* ---------- Price target visual ---------- */
function PriceTargetBar({ low, mean, high, current, currency, t }: {
  low: number; mean: number; high: number; current: number; currency: string; t: (k: string) => string;
}) {
  const min = Math.min(low, current) * 0.95;
  const max = Math.max(high, current) * 1.05;
  const range = max - min;
  const toPct = (v: number) => ((v - min) / range) * 100;

  return (
    <div className="rounded-xl bg-white dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/50 p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{t('profile.priceTarget')}</span>
        <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 rounded-full font-medium">
          {formatCurrency(mean, currency)} avg
        </span>
      </div>

      <div className="relative h-10 rounded-xl bg-gray-100 dark:bg-gray-700/40 overflow-hidden">
        {/* Target range highlight */}
        <div
          className="absolute h-full bg-blue-100 dark:bg-blue-900/30 border-l-2 border-r-2 border-blue-300 dark:border-blue-700"
          style={{ left: `${toPct(low)}%`, width: `${toPct(high) - toPct(low)}%` }}
        />
        {/* Mean line */}
        <div
          className="absolute top-0 h-full w-0.5 bg-blue-500 dark:bg-blue-400"
          style={{ left: `${toPct(mean)}%` }}
        />
        {/* Current price indicator */}
        <div
          className="absolute top-1/2 w-4 h-4 rounded-full bg-gray-900 dark:bg-white shadow-lg ring-2 ring-white dark:ring-gray-800"
          style={{ left: `${toPct(current)}%`, transform: 'translate(-50%, -50%)' }}
        />
      </div>

      <div className="flex justify-between mt-3">
        <div className="text-center">
          <div className="text-[9px] font-medium text-gray-400 uppercase">Low</div>
          <div className="text-xs font-bold text-red-500 dark:text-red-400">{formatCurrency(low, currency)}</div>
        </div>
        <div className="text-center">
          <div className="text-[9px] font-medium text-gray-400 uppercase">Avg</div>
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400">{formatCurrency(mean, currency)}</div>
        </div>
        <div className="text-center">
          <div className="text-[9px] font-medium text-gray-400 uppercase">High</div>
          <div className="text-xs font-bold text-green-500 dark:text-green-400">{formatCurrency(high, currency)}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Recharts tooltip style ---------- */
const chartTooltipStyle = {
  backgroundColor: '#1F2937',
  border: 'none',
  borderRadius: '10px',
  fontSize: '12px',
  color: '#F9FAFB',
  boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
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
  const price = profile?.financials.currentPrice ?? quote?.price ?? 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={instrument.symbol}
      className="max-w-6xl max-h-[92vh] flex flex-col"
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Spinner className="h-10 w-10" />
          <span className="text-sm text-gray-400">{t('profile.loading') !== 'profile.loading' ? t('profile.loading') : 'Loading...'}</span>
        </div>
      ) : !profile ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-12 text-center">
          {t('errors.fetchFailed')}
        </p>
      ) : (
        <div className="overflow-y-auto -mx-6 px-6 pb-6" style={{ maxHeight: 'calc(92vh - 120px)' }}>

          {/* ══════════════ HEADER HERO SECTION ══════════════ */}
          <div className="relative rounded-2xl bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-800/80 dark:via-gray-800/40 dark:to-gray-800/80 border border-gray-200/60 dark:border-gray-700/40 p-6 mb-6 overflow-hidden">
            {/* Subtle decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/5 to-transparent rounded-tr-full" />

            <div className="relative flex items-start gap-5">
              <div className="shrink-0 rounded-2xl bg-white dark:bg-gray-700/50 shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-2.5">
                <InstrumentLogo
                  symbol={instrument.symbol}
                  name={instrument.name}
                  type={instrument.type}
                  logoUrl={instrument.logoUrl}
                  size="md"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap mb-1">
                  <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight truncate">
                    {profile.name}
                  </h3>
                  <Badge type={instrument.type} label={t(`types.${instrument.type}`)} />
                  <RecBadge rec={profile.financials.recommendationKey} t={t} />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                  {profile.exchange && <span className="bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 rounded-md font-medium">{profile.exchange}</span>}
                  {profile.sector && <span>{profile.sector}</span>}
                  {profile.industry && (
                    <>
                      <span className="text-gray-300 dark:text-gray-600">/</span>
                      <span>{profile.industry}</span>
                    </>
                  )}
                  {profile.country && (
                    <>
                      <span className="text-gray-300 dark:text-gray-600">/</span>
                      <span>{profile.country}</span>
                    </>
                  )}
                </div>

                {/* Company info: employees + website */}
                {(profile.employees || profile.website) && (
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                    {profile.employees && (
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                        {profile.employees.toLocaleString()} {t('profile.employees')}
                      </span>
                    )}
                    {profile.website && (
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-500 hover:text-blue-600 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                        </svg>
                        {profile.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                      </a>
                    )}
                  </div>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-3 mt-4">
                  <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                    {formatCurrency(price, cur)}
                  </span>
                  {quote && (
                    <span
                      className={cn(
                        'text-lg font-bold px-2.5 py-0.5 rounded-lg',
                        quote.change24h >= 0
                          ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                          : 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                      )}
                    >
                      {formatPercent(quote.change24h)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════ PERFORMANCE PILLS + 52W RANGE ══════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Performance pills */}
            {quote && (
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: t('dashboard.change1w'), value: quote.change1w },
                  { label: t('dashboard.change1m'), value: quote.change1m },
                  { label: t('dashboard.change1y'), value: quote.change1y },
                  { label: t('dashboard.changeYtd'), value: quote.changeYtd },
                ].map((p) => (
                  <div
                    key={p.label}
                    className={cn(
                      'rounded-xl border p-3 text-center transition-all',
                      p.value > 0
                        ? 'bg-green-50/80 dark:bg-green-900/10 border-green-200/60 dark:border-green-800/30'
                        : p.value < 0
                          ? 'bg-red-50/80 dark:bg-red-900/10 border-red-200/60 dark:border-red-800/30'
                          : 'bg-gray-50 dark:bg-gray-800/40 border-gray-200/60 dark:border-gray-700/40',
                    )}
                  >
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">
                      {p.label}
                    </div>
                    <div
                      className={cn(
                        'text-lg font-extrabold',
                        p.value > 0 ? 'text-green-600 dark:text-green-400' : p.value < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500'
                      )}
                    >
                      {formatPercent(p.value)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 52-week range */}
            {profile.keyStats.fiftyTwoWeekLow != null && profile.keyStats.fiftyTwoWeekHigh != null && (
              <RangeBar
                low={profile.keyStats.fiftyTwoWeekLow}
                high={profile.keyStats.fiftyTwoWeekHigh}
                current={price}
                currency={cur}
              />
            )}
          </div>

          {/* ══════════════ DESCRIPTION ══════════════ */}
          {desc && (
            <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-50/50 via-white to-purple-50/50 dark:from-blue-900/10 dark:via-gray-800/30 dark:to-purple-900/10 border border-gray-200/60 dark:border-gray-700/40 p-5">
              <h4 className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                {t('profile.about')}
              </h4>
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
                  className="text-xs text-blue-500 hover:text-blue-600 mt-2.5 font-semibold flex items-center gap-1"
                  onClick={() => setDescExpanded(!descExpanded)}
                >
                  {descExpanded ? t('profile.showLess') : t('profile.showMore')}
                  <svg className={cn('w-3 h-3 transition-transform', descExpanded && 'rotate-180')} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* ══════════════ KEY STATISTICS ══════════════ */}
          <Section title={t('profile.keyStatistics')} accentColor="blue">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
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

          {/* ══════════════ FINANCIALS ══════════════ */}
          {(profile.financials.totalRevenue != null || profile.financials.profitMargins != null) && (
            <Section title={t('profile.financials')} accentColor="emerald">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
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

          {/* ══════════════ REVENUE & EARNINGS CHART ══════════════ */}
          {profile.revenueHistory.length > 0 && (
            <Section title={t('profile.revenueEarnings')} accentColor="purple">
              <div className="rounded-xl bg-white dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/50 p-5 shadow-sm">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={profile.revenueHistory} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.15} vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => fmtBigNum(v)} width={55} />
                      <RechartsTooltip contentStyle={chartTooltipStyle} formatter={(value) => [fmtBigNum(value as number), '']} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      <Bar dataKey="revenue" name={t('profile.revenue')} fill="#3B82F6" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="earnings" name={t('profile.netIncome')} radius={[6, 6, 0, 0]}>
                        {profile.revenueHistory.map((entry, idx) => (
                          <Cell key={idx} fill={(entry.earnings ?? 0) >= 0 ? '#10B981' : '#EF4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Section>
          )}

          {/* ══════════════ EARNINGS HISTORY ══════════════ */}
          {profile.earningsHistory.length > 0 && (
            <Section title={t('profile.earningsHistory')} accentColor="amber">
              <div className="rounded-xl bg-white dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/50 p-5 shadow-sm">
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={profile.earningsHistory} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.15} vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={40} />
                      <RechartsTooltip contentStyle={chartTooltipStyle} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      <Bar dataKey="estimate" name={t('profile.estimate')} fill="#9CA3AF" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="actual" name={t('profile.actual')} radius={[6, 6, 0, 0]}>
                        {profile.earningsHistory.map((entry, idx) => (
                          <Cell key={idx} fill={entry.actual != null && entry.estimate != null ? (entry.actual >= entry.estimate ? '#10B981' : '#EF4444') : '#3B82F6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Beat/miss pills */}
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {profile.earningsHistory.map((q) => {
                    const beat = q.actual != null && q.estimate != null ? q.actual >= q.estimate : null;
                    const surprise =
                      q.actual != null && q.estimate != null && q.estimate !== 0
                        ? ((q.actual - q.estimate) / Math.abs(q.estimate)) * 100
                        : null;
                    return (
                      <div key={q.date} className={cn(
                        'text-center rounded-xl py-2 px-2 transition-all',
                        beat === true && 'bg-green-50 dark:bg-green-900/15 border border-green-200 dark:border-green-800/40',
                        beat === false && 'bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800/40',
                        beat === null && 'bg-gray-50 dark:bg-gray-700/30 border border-gray-200/50 dark:border-gray-700/30'
                      )}>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold mb-0.5">{q.date}</div>
                        {beat !== null && (
                          <div className={cn('text-xs font-extrabold', beat ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')}>
                            {beat ? 'BEAT' : 'MISS'}
                            {surprise != null && (
                              <span className="block text-[10px] font-bold mt-0.5 opacity-80">
                                {surprise > 0 ? '+' : ''}{surprise.toFixed(1)}%
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Section>
          )}

          {/* ══════════════ EARNINGS ESTIMATES ══════════════ */}
          {profile.earningsEstimates.length > 0 && (
            <Section title={t('profile.earningsEstimates')} accentColor="blue">
              <div className="rounded-xl bg-white dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/50 overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30">
                      <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider">{t('profile.period')}</th>
                      <th className="text-right px-5 py-3 font-semibold text-xs uppercase tracking-wider">EPS Est.</th>
                      <th className="text-right px-5 py-3 font-semibold text-xs uppercase tracking-wider">{t('profile.range')}</th>
                      <th className="text-right px-5 py-3 font-semibold text-xs uppercase tracking-wider">{t('profile.growth')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.earningsEstimates.map((e, idx) => (
                      <tr key={e.period} className={cn(
                        'border-t border-gray-100 dark:border-gray-700/40 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/20',
                        idx % 2 === 0 && 'bg-gray-50/30 dark:bg-gray-800/30',
                      )}>
                        <td className="px-5 py-3 text-gray-700 dark:text-gray-300 font-semibold">{e.period}</td>
                        <td className="px-5 py-3 text-right text-gray-900 dark:text-white font-bold">
                          {e.earningsEstimateAvg != null ? e.earningsEstimateAvg.toFixed(2) : '—'}
                        </td>
                        <td className="px-5 py-3 text-right text-gray-500 dark:text-gray-400 font-medium">
                          {e.earningsEstimateLow != null && e.earningsEstimateHigh != null
                            ? `${e.earningsEstimateLow.toFixed(2)} – ${e.earningsEstimateHigh.toFixed(2)}`
                            : '—'}
                        </td>
                        <td className="px-5 py-3 text-right">
                          {e.growth != null ? (
                            <span className={cn(
                              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold',
                              e.growth >= 0
                                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                                : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                            )}>
                              {fmtPct(e.growth)}
                            </span>
                          ) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {/* ══════════════ ANALYST RECOMMENDATIONS ══════════════ */}
          {profile.analystTrend.length > 0 && (
            <Section title={t('profile.analystRatings')} accentColor="purple">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Price target */}
                {profile.financials.targetLowPrice != null &&
                  profile.financials.targetMeanPrice != null &&
                  profile.financials.targetHighPrice != null && (
                    <PriceTargetBar
                      low={profile.financials.targetLowPrice}
                      mean={profile.financials.targetMeanPrice}
                      high={profile.financials.targetHighPrice}
                      current={price}
                      currency={cur}
                      t={t}
                    />
                  )}

                {/* Analyst count summary */}
                {profile.financials.numberOfAnalystOpinions != null && (
                  <div className="rounded-xl bg-white dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/50 p-5 flex flex-col justify-center">
                    <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">{t('profile.analysts')}</div>
                    <div className="text-4xl font-black text-gray-900 dark:text-white mb-1">
                      {profile.financials.numberOfAnalystOpinions}
                    </div>
                    <div className="text-xs text-gray-400">{t('profile.analysts')}</div>
                  </div>
                )}
              </div>

              {/* Recommendation bars */}
              <div className="mt-4 rounded-xl bg-white dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/50 p-5 shadow-sm">
                <div className="space-y-4">
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
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-semibold">{r.period}</div>
                        <div className="flex h-8 rounded-xl overflow-hidden shadow-inner">
                          {segments.map((seg) => (
                            <div
                              key={seg.key}
                              className={cn(seg.color, 'flex items-center justify-center text-[11px] font-bold text-white transition-all hover:brightness-110')}
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
                <div className="flex gap-4 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/40 flex-wrap">
                  {[
                    { color: 'bg-green-600', label: t('profile.strongBuy') },
                    { color: 'bg-green-400', label: t('profile.buy') },
                    { color: 'bg-yellow-400', label: t('profile.hold') },
                    { color: 'bg-orange-400', label: t('profile.sell') },
                    { color: 'bg-red-500', label: t('profile.strongSell') },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className={cn('w-3 h-3 rounded-full', item.color)} />
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          )}

        </div>
      )}
    </Modal>
  );
}
