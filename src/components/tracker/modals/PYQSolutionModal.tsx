'use client';

import React, { useState } from 'react';
import { PYQSolutionDetails } from '@/types';
import { Search, Brain, AlertTriangle, FileEdit, RotateCcw, X, Check, CheckCircle2 } from 'lucide-react';

interface PYQSolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  details?: PYQSolutionDetails;
  onSave: (details: PYQSolutionDetails) => void;
}

export function PYQSolutionModal({ isOpen, onClose, details, onSave }: PYQSolutionModalProps) {
  const [questionsAnalyzed, setQuestionsAnalyzed] = useState(details?.questionsAnalyzed || 12);
  const [wrongQuestions, setWrongQuestions] = useState(details?.wrongQuestions || 7);
  const [conceptualMistakes, setConceptualMistakes] = useState(details?.conceptualMistakes || 4);
  const [sillyMistakes, setSillyMistakes] = useState(details?.sillyMistakes || 2);
  const [knowledgeGaps, setKnowledgeGaps] = useState(details?.knowledgeGaps || 1);
  const [notesUpdated, setNotesUpdated] = useState(details?.notesUpdated ?? true);
  const [revisionRequired, setRevisionRequired] = useState(details?.revisionRequired ?? true);

  if (!isOpen) return null;

  const totalCategorized = conceptualMistakes + sillyMistakes + knowledgeGaps;

  const handleSave = () => {
    onSave({
      questionsAnalyzed: Number(questionsAnalyzed) || 0,
      wrongQuestions: Number(wrongQuestions) || 0,
      conceptualMistakes: Number(conceptualMistakes) || 0,
      sillyMistakes: Number(sillyMistakes) || 0,
      knowledgeGaps: Number(knowledgeGaps) || 0,
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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-peacock-600/20 text-feather-300 border border-feather-500/40">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">PYQ Solution Analysis</h2>
              <p className="text-[11px] text-peacock-300">Root-Cause Error Taxonomy</p>
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
          {/* Guidance Callout */}
          <div className="rounded-xl border border-feather-500/30 bg-feather-900/20 p-3 text-[11px] text-peacock-200">
            <span className="font-bold text-gold-400">Accountability Rule:</span> The purpose is not simply completing the PYQ solution. Identify <span className="underline decoration-gold-400">why you got questions wrong</span> to prevent repeating them on exam day.
          </div>
          {/* Questions Counters */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-peacock-800 bg-peacock-950/70 p-3">
              <label className="block text-[11px] font-semibold text-peacock-300 mb-1">
                Questions Analyzed
              </label>
              <input
                type="number"
                min="0"
                value={questionsAnalyzed}
                onChange={(e) => setQuestionsAnalyzed(Number(e.target.value))}
                className="w-full bg-transparent text-xl font-extrabold text-white focus:outline-none"
              />
              <span className="text-[10px] text-peacock-400">Total deep-dive questions</span>
            </div>

            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
              <label className="block text-[11px] font-semibold text-red-300 mb-1">
                Wrong Questions Identified
              </label>
              <input
                type="number"
                min="0"
                value={wrongQuestions}
                onChange={(e) => setWrongQuestions(Number(e.target.value))}
                className="w-full bg-transparent text-xl font-extrabold text-red-300 focus:outline-none"
              />
              <span className="text-[10px] text-red-400">Questions needing error breakdown</span>
            </div>
          </div>

          {/* Root-Cause Classification */}
          <div>
            <h3 className="text-xs font-bold text-gold-300 uppercase tracking-wider mb-2 flex items-center space-x-1">
              <Brain className="h-3.5 w-3.5" />
              <span>Why Did I Get Questions Wrong? (Error Categorization)</span>
            </h3>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                <span className="text-[10px] font-bold text-amber-300 block">Conceptual Mistakes</span>
                <input
                  type="number"
                  min="0"
                  value={conceptualMistakes}
                  onChange={(e) => setConceptualMistakes(Number(e.target.value))}
                  className="mt-1 w-full bg-transparent text-lg font-extrabold text-amber-200 focus:outline-none"
                />
                <span className="text-[9px] text-amber-300/80">Flawed mechanism/logic</span>
              </div>

              <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-3">
                <span className="text-[10px] font-bold text-purple-300 block">Silly Mistakes</span>
                <input
                  type="number"
                  min="0"
                  value={sillyMistakes}
                  onChange={(e) => setSillyMistakes(Number(e.target.value))}
                  className="mt-1 w-full bg-transparent text-lg font-extrabold text-purple-200 focus:outline-none"
                />
                <span className="text-[9px] text-purple-300/80">Misread / calculation</span>
              </div>

              <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3">
                <span className="text-[10px] font-bold text-blue-300 block">Knowledge Gaps</span>
                <input
                  type="number"
                  min="0"
                  value={knowledgeGaps}
                  onChange={(e) => setKnowledgeGaps(Number(e.target.value))}
                  className="mt-1 w-full bg-transparent text-lg font-extrabold text-blue-200 focus:outline-none"
                />
                <span className="text-[9px] text-blue-300/80">Never studied / missing</span>
              </div>
            </div>

            {/* Error Distribution Bar */}
            {totalCategorized > 0 && (
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-peacock-300 mb-1">
                  <span>Error Distribution</span>
                  <span>{totalCategorized} errors categorized</span>
                </div>
                <div className="flex h-2 w-full overflow-hidden rounded-full bg-peacock-950">
                  <div
                    style={{ width: `${(conceptualMistakes / totalCategorized) * 100}%` }}
                    className="bg-amber-400"
                    title="Conceptual"
                  />
                  <div
                    style={{ width: `${(sillyMistakes / totalCategorized) * 100}%` }}
                    className="bg-purple-400"
                    title="Silly"
                  />
                  <div
                    style={{ width: `${(knowledgeGaps / totalCategorized) * 100}%` }}
                    className="bg-blue-400"
                    title="Knowledge Gaps"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Follow-up Action Checkboxes */}
          <div className="space-y-2 border-t border-peacock-800/80 pt-3">
            <button
              type="button"
              onClick={() => setNotesUpdated(!notesUpdated)}
              className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold border transition ${
                notesUpdated
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-peacock-950/70 text-peacock-400 border-peacock-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileEdit className="h-4 w-4" />
                <span>Notes Updated with Corrections?</span>
              </div>
              <span>{notesUpdated ? '✅ Notes Updated' : '❌ Not Yet'}</span>
            </button>

            <button
              type="button"
              onClick={() => setRevisionRequired(!revisionRequired)}
              className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold border transition ${
                revisionRequired
                  ? 'bg-gold-500/20 text-gold-300 border-gold-500/40'
                  : 'bg-peacock-950/70 text-peacock-400 border-peacock-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-4 w-4" />
                <span>Revision Flag Required for this Topic?</span>
              </div>
              <span>{revisionRequired ? '🚩 Flagged for Revision' : 'Clear'}</span>
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
            className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-peacock-600 via-peacock-700 to-royal-800 px-5 py-2 text-xs font-bold text-white shadow-gold-sm hover:brightness-110 transition border border-gold-500/40"
          >
            <Check className="h-4 w-4 text-gold-400" />
            <span>Save Solution Analysis</span>
          </button>
        </div>
      </div>
    </div>
  );
}
