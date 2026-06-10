'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, MapPin, ExternalLink, Calendar, Award, Code, Globe, 
  Briefcase, Target, Compass, Zap, Folder, Users, Trophy, BookOpen, 
  ArrowRight, Download, X, Send, Eye, Shield, TrendingUp, User, Lightbulb, 
  Flag, Sparkles, Layers, Cpu, Check, RefreshCw, Moon, Sun, ArrowUpRight,
  Search, EyeOff, LayoutTemplate, HelpCircle, Activity, Kanban
} from 'lucide-react';
import { CareerProfile, Portfolio, Project } from '@/db/local-db';
import { normalizeShowcaseItems } from '@/lib/normalization-layer';
import { getShowcaseLabels } from '@/lib/label-mapping';
import { getDynamicSections } from '@/lib/blueprint-engine';
import { getVisualDNA } from '@/lib/visual-dna';

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
}

export interface BuilderProject {
  name: string;
  category?: string;
  description: string;
  role?: string;
  technologies: string[];
  problemSolved: string;
  impact: string;
  mockupType?: string;
  liveUrl: string;
  githubUrl?: string;
}

interface Props {
  profile: CareerProfile;
  portfolio: Portfolio;
}

export default function ProductBuilderTemplate({ profile, portfolio }: Props) {
  const { personalInfo, summary, experience, education, projects, certifications, achievements } = profile;
  const [activeProject, setActiveProject] = useState<any>(null);
  const [visibleProjectsCount, setVisibleProjectsCount] = useState(4);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const normalizedProjects = useMemo(() => normalizeShowcaseItems(profile), [profile]);
  const showcaseLabels = useMemo(() => getShowcaseLabels(profile.professionCategory), [profile.professionCategory]);

  // Split name for visual display
  const dna = useMemo(() => getVisualDNA(profile.professionalBlueprint), [profile.professionalBlueprint]);

  const { firstName, lastName } = useMemo(() => {
    const parts = (personalInfo.fullName || '').trim().split(' ');
    return {
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || ''
    };
  }, [personalInfo.fullName]);

  // Product Builder highlights (Outcome/capability-oriented default strengths)
  const builderHighlights = useMemo(() => {
    return [
      { icon: Lightbulb, title: 'Product Mindset', desc: 'I think like a builder, not just a developer.' },
      { icon: Code, title: 'Full Stack Builder', desc: 'End-to-end products with scalable code.' },
      { icon: Users, title: 'User Focused', desc: 'I build for real users with clarity.' },
      { icon: RocketHelper, title: 'Impact Driven', desc: 'Every product I build aims for measurable impact.' }
    ];
  }, []);

  // Static fallback/pad projects matching the reference image layout
  const defaultProjects = useMemo(() => {
    return [
      {
        name: 'GetProspectra',
        category: 'AI Career Platform',
        description: 'Helping professionals transform career data into resumes, portfolios and interview assets.',
        role: 'Founder & Full Stack Developer',
        technologies: ['React', 'Next.js', 'Tailwind', 'Node.js', 'OpenAI'],
        problemSolved: 'Job seekers struggle to build cohesive, ATS-friendly career documents that look premium.',
        impact: 'Launched to 5,000+ beta signups and generated 1,200+ resumes within the first 3 weeks.',
        mockupType: 'dashboard',
        liveUrl: 'https://getprospectra.com'
      },
      {
        name: 'Style.AI',
        category: 'Fashion Recommendation',
        description: 'AI-powered fashion recommendations based on style, body type and occasions.',
        role: 'Founder & Product Strategist',
        technologies: ['TypeScript', 'FastAPI', 'PyTorch', 'Tailwind', 'PostgreSQL'],
        problemSolved: 'Shoppers feel overwhelmed by e-commerce selections and struggle to find outfits matching their body shape.',
        impact: 'Reduced checkout abandonment rate by 24% for pilot retailers and matched 10k+ daily styles.',
        mockupType: 'fashion',
        liveUrl: 'https://styleai.io'
      },
      {
        name: 'GetProspectra',
        category: 'B2B Lead Generation',
        description: 'Helps businesses find, connect and close high-quality leads with intelligent automation.',
        role: 'Founder & Builder',
        technologies: ['React', 'Express', 'MongoDB', 'Python', 'Tailwind'],
        problemSolved: 'Sales development representatives waste hours scraping contacts manually with outdated tools.',
        impact: 'Automated outbound campaigns for 200+ teams, increasing response rates by an average of 18%.',
        mockupType: 'leads',
        liveUrl: 'https://getprospectra.com'
      },
      {
        name: 'TaskFlow',
        category: 'Project Management',
        description: 'Intuitive tool to plan tasks, collaborate with teams and track progress in real-time.',
        role: 'Full Stack Developer',
        technologies: ['Next.js', 'PostgreSQL', 'Drizzle', 'Tailwind', 'Socket.io'],
        problemSolved: 'Existing project boards are bloated, slow, and overly complex for agile product teams.',
        impact: 'Maintained 99.9% real-time syncing uptime and scaled to support 500+ active workspaces.',
        mockupType: 'tasks',
        liveUrl: 'https://taskflow.dev'
      },
      {
        name: 'ChatBridge',
        category: 'Real-time Messaging',
        description: 'Scalable real-time chat with group messaging, media sharing and presence.',
        role: 'Full Stack Developer',
        technologies: ['React', 'Node.js', 'Socket.io', 'Redis', 'WebRTC'],
        problemSolved: 'Internal messaging frameworks struggle to support rich file embeds and dynamic web previews.',
        impact: 'Supports 50k+ concurrent active socket connections with sub-50ms message delivery latency.',
        mockupType: 'chat',
        liveUrl: 'https://chatbridge.net'
      }
    ];
  }, []);

  // Merge user projects with fallback defaults to ensure exactly 5 projects are present
  const allProjects = useMemo(() => {
    const userProjects = (normalizedProjects || []).map((p: any, idx: number) => ({
      ...p,
      name: p.title || p.name || p.projectName || p.projectTitle || `Project ${idx + 1}`,
      description: p.description || '',
      technologies: p.techStack || [],
      problemSolved: p.problemSolved || '',
      impact: p.keyImpact || '',
      liveUrl: p.link || '',
      category: p.highlights && p.highlights.length > 0 ? p.highlights[0] : 'Showcase',
      role: showcaseLabels.itemLabel || 'Builder',
      mockupType: ['dashboard', 'fashion', 'leads', 'tasks', 'chat'][idx % 5]
    }));

    if (userProjects.length >= 5) {
      return userProjects.slice(0, 5);
    }
    
    // Fill remaining spots
    const padCount = 5 - userProjects.length;
    const padding = defaultProjects.slice(0, padCount);
    return [...userProjects, ...padding];
  }, [projects, defaultProjects]);

  // Capabilities block mapping Outcome-Oriented Capabilities matching blueprint
  const capabilities = useMemo(() => {
    return [
      { icon: Lightbulb, title: 'Product Strategy', desc: 'Defining product vision, roadmaps and strategy.' },
      { icon: Code, title: 'Full Stack Development', desc: 'Building end-to-end web applications.' },
      { icon: Sparkles, title: 'AI Integration', desc: 'Leveraging AI to build smarter solutions.' },
      { icon: Target, title: 'Problem Solving', desc: 'Breaking down complex problems into simple solutions.' },
      { icon: Compass, title: 'User Experience', desc: 'Designing intuitive and meaningful experiences.' },
      { icon: Trophy, title: 'Product Ownership', desc: 'Taking ideas from concept to impactful outcomes.' },
      { icon: TrendingUp, title: 'Data Driven', desc: 'Using data to make product decisions.' },
      { icon: Users, title: 'Communication', desc: 'Communicating clearly and collaborating effectively.' }
    ];
  }, []);

  // Building Process steps
  const buildingSteps = useMemo(() => {
    return [
      { step: '01', title: 'Discover', desc: 'I research deeply to understand real user problems and opportunities.', icon: Search },
      { step: '02', title: 'Validate', desc: 'I validate ideas with users, market research and small experiments.', icon: Award },
      { step: '03', title: 'Build', desc: 'I build scalable solutions with clean code and great user experience.', icon: Code },
      { step: '04', title: 'Launch', desc: 'I ship fast and make products available to real users.', icon: RocketHelper },
      { step: '05', title: 'Iterate', desc: 'I analyze feedback and continuously improve the product.', icon: RefreshCw }
    ];
  }, []);

  // Journey milestones (generated dynamically from profile data)
  const journeyMilestones = useMemo(() => {
    const milestones: { year: string; title: string; desc: string; sortKey: number }[] = [];

    // Parse Education
    if (education && education.length > 0) {
      education.forEach(edu => {
        const year = edu.startYear || edu.endYear;
        if (year) {
          const yearNum = parseInt(year);
          milestones.push({
            year,
            title: `Started Studies`,
            desc: `Enrolled in ${edu.degree} in ${edu.specialization || 'my field'} at ${edu.institution}.`,
            sortKey: yearNum
          });
        }
      });
    }

    // Parse Experience
    if (experience && experience.length > 0) {
      experience.forEach(exp => {
        if (exp.startDate && typeof exp.startDate === 'string') {
          const parts = exp.startDate.trim().split(' ');
          const year = parts[parts.length - 1];
          const yearNum = parseInt(year);
          if (year && !isNaN(yearNum)) {
            milestones.push({
              year,
              title: exp.position || 'Professional Role',
              desc: `Joined ${exp.company || 'Company'} as ${exp.position || 'Professional'} to own key outcomes.`,
              sortKey: yearNum
            });
          }
        }
      });
    }

    // Parse Projects
    if (normalizedProjects && normalizedProjects.length > 0) {
      normalizedProjects.forEach((proj: any, idx: number) => {
        const firstExpStart = experience && experience[0] && typeof experience[0].startDate === 'string' ? experience[0].startDate : '';
        const baseYear = firstExpStart ? parseInt(firstExpStart.trim().split(' ').pop() || '2023') : 2023;
        const year = String(baseYear + Math.min(idx, 2));
        const descStr = proj.description || '';
        milestones.push({
          year,
          title: `${showcaseLabels.actionVerb} ${proj.title}`,
          desc: descStr.slice(0, 70) + (descStr.length > 70 ? '...' : ''),
          sortKey: parseInt(year)
        });
      });
    }

    // Parse Achievements
    if (achievements && achievements.length > 0) {
      achievements.forEach(ach => {
        const baseYear = 2024;
        milestones.push({
          year: String(baseYear),
          title: ach.title,
          desc: ach.description,
          sortKey: baseYear
        });
      });
    }

    // Sort chronologically
    milestones.sort((a, b) => a.sortKey - b.sortKey);

    // Filter unique years to keep timeline clean
    const uniqueMilestones: typeof milestones = [];
    const seenYears = new Set<string>();
    for (const m of milestones) {
      if (!seenYears.has(m.year)) {
        seenYears.add(m.year);
        uniqueMilestones.push(m);
      }
      if (uniqueMilestones.length >= 5) break;
    }

    // Fill defaults if we don't have enough milestones
    const fallbacks = [
      { year: '2021', title: 'Started learning', desc: 'Explored web development and built small projects.', sortKey: 2021 },
      { year: '2022', title: 'First Professional Step', desc: 'Worked on real-world data and software projects.', sortKey: 2022 },
      { year: '2023', title: 'Growth & Learning', desc: 'Expanded my product skills and engineering depth.', sortKey: 2023 },
      { year: '2024', title: 'Building Products', desc: 'Launched several MVPs and SaaS integrations.', sortKey: 2024 },
    ];

    for (const fb of fallbacks) {
      if (uniqueMilestones.length >= 5) break;
      if (!seenYears.has(fb.year)) {
        seenYears.add(fb.year);
        uniqueMilestones.push(fb);
      }
    }

    uniqueMilestones.sort((a, b) => a.sortKey - b.sortKey);

    // Append Future Vision
    uniqueMilestones.push({
      year: 'Future',
      title: 'Impact at Scale',
      desc: 'Continuing to build and launch products that solve real problems.',
      sortKey: 9999
    });

    return uniqueMilestones;
  }, [education, experience, projects, achievements]);

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

  // Dynamic Ordering configs
  const toggles = portfolio.sectionToggles;

  const isSectionEnabled = (key: string, toggles: Record<string, boolean>) => {
    if (key === 'hero' || key === 'stats' || key === 'contact' || key === 'philosophy' || key === 'journey' || key === 'process' || key === 'designProcess') return true;
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
    if (key === 'products' || key === 'projects') return 'Projects';
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  const blueprint = profile.professionalBlueprint;
  
  const profession = (
    profile.professionalBlueprint?.profession || 
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
    defaultOrder = ['philosophy', ...dynamicSlots.map(s => s.id)];
    if (!defaultOrder.includes('journey')) defaultOrder.push('journey');
  } else {
    if (isDeveloper) {
      defaultOrder = ['philosophy', 'skills', 'projects', 'experience', 'journey'];
    } else if (isLawyer) {
      defaultOrder = ['philosophy', 'practiceAreas', 'certifications', 'publications', 'experience', 'journey'];
    } else if (isDesigner) {
      defaultOrder = ['philosophy', 'portfolioShowcase', 'designProcess', 'projects', 'experience', 'journey'];
    } else if (isMarketing) {
      defaultOrder = ['philosophy', 'campaigns', 'growthMetrics', 'experience', 'journey'];
    } else {
      defaultOrder = ['philosophy', 'skills', 'projects', 'experience', 'journey'];
    }
  }

  const order = portfolio.sectionOrder && portfolio.sectionOrder.length > 0 ? portfolio.sectionOrder : defaultOrder;
  const activeOrder = order.filter(key => isSectionEnabled(key, toggles) && key !== 'hero' && key !== 'stats' && key !== 'contact');

  // --- SUB-RENDERERS ---

  const renderHero = () => (
    <section id="home" className="relative pt-32 pb-24 px-6 md:px-12 lg:px-24 overflow-hidden">
      {/* Soft Background Grid Accent */}
      <div className={`absolute inset-0 pointer-events-none opacity-30 z-0 ${isDarkMode ? 'bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)]' : 'bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)]'} bg-[size:4rem_4rem]`}></div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Identity Info */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="lg:col-span-6 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[#7c3aed] text-xs font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] animate-pulse"></span>
            {isLawyer ? 'Legal Professional' : isDesigner ? 'Creative Designer' : isMarketing ? 'Marketing Leader' : 'Product Builder'}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] font-builder-sans">
            {isLawyer ? (
              <>Constructing legal <br /> frameworks with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#4f46e5]">clarity & integrity.</span></>
            ) : isDesigner ? (
              <>Designing premium <br /> solutions that <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#4f46e5]">inspire users.</span></>
            ) : isMarketing ? (
              <>Driving exponential <br /> business growth with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#4f46e5]">data & campaigns.</span></>
            ) : (
              <>I build products <br /> that solve <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#4f46e5]">real problems.</span></>
            )}
          </h1>
          
          <p className={`text-sm md:text-[15px] leading-relaxed font-normal max-w-lg font-builder-body ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {summary || "Combining outcome-oriented thinking, specialized depth, and modern tools to create high-impact, strategic results."}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <motion.a 
              whileHover={{ y: -3, backgroundColor: '#6d28d9' }}
              whileTap={{ scale: 0.97 }}
              href="#products" 
              className="px-7 py-3.5 bg-[#7c3aed] text-white rounded-md font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-[#7c3aed]/10 flex items-center gap-2 cursor-pointer z-10 font-builder-sans"
            >
              View My Portfolio <ArrowRight size={13} strokeWidth={2.5} />
            </motion.a>
            <motion.a 
              whileHover={{ y: -3, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
              whileTap={{ scale: 0.97 }}
              href={`mailto:${personalInfo.email}`}
              className={`px-7 py-3.5 border rounded-md font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer z-10 font-builder-sans ${isDarkMode ? 'border-[var(--border-card)] text-white hover:border-[var(--border-card)]' : 'border-slate-300 text-slate-800 hover:border-slate-400'}`}
            >
              Download Resume <Download size={13} strokeWidth={2.5} />
            </motion.a>
          </div>

          {/* Builder Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-12 border-t border-slate-200/60 dark:border-[var(--border-card)]/60">
            {builderHighlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-full bg-[#7c3aed]/10 text-[#7c3aed] flex items-center justify-center shrink-0">
                    <Icon size={16} strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold tracking-wide">{item.title}</h4>
                    <p className={`text-[11px] mt-1 leading-normal font-builder-body ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Right Column: Product Ecosystem Grid */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
          className={`lg:col-span-6 border rounded-[var(--radius-card)] p-6 md:p-8 shadow-xl relative z-10 ${isDarkMode ? 'bg-[var(--color-bg)] border-[var(--border-card)]' : 'bg-white border-slate-200/60'}`}
        >
          {/* Header row */}
          <div className="flex justify-between items-center pb-6 border-b border-slate-200/50 dark:border-[var(--border-card)]/50 mb-6">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-[#7c3aed] uppercase">SELECTED HIGHLIGHTS</span>
              <h3 className="text-lg font-bold tracking-tight mt-1">Portfolio Highlights</h3>
            </div>
            <a href="#products" className="text-xs font-semibold text-[#7c3aed] hover:text-[#6d28d9] transition-colors flex items-center gap-1">
              Explore All <ArrowUpRight size={13} strokeWidth={2.5} />
            </a>
          </div>

          {/* Ecosystem Grid */}
          <div className="grid grid-cols-2 gap-4">
            {allProjects.slice(0, 3).map((p, idx) => {
              const icon = LayoutTemplate;
              const iconBg = 'bg-purple-100 dark:bg-purple-900/40';
              const iconColor = 'text-purple-600 dark:text-purple-400';
              const hoverBorder = 'hover:border-purple-500/30';
              const textHover = 'group-hover:text-[#7c3aed]';

              return (
                <div 
                  onClick={() => setActiveProject(p)}
                  key={idx} 
                  className={`p-4 rounded-[var(--radius-card)] border transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer flex flex-col justify-between h-44 group ${isDarkMode ? `bg-slate-950 border-[var(--border-card)] ${hoverBorder}` : `bg-[#FAFBFC] border-slate-200/60 hover:bg-white ${hoverBorder}`}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{p.category}</span>
                      <h4 className={`text-xs font-bold text-gray-900 dark:text-slate-100 ${textHover} transition-colors mt-0.5`}>{p.name}</h4>
                    </div>
                    <div className={`w-7 h-7 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
                      {React.createElement(icon, { size: 13 })}
                    </div>
                  </div>
                  
                  <div className="flex-grow mt-3 text-left">
                    <p className={`text-[10px] leading-relaxed line-clamp-3 font-builder-body ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {p.description}
                    </p>
                  </div>
                  
                  <span className="text-[10px] text-slate-400 font-semibold tracking-wider flex items-center gap-1 group-hover:text-[#7c3aed] transition-colors mt-2">
                    EXPLORE <ArrowRight size={10} />
                  </span>
                </div>
              );
            })}
            
            {/* CTA Join Card */}
            <div className={`p-4 rounded-[var(--radius-card)] border flex flex-col justify-between h-44 ${isDarkMode ? 'bg-slate-950 border-[var(--border-card)]' : 'bg-[#FAFBFC] border-slate-200/60'}`}>
              <div>
                <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">CONNECT</span>
                <h4 className="text-xs font-bold mt-0.5 text-gray-900 dark:text-slate-100">Get in touch</h4>
              </div>
              <p className={`text-[11px] leading-normal font-builder-body ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Let's discuss working together on projects and scaling outcomes.
              </p>
              <a href={`mailto:${personalInfo.email}`} className="text-[9px] text-[#7c3aed] font-extrabold flex items-center gap-1">
                EMAIL ME <ArrowRight size={10} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );

  const renderPhilosophy = () => (
    <section id="philosophy" className={`py-24 px-6 md:px-12 lg:px-24 border-t border-b scroll-mt-24 ${isDarkMode ? 'bg-slate-950 border-[var(--border-card)]/60' : 'bg-[#FAF8F5] border-slate-200/50'}`} key="philosophy">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-5">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#7c3aed] uppercase">HOW I OPERATE</span>
            <h2 className="text-3xl font-extrabold tracking-tight font-builder-sans">Core Principles & Approach</h2>
            <p className={`text-base leading-relaxed font-builder-body ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              I value deep analysis, continuous iteration, and focus. I structure every deliverable to address core challenges and drive measurable value.
            </p>
            <div className={`mt-6 w-24 h-24 rounded-full overflow-hidden border-2 shadow-sm flex items-center justify-center ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-gray-50'}`}>
              {profile.personalInfo?.avatarUrl ? (
                <img 
                  src={profile.personalInfo.avatarUrl} 
                  alt={profile.personalInfo?.fullName || "Profile"} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={32} className={isDarkMode ? 'text-slate-700' : 'text-gray-300'} />
              )}
            </div>
          </div>
          
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Search, title: 'Understand Deeply', desc: 'Researching and identifying core parameters worth optimizing.' },
              { icon: Compass, title: 'Structure Intentionally', desc: 'Designing transparent and modular pathways to ensure scale.' },
              { icon: Code, title: 'Execute Relentlessly', desc: 'Engineering robust solutions, testing coverage, and maintaining health.' },
              { icon: Target, title: 'Analyze Impact', desc: 'Measuring results, checking metrics, and refining deliverables.' }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  whileHover={{ y: -4 }}
                  key={idx} 
                  className={`p-6 rounded-[var(--radius-card)] border transition-all ${isDarkMode ? 'bg-[var(--color-bg)] border-[var(--border-card)]' : 'bg-white border-slate-200/60 shadow-sm'}`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#7c3aed]/10 text-[#7c3aed] flex items-center justify-center mb-4 shrink-0">
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <h4 className="text-sm font-bold tracking-wide">{item.title}</h4>
                  <p className={`text-[11px] mt-2 leading-relaxed font-builder-body ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );

  const renderProducts = () => {
    const title = getSectionLabel('projects');
    return (
      <section id="products" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto scroll-mt-24" key="projects">
        <div className="flex justify-between items-end border-b border-slate-200/60 dark:border-[var(--border-card)]/60 pb-4 mb-12">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#7c3aed] uppercase">PORTFOLIO WORK</span>
            <h2 className="text-3xl font-extrabold tracking-tight font-builder-sans mt-1">{title}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allProjects.slice(0, visibleProjectsCount).map((proj, idx) => (
            <motion.div 
              whileHover={{ y: -6 }}
              key={idx} 
              className={`border rounded-[var(--radius-card)] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group ${isDarkMode ? 'bg-[var(--color-bg)] border-[var(--border-card)]' : 'bg-white border-slate-200/60'}`}
            >
              <div className="h-44 bg-[#0B0F19] border-b border-slate-200/5 dark:border-[var(--border-card)]/50 p-5 flex flex-col justify-between relative overflow-hidden shrink-0">
                <div className="absolute right-0 top-0 w-36 h-36 bg-[#7c3aed]/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="flex gap-1.5 z-10">
                  <div className="w-2 h-2 rounded-full bg-red-500/70"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500/70"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500/70"></div>
                </div>
                <div className="text-white relative z-10 space-y-1 text-left animate-fade-in">
                  <span className="text-[9px] font-bold text-[#7c3aed] tracking-wider uppercase">{proj.category}</span>
                  <h4 className="text-lg font-bold font-builder-sans leading-tight text-white">{proj.name}</h4>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow text-left">
                <p className={`text-[12px] mb-4 leading-relaxed font-builder-body ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {proj.description}
                </p>
                {(proj as any).achievements && (proj as any).achievements.length > 0 && (
                  <ul className="space-y-2 mb-6 flex-grow">
                    {(proj as any).achievements.slice(0, 3).map((bullet: string, bIdx: number) => (
                      <li key={bIdx} className={`relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-[#7c3aed] text-[11px] leading-relaxed font-builder-body ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{bullet}</li>
                    ))}
                  </ul>
                )}

                <div className="space-y-3 mb-6 shrink-0 border-t border-slate-100 dark:border-[var(--border-card)] pt-4 text-left">
                  <div className="text-[11px] leading-relaxed">
                    <strong className="font-bold text-slate-800 dark:text-slate-200">Role:</strong> <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>{proj.role}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setActiveProject(proj)}
                  className="w-full flex items-center justify-center gap-1.5 py-3 rounded-[calc(var(--radius-card)*0.75)] border border-slate-200 dark:border-[var(--border-card)] hover:border-[#7c3aed] dark:hover:border-[#7c3aed] hover:bg-[#7c3aed]/5 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer mt-auto"
                >
                  Explore Details <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {allProjects.length > visibleProjectsCount && (
          <div className="flex justify-center mt-12">
            <button 
              onClick={() => setVisibleProjectsCount(prev => prev + 4)}
              className={`px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-colors ${isDarkMode ? 'bg-[#7c3aed]/10 text-[#7c3aed] hover:bg-[#7c3aed]/20' : 'bg-[#7c3aed]/10 text-[#7c3aed] hover:bg-[#7c3aed]/20'}`}
            >
              Show More Projects
            </button>
          </div>
        )}
      </section>
    );
  };

  const renderExperience = () => (
    <section id="experience" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto scroll-mt-24" key="experience">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Experience */}
        <div className="lg:col-span-5 space-y-10 text-left">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#7c3aed] uppercase">JOURNEY</span>
            <h2 className="text-3xl font-extrabold tracking-tight font-builder-sans mt-1">{getSectionLabel('experience')}</h2>
          </div>

          <div className="space-y-6 relative animate-fade-in">
            {experience?.slice(0, 3).map((exp, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-3 relative">
                <div className="col-span-3 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider pt-1 text-right pr-2 select-none">
                  {(exp.startDate && typeof exp.startDate === 'string') ? (exp.startDate.split(' ').pop() || exp.startDate) : 'N/A'} – {exp.currentlyWorking ? 'Pres' : ((exp.endDate && typeof exp.endDate === 'string') ? (exp.endDate.split(' ').pop() || exp.endDate) : 'Present')}
                </div>
                
                <div className="col-span-1 flex flex-col items-center relative">
                  <div className="w-3 h-3 rounded-full bg-white dark:bg-slate-950 border-2 border-[#7c3aed] z-10 mt-1" />
                  {idx < Math.min(experience.length, 3) - 1 && (
                    <div className="w-[1px] bg-slate-200 dark:bg-[var(--color-surface)] flex-grow my-1 absolute top-4 bottom-0" />
                  )}
                </div>

                <div className="col-span-8 space-y-1 pb-6 text-left">
                  <div className="text-xs font-bold text-gray-900 dark:text-slate-100">
                    {exp.position}
                  </div>
                  <div className="text-[10px] text-[#7c3aed] font-bold tracking-wide uppercase leading-none">{exp.company}</div>
                  <ul className="list-disc pl-4 space-y-1 text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-builder-body pt-1.5">
                    {exp.achievements?.slice(0, 3).map((bullet, bIdx) => (
                      <li key={bIdx} className="pl-0.5">{bullet}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Capabilities / Skills */}
        <div className="lg:col-span-7 space-y-10 text-left">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#7c3aed] uppercase">EXPERTISE</span>
            <h2 className="text-3xl font-extrabold tracking-tight font-builder-sans mt-1">Capabilities & Skills</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {capabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div key={idx} className={`p-4 rounded-[calc(var(--radius-card)*0.75)] border transition-all flex gap-3.5 items-start ${isDarkMode ? 'bg-[var(--color-bg)] border-[var(--border-card)]' : 'bg-white border-slate-200/50 shadow-xs hover:shadow-sm'}`}>
                  <div className="w-8 h-8 rounded-lg bg-[#7c3aed]/10 text-[#7c3aed] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={14} />
                  </div>
                  <div className="space-y-1 text-left">
                    <h4 className="text-xs font-bold tracking-wide text-gray-900 dark:text-slate-100">{cap.title}</h4>
                    <p className={`text-[10px] leading-relaxed font-builder-body ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{cap.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );

  const renderJourney = () => (
    <section id="journey" className={`py-24 px-6 md:px-12 lg:px-24 border-t border-b scroll-mt-24 ${isDarkMode ? 'bg-[var(--color-bg)]/40 border-[var(--border-card)]/60' : 'bg-[#FAF8F5] border-slate-200/50'}`} key="journey">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-left space-y-3">
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#7c3aed] uppercase">MY JOURNAL</span>
          <h2 className="text-3xl font-extrabold tracking-tight font-builder-sans">How I Got Here</h2>
        </div>

        <div className="relative pt-4">
          {/* Horizontal timeline line */}
          <div className="hidden md:block absolute top-[9px] left-[5%] right-[5%] h-[1px] bg-slate-300 dark:bg-slate-700 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-8 relative z-10">
            {journeyMilestones.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 relative group">
                <div className="w-5 h-5 rounded-full bg-white dark:bg-slate-950 border-4 border-[#7c3aed] shadow-sm z-10 shrink-0 mx-auto md:mx-0" />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#7c3aed] tracking-wider">{item.year}</span>
                  <h4 className="text-xs font-bold tracking-tight text-slate-800 dark:text-slate-200 mt-0.5">{item.title}</h4>
                  <p className={`text-[10px] mt-1.5 leading-normal max-w-[160px] font-builder-body ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  const renderPracticeAreas = () => {
    const practiceAreasList = profile.extensions?.practiceAreas || [];
    if (practiceAreasList.length === 0) return null;
    return (
      <section id="practiceAreas" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto scroll-mt-24" key="practiceAreas">
        <div className="flex justify-between items-end border-b border-slate-200/60 dark:border-[var(--border-card)]/60 pb-4 mb-12">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#7c3aed] uppercase">LEGAL DEPTH</span>
            <h2 className="text-3xl font-extrabold tracking-tight font-builder-sans mt-1">Practice Areas</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {practiceAreasList.map((area, idx) => (
            <div key={idx} className={`p-5 rounded-[calc(var(--radius-card)*0.75)] border flex items-center gap-4 ${isDarkMode ? 'bg-[var(--color-bg)] border-[var(--border-card)]' : 'bg-white border-slate-200/50 shadow-xs'}`}>
              <div className="w-10 h-10 rounded-lg bg-[#7c3aed]/10 text-[#7c3aed] flex items-center justify-center shrink-0">
                <Shield size={18} />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white text-base font-builder-sans">{area}</h4>
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
        <div className="flex justify-between items-end border-b border-slate-200/60 dark:border-[var(--border-card)]/60 pb-4 mb-12">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#7c3aed] uppercase">PUBLICATIONS</span>
            <h2 className="text-3xl font-extrabold tracking-tight font-builder-sans mt-1">Publications & Writing</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {publicationsList.map((pub, idx) => (
            <div key={idx} className={`p-5 rounded-[calc(var(--radius-card)*0.75)] border flex items-start gap-4 ${isDarkMode ? 'bg-[var(--color-bg)] border-[var(--border-card)]' : 'bg-white border-slate-200/50 shadow-xs'}`}>
              <div className="w-10 h-10 rounded-lg bg-[#7c3aed]/10 text-[#7c3aed] flex items-center justify-center shrink-0 mt-0.5">
                <BookOpen size={18} />
              </div>
              <p className="text-gray-700 dark:text-slate-350 text-sm leading-relaxed font-builder-body">{pub}</p>
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
        <div className="flex justify-between items-end border-b border-slate-200/60 dark:border-[var(--border-card)]/60 pb-4 mb-12">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#7c3aed] uppercase">CREATIVE WORK</span>
            <h2 className="text-3xl font-extrabold tracking-tight font-builder-sans mt-1">Portfolio Showcase</h2>
          </div>
        </div>
        {(behanceUrl || dribbbleUrl) && (
          <div className="flex flex-wrap gap-4 mb-6">
            {behanceUrl && (
              <a href={behanceUrl} target="_blank" rel="noreferrer" className={`px-5 py-2.5 border rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isDarkMode ? 'border-[var(--border-card)] text-white hover:border-[var(--border-card)]' : 'border-slate-300 text-slate-700 hover:border-slate-400'}`}>
                <Globe size={14} /> Behance Portfolio
              </a>
            )}
            {dribbbleUrl && (
              <a href={dribbbleUrl} target="_blank" rel="noreferrer" className={`px-5 py-2.5 border rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isDarkMode ? 'border-[var(--border-card)] text-white hover:border-[var(--border-card)]' : 'border-slate-300 text-slate-700 hover:border-slate-400'}`}>
                <Globe size={14} /> Dribbble Portfolio
              </a>
            )}
          </div>
        )}
        {workSamplesList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workSamplesList.map((sample, idx) => (
              <div key={idx} className={`p-6 rounded-[calc(var(--radius-card)*0.75)] border space-y-4 ${isDarkMode ? 'bg-[var(--color-bg)] border-[var(--border-card)]' : 'bg-white border-slate-200/50 shadow-xs'}`}>
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg font-builder-sans">{sample.title}</h4>
                  {sample.url && (
                    <a href={sample.url} target="_blank" rel="noreferrer" className="text-[#7c3aed] hover:text-[#6d28d9]">
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
                {sample.description && <p className="text-slate-500 dark:text-slate-400 text-xs font-light font-builder-body leading-relaxed">{sample.description}</p>}
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
        <div className="flex justify-between items-end border-b border-slate-200/60 dark:border-[var(--border-card)]/60 pb-4 mb-12">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#7c3aed] uppercase">TOOLBOX</span>
            <h2 className="text-3xl font-extrabold tracking-tight font-builder-sans mt-1">Design Process & Tools</h2>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {designTools.map((tool, idx) => (
            <div key={idx} className={`px-5 py-3 border rounded-[calc(var(--radius-card)*0.75)] text-xs font-bold uppercase tracking-wider cursor-default ${isDarkMode ? 'border-[var(--border-card)] bg-[var(--color-bg)] text-slate-300' : 'border-slate-200 bg-white text-slate-700'}`}>
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
        <div className="flex justify-between items-end border-b border-slate-200/60 dark:border-[var(--border-card)]/60 pb-4 mb-12">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#7c3aed] uppercase">MARKETING CAMPAIGNS</span>
            <h2 className="text-3xl font-extrabold tracking-tight font-builder-sans mt-1">Campaign Showcase</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {campaignsList.map((camp, idx) => (
            <div key={idx} className={`p-5 rounded-[calc(var(--radius-card)*0.75)] border flex items-start gap-4 ${isDarkMode ? 'bg-[var(--color-bg)] border-[var(--border-card)]' : 'bg-white border-slate-200/50 shadow-xs'}`}>
              <div className="w-10 h-10 rounded-lg bg-[#7c3aed]/10 text-[#7c3aed] flex items-center justify-center shrink-0 mt-0.5">
                <Zap size={18} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-lg font-builder-sans leading-tight">{camp}</h4>
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
        <div className="flex justify-between items-end border-b border-slate-200/60 dark:border-[var(--border-card)]/60 pb-4 mb-12">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#7c3aed] uppercase">ANALYTICS & METRICS</span>
            <h2 className="text-3xl font-extrabold tracking-tight font-builder-sans mt-1">Growth Metrics & Results</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {growthMetricsList.map((metric, idx) => (
            <div key={idx} className={`p-5 rounded-[calc(var(--radius-card)*0.75)] border flex items-center gap-4 ${isDarkMode ? 'bg-[var(--color-bg)] border-[var(--border-card)]' : 'bg-white border-slate-200/50 shadow-xs'}`}>
              <div className="w-10 h-10 rounded-lg bg-[#7c3aed]/10 text-[#7c3aed] flex items-center justify-center shrink-0">
                <TrendingUp size={18} />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white text-base font-builder-sans leading-tight">{metric}</h4>
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
        <div className="flex justify-between items-end border-b border-slate-200/60 dark:border-[var(--border-card)]/60 pb-4 mb-12">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#7c3aed] uppercase">EXPERTISE</span>
            <h2 className="text-3xl font-extrabold tracking-tight font-builder-sans mt-1">Skills</h2>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {profile.skills.map((s, idx) => (
            <div key={idx} className={`px-5 py-3 border rounded-[calc(var(--radius-card)*0.75)] text-xs font-bold uppercase tracking-wider cursor-default ${isDarkMode ? 'border-[var(--border-card)] bg-[var(--color-bg)] text-slate-300' : 'border-slate-200 bg-white text-slate-700'}`}>
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
        <div className="flex justify-between items-end border-b border-slate-200/60 dark:border-[var(--border-card)]/60 pb-4 mb-12">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#7c3aed] uppercase">CREDENTIALS</span>
            <h2 className="text-3xl font-extrabold tracking-tight font-builder-sans mt-1">Certifications</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.certifications.map((cert, idx) => (
            <div key={idx} className={`p-5 rounded-[calc(var(--radius-card)*0.75)] border flex items-start gap-4 ${isDarkMode ? 'bg-[var(--color-bg)] border-[var(--border-card)]' : 'bg-white border-slate-200/50 shadow-xs'}`}>
              <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-950 border flex items-center justify-center shrink-0">
                <Award size={14} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">{typeof cert === 'string' ? cert : (cert.title || (cert as any).name)}</h4>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1">{typeof cert === 'string' ? '' : cert.issuer} {cert.issueDate ? `(${typeof cert === 'string' ? '' : cert.issueDate})` : ''}</p>
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
        <div className="flex justify-between items-end border-b border-slate-200/60 dark:border-[var(--border-card)]/60 pb-4 mb-12">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#7c3aed] uppercase">EDUCATION</span>
            <h2 className="text-3xl font-extrabold tracking-tight font-builder-sans mt-1">Education</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.education.map((edu, idx) => (
            <div key={idx} className={`p-5 rounded-[calc(var(--radius-card)*0.75)] border flex items-start gap-4 ${isDarkMode ? 'bg-[var(--color-bg)] border-[var(--border-card)]' : 'bg-white border-slate-200/50 shadow-xs'}`}>
              <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-950 border flex items-center justify-center shrink-0">
                <BookOpen size={14} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">{edu.degree}</h4>
                <p className="text-[10px] text-slate-650 dark:text-slate-400 mt-1">{edu.institution}</p>
                <p className="text-[9px] text-slate-400 mt-1">{edu.startYear} – {edu.endYear}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const sectionMap: Record<string, () => React.ReactNode> = {
    philosophy: () => renderPhilosophy(),
    experience: () => renderExperience(),
    journey: () => renderJourney(),
    projects: () => renderProducts(),
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
    <div className={`min-h-screen text-[#0B0F19] font-builder-sans selection:bg-[#7c3aed]/20 overflow-x-hidden relative transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-[#FAFBFC]'}`}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('${dna.tokens.typography.importUrl}');
        .font-builder-title { font-family: 'Outfit', sans-serif; }
        .font-builder-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-builder-body { font-family: var(--font-body); }
        html { scroll-behavior: smooth !important; }
      `}} />

      {/* Header/Navbar */}
      <nav className={`fixed top-0 w-full z-50 border-b transition-all duration-300 ${isDarkMode ? 'bg-slate-950/80 border-[var(--border-card)]/60' : 'bg-white/80 border-slate-200/50'} backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="font-builder-title font-extrabold text-2xl tracking-tight cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              {firstName.toUpperCase()}
              <span className="text-[#7c3aed]">.</span>
            </span>
          </div>

          <div className={`hidden lg:flex flex-wrap items-center justify-center gap-4 lg:gap-6 text-[12px] lg:text-[13px] font-semibold tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} uppercase relative`}>
            <a href="#home" className="hover:text-[#7c3aed] transition-colors relative py-1 group">
              Home
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#7c3aed] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </a>
            {activeOrder
              .filter(key => !['education', 'certifications', 'publications', 'achievements'].includes(key))
              .slice(0, 5)
              .map((key) => {
                const label = getSectionLabel(key);
                return (
                  <a key={key} href={`#${key}`} className="hover:text-[#7c3aed] transition-colors relative py-1 group">
                    {label}
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#7c3aed] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </a>
                );
            })}
          </div>

          <div className="flex items-center gap-4">
            <motion.a 
              whileHover={{ scale: 1.03, backgroundColor: '#6d28d9' }}
              whileTap={{ scale: 0.98 }}
              href={`mailto:${personalInfo.email}`}
              className="bg-[#7c3aed] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-[#7c3aed]/10 font-builder-sans"
            >
              Let's Connect <ArrowRight size={13} strokeWidth={2.5} />
            </motion.a>

            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className={`p-2.5 rounded-full border transition-all cursor-pointer ${isDarkMode ? 'border-[var(--border-card)] text-slate-300 bg-[var(--color-bg)] hover:text-white' : 'border-slate-200 text-slate-500 bg-slate-50 hover:text-slate-900'}`}
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {renderHero()}

      {/* Dynamic Ordered Sections */}
      {activeOrder.map(key => {
        const renderer = sectionMap[key];
        return renderer ? <React.Fragment key={key}>{renderer()}</React.Fragment> : null;
      })}

      {/* Footer / Contact Section */}
      <footer id="contact" className="py-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-[var(--radius-card)] p-8 md:p-12 relative overflow-hidden"
          >
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-[#7c3aed]/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-between relative z-10 pb-8 border-b border-white/5 lg:border-b-0">
              <div className="w-full lg:w-[70%] flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="space-y-3 max-w-xl text-left">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-300">LET'S BUILD SOMETHING GREAT</span>
                  <h3 className="text-3xl md:text-4xl font-bold font-builder-sans leading-none text-white">Let's build something great together.</h3>
                  <p className="text-purple-200 text-xs leading-relaxed font-builder-body">
                    I'm always open to discussing new ideas, collaborations and opportunities to build impactful products.
                  </p>
                </div>
                
                <motion.a 
                  whileHover={{ scale: 1.02, backgroundColor: '#ffffff', color: '#5b21b6' }}
                  whileTap={{ scale: 0.97 }}
                  href={`mailto:${personalInfo.email}`}
                  className="bg-white text-purple-900 px-6 py-3 rounded-md text-[10px] font-extrabold uppercase tracking-[0.15em] transition-colors shadow-lg flex items-center gap-2 cursor-pointer shrink-0 font-builder-sans self-start md:self-center"
                >
                  Let's Connect <span className="font-sans">→</span>
                </motion.a>
              </div>

              <div className="hidden lg:block w-[1px] bg-white/10 self-stretch my-2"></div>

              <div className="w-full lg:w-[25%] flex flex-col items-center lg:items-start gap-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-300">FIND ME ON</span>
                <div className="flex gap-4">
                  {personalInfo.linkedin && (
                    <a 
                      href={`https://${personalInfo.linkedin}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-purple-200 hover:text-white transition-colors p-1"
                      title="LinkedIn"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                  )}

                  {personalInfo.github && (
                    <a 
                      href={`https://${personalInfo.github}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-purple-200 hover:text-white transition-colors p-1"
                      title="GitHub"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                        <path d="M9 18c-4.51 2-5-2-7-2" />
                      </svg>
                    </a>
                  )}

                  {personalInfo.email && (
                    <a 
                      href={`mailto:${personalInfo.email}`} 
                      className="text-purple-200 hover:text-white transition-colors p-1"
                      title="Email"
                    >
                      <Mail className="w-5 h-5" strokeWidth={1.5} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-6 text-center relative z-10">
              <span className="text-[10px] text-purple-300 font-medium tracking-wide">
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
            className="fixed inset-0 bg-[#0B132A]/85 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6"
            onClick={() => setActiveProject(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-[var(--color-bg)] rounded-[var(--radius-card)] overflow-hidden max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-stone-200/50 dark:border-[var(--border-card)] shadow-2xl relative text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[#7c3aed] text-white p-6 md:p-8 flex justify-between items-start relative overflow-hidden border-b border-stone-100 dark:border-[var(--border-card)]">
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="space-y-1.5 relative z-10">
                  <span className="text-[9px] font-bold text-purple-200 tracking-widest uppercase">Case Study</span>
                  <h3 className="text-2xl font-bold font-builder-sans">{activeProject.name}</h3>
                </div>
                <button 
                  onClick={() => setActiveProject(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer relative z-10"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="p-6 md:p-8 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-[#7c3aed] uppercase tracking-widest">The Challenge</h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-builder-body">
                    {activeProject.problemSolved || "Designing a digital workspace that streamlines user activity while providing exceptional security and speed."}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-[#7c3aed] uppercase tracking-widest">Vision & Approach</h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-builder-body">
                    {activeProject.description || "Approached execution by mapping requirements, focusing on decoupled server layers, and drafting comprehensive layouts."}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-[#7c3aed] uppercase tracking-widest">Execution & Role</h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-builder-body">
                    As <strong className="font-semibold text-slate-900 dark:text-white">{activeProject.role || "Builder"}</strong>, utilized dynamic frameworks to construct modern API integrations, manage asynchronous operations, and verify responsive design.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-[#7c3aed] uppercase tracking-widest">Outcome & Impact</h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-builder-body">
                    {activeProject.impact || "Successfully built and deployed the system, meeting timeline guidelines and exceeding performance expectations with clean code standards."}
                  </p>
                </div>

                {activeProject.technologies && activeProject.technologies.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 dark:border-[var(--border-card)] flex flex-wrap gap-1.5">
                    {activeProject.technologies.map((tech: string, idx: number) => (
                      <span key={idx} className="text-[9px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 px-2.5 py-1 rounded-md uppercase tracking-wider">{tech}</span>
                    ))}
                  </div>
                )}
                
                {(activeProject.liveUrl || activeProject.githubUrl) && (
                  <div className="pt-4 border-t border-slate-100 dark:border-[var(--border-card)] flex gap-4">
                    {activeProject.liveUrl && (
                      <a href={activeProject.liveUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#7c3aed] hover:underline flex items-center gap-1.5">
                        <Globe size={14} /> {showcaseLabels.link2 || 'Live Demo'} <ExternalLink size={12} />
                      </a>
                    )}
                    {activeProject.githubUrl && (
                      <a href={activeProject.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5">
                        <Code size={14} /> {showcaseLabels.link1 || 'Source Code'} <ExternalLink size={12} />
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

// Inline helper to prevent Lucide Rocket imports failure
function RocketHelper(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      width="1em" 
      height="1em" 
      stroke="currentColor" 
      strokeWidth="2" 
      fill="none" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5M14 2c2 2 2.5 5 2.5 5L22 7l-3.5 3.5 2 4.5-5.5-1.5-3 3.5-.5-5.5L7 12l2.5-3.5S8 5.5 10 3.5l4-1.5z" />
    </svg>
  );
}

// Visual SVG helpers for premium tech stack representation
function getTechIcon(tech: string) {
  const t = tech.toLowerCase().trim();
  
  if (t === 'react') {
    return (
      <svg className="w-4 h-4 text-[#61DAFB] animate-[spin_10s_linear_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(30 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(90 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(150 12 12)" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    );
  }
  if (t === 'next.js' || t === 'nextjs') {
    return (
      <svg className="w-4 h-4 text-black dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" fill="currentColor" />
        <path d="M7 16V8l8 8V8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (t === 'typescript' || t === 'ts') {
    return (
      <svg className="w-4 h-4 text-[#3178C6]" viewBox="0 0 24 24" fill="currentColor">
        <rect width="24" height="24" rx="4" />
        <text x="12" y="18" fill="white" fontSize="13" fontWeight="bold" fontFamily="sans-serif">TS</text>
      </svg>
    );
  }
  if (t === 'javascript' || t === 'js') {
    return (
      <svg className="w-4 h-4 text-[#F7DF1E]" viewBox="0 0 24 24" fill="currentColor">
        <rect width="24" height="24" rx="4" />
        <text x="12" y="18" fill="black" fontSize="13" fontWeight="bold" fontFamily="sans-serif">JS</text>
      </svg>
    );
  }
  if (t === 'tailwind' || t === 'tailwindcss') {
    return (
      <svg className="w-4 h-4 text-[#06B6D4]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 6.5c-2.4 0-4 1.6-4.8 4.8 1.2-1.6 2.6-2.2 4.2-1.8.9.2 1.6.9 2.4 1.7 1.2 1.3 2.6 2.8 5.4 2.8 2.4 0 4-1.6 4.8-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.9-.2-1.6-.9-2.4-1.7-1.2-1.3-2.6-2.8-5.4-2.8zm-8 8c-2.4 0-4 1.6-4.8 4.8 1.2-1.6 2.6-2.2 4.2-1.8.9.2 1.6.9 2.4 1.7 1.2 1.3 2.6 2.8 5.4 2.8 2.4 0 4-1.6 4.8-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.9-.2-1.6-.9-2.4-1.7-1.2-1.3-2.6-2.8-5.4-2.8z" />
      </svg>
    );
  }
  if (t === 'openai' || t === 'ai') {
    return (
      <svg className="w-4 h-4 text-emerald-650 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    );
  }
  if (t === 'postgresql' || t === 'postgres') {
    return (
      <svg className="w-4 h-4 text-[#336791]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
      </svg>
    );
  }
  if (t === 'mongodb' || t === 'mongo') {
    return (
      <svg className="w-4 h-4 text-[#47A248]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    );
  }
  if (t === 'nodejs' || t === 'node') {
    return (
      <svg className="w-4 h-4 text-[#339933]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
      </svg>
    );
  }
  
  return (
    <div className="w-4 h-4 text-slate-500 bg-slate-100 dark:bg-[var(--color-surface)] dark:text-slate-400 rounded flex items-center justify-center text-[7px] font-extrabold uppercase select-none">
      {tech.slice(0, 2)}
    </div>
  );
}
