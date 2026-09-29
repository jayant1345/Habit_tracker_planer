'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatTime } from '@/lib/utils';
import {
  Watch,
  Play,
  Pause,
  CheckCircle2,
  BookOpen,
  Heart,
  Plus,
  Minus,
  Sparkles,
  Smartphone,
  Flame,
  RotateCcw,
  Zap,
} from 'lucide-react';

export function SmartwatchCompanion() {
  const {
    liveSession,
    startLiveReadingSession,
    togglePauseLiveSession,
    incrementLiveMilestone,
    completeLiveSession,
    resetLiveSession,
    setActiveTab,
  } = useApp();

  const [watchShape, setWatchShape] = useState<'round' | 'squircle'>('round');

  const isRunning = liveSession && liveSession.status === 'active';
  const progressPercent = liveSession
    ? Math.min(100, Math.round((liveSession.elapsed_seconds / (liveSession.target_seconds || 1)) * 100))
    : 0;

  // Quick preset launch from watch face
  const handleQuickWatchStart = (topicName: string, mins: number) => {
    startLiveReadingSession(topicName, 'reading', mins * 60, 'Pages Read', 20);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="inline-flex items-center space-x-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-0.5 text-xs font-semibold text-gold-300">
            <Watch className="h-3 w-3 text-feather-400" />
            <span>Wearable / Smartwatch Mode</span>
          </div>
          <h2 className="mt-1 text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
            <span>Smartwatch Companion View</span>
          </h2>
          <p className="text-xs text-peacock-300">
            Real-time biometric display synced with mobile reading activities. Wear OS & Apple Watch layout.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Watch Chassis Shape Switcher */}
          <div className="flex rounded-xl border border-peacock-800 bg-peacock-950 p-1 text-xs">
            <button
              onClick={() => setWatchShape('round')}
              className={`rounded-lg px-3 py-1 font-semibold transition ${
                watchShape === 'round' ? 'bg-peacock-800 text-gold-300 shadow-sm' : 'text-peacock-400'
              }`}
            >
              Classic Round
            </button>
            <button
              onClick={() => setWatchShape('squircle')}
              className={`rounded-lg px-3 py-1 font-semibold transition ${
                watchShape === 'squircle' ? 'bg-peacock-800 text-gold-300 shadow-sm' : 'text-peacock-400'
              }`}
            >
              Squircle OLED
            </button>
          </div>

          <button
            onClick={() => setActiveTab('reading_tracker')}
            className="flex items-center space-x-1.5 rounded-xl border border-peacock-700 bg-peacock-900/90 px-3.5 py-2 text-xs font-bold text-peacock-200 hover:text-white"
          >
            <Smartphone className="h-4 w-4 text-gold-400" />
            <span>Mobile View</span>
          </button>
        </div>
      </div>

      {/* Main Smartwatch Showcase */}
      <div className="grid grid-cols-1 items-center justify-center gap-8 lg:grid-cols-2 pt-4">
        {/* PHYSICAL SMARTWATCH SIMULATOR CONTAINER */}
        <div className="flex flex-col items-center justify-center">
          {/* Watch Straps (Top & Bottom) */}
          <div className="h-10 w-28 rounded-t-xl bg-gradient-to-b from-peacock-950 to-peacock-900 border-x border-t border-peacock-700/80 shadow-md" />

          {/* Watch Bezel Outer Casing */}
          <div
            className={`relative flex items-center justify-center bg-gradient-to-br from-[#d4af37] via-[#f4a313] to-[#80500a] p-3 shadow-2xl transition-all duration-300 ${
              watchShape === 'round'
                ? 'h-[360px] w-[360px] sm:h-[400px] sm:w-[400px] rounded-full'
                : 'h-[360px] w-[320px] sm:h-[400px] sm:w-[350px] rounded-[52px]'
            }`}
          >
            {/* Tactical Crown & Side Button */}
            <div className="absolute right-[-14px] top-1/3 h-10 w-3 rounded-r-md bg-gradient-to-r from-gold-600 to-gold-400 border border-gold-800 shadow-sm" />
            <div className="absolute right-[-10px] top-2/3 h-8 w-2 rounded-r-sm bg-gold-700 border border-gold-900" />

            {/* Inner Metallic Bezel Ring */}
            <div
              className={`relative flex h-full w-full flex-col items-center justify-between overflow-hidden bg-black p-6 border-4 border-peacock-950 shadow-inner ${
                watchShape === 'round' ? 'rounded-full' : 'rounded-[42px]'
              }`}
            >
              {/* Mor Pankh Glowing Ring Background */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-peacock-900/40 via-peacock-950 to-black pointer-events-none" />

              {/* Progress Circular Accent Bar */}
              <svg className="absolute inset-0 h-full w-full -rotate-90 pointer-events-none">
                <circle
                  cx="50%"
                  cy="50%"
                  r={watchShape === 'round' ? '46%' : '44%'}
                  className="stroke-peacock-900/60"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r={watchShape === 'round' ? '46%' : '44%'}
                  className="stroke-gold-400 transition-all duration-500"
                  strokeWidth="6"
                  strokeDasharray="1000"
                  strokeDashoffset={1000 - (1000 * progressPercent) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* WATCH DIAL TOP: Heart Rate & Battery */}
              <div className="relative z-10 flex w-full items-center justify-between px-6 pt-2 text-[10px] font-bold text-peacock-300">
                <div className="flex items-center space-x-1 text-red-400">
                  <Heart className="h-3 w-3 fill-red-500 text-red-500 animate-pulse" />
                  <span>{liveSession?.heart_rate_simulated || 72} BPM</span>
                </div>
                <div className="flex items-center space-x-1 text-gold-300">
                  <Sparkles className="h-3 w-3" />
                  <span>98%</span>
                </div>
              </div>

              {/* WATCH DIAL CENTER: Active Session Details */}
              <div className="relative z-10 flex flex-col items-center text-center px-4 my-auto">
                {liveSession ? (
                  <>
                    <div className="flex items-center space-x-1 rounded-full bg-peacock-900/90 px-2.5 py-0.5 text-[9px] font-bold text-feather-400 border border-feather-500/30">
                      <BookOpen className="h-3 w-3" />
                      <span>{liveSession.activity_type.toUpperCase()}</span>
                    </div>

                    <h4 className="mt-1 text-xs font-black text-white line-clamp-1 max-w-[200px]">
                      {liveSession.topic}
                    </h4>

                    {/* Big Digital Stopwatch */}
                    <div className="mt-2 font-mono text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500">
                      {formatTime(liveSession.elapsed_seconds)}
                    </div>

                    {/* Page / Milestone Counter on Wrist */}
                    <div className="mt-2 flex items-center space-x-3">
                      <button
                        onClick={() => incrementLiveMilestone(-1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-peacock-900 text-peacock-200 border border-peacock-700 hover:border-gold-400 text-xs font-bold"
                      >
                        -
                      </button>
                      <div className="text-center">
                        <span className="text-sm font-extrabold text-white">
                          {liveSession.current_units || 0}
                        </span>
                        <span className="text-[9px] text-peacock-400 block -mt-0.5">
                          {liveSession.current_unit_label || 'Pages'}
                        </span>
                      </div>
                      <button
                        onClick={() => incrementLiveMilestone(1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-500 text-peacock-950 font-bold text-xs hover:bg-gold-400 shadow-gold-sm"
                      >
                        +
                      </button>
                    </div>
                  </>
                ) : (
                  /* Idle Watch Face */
                  <div className="space-y-2 py-4">
                    <BookOpen className="mx-auto h-8 w-8 text-gold-400" />
                    <p className="text-xs font-bold text-white">MorPankh Watch</p>
                    <p className="text-[10px] text-peacock-300 max-w-[180px]">
                      Ready for reading sprint. Tap below to quick start on wrist!
                    </p>
                    <button
                      onClick={() =>
                        handleQuickWatchStart('Technical Book Reading: System Design', 25)
                      }
                      className="mt-2 rounded-full bg-gold-500 px-3.5 py-1 text-[10px] font-bold text-peacock-950 shadow-gold-sm hover:bg-gold-400"
                    >
                      Quick 25m Sprint
                    </button>
                  </div>
                )}
              </div>

              {/* WATCH DIAL BOTTOM: Tactile Watch Action Buttons */}
              {liveSession && (
                <div className="relative z-10 flex w-full items-center justify-center space-x-3 pb-3">
                  <button
                    onClick={togglePauseLiveSession}
                    title={isRunning ? 'Pause on watch' : 'Resume on watch'}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                      isRunning
                        ? 'bg-peacock-900 text-gold-400 border-gold-500/40'
                        : 'bg-gold-500 text-peacock-950 border-gold-400'
                    }`}
                  >
                    {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-peacock-950" />}
                  </button>

                  <button
                    onClick={completeLiveSession}
                    title="Finish session and check habit on mobile"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-feather-600 text-white border border-feather-400 hover:bg-feather-500 transition"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Watch Straps Bottom */}
          <div className="h-10 w-28 rounded-b-xl bg-gradient-to-t from-peacock-950 to-peacock-900 border-x border-b border-peacock-700/80 shadow-md" />
        </div>

        {/* Right Info: Live Two-Way Sync Details */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-peacock-800 bg-peacock-950/80 p-6 shadow-xl backdrop-blur-md">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Zap className="h-5 w-5 text-gold-400" />
              <span>Two-Way Real-Time Synchronization</span>
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-peacock-300">
              MorPankh utilizes client-side WebSocket / BroadcastChannel protocol to synchronize mobile, desktop, and watch views instantly without latency or backend friction.
            </p>

            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between rounded-xl bg-peacock-900/70 p-3 border border-peacock-800 text-xs">
                <span className="text-peacock-200">Watch Tap (+1 Page)</span>
                <span className="font-bold text-gold-300">Updates Mobile Instantly</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-peacock-900/70 p-3 border border-peacock-800 text-xs">
                <span className="text-peacock-200">Mobile Pause / Resume</span>
                <span className="font-bold text-feather-400">Wrist Vibrates & Pauses</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-peacock-900/70 p-3 border border-peacock-800 text-xs">
                <span className="text-peacock-200">Auto-Log to Habit Streak</span>
                <span className="font-bold text-gold-400">Triggers Golden Chime</span>
              </div>
            </div>
          </div>

          {/* Quick Launch Shortcuts */}
          <div className="rounded-3xl border border-peacock-800 bg-peacock-950/80 p-6 shadow-xl backdrop-blur-md">
            <h4 className="text-xs font-bold uppercase tracking-wider text-peacock-300">
              Quick Launch from Wrist
            </h4>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickWatchStart('Deep Technical Reading (Architecture)', 30)}
                className="rounded-xl border border-peacock-800 bg-peacock-900/80 p-3 text-left hover:border-gold-400 transition"
              >
                <BookOpen className="h-4 w-4 text-gold-400 mb-1" />
                <p className="text-xs font-bold text-white">30m Tech Reading</p>
                <p className="text-[10px] text-peacock-400">20 Pages target</p>
              </button>

              <button
                onClick={() => handleQuickWatchStart('Deep Coding & Microservices', 45)}
                className="rounded-xl border border-peacock-800 bg-peacock-900/80 p-3 text-left hover:border-gold-400 transition"
              >
                <Zap className="h-4 w-4 text-feather-400 mb-1" />
                <p className="text-xs font-bold text-white">45m Deep Focus</p>
                <p className="text-[10px] text-peacock-400">Sprint mode</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
