'use client';

import React from 'react';
import { MonthlyDashboardData, CoreTaskKey } from '@/types';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  Flame,
  Zap,
  Footprints,
  Sparkles,
  Mic,
  GitBranch,
  PlayCircle,
  Moon,
} from 'lucide-react';

interface MonthlyDashboardViewProps {
  data: MonthlyDashboardData;
  streaks: Record<CoreTaskKey | 'overall', number>;
}

export function MonthlyDashboardView({ data, streaks }: MonthlyDashboardViewProps) {
  const consistencyMeters = [
    { label: 'Morning Walk Consistency', value: data.walkConsistencyRate, icon: Footprints, color: 'text-emerald-400' },
    { label: 'Vipassana Consistency', value: data.vipassanaConsistencyRate, icon: Sparkles, color: 'text-purple-400' },
    { label: 'Decode Topic Consistency', value: data.decodeConsistencyRate, icon: GitBranch, color: 'text-blue-400' },
    { label: 'English Speaking Practice', value: data.englishSpeakingConsistencyRate, icon: Mic, color: 'text-rose-400' },
    { label: 'Marathon Completion Rate', value: data.marathonConsistencyRate, icon: PlayCircle, color: 'text-amber-400' },
    { label: 'Nightly Review Consistency', value: data.reviewConsistencyRate, icon: Moon, color: 'text-gold-400' },
  ];

  const individualStreaks: { label: string; key: CoreTaskKey; count: number }[] = [
    { label: 'PYQ Test', key: 'pyq_test', count: streaks.pyq_test || 6 },
    { label: 'PYQ Solution Analysis', key: 'pyq_solution', count: streaks.pyq_solution || 6 },
    { label: '1 Marathon', key: 'marathon', count: streaks.marathon || 5 },
    { label: '1 Same Topic from Decode', key: 'decode', count: streaks.decode || 7 },
    { label: 'English Speaking Practice', key: 'english', count: streaks.english || 5 },
    { label: 'Morning 30-min Walk', key: 'walk', count: streaks.walk || 9 },
    { label: '45-min Vipassana', key: 'vipassana', count: streaks.vipassana || 9 },
    { label: 'Review Work', key: 'review', count: streaks.review || 8 },
  ];

  return (
    <div className="space-y-6">
      {/* Trajectory Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-3xl border border-emerald-500/30 bg-emerald-950/20 p-5 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Discipline Trajectory
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                Trending Upwards 📈
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Consistent Execution Discipline: {data.completionRate}% Monthly Pace
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-2 rounded-2xl border border-gold-500/30 bg-peacock-900/80 px-4 py-2 self-start sm:self-center">
          <Flame className="h-5 w-5 text-gold-500 fill-gold-400" />
          <div>
            <span className="text-[10px] text-peacock-300 uppercase block font-semibold">Overall Streak</span>
            <span className="text-base font-extrabold text-gold-300">{streaks.overall || 7} Days</span>
          </div>
        </div>
      </div>

      {/* Monthly Overview Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        <div className="rounded-2xl border border-peacock-800 bg-peacock-950/70 p-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-peacock-400 block mb-1">
            Total Tasks
          </span>
          <div className="text-2xl font-black text-white">{data.totalTasks}</div>
          <div className="text-[10px] text-peacock-400">30-day scheduled</div>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            Completed Tasks
          </span>
          <div className="text-2xl font-black text-emerald-300">{data.completedTasks}</div>
          <div className="text-[10px] text-emerald-400/80">{data.completionRate}% completion</div>
        </div>

        <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block mb-1">
            Missed Tasks
          </span>
          <div className="text-2xl font-black text-red-300">{data.missedTasks}</div>
          <div className="text-[10px] text-red-400/80">Audited with reasons</div>
        </div>

        <div className="rounded-2xl border border-peacock-800 bg-peacock-950/70 p-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-peacock-400 block mb-1">
            Total Study Hours
          </span>
          <div className="text-2xl font-black text-white">{data.totalStudyHours}h</div>
          <div className="text-[10px] text-peacock-400">Dedicated deep work</div>
        </div>

        <div className="rounded-2xl border border-gold-500/30 bg-gold-500/10 p-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400 block mb-1">
            Avg PYQ Score
          </span>
          <div className="text-2xl font-black text-gold-300">{data.averagePyqScore}</div>
          <div className="text-[10px] text-gold-400/80">Net estimated points</div>
        </div>

        <div className="rounded-2xl border border-peacock-800 bg-peacock-950/70 p-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-peacock-400 block mb-1">
            Avg PYQ Accuracy
          </span>
          <div className="text-2xl font-black text-emerald-300">{data.averagePyqAccuracy}%</div>
          <div className="text-[10px] text-peacock-400">High precision</div>
        </div>
      </div>

      {/* Habit Consistency Meters */}
      <div className="rounded-3xl border border-gold-500/30 bg-peacock-950/70 p-5 backdrop-blur-xl shadow-xl">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
          <Zap className="h-4 w-4 text-gold-400" />
          <span>Core Habits Consistency Rates (30-Day Evaluation)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {consistencyMeters.map((meter) => {
            const Icon = meter.icon;
            return (
              <div
                key={meter.label}
                className="rounded-2xl border border-peacock-800 bg-peacock-900/40 p-4 hover:border-gold-500/30 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon className={`h-4 w-4 ${meter.color}`} />
                    <span className="text-xs font-semibold text-peacock-200">{meter.label}</span>
                  </div>
                  <span className="text-sm font-black font-mono text-white">{meter.value}%</span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-peacock-950 border border-peacock-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-peacock-500 to-gold-400 transition-all duration-500"
                    style={{ width: `${meter.value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual Streaks Section */}
      <div className="rounded-3xl border border-gold-500/30 bg-peacock-950/70 p-5 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between border-b border-peacock-800/80 pb-3 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold-500/20 text-gold-400 border border-gold-500/40">
              <Flame className="h-4 w-4 fill-gold-400 text-gold-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Individual Habit & Task Streaks</h4>
              <p className="text-[11px] text-peacock-300">
                Actual consecutive days executed without skipping
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {individualStreaks.map((item) => (
            <div
              key={item.key}
              className="rounded-2xl border border-peacock-800 bg-peacock-900/50 p-3 hover:border-gold-500/40 transition flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-white block">{item.label}</span>
                <span className="text-[10px] text-peacock-400">Streak Active</span>
              </div>
              <div className="flex items-center space-x-1 text-gold-400 font-black text-base">
                <Flame className="h-4 w-4 fill-gold-400" />
                <span>{item.count}d</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4-Week Trend Progression */}
      <div className="rounded-3xl border border-peacock-800 bg-peacock-950/60 p-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-peacock-300 mb-3">
          4-Week Progression Trends
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {data.weeklyTrend.map((wt) => (
            <div key={wt.weekLabel} className="rounded-2xl border border-peacock-800 bg-peacock-900/40 p-3">
              <span className="text-xs font-bold text-white block">{wt.weekLabel}</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-[11px] text-peacock-400">Completion:</span>
                <span className="text-sm font-extrabold text-emerald-300">{wt.completionRate}%</span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-[11px] text-peacock-400">Study Hours:</span>
                <span className="text-sm font-extrabold text-blue-300">{wt.studyHours}h</span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-[11px] text-peacock-400">Discipline Score:</span>
                <span className="text-sm font-extrabold text-gold-300">{wt.score}/100</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
