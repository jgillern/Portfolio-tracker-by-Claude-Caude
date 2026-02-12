'use client';

import React, { useState, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Instrument, hasCustomWeights } from '@/types/portfolio';
import { SearchResult } from '@/types/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface ParsedRow {
  ticker: string;
  weight: number | undefined;
  line: number;
}

interface ImportResult {
  added: string[];
  skipped: { ticker: string; reason: string }[];
}

export function ImportCsvModal({ isOpen, onClose }: Props) {
  const { t } = useLanguage();
  const { activePortfolio, addInstrument } = usePortfolio();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  if (!activePortfolio) return null;

  const existingSymbols = activePortfolio.instruments.map((i) => i.symbol);
  const currentTotal = activePortfolio.instruments.reduce(
    (sum, i) => sum + (i.weight ?? 0),
    0
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setResult(null);
    setParseError(null);
    setParsedRows([]);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (!text.trim()) {
        setParseError(t('import.emptyFile'));
        return;
      }

      const lines = text.trim().split(/\r?\n/);
      const rows: ParsedRow[] = [];
      const errors: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = line.split(';').map((p) => p.trim());
        const ticker = parts[0]?.toUpperCase();

        if (!ticker) {
          errors.push(`${t('import.line')} ${i + 1}: ${t('import.missingTicker')}`);
          continue;
        }

        let weight: number | undefined;
        if (parts[1]) {
          const w = parseFloat(parts[1].replace(',', '.'));
          if (isNaN(w) || w < 0 || w > 100) {
            errors.push(`${t('import.line')} ${i + 1}: ${t('import.invalidWeight')} "${parts[1]}"`);
            continue;
          }
          weight = w;
        }

        rows.push({ ticker, weight, line: i + 1 });
      }

      if (errors.length > 0) {
        setParseError(errors.join('\n'));
      }

      if (rows.length > 0) {
        setParsedRows(rows);
      }
    };
    reader.readAsText(f, 'UTF-8');
  };

  const handleImport = async () => {
    if (parsedRows.length === 0 || !activePortfolio) return;

    setImporting(true);
    setResult(null);

    const added: string[] = [];
    const skipped: { ticker: string; reason: string }[] = [];

    let weightAccum = currentTotal;

    for (const row of parsedRows) {
      // Skip if already in portfolio
      if (existingSymbols.includes(row.ticker) || added.includes(row.ticker)) {
        skipped.push({ ticker: row.ticker, reason: t('import.alreadyExists') });
        continue;
      }

      // Check weight limit
      if (row.weight != null) {
        if (weightAccum + row.weight > 100.01) {
          skipped.push({ ticker: row.ticker, reason: t('import.weightExceeded') });
          continue;
        }
      }

      // Resolve ticker via search API
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(row.ticker)}`);
        if (!res.ok) {
          skipped.push({ ticker: row.ticker, reason: t('import.searchFailed') });
          continue;
        }

        const results: SearchResult[] = await res.json();
        // Find exact match or first result
        const match =
          results.find((r) => r.symbol.toUpperCase() === row.ticker) || results[0];

        if (!match) {
          skipped.push({ ticker: row.ticker, reason: t('import.notFound') });
          continue;
        }

        // Determine weight
        const existingHasWeights = hasCustomWeights(activePortfolio) || added.length > 0;
        const weight =
          row.weight != null && row.weight > 0 ? row.weight : undefined;

        const instrument: Instrument = {
          symbol: match.symbol,
          name: match.name,
          type: match.type,
          sector: match.sector,
          weight: existingHasWeights || weight != null ? weight : undefined,
          addedAt: new Date().toISOString(),
        };

        await addInstrument(activePortfolio.id, instrument);
        added.push(match.symbol);

        if (row.weight != null) {
          weightAccum += row.weight;
        }
      } catch {
        skipped.push({ ticker: row.ticker, reason: t('import.searchFailed') });
      }
    }

    setResult({ added, skipped });
    setImporting(false);
  };

  const handleClose = () => {
    setFile(null);
    setParsedRows([]);
    setParseError(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('portfolio.importCsv')}>
      <div className="space-y-4">
        {/* Instructions */}
        <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3">
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
            {t('import.instructions')}
          </p>
          <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-0.5 list-disc list-inside">
            <li>{t('import.instructionFormat')}</li>
            <li>{t('import.instructionColumns')}</li>
            <li>{t('import.instructionWeight')}</li>
            <li>{t('import.instructionExample')}</li>
          </ul>
          <div className="mt-2 rounded bg-blue-100 dark:bg-blue-900/40 px-2 py-1.5 font-mono text-xs text-blue-800 dark:text-blue-300">
            AAPL;25<br />
            MSFT;25<br />
            BTC-USD;30<br />
            GLD;20
          </div>
        </div>

        {/* File input */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0
              file:text-sm file:font-medium
              file:bg-blue-50 file:text-blue-700
              dark:file:bg-blue-900/30 dark:file:text-blue-300
              file:cursor-pointer hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50
              transition-colors"
          />
        </div>

        {/* Parse error */}
        {parseError && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
            <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">
              {t('import.parseErrors')}
            </p>
            <pre className="text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap">
              {parseError}
            </pre>
          </div>
        )}

        {/* Preview */}
        {parsedRows.length > 0 && !result && (
          <div className="space-y-2">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {t('import.preview').replace('{count}', String(parsedRows.length))}
            </p>
            <div className="max-h-40 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                  <tr>
                    <th className="px-3 py-1.5 text-left text-gray-600 dark:text-gray-400">Ticker</th>
                    <th className="px-3 py-1.5 text-right text-gray-600 dark:text-gray-400">
                      {t('dashboard.weight')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {parsedRows.map((row, i) => (
                    <tr key={i} className="text-gray-800 dark:text-gray-200">
                      <td className="px-3 py-1 font-mono">{row.ticker}</td>
                      <td className="px-3 py-1 text-right">
                        {row.weight != null ? `${row.weight}%` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Button onClick={handleImport} disabled={importing} className="w-full">
              {importing ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner className="h-4 w-4" />
                  {t('import.importing')}
                </span>
              ) : (
                t('import.startImport')
              )}
            </Button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-3">
            {result.added.length > 0 && (
              <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3">
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  {t('import.successCount').replace('{count}', String(result.added.length))}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  {result.added.join(', ')}
                </p>
              </div>
            )}

            {result.skipped.length > 0 && (
              <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3">
                <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">
                  {t('import.skippedCount').replace('{count}', String(result.skipped.length))}
                </p>
                <ul className="text-xs text-amber-600 dark:text-amber-400 space-y-0.5">
                  {result.skipped.map((s, i) => (
                    <li key={i}>
                      <span className="font-mono font-medium">{s.ticker}</span> — {s.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.added.length === 0 && result.skipped.length > 0 && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                <p className="text-sm text-red-700 dark:text-red-300">
                  {t('import.noneImported')}
                </p>
              </div>
            )}

            <Button variant="secondary" onClick={handleClose} className="w-full">
              {t('portfolio.close')}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
