'use client';

import { useState, useCallback, useEffect } from 'react';
import { getItem, setItem } from '@/lib/localStorage';
import { createClient } from '@/lib/supabase/client';

const STORAGE_KEY = 'portfolio-tracker-dashboard-order';

const DEFAULT_ORDER = [
  'keyStats',
  'performance',
  'instruments',
  'sectorAllocation',
  'typeAllocation',
  'countryAllocation',
  'metrics',
];

export function useDashboardOrder() {
  const [order, setOrder] = useState<string[]>(DEFAULT_ORDER);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  useEffect(() => {
    const saved = getItem<string[]>(STORAGE_KEY, DEFAULT_ORDER);
    // Merge: keep saved order but add any new sections, remove deleted ones
    const validSections = new Set(DEFAULT_ORDER);
    const merged = saved.filter((id) => validSections.has(id));
    for (const id of DEFAULT_ORDER) {
      if (!merged.includes(id)) merged.push(id);
    }
    setOrder(merged);

    // Load from Supabase if logged in
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from('user_preferences')
          .select('dashboard_order')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            if (data?.dashboard_order?.length) {
              const dbOrder = data.dashboard_order as string[];
              const mergedDb = dbOrder.filter((id) => validSections.has(id));
              for (const id of DEFAULT_ORDER) {
                if (!mergedDb.includes(id)) mergedDb.push(id);
              }
              setOrder(mergedDb);
              setItem(STORAGE_KEY, mergedDb);
            }
          });
      }
    });
  }, []);

  const handleDragStart = useCallback((id: string) => {
    setDraggedId(id);
  }, []);

  const handleDragOver = useCallback((id: string) => {
    setDragOverId(id);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (draggedId && dragOverId && draggedId !== dragOverId) {
      setOrder((prev) => {
        const newOrder = [...prev];
        const fromIdx = newOrder.indexOf(draggedId);
        const toIdx = newOrder.indexOf(dragOverId);
        if (fromIdx === -1 || toIdx === -1) return prev;
        newOrder.splice(fromIdx, 1);
        newOrder.splice(toIdx, 0, draggedId);
        setItem(STORAGE_KEY, newOrder);

        // Sync to Supabase
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user) {
            supabase.from('user_preferences').update({ dashboard_order: newOrder }).eq('id', user.id).then(() => {});
          }
        });

        return newOrder;
      });
    }
    setDraggedId(null);
    setDragOverId(null);
  }, [draggedId, dragOverId]);

  return { order, draggedId, dragOverId, handleDragStart, handleDragOver, handleDragEnd };
}
