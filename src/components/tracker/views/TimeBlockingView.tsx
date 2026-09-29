'use client';

import React, { useState } from 'react';
import { DailyScheduleBlock, DailyTaskItem, CoreTaskKey } from '@/types';
import {
  Clock,
  Calendar,
  Edit3,
  Check,
  Save,
  RotateCcw,
  Sparkles,
  Sun,
  Sunset,
  Moon,
  BookOpen,
} from 'lucide-react';
import { DEFAULT_SCHEDULE_BLOCKS } from '@/lib/upscTracker';

interface TimeBlockingViewProps {
  scheduleBlocks: DailyScheduleBlock[];
  todayTasks: DailyTaskItem[];
  onUpdateBlock: (taskKey: CoreTaskKey, updates: Partial<DailyScheduleBlock>) => void;
  onResetDefaultSchedule: () => void;
}

export function TimeBlockingView({
  scheduleBlocks,
  todayTasks,
  onUpdateBlock,
  onResetDefaultSchedule,
}: TimeBlockingViewProps) {
  const [editingKey, setEditingKey] = useState<CoreTaskKey | null>(null);
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [editDuration, setEditDuration] = useState(30);

  const startEditing = (block: DailyScheduleBlock) => {
    setEditingKey(block.taskKey);
    setEditStartTime(block.plannedStartTime);
    setEditEndTime(block.plannedEndTime);
    setEditDuration(block.targetDurationMinutes);
  };

  const saveEditing = (taskKey: CoreTaskKey) => {
    onUpdateBlock(taskKey, {
      plannedStartTime: editStartTime,
      plannedEndTime: editEndTime,
      targetDurationMinutes: Number(editDuration) || 30,
    });
    setEditingKey(null);
  };

  const getBlockIcon = (label: string) => {
    switch (label) {
      case 'Morning':
        return <Sun className="h-4 w-4 text-amber-400" />;
      case 'Study Block':
        return <BookOpen className="h-4 w-4 text-blue-400" />;
      case 'Evening':
        return <Sunset className="h-4 w-4 text-rose-400" />;
      case 'Night':
        return <Moon className="h-4 w-4 text-gold-400" />;
      default:
        return <Clock className="h-4 w-4 text-peacock-400" />;
    }
  };

  // Group by block label
  const groups: Record<string, DailyScheduleBlock[]> = {
    Morning: [],
    'Study Block': [],
    Evening: [],
    Night: [],
  };

  scheduleBlocks.forEach((b) => {
    if (groups[b.blockLabel]) {
      groups[b.blockLabel].push(b);
    } else {
      groups['Study Block'].push(b);
    }
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-gold-500/30 bg-peacock-950/70 p-4 backdrop-blur-md">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gold-400" />
            <span>Personalized Time-Blocking Architecture</span>
          </h3>
          <p className="text-xs text-peacock-300 mt-0.5">
            Editable time assignments for your UPSC Drug Inspector routine. Adjust start and end times whenever required.
          </p>
        </div>
        <button
          type="button"
          onClick={onResetDefaultSchedule}
          className="flex items-center space-x-1.5 rounded-xl border border-peacock-700 bg-peacock-900/80 px-3 py-1.5 text-xs font-semibold text-peacock-300 hover:text-white hover:border-gold-500/40 transition"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset to Standard Blocks</span>
        </button>
      </div>

      {/* Time Blocks Groups */}
      <div className="space-y-5">
        {Object.entries(groups).map(([label, blocks]) => {
          if (blocks.length === 0) return null;
          return (
            <div
              key={label}
              className="rounded-3xl border border-peacock-800/80 bg-peacock-950/50 p-4 sm:p-5 backdrop-blur-md"
            >
              <div className="flex items-center justify-between border-b border-peacock-800/80 pb-3 mb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-peacock-900 border border-peacock-700">
                    {getBlockIcon(label)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{label} Schedule</h4>
                    <span className="text-[10px] text-peacock-400">
                      {blocks.length} scheduled activity {blocks.length > 1 ? 'slots' : 'slot'}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-mono font-bold text-gold-400">
                  {blocks.reduce((acc, b) => acc + b.targetDurationMinutes, 0)} mins allocated
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {blocks.map((block) => {
                  const isEditing = editingKey === block.taskKey;
                  const currentTask = todayTasks.find((t) => t.taskKey === block.taskKey);

                  return (
                    <div
                      key={block.taskKey}
                      className="rounded-2xl border border-peacock-800 bg-peacock-900/40 p-3.5 transition hover:border-gold-500/30"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-white">{block.title}</span>
                            <span
                              className={`rounded px-1.5 py-0.2 text-[9px] font-bold uppercase ${
                                block.category === 'Study'
                                  ? 'bg-blue-500/20 text-blue-300'
                                  : 'bg-emerald-500/20 text-emerald-300'
                              }`}
                            >
                              {block.category}
                            </span>
                          </div>

                          {currentTask && (
                            <span className="text-[10px] text-peacock-400 mt-0.5 block">
                              Today’s status: <strong>{currentTask.status.replace('_', ' ')}</strong>
                            </span>
                          )}
                        </div>

                        {!isEditing ? (
                          <button
                            type="button"
                            onClick={() => startEditing(block)}
                            className="flex items-center space-x-1 rounded-lg border border-peacock-700/80 bg-peacock-950 px-2 py-1 text-[11px] text-peacock-300 hover:text-gold-300 hover:border-gold-500/40 transition"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>Edit Time</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => saveEditing(block.taskKey)}
                            className="flex items-center space-x-1 rounded-lg bg-gold-500 px-2.5 py-1 text-[11px] font-bold text-peacock-950 hover:bg-gold-400 transition"
                          >
                            <Check className="h-3 w-3" />
                            <span>Done</span>
                          </button>
                        )}
                      </div>

                      {/* Time Details Row */}
                      {!isEditing ? (
                        <div className="mt-3 flex items-center justify-between rounded-xl bg-peacock-950/70 p-2.5 border border-peacock-800/80">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-3.5 w-3.5 text-gold-400" />
                            <span className="text-xs font-mono font-bold text-peacock-100">
                              {block.plannedStartTime} – {block.plannedEndTime}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-peacock-400">
                            {block.targetDurationMinutes} mins
                          </span>
                        </div>
                      ) : (
                        <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-peacock-950 p-2.5 border border-gold-500/40 animate-in fade-in">
                          <div>
                            <label className="block text-[9px] text-peacock-400 font-semibold mb-0.5">Start</label>
                            <input
                              type="text"
                              value={editStartTime}
                              onChange={(e) => setEditStartTime(e.target.value)}
                              className="w-full rounded border border-peacock-700 bg-peacock-900 px-2 py-1 text-xs font-mono text-white focus:border-gold-400 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] text-peacock-400 font-semibold mb-0.5">End</label>
                            <input
                              type="text"
                              value={editEndTime}
                              onChange={(e) => setEditEndTime(e.target.value)}
                              className="w-full rounded border border-peacock-700 bg-peacock-900 px-2 py-1 text-xs font-mono text-white focus:border-gold-400 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] text-peacock-400 font-semibold mb-0.5">Minutes</label>
                            <input
                              type="number"
                              value={editDuration}
                              onChange={(e) => setEditDuration(Number(e.target.value))}
                              className="w-full rounded border border-peacock-700 bg-peacock-900 px-2 py-1 text-xs font-mono text-gold-300 font-bold focus:border-gold-400 focus:outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
