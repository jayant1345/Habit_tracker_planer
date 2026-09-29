'use client';

import React, { useState } from 'react';
import { EnglishDetails } from '@/types';
import { Mic, Star, Sparkles, AlertCircle, X, Check } from 'lucide-react';

interface EnglishSpeakingModalProps {
  isOpen: boolean;
  onClose: () => void;
  details?: EnglishDetails;
  onSave: (details: EnglishDetails, durationMinutes: number) => void;
}

export function EnglishSpeakingModal({ isOpen, onClose, details, onSave }: EnglishSpeakingModalProps) {
  const [duration, setDuration] = useState(details?.practiceDurationMinutes || 30);
  const [topic, setTopic] = useState(
    details?.topicSpokenAbout || 'Explaining Drug Regulatory Framework & Section 22 Inspection Rights'
  );
  const [confidence, setConfidence] = useState(details?.confidenceLevel || 4);
  const [fluency, setFluency] = useState(details?.fluency || 4);
  const [vocabInput, setVocabInput] = useState(
    details?.vocabularyLearned?.join(', ') || 'Adulterated, Spurious, Misbranded, Statutory compliance, Sub judice'
  );
  const [majorMistakes, setMajorMistakes] = useState(
    details?.majorMistakes || 'Pausing while searching for formal legal terms during hypothetical scenarios.'
  );
  const [improvement, setImprovement] = useState(
    details?.todayImprovement || 'More assertive cadence and clear structured articulation of answers.'
  );

  if (!isOpen) return null;

  const handleSave = () => {
    const vocabList = vocabInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onSave(
      {
        practiceDurationMinutes: Number(duration) || 30,
        topicSpokenAbout: topic.trim(),
        confidenceLevel: confidence,
        fluency,
        vocabularyLearned: vocabList,
        majorMistakes: majorMistakes.trim(),
        todayImprovement: improvement.trim(),
      },
      Number(duration) || 30
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-peacock-950/80 p-3 sm:p-4 backdrop-blur-md">
      <div className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl border border-gold-500/30 bg-peacock-900/95 p-4 sm:p-6 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95">
        <div className="flex-shrink-0 flex items-center justify-between border-b border-peacock-700/60 pb-3 sm:pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-peacock-700/40 text-gold-400 border border-gold-500/40">
              <Mic className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">English Speaking Practice</h2>
              <p className="text-[11px] text-peacock-300">UPSC Interview & Verbal Articulation</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-peacock-200 mb-1">
                Topic Spoken About
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. UPSC Mock Interview on Drug Adulteration"
                className="w-full rounded-xl border border-peacock-700 bg-peacock-950/80 px-3 py-2 text-xs text-white placeholder-peacock-500 focus:border-gold-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-peacock-200 mb-1">Duration (mins)</label>
              <input
                type="number"
                min="5"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full rounded-xl border border-peacock-700 bg-peacock-950/80 px-3 py-2 text-xs text-white focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Rating Scales: Confidence & Fluency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl border border-peacock-800 bg-peacock-950/60 p-3.5">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-peacock-200">Confidence Level</span>
                <span className="text-xs font-mono font-bold text-gold-400">{confidence} / 5</span>
              </div>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setConfidence(star)}
                    className="p-1 text-gold-400 hover:scale-110 transition"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        star <= confidence ? 'fill-gold-400 text-gold-400' : 'text-peacock-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-peacock-200">Fluency Level</span>
                <span className="text-xs font-mono font-bold text-feather-400">{fluency} / 5</span>
              </div>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFluency(star)}
                    className="p-1 text-feather-400 hover:scale-110 transition"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        star <= fluency ? 'fill-feather-400 text-feather-400' : 'text-peacock-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Vocabulary Learned */}
          <div>
            <label className="block text-xs font-semibold text-peacock-200 mb-1">
              Vocabulary & Key Phrases Learned (comma-separated)
            </label>
            <input
              type="text"
              value={vocabInput}
              onChange={(e) => setVocabInput(e.target.value)}
              placeholder="e.g. Substantive, Jurisprudence, Discretionary, Statutory"
              className="w-full rounded-xl border border-peacock-700 bg-peacock-950/80 px-3 py-2 text-xs text-white placeholder-peacock-500 focus:border-gold-400 focus:outline-none"
            />
          </div>

          {/* Major Mistakes */}
          <div>
            <label className="block text-xs font-semibold text-peacock-200 mb-1">Major Mistakes / Hesitations</label>
            <input
              type="text"
              value={majorMistakes}
              onChange={(e) => setMajorMistakes(e.target.value)}
              placeholder="e.g. Filler words ('um', 'you know'), grammar switches"
              className="w-full rounded-xl border border-peacock-700 bg-peacock-950/80 px-3 py-2 text-xs text-white placeholder-peacock-500 focus:border-gold-400 focus:outline-none"
            />
          </div>

          {/* Today's Improvement */}
          <div>
            <label className="block text-xs font-semibold text-peacock-200 mb-1">Today’s Notable Improvement</label>
            <textarea
              rows={2}
              value={improvement}
              onChange={(e) => setImprovement(e.target.value)}
              placeholder="What felt easier or smoother today?"
              className="w-full rounded-xl border border-peacock-700 bg-peacock-950/80 p-2.5 text-xs text-white placeholder-peacock-500 focus:border-gold-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end space-x-2 border-t border-peacock-700/60 pt-4">
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
            <span>Save English Practice</span>
          </button>
        </div>
      </div>
    </div>
  );
}
