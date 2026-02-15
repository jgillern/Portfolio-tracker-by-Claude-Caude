import { NextRequest, NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

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

// Cache
let cached: { data: { gainers: Mover[]; losers: Mover[] }; expiresAt: number } | null = null;

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get('mode') || 'percent'; // 'percent' | 'value'

  if (cached && Date.now() < cached.expiresAt) {
    const sorted = sortMovers(cached.data, mode);
    return NextResponse.json(sorted);
  }

  try {
    // Use Yahoo Finance trending tickers + top gainers/losers
    // Fetch a broad set of popular/active tickers
    const watchlistSymbols = [
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

    const allMovers: Mover[] = [];

    // Fetch quotes in batches
    const batchSize = 20;
    for (let i = 0; i < watchlistSymbols.length; i += batchSize) {
      const batch = watchlistSymbols.slice(i, i + batchSize);
      const results = await Promise.allSettled(
        batch.map(async (symbol) => {
          try {
            const quote = await yf.quote(symbol);
            const price = quote.regularMarketPrice ?? 0;
            const prevClose = quote.regularMarketPreviousClose ?? price;
            const changeAbs = price - prevClose;
            const changePct = quote.regularMarketChangePercent ?? 0;
            const mktCap = quote.marketCap ?? null;

            // Estimate market cap change
            const mktCapChange = mktCap && prevClose > 0
              ? mktCap * (changeAbs / prevClose)
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

    // Split into gainers and losers
    const gainers = allMovers
      .filter((m) => m.changePercent > 0)
      .sort((a, b) => b.changePercent - a.changePercent);
    const losers = allMovers
      .filter((m) => m.changePercent < 0)
      .sort((a, b) => a.changePercent - b.changePercent);

    const data = { gainers, losers };
    cached = { data, expiresAt: Date.now() + 5 * 60 * 1000 }; // 5 min cache

    const sorted = sortMovers(data, mode);
    return NextResponse.json(sorted);
  } catch (error) {
    console.error('Movers API error:', error);
    if (cached) {
      return NextResponse.json(sortMovers(cached.data, mode));
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
