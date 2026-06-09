'use client';

import React from 'react';
import { FileText, Globe, Brain, Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { CareerProfile, IdentityStack } from '@/db/local-db';

interface PremiumOverviewProps {
  careerProfile: CareerProfile;
  premiumStack?: IdentityStack;
  setActiveTab: (tab: any) => void;
}

export function PremiumOverview({ careerProfile, premiumStack, setActiveTab }: PremiumOverviewProps) {
  if (!premiumStack) return null;

  const cards = [
    {
      id: 'premium_resumes',
      title: 'Premium Resumes',
      icon: FileText,
      color: 'text-brand',
      bg: 'bg-brand/10',
      description: 'Access your optimized Technical, Leadership, and Balanced resume variants.',
    },
    {
      id: 'premium_portfolios',
      title: 'Portfolio Sites',
      icon: Globe,
      color: 'text-accent-sage',
      bg: 'bg-accent-sage/10',
      description: 'Explore the Executive, Product Builder, and Interactive Showcase portfolio themes.',
    },
    {
      id: 'premium_interview',
      title: 'Interview Prep Kit',
      icon: Brain,
      color: 'text-accent-amber',
      bg: 'bg-accent-amber/10',
      description: 'Tailored Technical, Leadership, and Behavioral questions with AI Answer Playbooks.',
    },
    {
      id: 'premium_insights',
      title: 'Career Insights',
      icon: Sparkles,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      description: 'Deep analytical breakdown of your career strengths, gaps, and growth opportunities.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 no-print"
    >
      <div className="bg-white border border-warm-border rounded-2xl p-6 md:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute -top-12 -right-12 text-brand/5 pointer-events-none">
          <Sparkles size={160} />
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 mb-4">
            <Sparkles size={12} className="text-brand" />
            <span className="text-[10px] font-bold tracking-widest text-brand uppercase">Premium Unlocked</span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary">
            Premium Career Package
          </h1>
          <p className="text-sm text-primary-light mt-2 max-w-2xl leading-relaxed">
            Welcome to your premium workspace, {careerProfile.personalInfo.fullName.split(' ')[0]}. 
            Your profile has been fully analyzed and expanded into a suite of high-impact professional assets designed for {careerProfile.professionCategory} roles.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {cards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  onClick={() => setActiveTab(card.id)}
                  className="group text-left border border-warm-border p-6 rounded-2xl bg-white hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[160px]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg} ${card.color}`}>
                      <Icon size={24} />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-warm-bg flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
                      <ChevronRight size={16} className="text-primary" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-base mb-1 group-hover:text-brand transition-colors">{card.title}</h4>
                    <p className="text-xs text-primary-light leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
