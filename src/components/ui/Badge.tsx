'use client';

import { cn } from '@/lib/utils';
import { InstrumentType } from '@/types/portfolio';

const typeColors: Record<InstrumentType, string> = {
  stock: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  etf: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  crypto: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  bond: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  commodity: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
};

export function Badge({
  type,
  label,
  className,
}: {
  type: InstrumentType;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        typeColors[type],
        className
      )}
    >
      {label}
    </span>
  );
}
