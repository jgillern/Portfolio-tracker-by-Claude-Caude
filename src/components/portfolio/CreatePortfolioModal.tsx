'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePortfolioModal({ isOpen, onClose }: Props) {
  const { t } = useLanguage();
  const { createPortfolio } = usePortfolio();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setError(null);
    setLoading(true);
    const ok = await createPortfolio(name.trim());
    setLoading(false);

    if (ok) {
      setName('');
      onClose();
    } else {
      setError(t('errors.fetchFailed'));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('header.createPortfolio')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('portfolio.name')}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('portfolio.namePlaceholder')}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
          />
        </div>
        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-3">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" type="button" onClick={onClose}>
            {t('portfolio.cancel')}
          </Button>
          <Button type="submit" disabled={!name.trim() || loading}>
            {loading ? '...' : t('portfolio.create')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
