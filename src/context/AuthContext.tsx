'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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

  // Track whether profile loading is in progress to avoid duplicate loads
  const profileLoadRef = useRef<string | null>(null);

  // Effect 1: Listen for auth state changes.
  // IMPORTANT: The callback must NOT be async for INITIAL_SESSION!
  // INITIAL_SESSION fires INSIDE the Supabase auth lock. If the callback
  // awaits DB queries (which need getSession() → the same lock), it deadlocks.
  // SIGNED_IN/USER_UPDATED fire OUTSIDE the lock, so they could be awaited,
  // but for consistency we handle all profile loading in Effect 2.
  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setIsLoading(false);
        return;
      }

      const newUser = session?.user ?? null;
      setUser(newUser);
      if (!newUser) setIsLoading(false);
      // When newUser exists, isLoading stays true until Effect 2 finishes
    });

    return () => subscription.unsubscribe();
  }, []);

  // Effect 2: Load profile + run migration when user changes.
  // This runs AFTER the auth lock is released, so DB queries work normally.
  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    // Avoid duplicate loads for the same user
    if (profileLoadRef.current === user.id) return;
    profileLoadRef.current = user.id;

    let cancelled = false;

    (async () => {
      try {
        const p = await getProfile(user.id);
        if (cancelled) return;
        setProfile(p);
        await migrateLocalStorageToSupabase(user.id);
      } catch (e) {
        console.error('Failed to load profile:', e);
      }
      if (!cancelled) setIsLoading(false);
    })();

    return () => {
      cancelled = true;
      profileLoadRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

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
