'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { PomodoroType } from '@/types';
import { formatTime } from '@/lib/utils';
import { sounds, triggerMorPankhConfetti } from '@/lib/sound';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Coffee,
  Brain,
  ListTodo,
} from 'lucide-react';

export function PomodoroTimer() {
  const { tasks, logPomodoroSession, pomodoroSessions } = useApp();

  const [mode, setMode] = useState<PomodoroType>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');

  const DURATIONS: Record<PomodoroType, number> = {
    work: 25 * 60,
    short_break: 5 * 60,
    long_break: 15 * 60,
  };

  useEffect(() => {
    setTimeLeft(DURATIONS[mode]);
    setIsActive(false);
  }, [mode]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      const mins = Math.round(DURATIONS[mode] / 60);
      logPomodoroSession(mins, mode, selectedTaskId || undefined);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, selectedTaskId]);

  const toggleTimer = () => {
    setIsActive(!isActive);
    sounds.playTick();
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(DURATIONS[mode]);
    sounds.playTick();
  };

  const progressPercent = Math.round(((DURATIONS[mode] - timeLeft) / DURATIONS[mode]) * 100);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
          <Timer className="h-6 w-6 text-gold-400" />
          <span>Focus & Pomodoro Sprints</span>
        </h2>
        <p className="text-xs text-peacock-300">
          Supercharge your deep work intervals and link logged focus minutes directly to project tasks.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Pomodoro Clock Card */}
        <div className="lg:col-span-2 rounded-3xl border border-gold-500/30 bg-peacock-gradient p-6 sm:p-10 shadow-peacock-glow backdrop-blur-md flex flex-col items-center justify-center text-center">
          {/* Mode Switcher */}
          <div className="flex rounded-2xl border border-peacock-700 bg-peacock-950/80 p-1.5 backdrop-blur-sm">
            <button
              onClick={() => setMode('work')}
              className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                mode === 'work'
                  ? 'bg-gold-500 text-peacock-950 shadow-gold-sm'
                  : 'text-peacock-300 hover:text-white'
              }`}
            >
              <Brain className="h-4 w-4" />
              <span>Deep Work (25m)</span>
            </button>
            <button
              onClick={() => setMode('short_break')}
              className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                mode === 'short_break'
                  ? 'bg-feather-500 text-peacock-950 shadow-md'
                  : 'text-peacock-300 hover:text-white'
              }`}
            >
              <Coffee className="h-4 w-4" />
              <span>Short Break (5m)</span>
            </button>
            <button
              onClick={() => setMode('long_break')}
              className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                mode === 'long_break'
                  ? 'bg-peacock-600 text-white shadow-md'
                  : 'text-peacock-300 hover:text-white'
              }`}
            >
              <Coffee className="h-4 w-4" />
              <span>Long Break (15m)</span>
            </button>
          </div>

          {/* Digital Timer Display */}
          <div className="mt-8 relative flex h-60 w-60 sm:h-72 sm:w-72 items-center justify-center rounded-full border-4 border-peacock-800 bg-peacock-950/90 shadow-2xl">
            {/* SVG Circular Progress Ring */}
            <svg className="absolute inset-0 h-full w-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                className="stroke-peacock-900"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                className="stroke-gold-400 transition-all duration-500"
                strokeWidth="8"
                strokeDasharray="1000"
                strokeDashoffset={1000 - (1000 * progressPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="relative z-10 flex flex-col items-center">
              <span className="font-mono text-5xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500">
                {formatTime(timeLeft)}
              </span>
              <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-peacock-300">
                {isActive ? 'Focus in Progress' : 'Ready to Start'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center space-x-4">
            <button
              onClick={toggleTimer}
              className={`flex h-14 items-center space-x-2 rounded-2xl px-8 text-sm font-extrabold shadow-lg transition-all duration-200 ${
                isActive
                  ? 'bg-peacock-800 text-gold-300 hover:bg-peacock-700 border border-gold-500/30'
                  : 'bg-gradient-to-r from-gold-500 to-gold-600 text-peacock-950 shadow-gold-md hover:from-gold-400 hover:to-gold-500'
              }`}
            >
              {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-peacock-950" />}
              <span>{isActive ? 'Pause Timer' : 'Start Focus Sprint'}</span>
            </button>

            <button
              onClick={resetTimer}
              title="Reset timer"
              className="flex h-14 w-14 items-center justify-center rounded-2xl border border-peacock-700 bg-peacock-900 text-peacock-300 hover:border-gold-400 hover:text-white transition"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>

          {/* Task Linker */}
          <div className="mt-6 w-full max-w-sm">
            <label className="block text-xs font-semibold text-peacock-300 mb-1 text-left flex items-center space-x-1.5">
              <ListTodo className="h-3.5 w-3.5 text-gold-400" />
              <span>Link sprint to active backlog task (optional)</span>
            </label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full rounded-xl border border-peacock-700 bg-peacock-900 px-3 py-2 text-xs text-white focus:border-gold-400 focus:outline-none"
            >
              <option value="">No task linked (General focus)</option>
              {tasks
                .filter((t) => t.status !== 'completed')
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Focus History & Stats */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-peacock-800 bg-peacock-950/80 p-6 shadow-xl backdrop-blur-md">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-gold-400" />
              <span>Today's Logged Sprints</span>
            </h3>

            <div className="mt-4 space-y-2.5">
              {pomodoroSessions.slice(0, 5).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-xl bg-peacock-900/60 p-3 border border-peacock-800 text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2 className="h-4 w-4 text-feather-400" />
                    <div>
                      <p className="font-bold text-white capitalize">{session.session_type} Session</p>
                      <p className="text-[10px] text-peacock-400">
                        {session.notes || `${session.duration_minutes} minutes logged`}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-gold-300">+{session.duration_minutes}m</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
