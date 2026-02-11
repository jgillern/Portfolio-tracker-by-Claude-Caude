import { InstrumentType } from '@/types/portfolio';

// Static sector mapping for instrument types that don't have sector data from Yahoo
export const DEFAULT_SECTORS: Record<InstrumentType, string> = {
  crypto: 'Cryptocurrency',
  bond: 'Fixed Income',
  commodity: 'Commodities',
  stock: 'Other',
  etf: 'ETF',
};

export const SECTOR_LABELS: Record<string, { en: string; cs: string }> = {
  Technology: { en: 'Technology', cs: 'Technologie' },
  'Financial Services': { en: 'Financial Services', cs: 'Finanční služby' },
  Healthcare: { en: 'Healthcare', cs: 'Zdravotnictví' },
  'Consumer Cyclical': { en: 'Consumer Cyclical', cs: 'Cyklické spotřební zboží' },
  'Consumer Defensive': { en: 'Consumer Defensive', cs: 'Defenzivní spotřební zboží' },
  Energy: { en: 'Energy', cs: 'Energie' },
  Industrials: { en: 'Industrials', cs: 'Průmysl' },
  'Basic Materials': { en: 'Basic Materials', cs: 'Základní materiály' },
  'Communication Services': { en: 'Communication Services', cs: 'Komunikační služby' },
  Utilities: { en: 'Utilities', cs: 'Veřejné služby' },
  'Real Estate': { en: 'Real Estate', cs: 'Nemovitosti' },
  Cryptocurrency: { en: 'Cryptocurrency', cs: 'Kryptoměny' },
  'Fixed Income': { en: 'Fixed Income', cs: 'Dluhopisy' },
  Commodities: { en: 'Commodities', cs: 'Komodity' },
  ETF: { en: 'ETF', cs: 'ETF' },
  Other: { en: 'Other', cs: 'Ostatní' },
};
