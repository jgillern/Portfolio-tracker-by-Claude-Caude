'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Button } from './Button';

export function LanguageToggle() {
  const { toggleLanguage, t } = useLanguage();
  return (
    <Button variant="ghost" size="sm" onClick={toggleLanguage}>
      {t('header.language')}
    </Button>
  );
}
