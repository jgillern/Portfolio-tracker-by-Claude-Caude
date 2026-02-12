'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { InstrumentLogo } from '@/components/ui/InstrumentLogo';
import { Instrument, hasCustomWeights } from '@/types/portfolio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface LocalInstrument extends Instrument {
  _removed?: boolean;
}

export function EditPortfolioModal({ isOpen, onClose }: Props) {
  const { t } = useLanguage();
  const { activePortfolio, removeInstrument, updateInstrumentWeight } = usePortfolio();
  const [localInstruments, setLocalInstruments] = useState<LocalInstrument[]>([]);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

  // Sync local state when modal opens or portfolio changes
  useEffect(() => {
    if (isOpen && activePortfolio) {
      setLocalInstruments(activePortfolio.instruments.map((i) => ({ ...i })));
      setConfirmRemove(null);
    }
  }, [isOpen, activePortfolio]);

  if (!activePortfolio) return null;

  const visibleInstruments = localInstruments.filter((i) => !i._removed);
  const anyHasWeight = visibleInstruments.some((i) => i.weight != null && i.weight > 0);
  const weightsTotal = visibleInstruments.reduce((sum, i) => sum + (i.weight ?? 0), 0);
  const weightsValid = !anyHasWeight || Math.abs(weightsTotal - 100) < 0.01;

  const handleRemove = (symbol: string) => {
    setLocalInstruments((prev) =>
      prev.map((i) => (i.symbol === symbol ? { ...i, _removed: true } : i))
    );
    setConfirmRemove(null);
  };

  const handleWeightChange = (symbol: string, value: string) => {
    const parsed = value.trim() ? parseFloat(value) : undefined;
    setLocalInstruments((prev) =>
      prev.map((i) =>
        i.symbol === symbol
          ? { ...i, weight: parsed != null && !isNaN(parsed) && parsed > 0 ? parsed : undefined }
          : i
      )
    );
  };

  const handleSave = () => {
    // Apply removals
    const removedSymbols = localInstruments
      .filter((i) => i._removed)
      .map((i) => i.symbol);
    for (const symbol of removedSymbols) {
      removeInstrument(activePortfolio.id, symbol);
    }

    // Apply weight changes
    for (const local of visibleInstruments) {
      const original = activePortfolio.instruments.find((i) => i.symbol === local.symbol);
      if (original && original.weight !== local.weight) {
        updateInstrumentWeight(activePortfolio.id, local.symbol, local.weight);
      }
    }

    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title={t('portfolio.editPortfolio')}>
      <div className="space-y-3 max-h-[60vh] overflow-y-auto">
        {visibleInstruments.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            {t('dashboard.noInstruments')}
          </p>
        ) : (
          visibleInstruments.map((instrument) => (
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

      {anyHasWeight && visibleInstruments.length > 0 && (
        <div className={`mt-3 text-xs ${weightsValid ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
          {t('dashboard.weightsTotal')}: {weightsTotal.toFixed(1)}%
          {!weightsValid && ` — ${t('dashboard.weightsWarning')}`}
        </div>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={handleCancel}>
          {t('portfolio.cancel')}
        </Button>
        <Button onClick={handleSave}>
          {t('portfolio.save')}
        </Button>
      </div>
    </Modal>
  );
}
