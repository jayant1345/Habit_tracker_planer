'use client';

import React, { useState } from 'react';
import { TodaySummaryReport, DailyScoreBreakdown } from '@/types';
import {
  Flame,
  Award,
  CheckCircle2,
  BookOpen,
  Heart,
  Clock,
  Target,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';

interface DailyScoreCardProps {
  summary: TodaySummaryReport;
  breakdown: DailyScoreBreakdown;
  onOpenReviewModal?: () => void;
}

export function DailyScoreCard({ summary, breakdown, onOpenReviewModal }: DailyScoreCardProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 70) return 'text-gold-400 border-gold-500/40 bg-gold-500/10';
    if (score >= 50) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-red-400 border-red-500/40 bg-red-500/10';
  };

  return (
    <div className="rounded-3xl border border-gold-500/30 bg-peacock-950/80 p-4 sm:p-5 backdrop-blur-xl shadow-2xl relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-48 w-48 rounded-full bg-peacock-600/15 blur-3xl pointer-events-none" />

      {/* Main Top Header: Daily Score & Core Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-peacock-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-500 via-gold-600 to-amber-700 p-0.5 shadow-gold-sm flex-shrink-0">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-peacock-950">
              <Award className="h-6 w-6 text-gold-400 animate-pulse-subtle" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-peacock-300">
                Today’s Performance
              </span>
              <span className="rounded-full bg-stone-900 text-amber-300 border border-stone-800 dark:bg-peacock-800/90 dark:text-gold-300 dark:border-gold-500/30 px-3 py-0.5 text-[11px] font-black tracking-wide shadow-sm">
                8 Core Tasks
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-950 dark:text-white tracking-tight flex items-baseline space-x-2">
              <span>Daily Score:</span>
              <span className="font-black text-amber-950 dark:bg-gradient-to-r dark:from-gold-300 dark:via-gold-400 dark:to-gold-500 dark:bg-clip-text dark:text-transparent">
                {summary.dailyScore} / 100
              </span>
            </h2>
          </div>
        </div>

        {/* Feedback pill & review action - Bounded to never push button off-screen */}
        <div className="flex items-center justify-between md:justify-end space-x-2 self-stretch md:self-center flex-shrink min-w-0">
          <span className="text-xs text-stone-700 dark:text-peacock-300 italic hidden lg:inline max-w-xs xl:max-w-md truncate text-right font-medium">
            “{breakdown.feedback}”
          </span>
          {onOpenReviewModal && (
            <button
              onClick={onOpenReviewModal}
              className="flex items-center space-x-1.5 rounded-xl border border-amber-500 bg-amber-400 text-stone-950 hover:bg-amber-300 dark:border-gold-500/40 dark:bg-peacock-900/90 dark:text-gold-300 dark:hover:bg-gold-500/10 px-3.5 py-1.5 text-xs font-black transition shadow-sm flex-shrink-0 whitespace-nowrap"
            >
              <Sparkles className="h-3.5 w-3.5 text-stone-950 dark:text-gold-400" />
              <span>Audit Today</span>
            </button>
          )}
        </div>
      </div>

      {/* Required Final Summary Metrics Grid - Responsive Multi-column with zero clipping */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-2.5 sm:gap-3">
        {/* Metric 1: Tasks Completion */}
        <div className="rounded-2xl border border-stone-300 bg-stone-100/90 dark:border-peacock-800/80 dark:bg-peacock-900/50 p-3 hover:border-stone-400 transition shadow-sm">
          <div className="flex items-center justify-between text-stone-800 dark:text-peacock-400 mb-1">
            <span className="text-[10px] uppercase font-black tracking-wider truncate text-stone-800 dark:text-peacock-400">Completion</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          </div>
          <div className="text-lg font-black text-stone-950 dark:text-white">{summary.completionFraction}</div>
          <div className="text-[10px] font-semibold text-stone-700 dark:text-peacock-400 truncate">
            {summary.completedTasks} done • {summary.missedTasks} missed
          </div>
        </div>

        {/* Metric 2: Study Execution */}
        <div className="rounded-2xl border border-stone-300 bg-stone-100/90 dark:border-peacock-800/80 dark:bg-peacock-900/50 p-3 hover:border-blue-400 transition shadow-sm">
          <div className="flex items-center justify-between text-stone-800 dark:text-peacock-400 mb-1">
            <span className="text-[10px] uppercase font-black tracking-wider truncate text-stone-800 dark:text-peacock-400">Study Exec</span>
            <BookOpen className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          </div>
          <div className="text-lg font-black text-blue-950 dark:text-blue-300">{summary.studyExecutionRate}%</div>
          <div className="text-[10px] font-semibold text-stone-700 dark:text-peacock-400 truncate">6 study blocks</div>
        </div>

        {/* Metric 3: Habit Execution */}
        <div className="rounded-2xl border border-stone-300 bg-stone-100/90 dark:border-peacock-800/80 dark:bg-peacock-900/50 p-3 hover:border-rose-400 transition shadow-sm">
          <div className="flex items-center justify-between text-stone-800 dark:text-peacock-400 mb-1">
            <span className="text-[10px] uppercase font-black tracking-wider truncate text-stone-800 dark:text-peacock-400">Habit Exec</span>
            <Heart className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
          </div>
          <div className="text-lg font-black text-rose-950 dark:text-rose-300">{summary.habitExecutionRate}%</div>
          <div className="text-[10px] font-semibold text-stone-700 dark:text-peacock-400 truncate">Walk & Vipassana</div>
        </div>

        {/* Metric 4: Current Streak */}
        <div className="rounded-2xl border border-amber-300 bg-amber-100 dark:border-gold-500/30 dark:bg-gold-500/10 p-3 hover:border-amber-400 dark:hover:border-gold-400 transition shadow-sm">
          <div className="flex items-center justify-between text-amber-950 dark:text-gold-400 mb-1">
            <span className="text-[10px] uppercase font-black tracking-wider truncate text-amber-950 dark:text-gold-400">Current Streak</span>
            <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-600 dark:fill-gold-400 dark:text-gold-500 flex-shrink-0" />
          </div>
          <div className="text-lg font-black text-amber-950 dark:text-gold-300">{summary.currentStreak} days</div>
          <div className="text-[10px] font-bold text-amber-900 dark:text-gold-400/80 truncate">Unbroken momentum</div>
        </div>

        {/* Metric 5: PYQ Accuracy */}
        <div className="rounded-2xl border border-stone-300 bg-stone-100/90 dark:border-peacock-800/80 dark:bg-peacock-900/50 p-3 hover:border-emerald-400 transition shadow-sm">
          <div className="flex items-center justify-between text-stone-800 dark:text-peacock-400 mb-1">
            <span className="text-[10px] uppercase font-black tracking-wider truncate text-stone-800 dark:text-peacock-400">PYQ Accuracy</span>
            <Target className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          </div>
          <div className="text-lg font-black text-emerald-950 dark:text-emerald-300">{summary.pyqAccuracy}%</div>
          <div className="text-[10px] font-semibold text-stone-700 dark:text-peacock-400 truncate">Target: ≥ 80%</div>
        </div>

        {/* Metric 6: Total Study Time */}
        <div className="rounded-2xl border border-stone-300 bg-stone-100/90 dark:border-peacock-800/80 dark:bg-peacock-900/50 p-3 hover:border-teal-400 transition shadow-sm">
          <div className="flex items-center justify-between text-stone-800 dark:text-peacock-400 mb-1">
            <span className="text-[10px] uppercase font-black tracking-wider truncate text-stone-800 dark:text-peacock-400">Study Time</span>
            <Clock className="h-3.5 w-3.5 text-teal-600 dark:text-feather-400 flex-shrink-0" />
          </div>
          <div className="text-lg font-black text-teal-950 dark:text-feather-300">{summary.totalStudyHours} hrs</div>
          <div className="text-[10px] font-semibold text-stone-700 dark:text-peacock-400 truncate">
            {summary.actualStudyMinutes}/{summary.plannedStudyMinutes}m
          </div>
        </div>

        {/* Metric 7: Weekly Pace */}
        <div className="rounded-2xl border border-stone-300 bg-stone-100/90 dark:border-peacock-800/80 dark:bg-peacock-900/50 p-3 hover:border-purple-400 transition shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-stone-800 dark:text-peacock-400 mb-1">
            <span className="text-[10px] uppercase font-black tracking-wider truncate text-stone-800 dark:text-peacock-400">Weekly Pace</span>
            <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
          </div>
          <div className="text-lg font-black text-purple-950 dark:text-purple-300">{summary.weeklyCompletionRate}%</div>
          <div className="text-[10px] font-semibold text-stone-700 dark:text-peacock-400 truncate">7-day avg</div>
        </div>
      </div>

      {/* Expandable Score Breakdown Toggle */}
      <div className="mt-3.5 pt-2.5 border-t border-peacock-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <button
          type="button"
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="flex items-center space-x-1.5 text-[11px] font-semibold text-peacock-400 hover:text-gold-300 transition"
        >
          <span>Score Breakdown Details (Execution &gt; Perfection)</span>
          {showBreakdown ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        <span className="text-[10px] text-peacock-400 font-mono truncate">
          Task: {breakdown.taskCompletionScore}/40 • Study: {breakdown.studyExecutionScore}/25 • Time: {breakdown.timeAdherenceScore}/15
        </span>
      </div>

      {/* Breakdown Details Drawer */}
      {showBreakdown && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2 border-t border-peacock-800/40 text-[11px] animate-in fade-in">
          <div className="rounded-xl bg-peacock-900/60 p-2 border border-peacock-800">
            <span className="text-peacock-400 block text-[9px] uppercase">Task Completion</span>
            <span className="font-bold text-white text-sm">{breakdown.taskCompletionScore} / 40</span>
          </div>
          <div className="rounded-xl bg-peacock-900/60 p-2 border border-peacock-800">
            <span className="text-peacock-400 block text-[9px] uppercase">Study Execution</span>
            <span className="font-bold text-blue-300 text-sm">{breakdown.studyExecutionScore} / 25</span>
          </div>
          <div className="rounded-xl bg-peacock-900/60 p-2 border border-peacock-800">
            <span className="text-peacock-400 block text-[9px] uppercase">Time Adherence</span>
            <span className="font-bold text-purple-300 text-sm">{breakdown.timeAdherenceScore} / 15</span>
          </div>
          <div className="rounded-xl bg-peacock-900/60 p-2 border border-peacock-800">
            <span className="text-peacock-400 block text-[9px] uppercase">PYQ & Analysis</span>
            <span className="font-bold text-emerald-300 text-sm">{breakdown.pyqPerformanceScore} / 10</span>
          </div>
          <div className="rounded-xl bg-peacock-900/60 p-2 border border-peacock-800">
            <span className="text-peacock-400 block text-[9px] uppercase">Personal Fitness</span>
            <span className="font-bold text-rose-300 text-sm">{breakdown.personalDisciplineScore} / 5</span>
          </div>
          <div className="rounded-xl bg-peacock-900/60 p-2 border border-peacock-800">
            <span className="text-peacock-400 block text-[9px] uppercase">Nightly Review</span>
            <span className="font-bold text-gold-300 text-sm">{breakdown.dailyReviewScore} / 5</span>
          </div>
        </div>
      )}
    </div>
  );
}
