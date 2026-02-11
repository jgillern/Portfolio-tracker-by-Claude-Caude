import { TimePeriod } from '@/types/market';

export const TIME_PERIODS: { key: TimePeriod; label: { en: string; cs: string } }[] = [
  { key: '1d', label: { en: '1D', cs: '1D' } },
  { key: '1w', label: { en: '1W', cs: '1T' } },
  { key: '1mo', label: { en: '1M', cs: '1M' } },
  { key: '1y', label: { en: '1Y', cs: '1R' } },
  { key: '5y', label: { en: '5Y', cs: '5L' } },
  { key: 'ytd', label: { en: 'YTD', cs: 'YTD' } },
];

export const STORAGE_KEYS = {
  PORTFOLIO_STATE: 'portfolio-tracker-state',
  LANGUAGE: 'portfolio-tracker-lang',
  THEME: 'portfolio-tracker-theme',
} as const;

export const INSTRUMENT_TYPE_LABELS = {
  en: {
    stock: 'Stock',
    etf: 'ETF',
    crypto: 'Crypto',
    bond: 'Bond',
    commodity: 'Commodity',
  },
  cs: {
    stock: 'Akcie',
    etf: 'ETF',
    crypto: 'Krypto',
    bond: 'Dluhopis',
    commodity: 'Komodita',
  },
} as const;
