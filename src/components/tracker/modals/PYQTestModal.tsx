'use client';

import React, { useState } from 'react';
import { PYQTestDetails } from '@/types';
import { Award, BookOpen, Clock, CheckCircle2, XCircle, AlertCircle, X, Check } from 'lucide-react';

interface PYQTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  details?: PYQTestDetails;
  onSave: (details: PYQTestDetails, timeTakenMinutes: number) => void;
}

const UPSC_SUBJECTS = [
  'Pharmacology & Therapeutics',
  'Pharmaceutics & Biopharmaceutics',
  'Pharmaceutical Analysis & Quality Assurance',
  'Drugs & Cosmetics Act 1940 & Jurisprudence',
  'Pharmacognosy & Phytochemistry',
  'Pharmaceutical Microbiology & Biotechnology',
  'Biochemistry & Clinical Pathology',
  'Hospital & Clinical Pharmacy',
  'General Science & Aptitude',
];

export function PYQTestModal({ isOpen, onClose, details, onSave }: PYQTestModalProps) {
  const [testName, setTestName] = useState(details?.testName || 'UPSC DI Previous Paper (Pharmacology)');
  const [subject, setSubject] = useState(details?.subject || 'Pharmacology & Therapeutics');
  const [numberOfQuestions, setNumberOfQuestions] = useState(details?.numberOfQuestions || 50);
  const [attempted, setAttempted] = useState(details?.attempted || 45);
  const [correct, setCorrect] = useState(details?.correct || 38);
  const [wrong, setWrong] = useState(details?.wrong || 7);
  const [timeTaken, setTimeTaken] = useState(details?.timeTakenMinutes || 80);
  const [mistakesAnalyzed, setMistakesAnalyzed] = useState(details?.mistakesAnalyzed ?? true);

  if (!isOpen) return null;

  // Auto calculate accuracy %
  const calculatedAccuracy = attempted > 0 ? parseFloat(((correct / attempted) * 100).toFixed(1)) : 0;
  // Calculate standard UPSC score (e.g. +2 for correct, -0.66 for wrong, or percentage)
  const calculatedScore = Math.max(0, Math.round(((correct - wrong * 0.33) / (numberOfQuestions || 50)) * 100));

  const handleCorrectChange = (val: number) => {
    setCorrect(val);
    const newWrong = Math.max(0, attempted - val);
    setWrong(newWrong);
  };

  const handleAttemptedChange = (val: number) => {
    setAttempted(val);
    if (val < correct) {
      setCorrect(val);
      setWrong(0);
    } else {
      setWrong(val - correct);
    }
  };

  const handleSave = () => {
    onSave(
      {
        testName: testName.trim(),
        subject,
        numberOfQuestions: Number(numberOfQuestions) || 50,
        attempted: Number(attempted) || 0,
        correct: Number(correct) || 0,
        wrong: Number(wrong) || 0,
        score: calculatedScore,
        accuracy: calculatedAccuracy,
        timeTakenMinutes: Number(timeTaken) || 0,
        mistakesAnalyzed,
      },
      Number(timeTaken) || 80
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-peacock-950/80 p-3 sm:p-4 backdrop-blur-md">
      <div className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl border border-gold-500/30 bg-peacock-900/95 p-4 sm:p-6 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95">
        <div className="flex-shrink-0 flex items-center justify-between border-b border-peacock-700/60 pb-3 sm:pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-500/20 text-gold-400 border border-gold-500/40">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">PYQ Test Tracking</h2>
              <p className="text-[11px] text-peacock-300">UPSC Drug Inspector Exam Diagnostic</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-peacock-400 hover:bg-peacock-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 flex-1 overflow-y-auto pr-1">
          {/* Test Name & Subject */}
          <div>
            <label className="block text-xs font-semibold text-peacock-200 mb-1">Test Name / Paper #</label>
            <input
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="e.g. UPSC DI 2021 Paper 1 Mock 04"
              className="w-full rounded-xl border border-peacock-700 bg-peacock-950/80 px-3 py-2 text-xs text-white placeholder-peacock-500 focus:border-gold-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-peacock-200 mb-1">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border border-peacock-700 bg-peacock-950/80 px-3 py-2 text-xs text-white focus:border-gold-400 focus:outline-none"
            >
              {UPSC_SUBJECTS.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Quantitative Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="rounded-xl border border-peacock-800 bg-peacock-950/60 p-2.5">
              <span className="text-[10px] font-medium text-peacock-400">Total Qs</span>
              <input
                type="number"
                min="1"
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                className="mt-1 w-full bg-transparent text-base font-bold text-white focus:outline-none"
              />
            </div>
            <div className="rounded-xl border border-peacock-800 bg-peacock-950/60 p-2.5">
              <span className="text-[10px] font-medium text-peacock-400">Attempted</span>
              <input
                type="number"
                min="0"
                max={numberOfQuestions}
                value={attempted}
                onChange={(e) => handleAttemptedChange(Number(e.target.value))}
                className="mt-1 w-full bg-transparent text-base font-bold text-gold-300 focus:outline-none"
              />
            </div>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5">
              <span className="text-[10px] font-medium text-emerald-400">Correct</span>
              <input
                type="number"
                min="0"
                max={attempted}
                value={correct}
                onChange={(e) => handleCorrectChange(Number(e.target.value))}
                className="mt-1 w-full bg-transparent text-base font-bold text-emerald-300 focus:outline-none"
              />
            </div>
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-2.5">
              <span className="text-[10px] font-medium text-red-400">Wrong</span>
              <input
                type="number"
                min="0"
                value={wrong}
                onChange={(e) => setWrong(Number(e.target.value))}
                className="mt-1 w-full bg-transparent text-base font-bold text-red-300 focus:outline-none"
              />
            </div>
          </div>

          {/* Auto Calculated Highlight Cards */}
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-gold-500/30 bg-gold-500/10 p-3.5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gold-400">Calculated Accuracy</p>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-2xl font-extrabold text-white">{calculatedAccuracy}%</span>
                <span className="text-[10px] text-peacock-300">({correct}/{attempted})</span>
              </div>
              <div className="w-full bg-peacock-900 rounded-full h-1.5 mt-1 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    calculatedAccuracy >= 80 ? 'bg-emerald-400' : calculatedAccuracy >= 65 ? 'bg-gold-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${Math.min(100, calculatedAccuracy)}%` }}
                />
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gold-400">Net Estimated Score</p>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-2xl font-extrabold text-white">{calculatedScore}</span>
                <span className="text-[10px] text-peacock-300">/ 100</span>
              </div>
              <p className="text-[10px] text-gold-300 mt-1">UPSC negative marking weighted</p>
            </div>
          </div>

          {/* Time Taken & Mistakes Analyzed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-peacock-200 mb-1 flex items-center space-x-1">
                <Clock className="h-3 w-3 text-gold-400" />
                <span>Time Taken (minutes)</span>
              </label>
              <input
                type="number"
                min="5"
                value={timeTaken}
                onChange={(e) => setTimeTaken(Number(e.target.value))}
                className="w-full rounded-xl border border-peacock-700 bg-peacock-950/80 px-3 py-2 text-xs text-white focus:border-gold-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="block text-xs font-semibold text-peacock-200 mb-1">Mistakes Analyzed?</label>
              <button
                type="button"
                onClick={() => setMistakesAnalyzed(!mistakesAnalyzed)}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold border transition ${
                  mistakesAnalyzed
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-peacock-950/80 text-peacock-400 border-peacock-700'
                }`}
              >
                <span>{mistakesAnalyzed ? '✅ Yes, Analyzed' : '❌ Not Analyzed Yet'}</span>
                {mistakesAnalyzed ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <XCircle className="h-4 w-4 text-peacock-500" />}
              </button>
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
            <span>Save PYQ Test</span>
          </button>
        </div>
      </div>
    </div>
  );
}
