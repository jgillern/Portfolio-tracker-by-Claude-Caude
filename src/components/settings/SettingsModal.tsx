'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { updateProfile } from '@/lib/supabase/database';
import { createClient } from '@/lib/supabase/client';
import { getItem, setItem } from '@/lib/localStorage';
import { STORAGE_KEYS, SKINS, AVATARS } from '@/config/constants';
import type { Skin, AvatarId } from '@/config/constants';
import { FunAvatar, getDefaultAvatarId } from './FunAvatars';
import { Spinner } from '@/components/ui/Spinner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'personal' | 'personalization';

export function SettingsModal({ isOpen, onClose }: Props) {
  const { t, locale } = useLanguage();
  const { user, profile, refreshProfile } = useAuth();
  const { skin, setSkin } = useTheme();

  const [tab, setTab] = useState<Tab>('personal');

  // Personal info state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [personalSaving, setPersonalSaving] = useState(false);
  const [personalSuccess, setPersonalSuccess] = useState('');
  const [personalError, setPersonalError] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Personalization state
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId>(getDefaultAvatarId());
  const [selectedSkin, setSelectedSkin] = useState<Skin>(skin);

  // Init form values from profile
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name);
      setLastName(profile.last_name);
      setEmail(profile.email);
    }
    const savedAvatar = getItem<AvatarId | null>(STORAGE_KEYS.AVATAR, null);
    setSelectedAvatar(savedAvatar ?? getDefaultAvatarId());
    setSelectedSkin(skin);
  }, [profile, skin, isOpen]);

  // Clear messages when switching tabs
  useEffect(() => {
    setPersonalSuccess('');
    setPersonalError('');
    setPasswordSuccess('');
    setPasswordError('');
  }, [tab]);

  if (!isOpen) return null;

  const handleSavePersonal = async () => {
    if (!user) return;
    setPersonalSaving(true);
    setPersonalError('');
    setPersonalSuccess('');

    try {
      // Update profile (name)
      await updateProfile(user.id, { first_name: firstName, last_name: lastName });

      // Update email if changed
      if (email !== profile?.email) {
        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({ email });
        if (error) {
          setPersonalError(error.message);
          setPersonalSaving(false);
          return;
        }
      }

      await refreshProfile();
      setPersonalSuccess(t('settings.saved'));
    } catch {
      setPersonalError(t('settings.error'));
    }
    setPersonalSaving(false);
  };

  const handleChangePassword = async () => {
    setPasswordSaving(true);
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError(t('auth.weakPassword'));
      setPasswordSaving(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t('settings.passwordMismatch'));
      setPasswordSaving(false);
      return;
    }

    try {
      const supabase = createClient();

      // Verify current password by re-authenticating
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: profile?.email ?? '',
        password: currentPassword,
      });
      if (signInErr) {
        setPasswordError(t('settings.wrongPassword'));
        setPasswordSaving(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setPasswordError(error.message);
        setPasswordSaving(false);
        return;
      }

      setPasswordSuccess(t('settings.passwordChanged'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setPasswordError(t('settings.error'));
    }
    setPasswordSaving(false);
  };

  const handleAvatarSelect = (id: AvatarId) => {
    setSelectedAvatar(id);
    setItem(STORAGE_KEYS.AVATAR, id);
  };

  const handleSkinSelect = (s: Skin) => {
    setSelectedSkin(s);
    setSkin(s);
  };

  const skinLabel = (s: typeof SKINS[number]) => {
    return locale === 'cs' ? s.label.cs : s.label.en;
  };

  const avatarLabel = (a: typeof AVATARS[number]) => {
    return locale === 'cs' ? a.label.cs : a.label.en;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-gray-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('settings.title')}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setTab('personal')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              tab === 'personal'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t('settings.personalInfo')}
          </button>
          <button
            onClick={() => setTab('personalization')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              tab === 'personalization'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t('settings.personalization')}
          </button>
        </div>

        <div className="p-5">
          {/* Personal Info Tab */}
          {tab === 'personal' && (
            <div className="space-y-6">
              {/* Name fields */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  {t('settings.profileSection')}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('auth.firstName')}
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                {personalError && (
                  <div className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-2">
                    <p className="text-sm text-red-700 dark:text-red-300">{personalError}</p>
                  </div>
                )}
                {personalSuccess && (
                  <div className="rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 p-2">
                    <p className="text-sm text-green-700 dark:text-green-300">{personalSuccess}</p>
                  </div>
                )}

                <button
                  onClick={handleSavePersonal}
                  disabled={personalSaving}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold py-2 px-4 transition-colors"
                >
                  {personalSaving && <Spinner className="h-4 w-4 text-white" />}
                  {t('portfolio.save')}
                </button>
              </div>

              {/* Password change */}
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  {t('settings.changePassword')}
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('settings.currentPassword')}
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('settings.newPassword')}
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('settings.confirmPassword')}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                {passwordError && (
                  <div className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-2">
                    <p className="text-sm text-red-700 dark:text-red-300">{passwordError}</p>
                  </div>
                )}
                {passwordSuccess && (
                  <div className="rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 p-2">
                    <p className="text-sm text-green-700 dark:text-green-300">{passwordSuccess}</p>
                  </div>
                )}

                <button
                  onClick={handleChangePassword}
                  disabled={passwordSaving || !currentPassword || !newPassword}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold py-2 px-4 transition-colors"
                >
                  {passwordSaving && <Spinner className="h-4 w-4 text-white" />}
                  {t('settings.changePassword')}
                </button>
              </div>
            </div>
          )}

          {/* Personalization Tab */}
          {tab === 'personalization' && (
            <div className="space-y-6">
              {/* Avatar selection */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  {t('settings.avatar')}
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() => handleAvatarSelect(avatar.id)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                        selectedAvatar === avatar.id
                          ? 'bg-blue-100 dark:bg-blue-900/40 ring-2 ring-blue-500 scale-105'
                          : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <FunAvatar avatarId={avatar.id} className="w-12 h-12" />
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        {avatarLabel(avatar)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Skin selection */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  {t('settings.appSkin')}
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {SKINS.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => handleSkinSelect(s.key)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
                        selectedSkin === s.key
                          ? 'ring-2 ring-blue-500 scale-105'
                          : 'hover:scale-102'
                      }`}
                      style={getSkinPreviewStyle(s.key)}
                    >
                      <span className="text-2xl">{s.emoji}</span>
                      <span className="text-xs font-semibold" style={getSkinPreviewTextStyle(s.key)}>
                        {skinLabel(s)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getSkinPreviewStyle(skin: Skin): React.CSSProperties {
  switch (skin) {
    case 'light': return { background: '#f9fafb', border: '1px solid #e5e7eb' };
    case 'dark': return { background: '#1f2937', border: '1px solid #374151' };
    case 'ocean': return { background: '#0c4a6e', border: '1px solid #164e63' };
    case 'sunset': return { background: '#fff7ed', border: '1px solid #fed7aa' };
    case 'forest': return { background: '#14532d', border: '1px solid #166534' };
    case 'cyberpunk': return { background: '#2e1065', border: '1px solid #581c87' };
  }
}

function getSkinPreviewTextStyle(skin: Skin): React.CSSProperties {
  switch (skin) {
    case 'light': return { color: '#374151' };
    case 'dark': return { color: '#e5e7eb' };
    case 'ocean': return { color: '#67e8f9' };
    case 'sunset': return { color: '#ea580c' };
    case 'forest': return { color: '#86efac' };
    case 'cyberpunk': return { color: '#d8b4fe' };
  }
}
