'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChartDataPoint, TimePeriod } from '@/types/market';

export function useChart(symbols: string[], period: TimePeriod, weights?: number[]) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const symbolsKey = symbols.join(',');
  const weightsKey = weights?.join(',') ?? '';

  const fetchChart = useCallback(async () => {
    if (symbols.length === 0) {
      setData([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let url = `/api/chart?symbols=${symbolsKey}&range=${period}`;
      if (weights && weights.length > 0) {
        url += `&weights=${weightsKey}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch chart data');
      const chartData = await res.json();
      setData(chartData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [symbolsKey, period, weightsKey]);

  useEffect(() => {
    fetchChart();
  }, [fetchChart]);

  return { data, isLoading, error, refetch: fetchChart };
}
