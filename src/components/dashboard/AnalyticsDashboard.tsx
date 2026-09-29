'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import {
  CheckCircle2,
  ListTodo,
  Flame,
  Clock,
  TrendingUp,
  PieChart as PieIcon,
  Sparkles,
  BookOpen,
  Watch,
  Plus,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { format } from 'date-fns';

export function AnalyticsDashboard() {
  const { user } = useAuth();
  const {
    analyticsSummary,
    habits,
    tasks,
    liveSession,
    setActiveTab,
    toggleHabitCompletion,
    getHabitStats,
  } = useApp();

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner with Mor Pankh Feather Glow */}
      <div className="relative overflow-hidden rounded-3xl border border-gold-500/30 bg-peacock-gradient p-6 sm:p-8 shadow-peacock-glow">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 h-48 w-48 rounded-full bg-feather-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-xs font-semibold text-gold-300 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-gold-400" />
              <span>Isolated Workspace for {user?.display_name || 'Personal Account'}</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-white">
              Cultivate Focus & Mastery
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-peacock-200 max-w-xl">
              Track daily habits, manage complex project activities, and sync live reading sessions directly with your Smartwatch companion.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('reading_tracker')}
              className="flex items-center space-x-2 rounded-xl border border-gold-400/60 bg-gradient-to-r from-gold-500 via-gold-600 to-gold-700 px-4 py-2.5 text-xs font-bold text-peacock-950 shadow-gold-sm hover:brightness-110 transition"
            >
              <BookOpen className="h-4 w-4" />
              <span>Start Reading Sprint</span>
            </button>
            <button
              onClick={() => setActiveTab('companion_watch')}
              className="flex items-center space-x-2 rounded-xl border border-peacock-600 bg-peacock-900/80 px-4 py-2.5 text-xs font-bold text-peacock-100 hover:border-gold-500/60 hover:text-gold-300 transition"
            >
              <Watch className="h-4 w-4 text-feather-400" />
              <span>Watch Sync Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Habit Completion Rate */}
        <div className="relative overflow-hidden rounded-2xl border border-peacock-800 bg-peacock-950/70 p-5 shadow-lg backdrop-blur-sm hover:border-gold-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-peacock-300">Habit Completion</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-feather-500/20 text-feather-400 border border-feather-500/30">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">
              {analyticsSummary.dailyHabitRate}%
            </span>
            <span className="text-[11px] text-feather-400 font-medium">Today's Target</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-peacock-900">
            <div
              className="h-full rounded-full bg-gradient-to-r from-feather-400 to-peacock-400 transition-all duration-500"
              style={{ width: `${Math.min(100, analyticsSummary.dailyHabitRate)}%` }}
            />
          </div>
        </div>

        {/* KPI 2: Active vs Completed Tasks */}
        <div className="relative overflow-hidden rounded-2xl border border-peacock-800 bg-peacock-950/70 p-5 shadow-lg backdrop-blur-sm hover:border-gold-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-peacock-300">Active vs Done Tasks</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-royal-500/20 text-royal-400 border border-royal-500/30">
              <ListTodo className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">
              {analyticsSummary.activeTasks}
            </span>
            <span className="text-[11px] text-peacock-400 font-medium">
              / {analyticsSummary.completedTasks} completed
            </span>
          </div>
          <p className="mt-3 text-[11px] text-peacock-300 truncate">
            {tasks.length} total activities in backlog
          </p>
        </div>

        {/* KPI 3: Longest Active Streak */}
        <div className="relative overflow-hidden rounded-2xl border border-peacock-800 bg-peacock-950/70 p-5 shadow-lg backdrop-blur-sm hover:border-gold-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-peacock-300">Longest Habit Streak</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-500/20 text-gold-400 border border-gold-500/30">
              <Flame className="h-5 w-5 fill-gold-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-gold-300">
              {analyticsSummary.longestActiveStreak}
            </span>
            <span className="text-[11px] text-gold-400 font-medium">Consecutive Days</span>
          </div>
          <p className="mt-3 text-[11px] text-peacock-300">
            Unbroken momentum across your habits
          </p>
        </div>

        {/* KPI 4: Productive Minutes Logged Today */}
        <div className="relative overflow-hidden rounded-2xl border border-peacock-800 bg-peacock-950/70 p-5 shadow-lg backdrop-blur-sm hover:border-gold-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-peacock-300">Productive Time Today</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-peacock-500/20 text-peacock-300 border border-peacock-500/30">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">
              {analyticsSummary.todayProductiveMinutes}
            </span>
            <span className="text-[11px] text-peacock-300 font-medium">Minutes Logged</span>
          </div>
          <p className="mt-3 text-[11px] text-peacock-300">
            Goal: {user?.daily_goal_minutes || 120} min ({Math.round((analyticsSummary.todayProductiveMinutes / (user?.daily_goal_minutes || 120)) * 100)}%)
          </p>
        </div>
      </div>

      {/* Visual Charts: 7-Day Velocity & Category Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 7-Day Completion Velocity Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-peacock-800 bg-peacock-950/70 p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-gold-400" />
                <span>7-Day Activity & Habit Velocity</span>
              </h3>
              <p className="text-xs text-peacock-300">
                Comparison of daily completed habits vs task completions
              </p>
            </div>
            <span className="rounded-full bg-peacock-900 px-2.5 py-1 text-[11px] font-semibold text-peacock-200 border border-peacock-700">
              Past 7 Days
            </span>
          </div>

          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analyticsSummary.weeklyHabitVelocity}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <XAxis
                  dataKey="day"
                  stroke="#7ecee0"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#135e76' }}
                />
                <YAxis
                  stroke="#7ecee0"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#135e76' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#041d27',
                    borderColor: '#f4a313',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  }}
                />
                <Bar
                  dataKey="habitsCompleted"
                  name="Habits Done"
                  fill="#d4af37"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="tasksCompleted"
                  name="Tasks Done"
                  fill="#17b890"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Donut */}
        <div className="rounded-2xl border border-peacock-800 bg-peacock-950/70 p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <PieIcon className="h-4 w-4 text-gold-400" />
                <span>Focus Allocation</span>
              </h3>
              <p className="text-xs text-peacock-300">
                Time and habit distribution
              </p>
            </div>
          </div>

          <div className="mt-2 h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsSummary.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {analyticsSummary.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#041d27" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#041d27',
                    borderColor: '#f4a313',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 space-y-1.5 border-t border-peacock-800/80 pt-2.5">
            {analyticsSummary.categoryBreakdown.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-peacock-200">{cat.name}</span>
                </div>
                <span className="font-bold text-white">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 45-Day Consistency Heatmap */}
      <div className="rounded-2xl border border-peacock-800 bg-peacock-950/70 p-5 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Flame className="h-4 w-4 text-gold-400" />
              <span>45-Day Consistency & Activity Heatmap</span>
            </h3>
            <p className="text-xs text-peacock-300">
              Contribution intensity across your daily habit checks and focus milestones
            </p>
          </div>
          <div className="flex items-center space-x-1 text-[10px] text-peacock-400">
            <span>Less</span>
            <span className="h-2.5 w-2.5 rounded-sm bg-peacock-900 border border-peacock-800" />
            <span className="h-2.5 w-2.5 rounded-sm bg-peacock-700" />
            <span className="h-2.5 w-2.5 rounded-sm bg-feather-600" />
            <span className="h-2.5 w-2.5 rounded-sm bg-gold-500" />
            <span className="h-2.5 w-2.5 rounded-sm bg-gold-300 shadow-gold-sm" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="mt-4 flex flex-wrap gap-1.5 overflow-x-auto pb-2">
          {analyticsSummary.recentHeatmap.map((cell, idx) => {
            let bgClass = 'bg-peacock-900/60 border border-peacock-800/80';
            if (cell.level === 1) bgClass = 'bg-peacock-700 border border-peacock-600';
            if (cell.level === 2) bgClass = 'bg-feather-600 border border-feather-500';
            if (cell.level === 3) bgClass = 'bg-gold-600 border border-gold-500';
            if (cell.level === 4) bgClass = 'bg-gold-400 border border-gold-300 shadow-gold-sm';

            return (
              <div
                key={idx}
                title={`${cell.date}: ${cell.count} activities completed`}
                className={`h-5 w-5 sm:h-6 sm:w-6 rounded-md transition hover:scale-125 hover:z-20 cursor-pointer ${bgClass}`}
              />
            );
          })}
        </div>
      </div>

      {/* Quick Today's Habits Checklist */}
      <div className="rounded-2xl border border-peacock-800 bg-peacock-950/70 p-5 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-feather-400" />
              <span>Today's Habits Quick Check-In</span>
            </h3>
            <p className="text-xs text-peacock-300">
              One-click instant toggle with sound & confetti
            </p>
          </div>
          <button
            onClick={() => setActiveTab('habits')}
            className="flex items-center space-x-1 text-xs font-semibold text-gold-400 hover:text-gold-300 transition"
          >
            <span>View All Habits</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {habits.slice(0, 3).map((h) => {
            const stats = getHabitStats(h);
            return (
              <div
                key={h.id}
                onClick={() => toggleHabitCompletion(h.id)}
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition ${
                  stats.isCompletedToday
                    ? 'border-gold-500/50 bg-peacock-900/90 shadow-gold-sm'
                    : 'border-peacock-800 bg-peacock-950/90 hover:border-peacock-600'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                      stats.isCompletedToday
                        ? 'bg-gold-500 text-peacock-950 border-gold-400 font-bold'
                        : 'border-peacock-700 bg-peacock-900 text-peacock-400'
                    }`}
                  >
                    {stats.isCompletedToday ? <CheckCircle2 className="h-5 w-5" /> : <Plus className="h-4 w-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{h.title}</h4>
                    <p className="text-[10px] text-peacock-300">{stats.currentStreak} day streak 🔥</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
