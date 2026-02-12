'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { useCalendar } from '@/hooks/useCalendar';
import { Spinner } from '@/components/ui/Spinner';
import { CalendarEventType } from '@/types/market';
import { cn, formatDate } from '@/lib/utils';

const EVENT_TYPE_STYLES: Record<CalendarEventType, { bg: string; text: string; icon: string }> = {
  earnings: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  },
  dividend: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  split: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-300',
    icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
  },
  other: {
    bg: 'bg-gray-100 dark:bg-gray-700',
    text: 'text-gray-700 dark:text-gray-300',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
};

export function CalendarFeed() {
  const { t, locale } = useLanguage();
  const { activePortfolio } = usePortfolio();

  const symbols = activePortfolio?.instruments.map((i) => i.symbol) ?? [];
  const { events, isLoading } = useCalendar(symbols);

  const now = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.date) >= new Date(now.toDateString()));
  const pastEvents = events.filter((e) => new Date(e.date) < new Date(now.toDateString()));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {t('calendar.title')}
      </h1>

      {!activePortfolio || symbols.length === 0 ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center text-gray-500">
          {t('calendar.noEvents')}
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center text-gray-500">
          {t('calendar.noEvents')}
        </div>
      ) : (
        <div className="space-y-6">
          {upcomingEvents.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                {t('calendar.upcoming')}
              </h2>
              <div className="space-y-2">
                {upcomingEvents.map((event, idx) => (
                  <EventCard key={`${event.symbol}-${event.type}-${idx}`} event={event} locale={locale} t={t} />
                ))}
              </div>
            </div>
          )}

          {pastEvents.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                {t('calendar.past')}
              </h2>
              <div className="space-y-2 opacity-60">
                {pastEvents.map((event, idx) => (
                  <EventCard key={`${event.symbol}-${event.type}-${idx}`} event={event} locale={locale} t={t} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EventCard({
  event,
  locale,
  t,
}: {
  event: { symbol: string; name: string; type: CalendarEventType; date: string; title: string; detail?: string };
  locale: string;
  t: (key: string) => string;
}) {
  const styles = EVENT_TYPE_STYLES[event.type];

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className={cn('p-2 rounded-lg shrink-0', styles.bg)}>
        <svg className={cn('h-5 w-5', styles.text)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d={styles.icon} />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-gray-900 dark:text-white">
            {event.title}
          </span>
          <span className={cn('text-xs px-1.5 py-0.5 rounded-full font-medium', styles.bg, styles.text)}>
            {t(`calendar.type.${event.type}`)}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {event.name}
        </p>
        {event.detail && (
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
            {event.detail}
          </p>
        )}
      </div>
      <div className="text-right shrink-0">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {formatDate(event.date, locale)}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {getDaysLabel(event.date, t)}
        </div>
      </div>
    </div>
  );
}

function getDaysLabel(dateStr: string, t: (key: string) => string): string {
  const now = new Date();
  const target = new Date(dateStr);
  const diffMs = target.getTime() - new Date(now.toDateString()).getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return t('calendar.today');
  if (diffDays === 1) return t('calendar.tomorrow');
  if (diffDays > 1) return `${t('calendar.inDays')} ${diffDays} ${t('calendar.days')}`;
  if (diffDays === -1) return t('calendar.yesterday');
  return `${Math.abs(diffDays)} ${t('calendar.daysAgo')}`;
}
