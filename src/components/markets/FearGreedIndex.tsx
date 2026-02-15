'use client';

import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { useLanguage } from '@/context/LanguageContext';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';

interface FearGreedData {
  current: { value: number; rating: string; timestamp: number };
  history: { x: number; y: number; rating: string }[];
}

function getRatingColor(value: number): string {
  if (value <= 25) return '#EF4444'; // Extreme Fear - red
  if (value <= 45) return '#F97316'; // Fear - orange
  if (value <= 55) return '#EAB308'; // Neutral - yellow
  if (value <= 75) return '#84CC16'; // Greed - lime
  return '#22C55E'; // Extreme Greed - green
}

function getRatingLabel(value: number, t: (k: string) => string): string {
  if (value <= 25) return t('markets.extremeFear');
  if (value <= 45) return t('markets.fear');
  if (value <= 55) return t('markets.neutral');
  if (value <= 75) return t('markets.greed');
  return t('markets.extremeGreed');
}

/** Semi-circle gauge for Fear & Greed */
function FearGreedGauge({ value }: { value: number }) {
  const { t } = useLanguage();
  const color = getRatingColor(value);
  const label = getRatingLabel(value, t);

  // Gauge angle: 0=left (Extreme Fear) to 180=right (Extreme Greed)
  const angle = (value / 100) * 180;
  const rad = (angle * Math.PI) / 180;
  // Needle tip on arc (center 100,100, radius 80)
  const nx = 100 - 80 * Math.cos(rad);
  const ny = 100 - 80 * Math.sin(rad);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="w-full max-w-[280px]">
        {/* Background arc segments */}
        <path d="M 20 100 A 80 80 0 0 1 56 36" fill="none" stroke="#EF4444" strokeWidth="14" strokeLinecap="round" opacity={0.2} />
        <path d="M 56 36 A 80 80 0 0 1 100 20" fill="none" stroke="#F97316" strokeWidth="14" strokeLinecap="round" opacity={0.2} />
        <path d="M 100 20 A 80 80 0 0 1 144 36" fill="none" stroke="#EAB308" strokeWidth="14" strokeLinecap="round" opacity={0.2} />
        <path d="M 144 36 A 80 80 0 0 1 180 100" fill="none" stroke="#22C55E" strokeWidth="14" strokeLinecap="round" opacity={0.2} />

        {/* Active arc up to value */}
        {value > 0 && (
          <path
            d={describeArc(100, 100, 80, 180, 180 - angle)}
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
          />
        )}

        {/* Needle */}
        <line x1="100" y1="100" x2={nx} y2={ny} stroke={color} strokeWidth="3" strokeLinecap="round" />
        <circle cx="100" cy="100" r="6" fill={color} />
        <circle cx="100" cy="100" r="3" fill="white" />

        {/* Value text */}
        <text x="100" y="90" textAnchor="middle" className="text-3xl font-black" fill={color} fontSize="28">
          {value}
        </text>

        {/* Labels */}
        <text x="20" y="115" textAnchor="middle" fontSize="8" fill="#9CA3AF">{t('markets.fear')}</text>
        <text x="180" y="115" textAnchor="middle" fontSize="8" fill="#9CA3AF">{t('markets.greed')}</text>
      </svg>
      <div className="mt-1 text-center">
        <div className="text-sm font-bold" style={{ color }}>{label}</div>
      </div>
    </div>
  );
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const sx = x - radius * Math.cos(startRad);
  const sy = y - radius * Math.sin(startRad);
  const ex = x - radius * Math.cos(endRad);
  const ey = y - radius * Math.sin(endRad);
  const largeArc = Math.abs(startAngle - endAngle) > 180 ? 1 : 0;
  return `M ${sx} ${sy} A ${radius} ${radius} 0 ${largeArc} 0 ${ex} ${ey}`;
}

export function FearGreedIndex() {
  const { t, locale } = useLanguage();
  const [data, setData] = useState<FearGreedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/fear-greed')
      .then((r) => r.json())
      .then((d) => {
        if (d.current) setData(d);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const dateLocale = locale === 'cs' ? 'cs-CZ' : locale === 'sk' ? 'sk-SK' : 'en-US';

  // Filter history to last year
  const yearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
  const historyData = (data?.history ?? [])
    .filter((d) => d.x >= yearAgo)
    .map((d) => ({ time: d.x, value: d.y }));

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('markets.fearGreedIndex')}
      </h2>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      ) : !data ? (
        <p className="text-sm text-gray-400 text-center py-8">{t('errors.fetchFailed')}</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gauge */}
          <div className="flex items-center justify-center">
            <FearGreedGauge value={data.current.value} />
          </div>

          {/* History chart */}
          <div className="h-48 sm:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="fgGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.15} vertical={false} />
                <XAxis
                  dataKey="time"
                  tickFormatter={(ts: number) =>
                    new Date(ts).toLocaleDateString(dateLocale, { month: 'short' })
                  }
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <ReferenceLine y={50} stroke="#6B7280" strokeDasharray="3 3" opacity={0.4} />
                <ReferenceLine y={25} stroke="#EF4444" strokeDasharray="2 4" opacity={0.3} />
                <ReferenceLine y={75} stroke="#22C55E" strokeDasharray="2 4" opacity={0.3} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#fgGradient)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
