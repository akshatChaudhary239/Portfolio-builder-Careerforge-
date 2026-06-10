'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, MapPin, ExternalLink, Calendar, Award, Code, Globe, 
  Briefcase, Target, Compass, Zap, Folder, Users, Trophy, BookOpen, 
  ArrowRight, Download, X, Send, Eye, Shield, TrendingUp, User, Lightbulb, Flag
} from 'lucide-react';
import { CareerProfile, Portfolio, Project, Achievement } from '@/db/local-db';
import { normalizeShowcaseItems } from '@/lib/normalization-layer';
import { getShowcaseLabels } from '@/lib/label-mapping';
import { getDynamicSections } from '@/lib/blueprint-engine';
import { getVisualDNA } from '@/lib/visual-dna';

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
}

interface Props {
  profile: CareerProfile;
  portfolio: Portfolio;
}

export default function ExecutiveTemplate({ profile, portfolio }: Props) {
  const { personalInfo, summary, experience, education, projects, certifications, achievements } = profile;
  const [activeProject, setActiveProject] = useState<any | null>(null);
  const [visibleProjectsCount, setVisibleProjectsCount] = useState(4);

  const normalizedProjects = useMemo(() => normalizeShowcaseItems(profile), [profile]);
  const showcaseLabels = useMemo(() => getShowcaseLabels(profile.professionCategory), [profile.professionCategory]);

  // Split name for two-tone rendering (white & gold)
  const dna = useMemo(() => getVisualDNA(profile.professionalBlueprint), [profile.professionalBlueprint]);

  const { firstName, lastName } = useMemo(() => {
    const parts = personalInfo.fullName.trim().split(' ');
    return {
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || ''
    };
  }, [personalInfo.fullName]);

  // Dynamic Labeling
  const categoryLabel = useMemo(() => {
    if (profile.professionCategory) {
      const parts = profile.professionCategory.split('/');
      return parts.map(p => p.trim().toUpperCase()).join(' • ') + ' • EMERGING LEADER';
    }
    return 'FOUNDER • PRODUCT BUILDER • EMERGING LEADER';
  }, [profile.professionCategory]);

  // Executive Highlights (Dynamic or fallback)
  const highlights = useMemo(() => {
    const defaultHighlights = [
      { icon: Briefcase, title: 'Full Stack Developer', desc: 'Building scalable and impactful digital solutions.' },
      { icon: Users, title: 'Project Leader', desc: 'Driving projects from concept to successful delivery.' },
      { icon: Target, title: 'Problem Solver', desc: 'Turning complex challenges into simple outcomes.' },
      { icon: TrendingUp, title: 'Continuous Learner', desc: 'Always exploring, improving and creating value.' }
    ];

    if (!profile.skills || profile.skills.length === 0) return defaultHighlights;

    // Customize the titles based on their skills
    const hasML = profile.skills.some(s => s.name.toLowerCase().includes('ai') || s.name.toLowerCase().includes('machine') || s.name.toLowerCase().includes('data'));
    const hasFrontend = profile.skills.some(s => s.name.toLowerCase().includes('react') || s.name.toLowerCase().includes('front') || s.name.toLowerCase().includes('ui'));
    
    if (hasML) {
      defaultHighlights[0] = { icon: Briefcase, title: 'AI & Data Developer', desc: 'Architecting intelligent matching systems and scalable models.' };
    } else if (hasFrontend) {
      defaultHighlights[0] = { icon: Briefcase, title: 'Frontend Specialist', desc: 'Crafting pixel-perfect, responsive, and intuitive interfaces.' };
    }

    return defaultHighlights;
  }, [profile.skills]);

  // Dynamic Portfolio Metrics
  const metrics = useMemo(() => {
    const projectCount = projects?.length || 0;
    const certCount = certifications?.length || 0;
    
    // Leadership roles
    const leadershipRoles = experience?.filter(e => {
      const pos = e.position.toLowerCase();
      return pos.includes('lead') || pos.includes('founder') || pos.includes('head') || pos.includes('manager') || pos.includes('president') || pos.includes('chief') || pos.includes('director') || pos.includes('co-ordinator');
    }).length || 0;

    // Years learning / working
    let years = 3;
    if (education && education.length > 0) {
      const yearsList = education.map(edu => {
        const start = parseInt(edu.startYear);
        const end = parseInt(edu.endYear);
        if (!isNaN(start) && !isNaN(end)) return end - start;
        return 0;
      });
      years = Math.max(3, ...yearsList);
    }

    return [
      { icon: Folder, value: `${projectCount || 8}+`, label: showcaseLabels.metricLabel },
      { icon: Users, value: `${leadershipRoles || 4}+`, label: 'Leadership Roles' },
      { icon: Award, value: `${certCount || 12}+`, label: 'Certifications' },
      { icon: Calendar, value: `${years || 3}+`, label: 'Years Learning' },
      { icon: Globe, value: '2+', label: 'Communities Impacted' }
    ];
  }, [projects, certifications, experience, education, showcaseLabels]);

  // Leadership Philosophy
  const philosophyText = useMemo(() => {
    if (summary) return summary;
    return "I believe impactful results come from clarity of vision, consistent execution, and a people-first approach. I enjoy transforming ideas into solutions that create value for users and drive meaningful outcomes.";
  }, [summary]);

  // Dynamic Chronological Timeline
  const timelineMilestones = useMemo(() => {
    const milestones: { year: string; title: string; desc: string }[] = [];

    // Parse Education
    if (education) {
      education.forEach(edu => {
        if (edu.startYear) {
          milestones.push({
            year: edu.startYear,
            title: `Started Studies`,
            desc: `Began degree in ${edu.specialization || edu.degree} at ${edu.institution}.`
          });
        }
      });
    }

    // Parse Experience
    if (experience) {
      experience.forEach(exp => {
        if (exp.startDate) {
          const year = exp.startDate.split(' ').pop();
          if (year && !isNaN(parseInt(year))) {
            milestones.push({
              year,
              title: `Joined ${exp.company}`,
              desc: `Began role as ${exp.position}, taking ownership of key deliverables.`
            });
          }
        }
      });
    }

    // Parse Projects
    if (normalizedProjects && normalizedProjects.length > 0) {
      normalizedProjects.slice(0, 2).forEach(p => {
        milestones.push({
          year: '2024',
          title: `${showcaseLabels.actionVerb} ${p.title}`,
          desc: p.description.length > 80 ? p.description.slice(0, 80) + '...' : p.description
        });
      });
    }

    // Sort by Year ascending
    milestones.sort((a, b) => parseInt(a.year) - parseInt(b.year));

    // Dedup years or pad to look complete
    const finalMilestones = milestones.filter((item, idx, self) => 
      self.findIndex(t => t.year === item.year || t.title === item.title) === idx
    ).slice(0, 5);

    while (finalMilestones.length < 5) {
      if (finalMilestones.length === 0) {
        finalMilestones.push({ year: '2022', title: 'Started Journey', desc: 'Began exploring web technologies and software engineering foundations.' });
      } else if (finalMilestones.length === 1) {
        finalMilestones.push({ year: '2023', title: 'Built Core Skillset', desc: 'Explored full-stack technologies and built responsive web applications.' });
      } else if (finalMilestones.length === 2) {
        finalMilestones.push({ year: '2024', title: 'Professional Engagement', desc: 'Completed internships and collaborated with cross-functional teams.' });
      } else if (finalMilestones.length === 3) {
        finalMilestones.push({ year: '2025', title: 'Founded Core Initiatives', desc: 'Led development of specialized tools and optimized production code.' });
      } else {
        finalMilestones.push({ year: 'Future', title: 'Strategic Impact', desc: 'Continuing to build scalable digital solutions and lead technical teams.' });
      }
    }

    // Add Future milestone
    if (!finalMilestones.some(m => m.year.toLowerCase() === 'future')) {
      finalMilestones.push({
        year: 'Future',
        title: 'Strategic Impact',
        desc: 'Continuing to build, lead, and create meaningful technical outcomes.'
      });
    }

    return finalMilestones;
  }, [education, experience, projects]);

  // Social Links
  const socialLinks = useMemo(() => {
    const list: { icon: React.ComponentType<{ size?: number; className?: string }>; href: string; label: string }[] = [];
    if (personalInfo.linkedin) {
      list.push({ icon: Globe, href: `https://${personalInfo.linkedin}`, label: 'LinkedIn' });
    }
    if (personalInfo.github) {
      list.push({ icon: Code, href: `https://${personalInfo.github}`, label: 'GitHub' });
    }
    if (personalInfo.email) {
      list.push({ icon: Mail, href: `mailto:${personalInfo.email}`, label: 'Email' });
    }
    return list;
  }, [personalInfo]);

  // Stagger variants helper
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const }
    }
  };

  const toggles = portfolio.sectionToggles;

  const isSectionEnabled = (key: string, toggles: Record<string, boolean>) => {
    if (key === 'hero' || key === 'stats' || key === 'contact' || key === 'about' || key === 'journey' || key === 'designProcess') return true;
    if (key === 'skills' || key === 'practiceAreas' || key === 'portfolioShowcase' || key === 'campaigns') {
      return toggles.skills !== false;
    }
    if (key === 'projects' || key === 'growthMetrics') {
      return toggles.projects !== false;
    }
    if (key === 'publications') {
      return toggles.publications !== false;
    }
    if (key === 'certifications') {
      return toggles.certifications !== false;
    }
    if (key === 'experience') {
      return toggles.experience !== false;
    }
    if (key === 'education') {
      return toggles.education !== false;
    }
    if (key === 'workSamples') {
      return toggles.workSamples !== false;
    }
    return true;
  };

  const getSectionLabel = (key: string) => {
    if (portfolio.sectionTitles?.[key]) return portfolio.sectionTitles[key];
    
    // Check dynamic slots first
    if (profile.professionalBlueprint) {
      const dynamicSlots = getDynamicSections(profile.professionalBlueprint);
      const matchedSlot = dynamicSlots.find(s => s.id === key);
      // Fallback equivalents
      if (!matchedSlot) {
        if (key === 'practiceAreas' && dynamicSlots.find(s => s.id === 'projects')) return dynamicSlots.find(s => s.id === 'projects')?.label || 'Practice Areas';
        if (key === 'portfolioShowcase' && dynamicSlots.find(s => s.id === 'projects')) return dynamicSlots.find(s => s.id === 'projects')?.label || 'Portfolio Showcase';
        if (key === 'campaigns' && dynamicSlots.find(s => s.id === 'projects')) return dynamicSlots.find(s => s.id === 'projects')?.label || 'Campaigns';
      }
      if (matchedSlot) return matchedSlot.label;
    }

    if (key === 'workSamples') return 'Work Samples';
    if (key === 'practiceAreas') return 'Practice Areas';
    if (key === 'publications') return 'Publications';
    if (key === 'portfolioShowcase') return 'Portfolio Showcase';
    if (key === 'designProcess') return 'Design Process';
    if (key === 'campaigns') return 'Campaigns';
    if (key === 'growthMetrics') return 'Growth Metrics';
    if (key === 'initiatives' || key === 'projects') return 'Initiatives';
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  const blueprint = profile.professionalBlueprint;
  
  const profession = (
    profile.professionCategory || 
    'developer'
  ).toLowerCase();

  const isDeveloper = profession.includes('developer') || profession.includes('data analyst') || profession.includes('tech');
  const isLawyer = profession.includes('law') || profession.includes('legal') || profession.includes('lawyer');
  const isDesigner = profession.includes('design') || profession.includes('designer');
  const isMarketing = profession.includes('marketing');

  let defaultOrder: string[] = [];
  if (blueprint) {
    const dynamicSlots = getDynamicSections(blueprint);
    defaultOrder = ['about', ...dynamicSlots.map(s => s.id)];
    // Ensure achievements/publications etc are there if not fully mapped
    if (!defaultOrder.includes('achievements')) defaultOrder.push('achievements');
  } else {
    if (isDeveloper) {
      defaultOrder = ['about', 'skills', 'projects', 'experience', 'achievements'];
    } else if (isLawyer) {
      defaultOrder = ['about', 'practiceAreas', 'certifications', 'publications', 'experience', 'education'];
    } else if (isDesigner) {
      defaultOrder = ['about', 'portfolioShowcase', 'designProcess', 'projects', 'experience', 'education', 'certifications'];
    } else if (isMarketing) {
      defaultOrder = ['about', 'campaigns', 'growthMetrics', 'experience', 'education', 'certifications'];
    } else {
      defaultOrder = ['about', 'skills', 'projects', 'experience', 'achievements'];
    }
  }

  const order = portfolio.sectionOrder && portfolio.sectionOrder.length > 0 ? portfolio.sectionOrder : defaultOrder;
  const activeOrder = order.filter(key => isSectionEnabled(key, toggles) && key !== 'hero' && key !== 'stats' && key !== 'contact');

  // Stagger fadeInUp animation helper for components
  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, ease: 'easeOut' }
  };

  // --- SUB-RENDERERS ---

  const renderHero = () => (
    <section id="home" className="relative bg-[#030712] text-white pt-24 pb-32 px-6 md:px-12 lg:px-24 overflow-hidden">
      {/* Background Glowing Curves & Hotspot exactly like screenshot */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <svg viewBox="0 0 1440 800" className="w-full h-full object-cover opacity-80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="1440" height="800" fill="#030712" />
          
          {/* Glowing sweep curve (main arc on the right) */}
          <path 
            d="M1000 800 C1100 600 1200 450 1440 280" 
            stroke="url(#glowGradient)" 
            strokeWidth="4" 
            strokeLinecap="round"
            filter="url(#glowFilter)"
          />
          <path 
            d="M1000 800 C1100 600 1200 450 1440 280" 
            stroke="var(--color-primary)" 
            strokeWidth="1.5" 
            strokeLinecap="round"
            opacity="0.9"
          />
          
          {/* Concentric / parallel background thin lines on the right */}
          <path d="M960 800 C1060 590 1170 430 1440 250" stroke="var(--color-primary)" strokeWidth="0.5" opacity="0.15" />
          <path d="M920 800 C1020 580 1140 410 1440 220" stroke="var(--color-primary)" strokeWidth="0.5" opacity="0.1" />
          <path d="M880 800 C980 570 1110 390 1440 190" stroke="var(--color-primary)" strokeWidth="0.5" opacity="0.08" />
          <path d="M1040 800 C1140 610 1230 470 1440 310" stroke="var(--color-primary)" strokeWidth="0.5" opacity="0.12" />
          <path d="M1080 800 C1180 620 1260 490 1440 340" stroke="var(--color-primary)" strokeWidth="0.5" opacity="0.07" />
          
          {/* Fine wavy echo lines on the left side of the screen */}
          <path d="M 0 600 C 150 450 350 350 550 400" stroke="var(--color-primary)" strokeWidth="0.5" opacity="0.06" />
          <path d="M -50 630 C 100 470 300 370 500 420" stroke="var(--color-primary)" strokeWidth="0.5" opacity="0.04" />
          <path d="M -100 660 C 50 490 250 390 450 440" stroke="var(--color-primary)" strokeWidth="0.5" opacity="0.03" />

          {/* Glowing hotspot (the bright light burst on the main arc) */}
          <circle cx="1200" cy="460" r="3" fill="#ffffff" />
          <circle cx="1200" cy="460" r="25" fill="var(--color-primary)" opacity="0.4" filter="url(#glowFilter)" />
          <circle cx="1200" cy="460" r="60" fill="var(--color-primary)" opacity="0.15" filter="url(#glowFilter)" />

          <defs>
            <linearGradient id="glowGradient" x1="1000" y1="800" x2="1440" y2="280" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0" />
              <stop offset="40%" stopColor="var(--color-primary)" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="85%" stopColor="var(--color-primary)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            </linearGradient>
            
            <filter id="glowFilter" x="900" y="200" width="600" height="700" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Core Identity */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' as const }}
          className="lg:col-span-7 space-y-6"
        >
          <div className="text-[11px] font-medium tracking-[0.25em] text-[var(--color-primary)]/80 uppercase">
            {categoryLabel}
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-normal text-white leading-[0.95] font-executive-serif uppercase flex flex-col mt-4">
            <span className="text-white">{firstName}</span>
            {lastName && <span className="text-[var(--color-primary)]">{lastName}</span>}
          </h1>

          <div className="w-16 h-[2px] bg-[var(--color-primary)] my-6 opacity-95"></div>
          
          <p className="text-slate-300 text-sm md:text-[15px] leading-relaxed font-light max-w-lg">
            Building products, leading initiatives, and creating impact through technology and strategic execution.
          </p>

          <div className="flex flex-wrap gap-4 pt-6">
            <motion.a 
              whileHover={{ y: -3, backgroundColor: '#e5b982' }}
              whileTap={{ scale: 0.97 }}
              href="#initiatives" 
              className="px-7 py-3 bg-[var(--color-primary)] text-[#040814] rounded-md font-extrabold text-[11px] uppercase tracking-[0.15em] transition-all duration-300 shadow-lg shadow-[var(--color-primary)]/5 flex items-center gap-2 cursor-pointer z-10 font-executive-sans"
            >
              View My Work <ArrowRight size={13} strokeWidth={2.5} />
            </motion.a>
            <motion.a 
              whileHover={{ y: -3, backgroundColor: 'rgba(223, 171, 108, 0.1)' }}
              whileTap={{ scale: 0.97 }}
              href={`mailto:${personalInfo.email}`}
              className="px-7 py-3 border border-[var(--color-primary)] hover:text-[var(--color-primary)] text-white rounded-md font-extrabold text-[11px] uppercase tracking-[0.15em] transition-all duration-300 flex items-center gap-2 cursor-pointer z-10 font-executive-sans"
            >
              Download Resume <Download size={13} strokeWidth={2.5} className="text-[var(--color-primary)]" />
            </motion.a>
          </div>
        </motion.div>

        {/* Right Column: Executive Highlights - Bordered separator layout */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' as const }}
          className="lg:col-span-5 lg:border-l lg:border-white/10 lg:pl-12 xl:pl-16 space-y-6 relative z-10"
        >
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] mb-4">
            Executive Highlights
          </h3>
          
          <div className="space-y-5">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1, duration: 0.4 }}
                  key={idx} 
                  className="flex gap-4 items-start"
                >
                  <div className="w-10 h-10 rounded-full border border-[var(--color-primary)]/40 text-[var(--color-primary)] flex items-center justify-center shrink-0 mt-0.5 bg-transparent hover:scale-110 transition-transform">
                    <Icon size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-normal">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );

  const renderStats = () => (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative -mt-16 px-6 md:px-12 z-20"
      key="stats"
    >
      <div className="max-w-7xl mx-auto bg-white border border-stone-200/50 rounded-[var(--radius-card)] py-8 px-6 shadow-xl grid grid-cols-2 md:grid-cols-5 gap-6 divide-y md:divide-y-0 md:divide-x divide-stone-200/60">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <motion.div 
              whileHover={{ scale: 1.02 }}
              key={idx} 
              className="flex flex-col items-center justify-center text-center md:first:pl-0 md:pl-4 transition-transform"
            >
              <div className="text-slate-800 flex items-center justify-center mb-3">
                <Icon size={24} strokeWidth={1.5} />
              </div>
              <span className="text-3xl font-bold text-[#0B132A] font-executive-serif tracking-tight">{m.value}</span>
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-[0.1em] mt-1.5">{m.label}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

  const renderAbout = () => (
    <section id="about" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto scroll-mt-24 space-y-16" key="about">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Section title */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-3 shrink-0"
        >
          <h2 className="text-xl font-bold text-[#0B132A] uppercase tracking-wider font-executive-serif leading-tight">
            LEADERSHIP<br />PHILOSOPHY
          </h2>
          <div className="w-8 h-[3px] bg-[var(--color-primary)] mt-3"></div>
        </motion.div>
        
        {/* Quote & Content */}
        <div className="lg:col-span-9">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative pl-12 md:pl-16 pt-2"
          >
            <span className="absolute left-0 top-0 text-7xl font-serif text-[var(--color-primary)] leading-none opacity-80 select-none">“</span>
            <p className="text-lg md:text-[20px] font-executive-serif text-slate-800 leading-relaxed italic font-medium">
              {philosophyText}
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* 4 Pillars */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 divide-y md:divide-y-0 md:divide-x divide-stone-200/60"
      >
        {[
          { icon: User, title: 'Ownership', desc: 'I take complete ownership of ideas and see them through execution.' },
          { icon: Lightbulb, title: 'Impact', desc: 'I focus on building solutions that create measurable and meaningful impact.' },
          { icon: Users, title: 'Growth', desc: 'I believe in continuous learning and improving every single day.' },
          { icon: Compass, title: 'Integrity', desc: 'I value transparency, honesty and building trust in everything I do.' }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div 
              variants={fadeInUpVariants}
              key={idx} 
              className="flex gap-4 items-start px-2 first:pl-0 md:pl-6"
            >
              <div className="w-12 h-12 rounded-full border border-[var(--color-primary)] text-[var(--color-primary)] flex items-center justify-center shrink-0 bg-transparent hover:scale-105 transition-transform duration-300">
                <Icon size={20} strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#0B132A] tracking-wide">{item.title}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-light">{item.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );

  const renderJourney = () => (
    <section className="py-12 px-6 md:px-12 lg:px-24 bg-[#FAF8F5]" key="journey">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7 }}
          className="bg-white border border-stone-200/60 rounded-[var(--radius-card)] p-8 md:p-12 shadow-sm flex flex-col lg:flex-row gap-12 items-center lg:items-start"
        >
          {/* Title Block */}
          <div className="lg:w-1/4 shrink-0 text-center lg:text-left self-center lg:self-start">
            <h2 className="text-2xl font-bold text-[#0B132A] uppercase tracking-wider font-executive-serif leading-tight">
              IMPACT<br />JOURNEY
            </h2>
            <div className="w-8 h-[3px] bg-[var(--color-primary)] mt-3 mx-auto lg:mx-0"></div>
          </div>

          {/* Timeline Block */}
          <div className="lg:w-3/4 w-full relative pt-6">
            {/* Background Connecting Line */}
            <div className="hidden md:block absolute top-[10px] left-[calc(100%/12)] right-2 h-[1px] bg-stone-200/80 z-0">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-stone-400 rotate-45"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-8 md:gap-4 relative z-10">
              {timelineMilestones.map((m, idx) => (
                <div key={idx} className="relative flex flex-col items-center md:items-start text-center md:text-left w-full group">
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 180, damping: 12, delay: idx * 0.08 }}
                    className="w-5 h-5 rounded-full bg-white border-4 border-[var(--color-primary)] flex items-center justify-center z-10 mb-4 shadow-sm shrink-0 mx-auto md:mx-0"
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 + 0.1 }}
                    className="mb-1.5 z-10"
                  >
                    <span className="text-xs font-bold text-slate-800 tracking-wide">{m.year}</span>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.08 + 0.2 }}
                    className="z-10"
                  >
                    <p className="text-[10px] text-slate-500 leading-normal max-w-[130px] mx-auto md:mx-0 font-medium font-executive-sans">
                      {m.desc}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );

  const renderProjects = () => {
    const title = getSectionLabel('projects');
    return (
      <section id="initiatives" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto scroll-mt-24" key="projects">
        <div className="flex justify-between items-end border-b border-stone-200 pb-4 mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-lg font-bold text-[#0B132A] uppercase tracking-widest font-executive-serif border-b-2 border-[var(--color-primary)] pb-2 inline-block"
          >
            {title}
          </motion.h2>
          <a href="#initiatives" className="text-xs font-bold text-[var(--color-primary)] hover:text-[#0B132A] transition-colors flex items-center gap-1.5">
            VIEW ALL {showcaseLabels.sectionTitle.toUpperCase()} <ArrowRight size={14} />
          </a>
        </div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          {normalizedProjects?.slice(0, visibleProjectsCount).map((proj, idx) => (
            <motion.div 
              variants={fadeInUpVariants}
              whileHover={{ y: -6, boxShadow: '0 12px 30px rgba(0,0,0,0.06)' }}
              key={idx} 
              className="bg-white border border-stone-200/50 rounded-[var(--radius-card)] overflow-hidden shadow-sm hover:shadow-lg hover:border-[var(--color-primary)]/20 transition-all duration-300 flex flex-col h-full group"
            >
              <div className="h-44 bg-[#0B132A] border-b border-stone-100 p-5 flex flex-col justify-between relative overflow-hidden shrink-0">
                <div className="absolute right-0 top-0 w-36 h-36 bg-[var(--color-primary)]/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/70"></div>
                </div>
                <div className="text-white relative z-10 space-y-1">
                  <span className="text-[9px] font-bold text-[var(--color-primary)] tracking-widest uppercase">{showcaseLabels.itemLabel}</span>
                  <h4 className="text-lg font-bold font-executive-serif leading-tight">{proj.title}</h4>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-[11px] text-slate-500 mb-4 flex-grow leading-relaxed">
                  {proj.description.length > 150 ? proj.description.slice(0, 150) + '...' : proj.description}
                </p>
                {(proj as any).achievements && (proj as any).achievements.length > 0 && (
                  <ul className="space-y-1.5 mb-6 flex-grow">
                    {(proj as any).achievements.slice(0, 3).map((bullet: string, bIdx: number) => (
                      <li key={bIdx} className="relative pl-3 before:content-['•'] before:absolute before:left-0 before:text-[var(--color-primary)] text-[10px] text-slate-500 leading-relaxed font-light">{bullet}</li>
                    ))}
                  </ul>
                )}
                {proj.techStack && proj.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6 shrink-0">
                    {proj.techStack.slice(0, 4).map((tech: string, tIdx: number) => (
                      <span key={tIdx} className="text-[9px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md uppercase tracking-wider">{tech}</span>
                    ))}
                  </div>
                )}
                <button 
                  onClick={() => setActiveProject(proj)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-stone-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 text-[10px] font-bold text-[#0B132A] uppercase tracking-wider transition-colors cursor-pointer mt-auto"
                >
                  View Case Study <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {(normalizedProjects?.length || 0) > visibleProjectsCount && (
          <div className="flex justify-center mt-12">
            <button 
              onClick={() => setVisibleProjectsCount(prev => prev + 4)}
              className="px-8 py-3 rounded-md font-bold text-xs uppercase tracking-wider transition-colors bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20"
            >
              Show More Initiatives
            </button>
          </div>
        )}
      </section>
    );
  };

  const renderExperience = () => (
    <section id="experience" className="bg-[#FAF8F5] border-t border-b border-stone-200/60 py-24 px-6 md:px-12 lg:px-24 scroll-mt-24" key="experience">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-3 shrink-0 text-center lg:text-left self-center lg:self-start"
        >
          <h2 className="text-2xl font-bold text-[#0B132A] uppercase tracking-wider font-executive-serif leading-tight">
            {getSectionLabel('experience').toUpperCase()}
          </h2>
          <div className="w-8 h-[3px] bg-[var(--color-primary)] mt-3 mx-auto lg:mx-0"></div>
        </motion.div>
        
        <div className="lg:col-span-9 relative">
          <div className="absolute left-6 top-6 bottom-6 w-[1.5px] bg-stone-200/80 z-0"></div>
          <div className="space-y-12">
            {experience?.map((exp, idx) => {
              const Icon = (() => {
                const pos = exp.position.toLowerCase();
                if (pos.includes('founder') || pos.includes('ceo') || pos.includes('co-founder') || pos.includes('president') || pos.includes('chief') || pos.includes('owner')) {
                  return Flag;
                }
                if (pos.includes('lead') || pos.includes('manager') || pos.includes('head') || pos.includes('coordinator') || pos.includes('co-ordinator') || pos.includes('director') || pos.includes('member')) {
                  return Users;
                }
                return Briefcase;
              })();

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.12 }}
                  key={idx} 
                  className="flex gap-6 items-start relative z-10"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10, delay: idx * 0.12 + 0.15 }}
                    className="w-12 h-12 rounded-full bg-[var(--color-bg)] border-2 border-[var(--color-primary)] flex items-center justify-center shrink-0 shadow-md z-10 relative"
                  >
                    <Icon className="text-[var(--color-primary)]" size={18} strokeWidth={1.5} />
                  </motion.div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full ml-2">
                    <div className="md:col-span-4 space-y-1 self-center md:self-start">
                      <h3 className="text-sm font-bold text-[#0B132A] leading-tight font-executive-sans">{exp.position}</h3>
                      <div className="text-xs text-slate-500 font-medium">{exp.company}</div>
                      <div className="text-[11px] text-slate-400 font-semibold">{exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}</div>
                      {(exp as any).location && <div className="text-[10px] text-slate-400 italic font-medium mt-0.5">{(exp as any).location}</div>}
                    </div>
                    
                    <div className="md:col-span-8 md:border-l md:border-stone-200/80 md:pl-8">
                      <ul className="list-disc pl-4 space-y-2 text-[12px] text-slate-600 leading-relaxed font-executive-sans">
                        {exp.achievements?.map((bullet, bIdx) => (
                          <li key={bIdx} className="pl-1">{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );

  const renderAchievements = () => (
    <section id="achievements" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto scroll-mt-24" key="achievements">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={containerVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-12"
      >
        {/* Achievements Column */}
        <motion.div variants={fadeInUpVariants} className="space-y-6">
          <h3 className="text-sm font-bold text-[#0B132A] uppercase tracking-widest border-b border-[var(--color-primary)] pb-2">
            Achievements
          </h3>
          <ul className="space-y-4">
            {achievements?.map((ach: string | Achievement, idx: number) => {
              const text = typeof ach === 'string' ? ach : (ach.title || ach.description || '');
              return (
                <motion.li 
                  whileHover={{ x: 3 }}
                  key={idx} 
                  className="flex gap-3 items-start transition-transform"
                >
                  <div className="w-7 h-7 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0 mt-0.5">
                    <Trophy size={12} />
                  </div>
                  <span className="text-[11px] text-slate-700 leading-normal font-medium">{text}</span>
                </motion.li>
              );
            })}
            {(!achievements || achievements.length === 0) && (
              <li className="text-[11px] text-slate-400 italic">No achievements specified.</li>
            )}
          </ul>
        </motion.div>

        {/* Certifications Column */}
        <motion.div variants={fadeInUpVariants} className="space-y-6">
          <h3 className="text-sm font-bold text-[#0B132A] uppercase tracking-widest border-b border-[var(--color-primary)] pb-2">
            Certifications
          </h3>
          <ul className="space-y-4">
            {certifications?.map((cert, idx) => (
              <motion.li 
                whileHover={{ x: 3 }}
                key={idx} 
                className="flex gap-3 items-start transition-transform"
              >
                <div className="w-7 h-7 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0 mt-0.5">
                  <Award size={12} />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-[#0B132A] leading-tight">{typeof cert === 'string' ? cert : (cert.title || (cert as any).name)}</h4>
                  <p className="text-[10px] text-slate-500">{typeof cert === 'string' ? '' : cert.issuer} {cert.issueDate ? `(${typeof cert === 'string' ? '' : cert.issueDate})` : ''}</p>
                </div>
              </motion.li>
            ))}
            {(!certifications || certifications.length === 0) && (
              <li className="text-[11px] text-slate-400 italic">No certifications specified.</li>
            )}
          </ul>
        </motion.div>

        {/* Education Column */}
        <motion.div variants={fadeInUpVariants} className="space-y-6">
          <h3 className="text-sm font-bold text-[#0B132A] uppercase tracking-widest border-b border-[var(--color-primary)] pb-2">
            Education
          </h3>
          <div className="space-y-6">
            {education?.map((edu, idx) => (
              <motion.div 
                whileHover={{ y: -4 }}
                key={idx} 
                className="bg-white border border-stone-200/50 rounded-[var(--radius-card)] p-5 shadow-sm flex justify-between items-start gap-4 transition-transform duration-300"
              >
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-slate-50 text-[var(--color-primary)] flex items-center justify-center shrink-0">
                    <BookOpen size={14} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-[#0B132A] leading-tight">{edu.degree}</h4>
                    <p className="text-[10px] text-slate-600 font-medium">{edu.institution}</p>
                    <p className="text-[9px] text-slate-400 font-semibold">{edu.startYear} – {edu.endYear}</p>
                    {(edu.cgpa || (edu as any).grade) && (
                      <p className="text-[9px] text-[var(--color-primary)] font-bold mt-1">Grade/CGPA: {edu.cgpa || (edu as any).grade}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            {(!education || education.length === 0) && (
              <p className="text-[11px] text-slate-400 italic">No education specified.</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );

  const renderPracticeAreas = () => {
    const practiceAreasList = profile.extensions?.practiceAreas || [];
    if (practiceAreasList.length === 0) return null;
    return (
      <section id="practiceAreas" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto scroll-mt-24" key="practiceAreas">
        <div className="flex justify-between items-end border-b border-stone-200 pb-4 mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-lg font-bold text-[#0B132A] uppercase tracking-widest font-executive-serif border-b-2 border-[var(--color-primary)] pb-2 inline-block"
          >
            Practice Areas
          </motion.h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {practiceAreasList.map((area, idx) => (
            <div key={idx} className="bg-white border border-stone-200/50 rounded-[var(--radius-card)] p-6 shadow-sm hover:shadow-lg hover:border-[var(--color-primary)]/20 transition-all duration-300 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-[var(--color-primary)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                <Shield size={20} strokeWidth={1.5} />
              </div>
              <h4 className="font-bold text-[#0B132A] text-lg font-executive-sans">{area}</h4>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderPublications = () => {
    const publicationsList = profile.publications || [];
    if (publicationsList.length === 0) return null;
    return (
      <section id="publications" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto scroll-mt-24" key="publications">
        <div className="flex justify-between items-end border-b border-stone-200 pb-4 mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-lg font-bold text-[#0B132A] uppercase tracking-widest font-executive-serif border-b-2 border-[var(--color-primary)] pb-2 inline-block"
          >
            Publications
          </motion.h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {publicationsList.map((pub, idx) => (
            <div key={idx} className="bg-white border border-stone-200/50 rounded-[var(--radius-card)] p-6 shadow-sm hover:shadow-lg hover:border-[var(--color-primary)]/20 transition-all duration-300 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full border border-[var(--color-primary)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                <BookOpen size={20} strokeWidth={1.5} />
              </div>
              <p className="text-slate-700 text-sm font-medium font-executive-sans leading-relaxed">{pub}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderPortfolioShowcase = () => {
    const workSamplesList = profile.workSamples || [];
    const behanceUrl = profile.extensions?.behance;
    const dribbbleUrl = profile.extensions?.dribbble;
    if (workSamplesList.length === 0 && !behanceUrl && !dribbbleUrl) return null;
    return (
      <section id="portfolioShowcase" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto scroll-mt-24" key="portfolioShowcase">
        <div className="flex justify-between items-end border-b border-stone-200 pb-4 mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-lg font-bold text-[#0B132A] uppercase tracking-widest font-executive-serif border-b-2 border-[var(--color-primary)] pb-2 inline-block"
          >
            Portfolio Showcase
          </motion.h2>
        </div>
        {(behanceUrl || dribbbleUrl) && (
          <div className="flex flex-wrap gap-4 mb-8">
            {behanceUrl && (
              <a href={behanceUrl} target="_blank" rel="noreferrer" className="px-6 py-2.5 border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5">
                <Globe size={14} /> Behance Portfolio
              </a>
            )}
            {dribbbleUrl && (
              <a href={dribbbleUrl} target="_blank" rel="noreferrer" className="px-6 py-2.5 border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5">
                <Globe size={14} /> Dribbble Portfolio
              </a>
            )}
          </div>
        )}
        {workSamplesList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {workSamplesList.map((sample, idx) => (
              <div key={idx} className="bg-white border border-stone-200/50 rounded-[var(--radius-card)] p-6 shadow-sm hover:shadow-lg hover:border-[var(--color-primary)]/20 transition-all duration-300 space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-[#0B132A] text-xl font-executive-sans">{sample.title}</h4>
                  {sample.url && (
                    <a href={sample.url} target="_blank" rel="noreferrer" className="text-[var(--color-primary)] hover:text-[#c99557]">
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
                {sample.description && <p className="text-slate-500 text-xs font-light font-executive-sans leading-relaxed">{sample.description}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

  const renderDesignProcess = () => {
    const designTools = profile.extensions?.tools || ['User Research', 'Wireframing', 'UI Design', 'Prototyping', 'Usability Testing'];
    return (
      <section id="designProcess" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto scroll-mt-24" key="designProcess">
        <div className="flex justify-between items-end border-b border-stone-200 pb-4 mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-lg font-bold text-[#0B132A] uppercase tracking-widest font-executive-serif border-b-2 border-[var(--color-primary)] pb-2 inline-block"
          >
            Design Process & Tools
          </motion.h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {designTools.map((tool, idx) => (
            <div key={idx} className="px-5 py-3 border border-stone-200/60 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 bg-white hover:border-[var(--color-primary)]/40 transition-colors">
              {tool}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderCampaigns = () => {
    const campaignsList = profile.extensions?.campaigns || [];
    if (campaignsList.length === 0) return null;
    return (
      <section id="campaigns" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto scroll-mt-24" key="campaigns">
        <div className="flex justify-between items-end border-b border-stone-200 pb-4 mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-lg font-bold text-[#0B132A] uppercase tracking-widest font-executive-serif border-b-2 border-[var(--color-primary)] pb-2 inline-block"
          >
            Campaigns
          </motion.h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {campaignsList.map((camp, idx) => (
            <div key={idx} className="bg-white border border-stone-200/50 rounded-[var(--radius-card)] p-6 shadow-sm hover:shadow-lg hover:border-[var(--color-primary)]/20 transition-all duration-300 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full border border-[var(--color-primary)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                <Zap size={20} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-bold text-[#0B132A] text-lg font-executive-sans leading-tight">{camp}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderGrowthMetrics = () => {
    const growthMetricsList = profile.extensions?.growthMetrics || [];
    if (growthMetricsList.length === 0) return null;
    return (
      <section id="growthMetrics" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto scroll-mt-24" key="growthMetrics">
        <div className="flex justify-between items-end border-b border-stone-200 pb-4 mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-lg font-bold text-[#0B132A] uppercase tracking-widest font-executive-serif border-b-2 border-[var(--color-primary)] pb-2 inline-block"
          >
            Growth Metrics
          </motion.h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {growthMetricsList.map((metric, idx) => (
            <div key={idx} className="bg-white border border-stone-200/50 rounded-[var(--radius-card)] p-6 shadow-sm hover:shadow-lg hover:border-[var(--color-primary)]/20 transition-all duration-300 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-[var(--color-primary)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                <TrendingUp size={20} strokeWidth={1.5} />
              </div>
              <h4 className="font-bold text-[#0B132A] text-lg font-executive-sans leading-tight">{metric}</h4>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderSkillsList = () => {
    if (!profile.skills || profile.skills.length === 0) return null;
    return (
      <section id="skills" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto scroll-mt-24" key="skills">
        <div className="flex justify-between items-end border-b border-stone-200 pb-4 mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-lg font-bold text-[#0B132A] uppercase tracking-widest font-executive-serif border-b-2 border-[var(--color-primary)] pb-2 inline-block"
          >
            Skills
          </motion.h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {profile.skills.map((s, idx) => (
            <div key={idx} className="px-5 py-3 border border-stone-200/60 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 bg-white hover:border-[var(--color-primary)]/40 transition-colors">
              {s.name}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderCertificationsOnly = () => {
    if (!profile.certifications || profile.certifications.length === 0) return null;
    return (
      <section id="certifications" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto scroll-mt-24" key="certifications">
        <div className="flex justify-between items-end border-b border-stone-200 pb-4 mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-lg font-bold text-[#0B132A] uppercase tracking-widest font-executive-serif border-b-2 border-[var(--color-primary)] pb-2 inline-block"
          >
            Certifications
          </motion.h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.certifications.map((cert, idx) => (
            <div key={idx} className="bg-white border border-stone-200/50 rounded-[var(--radius-card)] p-5 shadow-sm flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-50 text-[var(--color-primary)] flex items-center justify-center shrink-0">
                <Award size={14} />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-[#0B132A] leading-tight">{typeof cert === 'string' ? cert : (cert.title || (cert as any).name)}</h4>
                <p className="text-[10px] text-slate-600 font-medium">{typeof cert === 'string' ? '' : cert.issuer} {cert.issueDate ? `(${typeof cert === 'string' ? '' : cert.issueDate})` : ''}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderEducationOnly = () => {
    if (!profile.education || profile.education.length === 0) return null;
    return (
      <section id="education" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto scroll-mt-24" key="education">
        <div className="flex justify-between items-end border-b border-stone-200 pb-4 mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-lg font-bold text-[#0B132A] uppercase tracking-widest font-executive-serif border-b-2 border-[var(--color-primary)] pb-2 inline-block"
          >
            Education
          </motion.h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.education.map((edu, idx) => (
            <div key={idx} className="bg-white border border-stone-200/50 rounded-[var(--radius-card)] p-5 shadow-sm flex justify-between items-start gap-4">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-slate-50 text-[var(--color-primary)] flex items-center justify-center shrink-0">
                  <BookOpen size={14} />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-[#0B132A] leading-tight">{edu.degree}</h4>
                   <p className="text-[10px] text-slate-600 font-medium">{edu.institution}</p>
                   <p className="text-[9px] text-slate-400 font-semibold">{edu.startYear} – {edu.endYear}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const sectionMap: Record<string, () => React.ReactNode> = {
    about: () => renderAbout(),
    journey: () => renderJourney(),
    projects: () => renderProjects(),
    initiatives: () => renderProjects(),
    experience: () => renderExperience(),
    achievements: () => renderAchievements(),
    skills: () => renderSkillsList(),
    practiceAreas: () => renderPracticeAreas(),
    publications: () => renderPublications(),
    portfolioShowcase: () => renderPortfolioShowcase(),
    designProcess: () => renderDesignProcess(),
    campaigns: () => renderCampaigns(),
    growthMetrics: () => renderGrowthMetrics(),
    certifications: () => renderCertificationsOnly(),
    education: () => renderEducationOnly(),
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 font-executive-sans selection:bg-[var(--color-primary)]/20 overflow-x-hidden relative">
      {/* Import Premium Fonts */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('${dna.tokens.typography.importUrl}');
        .font-executive-serif { font-family: var(--font-heading); }
        .font-executive-sans { font-family: var(--font-body); }
        html { scroll-behavior: smooth !important; }
      `}} />

      {/* Navigation */}
      <nav className="bg-[var(--color-bg)]/95 backdrop-blur-md sticky top-0 z-50 border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-1">
          <span className="font-executive-serif font-bold text-2xl tracking-widest text-[var(--color-primary)] cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {firstName.toUpperCase()}
            <span className="text-[var(--color-primary)]">.</span>
          </span>
        </div>
        
        <div className="hidden lg:flex flex-wrap justify-center items-center gap-4 lg:gap-6 text-[10px] lg:text-[11px] font-bold tracking-widest text-slate-300 uppercase relative animate-fade-in">
          <a href="#home" className="hover:text-[var(--color-primary)] transition-all py-1">HOME</a>
          {activeOrder
            .filter(key => !['education', 'certifications', 'publications', 'achievements'].includes(key))
            .slice(0, 5)
            .map((key) => {
              const label = getSectionLabel(key);
              return (
                <a key={key} href={`#${key}`} className="hover:text-[var(--color-primary)] transition-all py-1">
                  {label.toUpperCase()}
                </a>
              );
          })}
        </div>

        <motion.a 
          whileHover={{ scale: 1.03, backgroundColor: 'rgba(223, 171, 108, 0.1)' }}
          whileTap={{ scale: 0.98 }}
          href={`mailto:${personalInfo.email}`}
          className="border border-[var(--color-primary)] text-[var(--color-primary)] px-5 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
        >
          LET'S CONNECT <ArrowRight size={12} />
        </motion.a>
      </nav>

      {/* Hero Section */}
      {renderHero()}

      {/* Floating Metrics bar */}
      {renderStats()}

      {/* Dynamically ordered sections */}
      {activeOrder.map(key => {
        const renderer = sectionMap[key];
        return renderer ? <React.Fragment key={key}>{renderer()}</React.Fragment> : null;
      })}

      {/* Footer / Contact Card Section */}
      <footer id="contact" className="bg-[#FAF8F5] py-12 px-6 md:px-12 lg:px-24 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-[#030712] text-white rounded-[var(--radius-card)] p-8 md:p-12 relative overflow-hidden"
          >
            {/* Glow effect */}
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-between relative z-10 pb-8 border-b border-white/5 lg:border-b-0">
              
              {/* Left Block (Intro + CTA Button side-by-side on desktop) */}
              <div className="w-full lg:w-[70%] flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="space-y-3 max-w-xl text-left">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">LET'S BUILD SOMETHING</span>
                  <h3 className="text-3xl md:text-4xl font-bold font-executive-serif leading-none text-white">Meaningful Together.</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    I'm always open to discussing new opportunities, collaborations and impactful ideas.
                  </p>
                </div>
                
                <motion.a 
                  whileHover={{ scale: 1.02, backgroundColor: '#e5b982' }}
                  whileTap={{ scale: 0.97 }}
                  href={`mailto:${personalInfo.email}`}
                  className="bg-[var(--color-primary)] hover:bg-[#c99557] text-[#030712] px-6 py-3 rounded-md text-[10px] font-extrabold uppercase tracking-[0.15em] transition-colors shadow-lg shadow-[var(--color-primary)]/5 flex items-center gap-2 cursor-pointer shrink-0 font-executive-sans self-start md:self-center"
                >
                  Get In Touch <span className="font-sans">→</span>
                </motion.a>
              </div>

              {/* Vertical Divider Line */}
              <div className="hidden lg:block w-[1px] bg-white/10 self-stretch my-2"></div>

              {/* Right Block (Let's Connect + Social Icons) */}
              <div className="w-full lg:w-[25%] flex flex-col items-center lg:items-start gap-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">LET'S CONNECT</span>
                <div className="flex gap-4">
                  {/* LinkedIn */}
                  {personalInfo.linkedin && (
                    <a 
                      href={`https://${personalInfo.linkedin}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[var(--color-primary)] hover:text-white transition-colors p-1"
                      title="LinkedIn"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                  )}

                  {/* GitHub */}
                  {personalInfo.github && (
                    <a 
                      href={`https://${personalInfo.github}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[var(--color-primary)] hover:text-white transition-colors p-1"
                      title="GitHub"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                        <path d="M9 18c-4.51 2-5-2-7-2" />
                      </svg>
                    </a>
                  )}

                  {/* Email */}
                  {personalInfo.email && (
                    <a 
                      href={`mailto:${personalInfo.email}`} 
                      className="text-[var(--color-primary)] hover:text-white transition-colors p-1"
                      title="Email"
                    >
                      <Mail className="w-5 h-5" strokeWidth={1.5} />
                    </a>
                  )}

                  {/* Location Pin */}
                  {personalInfo.location && (
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(personalInfo.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-primary)] hover:text-white transition-colors p-1"
                      title={personalInfo.location}
                    >
                      <MapPin className="w-5 h-5" strokeWidth={1.5} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom copyright centered */}
            <div className="border-t border-white/5 pt-6 text-center relative z-10">
              <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                &copy; {new Date().getFullYear()} {personalInfo.fullName}. All rights reserved.
              </span>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Case Study Modal */}
      <AnimatePresence>
        {activeProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0B132A]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6"
            onClick={() => setActiveProject(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-[var(--radius-card)] overflow-hidden max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-stone-200/50 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Banner */}
              <div className="bg-[#0B132A] text-white p-6 md:p-8 flex justify-between items-start relative overflow-hidden border-b border-stone-100">
                <div className="absolute right-0 top-0 w-32 h-32 bg-[var(--color-primary)]/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="space-y-1.5 relative z-10">
                  <span className="text-[9px] font-bold text-[var(--color-primary)] tracking-widest uppercase">Executive Case Study</span>
                  <h3 className="text-2xl font-bold font-executive-serif">{activeProject.name}</h3>
                </div>
                <button 
                  onClick={() => setActiveProject(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer relative z-10"
                >
                  <X size={16} />
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="p-6 md:p-8 space-y-6">
                {/* Challenge */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest">The Challenge</h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-serif">
                    {activeProject.problemSolved || activeProject.description || "Designing a digital workspace that streamlines user activity while providing exceptional security and speed."}
                  </p>
                </div>

                {/* Approach */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest">The Approach</h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-serif">
                    {activeProject.description.split('. ')[0] ? `${activeProject.description.split('. ')[0]}. Focused on creating modular, reusable workflows to ensure code health and simple maintainability.` : "Approached execution by mapping requirements, focusing on decoupled server layers, and drafting comprehensive layouts."}
                  </p>
                </div>

                {/* Execution */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest">Execution</h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-serif">
                    {activeProject.technologies && activeProject.technologies.length > 0
                      ? `Utilized a robust tech stack including ${activeProject.technologies.join(', ')} to construct modern API integrations, manage asynchronous operations, and verify responsive design.`
                      : "Utilized modern tools and modular workflows to engineer system endpoints, establish test cases, and launch the portal."}
                  </p>
                </div>

                {/* Outcome */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest">Outcome & Impact</h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-serif">
                    {activeProject.impact || "Successfully built and deployed the system, meeting timeline guidelines and exceeding performance expectations with clean code standards."}
                  </p>
                </div>

                {/* Tech Stack */}
                {activeProject.technologies && activeProject.technologies.length > 0 && (
                  <div className="pt-4 border-t border-stone-100 flex flex-wrap gap-1.5">
                    {activeProject.technologies.map((tech: string, idx: number) => (
                      <span key={idx} className="text-[9px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md uppercase tracking-wider">{tech}</span>
                    ))}
                  </div>
                )}
                
                {/* External links */}
                {(activeProject.liveUrl || activeProject.githubUrl) && (
                  <div className="pt-4 border-t border-stone-100 flex gap-4">
                    {activeProject.liveUrl && (
                      <a href={activeProject.liveUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1.5">
                        <Globe size={14} /> Visit Website <ExternalLink size={12} />
                      </a>
                    )}
                    {activeProject.githubUrl && (
                      <a href={activeProject.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-slate-500 hover:text-slate-900 hover:underline flex items-center gap-1.5">
                        <Code size={14} /> GitHub Repository <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
