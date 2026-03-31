import { NextRequest, NextResponse } from 'next/server';
import { getCountries } from '@/lib/yahooFinance';
import { captureError } from '@/lib/logger';

export async function GET(request: NextRequest) {
  const symbolsParam = request.nextUrl.searchParams.get('symbols');
  const typesParam = request.nextUrl.searchParams.get('types');
  if (!symbolsParam) {
    return NextResponse.json({ error: 'symbols parameter required' }, { status: 400 });
  }

  const symbols = symbolsParam.split(',').filter(Boolean);
  const types = typesParam?.split(',').filter(Boolean) ?? [];

  if (symbols.length === 0) {
    return NextResponse.json([]);
  }

  try {
    const countries = await getCountries(symbols, types);
    return NextResponse.json(countries);
  } catch (error) {
    captureError('Countries API', error);
    return NextResponse.json({ error: 'Failed to fetch countries' }, { status: 500 });
  }
}
