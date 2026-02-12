'use client';

import React, { useState, useEffect } from 'react';
import { InstrumentType } from '@/types/portfolio';

const TYPE_COLORS: Record<InstrumentType, string> = {
  stock: 'bg-blue-500',
  etf: 'bg-green-500',
  crypto: 'bg-orange-500',
  bond: 'bg-purple-500',
  commodity: 'bg-yellow-500',
};

// Module-level cache: symbol -> logoUrl (null = no logo available)
const logoCache = new Map<string, string | null>();
// Track in-flight requests to avoid duplicates
const pendingRequests = new Map<string, Promise<string | null>>();

function fetchLogoUrl(symbol: string, type: InstrumentType): Promise<string | null> {
  const cacheKey = `${symbol}:${type}`;

  // Already cached
  if (logoCache.has(cacheKey)) {
    return Promise.resolve(logoCache.get(cacheKey)!);
  }

  // Already fetching
  const pending = pendingRequests.get(cacheKey);
  if (pending) return pending;

  const promise = fetch(`/api/logo?symbol=${encodeURIComponent(symbol)}&type=${encodeURIComponent(type)}`)
    .then((res) => {
      if (!res.ok) throw new Error('Logo fetch failed');
      return res.json();
    })
    .then((data: { logoUrl: string | null }) => {
      logoCache.set(cacheKey, data.logoUrl);
      pendingRequests.delete(cacheKey);
      return data.logoUrl;
    })
    .catch(() => {
      logoCache.set(cacheKey, null);
      pendingRequests.delete(cacheKey);
      return null;
    });

  pendingRequests.set(cacheKey, promise);
  return promise;
}

interface Props {
  symbol: string;
  name: string;
  type: InstrumentType;
  logoUrl?: string;
  size?: 'sm' | 'md';
}

export function InstrumentLogo({ symbol, name, type, logoUrl, size = 'sm' }: Props) {
  const cacheKey = `${symbol}:${type}`;
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(
    logoUrl || logoCache.get(cacheKey) || null
  );
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    // If we already have an explicit logoUrl, use it
    if (logoUrl) {
      setResolvedUrl(logoUrl);
      return;
    }

    // Check cache first
    if (logoCache.has(cacheKey)) {
      setResolvedUrl(logoCache.get(cacheKey)!);
      return;
    }

    // Fetch logo URL from server
    let cancelled = false;
    fetchLogoUrl(symbol, type).then((url) => {
      if (!cancelled) {
        setResolvedUrl(url);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [symbol, type, logoUrl, cacheKey]);

  const sizeClass = size === 'md' ? 'h-8 w-8 text-xs' : 'h-6 w-6 text-[10px]';
  const initial = symbol.charAt(0).toUpperCase();

  // Show logo image if we have a URL and no error
  if (resolvedUrl && !imgError) {
    return (
      <img
        src={resolvedUrl}
        alt={name}
        className={`${sizeClass} rounded-full object-cover shrink-0`}
        onError={() => setImgError(true)}
        loading="lazy"
      />
    );
  }

  // Fallback: colored circle with initial letter
  return (
    <div
      className={`${sizeClass} ${TYPE_COLORS[type]} rounded-full flex items-center justify-center text-white font-bold shrink-0`}
      title={name}
    >
      {initial}
    </div>
  );
}
