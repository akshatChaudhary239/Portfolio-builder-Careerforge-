'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronRight, Check, MessageSquare, Shield, Users, Sparkles } from 'lucide-react';
import { InterviewQuestion } from '@/db/local-db';

interface PremiumInterviewPrepProps {
  questions: InterviewQuestion[];
}

export function PremiumInterviewPrep({ questions }: PremiumInterviewPrepProps) {
  const [activeCategory, setActiveCategory] = useState<'technical' | 'leadership' | 'behavioral' | null>(null);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

  // Categorize questions
  const technicalQuestions = questions.filter(q => q.type === 'technical');
  const behavioralQuestions = questions.filter(q => q.type === 'behavioral');
  
  // Create a pseudo-category for Leadership based on contextRefs if available, or just take half of behavioral
  const leadershipQuestions = behavioralQuestions.filter(q => q.contextRef === 'Leadership' || q.contextRef === 'Collaboration' || q.contextRef === 'Career Focus');
  const pureBehavioralQuestions = behavioralQuestions.filter(q => !leadershipQuestions.includes(q));

  const categories = [
    {
      id: 'technical',
      name: 'Technical Preparation',
      icon: CodeIcon,
      questions: technicalQuestions,
      desc: 'System design, debugging, scaling, and architectural choices.',
      color: 'text-blue-600',
      bg: 'bg-blue-600/10'
    },
    {
      id: 'leadership',
      name: 'Leadership Preparation',
      icon: Shield,
      questions: leadershipQuestions.length > 0 ? leadershipQuestions : behavioralQuestions.slice(0, Math.ceil(behavioralQuestions.length / 2)),
      desc: 'Conflict resolution, team management, and stakeholder pushback.',
      color: 'text-amber-600',
      bg: 'bg-amber-600/10'
    },
    {
      id: 'behavioral',
      name: 'HR & Behavioral',
      icon: Users,
      questions: pureBehavioralQuestions.length > 0 ? pureBehavioralQuestions : behavioralQuestions.slice(Math.ceil(behavioralQuestions.length / 2)),
      desc: 'Culture fit, adaptability, continuous learning, and career goals.',
      color: 'text-emerald-600',
      bg: 'bg-emerald-600/10'
    }
  ];

  const activeCategoryData = categories.find(c => c.id === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 no-print"
    >
      {!activeCategory ? (
        <div className="bg-white border border-warm-border rounded-2xl p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-accent-amber/10 flex items-center justify-center text-accent-amber border border-accent-amber/20">
              <Brain size={16} />
            </div>
            <h1 className="text-xl font-serif font-bold text-primary">
              Premium Interview Kits
            </h1>
          </div>
          <p className="text-xs text-primary-light mb-8 max-w-2xl">
            Select a preparation track to access your tailored questions and AI Answer Playbooks.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className="group text-left border border-warm-border rounded-2xl bg-white p-6 hover:shadow-xl hover:shadow-brand/5 hover:border-brand/20 transition-all duration-300 flex flex-col"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${cat.bg} ${cat.color}`}>
                    <Icon size={24} />
                  </div>
                  <h4 className="font-bold text-primary text-base mb-1 group-hover:text-brand transition-colors">{cat.name}</h4>
                  <p className="text-[11px] text-primary-light leading-relaxed mb-6 flex-1">
                    {cat.desc}
                  </p>
                  
                  <div className="mt-auto border-t border-warm-border pt-4 flex items-center justify-between w-full">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary-light">
                      {cat.questions.length} Questions
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-brand group-hover:translate-x-1 transition-transform">
                      Start Prep <ChevronRight size={14} />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-warm-border rounded-2xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 border-r border-warm-border pr-6 space-y-4">
            <button 
              onClick={() => { setActiveCategory(null); setActiveQuestionId(null); }}
              className="text-[10px] font-bold text-primary-light uppercase tracking-wider hover:text-primary transition-colors flex items-center gap-1 mb-6"
            >
              <ChevronRight size={12} className="rotate-180" /> Back to Kits
            </button>
            
            <h3 className="font-serif font-bold text-lg text-primary mb-4 flex items-center gap-2">
              {activeCategoryData?.name}
            </h3>
            
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
              {activeCategoryData?.questions.map((q, idx) => (
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
              const q = activeCategoryData?.questions.find(x => x.id === activeQuestionId);
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
                        {q.contextRef}
                      </span>
                      <h2 className="text-lg md:text-xl font-bold text-primary leading-snug">
                        {q.question}
                      </h2>
                    </div>

                    <div className="bg-gradient-to-br from-[#0B0F19] to-[#111827] rounded-xl p-6 border border-white/10 shadow-lg text-left relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sparkles size={60} className="text-brand" />
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4 relative z-10">
                        <div className="w-6 h-6 rounded bg-brand/20 flex items-center justify-center text-brand">
                          <Brain size={12} />
                        </div>
                        <h4 className="text-sm font-bold text-white tracking-wide">
                          Premium AI Answer Playbook
                        </h4>
                      </div>

                      {q.premiumAnswer ? (
                        <div className="space-y-5 relative z-10">
                          <div>
                            <span className="text-[10px] text-brand uppercase tracking-wider font-bold mb-1.5 block">Overview Statement</span>
                            <p className="text-xs text-gray-300 leading-relaxed font-medium">
                              "{q.premiumAnswer.overview}"
                            </p>
                          </div>
                          <div className="border-t border-white/10 pt-4">
                            <span className="text-[10px] text-brand uppercase tracking-wider font-bold mb-1.5 block">Deep Dive Strategy</span>
                            <p className="text-xs text-gray-400 leading-relaxed">
                              {q.premiumAnswer.deepDive}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 relative z-10 italic">
                          Premium answer playbook is not available for this question.
                        </p>
                      )}
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
                <p className="text-sm font-medium">Select a question from the list to view your playbook.</p>
              </div>
            )}
          </div>
        </div>
      )}
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
