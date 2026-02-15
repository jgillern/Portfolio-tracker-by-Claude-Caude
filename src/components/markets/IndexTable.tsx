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

/** Known index provider branding */
interface IndexProvider {
  name: string;
  initials: string;
  color: string;
  logoUrl?: string;
}

const INDEX_PROVIDER_MAP: Record<string, IndexProvider> = {
  '^GSPC': { name: 'S&P', initials: 'S&P', color: '#EF4444', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://spglobal.com&size=128' },
  '^GSPTSE': { name: 'S&P', initials: 'S&P', color: '#EF4444', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://spglobal.com&size=128' },
  '^IXIC': { name: 'NASDAQ', initials: 'NQ', color: '#0EA5E9', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://nasdaq.com&size=128' },
  '^NDX': { name: 'NASDAQ', initials: 'NQ', color: '#0EA5E9', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://nasdaq.com&size=128' },
  'URTH': { name: 'iShares / MSCI', initials: 'MS', color: '#3B82F6', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://msci.com&size=128' },
  'EEM': { name: 'iShares / MSCI', initials: 'MS', color: '#3B82F6', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://msci.com&size=128' },
  'ACWI': { name: 'iShares / MSCI', initials: 'MS', color: '#3B82F6', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://msci.com&size=128' },
  'MCHI': { name: 'iShares / MSCI', initials: 'MS', color: '#3B82F6', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://msci.com&size=128' },
  '^DJI': { name: 'Dow Jones', initials: 'DJ', color: '#1D4ED8', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://spglobal.com&size=128' },
  '^DJT': { name: 'Dow Jones', initials: 'DJ', color: '#1D4ED8', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://spglobal.com&size=128' },
  '^FTSE': { name: 'FTSE', initials: 'FT', color: '#DC2626', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://ftserussell.com&size=128' },
  '^N225': { name: 'Nikkei', initials: 'NK', color: '#6366F1', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://nikkei.com&size=128' },
  '^GDAXI': { name: 'DAX', initials: 'DX', color: '#F59E0B', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://deutsche-boerse.com&size=128' },
  '^HSI': { name: 'Hang Seng', initials: 'HS', color: '#10B981', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://hsi.com.hk&size=128' },
  '^STOXX50E': { name: 'STOXX', initials: 'SX', color: '#1D4ED8', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://stoxx.com&size=128' },
  '^FCHI': { name: 'Euronext', initials: 'CA', color: '#3B82F6', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://euronext.com&size=128' },
  '^RUT': { name: 'Russell', initials: 'RS', color: '#8B5CF6', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://ftserussell.com&size=128' },
  '^VIX': { name: 'CBOE', initials: 'VX', color: '#EF4444', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://cboe.com&size=128' },
};

/** Translation key mapping for index descriptions */
const INDEX_DESC_KEY: Record<string, string> = {
  '^GSPC': 'markets.descGspc',
  '^IXIC': 'markets.descIxic',
  'URTH': 'markets.descUrth',
  'EEM': 'markets.descEem',
  'ACWI': 'markets.descAcwi',
  '^DJI': 'markets.descDji',
  '^FTSE': 'markets.descFtse',
  '^N225': 'markets.descN225',
  '^GDAXI': 'markets.descGdaxi',
  '^HSI': 'markets.descHsi',
  '^STOXX50E': 'markets.descStoxx',
  '^FCHI': 'markets.descFchi',
  '^RUT': 'markets.descRut',
  '^VIX': 'markets.descVix',
};

function IndexProviderLogo({ symbol }: { symbol: string }) {
  const provider = INDEX_PROVIDER_MAP[symbol];
  const initials = provider?.initials || symbol.replace('^', '').substring(0, 2).toUpperCase();
  const color = provider?.color || '#6B7280';
  const [imgError, setImgError] = useState(false);

  if (provider?.logoUrl && !imgError) {
    return (
      <img
        src={provider.logoUrl}
        alt={provider.name}
        className="h-8 w-8 rounded-full object-cover shrink-0"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold shrink-0"
      style={{ backgroundColor: color, fontSize: '9px', letterSpacing: '-0.3px' }}
      title={provider?.name || symbol}
    >
      {initials}
    </div>
  );
}

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

  const allSymbols = [...getDefaultSymbols(), ...customSymbols];

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
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setCustomSymbols(parsed);
        }
      } catch {}
    })();
  }, [user]);

  const saveCustomSymbols = useCallback(async (symbols: string[]) => {
    setCustomSymbols(symbols);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(symbols));
    if (user) {
      try {
        await updatePreferences(user.id, { market_indexes: symbols });
      } catch {}
    }
  }, [user]);

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
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
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
        <div className="px-4 sm:px-6 pt-4">
          <InstrumentSearch
            onSelect={handleAddIndex}
            existingSymbols={allSymbols}
            searchMode="index"
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
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                <th className="text-left px-4 sm:px-6 py-3">{t('dashboard.name')}</th>
                <th className="text-right px-2 py-3">{t('dashboard.price')}</th>
                <th className="text-right px-2 py-3">{t('dashboard.change24h')}</th>
                <th className="text-right px-2 py-3 hidden sm:table-cell">{t('dashboard.change1w')}</th>
                <th className="text-right px-2 py-3 hidden md:table-cell">{t('dashboard.change1m')}</th>
                <th className="text-right px-2 py-3 hidden lg:table-cell">{t('dashboard.changeYtd')}</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {allSymbols.map((symbol) => {
                const q = quotes.find((qu) => qu.symbol === symbol);
                const known = knownIndex(symbol);
                const displayName = known?.shortName || q?.name || symbol;
                const descKey = INDEX_DESC_KEY[symbol];
                const description = descKey ? t(descKey) : '';
                const custom = isCustom(symbol);

                return (
                  <tr
                    key={symbol}
                    onClick={() => handleRowClick(symbol)}
                    className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-3">
                      <div className="flex items-center gap-3">
                        <IndexProviderLogo symbol={symbol} />
                        <div className="min-w-0">
                          <div className="font-semibold text-sm text-gray-900 dark:text-white">
                            {displayName}
                          </div>
                          {description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[220px]">
                              {description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                      {q ? q.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
                    </td>
                    <td className="px-2 py-3 text-right">
                      <ChangeCell value={q?.change24h} />
                    </td>
                    <td className="px-2 py-3 text-right hidden sm:table-cell">
                      <ChangeCell value={q?.change1w} />
                    </td>
                    <td className="px-2 py-3 text-right hidden md:table-cell">
                      <ChangeCell value={q?.change1m} />
                    </td>
                    <td className="px-2 py-3 text-right hidden lg:table-cell">
                      <ChangeCell value={q?.changeYtd} />
                    </td>
                    <td className="px-2 py-3">
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
