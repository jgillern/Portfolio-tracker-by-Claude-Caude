import { NextRequest, NextResponse } from 'next/server';
import { searchLocalDB, searchYahooFinance } from '@/lib/yahooFinance';
import type { SearchTypeFilter } from '@/lib/yahooFinance';

const VALID_TYPES = new Set(['stock', 'etf', 'crypto', 'index']);

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q');
  const mode = request.nextUrl.searchParams.get('mode') as 'index' | null;
  const typeParam = request.nextUrl.searchParams.get('type');
  const typeFilter = (typeParam && VALID_TYPES.has(typeParam) ? typeParam : undefined) as SearchTypeFilter | undefined;

  if (!q || q.trim().length === 0) {
    return NextResponse.json([]);
  }

  try {
    const query = q.trim();

    // Local DB first (instant, 290k+ instruments), Yahoo Finance as supplement
    const [localResults, yahooResults] = await Promise.all([
      Promise.resolve(searchLocalDB(query, mode || undefined, typeFilter)),
      searchYahooFinance(query),
    ]);

    const seen = new Set<string>();
    const merged = [];

    // Local results first (reliable, instant)
    for (const r of localResults) {
      if (!seen.has(r.symbol)) {
        seen.add(r.symbol);
        merged.push(r);
      }
    }

    // Yahoo Finance results as supplement (may have fresher data)
    for (const r of yahooResults) {
      if (seen.has(r.symbol)) continue;
      // In index mode, only add INDEX/^ results from Yahoo
      if (mode === 'index' && r.quoteType !== 'INDEX' && !r.symbol.startsWith('^')) continue;
      // Apply type filter to Yahoo results too
      if (typeFilter) {
        const yahooType = r.quoteType === 'INDEX' ? 'index' : r.type;
        if (yahooType !== typeFilter) continue;
      }
      seen.add(r.symbol);
      merged.push(r);
    }

    return NextResponse.json(merged.slice(0, 20));
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
