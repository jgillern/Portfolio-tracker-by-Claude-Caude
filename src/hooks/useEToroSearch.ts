'use client';

import { useState, useEffect, useRef } from 'react';
import type { EToroUser } from '@/types/etoro';

export function useEToroSearch(query: string) {
  const [results, setResults] = useState<EToroUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/etoro/search?q=${encodeURIComponent(query.trim())}`
        );
        if (!res.ok) throw new Error('Search failed');
        const data: EToroUser[] = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query]);

  return { results, isLoading };
}
