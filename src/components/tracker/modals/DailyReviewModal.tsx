'use client';

import React, { useState } from 'react';
import { ReviewDetails, DailyTaskItem } from '@/types';
import { Moon, Sparkles, Check, X, Wand2, Clock, ThumbsUp } from 'lucide-react';

interface DailyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review?: ReviewDetails;
  todayTasks?: DailyTaskItem[];
  onSave: (review: ReviewDetails) => void;
}

export function DailyReviewModal({
  isOpen,
  onClose,
  review,
  todayTasks = [],
  onSave,
}: DailyReviewModalProps) {
  const [completedSummary, setCompletedSummary] = useState(
    review?.completedSummary || ''
  );
  const [missedSummary, setMissedSummary] = useState(review?.missedSummary || '');
  const [missedReason, setMissedReason] = useState(review?.missedReason || '');
  const [biggestDistraction, setBiggestDistraction] = useState(
    review?.biggestDistraction || ''
  );
  const [learnedToday, setLearnedToday] = useState(review?.learnedToday || '');
  const [improveTomorrow, setImproveTomorrow] = useState(
    review?.improveTomorrow || ''
  );
  const [proudOf, setProudOf] = useState(review?.proudOf || '');
  const [tomorrowPriority, setTomorrowPriority] = useState(
    review?.tomorrowPriority || ''
  );
  const [minutesSpent, setMinutesSpent] = useState(review?.minutesSpent || 20);

  if (!isOpen) return null;

  // Auto populate helper
  const handleAutoPopulate = () => {
    const completedList = todayTasks
      .filter((t) => t.status === 'completed')
      .map((t) => t.title);
    const missedList = todayTasks.filter((t) => t.status === 'missed');

    if (completedList.length > 0) {
      setCompletedSummary(`Executed: ${completedList.join(', ')}.`);
    } else {
      setCompletedSummary('Still in progress for today.');
    }

    if (missedList.length > 0) {
      setMissedSummary(
        `Missed: ${missedList.map((m) => `${m.title} (${m.missedReason || 'Unspecified'})`).join(', ')}.`
      );
      setMissedReason(
        missedList.map((m) => `${m.title}: ${m.missedReason || 'Needs better planning'}`).join('; ')
      );
    } else {
      setMissedSummary('Zero core tasks missed today! 100% execution discipline.');
      setMissedReason('None — adhered tightly to planned time blocks.');
    }
  };

  const handleSave = () => {
    onSave({
      completedSummary: completedSummary.trim() || 'Executed scheduled study and fitness habits.',
      missedSummary: missedSummary.trim() || 'None',
      missedReason: missedReason.trim() || 'None',
      biggestDistraction: biggestDistraction.trim() || 'None reported.',
      learnedToday: learnedToday.trim() || 'Solid conceptual progress made.',
      improveTomorrow: improveTomorrow.trim() || 'Maintain early morning focus momentum.',
      proudOf: proudOf.trim() || 'Maintained daily accountability streak.',
      tomorrowPriority: tomorrowPriority.trim() || 'Solve next PYQ mock paper.',
      minutesSpent: Number(minutesSpent) || 20,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-peacock-950/80 p-3 sm:p-4 backdrop-blur-md">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-gold-500/30 bg-peacock-900/95 p-4 sm:p-6 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95">
        <div className="flex-shrink-0 flex items-center justify-between border-b border-peacock-700/60 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-500/20 text-gold-400 border border-gold-500/40">
              <Moon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Nightly Accountability Review</h2>
              <p className="text-[11px] text-peacock-300">
                “Did I actually execute today’s plan?” (2–5 Minutes Audit)
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleAutoPopulate}
              className="flex items-center space-x-1 rounded-lg border border-gold-500/40 bg-peacock-950 px-2.5 py-1 text-[11px] font-semibold text-gold-300 hover:bg-gold-500/10 transition"
              title="Auto-fill completed and missed tasks from today's logs"
            >
              <Wand2 className="h-3.5 w-3.5" />
              <span>Auto-Draft</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-peacock-400 hover:bg-peacock-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-3.5 flex-1 overflow-y-auto pr-1">
          {/* Question 1 */}
          <div>
            <label className="block text-xs font-semibold text-peacock-200 mb-1">
              1. What did I complete today?
            </label>
            <textarea
              rows={2}
              value={completedSummary}
              onChange={(e) => setCompletedSummary(e.target.value)}
              placeholder="e.g. PYQ Test on Pharmacology (85% acc), Decode topic, 30m walk, Vipassana..."
              className="w-full rounded-xl border border-peacock-700 bg-peacock-950/80 p-2.5 text-xs text-white placeholder-peacock-500 focus:border-gold-400 focus:outline-none"
            />
          </div>

          {/* Question 2 & 3 in grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-peacock-200 mb-1">
                2. What did I miss?
              </label>
              <input
                type="text"
                value={missedSummary}
                onChange={(e) => setMissedSummary(e.target.value)}
                placeholder="e.g. Missed evening marathon block / None"
                className="w-full rounded-xl border border-peacock-700 bg-peacock-950/80 px-3 py-2 text-xs text-white placeholder-peacock-500 focus:border-gold-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-peacock-200 mb-1">
                3. Why did I miss it?
              </label>
              <input
                type="text"
                value={missedReason}
                onChange={(e) => setMissedReason(e.target.value)}
                placeholder="e.g. Poor planning between lunch & afternoon block"
                className="w-full rounded-xl border border-peacock-700 bg-peacock-950/80 px-3 py-2 text-xs text-white placeholder-peacock-500 focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Question 4 & 5 in grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-peacock-200 mb-1">
                4. What was my biggest distraction?
              </label>
              <input
                type="text"
                value={biggestDistraction}
                onChange={(e) => setBiggestDistraction(e.target.value)}
                placeholder="e.g. Social media check during 4:00 PM tea break"
                className="w-full rounded-xl border border-peacock-700 bg-peacock-950/80 px-3 py-2 text-xs text-white placeholder-peacock-500 focus:border-gold-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-peacock-200 mb-1">
                5. What did I learn today?
              </label>
              <input
                type="text"
                value={learnedToday}
                onChange={(e) => setLearnedToday(e.target.value)}
                placeholder="e.g. Exception rule for Schedule M validation audits"
                className="w-full rounded-xl border border-peacock-700 bg-peacock-950/80 px-3 py-2 text-xs text-white placeholder-peacock-500 focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Question 6 & 7 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-peacock-200 mb-1">
                6. What should I improve tomorrow?
              </label>
              <input
                type="text"
                value={improveTomorrow}
                onChange={(e) => setImproveTomorrow(e.target.value)}
                placeholder="e.g. Turn phone to Do-Not-Disturb before 9 AM"
                className="w-full rounded-xl border border-peacock-700 bg-peacock-950/80 px-3 py-2 text-xs text-white placeholder-peacock-500 focus:border-gold-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-peacock-200 mb-1 flex items-center space-x-1">
                <ThumbsUp className="h-3 w-3 text-gold-400" />
                <span>7. One thing I am proud of today</span>
              </label>
              <input
                type="text"
                value={proudOf}
                onChange={(e) => setProudOf(e.target.value)}
                placeholder="e.g. Sat through full 45m Vipassana and scored 88% in PYQ"
                className="w-full rounded-xl border border-peacock-700 bg-peacock-950/80 px-3 py-2 text-xs text-white placeholder-peacock-500 focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Tomorrow Priority & Time Spent */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl border border-peacock-800 bg-peacock-950/60 p-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gold-400 mb-1">
                Tomorrow’s #1 Priority Task:
              </label>
              <input
                type="text"
                value={tomorrowPriority}
                onChange={(e) => setTomorrowPriority(e.target.value)}
                placeholder="e.g. Complete 60 PYQs in Pharmaceutics + Schedule H1 revision"
                className="w-full rounded-xl border border-peacock-700 bg-peacock-900 px-3 py-2 text-xs text-white placeholder-peacock-500 focus:border-gold-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-peacock-200 mb-1">Audit Time (mins)</label>
              <input
                type="number"
                min="5"
                value={minutesSpent}
                onChange={(e) => setMinutesSpent(Number(e.target.value))}
                className="w-full rounded-xl border border-peacock-700 bg-peacock-900 px-3 py-2 text-xs text-white focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex-shrink-0 flex items-center justify-end space-x-2 border-t border-peacock-700/60 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-peacock-300 hover:bg-peacock-800 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-gold-500 via-gold-600 to-gold-700 px-5 py-2 text-xs font-bold text-peacock-950 shadow-gold-sm hover:brightness-110 transition"
          >
            <Check className="h-4 w-4" />
            <span>Complete & Log Daily Review</span>
          </button>
        </div>
      </div>
    </div>
  );
}
