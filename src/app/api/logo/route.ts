import { NextRequest } from 'next/server';
import { getLogoImage } from '@/lib/yahooFinance';
import { InstrumentType } from '@/types/portfolio';

const VALID_TYPES: InstrumentType[] = ['stock', 'etf', 'crypto', 'bond', 'commodity'];

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol');
  const type = request.nextUrl.searchParams.get('type') as InstrumentType | null;

  if (!symbol) {
    return new Response('Missing symbol', { status: 400 });
  }

  const instrumentType: InstrumentType =
    type && VALID_TYPES.includes(type) ? type : 'stock';

  try {
    const result = await getLogoImage(symbol, instrumentType);

    if (!result) {
      return new Response(null, { status: 404 });
    }

    return new Response(new Uint8Array(result.buffer), {
      headers: {
        'Content-Type': result.contentType,
        'Cache-Control': 'public, max-age=604800, immutable',
      },
    });
  } catch (error) {
    console.error('Logo API error:', error);
    return new Response(null, { status: 500 });
  }
}
