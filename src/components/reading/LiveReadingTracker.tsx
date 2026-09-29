'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatTime } from '@/lib/utils';
import {
  BookOpen,
  Play,
  Pause,
  CheckCircle2,
  Watch,
  Flame,
  Plus,
  Minus,
  Sparkles,
  Smartphone,
  Share2,
  RefreshCw,
  Award,
  Zap,
} from 'lucide-react';

export function LiveReadingTracker() {
  const {
    liveSession,
    startLiveReadingSession,
    togglePauseLiveSession,
    incrementLiveMilestone,
    completeLiveSession,
    resetLiveSession,
    setActiveTab,
  } = useApp();

  // Form states for new session
  const [topic, setTopic] = useState('Designing Data-Intensive Applications (Chapter 6: Partitioning)');
  const [targetMins, setTargetMins] = useState(30);
  const [unitLabel, setUnitLabel] = useState('Pages Read');
  const [targetUnits, setTargetUnits] = useState(20);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    startLiveReadingSession(topic.trim(), 'reading', targetMins * 60, unitLabel, targetUnits);
  };

  const isRunning = liveSession && liveSession.status === 'active';
  const isPaused = liveSession && liveSession.status === 'paused';
  const isCompleted = liveSession && liveSession.status === 'completed';

  const progressPercent = liveSession
    ? Math.min(100, Math.round((liveSession.elapsed_seconds / (liveSession.target_seconds || 1)) * 100))
    : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="inline-flex items-center space-x-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-0.5 text-xs font-semibold text-gold-300">
            <Sparkles className="h-3 w-3 text-gold-400" />
            <span>Multi-Device Real-Time Sync</span>
          </div>
          <h2 className="mt-1 text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-gold-400" />
            <span>Live Activity & Reading Companion</span>
          </h2>
          <p className="text-xs text-peacock-300 max-w-xl">
            Start reading a book or topic on your mobile phone and seamlessly track your pace, pages, and heart-rate live on your smartwatch companion!
          </p>
        </div>

        <button
          onClick={() => setActiveTab('companion_watch')}
          className="flex items-center space-x-2 rounded-xl border border-gold-500/50 bg-peacock-900/90 px-4 py-2.5 text-xs font-bold text-gold-300 shadow-gold-sm hover:bg-peacock-800 transition"
        >
          <Watch className="h-4 w-4 text-feather-400" />
          <span>Launch Smartwatch View</span>
        </button>
      </div>

      {/* ACTIVE RUNNING / PAUSED SESSION VIEW */}
      {liveSession && !isCompleted ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Mobile Tracker Display */}
          <div className="lg:col-span-2 rounded-3xl border border-gold-500/40 bg-peacock-gradient p-6 sm:p-8 shadow-peacock-glow backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-peacock-800/80 pb-4">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-3 w-3">
                  <span
                    className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isRunning ? 'animate-ping bg-gold-400' : 'bg-peacock-500'
                    }`}
                  />
                  <span
                    className={`relative inline-flex h-3 w-3 rounded-full ${
                      isRunning ? 'bg-gold-500' : 'bg-peacock-400'
                    }`}
                  />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-gold-300">
                  {isRunning ? 'Live Reading in Progress' : 'Session Paused'}
                </span>
              </div>

              {/* Sync Status Badge */}
              <div className="flex items-center space-x-1.5 rounded-full bg-peacock-900/80 px-3 py-1 text-[11px] font-semibold text-feather-400 border border-feather-500/30">
                <Watch className="h-3.5 w-3.5 text-feather-400" />
                <span>Smartwatch Synced (Real-Time)</span>
              </div>
            </div>

            {/* Topic Title */}
            <div className="mt-5">
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                {liveSession.topic}
              </h3>
              <p className="mt-1 text-xs text-peacock-300">
                Activity type: <span className="font-semibold text-gold-300 capitalize">{liveSession.activity_type}</span>
              </p>
            </div>

            {/* Big Stopwatch & Progress Display */}
            <div className="mt-6 flex flex-col items-center justify-center rounded-2xl bg-peacock-950/80 p-8 border border-peacock-800 shadow-inner">
              <div className="text-5xl sm:text-6xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 tracking-tight">
                {formatTime(liveSession.elapsed_seconds)}
              </div>
              <span className="mt-2 text-xs font-medium text-peacock-400">
                Target: {formatTime(liveSession.target_seconds)} ({progressPercent}% finished)
              </span>

              {/* Linear Progress Bar */}
              <div className="mt-4 h-2.5 w-full max-w-md rounded-full bg-peacock-900 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-feather-400 via-peacock-400 to-gold-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Simulated Heart Rate / Pulse indicator */}
              <div className="mt-4 flex items-center space-x-2 text-xs font-semibold text-peacock-300">
                <span className="flex h-2.5 w-2.5 items-center justify-center">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                </span>
                <span>Watch Sensor: {liveSession.heart_rate_simulated || 72} BPM (Resting / Deep Focus)</span>
              </div>
            </div>

            {/* Milestone / Page Counter Controls */}
            <div className="mt-6 rounded-2xl bg-peacock-900/60 p-4 border border-peacock-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-peacock-300">
                  {liveSession.current_unit_label || 'Pages Read'}
                </span>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <span className="text-2xl font-black text-white">
                    {liveSession.current_units || 0}
                  </span>
                  <span className="text-xs text-peacock-400">
                    / {liveSession.target_units || 20} target
                  </span>
                </div>
              </div>

              {/* Increment / Decrement Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => incrementLiveMilestone(-1)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-peacock-950 text-peacock-300 border border-peacock-700 hover:border-gold-400 hover:text-white"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => incrementLiveMilestone(1)}
                  className="flex h-9 items-center space-x-1.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-4 text-xs font-bold text-peacock-950 shadow-gold-sm hover:from-gold-400"
                >
                  <Plus className="h-4 w-4" />
                  <span>+1 Page Read</span>
                </button>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-peacock-800/80">
              <div className="flex items-center space-x-2">
                <button
                  onClick={togglePauseLiveSession}
                  className={`flex items-center space-x-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                    isRunning
                      ? 'bg-peacock-800 text-gold-300 hover:bg-peacock-700'
                      : 'bg-gold-500 text-peacock-950 hover:bg-gold-400'
                  }`}
                >
                  {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  <span>{isRunning ? 'Pause Session' : 'Resume Session'}</span>
                </button>
                <button
                  onClick={completeLiveSession}
                  className="flex items-center space-x-2 rounded-xl bg-feather-600 hover:bg-feather-500 px-4 py-2.5 text-xs font-bold text-white shadow-md transition"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Complete & Auto-Log</span>
                </button>
              </div>

              <button
                onClick={resetLiveSession}
                className="text-xs text-peacock-400 hover:text-red-400 transition"
              >
                Discard Session
              </button>
            </div>
          </div>

          {/* Right Side: Smartwatch Companion Quick Sync Guide */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-gold-500/30 bg-peacock-950/80 p-6 shadow-lg backdrop-blur-md">
              <div className="flex items-center space-x-3 text-gold-300">
                <Watch className="h-5 w-5 text-feather-400" />
                <h4 className="text-sm font-bold">Smartwatch Sync Info</h4>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-peacock-300">
                This activity is broadcasting over real-time Web sync. Open the dedicated <strong>Smartwatch View</strong> on your wearable or second screen to control reading progress on your wrist!
              </p>

              <div className="mt-4 rounded-xl bg-peacock-900/80 p-3 border border-peacock-800 text-[11px] text-peacock-200 space-y-1.5">
                <div className="flex justify-between">
                  <span>Current Device:</span>
                  <span className="font-semibold text-gold-300">Mobile Tracker</span>
                </div>
                <div className="flex justify-between">
                  <span>Synced Wearable:</span>
                  <span className="font-semibold text-emerald-400">Live & Synced</span>
                </div>
                <div className="flex justify-between">
                  <span>Broadcast Channel:</span>
                  <span className="font-mono text-peacock-400 text-[10px]">morpankh_companion_sync</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('companion_watch')}
                className="mt-4 flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-feather-600 via-peacock-600 to-royal-700 py-2.5 text-xs font-bold text-white shadow-md hover:brightness-110 transition"
              >
                <Smartphone className="h-4 w-4" />
                <span>Open Wrist Companion Screen</span>
              </button>
            </div>

            {/* Habit Auto-Check Badge */}
            <div className="rounded-2xl border border-peacock-800 bg-peacock-950/60 p-4 text-xs text-peacock-300">
              <div className="flex items-center space-x-2 text-gold-400 font-bold">
                <Award className="h-4 w-4 text-gold-500" />
                <span>Streak Reward Active</span>
              </div>
              <p className="mt-1 text-[11px] text-peacock-400">
                Completing this reading activity will automatically check off your reading habit streak and log focus minutes to today's analytics!
              </p>
            </div>
          </div>
        </div>
      ) : isCompleted ? (
        /* Completed Banner */
        <div className="rounded-3xl border border-gold-400 bg-peacock-900/90 p-8 text-center shadow-gold-md backdrop-blur-md">
          <Award className="mx-auto h-12 w-12 text-gold-400 animate-bounce" />
          <h3 className="mt-3 text-xl font-extrabold text-white">
            Reading Session Completed & Synced!
          </h3>
          <p className="mt-1 text-xs text-peacock-200">
            {Math.round(liveSession.elapsed_seconds / 60)} minutes logged to your focus analytics and reading habit streak.
          </p>

          <div className="mt-6 flex justify-center space-x-3">
            <button
              onClick={resetLiveSession}
              className="rounded-xl bg-gold-500 px-5 py-2.5 text-xs font-bold text-peacock-950 shadow-gold-sm hover:bg-gold-400"
            >
              Start Another Reading Sprint
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="rounded-xl border border-peacock-700 bg-peacock-950 px-5 py-2.5 text-xs font-semibold text-peacock-200 hover:bg-peacock-900"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      ) : (
        /* START NEW TOPIC SESSION FORM */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-peacock-800 bg-peacock-950/80 p-6 sm:p-8 shadow-xl backdrop-blur-md">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-gold-400" />
              <span>Launch New Reading / Study Session</span>
            </h3>
            <p className="text-xs text-peacock-300 mt-1">
              Set the topic you are about to read, and your mobile and smartwatch will synchronously track it.
            </p>

            <form onSubmit={handleStart} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-peacock-200">
                  Topic or Book Title *
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Reading: Designing Data-Intensive Applications (Chapter 6)"
                  className="mt-1.5 w-full rounded-xl border border-peacock-700 bg-peacock-900/90 px-3.5 py-2.5 text-xs text-white placeholder-peacock-500 focus:border-gold-400 focus:outline-none"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2">
                {[
                  'Designing Data-Intensive Apps',
                  'The Design of Everyday Things',
                  'Atomic Habits (Identity Loops)',
                  'Quantum Computing Principles',
                  'Endurance Running Physiology',
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setTopic(preset)}
                    className="rounded-lg border border-peacock-800 bg-peacock-900 px-2.5 py-1 text-[11px] text-peacock-300 hover:border-gold-400 hover:text-gold-300 transition"
                  >
                    + {preset}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-peacock-200">
                    Target Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min={5}
                    step={5}
                    value={targetMins}
                    onChange={(e) => setTargetMins(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-xl border border-peacock-700 bg-peacock-900 px-3 py-2 text-xs text-white focus:border-gold-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-peacock-200">
                    Milestone Unit
                  </label>
                  <input
                    type="text"
                    value={unitLabel}
                    onChange={(e) => setUnitLabel(e.target.value)}
                    placeholder="Pages Read"
                    className="mt-1.5 w-full rounded-xl border border-peacock-700 bg-peacock-900 px-3 py-2 text-xs text-white focus:border-gold-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-peacock-200">
                    Target Units (Pages)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={targetUnits}
                    onChange={(e) => setTargetUnits(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-xl border border-peacock-700 bg-peacock-900 px-3 py-2 text-xs text-white focus:border-gold-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-gold-500 via-gold-600 to-gold-700 py-3 text-xs font-extrabold text-peacock-950 shadow-gold-md hover:brightness-110 transition"
                >
                  <Play className="h-4 w-4 fill-peacock-950" />
                  <span>Start Reading Session & Sync to Watch</span>
                </button>
              </div>
            </form>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-peacock-800 bg-peacock-950/70 p-6 backdrop-blur-sm shadow-md">
              <div className="flex items-center space-x-2 text-gold-400 font-bold text-sm">
                <Zap className="h-4 w-4 text-feather-400" />
                <span>How Mobile & Watch Sync Works</span>
              </div>
              <ul className="mt-3 space-y-2 text-xs text-peacock-300">
                <li className="flex items-start space-x-2">
                  <span className="text-gold-400 font-bold">•</span>
                  <span>
                    <strong>1. Start on Mobile:</strong> Enter your book title and launch the session.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-gold-400 font-bold">•</span>
                  <span>
                    <strong>2. Track on Smartwatch:</strong> Open the companion watch mode on your wearable or phone to view live time, tap +1 page read, and pause anytime.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-gold-400 font-bold">•</span>
                  <span>
                    <strong>3. Automatic Habit Logging:</strong> Upon completion, your streak is preserved and minutes are automatically logged to your isolated analytics.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
