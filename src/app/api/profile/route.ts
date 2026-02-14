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

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol');
  if (!symbol) {
    return NextResponse.json({ error: 'symbol parameter required' }, { status: 400 });
  }

  const cacheKey = `profile:${symbol}`;
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
      website: profile?.website || null,
      description: profile?.longBusinessSummary || null,
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

    setCache(cacheKey, result, 5 * 60 * 1000);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
