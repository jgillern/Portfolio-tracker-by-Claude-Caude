import { NextRequest, NextResponse } from 'next/server';
import { searchInstruments, searchLocalIndices } from '@/lib/yahooFinance';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q');
  const mode = request.nextUrl.searchParams.get('mode'); // 'index' for index-specific search
  if (!q || q.trim().length === 0) {
    return NextResponse.json([]);
  }

  try {
    const query = q.trim();

    if (mode === 'index') {
      // For index search: merge local index DB + Yahoo Finance results, dedup by symbol
      const [localResults, yahooResults] = await Promise.all([
        Promise.resolve(searchLocalIndices(query)),
        searchInstruments(query),
      ]);

      const seen = new Set<string>();
      const merged = [];

      // Local results first (reliable, always available)
      for (const r of localResults) {
        if (!seen.has(r.symbol)) {
          seen.add(r.symbol);
          merged.push(r);
        }
      }

      // Then Yahoo Finance results (filtered for INDEX quoteType or ^ symbol)
      for (const r of yahooResults) {
        if (!seen.has(r.symbol) && (r.quoteType === 'INDEX' || r.symbol.startsWith('^'))) {
          seen.add(r.symbol);
          merged.push(r);
        }
      }

      return NextResponse.json(merged);
    }

    const results = await searchInstruments(query);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
