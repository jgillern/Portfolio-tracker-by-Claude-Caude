import { NextRequest, NextResponse } from 'next/server';
import { fetchPortfolio } from '@/lib/etoro/client';
import { captureError } from '@/lib/logger';

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username') ?? '';
  if (!username.trim()) {
    return NextResponse.json(
      { error: 'username parameter is required' },
      { status: 400 }
    );
  }

  try {
    const data = await fetchPortfolio(username);
    if (!data) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(data);
  } catch (err) {
    captureError('eToro portfolio', err);
    return NextResponse.json(
      { error: 'Failed to fetch eToro portfolio' },
      { status: 502 }
    );
  }
}
