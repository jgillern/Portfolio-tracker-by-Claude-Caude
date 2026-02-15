'use client';

import { useState, useEffect, useRef } from 'react';
import { SearchResult } from '@/types/api';

export type SearchTypeFilter = 'stock' | 'etf' | 'crypto' | 'index';

export function useSearch(query: string, mode?: 'index', typeFilter?: SearchTypeFilter) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!query || query.trim().length < 1) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    timeoutRef.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q: query.trim() });
        if (mode) params.set('mode', mode);
        if (typeFilter) params.set('type', typeFilter);
        const res = await fetch(`/api/search?${params}`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query, mode, typeFilter]);

  return { results, isLoading };
}
