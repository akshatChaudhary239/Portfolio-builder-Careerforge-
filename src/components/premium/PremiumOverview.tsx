'use client';

import React from 'react';
import { FileText, Globe, Brain, Sparkles, ChevronRight, ArrowRight, Award, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { CareerProfile, IdentityStack } from '@/db/local-db';

interface PremiumOverviewProps {
  careerProfile: CareerProfile;
  premiumStack?: IdentityStack;
  setActiveTab: (tab: any) => void;
  hasPremium?: boolean;
  onUpgradeClick?: () => void;
}

export function PremiumOverview({ 
  careerProfile, 
  premiumStack, 
  setActiveTab, 
  hasPremium = false,
  onUpgradeClick 
}: PremiumOverviewProps) {

  const cards = [
    {
      id: 'premium_resumes',
      title: 'Premium Resumes',
      icon: FileText,
      color: 'text-brand',
      bg: 'bg-brand/10',
      description: hasPremium 
        ? 'Access your optimized Technical, Leadership, and Balanced resume variants.'
        : 'Preview and explore your career details formatted into recruiter-approved multi-variant templates.',
      badge: hasPremium ? null : 'Interactive Preview'
    },
    {
      id: 'premium_portfolios',
      title: 'Portfolio Sites',
      icon: Globe,
      color: 'text-accent-sage',
      bg: 'bg-accent-sage/10',
      description: hasPremium
        ? 'Explore the Executive, Product Builder, and Interactive Showcase portfolio themes.'
        : 'Sandbox-customize and explore the animations, styling, and layouts of your live premium portfolio preview.',
      badge: hasPremium ? null : 'Sandbox Sandbox'
    },
    {
      id: 'premium_interview',
      title: 'Interview Prep Kit',
      icon: Brain,
      color: 'text-accent-amber',
      bg: 'bg-accent-amber/10',
      description: hasPremium
        ? 'Tailored Technical, Leadership, and Behavioral questions with AI Answer Playbooks.'
        : 'Explore tailored mock interview questions generated based on your profile gaps and accomplishments.',
      badge: hasPremium ? null : 'Preview Qs'
    },
    {
      id: 'premium_insights',
      title: 'Career Insights',
      icon: Sparkles,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      description: hasPremium
        ? 'Deep analytical breakdown of your career strengths, gaps, and growth opportunities.'
        : 'View a preview analysis of your profile match rates, core strength points, and growth timeframes.',
      badge: hasPremium ? null : 'Score Preview'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8 no-print"
    >
      {/* Premium Header Banner */}
      <div className="bg-white border border-warm-border rounded-2xl p-6 md:p-8 shadow-xs relative overflow-hidden">
        {/* Background Sparkles */}
        <div className="absolute -top-12 -right-12 text-brand/5 pointer-events-none">
          <Sparkles size={160} />
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 mb-4">
            <Sparkles size={12} className="text-brand" />
            <span className="text-[10px] font-bold tracking-widest text-brand uppercase">
              {hasPremium ? 'Premium Unlocked' : 'Premium Interactive Sandbox'}
            </span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary">
            {hasPremium ? 'Your Premium Career Package' : 'Explore Your Premium Experience'}
          </h1>
          <p className="text-sm text-primary-light mt-2 max-w-2xl leading-relaxed">
            {hasPremium 
              ? `Welcome to your premium workspace, ${careerProfile.personalInfo.fullName.split(' ')[0]}. Your profile has been fully analyzed and expanded into a suite of high-impact professional assets.`
              : `See exactly how GetProspectra transforms your professional assets. We have prepared an interactive sandbox of your premium templates, resumes, and interview flashcards using your real career profile details.`
            }
          </p>

          {!hasPremium && (
            <div className="mt-6 flex flex-wrap gap-4 items-center">
              <button 
                onClick={onUpgradeClick}
                className="py-2.5 px-6 rounded-xl text-xs font-bold text-white bg-brand hover:bg-brand-hover shadow-lg shadow-brand/20 transition-all cursor-pointer"
              >
                Unlock Lifetime Access (₹199)
              </button>
              <span className="text-[10px] text-primary-light font-medium">One-time payment • Immediate activation</span>
            </div>
          )}
        </div>
      </div>

      {/* Outcome-Based Comparison Section (Freemium Landing Page) */}
      {!hasPremium && (
        <div className="bg-gradient-to-b from-slate-950 to-slate-900 border border-amber-500/10 rounded-2xl p-6 md:p-8 shadow-xl text-white space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-lg font-serif font-bold text-white">Compare Outcomes: Free vs. Premium</h3>
            <p className="text-xs text-slate-400">We don't just add templates; we intelligently elevate your professional storytelling to match recruiter expectations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Resume Comparison */}
            <div className="border border-white/5 bg-slate-900/60 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-brand">
                <FileText size={18} />
                <h4 className="font-bold text-sm text-white">Career Resume Outcome</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-lg text-[10px] text-slate-400">
                  <span>Standard Plan</span>
                  <span className="font-mono line-through">Standard margins, basic layout</span>
                </div>
                <div className="flex justify-between items-center bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg text-xs text-slate-200">
                  <div className="space-y-1">
                    <span className="font-bold text-amber-400 block text-[10px] uppercase tracking-wider">Premium Standard</span>
                    <ul className="space-y-1 text-[10.5px] text-slate-300">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle size={12} className="text-amber-500 shrink-0" />
                        Better content positioning
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle size={12} className="text-amber-500 shrink-0" />
                        Profession-aware section hierarchy
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle size={12} className="text-amber-500 shrink-0" />
                        Improved recruiter readability & ATS scores
                      </li>
                    </ul>
                  </div>
                  <ArrowRight size={16} className="text-amber-500/50" />
                </div>
              </div>
            </div>

            {/* Portfolio Comparison */}
            <div className="border border-white/5 bg-slate-900/60 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-accent-sage">
                <Globe size={18} />
                <h4 className="font-bold text-sm text-white">Dynamic Portfolio Outcome</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-lg text-[10px] text-slate-400">
                  <span>Standard Plan</span>
                  <span className="font-mono line-through">Classic layout, minimal animations</span>
                </div>
                <div className="flex justify-between items-center bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg text-xs text-slate-200">
                  <div className="space-y-1">
                    <span className="font-bold text-amber-400 block text-[10px] uppercase tracking-wider">Premium Standard</span>
                    <ul className="space-y-1 text-[10.5px] text-slate-300">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle size={12} className="text-amber-500 shrink-0" />
                        Enhanced micro-interactions & scroll states
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle size={12} className="text-amber-500 shrink-0" />
                        Personalized branding & font preset packs
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle size={12} className="text-amber-500 shrink-0" />
                        Profession-specific layout optimizations
                      </li>
                    </ul>
                  </div>
                  <ArrowRight size={16} className="text-amber-500/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Premium Features Sandbox</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => {
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
                  
                  {card.badge ? (
                    <span className="bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {card.badge}
                    </span>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-warm-bg flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
                      <ChevronRight size={16} className="text-primary" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-primary text-base mb-1 group-hover:text-brand transition-colors flex items-center gap-1.5">
                    {card.title}
                  </h4>
                  <p className="text-xs text-primary-light leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
