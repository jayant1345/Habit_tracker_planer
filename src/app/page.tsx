'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard';
import { UPSCTrackerDashboard } from '@/components/tracker/UPSCTrackerDashboard';
import { HabitTracker } from '@/components/habits/HabitTracker';
import { TaskManager } from '@/components/tasks/TaskManager';
import { LiveReadingTracker } from '@/components/reading/LiveReadingTracker';
import { SmartwatchCompanion } from '@/components/companion/SmartwatchCompanion';
import { PomodoroTimer } from '@/components/pomodoro/PomodoroTimer';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { PwaInstallPrompt } from '@/components/pwa/PwaInstallPrompt';
import { LoginView } from '@/components/auth/LoginView';
import { FirstLoginPasswordModal } from '@/components/auth/FirstLoginPasswordModal';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, isLoaded, user } = useAuth();
  const { activeTab } = useApp();

  // Loading Splash Screen while checking localStorage session
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-peacock-950 flex flex-col items-center justify-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-peacock-900 border border-gold-500/40 animate-pulse">
          <Sparkles className="h-6 w-6 text-gold-400" />
        </div>
        <p className="text-xs text-peacock-300 font-medium tracking-wide">
          Loading MorPankh Secure Workspace...
        </p>
      </div>
    );
  }

  // If not logged in, display the login portal
  if (!isAuthenticated || !user) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-[#f3efe6] text-stone-900 dark:bg-peacock-950 dark:text-slate-100 flex flex-col selection:bg-gold-500 selection:text-peacock-950 transition-colors duration-300">
      {/* Top Header */}
      <Header />

      <div className="flex w-full flex-1 px-4 sm:px-6 lg:px-8 pt-3 pb-24 md:pb-8">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Dynamic Workspace Area */}
        <main className="flex-1 md:pl-5 min-w-0">
          {activeTab === 'upsc_tracker' && <UPSCTrackerDashboard />}
          {activeTab === 'dashboard' && <AnalyticsDashboard />}
          {activeTab === 'habits' && <HabitTracker />}
          {activeTab === 'tasks' && <TaskManager />}
          {activeTab === 'reading_tracker' && <LiveReadingTracker />}
          {activeTab === 'companion_watch' && <SmartwatchCompanion />}
          {activeTab === 'pomodoro' && <PomodoroTimer />}
          {activeTab === 'settings' && <SettingsModal />}
        </main>
      </div>

      {/* Mandatory First-Login Password Change Modal */}
      <FirstLoginPasswordModal />

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* PWA Mobile Install Banner / Modal */}
      <PwaInstallPrompt />
    </div>
  );
}
