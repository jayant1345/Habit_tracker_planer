'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  KeyRound,
  ShieldAlert,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { DEFAULT_USER_PASSWORD } from '@/lib/storage';

export function FirstLoginPasswordModal() {
  const { user, mustChangePasswordModalOpen, forceSetNewPassword, logout } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!mustChangePasswordModalOpen || !user) {
    return null;
  }

  // Password validation checks
  const isMinLength = newPassword.length >= 6;
  const isNotDefault = newPassword !== DEFAULT_USER_PASSWORD && newPassword.length > 0;
  const isMatching = newPassword === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isMinLength) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (!isNotDefault) {
      setErrorMessage('New password cannot be the default "password123". Please choose a secure custom password.');
      return;
    }
    if (!isMatching) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    setIsSubmitting(true);
    const res = forceSetNewPassword(newPassword);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to update password.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl border border-gold-500/40 bg-peacock-950 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gold-500/20 blur-2xl pointer-events-none" />

        <div className="flex items-center space-x-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/20 border border-gold-500/40 text-gold-400">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-1.5">
              <span>First-Time Login Security</span>
              <Sparkles className="h-4 w-4 text-gold-400" />
            </h3>
            <p className="text-[11px] text-peacock-300">
              Welcome, <span className="font-semibold text-gold-300">{user.display_name}</span>!
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-gold-500/30 bg-gold-500/10 p-3 mb-5 text-xs text-gold-200 flex items-start space-x-2.5">
          <ShieldAlert className="h-4 w-4 text-gold-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            You have logged in with default credentials. For your privacy and strict data isolation, please create your personal password before continuing.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 flex items-center space-x-2 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-peacock-200 mb-1">
              New Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new strong password"
                className="w-full rounded-xl border border-peacock-700 bg-peacock-900/90 pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-peacock-500 focus:border-gold-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-peacock-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-peacock-200 mb-1">
              Confirm New Password *
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full rounded-xl border border-peacock-700 bg-peacock-900/90 px-3.5 py-2.5 text-xs text-white placeholder-peacock-500 focus:border-gold-400 focus:outline-none"
            />
          </div>

          {/* Validation Checklist */}
          <div className="rounded-xl bg-peacock-900/60 border border-peacock-800 p-3 space-y-1.5 text-[11px]">
            <div className={`flex items-center space-x-2 ${isMinLength ? 'text-emerald-400' : 'text-peacock-400'}`}>
              <Check className="h-3.5 w-3.5" />
              <span>At least 6 characters long</span>
            </div>
            <div className={`flex items-center space-x-2 ${isNotDefault ? 'text-emerald-400' : 'text-peacock-400'}`}>
              <Check className="h-3.5 w-3.5" />
              <span>Different from default "password123"</span>
            </div>
            <div className={`flex items-center space-x-2 ${isMatching ? 'text-emerald-400' : 'text-peacock-400'}`}>
              <Check className="h-3.5 w-3.5" />
              <span>Passwords match</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between space-x-2">
            <button
              type="button"
              onClick={logout}
              className="flex items-center space-x-1.5 rounded-xl border border-peacock-800 px-3.5 py-2.5 text-xs font-semibold text-peacock-400 hover:bg-peacock-900 hover:text-white transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log Out</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !isMinLength || !isNotDefault || !isMatching}
              className="flex-1 rounded-xl bg-gradient-to-r from-gold-500 via-gold-600 to-gold-700 py-2.5 text-xs font-bold text-peacock-950 shadow-gold-sm hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <span>{isSubmitting ? 'Saving...' : 'Set Password & Enter Workspace'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
