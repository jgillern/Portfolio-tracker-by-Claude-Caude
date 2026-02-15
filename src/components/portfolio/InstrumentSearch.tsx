'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSearch, SearchTypeFilter } from '@/hooks/useSearch';
import { SearchResult } from '@/types/api';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface Props {
  onSelect: (result: SearchResult) => void;
  existingSymbols: string[];
  filterFn?: (result: SearchResult) => boolean;
  placeholder?: string;
  searchMode?: 'index';
  /** When provided, shows type filter chips. E.g. ['stock', 'etf', 'crypto', 'index'] */
  availableTypes?: SearchTypeFilter[];
}

export function InstrumentSearch({ onSelect, existingSymbols, filterFn, placeholder, searchMode, availableTypes }: Props) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState<SearchTypeFilter | undefined>(undefined);
  const { results, isLoading } = useSearch(query, searchMode, activeType);

  const filteredResults = results
    .filter((r) => !existingSymbols.includes(r.symbol))
    .filter((r) => (filterFn ? filterFn(r) : true));

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder || t('search.placeholder')}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        autoFocus
      />

      {availableTypes && availableTypes.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveType(undefined)}
            className={cn(
              'px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
              !activeType
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            )}
          >
            {t('search.allTypes')}
          </button>
          {availableTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(activeType === type ? undefined : type)}
              className={cn(
                'px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
                activeType === type
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              )}
            >
              {t(`types.${type}`)}
            </button>
          ))}
        </div>
      )}

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
                {result.featured && (
                  <span className="text-amber-500 text-sm" title="Major index">&#9733;</span>
                )}
                <span className="font-medium text-sm text-gray-900 dark:text-white">
                  {result.symbol}
                </span>
                <Badge type={result.type} label={t(`types.${result.quoteType === 'INDEX' ? 'index' : result.type}`)} />
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
