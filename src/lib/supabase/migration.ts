import { createClient } from './client';
import { getItem, removeItem } from '@/lib/localStorage';
import { STORAGE_KEYS } from '@/config/constants';
import type { PortfolioState, InstrumentType } from '@/types/portfolio';

const DASHBOARD_ORDER_KEY = 'portfolio-tracker-dashboard-order';

/**
 * Migrate localStorage data to Supabase on first login.
 * Only runs if the user has no portfolios in Supabase yet
 * and has data in localStorage.
 */
export async function migrateLocalStorageToSupabase(userId: string): Promise<void> {
  const supabase = createClient();

  // Check if user already has portfolios in Supabase
  const { data: existing } = await supabase
    .from('portfolios')
    .select('id')
    .eq('user_id', userId)
    .limit(1);

  if (existing && existing.length > 0) {
    // User already has data — clean up localStorage
    cleanupLocalStorage();
    return;
  }

  // Read localStorage data
  const portfolioState = getItem<PortfolioState | null>(STORAGE_KEYS.PORTFOLIO_STATE, null);
  const savedLang = getItem<string | null>(STORAGE_KEYS.LANGUAGE, null);
  const savedTheme = getItem<string | null>(STORAGE_KEYS.THEME, null);
  const savedOrder = getItem<string[] | null>(DASHBOARD_ORDER_KEY, null);

  // Nothing to migrate
  if (!portfolioState && !savedLang && !savedTheme && !savedOrder) return;

  try {
    // Migrate preferences
    const prefUpdates: Record<string, unknown> = {};
    if (savedLang) prefUpdates.language = savedLang;
    if (savedTheme) prefUpdates.theme = savedTheme;
    if (savedOrder) prefUpdates.dashboard_order = savedOrder;

    if (Object.keys(prefUpdates).length > 0) {
      await supabase
        .from('user_preferences')
        .update(prefUpdates)
        .eq('id', userId);
    }

    // Migrate portfolios + instruments
    if (portfolioState?.portfolios?.length) {
      for (const portfolio of portfolioState.portfolios) {
        const { data: newPortfolio } = await supabase
          .from('portfolios')
          .insert({
            user_id: userId,
            name: portfolio.name,
            is_active: portfolio.id === portfolioState.activePortfolioId,
          })
          .select()
          .single();

        if (newPortfolio && portfolio.instruments.length > 0) {
          const instruments = portfolio.instruments.map((inst) => ({
            portfolio_id: newPortfolio.id,
            symbol: inst.symbol,
            name: inst.name,
            type: inst.type as InstrumentType,
            sector: inst.sector ?? null,
            weight: inst.weight ?? null,
            logo_url: inst.logoUrl ?? null,
          }));

          await supabase.from('instruments').insert(instruments);
        }
      }
    }

    // Cleanup after successful migration
    cleanupLocalStorage();
  } catch (error) {
    // Migration failed — leave localStorage intact, will retry next login
    console.error('Migration failed:', error);
  }
}

function cleanupLocalStorage(): void {
  removeItem(STORAGE_KEYS.PORTFOLIO_STATE);
  removeItem(STORAGE_KEYS.LANGUAGE);
  removeItem(STORAGE_KEYS.THEME);
  removeItem(DASHBOARD_ORDER_KEY);
}
