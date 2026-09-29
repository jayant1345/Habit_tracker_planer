'use client';

import React from 'react';
import { DailyTaskItem, TaskExecutionStatus, MissedReason } from '@/types';
import {
  CheckCircle2,
  Clock,
  PlayCircle,
  AlertOctagon,
  CalendarClock,
  ExternalLink,
  Award,
  Search,
  GitBranch,
  Mic,
  Moon,
  Footprints,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface TaskRowItemProps {
  task: DailyTaskItem;
  onUpdateStatus: (status: TaskExecutionStatus) => void;
  onUpdateActualTime: (startTime: string, endTime: string, durationMinutes: number) => void;
  onOpenDetails: () => void;
  onOpenMissedModal: () => void;
}

export function TaskRowItem({
  task,
  onUpdateStatus,
  onUpdateActualTime,
  onOpenDetails,
  onOpenMissedModal,
}: TaskRowItemProps) {
  const getTaskIcon = () => {
    switch (task.taskKey) {
      case 'walk':
        return <Footprints className="h-4 w-4 text-emerald-400" />;
      case 'vipassana':
        return <Sparkles className="h-4 w-4 text-purple-400" />;
      case 'pyq_test':
        return <Award className="h-4 w-4 text-gold-400" />;
      case 'pyq_solution':
        return <Search className="h-4 w-4 text-feather-400" />;
      case 'decode':
        return <GitBranch className="h-4 w-4 text-blue-400" />;
      case 'marathon':
        return <PlayCircle className="h-4 w-4 text-amber-400" />;
      case 'english':
        return <Mic className="h-4 w-4 text-rose-400" />;
      case 'review':
        return <Moon className="h-4 w-4 text-gold-300" />;
      default:
        return <Clock className="h-4 w-4 text-peacock-400" />;
    }
  };

  const getStatusBadge = () => {
    switch (task.status) {
      case 'completed':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40 px-2.5 py-0.5 text-[11px] font-extrabold">
            <span>🟢</span>
            <span>Completed</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-amber-100 text-amber-950 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40 px-2.5 py-0.5 text-[11px] font-extrabold animate-pulse">
            <span>🟡</span>
            <span>In Progress</span>
          </span>
        );
      case 'missed':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-red-100 text-red-950 border border-red-300 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/40 px-2.5 py-0.5 text-[11px] font-extrabold">
            <span>🔴</span>
            <span>Missed</span>
          </span>
        );
      case 'rescheduled':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-blue-100 text-blue-950 border border-blue-300 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/40 px-2.5 py-0.5 text-[11px] font-extrabold">
            <span>🔵</span>
            <span>Rescheduled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-stone-200 text-stone-800 border border-stone-300 dark:bg-peacock-900 dark:text-peacock-400 dark:border-peacock-800 px-2.5 py-0.5 text-[11px] font-bold">
            <span>⬜</span>
            <span>Not Started</span>
          </span>
        );
    }
  };

  // Specific summary snippet for each task type
  const renderDetailSnippet = () => {
    if (task.taskKey === 'pyq_test' && task.pyqTestDetails) {
      const { accuracy, score, mistakesAnalyzed, attempted, numberOfQuestions } = task.pyqTestDetails;
      return (
        <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px]">
          <span className="rounded bg-amber-100 text-amber-950 font-black border border-amber-400 px-2 py-0.5 dark:bg-peacock-900/90 dark:text-gold-400 dark:border-peacock-700">
            Acc: {accuracy}%
          </span>
          <span className="rounded bg-stone-200 text-stone-950 font-black font-mono border border-stone-300 px-2 py-0.5 dark:bg-peacock-900/90 dark:text-peacock-300 dark:border-peacock-700">
            Score: {score}/100
          </span>
          <span className="text-[10px] text-stone-700 dark:text-peacock-400 font-semibold">
            ({attempted}/{numberOfQuestions} Qs)
          </span>
          {mistakesAnalyzed ? (
            <span className="text-[10px] font-black text-emerald-800 dark:text-emerald-400">✅ Mistakes Analyzed</span>
          ) : (
            <span className="text-[10px] font-black text-amber-800 dark:text-amber-400">⚠️ Pending Analysis</span>
          )}
        </div>
      );
    }

    if (task.taskKey === 'pyq_solution' && task.pyqSolutionDetails) {
      const { conceptualMistakes, sillyMistakes, knowledgeGaps, notesUpdated } = task.pyqSolutionDetails;
      return (
        <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px]">
          <span className="rounded bg-amber-100 text-amber-950 font-black border border-amber-300 px-2 py-0.5 text-[10px] dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20">
            {conceptualMistakes} Conceptual
          </span>
          <span className="rounded bg-purple-100 text-purple-950 font-black border border-purple-300 px-2 py-0.5 text-[10px] dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/20">
            {sillyMistakes} Silly
          </span>
          <span className="rounded bg-blue-100 text-blue-950 font-black border border-blue-300 px-2 py-0.5 text-[10px] dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20">
            {knowledgeGaps} Gaps
          </span>
          {notesUpdated && <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-black">✅ Notes Synced</span>}
        </div>
      );
    }

    if (task.taskKey === 'decode' && task.decodeDetails) {
      const { topic, subject } = task.decodeDetails;
      return (
        <div className="mt-1 text-[11px] text-stone-800 dark:text-peacock-300 line-clamp-1 font-medium">
          <span className="text-amber-950 dark:text-gold-400 font-black">{subject}:</span> {topic}
        </div>
      );
    }

    if (task.taskKey === 'marathon' && task.marathonDetails) {
      return (
        <div className="mt-1 text-[11px] text-stone-800 dark:text-peacock-300 line-clamp-1 font-medium">
          <span className="text-amber-950 dark:text-amber-400 font-black">Marathon:</span> {task.marathonDetails.topic}
        </div>
      );
    }

    if (task.taskKey === 'english' && task.englishDetails) {
      const { confidenceLevel, fluency, topicSpokenAbout } = task.englishDetails;
      return (
        <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px]">
          <span className="text-rose-950 dark:text-rose-300 font-bold truncate max-w-[200px]">{topicSpokenAbout}</span>
          <span className="text-[10px] text-stone-700 dark:text-peacock-400 font-semibold">
            • Conf: {confidenceLevel}/5 • Fluency: {fluency}/5
          </span>
        </div>
      );
    }

    if (task.taskKey === 'walk' && task.walkDetails) {
      return (
        <div className="mt-1 text-[11px] text-stone-700 dark:text-peacock-400 font-semibold">
          {task.walkDetails.distanceKm ? `${task.walkDetails.distanceKm} km` : '30 mins brisk'}
          {task.walkDetails.stepCount ? ` • ${task.walkDetails.stepCount} steps` : ''}
        </div>
      );
    }

    if (task.taskKey === 'vipassana' && task.vipassanaDetails) {
      return (
        <div className="mt-1 text-[11px] text-stone-700 dark:text-peacock-400 font-semibold">
          45-min silent Anapana & body sensations observation
        </div>
      );
    }

    if (task.taskKey === 'review' && task.reviewDetails) {
      return (
        <div className="mt-1 text-[11px] text-amber-950 dark:text-gold-300/90 truncate max-w-[320px] font-semibold italic">
          “{task.reviewDetails.proudOf || task.reviewDetails.completedSummary}”
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className={`rounded-2xl border p-4 transition-all duration-200 ${
        task.status === 'completed'
          ? 'border-emerald-500/30 bg-peacock-950/70 hover:border-emerald-500/50'
          : task.status === 'missed'
          ? 'border-red-500/30 bg-red-950/20 hover:border-red-500/50'
          : task.status === 'in_progress'
          ? 'border-amber-500/40 bg-peacock-900/60 shadow-gold-sm'
          : 'border-peacock-800/80 bg-peacock-950/40 hover:border-gold-500/30'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Task Identity & Category */}
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-200 dark:bg-peacock-900 border border-stone-300 dark:border-peacock-700/80 flex-shrink-0 mt-0.5">
            {getTaskIcon()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-stone-950 dark:text-white tracking-tight">{task.title}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-sm ${
                  task.category === 'Study'
                    ? 'bg-blue-100 text-blue-950 border border-blue-400 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30'
                    : 'bg-emerald-100 text-emerald-950 border border-emerald-400 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30'
                }`}
              >
                {task.category}
              </span>
              <span className="rounded bg-stone-300 text-stone-950 border border-stone-400 dark:bg-peacock-900 dark:text-peacock-200 dark:border-peacock-800 px-2.5 py-0.5 text-[10px] font-mono font-black">
                Target: {task.targetDurationMinutes}m
              </span>
            </div>

            {/* Snippet / Sub-details */}
            {renderDetailSnippet()}

            {/* If Missed Reason Recorded */}
            {task.status === 'missed' && task.missedReason && (
              <div className="mt-1 flex items-center space-x-1.5 text-[11px] text-red-700 dark:text-red-300 font-bold">
                <AlertOctagon className="h-3 w-3 text-red-600 dark:text-red-400" />
                <span>Missed Reason: <strong>{task.missedReason}</strong></span>
                {task.notes && <span className="text-stone-600 dark:text-peacock-400 truncate font-normal">({task.notes})</span>}
              </div>
            )}
          </div>
        </div>

        {/* Center: Time Blocking (Planned vs Actual) */}
        <div className="w-full lg:w-auto flex flex-wrap items-center justify-between sm:justify-start gap-2.5 sm:gap-4 bg-stone-200/90 dark:bg-peacock-900/60 rounded-xl px-3 py-2 border border-stone-300 dark:border-peacock-800/80 shadow-sm">
          <div>
            <span className="block text-[9px] font-black uppercase tracking-wider text-stone-700 dark:text-peacock-400">
              Planned Time
            </span>
            <div className="text-xs font-mono font-black text-stone-950 dark:text-peacock-200">
              {task.plannedStartTime} – {task.plannedEndTime}
            </div>
          </div>

          <div className="hidden sm:block h-6 w-px bg-stone-300 dark:bg-peacock-800" />

          <div>
            <span className="block text-[9px] font-black uppercase tracking-wider text-stone-700 dark:text-peacock-400">
              Actual Time
            </span>
            <div className="flex items-center space-x-1">
              <input
                type="text"
                value={task.actualStartTime || task.plannedStartTime}
                onChange={(e) =>
                  onUpdateActualTime(e.target.value, task.actualEndTime || task.plannedEndTime, task.actualDurationMinutes)
                }
                className="w-14 rounded border border-stone-300 bg-white text-stone-950 dark:border-peacock-700 dark:bg-peacock-950 dark:text-white px-1.5 py-1 text-center text-xs font-mono font-bold focus:border-amber-500 focus:outline-none"
              />
              <span className="text-stone-700 dark:text-peacock-500 font-mono font-bold">-</span>
              <input
                type="text"
                value={task.actualEndTime || task.plannedEndTime}
                onChange={(e) =>
                  onUpdateActualTime(task.actualStartTime || task.plannedStartTime, e.target.value, task.actualDurationMinutes)
                }
                className="w-14 rounded border border-stone-300 bg-white text-stone-950 dark:border-peacock-700 dark:bg-peacock-950 dark:text-white px-1.5 py-1 text-center text-xs font-mono font-bold focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="hidden sm:block h-6 w-px bg-stone-300 dark:bg-peacock-800" />

          <div>
            <span className="block text-[9px] font-black uppercase tracking-wider text-stone-700 dark:text-peacock-400">
              Duration
            </span>
            <div className="flex items-center space-x-1">
              <input
                type="number"
                min="0"
                value={task.actualDurationMinutes || 0}
                onChange={(e) =>
                  onUpdateActualTime(
                    task.actualStartTime || task.plannedStartTime,
                    task.actualEndTime || task.plannedEndTime,
                    Number(e.target.value)
                  )
                }
                className="w-14 rounded border border-stone-300 bg-white text-amber-950 dark:border-peacock-700 dark:bg-peacock-950 dark:text-gold-300 px-1.5 py-1 text-center text-xs font-mono font-black focus:border-amber-500 focus:outline-none"
              />
              <span className="text-[10px] text-stone-700 dark:text-peacock-400 font-mono font-bold">m</span>
            </div>
          </div>
        </div>

        {/* Right: Status Dropdown & Action Button */}
        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end space-x-2 pt-1 sm:pt-0">
          {/* Status Selector */}
          <select
            value={task.status}
            onChange={(e) => {
              const nextStatus = e.target.value as TaskExecutionStatus;
              if (nextStatus === 'missed') {
                onOpenMissedModal();
              } else {
                onUpdateStatus(nextStatus);
              }
            }}
            className="flex-1 sm:flex-initial min-h-[38px] rounded-xl border border-stone-300 bg-white text-stone-950 dark:border-peacock-700 dark:bg-peacock-900/90 dark:text-white px-3 py-1.5 text-xs font-black focus:border-amber-500 focus:outline-none shadow-sm cursor-pointer"
          >
            <option value="not_started">⬜ Not Started</option>
            <option value="in_progress">🟡 In Progress</option>
            <option value="completed">🟢 Completed</option>
            <option value="missed">🔴 Missed</option>
            <option value="rescheduled">🔵 Rescheduled</option>
          </select>

          {/* Quick Details Launcher Button */}
          <button
            type="button"
            onClick={onOpenDetails}
            title="Open Detailed Log / Metrics Form"
            className="min-h-[38px] flex items-center space-x-1.5 rounded-xl border border-amber-500 bg-amber-400 text-stone-950 hover:bg-amber-300 dark:border-gold-500/40 dark:bg-peacock-900/90 dark:text-gold-300 dark:hover:bg-gold-500/10 px-4 py-1.5 text-xs font-black transition shadow-sm"
          >
            <span>Log</span>
            <ExternalLink className="h-3.5 w-3.5 text-stone-950 dark:text-gold-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
