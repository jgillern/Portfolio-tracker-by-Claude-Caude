'use client';

import React from 'react';
import { TimePeriod } from '@/types/market';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

const periods: TimePeriod[] = ['1d', '1w', '1mo', '1y', '5y', 'ytd'];

interface Props {
  selected: TimePeriod;
  onChange: (period: TimePeriod) => void;
}

export function TimePeriodSelector({ selected, onChange }: Props) {
  const { t } = useLanguage();

  return (
    <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-0.5">
      {periods.map((period) => (
        <button
          key={period}
          onClick={() => onChange(period)}
          className={cn(
            'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
            selected === period
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          )}
        >
          {t(`periods.${period}`)}
        </button>
      ))}
    </div>
  );
}
