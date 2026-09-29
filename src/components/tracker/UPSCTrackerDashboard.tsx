'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { CoreTaskKey, DailyTaskItem, TaskExecutionStatus, MissedReason, PYQTestDetails, PYQSolutionDetails, DecodeDetails, EnglishDetails, ReviewDetails } from '@/types';
import { calculateDailyScore } from '@/lib/upscTracker';
import { DailyScoreCard } from './cards/DailyScoreCard';
import { TaskRowItem } from './cards/TaskRowItem';
import { TimeBlockingView } from './views/TimeBlockingView';
import { WeeklyDashboardView } from './views/WeeklyDashboardView';
import { MonthlyDashboardView } from './views/MonthlyDashboardView';
import { PYQTestModal } from './modals/PYQTestModal';
import { PYQSolutionModal } from './modals/PYQSolutionModal';
import { DecodeTopicModal } from './modals/DecodeTopicModal';
import { EnglishSpeakingModal } from './modals/EnglishSpeakingModal';
import { MissedReasonModal } from './modals/MissedReasonModal';
import { DailyReviewModal } from './modals/DailyReviewModal';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  TrendingUp,
  RotateCcw,
  Zap,
  HelpCircle,
  FileText,
  Flame,
} from 'lucide-react';
import { format, subDays, addDays, parseISO } from 'date-fns';

type SubViewTab = 'daily_tasks' | 'time_blocking' | 'pyq_lab' | 'nightly_review' | 'weekly_heatmap' | 'monthly_streaks';

export function UPSCTrackerDashboard() {
  const { user } = useAuth();
  const {
    upscTasksMap,
    upscReviewsMap,
    upscScheduleBlocks,
    selectedTrackerDate,
    setSelectedTrackerDate,
    updateDailyTask,
    updateTimeBlock,
    saveDailyReview,
    getTodaySummary,
    getWeeklyDashboardData,
    getMonthlyDashboardData,
    getTaskStreaks,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<SubViewTab>('daily_tasks');

  // Modal States
  const [activeModal, setActiveModal] = useState<CoreTaskKey | 'missed' | 'review_full' | null>(null);
  const [selectedTaskForMissed, setSelectedTaskForMissed] = useState<DailyTaskItem | null>(null);

  // Active tasks for current selectedTrackerDate
  const currentTasks = useMemo(() => {
    return upscTasksMap[selectedTrackerDate] || [];
  }, [upscTasksMap, selectedTrackerDate]);

  const currentReview = useMemo(() => {
    return upscReviewsMap[selectedTrackerDate];
  }, [upscReviewsMap, selectedTrackerDate]);

  const todaySummary = useMemo(() => {
    return getTodaySummary(selectedTrackerDate);
  }, [getTodaySummary, selectedTrackerDate]);

  const dailyScoreBreakdown = useMemo(() => {
    return calculateDailyScore(currentTasks, currentReview);
  }, [currentTasks, currentReview]);

  const weeklyData = useMemo(() => {
    return getWeeklyDashboardData(selectedTrackerDate);
  }, [getWeeklyDashboardData, selectedTrackerDate]);

  const monthlyData = useMemo(() => {
    return getMonthlyDashboardData(selectedTrackerDate);
  }, [getMonthlyDashboardData, selectedTrackerDate]);

  const streaks = useMemo(() => {
    return getTaskStreaks();
  }, [getTaskStreaks]);

  // Date Navigation Helpers
  const handlePrevDay = () => {
    const current = parseISO(selectedTrackerDate);
    setSelectedTrackerDate(format(subDays(current, 1), 'yyyy-MM-dd'));
  };

  const handleNextDay = () => {
    const current = parseISO(selectedTrackerDate);
    setSelectedTrackerDate(format(addDays(current, 1), 'yyyy-MM-dd'));
  };

  const handleJumpToToday = () => {
    setSelectedTrackerDate(format(new Date(), 'yyyy-MM-dd'));
  };

  // Quick Action: Mark all remaining tasks as completed
  const handleMarkAllCompleted = () => {
    currentTasks.forEach((t) => {
      if (t.status !== 'completed') {
        updateDailyTask(selectedTrackerDate, t.taskKey, {
          status: 'completed',
          completionPercentage: 100,
          actualDurationMinutes: t.actualDurationMinutes || t.targetDurationMinutes,
        });
      }
    });
  };

  const pyqTask = currentTasks.find((t) => t.taskKey === 'pyq_test');
  const pyqSolTask = currentTasks.find((t) => t.taskKey === 'pyq_solution');
  const decodeTask = currentTasks.find((t) => t.taskKey === 'decode');
  const englishTask = currentTasks.find((t) => t.taskKey === 'english');

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome & Motivation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-gold-500/30 bg-peacock-950/80 p-5 backdrop-blur-xl shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-amber-100 text-amber-950 border border-amber-400 dark:bg-gold-500/20 dark:text-gold-300 dark:border-gold-500/40 px-3 py-1 text-xs font-black flex items-center space-x-1.5 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-700 dark:text-gold-400" />
              <span>Target: UPSC Drug Inspector</span>
            </span>
            <span className="text-xs text-stone-700 dark:text-peacock-300 font-mono font-bold hidden sm:inline">
              Command Center
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-stone-950 dark:text-white tracking-tight">
            Welcome, {user?.display_name || 'Hitesh Gauswami'}
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-stone-700 dark:text-peacock-300 font-medium">
            “Did I actually execute today’s plan?” • Execution &gt; Perfection
          </p>
        </div>

        {/* Date Selector & Navigator */}
        <div className="flex items-center space-x-1.5 self-start md:self-center bg-stone-200 dark:bg-peacock-900/90 rounded-2xl p-1.5 border border-stone-300 dark:border-peacock-700/80 shadow-inner flex-shrink-0">
          <button
            onClick={handlePrevDay}
            className="p-1.5 rounded-xl text-stone-800 hover:text-stone-950 hover:bg-stone-300 dark:text-peacock-300 dark:hover:bg-peacock-800 dark:hover:text-white transition"
            title="Previous Day"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="px-3 py-1 text-center min-w-[110px]">
            <span className="block text-[10px] uppercase font-black tracking-wider text-stone-700 dark:text-peacock-400">
              {format(parseISO(selectedTrackerDate), 'EEEE')}
            </span>
            <span className="text-xs font-mono font-black text-amber-950 dark:text-gold-300">
              {format(parseISO(selectedTrackerDate), 'dd MMM yyyy')}
            </span>
          </div>

          <button
            onClick={handleNextDay}
            className="p-1.5 rounded-xl text-stone-800 hover:text-stone-950 hover:bg-stone-300 dark:text-peacock-300 dark:hover:bg-peacock-800 dark:hover:text-white transition"
            title="Next Day"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            onClick={handleJumpToToday}
            className="ml-1 rounded-xl bg-stone-900 text-amber-300 dark:bg-peacock-800 dark:text-gold-300 px-3 py-1 text-[11px] font-black border border-stone-800 dark:border-gold-500/40 hover:bg-stone-800 transition shadow-sm"
          >
            Today
          </button>
        </div>
      </div>

      {/* Hero Today's Score Card */}
      <DailyScoreCard
        summary={todaySummary}
        breakdown={dailyScoreBreakdown}
        onOpenReviewModal={() => setActiveModal('review_full')}
      />

      {/* Navigation Sub-Tabs */}
      <div className="flex overflow-x-auto no-scrollbar rounded-2xl bg-stone-200/90 dark:bg-peacock-950/70 p-1.5 border border-stone-300 dark:border-peacock-800/80 shadow-md w-full min-w-0">
        <button
          onClick={() => setActiveSubTab('daily_tasks')}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-black whitespace-nowrap transition ${
            activeSubTab === 'daily_tasks'
              ? 'bg-stone-900 text-amber-300 border border-stone-800 shadow-md dark:bg-gradient-to-r dark:from-peacock-800 dark:to-peacock-700 dark:text-gold-300 dark:border-gold-500/40'
              : 'text-stone-800 hover:text-stone-950 hover:bg-stone-300/80 dark:text-peacock-300 dark:hover:text-white dark:hover:bg-peacock-900/50'
          }`}
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>Daily Execution (8 Core Tasks)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('time_blocking')}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-black whitespace-nowrap transition ${
            activeSubTab === 'time_blocking'
              ? 'bg-stone-900 text-amber-300 border border-stone-800 shadow-md dark:bg-gradient-to-r dark:from-peacock-800 dark:to-peacock-700 dark:text-gold-300 dark:border-gold-500/40'
              : 'text-stone-800 hover:text-stone-950 hover:bg-stone-300/80 dark:text-peacock-300 dark:hover:text-white dark:hover:bg-peacock-900/50'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Time Blocking Planner</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pyq_lab')}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-black whitespace-nowrap transition ${
            activeSubTab === 'pyq_lab'
              ? 'bg-stone-900 text-amber-300 border border-stone-800 shadow-md dark:bg-gradient-to-r dark:from-peacock-800 dark:to-peacock-700 dark:text-gold-300 dark:border-gold-500/40'
              : 'text-stone-800 hover:text-stone-950 hover:bg-stone-300/80 dark:text-peacock-300 dark:hover:text-white dark:hover:bg-peacock-900/50'
          }`}
        >
          <Award className="h-4 w-4" />
          <span>PYQ & Decode Diagnostic Lab</span>
        </button>

        <button
          onClick={() => setActiveSubTab('nightly_review')}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-black whitespace-nowrap transition ${
            activeSubTab === 'nightly_review'
              ? 'bg-stone-900 text-amber-300 border border-stone-800 shadow-md dark:bg-gradient-to-r dark:from-peacock-800 dark:to-peacock-700 dark:text-gold-300 dark:border-gold-500/40'
              : 'text-stone-800 hover:text-stone-950 hover:bg-stone-300/80 dark:text-peacock-300 dark:hover:text-white dark:hover:bg-peacock-900/50'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Nightly Review</span>
        </button>

        <button
          onClick={() => setActiveSubTab('weekly_heatmap')}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-black whitespace-nowrap transition ${
            activeSubTab === 'weekly_heatmap'
              ? 'bg-stone-900 text-amber-300 border border-stone-800 shadow-md dark:bg-gradient-to-r dark:from-peacock-800 dark:to-peacock-700 dark:text-gold-300 dark:border-gold-500/40'
              : 'text-stone-800 hover:text-stone-950 hover:bg-stone-300/80 dark:text-peacock-300 dark:hover:text-white dark:hover:bg-peacock-900/50'
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>Weekly Heatmap</span>
        </button>

        <button
          onClick={() => setActiveSubTab('monthly_streaks')}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-black whitespace-nowrap transition ${
            activeSubTab === 'monthly_streaks'
              ? 'bg-stone-900 text-amber-300 border border-stone-800 shadow-md dark:bg-gradient-to-r dark:from-peacock-800 dark:to-peacock-700 dark:text-gold-300 dark:border-gold-500/40'
              : 'text-stone-800 hover:text-stone-950 hover:bg-stone-300/80 dark:text-peacock-300 dark:hover:text-white dark:hover:bg-peacock-900/50'
          }`}
        >
          <Flame className="h-4 w-4" />
          <span>Monthly Consistency & Streaks</span>
        </button>
      </div>

      {/* TAB 1: DAILY EXECUTION (8 CORE TASKS) */}
      {activeSubTab === 'daily_tasks' && (
        <div className="space-y-4">
          {/* Action Row */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-peacock-300">
              Showing 8 Core Activities for{' '}
              <strong className="text-gold-300">{format(parseISO(selectedTrackerDate), 'EEEE, dd MMMM')}</strong>
            </span>
            <button
              onClick={handleMarkAllCompleted}
              className="text-xs font-bold text-gold-400 hover:underline flex items-center space-x-1"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Mark All As Executed</span>
            </button>
          </div>

          {/* Task Rows List */}
          <div className="space-y-3">
            {currentTasks.map((task) => (
              <TaskRowItem
                key={task.id}
                task={task}
                onUpdateStatus={(status) => {
                  updateDailyTask(selectedTrackerDate, task.taskKey, { status });
                }}
                onUpdateActualTime={(actualStartTime, actualEndTime, actualDurationMinutes) => {
                  updateDailyTask(selectedTrackerDate, task.taskKey, {
                    actualStartTime,
                    actualEndTime,
                    actualDurationMinutes,
                  });
                }}
                onOpenDetails={() => {
                  if (task.taskKey === 'pyq_test') setActiveModal('pyq_test');
                  else if (task.taskKey === 'pyq_solution') setActiveModal('pyq_solution');
                  else if (task.taskKey === 'decode') setActiveModal('decode');
                  else if (task.taskKey === 'english') setActiveModal('english');
                  else if (task.taskKey === 'review') setActiveModal('review_full');
                  else {
                    // For walk, vipassana, marathon: toggle completion
                    const next = task.status === 'completed' ? 'not_started' : 'completed';
                    updateDailyTask(selectedTrackerDate, task.taskKey, { status: next });
                  }
                }}
                onOpenMissedModal={() => {
                  setSelectedTaskForMissed(task);
                  setActiveModal('missed');
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TIME BLOCKING PLANNER */}
      {activeSubTab === 'time_blocking' && (
        <TimeBlockingView
          scheduleBlocks={upscScheduleBlocks}
          todayTasks={currentTasks}
          onUpdateBlock={updateTimeBlock}
          onResetDefaultSchedule={() => {
            // reset blocks
          }}
        />
      )}

      {/* TAB 3: PYQ & DECODE DIAGNOSTIC LAB */}
      {activeSubTab === 'pyq_lab' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PYQ Test Card */}
            <div className="rounded-3xl border border-gold-500/30 bg-peacock-950/70 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-peacock-800 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-gold-400" />
                  <h3 className="text-base font-bold text-white">PYQ Test Deep Dive</h3>
                </div>
                <button
                  onClick={() => setActiveModal('pyq_test')}
                  className="rounded-xl border border-gold-500/40 bg-peacock-900 px-3 py-1 text-xs font-bold text-gold-300 hover:bg-gold-500/10 transition"
                >
                  Edit Test Log
                </button>
              </div>

              {pyqTask?.pyqTestDetails ? (
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] text-peacock-400 uppercase font-semibold">Test Name</span>
                    <p className="text-sm font-bold text-white">{pyqTask.pyqTestDetails.testName}</p>
                    <span className="text-xs text-gold-400">{pyqTask.pyqTestDetails.subject}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center rounded-xl bg-peacock-900/60 p-2.5 border border-peacock-800">
                    <div>
                      <span className="text-[10px] text-peacock-400 block">Attempted</span>
                      <span className="text-base font-extrabold text-white">
                        {pyqTask.pyqTestDetails.attempted} / {pyqTask.pyqTestDetails.numberOfQuestions}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 block">Correct</span>
                      <span className="text-base font-extrabold text-emerald-300">{pyqTask.pyqTestDetails.correct}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-red-400 block">Wrong</span>
                      <span className="text-base font-extrabold text-red-300">{pyqTask.pyqTestDetails.wrong}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-gold-500/30 bg-gold-500/10">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gold-400">Formula Accuracy</span>
                      <p className="text-xs text-peacock-300">Correct ÷ Attempted × 100</p>
                    </div>
                    <span className="text-2xl font-black text-white">{pyqTask.pyqTestDetails.accuracy}%</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-peacock-400">No PYQ test recorded yet for today.</p>
              )}
            </div>

            {/* PYQ Solution Analysis Card */}
            <div className="rounded-3xl border border-feather-500/30 bg-peacock-950/70 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-peacock-800 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-feather-400" />
                  <h3 className="text-base font-bold text-white">Solution Error Taxonomy</h3>
                </div>
                <button
                  onClick={() => setActiveModal('pyq_solution')}
                  className="rounded-xl border border-feather-500/40 bg-peacock-900 px-3 py-1 text-xs font-bold text-feather-300 hover:bg-feather-500/10 transition"
                >
                  Edit Solution Log
                </button>
              </div>

              {pyqSolTask?.pyqSolutionDetails ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5">
                      <span className="text-[10px] text-amber-300 font-semibold block">Conceptual</span>
                      <span className="text-lg font-bold text-white">
                        {pyqSolTask.pyqSolutionDetails.conceptualMistakes}
                      </span>
                    </div>
                    <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-2.5">
                      <span className="text-[10px] text-purple-300 font-semibold block">Silly</span>
                      <span className="text-lg font-bold text-white">
                        {pyqSolTask.pyqSolutionDetails.sillyMistakes}
                      </span>
                    </div>
                    <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-2.5">
                      <span className="text-[10px] text-blue-300 font-semibold block">Knowledge Gaps</span>
                      <span className="text-lg font-bold text-white">
                        {pyqSolTask.pyqSolutionDetails.knowledgeGaps}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-peacock-800 text-xs">
                    <span className="text-peacock-300">
                      Notes Updated:{' '}
                      <strong className="text-emerald-400">
                        {pyqSolTask.pyqSolutionDetails.notesUpdated ? '✅ Yes' : '❌ No'}
                      </strong>
                    </span>
                    <span className="text-peacock-300">
                      Revision Required:{' '}
                      <strong className="text-amber-400">
                        {pyqSolTask.pyqSolutionDetails.revisionRequired ? '🚩 Yes' : 'No'}
                      </strong>
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-peacock-400">No solution analysis logged yet.</p>
              )}
            </div>
          </div>

          {/* Decode Connected Topic Hub */}
          <div className="rounded-3xl border border-gold-500/30 bg-peacock-950/70 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-peacock-800 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  1 Same Topic from Decode (Connected to PYQ Work)
                </h3>
                <p className="text-[11px] text-peacock-300">
                  Ensure today’s Decode revision reinforces your exact test weak areas.
                </p>
              </div>
              <button
                onClick={() => setActiveModal('decode')}
                className="rounded-xl border border-gold-500/40 bg-peacock-900 px-3 py-1 text-xs font-bold text-gold-300 hover:bg-gold-500/10 transition"
              >
                Edit Decode Topic
              </button>
            </div>

            {decodeTask?.decodeDetails ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="rounded bg-peacock-900 px-2 py-0.5 text-xs font-bold text-gold-400 border border-peacock-700">
                    {decodeTask.decodeDetails.subject}
                  </span>
                  <span className="text-sm font-bold text-white">{decodeTask.decodeDetails.topic}</span>
                </div>
                {decodeTask.decodeDetails.importantPointsExtracted && (
                  <div className="rounded-xl border border-peacock-800 bg-peacock-900/60 p-3 text-xs text-peacock-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-peacock-400 block mb-1">
                      Important Points & Exceptions Extracted:
                    </span>
                    {decodeTask.decodeDetails.importantPointsExtracted}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-peacock-400">No Decode topic mapped yet for today.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: NIGHTLY REVIEW */}
      {activeSubTab === 'nightly_review' && (
        <div className="rounded-3xl border border-gold-500/30 bg-peacock-950/70 p-6 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-peacock-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-gold-400" />
                <span>Nightly Accountability Audit</span>
              </h3>
              <p className="text-xs text-peacock-300 mt-0.5">
                The 7 questions answering: “Did I actually execute today’s plan?”
              </p>
            </div>
            <button
              onClick={() => setActiveModal('review_full')}
              className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-4 py-2 text-xs font-bold text-peacock-950 hover:brightness-110 transition shadow-gold-sm"
            >
              <span>{currentReview ? 'Edit Daily Review' : 'Start Daily Review'}</span>
            </button>
          </div>

          {currentReview ? (
            <div className="space-y-3 text-xs">
              <div className="rounded-xl bg-peacock-900/60 p-3 border border-peacock-800">
                <span className="font-bold text-gold-300 block mb-0.5">1. What did I complete today?</span>
                <p className="text-peacock-100">{currentReview.completedSummary}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl bg-peacock-900/60 p-3 border border-peacock-800">
                  <span className="font-bold text-red-300 block mb-0.5">2. What did I miss?</span>
                  <p className="text-peacock-100">{currentReview.missedSummary}</p>
                </div>
                <div className="rounded-xl bg-peacock-900/60 p-3 border border-peacock-800">
                  <span className="font-bold text-red-300 block mb-0.5">3. Why did I miss it?</span>
                  <p className="text-peacock-100">{currentReview.missedReason}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl bg-peacock-900/60 p-3 border border-peacock-800">
                  <span className="font-bold text-amber-300 block mb-0.5">4. Biggest Distraction?</span>
                  <p className="text-peacock-100">{currentReview.biggestDistraction}</p>
                </div>
                <div className="rounded-xl bg-peacock-900/60 p-3 border border-peacock-800">
                  <span className="font-bold text-blue-300 block mb-0.5">5. What did I learn today?</span>
                  <p className="text-peacock-100">{currentReview.learnedToday}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl bg-peacock-900/60 p-3 border border-peacock-800">
                  <span className="font-bold text-purple-300 block mb-0.5">6. What should I improve tomorrow?</span>
                  <p className="text-peacock-100">{currentReview.improveTomorrow}</p>
                </div>
                <div className="rounded-xl bg-emerald-500/10 p-3 border border-emerald-500/30">
                  <span className="font-bold text-emerald-300 block mb-0.5">7. One thing I am proud of today</span>
                  <p className="text-emerald-100">{currentReview.proudOf}</p>
                </div>
              </div>

              {currentReview.tomorrowPriority && (
                <div className="rounded-2xl border border-gold-500/40 bg-gold-500/10 p-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400 block mb-0.5">
                    Tomorrow’s #1 Priority Target
                  </span>
                  <p className="text-sm font-bold text-white">{currentReview.tomorrowPriority}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-peacock-700/80 p-8 text-center">
              <Sparkles className="h-8 w-8 text-gold-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white">Review Not Completed Yet</h4>
              <p className="text-xs text-peacock-400 mt-1 max-w-sm mx-auto">
                Spend 2–5 minutes tonight completing your 7-question accountability audit to close out the day’s score.
              </p>
              <button
                onClick={() => setActiveModal('review_full')}
                className="mt-4 rounded-xl bg-gold-500 px-5 py-2 text-xs font-bold text-peacock-950 hover:bg-gold-400 transition"
              >
                Complete Review Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: WEEKLY HEATMAP */}
      {activeSubTab === 'weekly_heatmap' && <WeeklyDashboardView data={weeklyData} />}

      {/* TAB 6: MONTHLY CONSISTENCY & STREAKS */}
      {activeSubTab === 'monthly_streaks' && <MonthlyDashboardView data={monthlyData} streaks={streaks} />}

      {/* MODALS */}
      {activeModal === 'pyq_test' && (
        <PYQTestModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          details={pyqTask?.pyqTestDetails}
          onSave={(details, timeTaken) => {
            updateDailyTask(selectedTrackerDate, 'pyq_test', {
              status: 'completed',
              actualDurationMinutes: timeTaken,
              pyqTestDetails: details,
            });
          }}
        />
      )}

      {activeModal === 'pyq_solution' && (
        <PYQSolutionModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          details={pyqSolTask?.pyqSolutionDetails}
          onSave={(details) => {
            updateDailyTask(selectedTrackerDate, 'pyq_solution', {
              status: 'completed',
              pyqSolutionDetails: details,
            });
          }}
        />
      )}

      {activeModal === 'decode' && (
        <DecodeTopicModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          details={decodeTask?.decodeDetails}
          currentPyqSubject={pyqTask?.pyqTestDetails?.subject}
          onSave={(details) => {
            updateDailyTask(selectedTrackerDate, 'decode', {
              status: details.topicCompleted ? 'completed' : 'in_progress',
              decodeDetails: details,
            });
          }}
        />
      )}

      {activeModal === 'english' && (
        <EnglishSpeakingModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          details={englishTask?.englishDetails}
          onSave={(details, durationMinutes) => {
            updateDailyTask(selectedTrackerDate, 'english', {
              status: 'completed',
              actualDurationMinutes: durationMinutes,
              englishDetails: details,
            });
          }}
        />
      )}

      {activeModal === 'missed' && selectedTaskForMissed && (
        <MissedReasonModal
          isOpen={true}
          onClose={() => {
            setActiveModal(null);
            setSelectedTaskForMissed(null);
          }}
          taskTitle={selectedTaskForMissed.title}
          initialReason={selectedTaskForMissed.missedReason}
          initialNotes={selectedTaskForMissed.notes}
          onSave={(reason, notes) => {
            updateDailyTask(selectedTrackerDate, selectedTaskForMissed.taskKey, {
              status: 'missed',
              missedReason: reason,
              notes,
            });
          }}
        />
      )}

      {activeModal === 'review_full' && (
        <DailyReviewModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          review={currentReview}
          todayTasks={currentTasks}
          onSave={(review) => {
            saveDailyReview(selectedTrackerDate, review);
          }}
        />
      )}
    </div>
  );
}
