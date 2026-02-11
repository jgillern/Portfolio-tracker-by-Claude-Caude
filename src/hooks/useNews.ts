'use client';

import { useState, useEffect, useCallback } from 'react';
import { NewsArticle } from '@/types/market';

export function useNews(symbols: string[]) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const symbolsKey = symbols.join(',');

  const fetchNews = useCallback(async () => {
    if (symbols.length === 0) {
      setArticles([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/news?symbols=${symbolsKey}`);
      if (!res.ok) throw new Error('Failed to fetch news');
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [symbolsKey]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return { articles, isLoading, error, refetch: fetchNews };
}
