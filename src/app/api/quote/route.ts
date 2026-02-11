import { NextRequest, NextResponse } from 'next/server';
import { getQuotes } from '@/lib/yahooFinance';

export async function GET(request: NextRequest) {
  const symbolsParam = request.nextUrl.searchParams.get('symbols');
  if (!symbolsParam) {
    return NextResponse.json({ error: 'symbols parameter required' }, { status: 400 });
  }

  const symbols = symbolsParam.split(',').filter(Boolean);
  if (symbols.length === 0) {
    return NextResponse.json([]);
  }

  try {
    const quotes = await getQuotes(symbols);
    return NextResponse.json(quotes);
  } catch (error) {
    console.error('Quote API error:', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}
