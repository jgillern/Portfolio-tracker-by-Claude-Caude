export type InstrumentType = 'stock' | 'etf' | 'crypto' | 'bond' | 'commodity';

export interface Instrument {
  symbol: string;
  name: string;
  type: InstrumentType;
  sector?: string;
  weight?: number;
  addedAt: string;
}

export interface Portfolio {
  id: string;
  name: string;
  instruments: Instrument[];
  useCustomWeights: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioState {
  portfolios: Portfolio[];
  activePortfolioId: string | null;
}
