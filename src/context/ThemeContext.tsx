'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getItem, setItem } from '@/lib/localStorage';
import { STORAGE_KEYS } from '@/config/constants';
import { createClient } from '@/lib/supabase/client';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const saved = getItem<Theme | null>(STORAGE_KEYS.THEME, null);
  if (saved) return saved;
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setThemeState(getInitialTheme());
    setMounted(true);

    // Load from Supabase if logged in
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from('user_preferences')
          .select('theme')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            if (data?.theme) {
              setThemeState(data.theme as Theme);
              setItem(STORAGE_KEYS.THEME, data.theme);
            }
          });
      }
    });
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    setItem(STORAGE_KEYS.THEME, theme);
  }, [theme, mounted]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    // Sync to Supabase
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('user_preferences').update({ theme: newTheme }).eq('id', user.id).then(() => {});
      }
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      // Sync to Supabase
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          supabase.from('user_preferences').update({ theme: newTheme }).eq('id', user.id).then(() => {});
        }
      });
      return newTheme;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
