import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { hasCustomWeights, Portfolio } from '@/types/portfolio';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

const LOCALE_MAP: Record<string, string> = {
  en: 'en-US',
  cs: 'cs-CZ',
  sk: 'sk-SK',
  uk: 'uk-UA',
  zh: 'zh-CN',
  mn: 'mn-MN',
};

export function formatDate(date: Date | string, locale = 'en'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(LOCALE_MAP[locale] || 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getEqualWeights(count: number): number[] {
  if (count === 0) return [];
  const weight = 100 / count;
  return Array(count).fill(weight);
}

export function getPortfolioWeights(portfolio: Portfolio): number[] {
  const { instruments } = portfolio;
  if (instruments.length === 0) return [];
  if (!hasCustomWeights(portfolio)) {
    return getEqualWeights(instruments.length);
  }
  return instruments.map((i) => i.weight ?? 0);
}
