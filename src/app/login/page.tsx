'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { Spinner } from '@/components/ui/Spinner';
import { createClient } from '@/lib/supabase/client';
import {
  ElonMusk,
  JeffBezos,
  MichaelSaylor,
  JeromePowell,
  AlesMichl,
  WarrenBuffett,
  SatyaNadella,
  SatoshiNakamoto,
  ChristineLagarde,
  BabisAndTrump,
} from '@/components/login/BusinessmanAvatars';

type Tab = 'login' | 'register';

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (err) {
      setError(t('auth.authError'));
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError(t('auth.weakPassword'));
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (err) {
      if (err.message.includes('already')) {
        setError(t('auth.emailExists'));
      } else if (err.message.includes('Database error')) {
        setError(t('auth.dbError'));
      } else {
        setError(err.message);
      }
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  };

  return (
    <div className="login-bg min-h-screen flex flex-col">
      {/* Top controls – z-20 keeps the language dropdown above the avatar overlay */}
      <div className="relative z-20 flex justify-end items-center gap-2 p-4">
        <LanguageToggle />
      </div>

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-12">
        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="login-float absolute top-[15%] left-[10%] w-20 h-20 rounded-full bg-white/10 blur-xl" />
          <div className="login-float absolute top-[25%] right-[15%] w-32 h-32 rounded-full bg-white/5 blur-2xl" style={{ animationDelay: '2s' }} />
          <div className="login-float absolute bottom-[20%] left-[20%] w-24 h-24 rounded-full bg-white/10 blur-xl" style={{ animationDelay: '4s' }} />
        </div>

        {/* Businessman avatars peeking from sides */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
          {/* Left side - peeking from left */}
          <div className="absolute top-[10%] -left-8 animate-peek-left pointer-events-auto" style={{ animationDelay: '0.5s' }}>
            <ElonMusk className="w-32 h-44 drop-shadow-2xl opacity-90 hover:opacity-100 businessman-avatar businessman-left elon-hover cursor-pointer" />
          </div>
          <div className="absolute top-[35%] -left-12 animate-peek-left pointer-events-auto" style={{ animationDelay: '1.5s' }}>
            <MichaelSaylor className="w-36 h-48 drop-shadow-2xl opacity-90 hover:opacity-100 businessman-avatar businessman-left saylor-hover cursor-pointer" />
          </div>
          <div className="absolute top-[50%] -left-8 animate-peek-left pointer-events-auto" style={{ animationDelay: '2.5s' }}>
            <SatyaNadella className="w-32 h-44 drop-shadow-2xl opacity-90 hover:opacity-100 businessman-avatar businessman-left nadella-hover cursor-pointer" />
          </div>
          <div className="absolute top-[68%] -left-8 animate-peek-left pointer-events-auto" style={{ animationDelay: '3.5s' }}>
            <WarrenBuffett className="w-32 h-44 drop-shadow-2xl opacity-90 hover:opacity-100 businessman-avatar businessman-left buffett-hover cursor-pointer" />
          </div>

          {/* Right side - peeking from right */}
          <div className="absolute top-[15%] -right-8 animate-peek-right pointer-events-auto" style={{ animationDelay: '1s' }}>
            <JeffBezos className="w-32 h-44 drop-shadow-2xl opacity-90 hover:opacity-100 businessman-avatar businessman-right bezos-hover cursor-pointer" />
          </div>
          <div className="absolute top-[42%] -right-12 animate-peek-right pointer-events-auto" style={{ animationDelay: '2s' }}>
            <JeromePowell className="w-32 h-44 drop-shadow-2xl opacity-90 hover:opacity-100 businessman-avatar businessman-right powell-hover cursor-pointer" />
          </div>
          <div className="absolute top-[68%] -right-8 animate-peek-right pointer-events-auto" style={{ animationDelay: '3s' }}>
            <AlesMichl className="w-32 h-44 drop-shadow-2xl opacity-90 hover:opacity-100 businessman-avatar businessman-right michl-hover cursor-pointer" />
          </div>

          {/* Bottom right corner */}
          <div className="absolute bottom-[8%] right-[5%] animate-peek-bottom pointer-events-auto" style={{ animationDelay: '3.5s' }}>
            <ChristineLagarde className="w-30 h-42 drop-shadow-2xl opacity-85 hover:opacity-100 businessman-avatar lagarde-hover cursor-pointer" />
          </div>

          {/* Mysterious Satoshi - top center, floating */}
          <div className="absolute top-[5%] left-1/2 -translate-x-1/2 animate-float-slow pointer-events-auto" style={{ animationDelay: '4.5s' }}>
            <SatoshiNakamoto className="w-28 h-38 drop-shadow-2xl opacity-70 hover:opacity-95 businessman-avatar satoshi-hover cursor-pointer" />
          </div>

          {/* Babiš & Trump scheming together - bottom center */}
          <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 animate-peek-bottom pointer-events-auto" style={{ animationDelay: '5s' }}>
            <BabisAndTrump className="w-72 h-44 drop-shadow-2xl opacity-85 hover:opacity-100 businessman-avatar scheming-hover cursor-pointer" />
          </div>
        </div>

        {/* Title */}
        <div className="login-title text-center mb-8 relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg mb-3">
            {t('auth.appTitle')}
          </h1>
          <p className="text-lg text-white/80 font-medium">
            {t('auth.tagline')}
          </p>
        </div>

        {/* Card */}
        <div className="login-card w-full max-w-md relative z-10">
          <div className="rounded-2xl shadow-2xl bg-white dark:bg-gray-800 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => { setTab('login'); setError(null); }}
                className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                  tab === 'login'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {t('auth.signIn')}
              </button>
              <button
                onClick={() => { setTab('register'); setError(null); }}
                className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                  tab === 'register'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {t('auth.signUp')}
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {/* Tab heading */}
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {tab === 'login' ? t('auth.welcome') : t('auth.createNew')}
              </h2>

              {/* Login form */}
              {tab === 'login' && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('auth.email')}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('auth.emailPlaceholder')}
                      required
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('auth.password')}
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('auth.passwordPlaceholder')}
                      required
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                    />
                  </div>

                  {error && (
                    <div className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-3">
                      <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 px-4 transition-colors"
                  >
                    {loading ? (
                      <>
                        <Spinner className="h-4 w-4 text-white" />
                        {t('auth.signingIn')}
                      </>
                    ) : (
                      t('auth.signIn')
                    )}
                  </button>

                  <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    {t('auth.noAccount')}{' '}
                    <button
                      type="button"
                      onClick={() => { setTab('register'); setError(null); }}
                      className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                    >
                      {t('auth.signUp')}
                    </button>
                  </p>
                </form>
              )}

              {/* Register form */}
              {tab === 'register' && (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('auth.firstName')}
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder={t('auth.firstNamePlaceholder')}
                        required
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('auth.lastName')}
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder={t('auth.lastNamePlaceholder')}
                        required
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('auth.email')}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('auth.emailPlaceholder')}
                      required
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('auth.password')}
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('auth.passwordPlaceholder')}
                      required
                      minLength={6}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                    />
                  </div>

                  {error && (
                    <div className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-3">
                      <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 px-4 transition-colors"
                  >
                    {loading ? (
                      <>
                        <Spinner className="h-4 w-4 text-white" />
                        {t('auth.signingUp')}
                      </>
                    ) : (
                      t('auth.signUp')
                    )}
                  </button>

                  <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    {t('auth.hasAccount')}{' '}
                    <button
                      type="button"
                      onClick={() => { setTab('login'); setError(null); }}
                      className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                    >
                      {t('auth.signIn')}
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
