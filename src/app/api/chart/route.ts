import { NextRequest, NextResponse } from 'next/server';
import { getChart } from '@/lib/yahooFinance';
import { TimePeriod } from '@/types/market';

const VALID_PERIODS: TimePeriod[] = ['1d', '1w', '1mo', '1y', '5y', 'ytd', 'max'];

export async function GET(request: NextRequest) {
  const symbolsParam = request.nextUrl.searchParams.get('symbols');
  const range = request.nextUrl.searchParams.get('range') as TimePeriod;
  const weightsParam = request.nextUrl.searchParams.get('weights');

  if (!symbolsParam) {
    return NextResponse.json({ error: 'symbols parameter required' }, { status: 400 });
  }

  if (!range || !VALID_PERIODS.includes(range)) {
    return NextResponse.json({ error: 'Invalid range parameter' }, { status: 400 });
  }

  const symbols = symbolsParam.split(',').filter(Boolean);
  const weights = weightsParam
    ? weightsParam.split(',').map(Number).filter((n) => !isNaN(n))
    : undefined;

  try {
    const data = await getChart(symbols, range, weights);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Chart API error:', error);
    return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 500 });
  }
}
