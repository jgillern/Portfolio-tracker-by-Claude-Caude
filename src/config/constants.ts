import { TimePeriod } from '@/types/market';

export const TIME_PERIODS: { key: TimePeriod; label: { en: string; cs: string } }[] = [
  { key: '1d', label: { en: '1D', cs: '1D' } },
  { key: '1w', label: { en: '1W', cs: '1T' } },
  { key: '1mo', label: { en: '1M', cs: '1M' } },
  { key: '1y', label: { en: '1Y', cs: '1R' } },
  { key: '5y', label: { en: '5Y', cs: '5L' } },
  { key: 'ytd', label: { en: 'YTD', cs: 'YTD' } },
];

export const STORAGE_KEYS = {
  PORTFOLIO_STATE: 'portfolio-tracker-state',
  LANGUAGE: 'portfolio-tracker-lang',
  THEME: 'portfolio-tracker-theme',
  AVATAR: 'portfolio-tracker-avatar',
} as const;

export type Skin = 'light' | 'dark' | 'ocean' | 'sunset' | 'forest' | 'cyberpunk';

export const SKINS: { key: Skin; isDark: boolean; label: { en: string; cs: string }; emoji: string }[] = [
  { key: 'light', isDark: false, label: { en: 'Light', cs: 'Svetly' }, emoji: '☀️' },
  { key: 'dark', isDark: true, label: { en: 'Dark', cs: 'Tmavy' }, emoji: '🌙' },
  { key: 'ocean', isDark: true, label: { en: 'Ocean', cs: 'Ocean' }, emoji: '🌊' },
  { key: 'sunset', isDark: false, label: { en: 'Sunset', cs: 'Zapad slunce' }, emoji: '🌅' },
  { key: 'forest', isDark: true, label: { en: 'Forest', cs: 'Les' }, emoji: '🌲' },
  { key: 'cyberpunk', isDark: true, label: { en: 'Cyberpunk', cs: 'Cyberpunk' }, emoji: '🔮' },
];

export type AvatarId = 'ninja' | 'astronaut' | 'robot' | 'pirate' | 'wizard' | 'alien' | 'cat' | 'bear';

export const AVATARS: { id: AvatarId; label: { en: string; cs: string } }[] = [
  { id: 'ninja', label: { en: 'Ninja', cs: 'Ninja' } },
  { id: 'astronaut', label: { en: 'Astronaut', cs: 'Astronaut' } },
  { id: 'robot', label: { en: 'Robot', cs: 'Robot' } },
  { id: 'pirate', label: { en: 'Pirate', cs: 'Pirat' } },
  { id: 'wizard', label: { en: 'Wizard', cs: 'Carodeji' } },
  { id: 'alien', label: { en: 'Alien', cs: 'Mimozemstan' } },
  { id: 'cat', label: { en: 'Cool Cat', cs: 'Cool kocka' } },
  { id: 'bear', label: { en: 'Bear', cs: 'Medved' } },
];

export const INSTRUMENT_TYPE_LABELS = {
  en: {
    stock: 'Stock',
    etf: 'ETF',
    crypto: 'Crypto',
    bond: 'Bond',
    commodity: 'Commodity',
  },
  cs: {
    stock: 'Akcie',
    etf: 'ETF',
    crypto: 'Krypto',
    bond: 'Dluhopis',
    commodity: 'Komodita',
  },
} as const;
