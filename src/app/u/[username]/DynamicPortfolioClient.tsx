'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Portfolio, User as DBUser, CareerProfile } from '@/db/local-db';
import { getVisualDNA } from '@/lib/visual-dna';
import BasePortfolioEngine from '@/components/portfolioTemplates/base/BasePortfolioEngine';
import PremiumPortfolioEngine from '@/components/portfolioTemplates/premium/PremiumPortfolioEngine';
import { motion, AnimatePresence } from 'framer-motion';

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
}

interface Props {
  portfolio: Portfolio;
  user: DBUser;
  careerProfile: CareerProfile;
  overrideTheme?: string;
}

export default function DynamicPortfolioClient({
  portfolio,
  user,
  careerProfile,
  overrideTheme
}: Props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Artificial delay to show the awesome loader
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  // Guarantee personalInfo exists and sanitize all potential AI-hallucinated types
  // This prevents TypeErrors (like .map is not a function) in all 30+ downstream template components
  const safeProfile = useMemo(() => {
    // Deep clone to completely avoid mutating frozen Next.js props
    const p = JSON.parse(JSON.stringify(careerProfile || {}));
    
    // 1. Sanitize Personal Info
    p.personalInfo = p.personalInfo || {};
    p.personalInfo.fullName = p.personalInfo.fullName || user.name || 'Portfolio Owner';
    p.personalInfo.email = p.personalInfo.email || user.email || '';
    
    // Helper to guarantee arrays
    const ensureArray = (val: any) => {
      if (Array.isArray(val)) return val;
      if (!val) return [];
      if (typeof val === 'string') return val.split(',').map(s => s.trim());
      return [val];
    };

    // Helper to guarantee arrays of strings (prevents Object as React Child crashes)
    const ensureStringArray = (val: any) => {
      const arr = ensureArray(val);
      return arr.map((item: any) => {
        if (typeof item === 'string') return item.trim();
        if (typeof item === 'object' && item !== null) {
          return item.description || item.title || item.name || item.value || JSON.stringify(item);
        }
        return String(item);
      });
    };

    // 2. Sanitize all top-level array fields
    p.skills = ensureArray(p.skills);
    p.experience = ensureArray(p.experience);
    p.projects = ensureArray(p.projects);
    p.education = ensureArray(p.education);
    p.certifications = ensureArray(p.certifications);
    p.achievements = ensureArray(p.achievements);
    p.publications = ensureStringArray(p.publications);
    p.workSamples = ensureArray(p.workSamples);

    // 3. Sanitize nested arrays specifically focusing on string extraction
    p.experience.forEach((exp: any) => {
      if (exp.achievements) exp.achievements = ensureStringArray(exp.achievements);
      if (exp.technologies) exp.technologies = ensureStringArray(exp.technologies);
    });

    p.projects.forEach((proj: any, idx: number) => {
      proj.name = proj.name || proj.title || proj.projectName || proj.projectTitle || `Project ${idx + 1}`;
      if (proj.technologies) proj.technologies = ensureStringArray(proj.technologies);
      if (proj.tools) proj.tools = ensureStringArray(proj.tools);
    });

    return p;
  }, [careerProfile, user]);
  
  // Use legacy Visual DNA logic to keep colors working
  const dna = useMemo(() => getVisualDNA(safeProfile.professionalBlueprint, portfolio.subdomain), [safeProfile, portfolio.subdomain]);

  const activeTemplate = overrideTheme || portfolio.templateId || 'dev';
  const isPremium = ['executive', 'product_builder', 'interactive_showcase', 'product'].includes(activeTemplate);

  return (
    <div 
      className="min-h-screen bg-[var(--color-background)] select-none text-[var(--color-text)] font-[var(--font-body)] overflow-x-hidden"
      style={{
        '--color-primary': dna.tokens.colors.primary,
        '--color-primary-rgb': hexToRgb(dna.tokens.colors.primary),
        '--color-secondary': dna.tokens.colors.secondary,
        '--color-secondary-rgb': hexToRgb(dna.tokens.colors.secondary),
        '--color-background': dna.tokens.colors.background,
        '--color-surface': dna.tokens.colors.surface,
        '--color-text': dna.tokens.colors.text,
        '--color-muted': dna.tokens.colors.muted,
        '--color-accent': dna.tokens.colors.accent,
        '--font-heading': dna.tokens.typography.heading,
        '--font-body': dna.tokens.typography.body,
        '--radius-base': dna.tokens.geometry.borderRadius,
      } as React.CSSProperties}
    >
      <style dangerouslySetInnerHTML={{__html: `@import url('${dna.tokens.typography.importUrl}');`}} />

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] text-white"
          >
            <motion.div className="overflow-hidden mb-4">
              <motion.h1 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
                className="text-4xl md:text-6xl font-serif font-black tracking-tighter"
              >
                {safeProfile.personalInfo.fullName}
              </motion.h1>
            </motion.div>
            
            <div className="overflow-hidden">
              <motion.div 
                initial={{ y: "-100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
                className="flex items-center gap-3 opacity-60"
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <span className="text-xs uppercase tracking-[0.3em] font-medium">Initializing Portfolio</span>
              </motion.div>
            </div>
            
            <motion.div 
              className="absolute bottom-12 w-48 h-[1px] bg-white/20 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div 
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.2, ease: "easeInOut", delay: 0.8 }}
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {isPremium ? (
              <PremiumPortfolioEngine profile={safeProfile} portfolio={portfolio} />
            ) : (
              <BasePortfolioEngine profile={safeProfile} portfolio={portfolio} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
