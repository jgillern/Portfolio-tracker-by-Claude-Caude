export type InstrumentType = 'stock' | 'etf' | 'crypto' | 'bond' | 'commodity';

export interface Instrument {
  symbol: string;
  name: string;
  type: InstrumentType;
  sector?: string;
  weight?: number;
  logoUrl?: string;
  addedAt: string;
}

export interface Portfolio {
  id: string;
  name: string;
  instruments: Instrument[];
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioState {
  portfolios: Portfolio[];
  activePortfolioId: string | null;
}

/**
 * Returns true if the portfolio uses custom weights
 * (i.e. at least one instrument has a weight defined).
 */
export function hasCustomWeights(portfolio: Portfolio): boolean {
  return portfolio.instruments.some((i) => i.weight != null && i.weight > 0);
}
