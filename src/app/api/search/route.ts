import { NextRequest, NextResponse } from 'next/server';
import { searchInstruments } from '@/lib/yahooFinance';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q');
  if (!q || q.trim().length === 0) {
    return NextResponse.json([]);
  }

  try {
    const results = await searchInstruments(q.trim());
    return NextResponse.json(results);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
