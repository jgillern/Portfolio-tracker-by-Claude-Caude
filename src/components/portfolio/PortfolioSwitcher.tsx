'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { cn } from '@/lib/utils';

interface Props {
  onCreateNew: () => void;
}

export function PortfolioSwitcher({ onCreateNew }: Props) {
  const { t } = useLanguage();
  const { state, activePortfolio, setActivePortfolio } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (state.portfolios.length === 0) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="max-w-[120px] truncate">{activePortfolio?.name ?? '—'}</span>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-56 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-50">
          {state.portfolios.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setActivePortfolio(p.id);
                setIsOpen(false);
              }}
              className={cn(
                'w-full text-left px-4 py-2.5 text-sm transition-colors first:rounded-t-lg',
                p.id === state.activePortfolioId
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
              )}
            >
              <span className="font-medium">{p.name}</span>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                ({p.instruments.length})
              </span>
            </button>
          ))}
          <button
            onClick={() => {
              setIsOpen(false);
              onCreateNew();
            }}
            className="w-full text-left px-4 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors rounded-b-lg border-t border-gray-100 dark:border-gray-700"
          >
            + {t('portfolio.addNewPortfolio')}
          </button>
        </div>
      )}
    </div>
  );
}
