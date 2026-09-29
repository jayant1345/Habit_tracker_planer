'use client';

import React, { useState } from 'react';
import { DecodeDetails } from '@/types';
import { GitBranch, BookOpen, FileCheck, RotateCcw, X, Check, Link2 } from 'lucide-react';

interface DecodeTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  details?: DecodeDetails;
  currentPyqSubject?: string;
  onSave: (details: DecodeDetails) => void;
}

export function DecodeTopicModal({
  isOpen,
  onClose,
  details,
  currentPyqSubject = 'Pharmacology',
  onSave,
}: DecodeTopicModalProps) {
  const [subject, setSubject] = useState(details?.subject || currentPyqSubject);
  const [topic, setTopic] = useState(
    details?.topic || 'Autonomic Nervous System & Adrenergic Receptor Pharmacology'
  );
  const [topicCompleted, setTopicCompleted] = useState(details?.topicCompleted ?? true);
  const [importantPoints, setImportantPoints] = useState(
    details?.importantPointsExtracted ||
      'Extracted: Alpha-1, Alpha-2, Beta-1, Beta-2 selective agonists vs non-selective blockers. Contraindications in asthma & peripheral vascular diseases.'
  );
  const [notesUpdated, setNotesUpdated] = useState(details?.notesUpdated ?? true);
  const [revisionRequired, setRevisionRequired] = useState(details?.revisionRequired ?? false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      subject,
      topic: topic.trim(),
      topicCompleted,
      importantPointsExtracted: importantPoints.trim(),
      notesUpdated,
      revisionRequired,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-peacock-950/80 p-3 sm:p-4 backdrop-blur-md">
      <div className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl border border-gold-500/30 bg-peacock-900/95 p-4 sm:p-6 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95">
        <div className="flex-shrink-0 flex items-center justify-between border-b border-peacock-700/60 pb-3 sm:pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-royal-800/40 text-royal-300 border border-royal-600/40">
              <GitBranch className="h-5 w-5 text-gold-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">1 Same Topic from Decode</h2>
              <p className="text-[11px] text-peacock-300">Connected Directly to PYQ Work</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-peacock-400 hover:bg-peacock-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto pr-1 space-y-4">
          {/* Accountability Connection Banner */}
          <div className="flex items-start space-x-2.5 rounded-xl border border-gold-500/40 bg-gold-500/10 p-3 text-[11px] text-peacock-200">
            <Link2 className="h-4 w-4 text-gold-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gold-300">UPSC DI Synergy Rule:</span> Study the <span className="underline decoration-gold-400 font-semibold">same topic from Decode</span> that connects directly to today’s PYQ test ({currentPyqSubject}), eliminating random study drift!
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-peacock-200 mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Pharmacology, Pharmaceutics, DCA"
              className="w-full rounded-xl border border-peacock-700 bg-peacock-950/80 px-3 py-2 text-xs text-white placeholder-peacock-500 focus:border-gold-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-peacock-200 mb-1">Specific Topic Studied</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Adrenergic receptors, Dissolution apparatus, Schedule M"
              className="w-full rounded-xl border border-peacock-700 bg-peacock-950/80 px-3 py-2 text-xs text-white placeholder-peacock-500 focus:border-gold-400 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-peacock-200">
                Important Points & Exceptions Extracted
              </label>
              <span className="text-[10px] text-peacock-400">High-yield exam notes</span>
            </div>
            <textarea
              rows={4}
              value={importantPoints}
              onChange={(e) => setImportantPoints(e.target.value)}
              placeholder="Record key mechanisms, exceptions, formulas, or statutory schedules..."
              className="w-full rounded-xl border border-peacock-700 bg-peacock-950/80 p-3 text-xs text-white placeholder-peacock-500 focus:border-gold-400 focus:outline-none"
            />
          </div>

          {/* Status & Flags */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setTopicCompleted(!topicCompleted)}
              className={`rounded-xl p-2.5 text-xs font-semibold border text-center transition ${
                topicCompleted
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-peacock-950/80 text-peacock-400 border-peacock-800'
              }`}
            >
              <span className="block text-[10px] text-peacock-400 uppercase">Topic Status</span>
              <span className="mt-1 block font-bold">{topicCompleted ? '✅ Completed' : '⏳ In Progress'}</span>
            </button>

            <button
              type="button"
              onClick={() => setNotesUpdated(!notesUpdated)}
              className={`rounded-xl p-2.5 text-xs font-semibold border text-center transition ${
                notesUpdated
                  ? 'bg-peacock-800/80 text-gold-300 border-gold-500/40'
                  : 'bg-peacock-950/80 text-peacock-400 border-peacock-800'
              }`}
            >
              <span className="block text-[10px] text-peacock-400 uppercase">Notes Updated?</span>
              <span className="mt-1 block font-bold">{notesUpdated ? '✅ Notes Synced' : '❌ Not Updated'}</span>
            </button>

            <button
              type="button"
              onClick={() => setRevisionRequired(!revisionRequired)}
              className={`rounded-xl p-2.5 text-xs font-semibold border text-center transition ${
                revisionRequired
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-peacock-950/80 text-peacock-400 border-peacock-800'
              }`}
            >
              <span className="block text-[10px] text-peacock-400 uppercase">Revision Need</span>
              <span className="mt-1 block font-bold">{revisionRequired ? '🚩 Needs Revision' : 'Clear'}</span>
            </button>
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
            <span>Save Decode Topic</span>
          </button>
        </div>
      </div>
    </div>
  );
}
