'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency, formatPercent } from '@/lib/utils';
import type { EToroPosition } from '@/types/etoro';

interface Props {
  positions: EToroPosition[];
}

const TYPE_COLORS: Record<string, string> = {
  stock: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  etf: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  crypto: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  commodity: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  currency: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
};

export function EToroPositionsTable({ positions }: Props) {
  const { t } = useLanguage();

  if (positions.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('etoro.noPositions')}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('etoro.positions')} ({positions.length})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase">
              <th className="px-4 py-3 text-left font-medium">{t('dashboard.name')}</th>
              <th className="px-4 py-3 text-left font-medium">{t('dashboard.type')}</th>
              <th className="px-4 py-3 text-right font-medium">{t('etoro.allocation')}</th>
              <th className="px-4 py-3 text-right font-medium">{t('etoro.invested')}</th>
              <th className="px-4 py-3 text-right font-medium">{t('etoro.currentValue')}</th>
              <th className="px-4 py-3 text-right font-medium">{t('etoro.pnl')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {positions.map((pos, idx) => (
              <tr
                key={`${pos.instrumentId}-${idx}`}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {pos.ticker}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                        {pos.instrumentName}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${TYPE_COLORS[pos.type] ?? TYPE_COLORS.stock}`}>
                    {pos.type}
                  </span>
                  {pos.direction === 'sell' && (
                    <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
                      SHORT
                    </span>
                  )}
                </td>

                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-green-500"
                        style={{ width: `${Math.min(pos.allocationPct, 100)}%` }}
                      />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 tabular-nums">
                      {pos.allocationPct.toFixed(1)}%
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300 tabular-nums">
                  {formatCurrency(pos.invested)}
                </td>

                <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300 tabular-nums">
                  {formatCurrency(pos.currentValue)}
                </td>

                <td className="px-4 py-3 text-right tabular-nums">
                  <div className={pos.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    <div className="font-medium">{formatCurrency(pos.pnl)}</div>
                    <div className="text-xs">{formatPercent(pos.pnlPct)}</div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
