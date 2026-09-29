'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Habit, HabitFrequency } from '@/types';
import {
  CheckCircle2,
  Plus,
  Flame,
  Calendar,
  Clock,
  Sparkles,
  Edit2,
  Trash2,
  BookOpen,
  Zap,
  Activity,
  Heart,
  Droplets,
  Filter,
} from 'lucide-react';
import { format, subDays, eachDayOfInterval } from 'date-fns';

const COLOR_OPTIONS = [
  { label: 'Royal Gold', hex: '#d4af37' },
  { label: 'Peacock Teal', hex: '#147694' },
  { label: 'Feather Emerald', hex: '#17b890' },
  { label: 'Royal Indigo', hex: '#5368e5' },
  { label: 'Cyan Shimmer', hex: '#3eb0cd' },
];

export function HabitTracker() {
  const {
    habits,
    habitLogs,
    toggleHabitCompletion,
    addHabit,
    updateHabit,
    deleteHabit,
    getHabitStats,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'pending' | 'completed'>('all');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [targetDays, setTargetDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [targetPerDay, setTargetPerDay] = useState(1);
  const [selectedColor, setSelectedColor] = useState('#d4af37');
  const [reminderTime, setReminderTime] = useState('08:00');

  const openAddModal = () => {
    setEditingHabit(null);
    setTitle('');
    setDescription('');
    setFrequency('daily');
    setTargetDays([0, 1, 2, 3, 4, 5, 6]);
    setTargetPerDay(1);
    setSelectedColor('#d4af37');
    setReminderTime('08:00');
    setIsModalOpen(true);
  };

  const openEditModal = (habit: Habit) => {
    setEditingHabit(habit);
    setTitle(habit.title);
    setDescription(habit.description || '');
    setFrequency(habit.frequency);
    setTargetDays(habit.target_days || [0, 1, 2, 3, 4, 5, 6]);
    setTargetPerDay(habit.target_per_day || 1);
    setSelectedColor(habit.color || '#d4af37');
    setReminderTime(habit.reminder_time || '08:00');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingHabit) {
      updateHabit(editingHabit.id, {
        title: title.trim(),
        description: description.trim(),
        frequency,
        target_days: targetDays,
        target_per_day: targetPerDay,
        color: selectedColor,
        reminder_time: reminderTime,
      });
    } else {
      addHabit({
        title: title.trim(),
        description: description.trim(),
        frequency,
        target_days: targetDays,
        target_per_day: targetPerDay,
        color: selectedColor,
        icon: 'check-circle',
        reminder_time: reminderTime,
      });
    }

    setIsModalOpen(false);
  };

  const toggleDaySelection = (dayIndex: number) => {
    if (targetDays.includes(dayIndex)) {
      if (targetDays.length > 1) {
        setTargetDays(targetDays.filter((d) => d !== dayIndex));
      }
    } else {
      setTargetDays([...targetDays, dayIndex].sort());
    }
  };

  // 7 Days list for mini streak cards
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date(),
  });

  const filteredHabits = habits.filter((h) => {
    const stats = getHabitStats(h);
    if (filterType === 'completed') return stats.isCompletedToday;
    if (filterType === 'pending') return !stats.isCompletedToday;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-gold-400" />
            <span>Habits & Momentum Streaks</span>
          </h2>
          <p className="text-xs text-peacock-300">
            Build unshakeable daily rituals with interactive streak tracking and visual heatmaps.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Filter Pills */}
          <div className="flex rounded-xl border border-peacock-800 bg-peacock-950 p-1">
            <button
              onClick={() => setFilterType('all')}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                filterType === 'all'
                  ? 'bg-peacock-800 text-gold-300 font-bold'
                  : 'text-peacock-400 hover:text-white'
              }`}
            >
              All ({habits.length})
            </button>
            <button
              onClick={() => setFilterType('pending')}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                filterType === 'pending'
                  ? 'bg-peacock-800 text-gold-300 font-bold'
                  : 'text-peacock-400 hover:text-white'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterType('completed')}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                filterType === 'completed'
                  ? 'bg-peacock-800 text-gold-300 font-bold'
                  : 'text-peacock-400 hover:text-white'
              }`}
            >
              Done Today
            </button>
          </div>

          {/* Add Habit Button */}
          <button
            onClick={openAddModal}
            className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-3.5 py-2 text-xs font-bold text-peacock-950 shadow-gold-sm hover:from-gold-400 hover:to-gold-500 transition"
          >
            <Plus className="h-4 w-4" />
            <span>New Habit</span>
          </button>
        </div>
      </div>

      {/* Habit List */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filteredHabits.map((habit) => {
          const stats = getHabitStats(habit);

          return (
            <div
              key={habit.id}
              className={`relative overflow-hidden rounded-2xl border transition backdrop-blur-md p-5 shadow-lg ${
                stats.isCompletedToday
                  ? 'border-gold-500/40 bg-peacock-900/60 shadow-gold-sm'
                  : 'border-peacock-800/90 bg-peacock-950/70 hover:border-peacock-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3.5">
                  {/* One-Click Big Check Button */}
                  <button
                    onClick={() => toggleHabitCompletion(habit.id)}
                    title="Click to check in habit for today"
                    className={`group mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${
                      stats.isCompletedToday
                        ? 'border-gold-400 bg-gold-500 text-peacock-950 shadow-gold-md scale-105'
                        : 'border-peacock-700 bg-peacock-900/80 text-peacock-400 hover:border-gold-400 hover:text-gold-400'
                    }`}
                  >
                    <CheckCircle2
                      className={`h-6 w-6 transition ${
                        stats.isCompletedToday ? 'stroke-[2.5]' : 'group-hover:scale-110'
                      }`}
                    />
                  </button>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: habit.color || '#d4af37' }}
                      />
                      <h3 className="text-sm font-bold text-white leading-snug">
                        {habit.title}
                      </h3>
                    </div>

                    {habit.description && (
                      <p className="mt-1 text-xs text-peacock-300 line-clamp-2">
                        {habit.description}
                      </p>
                    )}

                    {/* Tags & Time */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px]">
                      {habit.reminder_time && (
                        <span className="flex items-center space-x-1 rounded-md bg-peacock-900 px-2 py-0.5 text-peacock-300 border border-peacock-800">
                          <Clock className="h-3 w-3 text-gold-400" />
                          <span>{habit.reminder_time}</span>
                        </span>
                      )}
                      <span className="rounded-md bg-peacock-900 px-2 py-0.5 text-peacock-300 border border-peacock-800 capitalize">
                        {habit.frequency}
                      </span>
                      <span className="text-feather-400 font-medium">
                        30d rate: {stats.completionRate30Days}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Edit & Delete Action Menu */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(habit)}
                    title="Edit habit"
                    className="rounded-lg p-1.5 text-peacock-400 hover:bg-peacock-800 hover:text-white"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    title="Delete habit"
                    className="rounded-lg p-1.5 text-peacock-400 hover:bg-red-500/20 hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Streaks & 7-Day Mini Check-in Strip */}
              <div className="mt-4 flex items-center justify-between border-t border-peacock-800/80 pt-3">
                {/* Current & Best Streak Counter */}
                <div className="flex items-center space-x-3 text-xs">
                  <div className="flex items-center space-x-1 text-gold-300 font-bold">
                    <Flame className="h-4 w-4 fill-gold-400 text-gold-500" />
                    <span>{stats.currentStreak}d Streak</span>
                  </div>
                  <span className="text-peacock-400 text-[11px]">
                    Best: {stats.longestStreak}d
                  </span>
                </div>

                {/* Past 7 Days Dots */}
                <div className="flex items-center space-x-1">
                  {last7Days.map((d, i) => {
                    const dStr = format(d, 'yyyy-MM-dd');
                    const isDone = habitLogs.some(
                      (l) => l.habit_id === habit.id && l.completed_date === dStr
                    );
                    const isCurrentDay = i === 6;

                    return (
                      <button
                        key={i}
                        onClick={() => toggleHabitCompletion(habit.id, dStr)}
                        title={`${format(d, 'EEE, MMM d')}: ${isDone ? 'Completed' : 'Missed'} (Click to toggle)`}
                        className={`flex h-6 w-6 flex-col items-center justify-center rounded-md text-[9px] font-semibold transition ${
                          isDone
                            ? 'bg-gold-500 text-peacock-950 font-bold shadow-gold-sm'
                            : isCurrentDay
                            ? 'border border-dashed border-peacock-600 bg-peacock-900 text-peacock-400'
                            : 'bg-peacock-900/60 text-peacock-500 hover:bg-peacock-800'
                        }`}
                      >
                        {format(d, 'd')}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredHabits.length === 0 && (
        <div className="rounded-2xl border border-dashed border-peacock-800 p-12 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-gold-400" />
          <h3 className="mt-3 text-sm font-bold text-white">No habits in this filter</h3>
          <p className="mt-1 text-xs text-peacock-300">
            Create a new habit to start your momentum streak!
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 inline-flex items-center space-x-1.5 rounded-xl bg-gold-500 px-4 py-2 text-xs font-bold text-peacock-950"
          >
            <Plus className="h-4 w-4" />
            <span>Create First Habit</span>
          </button>
        </div>
      )}

      {/* Add / Edit Habit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-gold-500/40 bg-peacock-950 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gold-300 flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-gold-400" />
              <span>{editingHabit ? 'Edit Habit Ritual' : 'Create New Habit Ritual'}</span>
            </h3>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-peacock-200">
                  Habit Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Read 25 Pages of Deep Literature"
                  className="mt-1 w-full rounded-lg border border-peacock-700 bg-peacock-900/80 px-3 py-2 text-xs text-white placeholder-peacock-500 focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-peacock-200">
                  Description / Intention
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Focus on conceptual understanding without phone notifications."
                  className="mt-1 w-full rounded-lg border border-peacock-700 bg-peacock-900/80 px-3 py-2 text-xs text-white placeholder-peacock-500 focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-peacock-200">
                    Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
                    className="mt-1 w-full rounded-lg border border-peacock-700 bg-peacock-900 px-3 py-2 text-xs text-white focus:border-gold-400 focus:outline-none"
                  >
                    <option value="daily">Everyday</option>
                    <option value="weekdays">Weekdays Only (Mon-Fri)</option>
                    <option value="custom">Custom Days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-peacock-200">
                    Reminder Time
                  </label>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-peacock-700 bg-peacock-900 px-3 py-2 text-xs text-white focus:border-gold-400 focus:outline-none"
                  />
                </div>
              </div>

              {frequency === 'custom' && (
                <div>
                  <label className="block text-xs font-semibold text-peacock-200 mb-1.5">
                    Target Days of Week
                  </label>
                  <div className="flex gap-1.5">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, idx) => {
                      const isSelected = targetDays.includes(idx);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleDaySelection(idx)}
                          className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                            isSelected
                              ? 'bg-gold-500 text-peacock-950 font-bold'
                              : 'bg-peacock-900 text-peacock-400 border border-peacock-800'
                          }`}
                        >
                          {dayName}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Color Picker */}
              <div>
                <label className="block text-xs font-semibold text-peacock-200 mb-1.5">
                  Badge Color
                </label>
                <div className="flex gap-3">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setSelectedColor(c.hex)}
                      className={`flex h-7 w-7 items-center justify-center rounded-full transition ${
                        selectedColor === c.hex ? 'ring-2 ring-gold-400 ring-offset-2 ring-offset-peacock-950 scale-110' : ''
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-2 pt-2 border-t border-peacock-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-peacock-800 px-3.5 py-2 text-xs font-medium text-peacock-300 hover:bg-peacock-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 px-4 py-2 text-xs font-bold text-peacock-950 shadow-gold-sm hover:from-gold-400 hover:to-gold-500"
                >
                  {editingHabit ? 'Save Changes' : 'Create Habit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
