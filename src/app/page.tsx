'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { InstrumentsTable } from '@/components/dashboard/InstrumentsTable';
import { AllocationTable } from '@/components/dashboard/AllocationTable';
import { AddInstrumentModal } from '@/components/portfolio/AddInstrumentModal';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const { t } = useLanguage();
  const { activePortfolio, deletePortfolio } = usePortfolio();
  const [showAddInstrument, setShowAddInstrument] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!activePortfolio) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <svg className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          {t('dashboard.noPortfolio')}
        </h2>
        <p className="mt-1 text-gray-500 dark:text-gray-400">{t('dashboard.createFirst')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {activePortfolio.name}
        </h1>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowAddInstrument(true)}>
            + {t('portfolio.addInstrument')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700"
            onClick={() => setShowDeleteConfirm(true)}
          >
            {t('portfolio.delete')}
          </Button>
        </div>
      </div>

      <PerformanceChart />
      <InstrumentsTable />
      <AllocationTable />

      <AddInstrumentModal
        isOpen={showAddInstrument}
        onClose={() => setShowAddInstrument(false)}
      />

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="rounded-xl bg-white dark:bg-gray-800 shadow-xl p-6 max-w-sm w-full">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              {t('portfolio.confirmDelete')}
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                {t('portfolio.no')}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  deletePortfolio(activePortfolio.id);
                  setShowDeleteConfirm(false);
                }}
              >
                {t('portfolio.yes')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
