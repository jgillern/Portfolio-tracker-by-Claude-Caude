import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioMetrics } from '@/lib/yahooFinance';

export async function GET(request: NextRequest) {
  const symbolsParam = request.nextUrl.searchParams.get('symbols');
  const weightsParam = request.nextUrl.searchParams.get('weights');
  if (!symbolsParam) {
    return NextResponse.json({ error: 'symbols parameter required' }, { status: 400 });
  }

  const symbols = symbolsParam.split(',').filter(Boolean);
  if (symbols.length === 0) {
    return NextResponse.json({ error: 'symbols parameter required' }, { status: 400 });
  }

  const weights = weightsParam
    ? weightsParam.split(',').map(Number)
    : Array(symbols.length).fill(100 / symbols.length);

  try {
    const metrics = await getPortfolioMetrics(symbols, weights);
    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Metrics API error:', error);
    return NextResponse.json({ error: 'Failed to calculate metrics' }, { status: 500 });
  }
}
