'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getItem, setItem } from '@/lib/localStorage';
import { STORAGE_KEYS, SKINS } from '@/config/constants';
import type { Skin } from '@/config/constants';
import { createClient } from '@/lib/supabase/client';

interface ThemeContextValue {
  theme: 'light' | 'dark';
  skin: Skin;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setSkin: (skin: Skin) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialSkin(): Skin {
  if (typeof window === 'undefined') return 'light';
  const saved = getItem<Skin | null>(STORAGE_KEYS.THEME, null);
  if (saved && SKINS.some((s) => s.key === saved)) return saved;
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
}

function skinIsDark(skin: Skin): boolean {
  return SKINS.find((s) => s.key === skin)?.isDark ?? false;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [skin, setSkinState] = useState<Skin>('light');
  const [mounted, setMounted] = useState(false);

  const theme = skinIsDark(skin) ? 'dark' : 'light';

  useEffect(() => {
    setSkinState(getInitialSkin());
    setMounted(true);

    // Listen for auth state to load skin from Supabase
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
        const user = session?.user;
        if (user) {
          supabase
            .from('user_preferences')
            .select('theme')
            .eq('id', user.id)
            .single()
            .then(({ data }) => {
              if (data?.theme && SKINS.some((s) => s.key === data.theme)) {
                setSkinState(data.theme as Skin);
                setItem(STORAGE_KEYS.THEME, data.theme);
              }
            });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (skinIsDark(skin)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.setAttribute('data-skin', skin);
    setItem(STORAGE_KEYS.THEME, skin);
  }, [skin, mounted]);

  const syncToSupabase = useCallback((newSkin: Skin) => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase.from('user_preferences').update({ theme: newSkin }).eq('id', session.user.id).then(() => {});
      }
    });
  }, []);

  const setSkin = useCallback((newSkin: Skin) => {
    setSkinState(newSkin);
    syncToSupabase(newSkin);
  }, [syncToSupabase]);

  const setTheme = useCallback((newTheme: 'light' | 'dark') => {
    const newSkin: Skin = newTheme === 'dark' ? 'dark' : 'light';
    setSkinState(newSkin);
    syncToSupabase(newSkin);
  }, [syncToSupabase]);

  const toggleTheme = useCallback(() => {
    setSkinState((prev) => {
      const newSkin: Skin = skinIsDark(prev) ? 'light' : 'dark';
      syncToSupabase(newSkin);
      return newSkin;
    });
  }, [syncToSupabase]);

  return (
    <ThemeContext.Provider value={{ theme, skin, toggleTheme, setTheme, setSkin }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
