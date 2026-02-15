import YahooFinance from 'yahoo-finance2';
import { SearchResult } from '@/types/api';
import { InstrumentType } from '@/types/portfolio';
import { Quote, ChartDataPoint, NewsArticle, TimePeriod, CalendarEvent, CalendarEventType } from '@/types/market';
import { subDays, subMonths, subYears, startOfYear, differenceInDays, format } from 'date-fns';

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

/**
 * Instrument databases from FinanceDatabase (290k+ instruments).
 * Loaded lazily on first search, cached in memory (server-side only).
 * Data sourced from: https://github.com/JerBouma/FinanceDatabase
 * Updated via: scripts/update-finance-db.py
 */
interface DBEntry { s: string; n: string; e: string; t: string; sec?: string }

const _dbs: Record<string, DBEntry[]> = {};

function loadDB(name: string): DBEntry[] {
  if (!_dbs[name]) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    _dbs[name] = require(`@/data/${name}.json`) as DBEntry[];
  }
  return _dbs[name];
}

export type SearchTypeFilter = 'stock' | 'etf' | 'crypto' | 'index';

function dbTypeToInstrumentType(t: string): InstrumentType {
  switch (t) {
    case 'equity': return 'stock';
    case 'etf': return 'etf';
    case 'crypto': return 'crypto';
    default: return 'stock';
  }
}

/** Map search type filter to DB name(s) */
function getDBsForType(typeFilter: SearchTypeFilter): string[] {
  switch (typeFilter) {
    case 'stock': return ['equities'];
    case 'etf': return ['etfs'];
    case 'crypto': return ['cryptos'];
    case 'index': return ['indices'];
  }
}

import { FEATURED_INDICES } from '@/lib/indexConstants';

/** Check if all query tokens appear in the text (token-based matching) */
function tokensMatch(tokens: string[], text: string): boolean {
  for (const token of tokens) {
    if (!text.includes(token)) return false;
  }
  return true;
}

/** Search local instrument databases. mode='index' searches only indices, otherwise all. typeFilter narrows to a single type. */
export function searchLocalDB(query: string, mode?: 'index', typeFilter?: SearchTypeFilter): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q || q.length < 2) return [];

  let dbNames: string[];
  if (typeFilter) {
    dbNames = getDBsForType(typeFilter);
  } else if (mode === 'index') {
    dbNames = ['indices'];
  } else {
    dbNames = ['equities', 'etfs', 'cryptos', 'indices'];
  }
  const databases = dbNames.map(loadDB);

  const tokens = q.split(/\s+/).filter(t => t.length > 0);
  const isMultiWord = tokens.length > 1;
  const isFeaturedMode = mode === 'index';

  // Collect candidates with scoring
  const candidates: { entry: DBEntry; score: number }[] = [];
  const seen = new Set<string>();

  for (const db of databases) {
    for (const entry of db) {
      if (seen.has(entry.s)) continue;
      const symLower = entry.s.toLowerCase();
      const nameLower = entry.n.toLowerCase();

      let score = 0;

      // Exact symbol match (highest priority)
      if (symLower === q) {
        score = 100;
      }
      // Symbol starts with query
      else if (symLower.startsWith(q)) {
        score = 50;
      }
      // Exact substring match in name (single token or full phrase)
      else if (nameLower.includes(q)) {
        score = 30;
      }
      // Token-based: all tokens appear in name or symbol (multi-word queries)
      else if (isMultiWord && tokensMatch(tokens, nameLower + ' ' + symLower)) {
        score = 20;
      }
      // Symbol contains query
      else if (symLower.includes(q)) {
        score = 15;
      }
      else {
        continue;
      }

      // Featured indices get a significant boost in index mode
      if (isFeaturedMode && FEATURED_INDICES.has(entry.s)) {
        score += 200;
      }

      seen.add(entry.s);
      candidates.push({ entry, score });
    }
  }

  // Sort by score descending, then by name length (prefer shorter/more relevant)
  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.entry.n.length - b.entry.n.length;
  });

  return candidates.slice(0, 20).map(({ entry }) => ({
    symbol: entry.s,
    name: entry.n,
    type: dbTypeToInstrumentType(entry.t),
    exchange: entry.e,
    sector: entry.sec,
    quoteType: entry.t === 'index' ? 'INDEX' : undefined,
    featured: FEATURED_INDICES.has(entry.s) || undefined,
  }));
}

/** Yahoo Finance search as supplement (slower, may fail) */
export async function searchYahooFinance(query: string): Promise<SearchResult[]> {
  const cacheKey = `yf-search:${query}`;
  const cached = getCached<SearchResult[]>(cacheKey);
  if (cached) return cached;

  try {
    const result = await yf.search(query, { quotesCount: 10, newsCount: 0 });
    const quotes = result.quotes || [];
    const results: SearchResult[] = [];

    for (const q of quotes) {
      const isYF = 'isYahooFinance' in q && q.isYahooFinance === true;
      const rawQuoteType = 'quoteType' in q ? String((q as Record<string, unknown>).quoteType || '') : '';
      const isIndex = rawQuoteType === 'INDEX';

      if (!isYF && !isIndex) continue;

      results.push({
        symbol: String(q.symbol || ''),
        name: String(('shortname' in q ? q.shortname : '') || ('longname' in q ? q.longname : '') || q.symbol || ''),
        type: mapQuoteType(rawQuoteType),
        exchange: String(q.exchange || ''),
        sector: 'sector' in q ? String((q as Record<string, unknown>).sector || '') : undefined,
        quoteType: rawQuoteType || undefined,
      });
    }

    setCache(cacheKey, results, 10 * 60 * 1000);
    return results;
  } catch (error) {
    console.error('Yahoo search error:', error);
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
  weights?: number[],
): Promise<ChartDataPoint[]> {
  const cacheKey = `chart:${symbols.join(',')}:${period}:${weights?.join(',')}`;
  const cached = getCached<ChartDataPoint[]>(cacheKey);
  if (cached) return cached;

  const now = new Date();

  // For 'max' period: fetch full history, then find the common start date
  if (period === 'max') {
    return getChartMax(symbols, weights);
  }

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
    // Use indexed array to maintain order matching symbols/weights
    const seriesSlots: ({ timestamp: number; normalizedPrice: number }[] | null)[] =
      new Array(symbols.length).fill(null);

    await Promise.allSettled(
      symbols.map(async (symbol, symbolIndex) => {
        try {
          const chart = await yf.chart(symbol, {
            period1,
            period2: now,
            interval,
          });

          const chartQuotes = chart.quotes || [];
          if (chartQuotes.length === 0) return;

          // Filter to valid quotes first, then normalize from the first valid close
          const validQuotes = chartQuotes.filter((cq) => cq.date && cq.close != null);
          if (validQuotes.length === 0) return;

          const basePrice = validQuotes[0].close!;
          const series = validQuotes.map((cq) => ({
            timestamp: cq.date.getTime(),
            normalizedPrice: (cq.close! / basePrice) * 100,
          }));

          seriesSlots[symbolIndex] = series;
        } catch (error) {
          console.error(`Chart error for ${symbol}:`, error);
        }
      })
    );

    // Build aligned series + weights arrays (preserving symbol order)
    const allSeries: { timestamp: number; normalizedPrice: number }[][] = [];
    const alignedWeights: number[] = [];
    for (let i = 0; i < seriesSlots.length; i++) {
      if (seriesSlots[i] && seriesSlots[i]!.length > 0) {
        allSeries.push(seriesSlots[i]!);
        alignedWeights.push(weights?.[i] ?? 0);
      }
    }

    if (allSeries.length === 0) return [];

    // If no explicit weights provided, distribute equally
    const effectiveWeights = weights
      ? alignedWeights
      : allSeries.map(() => 100 / allSeries.length);

    const result = aggregateSeries(allSeries, effectiveWeights);

    setCache(cacheKey, result, 5 * 60 * 1000);
    return result;
  } catch (error) {
    console.error('Chart error:', error);
    return [];
  }
}

/** Aggregate multiple normalized series into a single weighted portfolio line */
function aggregateSeries(
  allSeries: { timestamp: number; normalizedPrice: number }[][],
  weights: number[],
): ChartDataPoint[] {
  const baseSeries = allSeries.reduce((a, b) => (a.length > b.length ? a : b));

  return baseSeries.map((point, idx) => {
    let weightedSum = 0;
    let totalWeight = 0;

    for (let i = 0; i < allSeries.length; i++) {
      const series = allSeries[i];
      const seriesPoint = series[Math.min(idx, series.length - 1)];
      const w = weights[i] ?? 100 / allSeries.length;
      weightedSum += seriesPoint.normalizedPrice * w;
      totalWeight += w;
    }

    return {
      timestamp: point.timestamp,
      value: totalWeight > 0 ? weightedSum / totalWeight : 0,
    };
  });
}

/**
 * MAX period: fetch full available history for each symbol from Yahoo Finance,
 * find the latest "first data point" across all symbols (= the common start),
 * then trim and re-normalize all series from that common start date.
 */
async function getChartMax(
  symbols: string[],
  weights?: number[],
): Promise<ChartDataPoint[]> {
  const cacheKey = `chart:${symbols.join(',')}:max:${weights?.join(',')}`;
  const cached = getCached<ChartDataPoint[]>(cacheKey);
  if (cached) return cached;

  const now = new Date();
  // Fetch from a very old date to get the full available history
  const veryOldDate = new Date('1970-01-01');

  try {
    // Step 1: Fetch full monthly history for each symbol (indexed to preserve order)
    const rawSlots: ({ timestamp: number; close: number }[] | null)[] =
      new Array(symbols.length).fill(null);

    await Promise.allSettled(
      symbols.map(async (symbol, symbolIndex) => {
        try {
          const chart = await yf.chart(symbol, {
            period1: veryOldDate,
            period2: now,
            interval: '1mo',
          });

          const chartQuotes = chart.quotes || [];
          if (chartQuotes.length === 0) return;

          const series = chartQuotes
            .filter((cq) => cq.date && cq.close != null)
            .map((cq) => ({
              timestamp: cq.date.getTime(),
              close: cq.close!,
            }));

          if (series.length > 0) rawSlots[symbolIndex] = series;
        } catch (error) {
          console.error(`Chart MAX error for ${symbol}:`, error);
        }
      })
    );

    // Filter out symbols that returned no data, keeping alignment with weights
    const validRawSeries: { timestamp: number; close: number }[][] = [];
    const validIndices: number[] = [];
    for (let i = 0; i < rawSlots.length; i++) {
      if (rawSlots[i]) {
        validRawSeries.push(rawSlots[i]!);
        validIndices.push(i);
      }
    }

    if (validRawSeries.length === 0) return [];

    // Step 2: Find the latest "first data point" — the common start
    const latestFirstTimestamp = Math.max(
      ...validRawSeries.map((s) => s[0].timestamp)
    );

    // Step 3: Determine the appropriate interval based on actual range
    const days = differenceInDays(now, new Date(latestFirstTimestamp));
    let interval: '1d' | '1wk' | '1mo';
    if (days <= 365) {
      interval = '1d';
    } else if (days <= 365 * 3) {
      interval = '1wk';
    } else {
      interval = '1mo';
    }

    // Step 4: If monthly is fine, trim and normalize existing data
    // Otherwise re-fetch with the appropriate interval from the common start
    let allSeries: { timestamp: number; normalizedPrice: number }[][] = [];
    let seriesWeightIndices = validIndices;

    if (interval === '1mo') {
      // Use already fetched monthly data, just trim to common start
      for (const series of validRawSeries) {
        const trimmed = series.filter((p) => p.timestamp >= latestFirstTimestamp);
        if (trimmed.length === 0) continue;
        const basePrice = trimmed[0].close;
        allSeries.push(
          trimmed.map((p) => ({
            timestamp: p.timestamp,
            normalizedPrice: (p.close / basePrice) * 100,
          }))
        );
      }
    } else {
      // Re-fetch with finer interval from common start date (indexed)
      const commonStart = new Date(latestFirstTimestamp);
      const refetchSlots: ({ timestamp: number; normalizedPrice: number }[] | null)[] =
        new Array(symbols.length).fill(null);

      await Promise.allSettled(
        symbols.map(async (symbol, symbolIndex) => {
          try {
            const chart = await yf.chart(symbol, {
              period1: commonStart,
              period2: now,
              interval,
            });

            const chartQuotes = chart.quotes || [];
            if (chartQuotes.length === 0) return;

            const validQuotes = chartQuotes.filter((cq) => cq.date && cq.close != null);
            if (validQuotes.length === 0) return;

            const basePrice = validQuotes[0].close!;
            const series = validQuotes.map((cq) => ({
              timestamp: cq.date.getTime(),
              normalizedPrice: (cq.close! / basePrice) * 100,
            }));

            refetchSlots[symbolIndex] = series;
          } catch (error) {
            console.error(`Chart MAX refetch error for ${symbol}:`, error);
          }
        })
      );

      allSeries = [];
      seriesWeightIndices = [];
      for (let i = 0; i < refetchSlots.length; i++) {
        if (refetchSlots[i] && refetchSlots[i]!.length > 0) {
          allSeries.push(refetchSlots[i]!);
          seriesWeightIndices.push(i);
        }
      }
    }

    if (allSeries.length === 0) return [];

    // Step 5: Aggregate into weighted portfolio line
    const effectiveWeights = weights
      ? seriesWeightIndices.map((i) => weights[i] ?? 0)
      : allSeries.map(() => 100 / allSeries.length);

    const result = aggregateSeries(allSeries, effectiveWeights);

    setCache(cacheKey, result, 5 * 60 * 1000);
    return result;
  } catch (error) {
    console.error('Chart MAX error:', error);
    return [];
  }
}

/** Fetch news from Finnhub for a single symbol (last 7 days) */
async function fetchFinnhubNews(symbol: string): Promise<NewsArticle[]> {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) return [];

  const now = new Date();
  const from = format(subDays(now, 7), 'yyyy-MM-dd');
  const to = format(now, 'yyyy-MM-dd');

  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/company-news?symbol=${encodeURIComponent(symbol)}&from=${from}&to=${to}&token=${apiKey}`,
      { signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map((item: {
      id: number;
      headline: string;
      summary: string;
      image: string;
      url: string;
      source: string;
      datetime: number;
      related: string;
    }) => ({
      uuid: `finnhub-${item.id}`,
      title: item.headline || '',
      summary: item.summary || '',
      thumbnailUrl: item.image || null,
      link: item.url || '',
      publisher: item.source || '',
      publishedAt: item.datetime
        ? new Date(item.datetime * 1000).toISOString()
        : new Date().toISOString(),
      relatedSymbols: [symbol.toUpperCase()],
    }));
  } catch (error) {
    console.error(`Finnhub news error for ${symbol}:`, error);
    return [];
  }
}

/** Normalize a URL for deduplication (strip protocol, www, trailing slash) */
function normalizeUrl(url: string): string {
  return url
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/+$/, '')
    .toLowerCase();
}

export async function getNews(symbols: string[]): Promise<NewsArticle[]> {
  const cacheKey = `news:${symbols.join(',')}`;
  const cached = getCached<NewsArticle[]>(cacheKey);
  if (cached) return cached;

  const finnhubKey = process.env.FINNHUB_API_KEY;
  const symbolSet = new Set(symbols.map((s) => s.toUpperCase()));
  const allArticles = new Map<string, NewsArticle>();
  // Track URLs for cross-source deduplication
  const seenUrls = new Map<string, string>(); // normalizedUrl -> uuid

  console.log(`[News] Fetching for symbols: ${symbols.join(', ')}. Finnhub key: ${finnhubKey ? 'SET' : 'NOT SET'}`);

  // --- Source 1: Yahoo Finance ---
  await Promise.allSettled(
    symbols.map(async (symbol) => {
      try {
        const result = await yf.search(symbol, { quotesCount: 0, newsCount: 100 });
        const news = result.news || [];

        for (const article of news) {
          const uuid = article.uuid || article.link;

          const apiTickers = article.relatedTickers ?? [];
          const matchedSymbols = apiTickers.filter((t) => symbolSet.has(t.toUpperCase()));
          if (matchedSymbols.length === 0) continue;

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
              relatedSymbols: matchedSymbols,
            });
            if (article.link) {
              seenUrls.set(normalizeUrl(article.link), uuid);
            }
          } else {
            const existing = allArticles.get(uuid)!;
            for (const s of matchedSymbols) {
              if (!existing.relatedSymbols.includes(s)) {
                existing.relatedSymbols.push(s);
              }
            }
          }
        }
      } catch (error) {
        console.error(`Yahoo news error for ${symbol}:`, error);
      }
    })
  );

  // --- Source 2: Finnhub (if API key configured) ---
  if (finnhubKey) {
    console.log(`[News] Finnhub enabled, fetching for ${symbols.length} symbols...`);
    const finnhubResults = await Promise.allSettled(
      symbols.map((symbol) => fetchFinnhubNews(symbol))
    );
    const finnhubTotal = finnhubResults
      .filter((r) => r.status === 'fulfilled')
      .reduce((sum, r) => sum + (r as PromiseFulfilledResult<NewsArticle[]>).value.length, 0);
    console.log(`[News] Finnhub returned ${finnhubTotal} articles total`);

    for (const result of finnhubResults) {
      if (result.status !== 'fulfilled') continue;
      for (const article of result.value) {
        // Deduplicate by URL across sources
        const normUrl = article.link ? normalizeUrl(article.link) : '';
        const existingUuid = normUrl ? seenUrls.get(normUrl) : undefined;

        if (existingUuid) {
          // Article already exists from Yahoo — merge symbols
          const existing = allArticles.get(existingUuid)!;
          for (const s of article.relatedSymbols) {
            if (!existing.relatedSymbols.includes(s)) {
              existing.relatedSymbols.push(s);
            }
          }
          // Finnhub often has summaries when Yahoo doesn't
          if (!existing.summary && article.summary) {
            existing.summary = article.summary;
          }
        } else if (!allArticles.has(article.uuid)) {
          allArticles.set(article.uuid, article);
          if (normUrl) {
            seenUrls.set(normUrl, article.uuid);
          }
        }
      }
    }
  }

  const articles = Array.from(allArticles.values())
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  setCache(cacheKey, articles, 15 * 60 * 1000);
  return articles;
}

const COMMON_DOMAINS: Record<string, string> = {
  AAPL: 'apple.com', MSFT: 'microsoft.com', GOOGL: 'google.com', GOOG: 'google.com',
  AMZN: 'amazon.com', META: 'meta.com', TSLA: 'tesla.com', NVDA: 'nvidia.com',
  NFLX: 'netflix.com', DIS: 'disney.com', PYPL: 'paypal.com', INTC: 'intel.com',
  AMD: 'amd.com', CRM: 'salesforce.com', ADBE: 'adobe.com', CSCO: 'cisco.com',
  ORCL: 'oracle.com', IBM: 'ibm.com', UBER: 'uber.com', ABNB: 'airbnb.com',
  SQ: 'squareup.com', SHOP: 'shopify.com', SPOT: 'spotify.com', SNAP: 'snap.com',
  PINS: 'pinterest.com', ZM: 'zoom.us', COIN: 'coinbase.com', HOOD: 'robinhood.com',
  V: 'visa.com', MA: 'mastercard.com', JPM: 'jpmorganchase.com',
  BAC: 'bankofamerica.com', GS: 'goldmansachs.com', MS: 'morganstanley.com',
  WMT: 'walmart.com', COST: 'costco.com', TGT: 'target.com', NKE: 'nike.com',
  SBUX: 'starbucks.com', MCD: 'mcdonalds.com', KO: 'coca-cola.com', PEP: 'pepsico.com',
  PG: 'pg.com', JNJ: 'jnj.com', PFE: 'pfizer.com', MRNA: 'modernatx.com',
  BA: 'boeing.com', CAT: 'cat.com', XOM: 'exxonmobil.com', CVX: 'chevron.com',
};

async function resolveDomain(symbol: string): Promise<string | null> {
  // Check hardcoded map first
  const known = COMMON_DOMAINS[symbol.toUpperCase()];
  if (known) return known;

  // Try Yahoo Finance assetProfile
  try {
    const summary = await yf.quoteSummary(symbol, { modules: ['assetProfile'] });
    const website = summary.assetProfile?.website;
    if (website) {
      try {
        return new URL(website).hostname.replace(/^www\./, '');
      } catch {
        return website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
      }
    }
  } catch { /* assetProfile unavailable */ }

  return null;
}

async function tryFetchImage(url: string): Promise<{ buffer: Buffer; contentType: string } | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(5000),
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('image')) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 100) return null; // too small, probably placeholder
    return { buffer, contentType: ct };
  } catch {
    return null;
  }
}

export async function getLogoImage(
  symbol: string,
  type: InstrumentType
): Promise<{ buffer: Buffer; contentType: string } | null> {
  const cacheKey = `logo-img:${symbol}`;
  const cached = getCached<{ buffer: Buffer; contentType: string } | null>(cacheKey);
  if (cached !== undefined) {
    const entry = cache.get(cacheKey);
    if (entry && Date.now() <= entry.expiresAt) return entry.data as { buffer: Buffer; contentType: string } | null;
  }

  const LOGO_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

  // Crypto: cryptocurrency-icons CDN
  if (type === 'crypto') {
    const base = symbol.replace(/-USD$/, '').toLowerCase();
    const result = await tryFetchImage(
      `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@master/128/color/${base}.png`
    );
    setCache(cacheKey, result, LOGO_TTL);
    return result;
  }

  // Stocks/ETFs: resolve domain, then try multiple icon sources
  const domain = await resolveDomain(symbol);
  if (domain) {
    // Try apple-touch-icon (high quality, usually 180x180)
    const touchIcon = await tryFetchImage(`https://${domain}/apple-touch-icon.png`);
    if (touchIcon) { setCache(cacheKey, touchIcon, LOGO_TTL); return touchIcon; }

    // Try apple-touch-icon-precomposed
    const precomposed = await tryFetchImage(`https://${domain}/apple-touch-icon-precomposed.png`);
    if (precomposed) { setCache(cacheKey, precomposed, LOGO_TTL); return precomposed; }

    // Try Google's faviconV2 service (reliable, returns 128px)
    const googleFav = await tryFetchImage(
      `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`
    );
    if (googleFav) { setCache(cacheKey, googleFav, LOGO_TTL); return googleFav; }
  }

  // No logo found
  setCache(cacheKey, null, LOGO_TTL);
  return null;
}

export async function getCountries(
  symbols: string[],
  types: string[]
): Promise<{ symbol: string; country: string; countryCode: string }[]> {
  const cacheKey = `countries:${symbols.join(',')}`;
  const cached = getCached<{ symbol: string; country: string; countryCode: string }[]>(cacheKey);
  if (cached) return cached;

  const results: { symbol: string; country: string; countryCode: string }[] = [];

  await Promise.allSettled(
    symbols.map(async (symbol, idx) => {
      const type = types[idx] || 'stock';
      if (type === 'crypto') return;

      try {
        const summary = await yf.quoteSummary(symbol, { modules: ['assetProfile'] });
        const country = summary.assetProfile?.country;
        if (country) {
          results.push({ symbol, country, countryCode: countryToCode(country) });
        }
      } catch (error) {
        console.error(`Country lookup error for ${symbol}:`, error);
      }
    })
  );

  setCache(cacheKey, results, 24 * 60 * 60 * 1000);
  return results;
}

const COUNTRY_CODE_MAP: Record<string, string> = {
  'United States': 'US', 'United Kingdom': 'GB', 'Germany': 'DE', 'France': 'FR',
  'Japan': 'JP', 'China': 'CN', 'Canada': 'CA', 'Australia': 'AU', 'Switzerland': 'CH',
  'Netherlands': 'NL', 'South Korea': 'KR', 'Sweden': 'SE', 'Ireland': 'IE', 'India': 'IN',
  'Brazil': 'BR', 'Taiwan': 'TW', 'Spain': 'ES', 'Italy': 'IT', 'Denmark': 'DK',
  'Norway': 'NO', 'Finland': 'FI', 'Belgium': 'BE', 'Singapore': 'SG', 'Hong Kong': 'HK',
  'Israel': 'IL', 'Luxembourg': 'LU', 'Czech Republic': 'CZ', 'Czechia': 'CZ',
  'Austria': 'AT', 'Poland': 'PL', 'Russia': 'RU', 'Mexico': 'MX', 'South Africa': 'ZA',
  'New Zealand': 'NZ', 'Portugal': 'PT', 'Greece': 'GR', 'Argentina': 'AR', 'Chile': 'CL',
  'Colombia': 'CO', 'Uruguay': 'UY', 'Turkey': 'TR', 'Saudi Arabia': 'SA', 'United Arab Emirates': 'AE',
  'Indonesia': 'ID', 'Malaysia': 'MY', 'Thailand': 'TH', 'Philippines': 'PH',
  'Vietnam': 'VN', 'Mongolia': 'MN', 'Ukraine': 'UA', 'Slovakia': 'SK',
};

function countryToCode(country: string): string {
  return COUNTRY_CODE_MAP[country] || country.substring(0, 2).toUpperCase();
}

export async function getPortfolioMetrics(
  symbols: string[],
  weights: number[]
): Promise<{
  sharpeRatio: number | null;
  beta: number | null;
  alpha: number | null;
  sortinoRatio: number | null;
  treynorRatio: number | null;
  calmarRatio: number | null;
}> {
  const cacheKey = `metrics:${symbols.join(',')}:${weights.join(',')}`;
  const cached = getCached<{
    sharpeRatio: number | null; beta: number | null;
    alpha: number | null; sortinoRatio: number | null; treynorRatio: number | null;
    calmarRatio: number | null;
  }>(cacheKey);
  if (cached) return cached;

  const RISK_FREE_RATE = 0.045;
  const now = new Date();
  const oneYearAgo = subYears(now, 1);

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const normWeights = weights.map((w) => (totalWeight > 0 ? w / totalWeight : 1 / symbols.length));

  const symbolData: { beta: number | null; dailyReturns: number[] }[] = [];

  await Promise.allSettled(
    symbols.map(async (symbol) => {
      try {
        const [summary, chart] = await Promise.all([
          yf.quoteSummary(symbol, { modules: ['defaultKeyStatistics'] }).catch(() => null),
          yf.chart(symbol, { period1: oneYearAgo, period2: now, interval: '1d' }).catch(() => null),
        ]);

        const beta = summary?.defaultKeyStatistics?.beta ?? null;

        const dailyReturns: number[] = [];
        const quotes = chart?.quotes || [];
        for (let i = 1; i < quotes.length; i++) {
          const prev = quotes[i - 1].close;
          const curr = quotes[i].close;
          if (prev != null && curr != null && prev > 0) {
            dailyReturns.push((curr - prev) / prev);
          }
        }

        symbolData.push({ beta, dailyReturns });
      } catch (error) {
        console.error(`Metrics error for ${symbol}:`, error);
        symbolData.push({ beta: null, dailyReturns: [] });
      }
    })
  );

  // Weighted Beta
  let portfolioBeta: number | null = null;
  {
    let weightedBeta = 0, betaWeight = 0;
    symbolData.forEach((d, i) => {
      if (d.beta != null) { weightedBeta += d.beta * normWeights[i]; betaWeight += normWeights[i]; }
    });
    if (betaWeight > 0) portfolioBeta = weightedBeta / betaWeight;
  }

  // Portfolio daily returns
  const maxLen = Math.max(...symbolData.map((d) => d.dailyReturns.length), 0);
  let sharpeRatio: number | null = null;
  let alpha: number | null = null;
  let sortinoRatio: number | null = null;
  let treynorRatio: number | null = null;
  let calmarRatio: number | null = null;

  if (maxLen > 20) {
    const portfolioReturns: number[] = [];
    for (let day = 0; day < maxLen; day++) {
      let dayReturn = 0;
      for (let i = 0; i < symbolData.length; i++) {
        const returns = symbolData[i].dailyReturns;
        if (returns.length > 0) {
          dayReturn += returns[Math.min(day, returns.length - 1)] * normWeights[i];
        }
      }
      portfolioReturns.push(dayReturn);
    }

    const avgDailyReturn = portfolioReturns.reduce((a, b) => a + b, 0) / portfolioReturns.length;
    const annualizedReturn = avgDailyReturn * 252;

    const variance = portfolioReturns.reduce((sum, r) => sum + (r - avgDailyReturn) ** 2, 0) / (portfolioReturns.length - 1);
    const annualizedStdDev = Math.sqrt(variance) * Math.sqrt(252);

    if (annualizedStdDev > 0) {
      sharpeRatio = (annualizedReturn - RISK_FREE_RATE) / annualizedStdDev;
    }

    const downsideReturns = portfolioReturns.filter((r) => r < RISK_FREE_RATE / 252);
    if (downsideReturns.length > 0) {
      const downsideVariance = downsideReturns.reduce(
        (sum, r) => sum + (r - RISK_FREE_RATE / 252) ** 2, 0
      ) / downsideReturns.length;
      const downsideDeviation = Math.sqrt(downsideVariance) * Math.sqrt(252);
      if (downsideDeviation > 0) {
        sortinoRatio = (annualizedReturn - RISK_FREE_RATE) / downsideDeviation;
      }
    }

    if (portfolioBeta != null && portfolioBeta !== 0) {
      treynorRatio = (annualizedReturn - RISK_FREE_RATE) / portfolioBeta;
    }

    // Calmar Ratio = Annualized Return / Maximum Drawdown
    {
      let cumReturn = 1;
      let peak = 1;
      let maxDrawdown = 0;
      for (const r of portfolioReturns) {
        cumReturn *= (1 + r);
        if (cumReturn > peak) peak = cumReturn;
        const drawdown = (peak - cumReturn) / peak;
        if (drawdown > maxDrawdown) maxDrawdown = drawdown;
      }
      if (maxDrawdown > 0) {
        calmarRatio = annualizedReturn / maxDrawdown;
      }
    }

    try {
      const spyChart = await yf.chart('^GSPC', { period1: oneYearAgo, period2: now, interval: '1d' });
      const spyQuotes = spyChart.quotes || [];
      if (spyQuotes.length > 1) {
        const firstClose = spyQuotes[0].close ?? 1;
        const lastClose = spyQuotes[spyQuotes.length - 1].close ?? 1;
        const marketReturn = (lastClose - firstClose) / firstClose;
        if (portfolioBeta != null) {
          alpha = annualizedReturn - (RISK_FREE_RATE + portfolioBeta * (marketReturn - RISK_FREE_RATE));
        }
      }
    } catch { /* Market data unavailable */ }
  }

  const result = {
    sharpeRatio: sharpeRatio != null ? Math.round(sharpeRatio * 100) / 100 : null,
    beta: portfolioBeta != null ? Math.round(portfolioBeta * 100) / 100 : null,
    alpha: alpha != null ? Math.round(alpha * 10000) / 100 : null,
    sortinoRatio: sortinoRatio != null ? Math.round(sortinoRatio * 100) / 100 : null,
    treynorRatio: treynorRatio != null ? Math.round(treynorRatio * 100) / 100 : null,
    calmarRatio: calmarRatio != null ? Math.round(calmarRatio * 100) / 100 : null,
  };

  setCache(cacheKey, result, 10 * 60 * 1000);
  return result;
}

export async function getCalendarEvents(symbols: string[]): Promise<CalendarEvent[]> {
  const cacheKey = `calendar:${symbols.join(',')}`;
  const cached = getCached<CalendarEvent[]>(cacheKey);
  if (cached) return cached;

  const events: CalendarEvent[] = [];

  await Promise.allSettled(
    symbols.slice(0, 15).map(async (symbol) => {
      try {
        const summary = await yf.quoteSummary(symbol, { modules: ['calendarEvents', 'price'] });
        const cal = summary.calendarEvents;
        const price = summary.price;
        const name = price?.shortName || price?.longName || symbol;

        if (cal?.earnings) {
          const earningsDate = cal.earnings.earningsDate?.[0];
          if (earningsDate) {
            const dateStr = earningsDate instanceof Date
              ? earningsDate.toISOString()
              : new Date(earningsDate).toISOString();

            let detail: string | undefined;
            const avg = cal.earnings.earningsAverage;
            const low = cal.earnings.earningsLow;
            const high = cal.earnings.earningsHigh;
            if (avg != null) {
              detail = `EPS est. ${avg}`;
              if (low != null && high != null) {
                detail += ` (${low} - ${high})`;
              }
            }

            events.push({
              symbol,
              name,
              type: 'earnings' as CalendarEventType,
              date: dateStr,
              title: `${symbol} Earnings`,
              detail,
            });
          }
        }

        if (cal?.exDividendDate) {
          const divDate = cal.exDividendDate instanceof Date
            ? cal.exDividendDate.toISOString()
            : new Date(cal.exDividendDate).toISOString();

          let detail: string | undefined;
          if (cal.dividendDate) {
            const payDate = cal.dividendDate instanceof Date
              ? cal.dividendDate.toLocaleDateString('en-US')
              : new Date(cal.dividendDate).toLocaleDateString('en-US');
            detail = `Pay date: ${payDate}`;
          }

          events.push({
            symbol,
            name,
            type: 'dividend' as CalendarEventType,
            date: divDate,
            title: `${symbol} Ex-Dividend`,
            detail,
          });
        }
      } catch (error) {
        console.error(`Calendar error for ${symbol}:`, error);
      }
    })
  );

  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  setCache(cacheKey, events, 30 * 60 * 1000);
  return events;
}
