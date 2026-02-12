'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getItem, setItem } from '@/lib/localStorage';
import { STORAGE_KEYS } from '@/config/constants';

export type Locale = 'en' | 'cs' | 'sk' | 'uk' | 'zh' | 'mn';

export const LOCALES: { code: Locale; flag: string; label: string }[] = [
  { code: 'en', flag: '🇬🇧', label: 'EN' },
  { code: 'cs', flag: '🇨🇿', label: 'CZ' },
  { code: 'sk', flag: '🇸🇰', label: 'SK' },
  { code: 'uk', flag: '🇺🇦', label: 'UA' },
  { code: 'zh', flag: '🇨🇳', label: 'ZH' },
  { code: 'mn', flag: '🇲🇳', label: 'MN' },
];

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Translations = Record<string, any>;

const cachedTranslations: Partial<Record<Locale, Translations>> = {};

async function loadTranslations(locale: Locale): Promise<Translations> {
  if (cachedTranslations[locale]) return cachedTranslations[locale]!;
  const res = await fetch(`/locales/${locale}.json`);
  const data = await res.json();
  cachedTranslations[locale] = data;
  return data;
}

function getNestedValue(obj: Translations, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === 'string' ? current : path;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [translations, setTranslations] = useState<Translations>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = getItem<Locale>(STORAGE_KEYS.LANGUAGE, 'en');
    const valid = LOCALES.some((l) => l.code === saved);
    setLocaleState(valid ? saved : 'en');
    setMounted(true);
  }, []);

  useEffect(() => {
    loadTranslations(locale).then(setTranslations);
    if (mounted) {
      setItem(STORAGE_KEYS.LANGUAGE, locale);
    }
  }, [locale, mounted]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
  }, []);

  const t = useCallback(
    (key: string): string => {
      return getNestedValue(translations, key);
    },
    [translations]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
