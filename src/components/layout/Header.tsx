'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import {
  Sun,
  Moon,
  Users,
  Watch,
  BookOpen,
  Sparkles,
  ChevronDown,
  Check,
  Plus,
  Flame,
  DownloadCloud,
  LogOut,
  Award,
} from 'lucide-react';
import Image from 'next/image';

interface HeaderProps {
  onOpenInstallModal?: () => void;
}

export function Header({ onOpenInstallModal }: HeaderProps) {
  const { user, availableUsers, switchUser, addNewUser, logout } = useAuth();
  const { theme, toggleTheme, liveSession, setActiveTab, analyticsSummary } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Productivity Enthusiast');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;
    addNewUser(newUserName.trim(), newUserEmail.trim() || `${newUserName.toLowerCase().replace(/\s+/g, '')}@morpankh.app`, newUserRole);
    setShowNewUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setShowUserMenu(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gold-500/20 bg-peacock-950/80 backdrop-blur-md transition-colors dark:border-gold-500/20 dark:bg-peacock-950/90 light:bg-white/90 light:border-slate-200">
        <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-peacock-600 via-feather-600 to-royal-800 p-0.5 shadow-gold-sm">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-peacock-950">
                <Sparkles className="h-5 w-5 text-gold-400 animate-pulse-subtle" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-950 dark:from-gold-300 dark:via-gold-400 dark:to-gold-500 bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
                  MorPankh
                </span>
                <span className="rounded-full bg-stone-900 text-amber-300 border border-stone-800 dark:bg-peacock-800 dark:text-peacock-200 dark:border-peacock-600/40 px-2 py-0.5 text-[10px] font-black shadow-sm">
                  Tracker
                </span>
              </div>
              <p className="hidden text-[11px] text-stone-700 dark:text-peacock-300/80 font-semibold sm:block">
                Activity, Habits & Smartwatch Sync
              </p>
            </div>
          </div>

          {/* Active Live Session Floating Chip (if running) */}
          {liveSession && liveSession.status === 'active' && (
            <button
              onClick={() => setActiveTab('reading_tracker')}
              className="hidden md:flex items-center space-x-2 rounded-full border border-amber-400 bg-amber-100 text-stone-950 dark:border-gold-500/40 dark:bg-peacock-900/90 dark:text-gold-300 px-3.5 py-1.5 text-xs shadow-sm hover:brightness-105 transition"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-600"></span>
              </span>
              <BookOpen className="h-3.5 w-3.5 text-amber-800 dark:text-feather-400" />
              <span className="max-w-[180px] truncate font-bold text-stone-950 dark:text-gold-200">
                {liveSession.topic}
              </span>
              <span className="rounded-full bg-amber-200 text-amber-950 font-black px-2 py-0.5 text-[10px] border border-amber-300 dark:bg-gold-500/20 dark:text-gold-300 dark:border-transparent">
                {Math.floor(liveSession.elapsed_seconds / 60)}m active
              </span>
            </button>
          )}

          {/* Right Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick UPSC DI Command Center Button */}
            <button
              onClick={() => setActiveTab('upsc_tracker')}
              title="Open UPSC Drug Inspector Tracker"
              className="flex items-center space-x-1.5 rounded-lg border border-amber-400 bg-amber-100 text-amber-950 hover:bg-amber-200 dark:border-gold-500/40 dark:bg-peacock-900/90 dark:text-gold-300 px-2.5 py-1.5 text-xs font-black transition shadow-sm"
            >
              <Award className="h-4 w-4 text-amber-800 dark:text-gold-400" />
              <span className="hidden sm:inline">UPSC DI Tracker</span>
            </button>

            {/* Quick Watch Mode Button */}
            <button
              onClick={() => setActiveTab('companion_watch')}
              title="Open Smartwatch Companion View"
              className="hidden sm:flex items-center space-x-1 rounded-lg border border-stone-300 bg-stone-100 text-stone-950 hover:bg-stone-200 dark:border-peacock-700/60 dark:bg-peacock-900/60 dark:text-peacock-200 px-2.5 py-1.5 text-xs font-bold transition shadow-sm"
            >
              <Watch className="h-4 w-4 text-stone-800 dark:text-feather-400" />
              <span className="hidden sm:inline">Watch View</span>
            </button>

            {/* Streak Counter Pill */}
            <div
              title="Current Longest Active Streak"
              className="flex items-center space-x-1.5 rounded-full border border-amber-400 bg-amber-100 text-amber-950 dark:border-gold-500/30 dark:bg-gold-500/10 dark:text-gold-400 px-3 py-1 text-xs font-black shadow-sm"
            >
              <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-600 dark:fill-gold-400 dark:text-gold-500 animate-bounce" />
              <span className="font-black text-amber-950 dark:text-gold-400">{analyticsSummary.longestActiveStreak}d</span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-300 bg-stone-100 text-stone-900 hover:bg-stone-200 dark:border-peacock-800 dark:bg-peacock-900/80 dark:text-peacock-300 transition shadow-sm"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-amber-900" />}
            </button>

            {/* Quick Sign Out Button */}
            <button
              onClick={logout}
              title="Sign Out / Return to Login Screen"
              className="flex h-9 items-center space-x-1.5 rounded-lg border border-stone-300 bg-stone-100 text-stone-900 hover:bg-red-50 hover:text-red-950 hover:border-red-300 dark:border-peacock-800 dark:bg-peacock-900/80 dark:text-peacock-300 dark:hover:bg-red-500/20 px-2.5 text-xs font-bold transition shadow-sm"
            >
              <LogOut className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>

            {/* User Switcher & Profile Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 rounded-lg border border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-950 dark:border-peacock-700/60 dark:bg-peacock-900/90 dark:text-white p-1.5 pr-2.5 transition shadow-sm"
                >
                  <div className="relative h-7 w-7 overflow-hidden rounded-full border border-amber-500/60 dark:border-gold-400/60">
                    <img
                      src={user.avatar_url}
                      alt={user.display_name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className="text-xs font-bold text-stone-950 dark:text-peacock-100 max-w-[100px] truncate leading-tight">
                      {user.display_name}
                    </p>
                    <p className="text-[10px] text-amber-900 dark:text-gold-400 font-mono font-bold max-w-[100px] truncate leading-none">
                      @{user.username || user.id}
                    </p>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-stone-700 dark:text-peacock-400" />
                </button>

                {/* User Switch & Security Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-2xl border border-stone-300 dark:border-gold-500/30 bg-stone-50 dark:bg-peacock-950/95 p-2 shadow-2xl backdrop-blur-xl z-50">
                    <div className="border-b border-stone-200 dark:border-peacock-800/80 px-3 py-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-950 dark:text-gold-400">
                          Active User Session
                        </span>
                        <span className="rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30 px-2 py-0.5 text-[9px] font-extrabold">
                          Isolated RLS
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-bold text-stone-950 dark:text-white">{user.display_name}</p>
                      <p className="text-[11px] text-stone-700 dark:text-peacock-400 font-mono font-medium">@{user.username || user.id} • {user.email}</p>
                    </div>

                    <div className="py-1">
                      <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-peacock-400">
                        Switch Isolated Profile
                      </p>
                      <div className="max-h-48 overflow-y-auto space-y-1">
                        {availableUsers.map((u) => {
                          const isSelected = u.id === user.id;
                          return (
                            <button
                              key={u.id}
                              onClick={() => {
                                switchUser(u.id);
                                setShowUserMenu(false);
                              }}
                              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition ${
                                isSelected
                                  ? 'bg-peacock-800/90 text-gold-300 border border-gold-500/40'
                                  : 'text-peacock-200 hover:bg-peacock-900 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center space-x-2.5">
                                <img
                                  src={u.avatar_url}
                                  alt={u.display_name}
                                  className="h-7 w-7 rounded-full border border-peacock-600"
                                />
                                <div>
                                  <p className="font-semibold">{u.display_name}</p>
                                  <p className="text-[10px] text-peacock-400 font-mono">@{u.username || u.id}</p>
                                </div>
                              </div>
                              {isSelected && <Check className="h-4 w-4 text-gold-400" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-2 border-t border-peacock-800/80 pt-2 space-y-1">
                      <button
                        onClick={() => {
                          setActiveTab('settings');
                          setShowUserMenu(false);
                        }}
                        className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-xs font-medium text-peacock-300 hover:bg-peacock-900 hover:text-gold-300 transition"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-gold-400" />
                        <span>Account & Security Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign Out / Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Add New User Modal */}
      {showNewUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gold-500/40 bg-peacock-950 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gold-300 flex items-center space-x-2">
              <Users className="h-5 w-5 text-gold-400" />
              <span>Add Concurrent User Profile</span>
            </h3>
            <p className="mt-1 text-xs text-peacock-300">
              Each user profile gets strict isolated habits, tasks, pomodoro sessions, and watch sync records.
            </p>

            <form onSubmit={handleCreateUser} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-peacock-200">
                  Full Name / Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g., Ananya Roy"
                  className="mt-1 w-full rounded-lg border border-peacock-700 bg-peacock-900/80 px-3 py-2 text-xs text-white placeholder-peacock-500 focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-peacock-200">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="ananya@example.com"
                  className="mt-1 w-full rounded-lg border border-peacock-700 bg-peacock-900/80 px-3 py-2 text-xs text-white placeholder-peacock-500 focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-peacock-200">
                  Role / Focus Area
                </label>
                <input
                  type="text"
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  placeholder="e.g., AI Researcher / Fitness Coach"
                  className="mt-1 w-full rounded-lg border border-peacock-700 bg-peacock-900/80 px-3 py-2 text-xs text-white placeholder-peacock-500 focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div className="mt-5 flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewUserModal(false)}
                  className="rounded-lg border border-peacock-800 px-3 py-2 text-xs font-medium text-peacock-300 hover:bg-peacock-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 px-4 py-2 text-xs font-bold text-peacock-950 shadow-gold-sm hover:from-gold-400 hover:to-gold-500"
                >
                  Create & Switch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
