'use client';

import React, { useState } from 'react';
import { MissedReason } from '@/types';
import { MISSED_REASONS } from '@/lib/upscTracker';
import { AlertOctagon, HelpCircle, X, Check } from 'lucide-react';

interface MissedReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskTitle: string;
  initialReason?: MissedReason;
  initialNotes?: string;
  onSave: (reason: MissedReason, notes: string) => void;
}

export function MissedReasonModal({
  isOpen,
  onClose,
  taskTitle,
  initialReason = 'Lack of time',
  initialNotes = '',
  onSave,
}: MissedReasonModalProps) {
  const [selectedReason, setSelectedReason] = useState<MissedReason>(initialReason);
  const [notes, setNotes] = useState(initialNotes);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(selectedReason, notes.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-peacock-950/80 p-3 sm:p-4 backdrop-blur-md">
      <div className="w-full max-w-md max-h-[90vh] flex flex-col rounded-3xl border border-red-500/40 bg-peacock-900/95 p-4 sm:p-6 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95">
        <div className="flex-shrink-0 flex items-center justify-between border-b border-peacock-700/60 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/20 text-red-400 border border-red-500/40">
              <AlertOctagon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Missed Task Audit</h2>
              <p className="text-[11px] text-peacock-300 max-w-[240px] truncate">{taskTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-peacock-400 hover:bg-peacock-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-3 flex-1 overflow-y-auto pr-1 space-y-3">
          <label className="block text-xs font-semibold text-peacock-200">
            Select Root Cause:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {MISSED_REASONS.map((r) => {
              const isSelected = selectedReason === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedReason(r)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold border text-left transition ${
                    isSelected
                      ? 'bg-red-500/20 text-red-200 border-red-500/60 shadow-sm'
                      : 'bg-peacock-950/60 text-peacock-300 border-peacock-800 hover:bg-peacock-800/60'
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-semibold text-peacock-200 mb-1">
              Corrective Action / Specific Context (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What specifically happened and how will I avoid this tomorrow?"
              className="w-full rounded-xl border border-peacock-700 bg-peacock-950/80 p-2.5 text-xs text-white placeholder-peacock-500 focus:border-red-400 focus:outline-none"
            />
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
            className="flex items-center space-x-1.5 rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-red-500 transition"
          >
            <Check className="h-4 w-4" />
            <span>Record Missed Reason</span>
          </button>
        </div>
      </div>
    </div>
  );
}
