'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { useMarketData } from '@/hooks/useMarketData';
import { useDashboardOrder } from '@/hooks/useDashboardOrder';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { InstrumentsTable } from '@/components/dashboard/InstrumentsTable';
import { AllocationTable } from '@/components/dashboard/AllocationTable';
import { TypeAllocation } from '@/components/dashboard/TypeAllocation';
import { CountryAllocation } from '@/components/dashboard/CountryAllocation';
import { PortfolioMetrics } from '@/components/dashboard/PortfolioMetrics';
import { KeyStats } from '@/components/dashboard/KeyStats';
import { DraggableSection } from '@/components/dashboard/DraggableSection';
import { AddInstrumentModal } from '@/components/portfolio/AddInstrumentModal';
import { EditPortfolioModal } from '@/components/portfolio/EditPortfolioModal';
import { CreatePortfolioModal } from '@/components/portfolio/CreatePortfolioModal';
import { ImportCsvModal } from '@/components/portfolio/ImportCsvModal';
import { RefreshControl } from '@/components/dashboard/RefreshControl';
import { Button } from '@/components/ui/Button';
import { hasCustomWeights } from '@/types/portfolio';

export default function DashboardPage() {
  const { t } = useLanguage();
  const { activePortfolio, deletePortfolio } = usePortfolio();
  const [showAddInstrument, setShowAddInstrument] = useState(false);
  const [showEditPortfolio, setShowEditPortfolio] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCreatePortfolio, setShowCreatePortfolio] = useState(false);
  const [showImportCsv, setShowImportCsv] = useState(false);
  const [chartRefreshSignal, setChartRefreshSignal] = useState(0);

  const { order, draggedId, dragOverId, handleDragStart, handleDragOver, handleDragEnd } =
    useDashboardOrder();

  const symbols = activePortfolio?.instruments.map((i) => i.symbol) ?? [];
  const { quotes, isLoading, refetch, lastUpdated } = useMarketData(symbols);

  const handleRefreshAll = useCallback(() => {
    refetch();
    setChartRefreshSignal((prev) => prev + 1);
  }, [refetch]);

  const sectionComponents: Record<string, React.ReactNode> = useMemo(
    () => ({
      keyStats: <KeyStats />,
      performance: <PerformanceChart refreshSignal={chartRefreshSignal} />,
      instruments: <InstrumentsTable quotes={quotes} isLoading={isLoading} />,
      sectorAllocation: <AllocationTable />,
      typeAllocation: <TypeAllocation />,
      countryAllocation: <CountryAllocation />,
      metrics: <PortfolioMetrics />,
    }),
    [chartRefreshSignal, quotes, isLoading]
  );

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
        <Button className="mt-4" onClick={() => setShowCreatePortfolio(true)}>
          + {t('header.createPortfolio')}
        </Button>
        <CreatePortfolioModal
          isOpen={showCreatePortfolio}
          onClose={() => setShowCreatePortfolio(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {activePortfolio.name}
          </h1>
          {symbols.length > 0 && (
            <RefreshControl lastUpdated={lastUpdated} isLoading={isLoading} onRefresh={handleRefreshAll} />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowAddInstrument(true)}>
            + {t('portfolio.addInstrument')}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowImportCsv(true)}
          >
            {t('portfolio.importCsv')}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowEditPortfolio(true)}
          >
            {t('portfolio.editPortfolio')}
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

      {activePortfolio.instruments.length > 0 &&
        hasCustomWeights(activePortfolio) &&
        (() => {
          const total = activePortfolio.instruments.reduce((s, i) => s + (i.weight ?? 0), 0);
          return total < 99.99 ? (
            <div className="flex items-start gap-3 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-3">
              <svg className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-sm text-amber-800 dark:text-amber-300">
                {t('dashboard.portfolioIncomplete').replace('{total}', total.toFixed(1))}
              </p>
            </div>
          ) : null;
        })()}

      {order.map((sectionId) => (
        <DraggableSection
          key={sectionId}
          id={sectionId}
          isDragged={draggedId === sectionId}
          isDragOver={dragOverId === sectionId}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {sectionComponents[sectionId]}
        </DraggableSection>
      ))}

      <AddInstrumentModal
        isOpen={showAddInstrument}
        onClose={() => setShowAddInstrument(false)}
      />

      <EditPortfolioModal
        isOpen={showEditPortfolio}
        onClose={() => setShowEditPortfolio(false)}
      />

      <ImportCsvModal
        isOpen={showImportCsv}
        onClose={() => setShowImportCsv(false)}
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
