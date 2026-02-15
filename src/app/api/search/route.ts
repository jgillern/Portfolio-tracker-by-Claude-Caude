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

    // Local DB search (instant, 290k+ instruments)
    const localResults = searchLocalDB(query, mode || undefined, typeFilter);

    // In index mode, local DB (91k indices) is sufficient - skip Yahoo Finance
    if (mode === 'index') {
      return NextResponse.json(localResults.slice(0, 20));
    }

    // For general search, supplement with Yahoo Finance
    const yahooResults = await searchYahooFinance(query);

    const seen = new Set<string>();
    const merged = [];

    for (const r of localResults) {
      if (!seen.has(r.symbol)) {
        seen.add(r.symbol);
        merged.push(r);
      }
    }

    for (const r of yahooResults) {
      if (seen.has(r.symbol)) continue;
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
