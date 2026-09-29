'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Settings,
  User,
  ShieldCheck,
  KeyRound,
  Database,
  Copy,
  Check,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
} from 'lucide-react';

export function SettingsModal() {
  const { user, updateProfile, changePassword, logout, isSupabaseConfigured } = useAuth();

  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [roleTitle, setRoleTitle] = useState(user?.role_title || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [dailyGoal, setDailyGoal] = useState(user?.daily_goal_minutes || 120);
  const [timezone, setTimezone] = useState(user?.timezone || 'Asia/Kolkata');
  const [isSaved, setIsSaved] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  // Password change states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  if (!user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      display_name: displayName.trim(),
      role_title: roleTitle.trim(),
      bio: bio.trim(),
      daily_goal_minutes: Number(dailyGoal),
      timezone,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    const res = changePassword(oldPassword, newPassword);
    if (!res.success) {
      setPasswordError(res.error || 'Failed to update password.');
    } else {
      setPasswordSuccess('Password successfully changed!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 3500);
    }
  };

  const copySqlSchema = () => {
    const sqlText = `-- Supabase / PostgreSQL Schema with RLS
CREATE TABLE IF NOT EXISTS public.habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    frequency TEXT NOT NULL DEFAULT 'daily',
    color TEXT DEFAULT '#147694',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own habits" ON public.habits
    FOR ALL USING (auth.uid() = user_id);
-- (See supabase_schema.sql for full tables and composite indexes)`;

    navigator.clipboard.writeText(sqlText);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
          <Settings className="h-6 w-6 text-gold-400" />
          <span>Profile, Security & Data Isolation</span>
        </h2>
        <p className="text-xs text-peacock-300">
          Manage your personal goals, account password, and strict multi-tenant sandbox settings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile & Password Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Form */}
          <div className="rounded-3xl border border-peacock-800 bg-peacock-950/80 p-6 sm:p-8 shadow-xl backdrop-blur-md">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <User className="h-4 w-4 text-gold-400" />
              <span>Profile Preferences</span>
            </h3>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-peacock-200">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-peacock-700 bg-peacock-900 px-3.5 py-2 text-xs text-white focus:border-gold-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-peacock-200">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-peacock-700 bg-peacock-900 px-3.5 py-2 text-xs text-white focus:border-gold-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-peacock-200">
                  Personal Bio / Focus Intention
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-peacock-700 bg-peacock-900 px-3.5 py-2 text-xs text-white focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-peacock-200">
                    Daily Productive Target (Minutes)
                  </label>
                  <input
                    type="number"
                    min={30}
                    step={15}
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-peacock-700 bg-peacock-900 px-3.5 py-2 text-xs text-white focus:border-gold-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-peacock-200">
                    Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-peacock-700 bg-peacock-900 px-3.5 py-2 text-xs text-white focus:border-gold-400 focus:outline-none"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="UTC">UTC Universal</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between">
                {isSaved ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                    <Check className="h-4 w-4" />
                    <span>Profile updated successfully!</span>
                  </span>
                ) : (
                  <span />
                )}

                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-5 py-2.5 text-xs font-bold text-peacock-950 shadow-gold-sm hover:from-gold-400"
                >
                  Save Preferences
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="rounded-3xl border border-peacock-800 bg-peacock-950/80 p-6 sm:p-8 shadow-xl backdrop-blur-md">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <KeyRound className="h-4 w-4 text-gold-400" />
              <span>Change Account Password</span>
            </h3>
            <p className="mt-1 text-xs text-peacock-300">
              Update your password to keep your personal habit records private and isolated.
            </p>

            {passwordError && (
              <div className="mt-4 flex items-center space-x-2 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="mt-4 flex items-center space-x-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-peacock-200">
                  Current Password *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="mt-1 w-full rounded-xl border border-peacock-700 bg-peacock-900 px-3.5 py-2 text-xs text-white focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-peacock-200">
                    New Password (Min 6 chars) *
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full rounded-xl border border-peacock-700 bg-peacock-900 pl-3.5 pr-10 py-2 text-xs text-white focus:border-gold-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-peacock-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-peacock-200">
                    Confirm New Password *
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="mt-1 w-full rounded-xl border border-peacock-700 bg-peacock-900 px-3.5 py-2 text-xs text-white focus:border-gold-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="rounded-xl bg-peacock-800 border border-gold-500/40 px-4 py-2 text-xs font-bold text-gold-300 hover:bg-peacock-700 transition shadow-gold-sm"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Account Sandbox & Security Info */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-peacock-800 bg-peacock-950/80 p-6 shadow-xl backdrop-blur-md">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-feather-400" />
              <span>Active Account Sandbox</span>
            </h3>

            <div className="mt-4 rounded-xl bg-peacock-900 p-3 border border-peacock-800 text-[11px] text-peacock-200 space-y-2">
              <div className="flex justify-between">
                <span>Username:</span>
                <span className="font-mono font-bold text-gold-300">@{user.username || user.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Display Name:</span>
                <span className="font-semibold text-white">{user.display_name}</span>
              </div>
              <div className="flex justify-between">
                <span>User ID:</span>
                <span className="font-mono text-[10px] text-peacock-400">{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Isolation Mode:</span>
                <span className="font-bold text-emerald-400">Strict User Isolation</span>
              </div>
            </div>

            <button
              onClick={logout}
              className="mt-4 flex w-full items-center justify-center space-x-2 rounded-xl border border-red-500/40 bg-red-500/10 py-2.5 text-xs font-bold text-red-300 hover:bg-red-500/20 transition"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out / Log Out</span>
            </button>
          </div>

          <div className="rounded-3xl border border-peacock-800 bg-peacock-950/80 p-6 shadow-xl backdrop-blur-md">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Database className="h-4 w-4 text-gold-400" />
              <span>Database Architecture</span>
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-peacock-300">
              Composite indexed schema with Row Level Security (RLS) ensuring strict isolation across all habit logs, tasks, and sync channels.
            </p>

            <button
              onClick={copySqlSchema}
              className="mt-4 flex w-full items-center justify-center space-x-2 rounded-xl border border-peacock-700 bg-peacock-900 py-2.5 text-xs font-semibold text-gold-300 hover:border-gold-400 transition"
            >
              {copiedSchema ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span>{copiedSchema ? 'SQL Schema Copied!' : 'Copy PostgreSQL RLS Schema'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
