'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Portfolio, User as DBUser, CareerProfile } from '@/db/local-db';
import { getVisualDNA } from '@/lib/visual-dna';
import BasePortfolioEngine from '@/components/portfolioTemplates/base/BasePortfolioEngine';
import PremiumPortfolioEngine from '@/components/portfolioTemplates/premium/PremiumPortfolioEngine';
import { motion, AnimatePresence } from 'framer-motion';
import { LiveEditorProvider } from '@/components/portfolio/editor/LiveEditorContext';
import { Mail, X, Check, Copy, ExternalLink } from 'lucide-react';

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
  isOwner?: boolean;
}

export default function DynamicPortfolioClient({
  portfolio,
  user,
  careerProfile,
  overrideTheme,
  isOwner
}: Props) {
  const [loading, setLoading] = useState(true);
  const [emailModalData, setEmailModalData] = useState<{ open: boolean; email: string }>({ open: false, email: '' });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Artificial delay to show the awesome loader
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMailtoClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement | null;
      while (target && target !== document.body) {
        if (target.tagName === 'A' && (target as HTMLAnchorElement).href.startsWith('mailto:')) {
          const mailtoHref = (target as HTMLAnchorElement).href;
          const emailAddress = mailtoHref.replace('mailto:', '');
          
          e.preventDefault();
          e.stopPropagation();
          
          setEmailModalData({ open: true, email: emailAddress });
          return;
        }
        target = target.parentElement;
      }
    };
    
    document.addEventListener('click', handleMailtoClick);
    return () => document.removeEventListener('click', handleMailtoClick);
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
      // Ensure we have a clean list of achievements
      let achs = ensureStringArray(exp.achievements || []);
      
      // If we don't have achievements, or have very few, and have a description
      if (achs.length === 0 && exp.description && exp.description.trim()) {
        // Split description by sentence terminators (. ! ?)
        const sentences = exp.description.match(/[^.!?]+[.!?]+(\s|$)/g) || [];
        const cleanSentences = sentences
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 8); // Filter out tiny fragments
          
        if (cleanSentences.length > 1) {
          // First sentence is the role description
          exp.description = cleanSentences[0];
          // Remaining sentences become achievements (up to 5 items)
          exp.achievements = cleanSentences.slice(1, 6);
        } else {
          // If only 1 sentence, keep it in description and no achievements
          exp.description = exp.description;
          exp.achievements = [];
        }
      } else {
        // We already have achievements, make sure we limit to maximum of 5 highly impactful points
        exp.achievements = achs.slice(0, 5);
        // Also keep description short if it's too long
        if (exp.description) {
          const sentences = exp.description.match(/[^.!?]+[.!?]+(\s|$)/g) || [];
          if (sentences.length > 2) {
            // Shorten to first 1-2 sentences to prevent a massive block
            exp.description = sentences.slice(0, 2).map((s: string) => s.trim()).join(' ');
          }
        }
      }
      
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

    // Generate chronological timeline milestones
    const generateTimeline = (prof: any) => {
      const getYear = (dateStr: string): number => {
        if (!dateStr) return 0;
        const match = dateStr.match(/\b(19|20)\d{2}\b/);
        return match ? parseInt(match[0], 10) : 0;
      };

      const milestones: any[] = [];
      
      // Add Education milestones
      (prof.education || []).forEach((edu: any) => {
        const year = edu.endDate || edu.year || edu.startDate || '';
        const numYear = getYear(year);
        milestones.push({
          year: year || 'Academic',
          numYear: numYear || 1999,
          title: `Academic Journey`,
          subTitle: `${edu.degree} — ${edu.institution}`,
          description: `Acquired comprehensive foundational knowledge and specialized training in this domain.`
        });
      });

      // Add Experience milestones
      (prof.experience || []).forEach((exp: any) => {
        const year = exp.startDate || '';
        const numYear = getYear(year);
        milestones.push({
          year: exp.duration || `${exp.startDate} - ${exp.endDate || 'Present'}`,
          numYear: numYear || 2020,
          title: exp.position || 'Professional Role',
          subTitle: exp.company,
          description: exp.description || `Drove organizational growth and engineering excellence.`
        });
      });

      // Sort chronological ascending (oldest to newest)
      milestones.sort((a, b) => a.numYear - b.numYear);

      // Add a Future Vision milestone at the end
      let closing = `I am committed to continuous learning, keeping pace with technological advances, and taking on challenging roles.`;
      const catLower = (prof.professionCategory || '').toLowerCase();
      if (catLower.includes('dev') || catLower.includes('software')) {
        closing = `I am passionate about software engineering, writing clean code, and building systems that scale.`;
      } else if (catLower.includes('design')) {
        closing = `My design philosophy centers on user empathy, creating intuitive flows, and visual clarity.`;
      } else if (catLower.includes('product') || catLower.includes('mba') || catLower.includes('business')) {
        closing = `I operate at the intersection of business, technology, and user-centric design to build product lines that deliver tangible business value.`;
      }

      milestones.push({
        year: 'Current & Future',
        numYear: 2100,
        title: 'Next Chapter',
        subTitle: 'Vision & Focus',
        description: closing
      });

      return milestones;
    };
    p.aboutMeTimeline = generateTimeline(p);

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

      {/* Email Option Modal */}
      {emailModalData.open && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            onClick={() => setEmailModalData({ open: false, email: '' })} 
            className="absolute inset-0 cursor-default" 
          />
          <div className="bg-white border border-warm-border rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200 text-slate-800">
            <button 
              onClick={() => setEmailModalData({ open: false, email: '' })} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              <X size={18} />
            </button>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center mb-4">
                <Mail size={24} />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-1">Contact {safeProfile.personalInfo.fullName}</h3>
              <p className="text-[11px] text-slate-500 mb-6 break-all max-w-[280px]">{emailModalData.email}</p>
              
              <div className="w-full space-y-3">
                <a 
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${emailModalData.email}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  <span className="flex items-center gap-2">Compose on Gmail (Web)</span>
                  <ExternalLink size={14} className="opacity-80" />
                </a>
                
                <a 
                  href={`https://outlook.live.com/default.aspx?rru=compose&to=${emailModalData.email}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  <span className="flex items-center gap-2">Compose on Outlook (Web)</span>
                  <ExternalLink size={14} className="opacity-80" />
                </a>
                
                <button 
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.clipboard) {
                      navigator.clipboard.writeText(emailModalData.email);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }
                  }}
                  className={`flex items-center justify-between w-full px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
                    copied 
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-800 shadow-2xs' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Email Address'}</span>
                  {copied ? <Check size={14} /> : <Copy size={14} className="opacity-80" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live View Owner Editing Pill */}
      {isOwner && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className={`flex items-center gap-3 px-4 py-2.5 rounded-full bg-slate-950/90 backdrop-blur-md border text-white shadow-2xl ${
            isPremium ? 'border-amber-500/30 animate-pulse-slow' : 'border-indigo-500/30'
          }`}>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isPremium ? 'bg-amber-400' : 'bg-indigo-400'
                }`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  isPremium ? 'bg-amber-500' : 'bg-indigo-500'
                }`}></span>
              </span>
              <span className="text-[11px] font-semibold text-slate-300">
                {isPremium ? 'Premium Live View (Owner)' : 'Live View (Owner)'}
              </span>
            </div>
            <div className="w-[1px] h-4 bg-white/10" />
            <a
              href="/dashboard/portfolio/editor"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold text-white transition-all shadow-md cursor-pointer ${
                isPremium 
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30' 
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
              }`}
            >
              🛠️ Edit Layout
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
