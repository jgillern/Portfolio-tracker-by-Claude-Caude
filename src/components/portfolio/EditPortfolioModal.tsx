'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { InstrumentLogo } from '@/components/ui/InstrumentLogo';
import { hasCustomWeights } from '@/types/portfolio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function EditPortfolioModal({ isOpen, onClose }: Props) {
  const { t } = useLanguage();
  const { activePortfolio, removeInstrument, updateInstrumentWeight } = usePortfolio();
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

  if (!activePortfolio) return null;

  const { instruments } = activePortfolio;
  const customWeights = hasCustomWeights(activePortfolio);
  const weightsTotal = instruments.reduce((sum, i) => sum + (i.weight ?? 0), 0);
  const weightsValid = !customWeights || Math.abs(weightsTotal - 100) < 0.01;

  const handleRemove = (symbol: string) => {
    removeInstrument(activePortfolio.id, symbol);
    setConfirmRemove(null);
  };

  const handleWeightChange = (symbol: string, value: string) => {
    const parsed = value.trim() ? parseFloat(value) : undefined;
    updateInstrumentWeight(
      activePortfolio.id,
      symbol,
      parsed != null && !isNaN(parsed) && parsed > 0 ? parsed : undefined
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('portfolio.editPortfolio')}>
      <div className="space-y-3 max-h-[60vh] overflow-y-auto">
        {instruments.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            {t('dashboard.noInstruments')}
          </p>
        ) : (
          instruments.map((instrument) => (
            <div
              key={instrument.symbol}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
            >
              <InstrumentLogo
                symbol={instrument.symbol}
                name={instrument.name}
                type={instrument.type}
                logoUrl={instrument.logoUrl}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">
                    {instrument.symbol}
                  </span>
                  <Badge type={instrument.type} label={t(`types.${instrument.type}`)} />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {instrument.name}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={instrument.weight ?? ''}
                    onChange={(e) => handleWeightChange(instrument.symbol, e.target.value)}
                    placeholder="—"
                    className="w-16 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-1.5 py-1 text-xs text-right text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
                  />
                  <span className="text-xs text-gray-400">%</span>
                </div>

                {confirmRemove === instrument.symbol ? (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemove(instrument.symbol)}
                    >
                      {t('portfolio.yes')}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setConfirmRemove(null)}
                    >
                      {t('portfolio.no')}
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmRemove(instrument.symbol)}
                    className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title={t('dashboard.remove')}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {customWeights && instruments.length > 0 && (
        <div className={`mt-3 text-xs ${weightsValid ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
          {t('dashboard.weightsTotal')}: {weightsTotal.toFixed(1)}%
          {!weightsValid && ` — ${t('dashboard.weightsWarning')}`}
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <Button variant="secondary" onClick={onClose}>
          {t('portfolio.close')}
        </Button>
      </div>
    </Modal>
  );
}
