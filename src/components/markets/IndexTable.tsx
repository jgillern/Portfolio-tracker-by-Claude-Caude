'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';
import { MARKET_INDEXES } from '@/lib/indexConstants';
import type { Quote } from '@/types/market';
import type { MarketIndex } from '@/lib/indexConstants';
import { InstrumentSearch } from '@/components/portfolio/InstrumentSearch';
import { IndexDetailModal } from './IndexDetailModal';
import { useAuth } from '@/context/AuthContext';
import { getPreferences, updatePreferences } from '@/lib/supabase/database';

const STORAGE_KEY = 'market-index-table-symbols';

function getDefaultSymbols(): string[] {
  return MARKET_INDEXES.map((i) => i.symbol);
}

export function IndexTable() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [customSymbols, setCustomSymbols] = useState<string[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  // All symbols: default MARKET_INDEXES + custom ones
  const allSymbols = [...getDefaultSymbols(), ...customSymbols];

  // Load custom symbols from DB or localStorage
  useEffect(() => {
    (async () => {
      if (user) {
        try {
          const prefs = await getPreferences(user.id);
          if (prefs?.market_indexes && prefs.market_indexes.length > 0) {
            setCustomSymbols(prefs.market_indexes);
            return;
          }
        } catch {}
      }
      // Fallback to localStorage
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setCustomSymbols(parsed);
        }
      } catch {}
    })();
  }, [user]);

  // Save custom symbols
  const saveCustomSymbols = useCallback(async (symbols: string[]) => {
    setCustomSymbols(symbols);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(symbols));
    if (user) {
      try {
        await updatePreferences(user.id, { market_indexes: symbols });
      } catch {}
    }
  }, [user]);

  // Fetch quotes
  useEffect(() => {
    if (allSymbols.length === 0) return;
    setIsLoading(true);
    fetch(`/api/quote?symbols=${allSymbols.join(',')}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setQuotes(data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [allSymbols.join(',')]);

  const handleAddIndex = (result: { symbol: string; name: string }) => {
    if (!customSymbols.includes(result.symbol) && !getDefaultSymbols().includes(result.symbol)) {
      saveCustomSymbols([...customSymbols, result.symbol]);
    }
    setShowSearch(false);
  };

  const handleRemoveCustom = (symbol: string) => {
    saveCustomSymbols(customSymbols.filter((s) => s !== symbol));
  };

  const handleRowClick = (symbol: string) => {
    const q = quotes.find((q) => q.symbol === symbol) ?? null;
    setSelectedQuote(q);
    setSelectedSymbol(symbol);
  };

  const knownIndex = (symbol: string): MarketIndex | undefined =>
    MARKET_INDEXES.find((i) => i.symbol === symbol);

  const isCustom = (symbol: string): boolean =>
    customSymbols.includes(symbol);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('markets.indexOverview')}
        </h2>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('markets.addCustomIndex')}
        </button>
      </div>

      {showSearch && (
        <div className="mb-4">
          <InstrumentSearch
            onSelect={handleAddIndex}
            existingSymbols={allSymbols}
            filterFn={(r) => r.quoteType === 'INDEX' || r.quoteType === 'ETF'}
            placeholder={t('markets.searchIndexPlaceholder')}
          />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner className="h-6 w-6" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {t('dashboard.name')}
                </th>
                <th className="text-right py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {t('dashboard.price')}
                </th>
                <th className="text-right py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {t('dashboard.change24h')}
                </th>
                <th className="text-right py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase hidden sm:table-cell">
                  {t('dashboard.change1w')}
                </th>
                <th className="text-right py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase hidden md:table-cell">
                  {t('dashboard.change1m')}
                </th>
                <th className="text-right py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase hidden lg:table-cell">
                  {t('dashboard.changeYtd')}
                </th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {allSymbols.map((symbol) => {
                const q = quotes.find((qu) => qu.symbol === symbol);
                const known = knownIndex(symbol);
                const displayName = known?.shortName || q?.name || symbol;
                const custom = isCustom(symbol);

                return (
                  <tr
                    key={symbol}
                    onClick={() => handleRowClick(symbol)}
                    className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white">{displayName}</span>
                        <span className="text-xs text-gray-400">{symbol}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-gray-900 dark:text-white">
                      {q ? q.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <ChangeCell value={q?.change24h} />
                    </td>
                    <td className="py-3 px-3 text-right hidden sm:table-cell">
                      <ChangeCell value={q?.change1w} />
                    </td>
                    <td className="py-3 px-3 text-right hidden md:table-cell">
                      <ChangeCell value={q?.change1m} />
                    </td>
                    <td className="py-3 px-3 text-right hidden lg:table-cell">
                      <ChangeCell value={q?.changeYtd} />
                    </td>
                    <td className="py-3 px-1">
                      {custom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveCustom(symbol);
                          }}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          title={t('markets.removeIndex')}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <IndexDetailModal
        isOpen={selectedSymbol !== null}
        onClose={() => { setSelectedSymbol(null); setSelectedQuote(null); }}
        symbol={selectedSymbol}
        quote={selectedQuote}
      />
    </div>
  );
}

function ChangeCell({ value }: { value: number | undefined | null }) {
  if (value == null) return <span className="text-gray-400">—</span>;
  const positive = value >= 0;
  return (
    <span
      className={cn(
        'text-sm font-semibold',
        positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
      )}
    >
      {positive ? '+' : ''}{value.toFixed(2)}%
    </span>
  );
}
