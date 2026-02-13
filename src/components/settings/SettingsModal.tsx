'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { updateProfile } from '@/lib/supabase/database';
import { createClient } from '@/lib/supabase/client';
import { SKINS, AVATARS } from '@/config/constants';
import type { Skin, AvatarId } from '@/config/constants';
import { FunAvatar } from './FunAvatars';
import { Spinner } from '@/components/ui/Spinner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'personal' | 'personalization';

export function SettingsModal({ isOpen, onClose }: Props) {
  const { t, locale } = useLanguage();
  const { user, profile, refreshProfile } = useAuth();
  const { skin, avatar, setSkin, setAvatar, persistPreferences } = useTheme();

  const [tab, setTab] = useState<Tab>('personal');

  // Snapshot of original values to revert on Close
  const originalSkinRef = useRef<Skin>(skin);
  const originalAvatarRef = useRef<AvatarId>(avatar);

  // Personal info state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Init form values when modal opens
  useEffect(() => {
    if (isOpen) {
      if (profile) {
        setFirstName(profile.first_name);
        setLastName(profile.last_name);
        setEmail(profile.email);
      }
      originalSkinRef.current = skin;
      originalAvatarRef.current = avatar;
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMsg('');
      setErrorMsg('');
      setTab('personal');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  // ── Handlers for live preview ──────────────────────────
  const handleSkinPreview = (s: Skin) => setSkin(s);
  const handleAvatarPreview = (a: AvatarId) => setAvatar(a);

  // ── Close: revert all previews ─────────────────────────
  const handleClose = () => {
    setSkin(originalSkinRef.current);
    setAvatar(originalAvatarRef.current);
    onClose();
  };

  // ── Save: persist everything ───────────────────────────
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // 1) Update profile (name)
      const nameChanged = firstName !== profile?.first_name || lastName !== profile?.last_name;
      if (nameChanged) {
        await updateProfile(user.id, { first_name: firstName, last_name: lastName });
      }

      // 2) Update email if changed
      if (email !== profile?.email) {
        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({ email });
        if (error) {
          setErrorMsg(error.message);
          setSaving(false);
          return;
        }
      }

      // 3) Change password if fields are filled
      if (newPassword) {
        if (newPassword.length < 6) {
          setErrorMsg(t('auth.weakPassword'));
          setSaving(false);
          return;
        }
        if (newPassword !== confirmPassword) {
          setErrorMsg(t('settings.passwordMismatch'));
          setSaving(false);
          return;
        }
        const supabase = createClient();
        // Verify current password
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email: profile?.email ?? '',
          password: currentPassword,
        });
        if (signInErr) {
          setErrorMsg(t('settings.wrongPassword'));
          setSaving(false);
          return;
        }
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
          setErrorMsg(error.message);
          setSaving(false);
          return;
        }
      }

      // 4) Persist skin + avatar to DB
      await persistPreferences();

      // 5) Refresh profile in context
      if (nameChanged || email !== profile?.email) {
        await refreshProfile();
      }

      // Update originals so Close won't revert after a successful save
      originalSkinRef.current = skin;
      originalAvatarRef.current = avatar;

      setSuccessMsg(t('settings.saved'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setErrorMsg(t('settings.error'));
    }
    setSaving(false);
  };

  const skinLabel = (s: typeof SKINS[number]) => locale === 'cs' ? s.label.cs : s.label.en;
  const avatarLabel = (a: typeof AVATARS[number]) => locale === 'cs' ? a.label.cs : a.label.en;

  const inputCls = 'w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-gray-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('settings.title')}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
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

        {/* Scrollable content */}
        <div className="p-5 overflow-y-auto flex-1">
          {/* Personal Info Tab */}
          {tab === 'personal' && (
            <div className="space-y-6">
              {/* Profile section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  {t('settings.profileSection')}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('auth.firstName')}
                    </label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('auth.lastName')}
                    </label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('auth.email')}
                  </label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
                </div>
              </div>

              {/* Password section */}
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  {t('settings.changePassword')}
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('settings.currentPassword')}
                  </label>
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('settings.newPassword')}
                  </label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('settings.confirmPassword')}
                  </label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputCls} />
                </div>
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
                  {AVATARS.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => handleAvatarPreview(a.id)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                        avatar === a.id
                          ? 'bg-blue-100 dark:bg-blue-900/40 ring-2 ring-blue-500 scale-105'
                          : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <FunAvatar avatarId={a.id} className="w-12 h-12" />
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        {avatarLabel(a)}
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
                      onClick={() => handleSkinPreview(s.key)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
                        skin === s.key
                          ? 'ring-2 ring-blue-500 scale-105'
                          : ''
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

        {/* Footer with messages + buttons */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
          {/* Success / Error messages */}
          {errorMsg && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-2 mb-3">
              <p className="text-sm text-red-700 dark:text-red-300">{errorMsg}</p>
            </div>
          )}
          {successMsg && (
            <div className="rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 p-2 mb-3">
              <p className="text-sm text-green-700 dark:text-green-300">{successMsg}</p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {t('portfolio.close')}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              {saving && <Spinner className="h-4 w-4 text-white" />}
              {t('portfolio.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getSkinPreviewStyle(s: Skin): React.CSSProperties {
  switch (s) {
    case 'light': return { background: '#f9fafb', border: '1px solid #e5e7eb' };
    case 'dark': return { background: '#1f2937', border: '1px solid #374151' };
    case 'ocean': return { background: '#0c4a6e', border: '1px solid #164e63' };
    case 'sunset': return { background: '#fff7ed', border: '1px solid #fed7aa' };
    case 'forest': return { background: '#14532d', border: '1px solid #166534' };
    case 'cyberpunk': return { background: '#2e1065', border: '1px solid #581c87' };
  }
}

function getSkinPreviewTextStyle(s: Skin): React.CSSProperties {
  switch (s) {
    case 'light': return { color: '#374151' };
    case 'dark': return { color: '#e5e7eb' };
    case 'ocean': return { color: '#67e8f9' };
    case 'sunset': return { color: '#ea580c' };
    case 'forest': return { color: '#86efac' };
    case 'cyberpunk': return { color: '#d8b4fe' };
  }
}
