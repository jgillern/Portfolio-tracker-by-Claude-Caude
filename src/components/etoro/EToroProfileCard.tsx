'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import type { EToroUser } from '@/types/etoro';

interface Props {
  profile: EToroUser;
  onBack: () => void;
}

export function EToroProfileCard({ profile, onBack }: Props) {
  const { t } = useLanguage();

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6">
      <div className="flex items-start gap-4">
        <button
          onClick={onBack}
          className="mt-1 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
          aria-label="Back"
        >
          <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.username}
            className="h-14 w-14 rounded-full object-cover bg-gray-200 dark:bg-gray-700 flex-shrink-0"
          />
        ) : (
          <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-green-700 dark:text-green-400">
              {profile.username.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {profile.fullName || profile.username}
            </h2>
            {profile.isPro && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                {t('etoro.popular')}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            @{profile.username}
            {profile.country && ` · ${profile.country}`}
          </p>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
          <StatBox
            label={t('etoro.gain')}
            value={`${profile.gainPct >= 0 ? '+' : ''}${profile.gainPct.toFixed(1)}%`}
            color={profile.gainPct >= 0 ? 'green' : 'red'}
          />
          <StatBox
            label={t('etoro.riskScore')}
            value={String(profile.riskScore)}
            color={profile.riskScore <= 4 ? 'green' : profile.riskScore <= 6 ? 'yellow' : 'red'}
          />
          <StatBox
            label={t('etoro.copiers')}
            value={profile.copiers.toLocaleString()}
            color="gray"
          />
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  const colorClasses: Record<string, string> = {
    green: 'text-green-600 dark:text-green-400',
    red: 'text-red-600 dark:text-red-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    gray: 'text-gray-900 dark:text-white',
  };

  return (
    <div className="text-center">
      <div className={`text-lg font-bold ${colorClasses[color] ?? colorClasses.gray}`}>
        {value}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
}
