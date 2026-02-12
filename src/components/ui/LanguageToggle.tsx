'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LOCALES, Locale } from '@/context/LanguageContext';

function FlagIcon({ countryCode, size = 20 }: { countryCode: string; size?: number }) {
  const height = Math.round(size * 0.75);
  return (
    <img
      src={`https://flagcdn.com/${size * 2}x${height * 2}/${countryCode}.png`}
      srcSet={`https://flagcdn.com/${size * 3}x${height * 3}/${countryCode}.png 2x`}
      width={size}
      height={height}
      alt={countryCode.toUpperCase()}
      className="inline-block rounded-[2px]"
      loading="lazy"
    />
  );
}

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: Locale) => {
    setLocale(code);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <FlagIcon countryCode={current.countryCode} size={20} />
        <span>{current.label}</span>
        <svg className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-36 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-50 py-1">
          {LOCALES.map((loc) => (
            <button
              key={loc.code}
              onClick={() => handleSelect(loc.code)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                loc.code === locale
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <FlagIcon countryCode={loc.countryCode} size={20} />
              <span>{loc.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
