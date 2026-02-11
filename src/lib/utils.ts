import clsx, { ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
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

export function formatDate(date: Date | string, locale = 'en'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale === 'cs' ? 'cs-CZ' : 'en-US', {
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

export function getInstrumentWeights(
  instruments: { weight?: number }[],
  useCustomWeights: boolean
): number[] {
  if (!useCustomWeights || instruments.length === 0) {
    return getEqualWeights(instruments.length);
  }
  return instruments.map((i) => i.weight ?? 100 / instruments.length);
}
