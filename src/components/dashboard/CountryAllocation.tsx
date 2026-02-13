'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { useCountries } from '@/hooks/useCountries';
import { getPortfolioWeights } from '@/lib/utils';
import { Spinner } from '@/components/ui/Spinner';

const COUNTRY_COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500',
  'bg-red-500', 'bg-cyan-500', 'bg-yellow-500', 'bg-pink-500',
  'bg-indigo-500', 'bg-teal-500', 'bg-lime-500', 'bg-amber-500',
];

export function CountryAllocation() {
  const { t } = useLanguage();
  const { activePortfolio } = usePortfolio();

  const instruments = activePortfolio?.instruments ?? [];
  const symbols = instruments.map((i) => i.symbol);
  const types = instruments.map((i) => i.type);
  const weights = activePortfolio ? getPortfolioWeights(activePortfolio) : [];

  const { countries, isLoading } = useCountries(symbols, types, weights);

  if (!activePortfolio || instruments.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('dashboard.countryAllocation')}
      </h2>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      ) : countries.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('dashboard.noCountryData')}
        </p>
      ) : (
        <>
          <div className="flex h-4 rounded-full overflow-hidden mb-4">
            {countries.map((item, i) => (
              <div
                key={item.country}
                className={`${COUNTRY_COLORS[i % COUNTRY_COLORS.length]} transition-all`}
                style={{ width: `${item.percentage}%` }}
                title={`${item.country}: ${item.percentage.toFixed(1)}%`}
              />
            ))}
          </div>

          <div className="space-y-2">
            {countries.map((item, i) => (
              <div key={item.country} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${COUNTRY_COLORS[i % COUNTRY_COLORS.length]}`} />
                  {item.countryCode === 'N/A' ? (
                    <div className="flex items-center justify-center w-4 h-3 bg-gray-300 dark:bg-gray-600 rounded">
                      <span className="text-[8px] font-bold text-gray-600 dark:text-gray-300">?</span>
                    </div>
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={`https://flagcdn.com/16x12/${item.countryCode.toLowerCase()}.png`}
                      srcSet={`https://flagcdn.com/32x24/${item.countryCode.toLowerCase()}.png 2x`}
                      width={16}
                      height={12}
                      alt={item.country}
                      className="inline-block"
                    />
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {item.country}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
