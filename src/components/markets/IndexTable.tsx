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
import { getIndexByTicker } from '@/config/indexes';

const STORAGE_KEY = 'market-index-table-symbols';

/** Known index provider branding */
interface IndexProvider {
  name: string;
  initials: string;
  color: string;
  logoUrl?: string;
}

/** Provider branding resolved by index name prefix or ticker */
const PROVIDER_BY_PREFIX: { prefix: string; provider: IndexProvider }[] = [
  { prefix: 'MSCI', provider: { name: 'MSCI', initials: 'MS', color: '#3B82F6', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://msci.com&size=128' } },
  { prefix: 'FTSE', provider: { name: 'FTSE Russell', initials: 'FT', color: '#DC2626', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://ftserussell.com&size=128' } },
  { prefix: 'S&P', provider: { name: 'S&P', initials: 'S&P', color: '#EF4444', logoUrl: '/logos/sp-global.svg' } },
  { prefix: 'NASDAQ', provider: { name: 'NASDAQ', initials: 'NQ', color: '#0EA5E9', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://nasdaq.com&size=128' } },
  { prefix: 'Dow Jones', provider: { name: 'Dow Jones', initials: 'DJ', color: '#1D4ED8', logoUrl: '/logos/dow-jones.svg' } },
  { prefix: 'Russell', provider: { name: 'Russell', initials: 'RS', color: '#8B5CF6', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://ftserussell.com&size=128' } },
  { prefix: 'EURO STOXX', provider: { name: 'STOXX', initials: 'SX', color: '#1D4ED8', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://stoxx.com&size=128' } },
  { prefix: 'STOXX', provider: { name: 'STOXX', initials: 'SX', color: '#1D4ED8', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://stoxx.com&size=128' } },
  { prefix: 'Vanguard', provider: { name: 'Vanguard', initials: 'VG', color: '#991B1B', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://vanguard.com&size=128' } },
];

/** Fallback map for tickers without a matching name prefix */
const TICKER_PROVIDER_MAP: Record<string, IndexProvider> = {
  '^GSPC': { name: 'S&P', initials: 'S&P', color: '#EF4444', logoUrl: '/logos/sp-global.svg' },
  '^DJI': { name: 'Dow Jones', initials: 'DJ', color: '#1D4ED8', logoUrl: '/logos/dow-jones.svg' },
  '^N225': { name: 'Nikkei', initials: 'NK', color: '#6366F1', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://nikkei.com&size=128' },
  '^GDAXI': { name: 'DAX', initials: 'DX', color: '#F59E0B', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://deutsche-boerse.com&size=128' },
  '^MDAXI': { name: 'DAX', initials: 'DX', color: '#F59E0B', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://deutsche-boerse.com&size=128' },
  '^HSI': { name: 'Hang Seng', initials: 'HS', color: '#10B981', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://hsi.com.hk&size=128' },
  '^FCHI': { name: 'Euronext', initials: 'CA', color: '#3B82F6', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://euronext.com&size=128' },
  '^SSMI': { name: 'SIX', initials: 'SM', color: '#1E40AF', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://six-group.com&size=128' },
  '^IBEX': { name: 'BME', initials: 'IB', color: '#CA8A04', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://bolsasymercados.es&size=128' },
  '^AEX': { name: 'Euronext', initials: 'AE', color: '#3B82F6', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://euronext.com&size=128' },
  '^VIX': { name: 'CBOE', initials: 'VX', color: '#EF4444', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://cboe.com&size=128' },
  // FTSE direct indexes
  '^FTSE': { name: 'FTSE Russell', initials: 'FT', color: '#DC2626', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://ftserussell.com&size=128' },
  '^FTMC': { name: 'FTSE Russell', initials: 'FT', color: '#DC2626', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://ftserussell.com&size=128' },
  '^FTAS': { name: 'FTSE Russell', initials: 'FT', color: '#DC2626', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://ftserussell.com&size=128' },
  // STOXX direct index
  '^STOXX': { name: 'STOXX', initials: 'SX', color: '#1D4ED8', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://stoxx.com&size=128' },
  // Thematic / Specialty ETFs
  'BOTZ': { name: 'Global X', initials: 'GX', color: '#F97316', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://globalxetfs.com&size=128' },
  'CIBR': { name: 'First Trust', initials: 'FT', color: '#1E3A5F', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://ftportfolios.com&size=128' },
  'SKYY': { name: 'First Trust', initials: 'FT', color: '#1E3A5F', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://ftportfolios.com&size=128' },
  'SMH': { name: 'VanEck', initials: 'VE', color: '#0C4A6E', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://vaneck.com&size=128' },
  'SOXX': { name: 'iShares', initials: 'iS', color: '#000000', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://ishares.com&size=128' },
  'ARKG': { name: 'ARK Invest', initials: 'AK', color: '#FFFFFF', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://ark-invest.com&size=128' },
  'ARKX': { name: 'ARK Invest', initials: 'AK', color: '#FFFFFF', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://ark-invest.com&size=128' },
  'LIT': { name: 'Global X', initials: 'GX', color: '#F97316', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://globalxetfs.com&size=128' },
  'ICLN': { name: 'iShares', initials: 'iS', color: '#000000', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://ishares.com&size=128' },
  'URA': { name: 'Global X', initials: 'GX', color: '#F97316', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://globalxetfs.com&size=128' },
  'BLOK': { name: 'Amplify', initials: 'AM', color: '#7C3AED', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://amplifyetfs.com&size=128' },
  'ESPO': { name: 'VanEck', initials: 'VE', color: '#0C4A6E', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://vaneck.com&size=128' },
  'CGW': { name: 'Invesco', initials: 'IV', color: '#003D79', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://invesco.com&size=128' },
  'VEGI': { name: 'iShares', initials: 'iS', color: '#000000', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://ishares.com&size=128' },
  // US Factor ETFs
  'MTUM': { name: 'iShares', initials: 'iS', color: '#000000', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://ishares.com&size=128' },
  'QUAL': { name: 'iShares', initials: 'iS', color: '#000000', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://ishares.com&size=128' },
  'VLUE': { name: 'iShares', initials: 'iS', color: '#000000', logoUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://ishares.com&size=128' },
};

function resolveProvider(symbol: string): IndexProvider | undefined {
  // 1. Check ticker-specific overrides first
  if (TICKER_PROVIDER_MAP[symbol]) return TICKER_PROVIDER_MAP[symbol];
  // 2. Look up index name from our predefined config and match by prefix
  const idx = getIndexByTicker(symbol);
  if (idx) {
    for (const { prefix, provider } of PROVIDER_BY_PREFIX) {
      if (idx.name.startsWith(prefix)) return provider;
    }
  }
  return undefined;
}


function IndexProviderLogo({ symbol }: { symbol: string }) {
  const provider = resolveProvider(symbol);
  const initials = provider?.initials || symbol.replace('^', '').substring(0, 2).toUpperCase();
  const color = provider?.color || '#6B7280';
  const isLocalLogo = provider?.logoUrl?.startsWith('/logos/');
  // For local custom logos, use them directly; otherwise try: 1) logoUrl, 2) /api/logo proxy, 3) initials
  const [fallback, setFallback] = useState(0);

  const src =
    isLocalLogo
      ? (fallback === 0 ? provider!.logoUrl! : null)
      : fallback === 0 && provider?.logoUrl
        ? provider.logoUrl
        : fallback <= 1
          ? `/api/logo?symbol=${encodeURIComponent(symbol)}&type=stock`
          : null;

  if (src) {
    return (
      <img
        src={src}
        alt={provider?.name || symbol}
        className={cn("h-8 w-8 shrink-0 object-cover", isLocalLogo ? "rounded-md" : "rounded-full")}
        onError={() => setFallback((f) => f + 1)}
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
    fetch(`/api/quote?symbols=${allSymbols.map(encodeURIComponent).join(',')}`)
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
                const predefinedIndex = getIndexByTicker(symbol);
                const displayName = known?.shortName || predefinedIndex?.name || q?.name || symbol;
                const description = predefinedIndex?.description || '';
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
