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

interface FearGreedData {
  current: { value: number; rating: string; timestamp: number };
  history: { x: number; y: number; rating: string }[];
}

function getRatingColor(value: number): string {
  if (value <= 25) return '#EF4444';
  if (value <= 45) return '#F97316';
  if (value <= 55) return '#EAB308';
  if (value <= 75) return '#84CC16';
  return '#22C55E';
}

function getRatingLabel(value: number, t: (k: string) => string): string {
  if (value <= 25) return t('markets.extremeFear');
  if (value <= 45) return t('markets.fear');
  if (value <= 55) return t('markets.neutral');
  if (value <= 75) return t('markets.greed');
  return t('markets.extremeGreed');
}

/** Redesigned semi-circle gauge with smooth gradient */
function FearGreedGauge({ value }: { value: number }) {
  const { t } = useLanguage();
  const color = getRatingColor(value);
  const label = getRatingLabel(value, t);

  // Gauge geometry: center at (100,110), radius 85, semi-circle from 180° to 0°
  const cx = 100;
  const cy = 110;
  const r = 85;
  const trackWidth = 18;

  // Needle angle: 0=left (180°) to 100=right (0°)
  const angle = 180 - (value / 100) * 180;
  const rad = (angle * Math.PI) / 180;
  const needleLen = r - 20;
  const nx = cx + needleLen * Math.cos(rad);
  const ny = cy - needleLen * Math.sin(rad);

  return (
    <div className="flex flex-col items-center w-full max-w-[320px]">
      <svg viewBox="0 0 200 140" className="w-full">
        <defs>
          {/* Smooth gradient from red (fear) to green (greed) */}
          <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="25%" stopColor="#F97316" />
            <stop offset="45%" stopColor="#EAB308" />
            <stop offset="55%" stopColor="#EAB308" />
            <stop offset="75%" stopColor="#84CC16" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
          {/* Shadow for needle */}
          <filter id="needleShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.3" />
          </filter>
          {/* Glow for active dot */}
          <filter id="dotGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background track (muted) */}
        <path
          d={describeArc(cx, cy, r, 180, 0)}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={trackWidth}
          strokeLinecap="round"
          className="dark:stroke-gray-700"
        />

        {/* Colored gradient track */}
        <path
          d={describeArc(cx, cy, r, 180, 0)}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth={trackWidth}
          strokeLinecap="round"
          opacity={0.85}
        />

        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const tickAngle = 180 - (tick / 100) * 180;
          const tickRad = (tickAngle * Math.PI) / 180;
          const inner = r - trackWidth / 2 - 2;
          const outer = r + trackWidth / 2 + 2;
          return (
            <line
              key={tick}
              x1={cx + inner * Math.cos(tickRad)}
              y1={cy - inner * Math.sin(tickRad)}
              x2={cx + outer * Math.cos(tickRad)}
              y2={cy - outer * Math.sin(tickRad)}
              stroke="#9CA3AF"
              strokeWidth="1.5"
              opacity={0.5}
            />
          );
        })}

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={nx}
          y2={ny}
          stroke="#1F2937"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#needleShadow)"
          className="dark:stroke-gray-200"
        />
        {/* Center hub */}
        <circle cx={cx} cy={cy} r="7" fill="#1F2937" className="dark:fill-gray-200" />
        <circle cx={cx} cy={cy} r="3.5" fill="white" className="dark:fill-gray-800" />

        {/* Side labels */}
        <text x="12" y={cy + 18} textAnchor="middle" fontSize="7.5" fontWeight="600" fill="#EF4444" opacity={0.7}>0</text>
        <text x="188" y={cy + 18} textAnchor="middle" fontSize="7.5" fontWeight="600" fill="#22C55E" opacity={0.7}>100</text>
      </svg>

      {/* Value + label below the gauge */}
      <div className="flex flex-col items-center -mt-4">
        <div className="text-4xl font-black tracking-tight" style={{ color }}>
          {value}
        </div>
        <div
          className="text-sm font-bold mt-0.5 px-3 py-0.5 rounded-full"
          style={{ color, backgroundColor: `${color}18` }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

function describeArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number): string {
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const sx = cx + radius * Math.cos(startRad);
  const sy = cy - radius * Math.sin(startRad);
  const ex = cx + radius * Math.cos(endRad);
  const ey = cy - radius * Math.sin(endRad);
  const largeArc = Math.abs(startAngle - endAngle) > 180 ? 1 : 0;
  const sweep = endAngle < startAngle ? 1 : 0;
  return `M ${sx} ${sy} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${ex} ${ey}`;
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

          {/* History chart with fear-greed gradient */}
          <div className="h-48 sm:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="fgHistoryGradient" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="25%" stopColor="#F97316" stopOpacity={0.3} />
                    <stop offset="50%" stopColor="#EAB308" stopOpacity={0.2} />
                    <stop offset="75%" stopColor="#84CC16" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22C55E" stopOpacity={0.4} />
                  </linearGradient>
                  <linearGradient id="fgStrokeGradient" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#EF4444" />
                    <stop offset="25%" stopColor="#F97316" />
                    <stop offset="50%" stopColor="#EAB308" />
                    <stop offset="75%" stopColor="#84CC16" />
                    <stop offset="100%" stopColor="#22C55E" />
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
                <ReferenceLine y={25} stroke="#EF4444" strokeDasharray="2 4" opacity={0.2} />
                <ReferenceLine y={75} stroke="#22C55E" strokeDasharray="2 4" opacity={0.2} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="url(#fgStrokeGradient)"
                  strokeWidth={2}
                  fill="url(#fgHistoryGradient)"
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
