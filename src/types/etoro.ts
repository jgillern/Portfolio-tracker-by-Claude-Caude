export interface EToroUser {
  username: string;
  fullName: string;
  avatarUrl: string;
  copiers: number;
  gainPct: number;
  riskScore: number;
  isPro: boolean;
  country: string;
}

export interface EToroPosition {
  instrumentId: number;
  instrumentName: string;
  ticker: string;
  yahooSymbol: string | null;
  direction: 'buy' | 'sell';
  invested: number;
  currentValue: number;
  pnl: number;
  pnlPct: number;
  allocationPct: number;
  type: 'stock' | 'etf' | 'crypto' | 'commodity' | 'currency';
}

export interface EToroStats {
  yearlyReturns: Record<string, number>;
  winRatio: number;
  profitableWeeks: number;
  riskScore: number;
  maxDailyDrawdown: number;
  maxWeeklyDrawdown: number;
  totalTrades: number;
  copiers: number;
}

export interface EToroPortfolioData {
  profile: EToroUser;
  positions: EToroPosition[];
  stats: EToroStats;
}
