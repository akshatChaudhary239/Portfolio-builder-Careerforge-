'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronRight, Check, MessageSquare, Shield, Users, Sparkles } from 'lucide-react';
import { InterviewQuestion } from '@/db/local-db';

interface PremiumInterviewPrepProps {
  questions: InterviewQuestion[];
}

export function PremiumInterviewPrep({ questions }: PremiumInterviewPrepProps) {
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
            <h1 className="text-xl font-serif font-bold text-primary">
              Interview Kit
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

                  <div className="bg-warm-bg rounded-xl p-5 border border-warm-border">
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
                </motion.div>
              </AnimatePresence>
            );
          })() : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 text-primary-light">
              <MessageSquare size={48} className="opacity-20 mb-4" />
              <p className="text-sm font-medium">Select a question from the list to view the breakdown.</p>
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
