'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { useMarketData } from '@/hooks/useMarketData';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { formatPercent, formatCurrency, cn } from '@/lib/utils';

function ChangeCell({ value }: { value: number }) {
  return (
    <span
      className={cn(
        'text-sm font-medium',
        value > 0 ? 'text-green-600 dark:text-green-400' : value < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500'
      )}
    >
      {formatPercent(value)}
    </span>
  );
}

export function InstrumentsTable() {
  const { t } = useLanguage();
  const { activePortfolio, removeInstrument, updateInstrumentWeight, toggleCustomWeights } =
    usePortfolio();

  const symbols = activePortfolio?.instruments.map((i) => i.symbol) ?? [];
  const { quotes, isLoading } = useMarketData(symbols);

  if (!activePortfolio) return null;
  const { instruments, useCustomWeights } = activePortfolio;

  if (instruments.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-center text-gray-500 dark:text-gray-400">
        <p>{t('dashboard.noInstruments')}</p>
        <p className="text-sm mt-1">{t('dashboard.addSome')}</p>
      </div>
    );
  }

  const weightsTotal = instruments.reduce((sum, i) => sum + (i.weight ?? 0), 0);
  const weightsValid = !useCustomWeights || Math.abs(weightsTotal - 100) < 0.01;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('dashboard.instruments')}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleCustomWeights(activePortfolio.id)}
            className={cn(
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
              useCustomWeights ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
            )}
          >
            <span
              className={cn(
                'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
                useCustomWeights ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {useCustomWeights ? t('dashboard.customWeights') : t('dashboard.equalWeights')}
          </span>
          {useCustomWeights && !weightsValid && (
            <span className="text-xs text-red-500">
              {t('dashboard.weightsWarning')} ({weightsTotal.toFixed(1)}%)
            </span>
          )}
        </div>
      </div>

      {isLoading && symbols.length > 0 ? (
        <div className="flex justify-center py-8">
          <Spinner className="h-6 w-6" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                <th className="text-left px-4 sm:px-6 py-3">{t('dashboard.name')}</th>
                <th className="text-left px-2 py-3">{t('dashboard.type')}</th>
                {useCustomWeights && <th className="text-right px-2 py-3">{t('dashboard.weight')}</th>}
                <th className="text-right px-2 py-3">{t('dashboard.price')}</th>
                <th className="text-right px-2 py-3">{t('dashboard.change24h')}</th>
                <th className="text-right px-2 py-3 hidden sm:table-cell">{t('dashboard.change1w')}</th>
                <th className="text-right px-2 py-3 hidden md:table-cell">{t('dashboard.change1m')}</th>
                <th className="text-right px-2 py-3 hidden lg:table-cell">{t('dashboard.change1y')}</th>
                <th className="text-right px-2 py-3 hidden lg:table-cell">{t('dashboard.changeYtd')}</th>
                <th className="text-right px-4 sm:px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {instruments.map((instrument) => {
                const quote = quotes.find((q) => q.symbol === instrument.symbol);
                return (
                  <tr
                    key={instrument.symbol}
                    className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-3">
                      <div className="font-medium text-sm text-gray-900 dark:text-white">
                        {instrument.symbol}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                        {instrument.name}
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <Badge type={instrument.type} label={t(`types.${instrument.type}`)} />
                    </td>
                    {useCustomWeights && (
                      <td className="px-2 py-3 text-right">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={instrument.weight ?? ''}
                          onChange={(e) =>
                            updateInstrumentWeight(
                              activePortfolio.id,
                              instrument.symbol,
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-16 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-1.5 py-1 text-xs text-right text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
                          placeholder="—"
                        />
                        <span className="text-xs text-gray-400 ml-0.5">%</span>
                      </td>
                    )}
                    <td className="px-2 py-3 text-right text-sm text-gray-900 dark:text-white">
                      {quote ? formatCurrency(quote.price, quote.currency) : '—'}
                    </td>
                    <td className="px-2 py-3 text-right">
                      {quote ? <ChangeCell value={quote.change24h} /> : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-2 py-3 text-right hidden sm:table-cell">
                      {quote ? <ChangeCell value={quote.change1w} /> : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-2 py-3 text-right hidden md:table-cell">
                      {quote ? <ChangeCell value={quote.change1m} /> : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-2 py-3 text-right hidden lg:table-cell">
                      {quote ? <ChangeCell value={quote.change1y} /> : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-2 py-3 text-right hidden lg:table-cell">
                      {quote ? <ChangeCell value={quote.changeYtd} /> : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInstrument(activePortfolio.id, instrument.symbol)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        &times;
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
