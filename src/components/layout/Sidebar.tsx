'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Award,
  CheckCircle2,
  KanbanSquare,
  BookOpen,
  Watch,
  Timer,
  Settings,
  Flame,
  ShieldCheck,
  LogOut,
} from 'lucide-react';

export function Sidebar() {
  const { activeTab, setActiveTab, liveSession } = useApp();
  const { user, logout } = useAuth();

  const navItems = [
    {
      id: 'upsc_tracker',
      label: 'Daily Accountability (UPSC DI)',
      icon: Award,
      badge: 'Core 8 Tasks',
    },
    {
      id: 'dashboard',
      label: 'Analytics Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'habits',
      label: 'Habits & Streaks',
      icon: CheckCircle2,
      badge: 'Heatmap',
    },
    {
      id: 'tasks',
      label: 'Tasks & Kanban',
      icon: KanbanSquare,
      badge: null,
    },
    {
      id: 'reading_tracker',
      label: 'Reading & Activity Tracker',
      icon: BookOpen,
      badge: liveSession?.status === 'active' ? 'LIVE' : 'Mobile',
    },
    {
      id: 'companion_watch',
      label: 'Smartwatch Companion',
      icon: Watch,
      badge: 'Wearable Sync',
    },
    {
      id: 'pomodoro',
      label: 'Focus & Pomodoro',
      icon: Timer,
      badge: null,
    },
    {
      id: 'settings',
      label: 'Settings & Security',
      icon: Settings,
      badge: null,
    },
  ] as const;

  return (
    <aside className="hidden w-56 lg:w-60 flex-shrink-0 border-r border-gold-500/20 bg-peacock-950/60 p-3 lg:p-3.5 backdrop-blur-md md:flex md:flex-col md:justify-between">
      <div>
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isLive = item.id === 'reading_tracker' && liveSession?.status === 'active';

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                  isActive
                    ? 'bg-stone-900 text-amber-200 border border-amber-500/50 shadow-sm dark:bg-gradient-to-r dark:from-peacock-800 dark:to-peacock-900 dark:text-gold-300 dark:border-gold-500/40 dark:shadow-gold-sm'
                    : 'text-stone-700 hover:bg-stone-200/80 hover:text-stone-950 dark:text-peacock-300 dark:hover:bg-peacock-900/60 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`h-4 w-4 transition ${
                      isActive ? 'text-amber-300 dark:text-gold-400' : 'text-stone-500 group-hover:text-stone-900 dark:text-peacock-400 dark:group-hover:text-gold-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-black tracking-wide ${
                      isLive
                        ? 'bg-emerald-100 text-emerald-950 border border-emerald-400 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40 animate-pulse shadow-sm'
                        : isActive
                        ? 'bg-amber-400 text-stone-950 border border-amber-500 dark:bg-gold-500/20 dark:text-gold-300 dark:border-gold-500/40 shadow-sm'
                        : 'bg-stone-300 text-stone-950 border border-stone-400 dark:bg-peacock-800 dark:text-peacock-200 dark:border-peacock-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Security & Concurrency Guarantee Card */}
        <div className="mt-6 rounded-2xl border border-stone-300 bg-stone-200/70 dark:border-peacock-800/80 dark:bg-gradient-to-br dark:from-peacock-900/80 dark:via-peacock-950 dark:to-feather-950/80 p-3 shadow-sm">
          <div className="flex items-center space-x-2 text-amber-900 dark:text-gold-400">
            <ShieldCheck className="h-4 w-4 text-emerald-700 dark:text-feather-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Strict User Sandbox
            </span>
          </div>
          <p className="mt-1 text-[10px] leading-relaxed text-stone-700 dark:text-peacock-300/90 font-medium">
            Viewing isolated habits & tasks for user <code className="text-amber-900 dark:text-gold-300 font-mono font-bold bg-stone-300/60 dark:bg-transparent px-1 rounded">@{user?.username || user?.id}</code>
          </p>
        </div>
      </div>

      {/* User Info & Quick Logout Bottom Card */}
      {user && (
        <div className="mt-6 border-t border-peacock-800/80 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <img
                src={user.avatar_url}
                alt={user.display_name}
                className="h-8 w-8 rounded-full border border-gold-400/50 flex-shrink-0"
              />
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{user.display_name}</p>
                <p className="text-[10px] text-gold-400 font-mono truncate">@{user.username || user.id}</p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg border border-peacock-800 text-peacock-400 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/40 transition flex-shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
