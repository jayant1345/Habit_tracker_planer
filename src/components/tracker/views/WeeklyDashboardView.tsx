'use client';

import React from 'react';
import { WeeklyDashboardData, CoreTaskKey } from '@/types';
import {
  Flame,
  Award,
  BookOpen,
  Heart,
  Clock,
  Target,
  Trophy,
  AlertTriangle,
  Sparkles,
  Calendar,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';

interface WeeklyDashboardViewProps {
  data: WeeklyDashboardData;
}

const TASK_HEATMAP_LABELS: Record<CoreTaskKey, string> = {
  walk: 'Morning Walk',
  vipassana: 'Vipassana',
  pyq_test: 'PYQ Test',
  pyq_solution: 'PYQ Solution',
  decode: 'Decode Topic',
  marathon: '1 Marathon',
  english: 'English Practice',
  review: 'Review Work',
};

export function WeeklyDashboardView({ data }: WeeklyDashboardViewProps) {
  const getStatusDot = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="h-3 w-3 rounded-full bg-emerald-400 inline-block shadow-sm" title="Completed" />;
      case 'in_progress':
        return <span className="h-3 w-3 rounded-full bg-amber-400 inline-block animate-pulse" title="In Progress" />;
      case 'missed':
        return <span className="h-3 w-3 rounded-full bg-red-400 inline-block" title="Missed" />;
      case 'rescheduled':
        return <span className="h-3 w-3 rounded-full bg-blue-400 inline-block" title="Rescheduled" />;
      default:
        return <span className="h-3 w-3 rounded-full bg-peacock-800 inline-block" title="Not Started" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Highlight Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* Weekly Completion Rate */}
        <div className="rounded-2xl border border-peacock-800 bg-peacock-950/70 p-3.5 backdrop-blur-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-peacock-400 block mb-1">
            Weekly Execution
          </span>
          <div className="text-2xl font-black text-white">{data.weeklyCompletionRate}%</div>
          <div className="mt-1 flex items-center space-x-1 text-[10px] text-emerald-400">
            <span>Overall completion</span>
          </div>
        </div>

        {/* Study Completion */}
        <div className="rounded-2xl border border-peacock-800 bg-peacock-950/70 p-3.5 backdrop-blur-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-peacock-400 block mb-1">
            Study Completion
          </span>
          <div className="text-2xl font-black text-blue-300">{data.studyCompletionRate}%</div>
          <div className="mt-1 text-[10px] text-peacock-400">Core exam tasks</div>
        </div>

        {/* Habit Completion */}
        <div className="rounded-2xl border border-peacock-800 bg-peacock-950/70 p-3.5 backdrop-blur-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-peacock-400 block mb-1">
            Habits & Fitness
          </span>
          <div className="text-2xl font-black text-emerald-300">{data.habitCompletionRate}%</div>
          <div className="mt-1 text-[10px] text-peacock-400">Walk & Vipassana</div>
        </div>

        {/* PYQ Average Score */}
        <div className="rounded-2xl border border-gold-500/30 bg-gold-500/10 p-3.5 backdrop-blur-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400 block mb-1">
            PYQ Avg Score
          </span>
          <div className="text-2xl font-black text-gold-300">{data.pyqAverageScore}</div>
          <div className="mt-1 text-[10px] text-gold-400/80">Avg Accuracy: {data.pyqAverageAccuracy}%</div>
        </div>

        {/* Best Day */}
        <div className="rounded-2xl border border-peacock-800 bg-peacock-950/70 p-3.5 backdrop-blur-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-peacock-400 block mb-1">
            Best Execution Day
          </span>
          <div className="text-lg font-extrabold text-amber-300 flex items-center space-x-1">
            <Trophy className="h-4 w-4 text-amber-400" />
            <span className="truncate">{data.bestExecutionDay}</span>
          </div>
          <div className="mt-1 text-[10px] text-peacock-400">Highest discipline score</div>
        </div>

        {/* Most Missed Task */}
        <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-3.5 backdrop-blur-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-300 block mb-1">
            Most Missed Task
          </span>
          <div className="text-xs font-bold text-red-300 line-clamp-1 flex items-center space-x-1">
            <AlertTriangle className="h-3.5 w-3.5 text-red-400 flex-shrink-0" />
            <span className="truncate">{data.mostMissedTask}</span>
          </div>
          <div className="mt-1 text-[10px] text-red-400/80">Focus area for next week</div>
        </div>
      </div>

      {/* Quantitative Output Totals Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 rounded-3xl border border-gold-500/20 bg-peacock-950/60 p-4 backdrop-blur-md">
        <div className="text-center p-2 rounded-xl bg-peacock-900/40">
          <span className="text-[10px] uppercase font-bold text-peacock-400">Total Study</span>
          <p className="text-lg font-black text-white mt-0.5">{data.totalStudyHours} hrs</p>
        </div>
        <div className="text-center p-2 rounded-xl bg-peacock-900/40">
          <span className="text-[10px] uppercase font-bold text-peacock-400">Walking</span>
          <p className="text-lg font-black text-emerald-300 mt-0.5">{data.totalWalkingMinutes} mins</p>
        </div>
        <div className="text-center p-2 rounded-xl bg-peacock-900/40">
          <span className="text-[10px] uppercase font-bold text-peacock-400">Vipassana</span>
          <p className="text-lg font-black text-purple-300 mt-0.5">{data.totalVipassanaMinutes} mins</p>
        </div>
        <div className="text-center p-2 rounded-xl bg-peacock-900/40">
          <span className="text-[10px] uppercase font-bold text-peacock-400">English Speaking</span>
          <p className="text-lg font-black text-rose-300 mt-0.5">{data.totalEnglishMinutes} mins</p>
        </div>
        <div className="text-center p-2 rounded-xl bg-peacock-900/40">
          <span className="text-[10px] uppercase font-bold text-peacock-400">Marathons Done</span>
          <p className="text-lg font-black text-amber-300 mt-0.5">{data.completedMarathons}</p>
        </div>
        <div className="text-center p-2 rounded-xl bg-peacock-900/40">
          <span className="text-[10px] uppercase font-bold text-peacock-400">Decode Topics</span>
          <p className="text-lg font-black text-blue-300 mt-0.5">{data.completedDecodeTopics}</p>
        </div>
      </div>

      {/* 7-DAY HABIT HEATMAP MATRIX */}
      <div className="rounded-3xl border border-gold-500/30 bg-peacock-950/70 p-5 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-peacock-800/80 pb-3 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-peacock-900 border border-peacock-700">
              <Calendar className="h-4 w-4 text-gold-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">7-Day Habit & Execution Heatmap</h3>
              <p className="text-[11px] text-peacock-300">
                Visual matrix of all 8 core tasks across Monday to Sunday
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-[11px] text-peacock-300">
            <span className="flex items-center space-x-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span>Done</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span>In Progress</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span>Missed</span>
            </span>
          </div>
        </div>

        {/* Heatmap Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-peacock-800 text-peacock-400">
                <th className="py-2.5 px-3 font-semibold">Core Task / Habit</th>
                {data.sevenDayHeatmap.map((day) => (
                  <th key={day.date} className="py-2.5 px-2 text-center font-bold">
                    <span className="block text-white">{day.dayName}</span>
                    <span className="text-[10px] text-gold-400 font-mono">{day.score} pts</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-peacock-800/60">
              {(Object.keys(TASK_HEATMAP_LABELS) as CoreTaskKey[]).map((taskKey) => (
                <tr key={taskKey} className="hover:bg-peacock-900/40 transition">
                  <td className="py-2.5 px-3 font-medium text-peacock-200">
                    {TASK_HEATMAP_LABELS[taskKey]}
                  </td>
                  {data.sevenDayHeatmap.map((day) => {
                    const st = day.tasksStatus[taskKey] || 'not_started';
                    return (
                      <td key={day.date} className="py-2.5 px-2 text-center">
                        <div className="flex items-center justify-center">{getStatusDot(st)}</div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Missed Tasks Breakdown */}
      {data.missedReasonsBreakdown && data.missedReasonsBreakdown.some((r) => r.count > 0) && (
        <div className="rounded-3xl border border-peacock-800 bg-peacock-950/50 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-peacock-300 mb-3">
            Missed Tasks Root-Cause Breakdown
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {data.missedReasonsBreakdown
              .filter((r) => r.count > 0)
              .map((item) => (
                <div key={item.reason} className="rounded-xl bg-peacock-900/60 p-2.5 border border-peacock-800">
                  <span className="text-[10px] text-peacock-400 block">{item.reason}</span>
                  <span className="text-sm font-bold text-red-300">{item.count} times</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
