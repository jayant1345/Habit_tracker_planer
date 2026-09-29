'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard,
  Award,
  CheckCircle2,
  KanbanSquare,
  BookOpen,
  Watch,
  Timer,
} from 'lucide-react';

export function MobileNav() {
  const { activeTab, setActiveTab, liveSession } = useApp();

  const navItems = [
    {
      id: 'upsc_tracker',
      label: 'UPSC DI',
      icon: Award,
    },
    {
      id: 'dashboard',
      label: 'Home',
      icon: LayoutDashboard,
    },
    {
      id: 'habits',
      label: 'Habits',
      icon: CheckCircle2,
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: KanbanSquare,
    },
    {
      id: 'reading_tracker',
      label: 'Reading',
      icon: BookOpen,
      isLive: liveSession?.status === 'active',
    },
    {
      id: 'companion_watch',
      label: 'Watch',
      icon: Watch,
    },
    {
      id: 'pomodoro',
      label: 'Focus',
      icon: Timer,
    },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-gold-500/20 bg-peacock-950/95 px-2 backdrop-blur-lg md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        const isLive = 'isLive' in item && item.isLive;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`relative flex flex-col items-center justify-center py-1 text-[10px] font-medium transition ${
              isActive ? 'text-gold-400 font-bold' : 'text-peacock-400 hover:text-peacock-200'
            }`}
          >
            <div className="relative">
              <Icon className={`h-5 w-5 ${isActive ? 'text-gold-400' : 'text-peacock-400'}`} />
              {isLive && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-500"></span>
                </span>
              )}
            </div>
            <span className="mt-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
