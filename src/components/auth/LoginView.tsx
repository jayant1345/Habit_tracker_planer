'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import {
  Sparkles,
  Lock,
  User,
  UserPlus,
  LogIn,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Sun,
  Moon,
  Copy,
  Check,
  Code,
} from 'lucide-react';
import { DEFAULT_USER_PASSWORD } from '@/lib/storage';

export function LoginView() {
  const { login, registerUser, availableUsers } = useAuth();
  const { theme, toggleTheme } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Registration form fields
  const [regUsername, setRegUsername] = useState('');
  const [regDisplayName, setRegDisplayName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState('Productivity Seeker');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!username.trim()) {
      setErrorMessage('Please enter your username');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    const res = login(username.trim(), password, rememberMe);
    if (!res.success) {
      setErrorMessage(res.error || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regUsername.trim()) {
      setErrorMessage('Please choose a username');
      return;
    }
    if (!regDisplayName.trim()) {
      setErrorMessage('Please provide a display name');
      return;
    }

    const res = registerUser(
      regUsername.trim(),
      regDisplayName.trim(),
      regEmail.trim() || undefined,
      regRole.trim() || undefined,
      DEFAULT_USER_PASSWORD
    );

    if (!res.success) {
      setErrorMessage(res.error || 'Registration failed.');
    } else {
      setSuccessMessage('Account created! Please set your new password.');
    }
  };

  // Populate username and password into the form
  const handleFillCredentials = (uName: string, pass: string) => {
    setUsername(uName);
    setPassword(pass);
    setErrorMessage('');
    setCopiedKey(uName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Direct 1-Click Login for any demo profile
  const handleQuickLogin = (uName: string, pass: string) => {
    setUsername(uName);
    setPassword(pass);
    const res = login(uName, pass, rememberMe);
    if (!res.success) {
      setErrorMessage(res.error || 'Failed to sign in');
    }
  };

  // Curated demo profile showcase: Arjun Sharma only
  const demoProfiles = [
    {
      id: 'arjun',
      name: 'Arjun Sharma',
      role: 'Engineering Lead & Architect',
      username: 'arjun',
      password: 'arjun123',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      badgeColor: 'bg-blue-100 text-blue-950 border-blue-400',
      focusTag: 'System Architecture, Focus Coding Sprints, Tech Reading',
      icon: Code,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f3efe6] dark:bg-peacock-950 text-stone-900 dark:text-slate-100 flex flex-col justify-center items-center px-4 py-8 sm:py-12 relative overflow-hidden transition-colors duration-300">
      {/* Background Ambient Orbs (Dark Mode Only) */}
      <div className="hidden dark:block absolute top-1/4 left-1/4 -ml-32 -mt-32 h-96 w-96 rounded-full bg-peacock-600/15 blur-3xl pointer-events-none" />
      <div className="hidden dark:block absolute bottom-1/4 right-1/4 -mr-32 -mb-32 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />

      {/* Floating Theme Switcher */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle Theme"
          className="flex items-center space-x-2 rounded-xl border border-stone-300 bg-stone-100 text-stone-900 hover:bg-stone-200 dark:border-peacock-700 dark:bg-peacock-900/90 dark:text-peacock-200 px-3 py-2 text-xs font-bold transition shadow-sm"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="h-4 w-4 text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 text-amber-900" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-stone-900 dark:from-peacock-600 dark:via-feather-600 dark:to-royal-800 p-0.5 shadow-md mb-2.5">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-stone-900 dark:bg-peacock-950">
              <Sparkles className="h-7 w-7 text-amber-400 animate-pulse-subtle" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-950 dark:bg-gradient-to-r dark:from-gold-300 dark:via-gold-400 dark:to-gold-500 dark:bg-clip-text dark:text-transparent">
            MorPankh Tracker
          </h1>
          <p className="mt-1 text-xs text-stone-700 dark:text-peacock-300 font-semibold">
            Daily Habits, Study Accountability & Smartwatch Sync
          </p>
        </div>

        {/* Auth Card */}
        <div className="rounded-3xl border border-stone-300 dark:border-gold-500/30 bg-[#faf7f0] dark:bg-peacock-950/80 backdrop-blur-xl p-5 sm:p-7 shadow-xl">
          {/* Tabs: Sign In / Create Account */}
          <div className="flex rounded-xl bg-stone-200/80 dark:bg-peacock-900/80 p-1 border border-stone-300 dark:border-peacock-800 mb-5">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage('');
              }}
              className={`flex-1 flex items-center justify-center space-x-1.5 rounded-lg py-2 text-xs font-bold transition ${
                activeTab === 'login'
                  ? 'bg-stone-900 text-amber-300 border border-stone-800 shadow-sm dark:bg-gradient-to-r dark:from-peacock-800 dark:to-peacock-700 dark:text-gold-300 dark:border-gold-500/40'
                  : 'text-stone-700 hover:text-stone-950 dark:text-peacock-400 dark:hover:text-white'
              }`}
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In with Username & Password</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMessage('');
              }}
              className={`flex-1 flex items-center justify-center space-x-1.5 rounded-lg py-2 text-xs font-bold transition ${
                activeTab === 'register'
                  ? 'bg-stone-900 text-amber-300 border border-stone-800 shadow-sm dark:bg-gradient-to-r dark:from-peacock-800 dark:to-peacock-700 dark:text-gold-300 dark:border-gold-500/40'
                  : 'text-stone-700 hover:text-stone-950 dark:text-peacock-400 dark:hover:text-white'
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Create New Account</span>
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="mb-4 flex items-center space-x-2 rounded-xl border border-red-400 bg-red-100 dark:border-red-500/40 dark:bg-red-500/10 p-3 text-xs text-red-950 dark:text-red-300 font-bold">
              <AlertCircle className="h-4 w-4 text-red-700 dark:text-red-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 flex items-center space-x-2 rounded-xl border border-emerald-400 bg-emerald-100 dark:border-emerald-500/40 dark:bg-emerald-500/10 p-3 text-xs text-emerald-950 dark:text-emerald-300 font-bold">
              <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-emerald-400 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {activeTab === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Primary Account Hint Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 p-2.5 text-xs text-stone-900 dark:text-gold-200">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-extrabold text-stone-950 dark:text-gold-300">Sign in as:</span>
                  <span className="rounded-md bg-stone-200 text-stone-950 dark:bg-peacock-800 dark:text-gold-300 border border-stone-300 dark:border-peacock-700 px-2 py-0.5 font-mono font-bold text-[11px]">
                    User: <strong>hitesh</strong>
                  </span>
                  <span className="rounded-md bg-stone-200 text-stone-950 dark:bg-peacock-800 dark:text-gold-300 border border-stone-300 dark:border-peacock-700 px-2 py-0.5 font-mono font-bold text-[11px]">
                    Pass: <strong>hitesh123</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleFillCredentials('hitesh', 'hitesh123')}
                  className="rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-950 dark:text-gold-300 border border-amber-500/40 px-2.5 py-1 text-[11px] font-black transition"
                >
                  Autofill Hitesh
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-900 dark:text-peacock-200 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-600 dark:text-peacock-400" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. hitesh"
                      className="w-full rounded-xl border border-stone-300 bg-white text-stone-950 dark:border-peacock-700 dark:bg-peacock-900/90 dark:text-white pl-10 pr-3.5 py-2.5 text-xs font-medium placeholder-stone-400 focus:border-amber-500 focus:outline-none shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-900 dark:text-peacock-200 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-600 dark:text-peacock-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="e.g. hitesh123"
                      className="w-full rounded-xl border border-stone-300 bg-white text-stone-950 dark:border-peacock-700 dark:bg-peacock-900/90 dark:text-white pl-10 pr-10 py-2.5 text-xs font-medium placeholder-stone-400 focus:border-amber-500 focus:outline-none shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-950 dark:text-peacock-400 dark:hover:text-white"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Options & Sign In Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                <label className="flex items-center space-x-2 text-xs font-semibold text-stone-700 dark:text-peacock-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <span>Remember me on this device</span>
                </label>

                <button
                  type="submit"
                  className="flex items-center justify-center space-x-2 rounded-xl bg-stone-900 text-amber-300 hover:bg-stone-800 dark:bg-gradient-to-r dark:from-gold-500 dark:via-gold-600 dark:to-gold-700 dark:text-peacock-950 px-6 py-2.5 text-xs font-black transition shadow-sm active:scale-[0.99]"
                >
                  <span>Sign In to Workspace</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* SAMPLE DEMO PROFILE (ARJUN SHARMA ONLY) */}
              <div className="mt-6 pt-5 border-t border-stone-300 dark:border-peacock-800/80">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider text-amber-950 dark:text-gold-400">
                    <KeyRound className="h-4 w-4 text-amber-700 dark:text-gold-400" />
                    <span>Demo Account</span>
                  </div>
                  <span className="text-[11px] text-stone-700 dark:text-peacock-400 font-bold">
                    Sample profile for testing:
                  </span>
                </div>

                <div className="max-w-md mx-auto w-full">
                  {demoProfiles.map((p) => {
                    const isFilled = username === p.username && password === p.password;

                    return (
                      <div
                        key={p.id}
                        className={`rounded-2xl border p-4 transition flex flex-col justify-between ${
                          isFilled
                            ? 'border-amber-500 bg-amber-50/80 dark:border-gold-500 dark:bg-peacock-900/90 shadow-md ring-1 ring-amber-500'
                            : 'border-stone-300 bg-stone-200/60 hover:border-stone-400 dark:border-peacock-800 dark:bg-peacock-900/50 dark:hover:border-peacock-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center space-x-3 mb-2.5">
                            <img
                              src={p.avatar}
                              alt={p.name}
                              className="h-10 w-10 rounded-full border border-stone-400 dark:border-peacock-700 object-cover flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-sm text-stone-950 dark:text-white truncate">
                                  {p.name}
                                </span>
                                <span className="rounded-full bg-blue-100 text-blue-950 border border-blue-400 dark:bg-blue-900/60 dark:text-blue-300 px-2 py-0.5 text-[10px] font-bold">
                                  Demo Profile
                                </span>
                              </div>
                              <span className="text-xs text-stone-700 dark:text-peacock-300 block truncate font-semibold">
                                {p.role}
                              </span>
                            </div>
                          </div>

                          {/* Credentials Badges */}
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="rounded-md bg-stone-300 text-stone-950 border border-stone-400 dark:bg-peacock-800 dark:text-peacock-200 dark:border-peacock-700 px-2.5 py-0.5 text-[11px] font-mono font-bold">
                              User: <strong>{p.username}</strong>
                            </span>
                            <span className="rounded-md bg-amber-100 text-amber-950 border border-amber-400 dark:bg-gold-500/20 dark:text-gold-300 dark:border-gold-500/40 px-2.5 py-0.5 text-[11px] font-mono font-black">
                              Pass: <strong>{p.password}</strong>
                            </span>
                          </div>

                          <p className="text-[11px] text-stone-600 dark:text-peacock-400 line-clamp-1 mb-3 font-medium">
                            {p.focusTag}
                          </p>
                        </div>

                        {/* Card Action Buttons */}
                        <div className="flex items-center space-x-2 pt-2 border-t border-stone-300/80 dark:border-peacock-800/60">
                          <button
                            type="button"
                            onClick={() => handleFillCredentials(p.username, p.password)}
                            className="flex-1 flex items-center justify-center space-x-1.5 rounded-xl border border-stone-400 bg-stone-100 hover:bg-stone-300 text-stone-900 dark:border-peacock-700 dark:bg-peacock-800 dark:text-peacock-200 py-2 text-xs font-bold transition"
                            title="Fill credentials into login form"
                          >
                            {copiedKey === p.username ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
                                <span>Filled!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Fill Credentials</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleQuickLogin(p.username, p.password)}
                            className="flex-1 flex items-center justify-center space-x-1.5 rounded-xl bg-stone-900 text-amber-300 hover:bg-stone-800 dark:bg-gold-500 dark:text-stone-950 dark:hover:bg-gold-400 py-2 text-xs font-black transition shadow-sm"
                          >
                            <span>Sign In</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-900 dark:text-peacock-200 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="e.g. kavitasharma"
                  className="w-full rounded-xl border border-stone-300 bg-white text-stone-950 dark:border-peacock-700 dark:bg-peacock-900/90 dark:text-white px-3.5 py-2 text-xs font-medium placeholder-stone-400 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-900 dark:text-peacock-200 mb-1">
                  Full Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={regDisplayName}
                  onChange={(e) => setRegDisplayName(e.target.value)}
                  placeholder="e.g. Kavita Sharma"
                  className="w-full rounded-xl border border-stone-300 bg-white text-stone-950 dark:border-peacock-700 dark:bg-peacock-900/90 dark:text-white px-3.5 py-2 text-xs font-medium placeholder-stone-400 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-900 dark:text-peacock-200 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="kavita@domain.com"
                  className="w-full rounded-xl border border-stone-300 bg-white text-stone-950 dark:border-peacock-700 dark:bg-peacock-900/90 dark:text-white px-3.5 py-2 text-xs font-medium placeholder-stone-400 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-900 dark:text-peacock-200 mb-1">
                  Role / Focus Goal
                </label>
                <input
                  type="text"
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  placeholder="e.g. Medical Student, Product Manager, DI Aspirant"
                  className="w-full rounded-xl border border-stone-300 bg-white text-stone-950 dark:border-peacock-700 dark:bg-peacock-900/90 dark:text-white px-3.5 py-2 text-xs font-medium placeholder-stone-400 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="rounded-xl border border-amber-300 bg-amber-100 dark:border-gold-500/20 dark:bg-peacock-900/60 p-3 text-[11px] text-amber-950 dark:text-peacock-300">
                <p className="flex items-center space-x-1.5 font-bold text-amber-950 dark:text-gold-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-700 dark:text-gold-400" />
                  <span>Default Password Notice</span>
                </p>
                <p className="mt-1 leading-relaxed font-semibold">
                  New accounts are created with default password <code className="text-amber-950 dark:text-gold-300 font-mono font-bold bg-amber-200/80 px-1 py-0.5 rounded">password123</code>. You can change it anytime in Account Settings.
                </p>
              </div>

              <button
                type="submit"
                className="w-full mt-2 flex items-center justify-center space-x-2 rounded-xl bg-stone-900 text-amber-300 hover:bg-stone-800 dark:bg-gradient-to-r dark:from-gold-500 dark:to-gold-600 dark:text-peacock-950 py-2.5 text-xs font-black transition shadow-sm active:scale-[0.99]"
              >
                <span>Create Account & Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>

        {/* Security & Multi-Tenant Notice */}
        <div className="mt-5 text-center text-xs text-stone-700 dark:text-peacock-400 flex items-center justify-center space-x-2 font-medium">
          <ShieldCheck className="h-4 w-4 text-emerald-700 dark:text-feather-400" />
          <span>Strict User Sandbox: Every profile has isolated habits, tasks, daily scores, and smartwatch logs.</span>
        </div>
      </div>
    </div>
  );
}
