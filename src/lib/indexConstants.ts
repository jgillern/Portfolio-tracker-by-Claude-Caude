/** Market index definitions used across the app */

import { ALL_INDEXES, getIndexByTicker } from '@/config/indexes';

export interface MarketIndex {
  symbol: string;
  name: string;
  shortName: string;
}

/** Indexes available for the dashboard comparison chart */
export const COMPARISON_INDEXES: MarketIndex[] = [
  { symbol: '^GSPC', name: 'S&P 500', shortName: 'S&P 500' },
  { symbol: '^IXIC', name: 'NASDAQ Composite', shortName: 'Nasdaq' },
  { symbol: 'URTH', name: 'MSCI World', shortName: 'MSCI World' },
  { symbol: 'ACWI', name: 'MSCI ACWI', shortName: 'MSCI ACWI' },
];

/** Indexes displayed on the Markets page (daily movements + chart) */
export const MARKET_INDEXES: MarketIndex[] = [
  { symbol: '^GSPC', name: 'S&P 500', shortName: 'S&P 500' },
  { symbol: '^IXIC', name: 'NASDAQ Composite', shortName: 'Nasdaq' },
  { symbol: 'URTH', name: 'MSCI World', shortName: 'MSCI World' },
  { symbol: 'EEM', name: 'MSCI Emerging Markets', shortName: 'MSCI EM' },
  { symbol: 'ACWI', name: 'MSCI ACWI', shortName: 'MSCI ACWI' },
];

/** Default-enabled indexes on Markets chart */
export const DEFAULT_ENABLED_INDEXES = ['^GSPC', 'URTH'];

/** Set of all known index tickers (from predefined list) */
export const FEATURED_INDICES = new Set(ALL_INDEXES.map((i) => i.ticker));

/**
 * Resolve display name for a ticker.
 * Returns the index name from our predefined list, or falls back to the ticker itself.
 */
export function getIndexDisplayName(ticker: string): string {
  const idx = getIndexByTicker(ticker);
  return idx?.name ?? ticker;
}
