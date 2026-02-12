import { NextRequest, NextResponse } from 'next/server';
import { getLogoUrl } from '@/lib/yahooFinance';
import { InstrumentType } from '@/types/portfolio';

const VALID_TYPES: InstrumentType[] = ['stock', 'etf', 'crypto', 'bond', 'commodity'];

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol');
  const type = request.nextUrl.searchParams.get('type') as InstrumentType | null;

  if (!symbol) {
    return NextResponse.json({ error: 'Missing symbol' }, { status: 400 });
  }

  const instrumentType: InstrumentType =
    type && VALID_TYPES.includes(type) ? type : 'stock';

  try {
    const logoUrl = await getLogoUrl(symbol, instrumentType);
    return NextResponse.json({ logoUrl });
  } catch (error) {
    console.error('Logo API error:', error);
    return NextResponse.json({ error: 'Logo lookup failed' }, { status: 500 });
  }
}
