import { NextRequest, NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import { subDays, subMonths, startOfYear } from 'date-fns';

const yf = new YahooFinance();

interface Mover {
  symbol: string;
  name: string;
  price: number;
  change: number;       // absolute price change
  changePercent: number; // percentage change
  marketCap: number | null;
  marketCapChange: number | null; // absolute market cap change
}

type MoverPeriod = '24h' | '1w' | '1m' | 'ytd';

// Cache per period
const cacheMap = new Map<string, { data: { gainers: Mover[]; losers: Mover[] }; expiresAt: number }>();

const WATCHLIST = [
  // Major US stocks
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'BRK-B',
  'JPM', 'V', 'UNH', 'XOM', 'JNJ', 'WMT', 'PG', 'MA', 'HD', 'CVX',
  'MRK', 'ABBV', 'KO', 'PEP', 'COST', 'AVGO', 'TMO', 'MCD', 'CSCO',
  'ACN', 'ABT', 'DHR', 'NKE', 'TXN', 'NEE', 'PM', 'LIN', 'UNP',
  'AMD', 'INTC', 'CRM', 'ORCL', 'ADBE', 'NFLX', 'QCOM', 'BA',
  'CAT', 'GS', 'MS', 'UBER', 'ABNB', 'SQ', 'SHOP', 'COIN', 'PLTR',
  'SNOW', 'CRWD', 'ZS', 'NET', 'DDOG', 'MELI', 'SE',
  // Crypto
  'BTC-USD', 'ETH-USD', 'SOL-USD', 'XRP-USD', 'ADA-USD', 'DOGE-USD',
  // Popular ETFs
  'SPY', 'QQQ', 'IWM', 'VTI', 'ARKK',
];

function getPeriodStartDate(period: MoverPeriod): Date | null {
  const now = new Date();
  switch (period) {
    case '1w': return subDays(now, 7);
    case '1m': return subMonths(now, 1);
    case 'ytd': return startOfYear(now);
    default: return null; // 24h uses regularMarketChangePercent
  }
}

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get('mode') || 'percent';
  const period = (request.nextUrl.searchParams.get('period') || '24h') as MoverPeriod;

  const cacheKey = `movers:${period}`;
  const cached = cacheMap.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    const sorted = sortMovers(cached.data, mode);
    return NextResponse.json(sorted);
  }

  try {
    const periodStart = getPeriodStartDate(period);
    const allMovers: Mover[] = [];
    const batchSize = 20;

    for (let i = 0; i < WATCHLIST.length; i += batchSize) {
      const batch = WATCHLIST.slice(i, i + batchSize);
      const results = await Promise.allSettled(
        batch.map(async (symbol) => {
          try {
            const quote = await yf.quote(symbol);
            const price = quote.regularMarketPrice ?? 0;
            const mktCap = quote.marketCap ?? null;

            let changePct: number;

            if (!periodStart) {
              // 24h: use daily change directly
              changePct = quote.regularMarketChangePercent ?? 0;
            } else {
              // Longer periods: fetch historical data
              try {
                const now = new Date();
                const historical = await yf.chart(symbol, {
                  period1: periodStart,
                  period2: now,
                  interval: '1d',
                });
                const chartQuotes = historical.quotes || [];
                if (chartQuotes.length > 0) {
                  const firstClose = chartQuotes[0].close ?? price;
                  changePct = firstClose > 0 ? ((price - firstClose) / firstClose) * 100 : 0;
                } else {
                  changePct = 0;
                }
              } catch {
                changePct = 0;
              }
            }

            const prevPrice = changePct !== 0 ? price / (1 + changePct / 100) : price;
            const changeAbs = price - prevPrice;
            const mktCapChange = mktCap && prevPrice > 0
              ? mktCap * (changeAbs / price)
              : null;

            return {
              symbol,
              name: quote.shortName || quote.longName || symbol,
              price,
              change: changeAbs,
              changePercent: changePct,
              marketCap: mktCap,
              marketCapChange: mktCapChange ? Math.round(mktCapChange) : null,
            } as Mover;
          } catch {
            return null;
          }
        })
      );

      for (const r of results) {
        if (r.status === 'fulfilled' && r.value) {
          allMovers.push(r.value);
        }
      }
    }

    const gainers = allMovers
      .filter((m) => m.changePercent > 0)
      .sort((a, b) => b.changePercent - a.changePercent);
    const losers = allMovers
      .filter((m) => m.changePercent < 0)
      .sort((a, b) => a.changePercent - b.changePercent);

    const data = { gainers, losers };
    // Cache for 5 min for 24h, 15 min for longer periods
    const ttl = period === '24h' ? 5 * 60 * 1000 : 15 * 60 * 1000;
    cacheMap.set(cacheKey, { data, expiresAt: Date.now() + ttl });

    const sorted = sortMovers(data, mode);
    return NextResponse.json(sorted);
  } catch (error) {
    console.error('Movers API error:', error);
    const fallback = cacheMap.get(cacheKey);
    if (fallback) {
      return NextResponse.json(sortMovers(fallback.data, mode));
    }
    return NextResponse.json({ error: 'Failed to fetch market movers' }, { status: 500 });
  }
}

function sortMovers(
  data: { gainers: Mover[]; losers: Mover[] },
  mode: string
): { gainers: Mover[]; losers: Mover[] } {
  if (mode === 'value') {
    return {
      gainers: [...data.gainers]
        .filter((m) => m.marketCapChange != null)
        .sort((a, b) => (b.marketCapChange ?? 0) - (a.marketCapChange ?? 0))
        .slice(0, 10),
      losers: [...data.losers]
        .filter((m) => m.marketCapChange != null)
        .sort((a, b) => (a.marketCapChange ?? 0) - (b.marketCapChange ?? 0))
        .slice(0, 10),
    };
  }
  return {
    gainers: data.gainers.slice(0, 10),
    losers: data.losers.slice(0, 10),
  };
}
