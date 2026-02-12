'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { useNews } from '@/hooks/useNews';
import { NewsCard } from './NewsCard';
import { Spinner } from '@/components/ui/Spinner';
import { InstrumentLogo } from '@/components/ui/InstrumentLogo';

export function NewsFeed() {
  const { t } = useLanguage();
  const { activePortfolio } = usePortfolio();

  const allInstruments = activePortfolio?.instruments ?? [];
  const allSymbols = allInstruments.map((i) => i.symbol);

  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(allSymbols);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync selected symbols when portfolio instruments change
  const allSymbolsKey = allSymbols.join(',');
  useEffect(() => {
    setSelectedSymbols(allSymbols);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSymbolsKey]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { articles, isLoading } = useNews(selectedSymbols);

  const allSelected = selectedSymbols.length === allSymbols.length;

  function toggleSymbol(symbol: string) {
    setSelectedSymbols((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  }

  function selectAll() {
    setSelectedSymbols(allSymbols);
  }

  function deselectAll() {
    setSelectedSymbols([]);
  }

  const buttonLabel = useMemo(() => {
    if (selectedSymbols.length === 0) return t('news.filterNone');
    if (allSelected) return t('news.filterAll');
    if (selectedSymbols.length <= 2) return selectedSymbols.join(', ');
    return t('news.filterCount').replace('{count}', String(selectedSymbols.length));
  }, [selectedSymbols, allSelected, t]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('news.title')}
        </h1>

        {allInstruments.length > 0 && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500 transition-colors min-w-[160px]"
            >
              <svg className="h-4 w-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="truncate">{buttonLabel}</span>
              <svg className={`h-4 w-4 text-gray-400 shrink-0 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1 w-64 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-50 py-1">
                {/* Select All / Deselect All */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t('news.filterLabel')}
                  </span>
                  <button
                    onClick={allSelected ? deselectAll : selectAll}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {allSelected ? t('news.deselectAll') : t('news.selectAll')}
                  </button>
                </div>

                {/* Instrument list */}
                <div className="max-h-64 overflow-y-auto">
                  {allInstruments.map((instrument) => {
                    const isChecked = selectedSymbols.includes(instrument.symbol);
                    return (
                      <label
                        key={instrument.symbol}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSymbol(instrument.symbol)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <InstrumentLogo
                          symbol={instrument.symbol}
                          name={instrument.name}
                          type={instrument.type}
                          logoUrl={instrument.logoUrl}
                          size="sm"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-gray-900 dark:text-white font-medium truncate block">
                            {instrument.symbol}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 truncate block">
                            {instrument.name}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {!activePortfolio || allSymbols.length === 0 ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center text-gray-500">
          {t('news.noNews')}
        </div>
      ) : selectedSymbols.length === 0 ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center text-gray-500">
          {t('news.noSelection')}
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center text-gray-500">
          {t('news.noNews')}
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <NewsCard key={article.uuid} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
