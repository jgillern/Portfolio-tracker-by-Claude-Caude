'use client';

import { useState, useEffect, useCallback } from 'react';
import { PortfolioMetrics } from '@/types/market';

export function useMetrics(symbols: string[], weights: number[]) {
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    if (symbols.length === 0) {
      setMetrics(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        symbols: symbols.join(','),
        weights: weights.join(','),
      });
      const res = await fetch(`/api/metrics?${params}`);
      if (!res.ok) throw new Error('Failed to fetch metrics');
      const data = await res.json();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [symbols.join(','), weights.join(',')]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { metrics, isLoading, error, refetch: fetchMetrics };
}
