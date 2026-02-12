'use client';

import { useState, useEffect, useCallback } from 'react';
import { CalendarEvent } from '@/types/market';

export function useCalendar(symbols: string[]) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const symbolsKey = symbols.join(',');

  const fetchEvents = useCallback(async () => {
    if (symbols.length === 0) {
      setEvents([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/calendar?symbols=${symbolsKey}`);
      if (!res.ok) throw new Error('Failed to fetch calendar events');
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [symbolsKey]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, isLoading, error, refetch: fetchEvents };
}
