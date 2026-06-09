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
  
  // Use legacy Visual DNA logic to keep colors working
  const dna = useMemo(() => getVisualDNA(careerProfile.professionalBlueprint, portfolio.subdomain), [careerProfile, portfolio.subdomain]);

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
                {careerProfile.personalInfo.fullName}
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
              <PremiumPortfolioEngine profile={careerProfile} portfolio={portfolio} />
            ) : (
              <BasePortfolioEngine profile={careerProfile} portfolio={portfolio} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
