'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Portfolio, User as DBUser, CareerProfile } from '@/db/local-db';
import { getVisualDNA } from '@/lib/visual-dna';
import BasePortfolioEngine from '@/components/portfolioTemplates/base/BasePortfolioEngine';
import PremiumPortfolioEngine from '@/components/portfolioTemplates/premium/PremiumPortfolioEngine';
import { motion, AnimatePresence } from 'framer-motion';
import { LiveEditorProvider } from '@/components/portfolio/editor/LiveEditorContext';

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
}

function getContrastColor(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '#ffffff';
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#0f172a' : '#ffffff';
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

    // Generate high-profile positioning (intro) - 2 to 4 lines of positioning (approx. first 2 sentences)
    const getIntroText = (summaryText: string) => {
      if (!summaryText) return '';
      const sentences = summaryText.match(/[^.!?]+[.!?]+(\s|$)/g);
      if (!sentences || sentences.length <= 2) return summaryText;
      return sentences.slice(0, 2).join('').trim();
    };
    p.intro = getIntroText(p.summary || '');

    // Generate upgraded storytelling narrative (aboutMe)
    const generateStorytellingAboutMe = (prof: any) => {
      if (!prof) return '';
      const summaryText = prof.summary || '';
      const category = prof.professionCategory || '';
      
      const sections = [];
      if (summaryText) {
        sections.push(summaryText);
      }
      
      let bioPart = '';
      const companyNames = (prof.experience || [])
        .map((exp: any) => exp.company)
        .filter((name: string) => name && name.trim() !== '');
      const uniqCompanies = Array.from(new Set(companyNames));
      if (uniqCompanies.length > 0) {
        const companyList = uniqCompanies.length === 1 
          ? `at ${uniqCompanies[0]}` 
          : `across organizations like ${uniqCompanies.slice(0, 3).join(', ')}`;
        bioPart += `Throughout my professional journey, I have had the opportunity to drive impact ${companyList}. `;
      }
      
      const skillNames = (prof.skills || [])
        .map((s: any) => s.name)
        .filter((name: string) => name && name.trim() !== '');
      if (skillNames.length > 0) {
        const topSkills = skillNames.slice(0, 5).join(', ');
        bioPart += `My core expertise spans key areas including ${topSkills}, enabling me to deliver robust and efficient solutions. `;
      }
      if (bioPart) {
        sections.push(bioPart.trim());
      }
      
      let eduPart = '';
      const topEdu = (prof.education || [])[0];
      if (topEdu && topEdu.degree && topEdu.institution) {
        eduPart += `I completed my ${topEdu.degree} from ${topEdu.institution}. `;
      }
      
      let closing = `I am committed to continuous learning, keeping pace with technological advances, and taking on challenging roles.`;
      const catLower = category.toLowerCase();
      if (catLower.includes('dev') || catLower.includes('software')) {
        closing = `I am passionate about software engineering, writing clean code, and building systems that scale.`;
      } else if (catLower.includes('design')) {
        closing = `My design philosophy centers on user empathy, creating intuitive flows, and visual clarity.`;
      } else if (catLower.includes('product') || catLower.includes('mba') || catLower.includes('business')) {
        closing = `I operate at the intersection of business, technology, and user-centric design to build product lines that deliver tangible business value.`;
      }
      eduPart += closing;
      sections.push(eduPart.trim());
      
      return sections.join('\n\n');
    };
    p.aboutMe = generateStorytellingAboutMe(p);

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
        '--color-primary-contrast': getContrastColor(dna.tokens.colors.primary),
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
            <LiveEditorProvider initialCustomization={portfolio.publishedConfiguration} isEditorActive={false}>
              {isPremium ? (
                <PremiumPortfolioEngine profile={safeProfile} portfolio={portfolio} />
              ) : (
                <BasePortfolioEngine profile={safeProfile} portfolio={portfolio} />
              )}
            </LiveEditorProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
