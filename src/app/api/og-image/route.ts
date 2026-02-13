import { NextRequest, NextResponse } from 'next/server';

const cache = new Map<string, { url: string | null; ts: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function GET(request: NextRequest) {
  const articleUrl = request.nextUrl.searchParams.get('url');
  if (!articleUrl) {
    return NextResponse.json({ error: 'url parameter required' }, { status: 400 });
  }

  // Check cache
  const cached = cache.get(articleUrl);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json({ imageUrl: cached.url }, {
      headers: { 'Cache-Control': 'public, max-age=3600' },
    });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(articleUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; bot)',
        'Accept': 'text/html',
      },
      redirect: 'follow',
    });
    clearTimeout(timeout);

    if (!res.ok) {
      cache.set(articleUrl, { url: null, ts: Date.now() });
      return NextResponse.json({ imageUrl: null });
    }

    // Only read first 50KB to find OG tags (they're in <head>)
    const reader = res.body?.getReader();
    if (!reader) {
      return NextResponse.json({ imageUrl: null });
    }

    let html = '';
    const decoder = new TextDecoder();
    const MAX_BYTES = 50 * 1024;
    let bytesRead = 0;

    while (bytesRead < MAX_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      html += decoder.decode(value, { stream: true });
      bytesRead += value.length;
      // Stop early if we've passed </head>
      if (html.includes('</head>')) break;
    }
    reader.cancel();

    // Extract og:image
    const ogMatch = html.match(
      /<meta\s+(?:[^>]*?\s+)?(?:property|name)\s*=\s*["']og:image["'][^>]*?\s+content\s*=\s*["']([^"']+)["']/i
    ) || html.match(
      /<meta\s+(?:[^>]*?\s+)?content\s*=\s*["']([^"']+)["'][^>]*?\s+(?:property|name)\s*=\s*["']og:image["']/i
    );

    const imageUrl = ogMatch?.[1] || null;
    cache.set(articleUrl, { url: imageUrl, ts: Date.now() });

    return NextResponse.json({ imageUrl }, {
      headers: { 'Cache-Control': 'public, max-age=3600' },
    });
  } catch {
    cache.set(articleUrl, { url: null, ts: Date.now() });
    return NextResponse.json({ imageUrl: null });
  }
}
