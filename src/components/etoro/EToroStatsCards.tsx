'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import type { EToroStats } from '@/types/etoro';

interface Props {
  stats: EToroStats;
}

export function EToroStatsCards({ stats }: Props) {
  const { t } = useLanguage();

  const cards = [
    {
      label: t('etoro.riskScore'),
      value: `${stats.riskScore}/10`,
      color: stats.riskScore <= 4
        ? 'text-green-600 dark:text-green-400'
        : stats.riskScore <= 6
          ? 'text-yellow-600 dark:text-yellow-400'
          : 'text-red-600 dark:text-red-400',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      ),
    },
    {
      label: t('etoro.copiers'),
      value: stats.copiers.toLocaleString(),
      color: 'text-gray-900 dark:text-white',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      label: t('etoro.winRatio'),
      value: stats.winRatio > 0 ? `${stats.winRatio.toFixed(0)}%` : '—',
      color: stats.winRatio >= 60
        ? 'text-green-600 dark:text-green-400'
        : stats.winRatio >= 40
          ? 'text-yellow-600 dark:text-yellow-400'
          : stats.winRatio > 0
            ? 'text-red-600 dark:text-red-400'
            : 'text-gray-400',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-5.54 0" />
        </svg>
      ),
    },
    {
      label: t('etoro.profitableWeeks'),
      value: stats.profitableWeeks > 0 ? `${stats.profitableWeeks.toFixed(0)}%` : '—',
      color: stats.profitableWeeks >= 60
        ? 'text-green-600 dark:text-green-400'
        : stats.profitableWeeks > 0
          ? 'text-yellow-600 dark:text-yellow-400'
          : 'text-gray-400',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
    },
    {
      label: t('etoro.maxDrawdown'),
      value: stats.maxDailyDrawdown > 0 ? `${stats.maxDailyDrawdown.toFixed(1)}%` : '—',
      color: stats.maxDailyDrawdown <= 5
        ? 'text-green-600 dark:text-green-400'
        : stats.maxDailyDrawdown <= 15
          ? 'text-yellow-600 dark:text-yellow-400'
          : stats.maxDailyDrawdown > 0
            ? 'text-red-600 dark:text-red-400'
            : 'text-gray-400',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
        </svg>
      ),
    },
    {
      label: t('etoro.totalTrades'),
      value: stats.totalTrades > 0 ? stats.totalTrades.toLocaleString() : '—',
      color: 'text-gray-900 dark:text-white',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
      ),
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('etoro.stats')}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg bg-gray-50 dark:bg-gray-700/30 p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-gray-400 dark:text-gray-500">{card.icon}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{card.label}</span>
            </div>
            <div className={`text-xl font-bold ${card.color}`}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Yearly returns */}
      {Object.keys(stats.yearlyReturns).length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('etoro.yearlyReturns')}
          </h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats.yearlyReturns).map(([period, gain]) => (
              <div key={period} className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                  {period}
                </div>
                <div className={`text-sm font-semibold ${gain >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {gain >= 0 ? '+' : ''}{gain.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
