import { NextRequest, NextResponse } from 'next/server';
import { getNews } from '@/lib/yahooFinance';

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
    const articles = await getNews(symbols);
    return NextResponse.json(articles);
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
