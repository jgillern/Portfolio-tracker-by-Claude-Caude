'use client';

import React, { useState } from 'react';
import { InstrumentType } from '@/types/portfolio';

const TYPE_COLORS: Record<InstrumentType, string> = {
  stock: 'bg-blue-500',
  etf: 'bg-green-500',
  crypto: 'bg-orange-500',
  bond: 'bg-purple-500',
  commodity: 'bg-yellow-500',
};

interface Props {
  symbol: string;
  name: string;
  type: InstrumentType;
  logoUrl?: string;
  size?: 'sm' | 'md';
}

export function InstrumentLogo({ symbol, name, type, logoUrl, size = 'sm' }: Props) {
  const [imgError, setImgError] = useState(false);
  const sizeClass = size === 'md' ? 'h-8 w-8 text-xs' : 'h-6 w-6 text-[10px]';
  const initial = symbol.charAt(0).toUpperCase();

  if (logoUrl && !imgError) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className={`${sizeClass} rounded-full object-cover`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} ${TYPE_COLORS[type]} rounded-full flex items-center justify-center text-white font-bold shrink-0`}
      title={name}
    >
      {initial}
    </div>
  );
}
