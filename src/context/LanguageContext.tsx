'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getItem, setItem } from '@/lib/localStorage';
import { STORAGE_KEYS } from '@/config/constants';

type Locale = 'en' | 'cs';

interface LanguageContextValue {
  locale: Locale;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Translations = Record<string, any>;

let cachedTranslations: Record<Locale, Translations | null> = { en: null, cs: null };

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
  const [locale, setLocale] = useState<Locale>('en');
  const [translations, setTranslations] = useState<Translations>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = getItem<Locale>(STORAGE_KEYS.LANGUAGE, 'en');
    setLocale(saved);
    setMounted(true);
  }, []);

  useEffect(() => {
    loadTranslations(locale).then(setTranslations);
    if (mounted) {
      setItem(STORAGE_KEYS.LANGUAGE, locale);
    }
  }, [locale, mounted]);

  const toggleLanguage = useCallback(() => {
    setLocale((prev) => (prev === 'en' ? 'cs' : 'en'));
  }, []);

  const t = useCallback(
    (key: string): string => {
      return getNestedValue(translations, key);
    },
    [translations]
  );

  return (
    <LanguageContext.Provider value={{ locale, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
