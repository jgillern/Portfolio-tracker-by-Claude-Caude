'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { useNews } from '@/hooks/useNews';
import { NewsCard } from './NewsCard';
import { Spinner } from '@/components/ui/Spinner';

export function NewsFeed() {
  const { t } = useLanguage();
  const { activePortfolio } = usePortfolio();

  const symbols = activePortfolio?.instruments.map((i) => i.symbol) ?? [];
  const { articles, isLoading } = useNews(symbols);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {t('news.title')}
      </h1>

      {!activePortfolio || symbols.length === 0 ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center text-gray-500">
          {t('news.noNews')}
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center text-gray-500">
          {t('news.noNews')}
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <NewsCard key={article.uuid} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
