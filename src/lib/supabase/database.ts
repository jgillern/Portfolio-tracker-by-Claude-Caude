import { createClient } from './client';
import type { UserProfile, UserPreferences } from '@/types/auth';
import type { InstrumentType } from '@/types/portfolio';

const supabase = () => createClient();

// ── Profile ──────────────────────────────────────────────

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const { data } = await supabase()
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return data;
}

export async function updateProfile(
  userId: string,
  updates: { first_name?: string; last_name?: string }
): Promise<void> {
  await supabase().from('profiles').update(updates).eq('id', userId);
}

export async function ensureProfile(
  userId: string,
  firstName: string,
  lastName: string,
  email: string
): Promise<void> {
  await supabase()
    .from('profiles')
    .upsert(
      { id: userId, first_name: firstName, last_name: lastName, email },
      { onConflict: 'id' }
    );
}

// ── Preferences ──────────────────────────────────────────

export async function getPreferences(userId: string): Promise<UserPreferences | null> {
  const { data } = await supabase()
    .from('user_preferences')
    .select('*')
    .eq('id', userId)
    .single();
  return data;
}

export async function updatePreferences(
  userId: string,
  updates: Partial<Pick<UserPreferences, 'language' | 'theme' | 'dashboard_order' | 'market_indexes'>>
): Promise<void> {
  await supabase().from('user_preferences').update(updates).eq('id', userId);
}

export async function ensurePreferences(userId: string): Promise<void> {
  await supabase()
    .from('user_preferences')
    .upsert({ id: userId }, { onConflict: 'id' });
}

// ── Portfolios ───────────────────────────────────────────

export interface DbPortfolio {
  id: string;
  user_id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getPortfolios(userId: string): Promise<DbPortfolio[]> {
  console.log('[DB] getPortfolios called for userId:', userId);
  try {
    const { data, error } = await supabase()
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    console.log('[DB] getPortfolios result:', { count: data?.length ?? 0, error: error?.message });
    if (error) {
      console.error('getPortfolios error:', error.message);
    }
    return data ?? [];
  } catch (e) {
    console.error('[DB] getPortfolios exception:', e);
    return [];
  }
}

export async function createPortfolio(
  userId: string,
  name: string,
  isActive: boolean = false
): Promise<DbPortfolio | null> {
  const { data, error } = await supabase()
    .from('portfolios')
    .insert({ user_id: userId, name, is_active: isActive })
    .select()
    .single();
  if (error) {
    console.error('createPortfolio error:', error.message);
  }
  return data;
}

export async function deletePortfolio(portfolioId: string): Promise<void> {
  await supabase().from('portfolios').delete().eq('id', portfolioId);
}

export async function renamePortfolio(portfolioId: string, name: string): Promise<void> {
  await supabase().from('portfolios').update({ name }).eq('id', portfolioId);
}

export async function setActivePortfolio(userId: string, portfolioId: string | null): Promise<void> {
  // Deactivate all
  await supabase()
    .from('portfolios')
    .update({ is_active: false })
    .eq('user_id', userId);
  // Activate selected
  if (portfolioId) {
    await supabase()
      .from('portfolios')
      .update({ is_active: true })
      .eq('id', portfolioId);
  }
}

// ── Instruments ──────────────────────────────────────────

export interface DbInstrument {
  id: string;
  portfolio_id: string;
  symbol: string;
  name: string;
  type: InstrumentType;
  sector: string | null;
  weight: number | null;
  logo_url: string | null;
  added_at: string;
}

export async function getInstruments(portfolioId: string): Promise<DbInstrument[]> {
  const { data } = await supabase()
    .from('instruments')
    .select('*')
    .eq('portfolio_id', portfolioId)
    .order('added_at', { ascending: true });
  return data ?? [];
}

export async function getAllInstruments(portfolioIds: string[]): Promise<DbInstrument[]> {
  if (portfolioIds.length === 0) return [];
  const { data } = await supabase()
    .from('instruments')
    .select('*')
    .in('portfolio_id', portfolioIds)
    .order('added_at', { ascending: true });
  return data ?? [];
}

export async function addInstrument(
  portfolioId: string,
  instrument: {
    symbol: string;
    name: string;
    type: InstrumentType;
    sector?: string;
    weight?: number;
    logoUrl?: string;
  }
): Promise<DbInstrument | null> {
  const { data } = await supabase()
    .from('instruments')
    .insert({
      portfolio_id: portfolioId,
      symbol: instrument.symbol,
      name: instrument.name,
      type: instrument.type,
      sector: instrument.sector ?? null,
      weight: instrument.weight ?? null,
      logo_url: instrument.logoUrl ?? null,
    })
    .select()
    .single();
  return data;
}

export async function removeInstrument(portfolioId: string, symbol: string): Promise<void> {
  await supabase()
    .from('instruments')
    .delete()
    .eq('portfolio_id', portfolioId)
    .eq('symbol', symbol);
}

export async function updateInstrumentWeight(
  portfolioId: string,
  symbol: string,
  weight: number | null
): Promise<void> {
  await supabase()
    .from('instruments')
    .update({ weight })
    .eq('portfolio_id', portfolioId)
    .eq('symbol', symbol);
}
