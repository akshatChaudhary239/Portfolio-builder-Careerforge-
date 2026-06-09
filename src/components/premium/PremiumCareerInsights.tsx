'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Target, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { GeneratedAsset, IdentityStack } from '@/db/local-db';

interface PremiumCareerInsightsProps {
  premiumStack: IdentityStack;
  generatedAssets: GeneratedAsset[];
}

export function PremiumCareerInsights({ premiumStack, generatedAssets }: PremiumCareerInsightsProps) {
  const activeAnalysisAsset = generatedAssets.find(a => a.stackId === premiumStack.id && a.assetType === 'analysis');
  
  if (!activeAnalysisAsset || !activeAnalysisAsset.generatedContent) {
    return (
      <div className="bg-white border border-warm-border rounded-2xl p-8 text-center text-primary-light">
        No analysis data available.
      </div>
    );
  }

  const aiAnalysis = activeAnalysisAsset.generatedContent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 no-print"
    >
      <div className="bg-white border border-warm-border rounded-2xl p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
            <Sparkles size={16} />
          </div>
          <h1 className="text-xl font-serif font-bold text-primary">
            Premium Career Insights
          </h1>
        </div>
        <p className="text-xs text-primary-light max-w-xl">
          Deep strategic analysis of your professional identity mapped against current market expectations.
        </p>
        
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-gradient-to-br from-brand/5 to-brand/10 border border-brand/20 p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-3 text-brand">
              <Target size={16} />
              <span className="text-[10px] uppercase tracking-wider font-bold">Role Alignment</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-serif font-bold text-primary leading-none">{aiAnalysis.matchScore}%</span>
            </div>
            <p className="text-xs text-primary-light mt-2 font-medium">for {aiAnalysis.roleMatch}</p>
          </div>
          
          <div className="bg-white border border-warm-border p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-3 text-emerald-600">
              <TrendingUp size={16} />
              <span className="text-[10px] uppercase tracking-wider font-bold">Market Readiness</span>
            </div>
            <div className="text-lg font-bold text-primary">High Potential</div>
            <p className="text-[11px] text-primary-light mt-2 leading-relaxed">Your profile demonstrates strong narrative cohesion and technical depth.</p>
          </div>
          
          <div className="bg-white border border-warm-border p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-3 text-amber-600">
              <Zap size={16} />
              <span className="text-[10px] uppercase tracking-wider font-bold">Immediate Action</span>
            </div>
            <div className="text-sm font-bold text-primary leading-snug">Address Skill Gaps</div>
            <p className="text-[11px] text-primary-light mt-2 leading-relaxed">Focus on the missing technologies highlighted below to increase ATS match rates.</p>
          </div>
        </div>

        {/* Detailed Analysis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          
          {/* Strengths */}
          <div className="border border-warm-border p-6 rounded-2xl bg-white flex flex-col">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-warm-border pb-3 mb-4 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" /> Core Strengths
            </h3>
            <ul className="space-y-3 flex-1">
              {(aiAnalysis.strengths || []).map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-primary-light leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skill Gaps */}
          <div className="border border-warm-border p-6 rounded-2xl bg-white flex flex-col">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-warm-border pb-3 mb-4 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-500" /> Skill Gaps & Weaknesses
            </h3>
            <ul className="space-y-3 flex-1">
              {(aiAnalysis.missingSkills || []).map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-primary-light leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Career Roadmap / Opportunities */}
          <div className="border border-warm-border p-6 rounded-2xl bg-white md:col-span-2">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-warm-border pb-3 mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-brand" /> Career Roadmap & Growth Opportunities
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {((aiAnalysis.careerRoadmap && aiAnalysis.careerRoadmap.length > 0) ? aiAnalysis.careerRoadmap : [
                { timeframe: "Next 6 Months", action: "Focus on deepening core technical competencies and expanding your project portfolio." },
                { timeframe: "Year 1", action: "Take on broader responsibilities, mentor junior peers, and optimize workflows." },
                { timeframe: "Year 2-3", action: "Transition into senior leadership or advanced architectural strategy roles." }
              ]).map((r: any, i: number) => (
                <div key={i} className="p-4 rounded-xl bg-warm-bg border border-warm-border">
                  <div className="text-xs font-bold text-primary mb-1">{r.timeframe || `Phase ${i + 1}`}</div>
                  <div className="text-[11px] font-medium text-primary-light">{r.action || r}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-5 rounded-xl bg-gradient-to-r from-warm-bg to-white border border-warm-border">
              <h4 className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">Next 90 Days Strategy</h4>
              <p className="text-[11px] text-primary-light leading-relaxed">
                Based on your current trajectory, your immediate focus should be on expanding your technical project portfolio and preparing for behavioral interviews using the Premium Interview Prep kit. Ensure your active portfolio site is linked in all your public profiles.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
}
