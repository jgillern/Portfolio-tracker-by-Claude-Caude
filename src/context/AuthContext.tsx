'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getProfile, ensureProfile, ensurePreferences } from '@/lib/supabase/database';
import { migrateLocalStorageToSupabase } from '@/lib/supabase/migration';
import type { User } from '@supabase/supabase-js';
import type { UserProfile, SignUpData, SignInData } from '@/types/auth';

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (data: SignInData) => Promise<{ error: string | null }>;
  signUp: (data: SignUpData) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session from local storage (fast, no API call)
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      console.log('[AuthContext] getSession result:', {
        hasSession: !!session,
        userId: session?.user?.id,
        error
      });

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      // CRITICAL: Set loading to false BEFORE async operations
      // This ensures PortfolioContext can start loading immediately
      setIsLoading(false);

      if (currentUser) {
        const p = await getProfile(currentUser.id);
        setProfile(p);
        // Run migration from localStorage (no-op if already migrated)
        await migrateLocalStorageToSupabase(currentUser.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthContext] onAuthStateChange:', {
        event,
        hasSession: !!session,
        userId: session?.user?.id
      });

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setIsLoading(false);
        return;
      }

      const newUser = session?.user ?? null;
      setUser(newUser);

      // CRITICAL: Set loading to false immediately after setting user
      // This ensures both updates happen in the same render batch
      setIsLoading(false);

      if (newUser && (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED')) {
        const p = await getProfile(newUser.id);
        setProfile(p);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (data: SignInData) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) return { error: error.message };
    return { error: null };
  }, []);

  const signUp = useCallback(async (data: SignUpData) => {
    const supabase = createClient();
    const { data: result, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
        },
      },
    });
    if (error) return { error: error.message };

    // Safety net: ensure profile & preferences exist even if DB trigger didn't fire
    if (result.user) {
      try {
        await ensureProfile(result.user.id, data.firstName, data.lastName, data.email);
        await ensurePreferences(result.user.id);
      } catch {
        // Non-fatal — trigger may have already created them
      }
    }

    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // Clear server-side cookies via API route
    await fetch('/api/auth/signout', { method: 'POST' });
    setUser(null);
    setProfile(null);
    window.location.href = '/login';
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
