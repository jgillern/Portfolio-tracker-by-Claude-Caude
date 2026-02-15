/** Market index definitions used across the app */

export interface MarketIndex {
  symbol: string;
  name: string;
  shortName: string;
}

/** Indexes available for the dashboard comparison chart */
export const COMPARISON_INDEXES: MarketIndex[] = [
  { symbol: '^GSPC', name: 'S&P 500', shortName: 'S&P 500' },
  { symbol: '^IXIC', name: 'Nasdaq Composite', shortName: 'Nasdaq' },
  { symbol: 'URTH', name: 'MSCI World (URTH)', shortName: 'MSCI World' },
  { symbol: 'ACWI', name: 'MSCI ACWI (ACWI)', shortName: 'MSCI ACWI' },
];

/** Indexes displayed on the Markets page (daily movements + chart) */
export const MARKET_INDEXES: MarketIndex[] = [
  { symbol: '^GSPC', name: 'S&P 500', shortName: 'S&P 500' },
  { symbol: '^IXIC', name: 'Nasdaq Composite', shortName: 'Nasdaq' },
  { symbol: 'URTH', name: 'MSCI World (URTH)', shortName: 'MSCI World' },
  { symbol: 'EEM', name: 'MSCI Emerging Markets (EEM)', shortName: 'MSCI EM' },
  { symbol: 'ACWI', name: 'MSCI ACWI (ACWI)', shortName: 'MSCI ACWI' },
];

/** Default-enabled indexes on Markets chart */
export const DEFAULT_ENABLED_INDEXES = ['^GSPC', 'URTH'];
