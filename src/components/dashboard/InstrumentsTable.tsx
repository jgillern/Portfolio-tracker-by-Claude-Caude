'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { Quote } from '@/types/market';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { formatPercent, formatCurrency, cn } from '@/lib/utils';
import { hasCustomWeights } from '@/types/portfolio';
import { InstrumentLogo } from '@/components/ui/InstrumentLogo';

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

interface Props {
  quotes: Quote[];
  isLoading: boolean;
}

export function InstrumentsTable({ quotes, isLoading }: Props) {
  const { t } = useLanguage();
  const { activePortfolio } = usePortfolio();

  if (!activePortfolio) return null;
  const { instruments } = activePortfolio;
  const symbols = instruments.map((i) => i.symbol);

  if (instruments.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-center text-gray-500 dark:text-gray-400">
        <p>{t('dashboard.noInstruments')}</p>
        <p className="text-sm mt-1">{t('dashboard.addSome')}</p>
      </div>
    );
  }

  const showWeights = hasCustomWeights(activePortfolio);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('dashboard.instruments')}
        </h2>
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
                <th className="text-right px-2 py-3">{t('dashboard.weight')}</th>
                <th className="text-right px-2 py-3">{t('dashboard.price')}</th>
                <th className="text-right px-2 py-3">{t('dashboard.change24h')}</th>
                <th className="text-right px-2 py-3 hidden sm:table-cell">{t('dashboard.change1w')}</th>
                <th className="text-right px-2 py-3 hidden md:table-cell">{t('dashboard.change1m')}</th>
                <th className="text-right px-2 py-3 hidden lg:table-cell">{t('dashboard.change1y')}</th>
                <th className="text-right px-2 py-3 hidden lg:table-cell">{t('dashboard.changeYtd')}</th>
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
                      <div className="flex items-center gap-2.5">
                        <InstrumentLogo
                          symbol={instrument.symbol}
                          name={instrument.name}
                          type={instrument.type}
                          logoUrl={instrument.logoUrl}
                        />
                        <div>
                          <div className="font-medium text-sm text-gray-900 dark:text-white">
                            {instrument.symbol}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                            {instrument.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <Badge type={instrument.type} label={t(`types.${instrument.type}`)} />
                    </td>
                    <td className="px-2 py-3 text-right text-sm text-gray-900 dark:text-white">
                      {showWeights && instrument.weight != null
                        ? `${instrument.weight.toFixed(1)}%`
                        : '—'}
                    </td>
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
