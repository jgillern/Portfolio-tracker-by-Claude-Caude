import YahooFinance from 'yahoo-finance2';
import { SearchResult } from '@/types/api';
import { InstrumentType } from '@/types/portfolio';
import { Quote, ChartDataPoint, NewsArticle, TimePeriod } from '@/types/market';
import { subDays, subMonths, subYears, startOfYear } from 'date-fns';

const yf = new YahooFinance();

// Simple in-memory cache
const cache = new Map<string, { data: unknown; expiresAt: number }>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache(key: string, data: unknown, ttlMs: number) {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

function mapQuoteType(quoteType: string): InstrumentType {
  switch (quoteType?.toUpperCase()) {
    case 'EQUITY':
      return 'stock';
    case 'ETF':
      return 'etf';
    case 'CRYPTOCURRENCY':
      return 'crypto';
    case 'MUTUALFUND':
      return 'etf';
    case 'FUTURE':
    case 'COMMODITY':
      return 'commodity';
    default:
      return 'stock';
  }
}

export async function searchInstruments(query: string): Promise<SearchResult[]> {
  const cacheKey = `search:${query}`;
  const cached = getCached<SearchResult[]>(cacheKey);
  if (cached) return cached;

  try {
    const result = await yf.search(query, { quotesCount: 10, newsCount: 0 });
    const results: SearchResult[] = (result.quotes || [])
      .filter((q): q is Extract<typeof q, { isYahooFinance: true }> =>
        'isYahooFinance' in q && q.isYahooFinance === true
      )
      .map((q) => ({
        symbol: q.symbol,
        name: q.shortname || q.longname || q.symbol,
        type: mapQuoteType('quoteType' in q ? (q as { quoteType: string }).quoteType : ''),
        exchange: q.exchange || '',
        sector: q.sector,
      }));

    setCache(cacheKey, results, 10 * 60 * 1000);
    return results;
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

export async function getQuotes(symbols: string[]): Promise<Quote[]> {
  const results: Quote[] = [];

  await Promise.allSettled(
    symbols.map(async (symbol) => {
      const cacheKey = `quote:${symbol}`;
      const cached = getCached<Quote>(cacheKey);
      if (cached) {
        results.push(cached);
        return;
      }

      try {
        const quote = await yf.quote(symbol);
        const now = new Date();
        const currentPrice = quote.regularMarketPrice ?? 0;

        let change1w = 0, change1m = 0, change1y = 0, changeYtd = 0;

        try {
          const historical = await yf.chart(symbol, {
            period1: subYears(now, 1),
            period2: now,
            interval: '1d',
          });

          const chartQuotes = historical.quotes || [];
          if (chartQuotes.length > 0) {
            const findClosest = (targetDate: Date) => {
              const target = targetDate.getTime();
              let closest = chartQuotes[0];
              for (const cq of chartQuotes) {
                if (cq.date && Math.abs(cq.date.getTime() - target) < Math.abs(closest.date.getTime() - target)) {
                  closest = cq;
                }
              }
              return closest.close ?? currentPrice;
            };

            const periods = [
              { key: '1w', date: subDays(now, 7) },
              { key: '1m', date: subMonths(now, 1) },
              { key: '1y', date: subYears(now, 1) },
              { key: 'ytd', date: startOfYear(now) },
            ];

            for (const p of periods) {
              const historicalPrice = findClosest(p.date);
              const change = historicalPrice > 0 ? ((currentPrice - historicalPrice) / historicalPrice) * 100 : 0;
              switch (p.key) {
                case '1w': change1w = change; break;
                case '1m': change1m = change; break;
                case '1y': change1y = change; break;
                case 'ytd': changeYtd = change; break;
              }
            }
          }
        } catch {
          // Historical data unavailable
        }

        const q: Quote = {
          symbol,
          name: quote.shortName || quote.longName || symbol,
          price: currentPrice,
          currency: quote.currency || 'USD',
          change24h: quote.regularMarketChangePercent ?? 0,
          change1w,
          change1m,
          change1y,
          changeYtd,
        };

        setCache(cacheKey, q, 60 * 1000);
        results.push(q);
      } catch (error) {
        console.error(`Quote error for ${symbol}:`, error);
      }
    })
  );

  return results;
}

export async function getChart(
  symbols: string[],
  period: TimePeriod,
  weights?: number[]
): Promise<ChartDataPoint[]> {
  const cacheKey = `chart:${symbols.join(',')}:${period}:${weights?.join(',')}`;
  const cached = getCached<ChartDataPoint[]>(cacheKey);
  if (cached) return cached;

  const now = new Date();
  let period1: Date;
  let interval: '1m' | '5m' | '15m' | '1d' | '1wk' | '1mo';

  switch (period) {
    case '1d':
      period1 = subDays(now, 1);
      interval = '5m';
      break;
    case '1w':
      period1 = subDays(now, 7);
      interval = '15m';
      break;
    case '1mo':
      period1 = subMonths(now, 1);
      interval = '1d';
      break;
    case '1y':
      period1 = subYears(now, 1);
      interval = '1wk';
      break;
    case '5y':
      period1 = subYears(now, 5);
      interval = '1mo';
      break;
    case 'ytd':
      period1 = startOfYear(now);
      interval = '1d';
      break;
    default:
      period1 = subMonths(now, 1);
      interval = '1d';
  }

  try {
    const allSeries: { timestamp: number; normalizedPrice: number }[][] = [];

    await Promise.allSettled(
      symbols.map(async (symbol) => {
        try {
          const chart = await yf.chart(symbol, {
            period1,
            period2: now,
            interval,
          });

          const chartQuotes = chart.quotes || [];
          if (chartQuotes.length === 0) return;

          const basePrice = chartQuotes[0].close ?? chartQuotes[0].open ?? 1;
          const series = chartQuotes
            .filter((cq) => cq.date && cq.close != null)
            .map((cq) => ({
              timestamp: cq.date.getTime(),
              normalizedPrice: (cq.close! / basePrice) * 100,
            }));

          allSeries.push(series);
        } catch (error) {
          console.error(`Chart error for ${symbol}:`, error);
        }
      })
    );

    if (allSeries.length === 0) return [];

    const baseSeries = allSeries.reduce((a, b) => (a.length > b.length ? a : b));
    const effectiveWeights = weights ?? Array(allSeries.length).fill(100 / allSeries.length) as number[];

    const result: ChartDataPoint[] = baseSeries.map((point, idx) => {
      let weightedSum = 0;
      let totalWeight = 0;

      for (let i = 0; i < allSeries.length; i++) {
        const series = allSeries[i];
        const seriesPoint = series[Math.min(idx, series.length - 1)];
        const w = effectiveWeights[i] ?? 100 / allSeries.length;
        weightedSum += seriesPoint.normalizedPrice * w;
        totalWeight += w;
      }

      return {
        timestamp: point.timestamp,
        value: totalWeight > 0 ? weightedSum / totalWeight : 0,
      };
    });

    setCache(cacheKey, result, 5 * 60 * 1000);
    return result;
  } catch (error) {
    console.error('Chart error:', error);
    return [];
  }
}

export async function getNews(symbols: string[]): Promise<NewsArticle[]> {
  const cacheKey = `news:${symbols.join(',')}`;
  const cached = getCached<NewsArticle[]>(cacheKey);
  if (cached) return cached;

  const allArticles = new Map<string, NewsArticle>();

  await Promise.allSettled(
    symbols.slice(0, 10).map(async (symbol) => {
      try {
        const result = await yf.search(symbol, { quotesCount: 0, newsCount: 5 });
        const news = result.news || [];

        for (const article of news) {
          const uuid = article.uuid || article.link;
          if (!allArticles.has(uuid)) {
            allArticles.set(uuid, {
              uuid,
              title: article.title || '',
              summary: '',
              thumbnailUrl: article.thumbnail?.resolutions?.[0]?.url || null,
              link: article.link || '',
              publisher: article.publisher || '',
              publishedAt: article.providerPublishTime
                ? new Date(article.providerPublishTime).toISOString()
                : new Date().toISOString(),
              relatedSymbols: [symbol],
            });
          } else {
            const existing = allArticles.get(uuid)!;
            if (!existing.relatedSymbols.includes(symbol)) {
              existing.relatedSymbols.push(symbol);
            }
          }
        }
      } catch (error) {
        console.error(`News error for ${symbol}:`, error);
      }
    })
  );

  const articles = Array.from(allArticles.values())
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 20);

  setCache(cacheKey, articles, 15 * 60 * 1000);
  return articles;
}
