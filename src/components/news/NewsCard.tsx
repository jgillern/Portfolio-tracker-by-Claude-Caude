'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { NewsArticle } from '@/types/market';
import { formatDate } from '@/lib/utils';

function getPublisherDomain(publisher: string, articleUrl: string): string | null {
  // Try to extract domain from article URL first
  try {
    const url = new URL(articleUrl);
    return url.hostname.replace(/^www\./, '');
  } catch {
    // Fallback: guess domain from publisher name
    const name = publisher.toLowerCase().replace(/\s+/g, '');
    const knownDomains: Record<string, string> = {
      reuters: 'reuters.com',
      bloomberg: 'bloomberg.com',
      cnbc: 'cnbc.com',
      yahoo: 'yahoo.com',
      marketwatch: 'marketwatch.com',
      wsj: 'wsj.com',
      ft: 'ft.com',
      seekingalpha: 'seekingalpha.com',
      benzinga: 'benzinga.com',
      investopedia: 'investopedia.com',
      barrons: 'barrons.com',
      fool: 'fool.com',
    };
    for (const [key, domain] of Object.entries(knownDomains)) {
      if (name.includes(key)) return domain;
    }
    return null;
  }
}

interface Props {
  article: NewsArticle;
}

export function NewsCard({ article }: Props) {
  const { t, locale } = useLanguage();
  const [imageUrl, setImageUrl] = useState<string | null>(article.thumbnailUrl);
  const [imgError, setImgError] = useState(false);

  // Try OG image scraping when no thumbnail
  useEffect(() => {
    if (article.thumbnailUrl || !article.link) return;

    let cancelled = false;
    fetch(`/api/og-image?url=${encodeURIComponent(article.link)}`)
      .then(res => res.json())
      .then(data => {
        if (!cancelled && data.imageUrl) {
          setImageUrl(data.imageUrl);
        }
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [article.thumbnailUrl, article.link]);

  // Determine what to show as the thumbnail
  const publisherDomain = getPublisherDomain(article.publisher, article.link);
  const clearbitLogoUrl = publisherDomain
    ? `https://logo.clearbit.com/${publisherDomain}?size=96`
    : null;

  const showImage = imageUrl && !imgError;
  const showLogo = !showImage && clearbitLogoUrl;

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:shadow-md transition-shadow group"
    >
      {showImage ? (
        <div className="hidden sm:block flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={imageUrl!}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        </div>
      ) : showLogo ? (
        <div className="hidden sm:flex flex-shrink-0 w-24 h-24 rounded-lg bg-gray-100 dark:bg-gray-700 items-center justify-center">
          <img
            src={clearbitLogoUrl!}
            alt={article.publisher}
            className="w-12 h-12 object-contain"
            loading="lazy"
            onError={(e) => {
              // If logo also fails, replace with SVG icon
              const parent = (e.target as HTMLElement).parentElement;
              if (parent) {
                parent.innerHTML = '<svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>';
              }
            }}
          />
        </div>
      ) : (
        <div className="hidden sm:flex flex-shrink-0 w-24 h-24 rounded-lg bg-gray-100 dark:bg-gray-700 items-center justify-center">
          <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 transition-colors">
          {article.title}
        </h3>
        {article.summary && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
            {article.summary}
          </p>
        )}
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <span>{article.publisher}</span>
          <span>&middot;</span>
          <span>{formatDate(article.publishedAt, locale)}</span>
          {article.relatedSymbols.length > 0 && (
            <>
              <span>&middot;</span>
              <span className="text-blue-500">{article.relatedSymbols.join(', ')}</span>
            </>
          )}
        </div>
        <span className="mt-1 inline-block text-xs text-blue-600 dark:text-blue-400 group-hover:underline">
          {t('news.readMore')} &rarr;
        </span>
      </div>
    </a>
  );
}
