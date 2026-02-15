import { NextRequest, NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yf = new YahooFinance();

// Simple in-memory cache
const cache = new Map<string, { data: unknown; expiresAt: number }>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry || Date.now() > entry.expiresAt) {
    if (entry) cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache(key: string, data: unknown, ttlMs: number) {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

const LANG_MAP: Record<string, string> = {
  cs: 'cs', sk: 'sk', uk: 'uk', zh: 'zh-CN', mn: 'mn',
};

async function translateText(text: string, targetLang: string): Promise<string | null> {
  const langCode = LANG_MAP[targetLang];
  if (!langCode || targetLang === 'en') return null;
  try {
    // Use MyMemory free translation API (max ~500 chars for free)
    const truncated = text.length > 500 ? text.slice(0, 497) + '...' : text;
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(truncated)}&langpair=en|${langCode}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.responseData?.translatedText) {
      const translated = data.responseData.translatedText;
      // MyMemory returns original text in uppercase when it can't translate
      if (translated === truncated.toUpperCase()) return null;
      return translated;
    }
    return null;
  } catch {
    return null;
  }
}

/** Known index provider websites for fallback */
const INDEX_WEBSITES: Record<string, string> = {
  '^GSPC': 'https://www.spglobal.com/spdji/en/indices/equity/sp-500/',
  '^IXIC': 'https://www.nasdaq.com/market-activity/index/comp',
  '^DJI': 'https://www.spglobal.com/spdji/en/indices/equity/dow-jones-industrial-average/',
  '^FTSE': 'https://www.ftserussell.com/products/indices/uk',
  '^N225': 'https://indexes.nikkei.co.jp/en/nkave',
  '^GDAXI': 'https://www.dax-indices.com/',
  '^HSI': 'https://www.hsi.com.hk/',
  '^STOXX50E': 'https://www.stoxx.com/index-details?symbol=SX5E',
  '^FCHI': 'https://www.euronext.com/en/products/indices/FR0003500008-XPAR',
  '^RUT': 'https://www.ftserussell.com/products/indices/russell-us',
  '^VIX': 'https://www.cboe.com/tradeable_products/vix/',
  'URTH': 'https://www.ishares.com/us/products/239696/',
  'EEM': 'https://www.ishares.com/us/products/239637/',
  'ACWI': 'https://www.ishares.com/us/products/239600/',
};

/** Format sector name from snake_case to Title Case */
function formatSectorName(raw: string): string {
  return raw.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol');
  const lang = request.nextUrl.searchParams.get('lang') || 'en';
  if (!symbol) {
    return NextResponse.json({ error: 'symbol parameter required' }, { status: 400 });
  }

  const cacheKey = `profile:${symbol}:${lang}`;
  const cached = getCached(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    const modules = [
      'summaryProfile',
      'financialData',
      'defaultKeyStatistics',
      'earnings',
      'earningsTrend',
      'recommendationTrend',
      'price',
      'summaryDetail',
      'topHoldings',
    ] as const;

    const summary = await yf.quoteSummary(symbol, {
      modules: [...modules],
    });

    const price = summary.price;
    const profile = summary.summaryProfile;
    const financials = summary.financialData;
    const keyStats = summary.defaultKeyStatistics;
    const detail = summary.summaryDetail;
    const earnings = summary.earnings;
    const earningsTrend = summary.earningsTrend;
    const recommendations = summary.recommendationTrend;

    // Basic info
    const result: Record<string, unknown> = {
      symbol,
      name: price?.shortName || price?.longName || symbol,
      exchange: price?.exchangeName || '',
      currency: price?.currency || 'USD',
      marketCap: price?.marketCap ?? null,
      sector: profile?.sector || null,
      industry: profile?.industry || null,
      website: profile?.website || INDEX_WEBSITES[symbol] || null,
      description: profile?.longBusinessSummary || null,
      localizedDescription: null as string | null,
      employees: profile?.fullTimeEmployees ?? null,
      country: profile?.country || null,
    };

    // Financial data
    result.financials = {
      currentPrice: financials?.currentPrice ?? price?.regularMarketPrice ?? null,
      targetHighPrice: financials?.targetHighPrice ?? null,
      targetLowPrice: financials?.targetLowPrice ?? null,
      targetMeanPrice: financials?.targetMeanPrice ?? null,
      targetMedianPrice: financials?.targetMedianPrice ?? null,
      recommendationKey: financials?.recommendationKey ?? null,
      numberOfAnalystOpinions: financials?.numberOfAnalystOpinions ?? null,
      totalRevenue: financials?.totalRevenue ?? null,
      revenueGrowth: financials?.revenueGrowth ?? null,
      grossMargins: financials?.grossMargins ?? null,
      operatingMargins: financials?.operatingMargins ?? null,
      profitMargins: financials?.profitMargins ?? null,
      ebitda: financials?.ebitda ?? null,
      totalDebt: financials?.totalDebt ?? null,
      totalCash: financials?.totalCash ?? null,
      freeCashflow: financials?.freeCashflow ?? null,
      operatingCashflow: financials?.operatingCashflow ?? null,
      returnOnEquity: financials?.returnOnEquity ?? null,
      returnOnAssets: financials?.returnOnAssets ?? null,
      earningsGrowth: financials?.earningsGrowth ?? null,
      revenuePerShare: financials?.revenuePerShare ?? null,
      debtToEquity: financials?.debtToEquity ?? null,
    };

    // Key statistics
    result.keyStats = {
      trailingPE: keyStats?.trailingEps ? (financials?.currentPrice ?? 0) / keyStats.trailingEps : (detail?.trailingPE ?? null),
      forwardPE: keyStats?.forwardEps ? (financials?.currentPrice ?? 0) / keyStats.forwardEps : (detail?.forwardPE ?? null),
      pegRatio: keyStats?.pegRatio ?? null,
      priceToBook: keyStats?.priceToBook ?? null,
      trailingEps: keyStats?.trailingEps ?? null,
      forwardEps: keyStats?.forwardEps ?? null,
      bookValue: keyStats?.bookValue ?? null,
      beta: keyStats?.beta ?? null,
      fiftyTwoWeekHigh: detail?.fiftyTwoWeekHigh ?? null,
      fiftyTwoWeekLow: detail?.fiftyTwoWeekLow ?? null,
      fiftyDayAverage: detail?.fiftyDayAverage ?? null,
      twoHundredDayAverage: detail?.twoHundredDayAverage ?? null,
      dividendYield: detail?.dividendYield ?? null,
      dividendRate: detail?.dividendRate ?? null,
      exDividendDate: detail?.exDividendDate ?? null,
      payoutRatio: detail?.payoutRatio ?? null,
      averageVolume: detail?.averageVolume ?? null,
      marketCap: price?.marketCap ?? null,
      enterpriseValue: keyStats?.enterpriseValue ?? null,
      sharesOutstanding: keyStats?.sharesOutstanding ?? null,
      floatShares: keyStats?.floatShares ?? null,
      shortRatio: keyStats?.shortRatio ?? null,
    };

    // Earnings history (quarterly)
    const earningsHistory: { date: string; actual: number | null; estimate: number | null }[] = [];
    if (earnings?.earningsChart?.quarterly) {
      for (const q of earnings.earningsChart.quarterly) {
        earningsHistory.push({
          date: q.date || '',
          actual: q.actual ?? null,
          estimate: q.estimate ?? null,
        });
      }
    }
    result.earningsHistory = earningsHistory;

    // Revenue history (yearly from earnings)
    const revenueHistory: { date: string; revenue: number | null; earnings: number | null }[] = [];
    if (earnings?.financialsChart?.yearly) {
      for (const y of earnings.financialsChart.yearly) {
        revenueHistory.push({
          date: String(y.date ?? ''),
          revenue: y.revenue ?? null,
          earnings: y.earnings ?? null,
        });
      }
    }
    result.revenueHistory = revenueHistory;

    // Earnings trend (estimates for current/next quarter)
    const earningsEstimates: {
      period: string;
      growth: number | null;
      earningsEstimateAvg: number | null;
      earningsEstimateLow: number | null;
      earningsEstimateHigh: number | null;
      revenueEstimateAvg: number | null;
    }[] = [];
    if (earningsTrend?.trend) {
      for (const t of earningsTrend.trend) {
        earningsEstimates.push({
          period: t.period || '',
          growth: t.growth ?? null,
          earningsEstimateAvg: t.earningsEstimate?.avg ?? null,
          earningsEstimateLow: t.earningsEstimate?.low ?? null,
          earningsEstimateHigh: t.earningsEstimate?.high ?? null,
          revenueEstimateAvg: t.revenueEstimate?.avg ?? null,
        });
      }
    }
    result.earningsEstimates = earningsEstimates;

    // Analyst recommendations
    const analystTrend: {
      period: string;
      strongBuy: number;
      buy: number;
      hold: number;
      sell: number;
      strongSell: number;
    }[] = [];
    if (recommendations?.trend) {
      for (const r of recommendations.trend) {
        analystTrend.push({
          period: r.period || '',
          strongBuy: r.strongBuy ?? 0,
          buy: r.buy ?? 0,
          hold: r.hold ?? 0,
          sell: r.sell ?? 0,
          strongSell: r.strongSell ?? 0,
        });
      }
    }
    result.analystTrend = analystTrend;

    // Top holdings (for ETFs / index funds)
    const topHoldingsData = (summary as Record<string, unknown>).topHoldings as {
      holdings?: { symbol: string; holdingName: string; holdingPercent: number }[];
      sectorWeightings?: Record<string, number>[];
    } | undefined;

    if (topHoldingsData?.holdings && topHoldingsData.holdings.length > 0) {
      const holdingsRaw = topHoldingsData.holdings.slice(0, 10).map(h => ({
        symbol: h.symbol || '',
        name: h.holdingName || h.symbol || '',
        weight: h.holdingPercent ?? 0,
        country: null as string | null,
      }));

      // Lookup countries for each holding in parallel
      const holdingSymbols = holdingsRaw.filter(h => h.symbol).map(h => h.symbol);
      if (holdingSymbols.length > 0) {
        const countryResults = await Promise.allSettled(
          holdingSymbols.map(async (sym) => {
            try {
              const hs = await yf.quoteSummary(sym, { modules: ['assetProfile'] });
              return { symbol: sym, country: hs.assetProfile?.country || null };
            } catch {
              return { symbol: sym, country: null };
            }
          })
        );
        for (const cr of countryResults) {
          if (cr.status === 'fulfilled' && cr.value.country) {
            const h = holdingsRaw.find(h => h.symbol === cr.value.symbol);
            if (h) h.country = cr.value.country;
          }
        }
      }

      // Sector weightings
      const sectorWeightings: { sector: string; weight: number }[] = [];
      if (topHoldingsData.sectorWeightings) {
        for (const sw of topHoldingsData.sectorWeightings) {
          const entries = Object.entries(sw);
          for (const [sector, weight] of entries) {
            if (typeof weight === 'number' && weight > 0) {
              sectorWeightings.push({ sector: formatSectorName(sector), weight });
            }
          }
        }
        sectorWeightings.sort((a, b) => b.weight - a.weight);
      }

      // Country breakdown (aggregated from holdings)
      const countryMap = new Map<string, number>();
      for (const h of holdingsRaw) {
        if (h.country && h.weight > 0) {
          countryMap.set(h.country, (countryMap.get(h.country) || 0) + h.weight);
        }
      }
      const countryBreakdown = Array.from(countryMap.entries())
        .map(([country, weight]) => ({ country, weight }))
        .sort((a, b) => b.weight - a.weight);

      result.topHoldings = {
        holdings: holdingsRaw,
        sectorWeightings,
        countryBreakdown,
        totalTop10Weight: holdingsRaw.reduce((sum, h) => sum + h.weight, 0),
      };
    }

    // Translate description if non-English locale
    if (lang !== 'en' && result.description) {
      result.localizedDescription = await translateText(result.description as string, lang);
    }

    setCache(cacheKey, result, 5 * 60 * 1000);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
