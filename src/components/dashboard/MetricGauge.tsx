'use client';

import React, { useState } from 'react';

interface MetricGaugeProps {
  name: string;
  value: number | null;
  tooltip: string;
  min: number;
  max: number;
  format?: (v: number) => string;
  invertScale?: boolean;
}

export function MetricGauge({ name, value, tooltip, min, max, format, invertScale }: MetricGaugeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const displayValue = value != null ? (format ? format(value) : value.toFixed(2)) : '—';

  // Clamp position to 0-100%
  let position = 50;
  if (value != null) {
    position = ((value - min) / (max - min)) * 100;
    if (invertScale) position = 100 - position;
    position = Math.max(2, Math.min(98, position));
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{name}</span>
          <button
            className="relative text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            aria-label={`Info: ${name}`}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4m0-4h.01" />
            </svg>
            {showTooltip && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-lg bg-gray-900 dark:bg-gray-700 text-white text-xs p-2.5 shadow-lg z-50 pointer-events-none">
                {tooltip}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
              </div>
            )}
          </button>
        </div>
        <span className={`text-sm font-semibold ${value == null ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
          {displayValue}
        </span>
      </div>

      {/* Gradient bar */}
      <div className="relative h-2.5 rounded-full overflow-hidden">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: invertScale
              ? 'linear-gradient(to right, #22c55e, #eab308, #ef4444)'
              : 'linear-gradient(to right, #ef4444, #eab308, #22c55e)',
          }}
        />
        {/* Marker */}
        {value != null && (
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4.5 w-2.5 rounded-sm bg-white border-2 border-gray-800 dark:border-gray-200 shadow-md transition-all duration-300"
            style={{ left: `${position}%` }}
          />
        )}
      </div>
    </div>
  );
}
