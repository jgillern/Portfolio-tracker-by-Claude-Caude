import { NextRequest, NextResponse } from 'next/server';
import { searchYahooFinance } from '@/lib/yahooFinance';
import type { SearchTypeFilter } from '@/lib/yahooFinance';
import { searchPredefinedIndexes } from '@/config/indexes';
import type { SearchResult } from '@/types/api';

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

    // Index mode: search predefined index list + Yahoo Finance supplement
    if (mode === 'index') {
      const predefined = searchPredefinedIndexes(query);
      const predefinedResults: SearchResult[] = predefined.map((idx) => ({
        symbol: idx.ticker,
        name: idx.name,
        type: 'etf' as const,
        exchange: '',
        quoteType: 'INDEX',
      }));

      // Supplement with Yahoo Finance for indexes not in our list
      const yahooResults = await searchYahooFinance(query);
      const seen = new Set(predefinedResults.map((r) => r.symbol));
      const merged = [...predefinedResults];

      for (const r of yahooResults) {
        if (seen.has(r.symbol)) continue;
        if (r.quoteType !== 'INDEX') continue;
        seen.add(r.symbol);
        merged.push(r);
      }

      return NextResponse.json(merged.slice(0, 20));
    }

    // General instrument search: Yahoo Finance API
    const yahooResults = await searchYahooFinance(query);

    if (typeFilter) {
      const filtered = yahooResults.filter((r) => {
        const yahooType = r.quoteType === 'INDEX' ? 'index' : r.type;
        return yahooType === typeFilter;
      });
      return NextResponse.json(filtered.slice(0, 20));
    }

    return NextResponse.json(yahooResults.slice(0, 20));
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
