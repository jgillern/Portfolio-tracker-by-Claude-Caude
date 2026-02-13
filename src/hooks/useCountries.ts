'use client';

import { useState, useEffect, useCallback } from 'react';
import { CountryAllocationItem } from '@/types/market';

export function useCountries(symbols: string[], types: string[], weights: number[]) {
  const [countries, setCountries] = useState<CountryAllocationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCountries = useCallback(async () => {
    if (symbols.length === 0) {
      setCountries([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/countries?symbols=${symbols.join(',')}&types=${types.join(',')}`
      );
      if (!res.ok) throw new Error('Failed to fetch countries');
      const data: { symbol: string; country: string; countryCode: string }[] = await res.json();

      // Aggregate by country using weights
      const totalWeight = weights.reduce((a, b) => a + b, 0);
      const countryMap = new Map<string, { country: string; countryCode: string; weight: number }>();

      // Track which symbols have country data
      const symbolsWithCountry = new Set<string>();

      for (const item of data) {
        const idx = symbols.indexOf(item.symbol);
        const w = idx >= 0 ? weights[idx] : 0;
        symbolsWithCountry.add(item.symbol);
        const existing = countryMap.get(item.country);
        if (existing) {
          existing.weight += w;
        } else {
          countryMap.set(item.country, { country: item.country, countryCode: item.countryCode, weight: w });
        }
      }

      // Add N/A category for symbols without country data (e.g., cryptocurrencies)
      let naWeight = 0;
      for (let i = 0; i < symbols.length; i++) {
        if (!symbolsWithCountry.has(symbols[i])) {
          naWeight += weights[i] || 0;
        }
      }

      if (naWeight > 0) {
        countryMap.set('N/A', { country: 'N/A', countryCode: 'N/A', weight: naWeight });
      }

      const result: CountryAllocationItem[] = Array.from(countryMap.values())
        .map((c) => ({
          country: c.country,
          countryCode: c.countryCode,
          percentage: totalWeight > 0 ? (c.weight / totalWeight) * 100 : 0,
        }))
        .sort((a, b) => b.percentage - a.percentage);

      setCountries(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [symbols.join(','), types.join(','), weights.join(',')]);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  return { countries, isLoading, error, refetch: fetchCountries };
}
