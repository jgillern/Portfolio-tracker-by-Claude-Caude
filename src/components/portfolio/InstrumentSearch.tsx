'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSearch } from '@/hooks/useSearch';
import { SearchResult } from '@/types/api';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';

interface Props {
  onSelect: (result: SearchResult) => void;
  existingSymbols: string[];
}

export function InstrumentSearch({ onSelect, existingSymbols }: Props) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const { results, isLoading } = useSearch(query);

  const filteredResults = results.filter((r) => !existingSymbols.includes(r.symbol));

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('search.placeholder')}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        autoFocus
      />

      <div className="max-h-64 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <Spinner />
            <span className="ml-2 text-sm text-gray-500">{t('search.searching')}</span>
          </div>
        )}

        {!isLoading && query.length > 0 && filteredResults.length === 0 && (
          <p className="py-4 text-center text-sm text-gray-500">{t('search.noResults')}</p>
        )}

        {filteredResults.map((result) => (
          <button
            key={result.symbol}
            onClick={() => {
              onSelect(result);
              setQuery('');
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-gray-900 dark:text-white">
                  {result.symbol}
                </span>
                <Badge type={result.type} label={t(`types.${result.type}`)} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{result.name}</p>
            </div>
            <span className="text-xs text-gray-400 ml-2">{result.exchange}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
