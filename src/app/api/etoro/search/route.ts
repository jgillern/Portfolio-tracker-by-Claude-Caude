import { NextRequest, NextResponse } from 'next/server';
import { searchTraders } from '@/lib/etoro/client';
import { captureError } from '@/lib/logger';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';
  if (!q.trim()) {
    return NextResponse.json([]);
  }

  try {
    const users = await searchTraders(q);
    return NextResponse.json(users);
  } catch (err) {
    captureError('eToro search', err);
    return NextResponse.json(
      { error: 'Failed to search eToro traders' },
      { status: 502 }
    );
  }
}
