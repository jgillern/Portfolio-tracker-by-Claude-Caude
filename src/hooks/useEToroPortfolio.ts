'use client';

import { useState, useCallback } from 'react';
import type { EToroPortfolioData } from '@/types/etoro';

export function useEToroPortfolio() {
  const [data, setData] = useState<EToroPortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = useCallback(async (username: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(
        `/api/etoro/portfolio?username=${encodeURIComponent(username)}`
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }
      const portfolio: EToroPortfolioData = await res.json();
      setData(portfolio);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, isLoading, error, fetchPortfolio, clear };
}
