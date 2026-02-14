'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { InstrumentLogo } from '@/components/ui/InstrumentLogo';
import { Badge } from '@/components/ui/Badge';
import { useLanguage } from '@/context/LanguageContext';
import { Instrument } from '@/types/portfolio';

export interface AllocationInstrument {
  instrument: Instrument;
  weight: number; // percentage in portfolio
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  instruments: AllocationInstrument[];
}

export function AllocationDetailModal({ isOpen, onClose, title, instruments }: Props) {
  const { t } = useLanguage();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {instruments.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('dashboard.noInstruments')}
        </p>
      ) : (
        <div className="space-y-3">
          {instruments
            .sort((a, b) => b.weight - a.weight)
            .map(({ instrument, weight }) => (
              <div
                key={instrument.symbol}
                className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700/50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <InstrumentLogo
                    symbol={instrument.symbol}
                    name={instrument.name}
                    type={instrument.type}
                    logoUrl={instrument.logoUrl}
                    size="sm"
                  />
                  <div>
                    <div className="font-medium text-sm text-gray-900 dark:text-white">
                      {instrument.symbol}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {instrument.name}
                    </div>
                  </div>
                  <Badge type={instrument.type} label={t(`types.${instrument.type}`)} />
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white ml-4 shrink-0">
                  {weight.toFixed(1)}%
                </span>
              </div>
            ))}
        </div>
      )}
    </Modal>
  );
}
