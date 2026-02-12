'use client';

import { useState, useEffect, useCallback } from 'react';
import { Quote } from '@/types/market';

export const REFRESH_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

export function useMarketData(symbols: string[]) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const fetchQuotes = useCallback(async () => {
    if (symbols.length === 0) {
      setQuotes([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/quote?symbols=${symbols.join(',')}`);
      if (!res.ok) throw new Error('Failed to fetch quotes');
      const data = await res.json();
      setQuotes(data);
      setLastUpdated(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [symbols.join(',')]);

  useEffect(() => {
    fetchQuotes();
    const interval = setInterval(fetchQuotes, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchQuotes]);

  return { quotes, isLoading, error, refetch: fetchQuotes, lastUpdated };
}
