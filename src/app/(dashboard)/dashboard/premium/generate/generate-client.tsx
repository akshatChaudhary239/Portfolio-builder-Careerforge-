'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Loader2, Award, Brain, Layout, FileText } from 'lucide-react';
import { User, CareerProfile, PremiumGenerationSession } from '@/db/local-db';

interface Props {
  user: User;
  session: PremiumGenerationSession;
  careerProfile: CareerProfile;
}

const GENERATION_STEPS = [
  { id: 'leadership', label: 'Drafting Leadership Resume', icon: Award },
  { id: 'technical', label: 'Architecting Technical Resume', icon: Layout },
  { id: 'recruiter', label: 'Optimizing Recruiter ATS Resume', icon: FileText },
  { id: 'analysis', label: 'Generating Career Analysis & Roadmap', icon: Brain },
];

export default function PremiumGenerateClient({ user, session, careerProfile }: Props) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const runGeneration = async () => {
      try {
        const { processPremiumGenerationAction } = await import('./actions');
        
        // We will call the backend to process everything
        // For UX, we fake the step progression visually while the backend works
        const interval = setInterval(() => {
          setCurrentStep(prev => Math.min(prev + 1, GENERATION_STEPS.length - 1));
        }, 3000);

        const res = await processPremiumGenerationAction(session.id, careerProfile);
        
        clearInterval(interval);
        
        if (isMounted) {
          setCurrentStep(GENERATION_STEPS.length);
          setIsComplete(true);
          setTimeout(() => {
            router.push('/dashboard?tab=premium_overview');
          }, 2000);
        }
      } catch (err) {
        if (isMounted) {
          setCurrentStep(GENERATION_STEPS.length);
          setIsComplete(true);
          setTimeout(() => {
            router.push('/dashboard?tab=premium_overview');
          }, 2000);
        }
      }
    };

    if (session.status === 'pending') {
      runGeneration();
    } else {
      router.push('/dashboard?tab=premium_overview');
    }

    return () => { isMounted = false; };
  }, [session.id, session.status, careerProfile, router]);

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
      
      <div className="max-w-xl w-full bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md relative z-10">
        <div className="text-center mb-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand to-accent-sage p-[2px] mx-auto mb-6"
          >
            <div className="w-full h-full bg-[#0B0F19] rounded-xl flex items-center justify-center">
              <Sparkles className="text-white" size={32} />
            </div>
          </motion.div>
          <h1 className="text-3xl font-serif font-bold text-white mb-3">
            {isComplete ? 'Assets Ready' : 'Generating Premium Package'}
          </h1>
          <p className="text-gray-400">
            {isComplete 
              ? 'Redirecting you to your premium dashboard...'
              : 'Our advanced AI is analyzing your career profile to build your tailored assets.'}
          </p>
        </div>

        <div className="space-y-4">
          {GENERATION_STEPS.map((step, idx) => {
            const isActive = currentStep === idx && !isComplete;
            const isDone = currentStep > idx || isComplete;
            const StepIcon = step.icon;

            const baseClass = "flex items-center gap-4 p-4 rounded-xl border transition-all duration-500";
            const stateClass = isActive 
                    ? "border-brand/50 bg-brand/10 shadow-[0_0_20px_rgba(99,102,241,0.15)]" 
                    : isDone 
                      ? "border-white/10 bg-white/5" 
                      : "border-transparent opacity-40";

            const iconBaseClass = "w-10 h-10 rounded-full flex items-center justify-center";
            const iconStateClass = isActive ? "bg-brand text-white" : isDone ? "bg-accent-sage text-white" : "bg-white/10 text-gray-500";

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2 }}
                className={baseClass + " " + stateClass}
              >
                <div className={iconBaseClass + " " + iconStateClass}>
                  {isDone ? <CheckCircle2 size={20} /> : isActive ? <Loader2 size={20} className="animate-spin" /> : <StepIcon size={18} />}
                </div>
                <div className="flex-1">
                  <h4 className={"font-bold " + (isActive ? "text-white" : isDone ? "text-gray-200" : "text-gray-500")}>
                    {step.label}
                  </h4>
                  {isActive && (
                    <motion.div 
                      className="h-1 bg-brand mt-2 rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3, ease: "linear" }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Error box removed as requested */}
      </div>
    </div>
  );
}
