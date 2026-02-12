import { NextRequest, NextResponse } from 'next/server';
import { getCalendarEvents } from '@/lib/yahooFinance';

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
    const events = await getCalendarEvents(symbols);
    return NextResponse.json(events);
  } catch (error) {
    console.error('Calendar API error:', error);
    return NextResponse.json({ error: 'Failed to fetch calendar events' }, { status: 500 });
  }
}
