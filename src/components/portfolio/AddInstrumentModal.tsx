'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { InstrumentSearch } from './InstrumentSearch';
import { SearchResult } from '@/types/api';
import { Instrument, hasCustomWeights } from '@/types/portfolio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AddInstrumentModal({ isOpen, onClose }: Props) {
  const { t } = useLanguage();
  const { activePortfolio, addInstrument } = usePortfolio();
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [weight, setWeight] = useState('');

  if (!activePortfolio) return null;

  const existingSymbols = activePortfolio.instruments.map((i) => i.symbol);
  const otherInstrumentsHaveWeights = hasCustomWeights(activePortfolio);

  const handleSelect = (result: SearchResult) => {
    setSelected(result);
    setWeight('');
  };

  const handleConfirm = () => {
    if (!selected) return;
    const parsedWeight = weight.trim() ? parseFloat(weight) : undefined;
    const instrument: Instrument = {
      symbol: selected.symbol,
      name: selected.name,
      type: selected.type,
      sector: selected.sector,
      weight: parsedWeight != null && !isNaN(parsedWeight) && parsedWeight > 0 ? parsedWeight : undefined,
      addedAt: new Date().toISOString(),
    };
    addInstrument(activePortfolio.id, instrument);
    setSelected(null);
    setWeight('');
  };

  const handleClose = () => {
    setSelected(null);
    setWeight('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('portfolio.addInstrument')}>
      {!selected ? (
        <InstrumentSearch onSelect={handleSelect} existingSymbols={existingSymbols} />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-gray-900 dark:text-white">
                  {selected.symbol}
                </span>
                <Badge type={selected.type} label={t(`types.${selected.type}`)} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {selected.name}
              </p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {t('portfolio.changeInstrument')}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('portfolio.weightLabel')}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={t('portfolio.weightPlaceholder')}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-500">%</span>
            </div>
            {otherInstrumentsHaveWeights && !weight.trim() && (
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                {t('portfolio.weightRequired')}
              </p>
            )}
            {!otherInstrumentsHaveWeights && (
              <p className="mt-1 text-xs text-gray-400">
                {t('portfolio.weightHint')}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setSelected(null)}>
              {t('portfolio.back')}
            </Button>
            <Button onClick={handleConfirm}>
              {t('search.add')} {selected.symbol}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
