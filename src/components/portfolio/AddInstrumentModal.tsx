'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { Modal } from '@/components/ui/Modal';
import { InstrumentSearch } from './InstrumentSearch';
import { SearchResult } from '@/types/api';
import { Instrument } from '@/types/portfolio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AddInstrumentModal({ isOpen, onClose }: Props) {
  const { t } = useLanguage();
  const { activePortfolio, addInstrument } = usePortfolio();

  if (!activePortfolio) return null;

  const existingSymbols = activePortfolio.instruments.map((i) => i.symbol);

  const handleSelect = (result: SearchResult) => {
    const instrument: Instrument = {
      symbol: result.symbol,
      name: result.name,
      type: result.type,
      sector: result.sector,
      addedAt: new Date().toISOString(),
    };
    addInstrument(activePortfolio.id, instrument);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('portfolio.addInstrument')}>
      <InstrumentSearch onSelect={handleSelect} existingSymbols={existingSymbols} />
    </Modal>
  );
}
