'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getItem, setItem } from '@/lib/localStorage';
import { STORAGE_KEYS, SKINS, AVATARS } from '@/config/constants';
import type { Skin, AvatarId } from '@/config/constants';
import { createClient } from '@/lib/supabase/client';

interface ThemeContextValue {
  theme: 'light' | 'dark';
  skin: Skin;
  avatar: AvatarId;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  /** Apply skin visually (live preview). Does NOT save to DB. */
  setSkin: (skin: Skin) => void;
  /** Apply avatar visually (live preview). Does NOT save to DB. */
  setAvatar: (avatar: AvatarId) => void;
  /** Persist current skin + avatar to DB + localStorage. */
  persistPreferences: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const DEFAULT_AVATAR: AvatarId = 'ninja';

/** Parse "ocean|ninja" → { skin, avatar }. Backward-compat with plain "dark". */
function parseThemeValue(raw: string): { skin: Skin; avatar: AvatarId } {
  const parts = raw.split('|');
  const skin = SKINS.some((s) => s.key === parts[0]) ? (parts[0] as Skin) : 'light';
  const avatar = parts[1] && AVATARS.some((a) => a.id === parts[1])
    ? (parts[1] as AvatarId)
    : DEFAULT_AVATAR;
  return { skin, avatar };
}

function encodeThemeValue(skin: Skin, avatar: AvatarId): string {
  return `${skin}|${avatar}`;
}

function skinIsDark(skin: Skin): boolean {
  return SKINS.find((s) => s.key === skin)?.isDark ?? false;
}

function getInitialValues(): { skin: Skin; avatar: AvatarId } {
  if (typeof window === 'undefined') return { skin: 'light', avatar: DEFAULT_AVATAR };

  // Try new combined format first
  const saved = getItem<string | null>(STORAGE_KEYS.THEME, null);
  if (saved) {
    const parsed = parseThemeValue(saved);
    // Also check legacy standalone avatar key
    const legacyAvatar = getItem<AvatarId | null>(STORAGE_KEYS.AVATAR, null);
    if (legacyAvatar && !saved.includes('|')) {
      return { skin: parsed.skin, avatar: legacyAvatar };
    }
    return parsed;
  }

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return { skin: 'dark', avatar: DEFAULT_AVATAR };
  }
  return { skin: 'light', avatar: DEFAULT_AVATAR };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [skin, setSkinState] = useState<Skin>('light');
  const [avatar, setAvatarState] = useState<AvatarId>(DEFAULT_AVATAR);
  const [mounted, setMounted] = useState(false);
  const userIdRef = useRef<string | null>(null);

  const theme = skinIsDark(skin) ? 'dark' : 'light';

  // Load initial values + listen for auth to load from Supabase
  useEffect(() => {
    const initial = getInitialValues();
    setSkinState(initial.skin);
    setAvatarState(initial.avatar);
    setMounted(true);

    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
        const user = session?.user;
        if (user) {
          userIdRef.current = user.id;
          supabase
            .from('user_preferences')
            .select('theme')
            .eq('id', user.id)
            .single()
            .then(({ data }) => {
              if (data?.theme) {
                const parsed = parseThemeValue(data.theme);
                setSkinState(parsed.skin);
                setAvatarState(parsed.avatar);
                // Keep localStorage in sync
                setItem(STORAGE_KEYS.THEME, data.theme);
                setItem(STORAGE_KEYS.AVATAR, parsed.avatar);
              }
            });
        }
      }
      if (event === 'SIGNED_OUT') {
        userIdRef.current = null;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Apply skin to DOM whenever it changes
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (skinIsDark(skin)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.setAttribute('data-skin', skin);
  }, [skin, mounted]);

  // Apply skin visually (preview). Updates localStorage but NOT DB.
  const setSkin = useCallback((newSkin: Skin) => {
    setSkinState(newSkin);
    // Update localStorage so it reflects the preview state
    const currentAvatar = getItem<AvatarId | null>(STORAGE_KEYS.AVATAR, null) ?? DEFAULT_AVATAR;
    setItem(STORAGE_KEYS.THEME, encodeThemeValue(newSkin, currentAvatar));
  }, []);

  // Apply avatar visually (preview). Updates localStorage but NOT DB.
  const setAvatar = useCallback((newAvatar: AvatarId) => {
    setAvatarState(newAvatar);
    setItem(STORAGE_KEYS.AVATAR, newAvatar);
  }, []);

  // Persist current skin + avatar to DB
  const persistPreferences = useCallback(async () => {
    const encoded = encodeThemeValue(skin, avatar);
    setItem(STORAGE_KEYS.THEME, encoded);
    setItem(STORAGE_KEYS.AVATAR, avatar);

    if (userIdRef.current) {
      const supabase = createClient();
      await supabase
        .from('user_preferences')
        .update({ theme: encoded })
        .eq('id', userIdRef.current);
    }
  }, [skin, avatar]);

  // Convenience: toggle between light and dark base themes
  const toggleTheme = useCallback(() => {
    setSkinState((prev) => {
      const newSkin: Skin = skinIsDark(prev) ? 'light' : 'dark';
      // Also persist immediately for toggle button (outside settings modal)
      const currentAvatar = getItem<AvatarId | null>(STORAGE_KEYS.AVATAR, null) ?? DEFAULT_AVATAR;
      const encoded = encodeThemeValue(newSkin, currentAvatar);
      setItem(STORAGE_KEYS.THEME, encoded);
      if (userIdRef.current) {
        const supabase = createClient();
        supabase.from('user_preferences').update({ theme: encoded }).eq('id', userIdRef.current).then(() => {});
      }
      return newSkin;
    });
  }, []);

  // Convenience: set light or dark
  const setTheme = useCallback((newTheme: 'light' | 'dark') => {
    const newSkin: Skin = newTheme === 'dark' ? 'dark' : 'light';
    setSkin(newSkin);
  }, [setSkin]);

  return (
    <ThemeContext.Provider value={{ theme, skin, avatar, toggleTheme, setTheme, setSkin, setAvatar, persistPreferences }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
