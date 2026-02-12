export interface Quote {
  symbol: string;
  name: string;
  price: number;
  currency: string;
  change24h: number;
  change1w: number;
  change1m: number;
  change1y: number;
  changeYtd: number;
}

export interface ChartDataPoint {
  timestamp: number;
  value: number;
}

export interface NewsArticle {
  uuid: string;
  title: string;
  summary: string;
  thumbnailUrl: string | null;
  link: string;
  publisher: string;
  publishedAt: string;
  relatedSymbols: string[];
}

export type TimePeriod = '1d' | '1w' | '1mo' | '1y' | '5y' | 'ytd';

export type CalendarEventType = 'earnings' | 'dividend' | 'split' | 'other';

export interface CalendarEvent {
  symbol: string;
  name: string;
  type: CalendarEventType;
  date: string;
  title: string;
  detail?: string;
}

export interface PortfolioMetrics {
  peRatio: number | null;
  sharpeRatio: number | null;
  beta: number | null;
  alpha: number | null;
  sortinoRatio: number | null;
  treynorRatio: number | null;
}

export interface CountryAllocationItem {
  country: string;
  countryCode: string;
  percentage: number;
}
