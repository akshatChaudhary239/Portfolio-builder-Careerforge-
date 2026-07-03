'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronRight, Check, MessageSquare, Shield, Users, Sparkles, Lock, BookOpen } from 'lucide-react';
import { InterviewQuestion } from '@/db/local-db';

interface PremiumInterviewPrepProps {
  questions: InterviewQuestion[];
  hasPremium?: boolean;
  onUpgradeClick?: () => void;
}

export function PremiumInterviewPrep({ questions, hasPremium = false, onUpgradeClick }: PremiumInterviewPrepProps) {
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 no-print"
    >
      <div className="bg-white border border-warm-border rounded-2xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 border-r border-warm-border pr-6 space-y-4">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-accent-amber/10 flex items-center justify-center text-accent-amber border border-accent-amber/20">
              <Brain size={16} />
            </div>
            <h1 className="text-xl font-serif font-bold text-primary flex items-center gap-2">
              <span>Interview Kit</span>
              {!hasPremium && (
                <span className="bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Preview
                </span>
              )}
            </h1>
          </div>
          
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setActiveQuestionId(q.id)}
                className={`w-full text-left p-3 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  activeQuestionId === q.id 
                    ? 'bg-brand/5 border-brand/30 text-brand shadow-sm'
                    : 'bg-warm-bg border-transparent text-primary hover:bg-warm-border/50'
                }`}
              >
                <span className="opacity-50 mr-1.5">{idx + 1}.</span> 
                <span className="line-clamp-2">{q.question}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="md:w-2/3">
          {activeQuestionId ? (() => {
            const q = questions.find(x => x.id === activeQuestionId);
            if (!q) return null;
            return (
              <AnimatePresence mode="wait">
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="inline-block px-2 py-1 rounded bg-warm-border text-[9px] font-bold text-primary-light uppercase tracking-wider mb-3">
                      {q.type} • {q.contextRef}
                    </span>
                    <h2 className="text-lg md:text-xl font-bold text-primary leading-snug">
                      {q.question}
                    </h2>
                  </div>

                  {hasPremium ? (
                    <div className="bg-warm-bg rounded-xl p-5 border border-warm-border space-y-4">
                      <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Recruiter Checkpoints</h4>
                      <ul className="space-y-2">
                        {q.suggestedPoints?.map((pt, i) => {
                          const parts = pt.split(': ');
                          return (
                            <li key={i} className="text-[11px] flex items-start gap-2 text-primary-light">
                              <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                              <span>
                                {parts.length > 1 ? (
                                  <>
                                    <strong className="text-primary">{parts[0]}:</strong> {parts[1]}
                                  </>
                                ) : pt}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-amber-500/20 rounded-2xl p-6 text-center space-y-4 shadow-xl">
                      <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
                        <Lock size={16} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-serif font-bold text-sm text-white">Unlock Answer Strategy & Playbook</h4>
                        <p className="text-[10px] text-slate-400 max-w-sm mx-auto leading-relaxed">
                          Upgrade to get access to recommended answer strategies, recruiter talking points, and STAR method response blueprints.
                        </p>
                      </div>
                      <button
                        onClick={onUpgradeClick}
                        className="py-2 px-4 rounded-xl text-[10px] font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 transition-all cursor-pointer shadow-md shadow-amber-500/10"
                      >
                        Unlock Premium Answers (₹199)
                      </button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            );
          })() : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 text-primary-light">
              <MessageSquare size={48} className="opacity-20 mb-4" />
              <p className="text-sm font-medium">Select an interview question from the left sidebar to preview its details.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function CodeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
