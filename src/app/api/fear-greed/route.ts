import { NextResponse } from 'next/server';

interface FearGreedDataPoint {
  x: number; // timestamp ms
  y: number; // 0-100
  rating: string;
}

interface FearGreedResponse {
  current: { value: number; rating: string; timestamp: number };
  history: FearGreedDataPoint[];
}

// Simple in-memory cache
let cached: { data: FearGreedResponse; expiresAt: number } | null = null;

export async function GET() {
  if (cached && Date.now() < cached.expiresAt) {
    return NextResponse.json(cached.data);
  }

  try {
    const res = await fetch(
      'https://production.dataviz.cnn.io/index/fearandgreed/graphdata',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!res.ok) {
      throw new Error(`CNN API returned ${res.status}`);
    }

    const raw = await res.json();

    // CNN returns { fear_and_greed: { score, rating, timestamp, ... }, fear_and_greed_historical: { data: [...] } }
    const current = {
      value: Math.round(raw.fear_and_greed?.score ?? 50),
      rating: raw.fear_and_greed?.rating ?? 'Neutral',
      timestamp: raw.fear_and_greed?.timestamp
        ? new Date(raw.fear_and_greed.timestamp).getTime()
        : Date.now(),
    };

    const historyRaw = raw.fear_and_greed_historical?.data ?? [];
    const history: FearGreedDataPoint[] = historyRaw.map((d: { x: number; y: number; rating: string }) => ({
      x: d.x,
      y: Math.round(d.y),
      rating: d.rating || '',
    }));

    const data: FearGreedResponse = { current, history };

    cached = { data, expiresAt: Date.now() + 30 * 60 * 1000 }; // 30 min cache
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fear & Greed API error:', error);

    // Return fallback if cache exists but is expired
    if (cached) {
      return NextResponse.json(cached.data);
    }

    return NextResponse.json(
      { error: 'Failed to fetch Fear & Greed data' },
      { status: 500 }
    );
  }
}
