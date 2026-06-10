'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, ExternalLink, Code, Globe, ArrowRight, X, Sparkles, 
  ChevronRight, Award, Trophy, Rocket, Cpu, Eye, LayoutTemplate, 
  Search, Kanban, Send, Check, Shield, Activity, Phone, MapPin,
  Settings, BookOpen, Zap, TrendingUp
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

export default function InteractiveTemplate({ profile, portfolio }: Props) {
  const { personalInfo, summary, experience, education, projects, certifications, achievements, skills } = profile;
  const [activeProject, setActiveProject] = useState<BuilderProject | null>(null);
  const [hoveredProject, setHoveredProject] = useState<BuilderProject | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [isPortalHovered, setIsPortalHovered] = useState(false);

  const normalizedProjects = useMemo(() => normalizeShowcaseItems(profile), [profile]);
  const showcaseLabels = useMemo(() => getShowcaseLabels(profile.professionCategory), [profile.professionCategory]);

  // Split name for visual display
  const dna = useMemo(() => getVisualDNA(profile.professionalBlueprint), [profile.professionalBlueprint]);

  const { firstName, lastName } = useMemo(() => {
    const parts = personalInfo.fullName.trim().split(' ');
    return {
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || ''
    };
  }, [personalInfo.fullName]);

  // Project padding (exactly 5 projects)
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
        category: 'Fashion Discovery',
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
        category: 'Lead Generation',
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
        category: 'AI Messaging',
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

  const allProjects = useMemo(() => {
    const userProjects = (normalizedProjects || []).map((p: any, idx: number) => ({
      ...p,
      name: p.title || 'Project',
      description: p.description || '',
      technologies: p.techStack || [],
      problemSolved: p.problemSolved || '',
      impact: p.keyImpact || '',
      liveUrl: p.link || '',
      category: p.highlights && p.highlights.length > 0 ? p.highlights[0] : 'Showcase',
      role: showcaseLabels.itemLabel || 'Highlight',
      mockupType: ['dashboard', 'fashion', 'leads', 'tasks', 'chat'][idx % 5]
    }));

    if (userProjects.length >= 5) {
      return userProjects.slice(0, 5);
    }
    const padCount = 5 - userProjects.length;
    return [...userProjects, ...defaultProjects.slice(0, padCount)];
  }, [projects, defaultProjects]);

  const orbitProjects = useMemo(() => {
    const orbitConfigs = [
      { radiusFactor: 0.40, baseAngle: 170 * Math.PI / 180 }, // Left, middle (GetProspectra)
      { radiusFactor: 0.52, baseAngle: -35 * Math.PI / 180 }, // Top right, outer (Style.AI)
      { radiusFactor: 0.52, baseAngle: 15 * Math.PI / 180 },  // Right, outer (GetProspectra)
      { radiusFactor: 0.40, baseAngle: 55 * Math.PI / 180 },  // Bottom right, middle (ChatBridge)
      { radiusFactor: 0.28, baseAngle: 145 * Math.PI / 180 }  // Bottom left, inner (TaskFlow)
    ];
    return allProjects.map((p, idx) => {
      const config = orbitConfigs[idx % orbitConfigs.length];
      return {
        ...p,
        radiusFactor: config.radiusFactor,
        baseAngle: config.baseAngle
      };
    });
  }, [allProjects]);

  // Skills padding (exactly 8 skills for orbit)
  const skillsList = useMemo(() => {
    const defaultSkills = [
      { name: 'TypeScript', desc: 'Typed Javascript for scaling web apps.' },
      { name: 'React', desc: 'Interactive SPA development and rendering.' },
      { name: 'Next.js', desc: 'Server-side rendering and web routing.' },
      { name: 'AI & ML', desc: 'Integrating LLMs and ML workflows.' },
      { name: 'PostgreSQL', desc: 'Relational data query design and indexing.' },
      { name: 'Leadership', desc: 'Leading design and engineer collaboration.' },
      { name: 'Product Strategy', desc: 'Mapping product roadmaps and KPIs.' },
      { name: 'Problem Solving', desc: 'Deconstruct complex algorithms.' }
    ];

    const currentSkills = (skills || []).map(s => ({
      name: s.name,
      desc: 'Expert level skill and technical competency.'
    }));

    if (currentSkills.length >= 8) {
      return currentSkills.slice(0, 8);
    }
    const padCount = 8 - currentSkills.length;
    return [...currentSkills, ...defaultSkills.slice(0, padCount)];
  }, [skills]);

  // Dynamic timelines builder
  const journeyTimeline = useMemo(() => {
    const milestones: { year: string; title: string; desc: string; sortKey: number }[] = [];

    if (education && education.length > 0) {
      education.forEach(edu => {
        const year = edu.startYear || edu.endYear;
        if (year) {
          milestones.push({
            year,
            title: 'Studies Enrolled',
            desc: `Pursued ${edu.degree} in ${edu.specialization || 'Engineering'} at ${edu.institution}.`,
            sortKey: parseInt(year)
          });
        }
      });
    }

    if (experience && experience.length > 0) {
      experience.forEach(exp => {
        if (typeof exp.startDate === 'string' && exp.startDate) {
          const parts = exp.startDate.trim().split(' ');
          const year = parts[parts.length - 1];
          const yearNum = parseInt(year);
          if (year && !isNaN(yearNum)) {
            milestones.push({
              year,
              title: exp.position || 'Joined Company',
              desc: `Joined ${exp.company || 'Company'} as ${exp.position || 'Builder'} focusing on core deliverables.`,
              sortKey: yearNum
            });
          }
        }
      });
    }

    if (normalizedProjects && normalizedProjects.length > 0) {
      normalizedProjects.forEach((proj: any, idx: number) => {
        let baseYear = 2023;
        if (experience && experience[0] && typeof experience[0].startDate === 'string' && experience[0].startDate) {
          const startYearParts = experience[0].startDate.trim().split(' ');
          const parsed = parseInt(startYearParts[startYearParts.length - 1]);
          if (!isNaN(parsed)) {
            baseYear = parsed;
          }
        }
        const year = String(baseYear + Math.min(idx, 2));
        const descText = proj.description || '';
        milestones.push({
          year,
          title: `${showcaseLabels.actionVerb} ${proj.title}`,
          desc: descText.slice(0, 70) + (descText.length > 70 ? '...' : ''),
          sortKey: parseInt(year)
        });
      });
    }

    milestones.sort((a, b) => a.sortKey - b.sortKey);

    const uniqueMilestones: typeof milestones = [];
    const seenYears = new Set<string>();
    for (const m of milestones) {
      if (!seenYears.has(m.year)) {
        seenYears.add(m.year);
        uniqueMilestones.push(m);
      }
      if (uniqueMilestones.length >= 5) break;
    }

    const fallbacks = [
      { year: '2021', title: 'The Beginning', desc: 'Started my journey into programming and building.', sortKey: 2021 },
      { year: '2022', title: 'First Breakthrough', desc: 'Built my first full stack project and fell in love with product engineering.', sortKey: 2022 },
      { year: '2023', title: 'Scaling Up', desc: 'Worked on real-world projects and improved my architectural engineering skills.', sortKey: 2023 },
      { year: '2024', title: 'Building & Shipping', desc: 'Shipped multiple products and helped users solve real problems.', sortKey: 2024 },
      { year: '2025', title: 'Founder Mode', desc: 'Founded projects and created tools to empower digital creators.', sortKey: 2025 }
    ];

    for (const fb of fallbacks) {
      if (uniqueMilestones.length >= 5) break;
      if (!seenYears.has(fb.year)) {
        seenYears.add(fb.year);
        uniqueMilestones.push(fb);
      }
    }

    uniqueMilestones.sort((a, b) => a.sortKey - b.sortKey);
    uniqueMilestones.push({
      year: 'Future',
      title: "What's Next?",
      desc: 'Continuing to build, explore and make greater impact.',
      sortKey: 9999
    });

    return uniqueMilestones;
  }, [education, experience, projects]);

  // Stat achievements cards
  const milestonesStats = useMemo(() => {
    if (achievements && achievements.length > 0) {
      return achievements.map((ach, idx) => ({
        value: `${idx + 1}`,
        title: ach.title,
        desc: ach.description
      }));
    }
    return [
      { value: '10K+', title: 'Users Impacted', desc: 'Across all products and integrations.' },
      { value: '25K+', title: 'Lines of Code', desc: 'Clean, modular, and maintainable codebase.' },
      { value: '98%', title: 'Performance Score', desc: 'Average Lighthouse scores across web apps.' },
      { value: '5', title: 'Products Shipped', desc: 'From initial prototype to production.' },
      { value: '∞', title: 'Impact Created', desc: 'Solving real user challenges daily.' },
      { value: 'Top 5%', title: 'Problem Solver', desc: 'Always learning and expanding capabilities.' }
    ];
  }, [achievements]);

  // Animation hooks for dynamic orbits
  const [orbitTime, setOrbitTime] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('intro');
  const requestRef = useRef<number | null>(null);

  // Dynamic Section Ordering & Mappings
  const isSectionEnabled = (key: string, toggles: Record<string, boolean> | undefined) => {
    const sectionToggles = toggles || {};
    if (key === 'hero' || key === 'stats' || key === 'contact' || key === 'about' || key === 'journey' || key === 'designProcess') return true;
    if (key === 'skills' || key === 'practiceAreas' || key === 'portfolioShowcase' || key === 'campaigns') {
      return sectionToggles.skills !== false;
    }
    if (key === 'projects' || key === 'growthMetrics') {
      return sectionToggles.projects !== false;
    }
    if (key === 'publications') {
      return sectionToggles.publications !== false;
    }
    if (key === 'certifications') {
      return sectionToggles.certifications !== false;
    }
    if (key === 'experience') {
      return sectionToggles.experience !== false;
    }
    if (key === 'education') {
      return sectionToggles.education !== false;
    }
    if (key === 'workSamples') {
      return sectionToggles.workSamples !== false;
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
    if (key === 'projects' || key === 'initiatives') return 'Projects';
    if (key === 'about') return 'About';
    if (key === 'journey') return 'Journey';
    if (key === 'skills') return 'Skills';
    if (key === 'achievements') return 'Achievements';
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

  const toggles = portfolio.sectionToggles;

  const activeOrder = useMemo(() => {
    let defaultOrder: string[] = [];
    if (blueprint) {
      const dynamicSlots = getDynamicSections(blueprint);
      defaultOrder = ['about', ...dynamicSlots.map(s => s.id)];
      if (!defaultOrder.includes('journey')) defaultOrder.splice(2, 0, 'journey');
      if (!defaultOrder.includes('achievements')) defaultOrder.push('achievements');
    } else {
      if (isDeveloper) {
        defaultOrder = ['about', 'skills', 'projects', 'journey', 'achievements'];
      } else if (isLawyer) {
        defaultOrder = ['about', 'practiceAreas', 'certifications', 'publications', 'journey', 'education'];
      } else if (isDesigner) {
        defaultOrder = ['about', 'portfolioShowcase', 'designProcess', 'projects', 'journey', 'education', 'certifications'];
      } else if (isMarketing) {
        defaultOrder = ['about', 'campaigns', 'growthMetrics', 'journey', 'education', 'certifications'];
      } else {
        defaultOrder = ['about', 'projects', 'journey', 'skills', 'achievements'];
      }
    }

    const order = portfolio.sectionOrder && portfolio.sectionOrder.length > 0 ? portfolio.sectionOrder : defaultOrder;
    return order.filter(key => isSectionEnabled(key, toggles) && key !== 'hero' && key !== 'stats' && key !== 'contact');
  }, [blueprint, isDeveloper, isLawyer, isDesigner, isMarketing, portfolio.sectionOrder, toggles]);

  // Use a stringified dependency to completely prevent infinite loops regardless of object references
  const activeOrderDep = activeOrder.join(',');

  useEffect(() => {
    setMounted(true);
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 300;
      const sections = [
        { id: 'home', name: 'intro' },
        ...activeOrder.map(key => ({ id: key, name: key })),
        { id: 'contact', name: 'connect' }
      ];

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.name);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeOrderDep]);

  useEffect(() => {
    const updateTime = () => {
      // Speed changes depending on hovered states
      const speed = hoveredProject ? 0.05 : 0.2;
      setOrbitTime(prev => prev + speed);
      requestRef.current = requestAnimationFrame(updateTime);
    };
    requestRef.current = requestAnimationFrame(updateTime);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [hoveredProject]);

  // --- SUB-RENDERERS ---

  const renderHero = () => (
    <section id="home" className="min-h-screen relative flex flex-col justify-center items-center px-6 pt-20 overflow-hidden select-none">
      
      {/* Subtle background ambient nebulas */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[rgba(var(--color-primary-rgb),0.1)] rounded-full blur-[140px] pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto w-full text-center relative z-10 flex flex-col items-center justify-center min-h-[80vh]">
        <span className="text-[10px] md:text-xs tracking-[0.35em] text-[var(--color-primary)]/85 uppercase font-black font-space mb-2 block">
          WELCOME TO MY UNIVERSE
        </span>
        
        {/* Centered orbits wrapper around the title */}
        <div className="relative py-12 px-6 w-full flex justify-center items-center select-none">
          
          {/* 3D Circular Planet orbits containing projects */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-0 z-0 pointer-events-none">
            {/* Orbit paths - Tilted to match blueprint exactly and aligned dynamically */}
            <div className="absolute top-1/2 left-1/2 border border-[rgba(var(--color-primary-rgb),0.1)] border-dashed rounded-full" style={{ width: `${Math.min(windowWidth, 1100) * 0.28 * 2}px`, height: `${Math.min(windowWidth, 1100) * 0.28 * 2}px`, transform: 'translate(-50%, -50%) rotate(-18deg) scaleY(0.45)', filter: 'drop-shadow(0 0 6px rgba(var(--color-primary-rgb),0.1))' }} />
            <div className="absolute top-1/2 left-1/2 border border-[rgba(var(--color-primary-rgb),0.05)] border-dashed rounded-full" style={{ width: `${Math.min(windowWidth, 1100) * 0.40 * 2}px`, height: `${Math.min(windowWidth, 1100) * 0.40 * 2}px`, transform: 'translate(-50%, -50%) rotate(-18deg) scaleY(0.45)', filter: 'drop-shadow(0 0 6px rgba(var(--color-primary-rgb),0.05))' }} />
            <div className="absolute top-1/2 left-1/2 border border-[rgba(var(--color-primary-rgb),0.05)] border-dashed rounded-full" style={{ width: `${Math.min(windowWidth, 1100) * 0.52 * 2}px`, height: `${Math.min(windowWidth, 1100) * 0.52 * 2}px`, transform: 'translate(-50%, -50%) rotate(-18deg) scaleY(0.45)', filter: 'drop-shadow(0 0 6px rgba(var(--color-primary-rgb),0.05))' }} />
            
            {/* Dynamic Rendered Orbital Nodes */}
            {mounted && orbitProjects.map((p, idx) => {
              // Distribute start positions along orbits
              const angleOffset = p.baseAngle + (orbitTime * 0.003);
              
              // Generate circular positions
              const screenRadius = Math.min(windowWidth, 1100) * p.radiusFactor;
              const posX = Math.cos(angleOffset) * screenRadius;
              const posY = Math.sin(angleOffset) * screenRadius * 0.45; // Flatten to 3D ellipse perspective
              
              // Rotate coordinates to tilt the orbits in 2D space
              const tilt = -18 * Math.PI / 180;
              const rotatedX = posX * Math.cos(tilt) - posY * Math.sin(tilt);
              const rotatedY = posX * Math.sin(tilt) + posY * Math.cos(tilt);

              // Calculate depth
              const sinZ = Math.sin(angleOffset);
              const scale = 0.8 + (sinZ + 1) * 0.15;
              const zIndex = Math.round((sinZ + 1) * 15);
              
              // Hover logic triggers
              const isHovered = hoveredProject && hoveredProject.name === p.name;
              
              const lowerName = (p.name || '').toLowerCase();
              let iconBg = 'bg-[rgba(var(--color-primary-rgb),0.9)]';
              let IconComponent = LayoutTemplate;
              
              if (lowerName.includes('getprospectra')) {
                iconBg = 'bg-[#6366f1]';
                IconComponent = Rocket;
              } else if (lowerName.includes('style')) {
                iconBg = 'bg-[#f43f5e]';
                IconComponent = Sparkles;
              } else if (lowerName.includes('prospecta')) {
                iconBg = 'bg-[#3b82f6]';
                IconComponent = Globe;
              } else if (lowerName.includes('taskflow') || lowerName.includes('task')) {
                iconBg = 'bg-[#10b981]';
                IconComponent = Check;
              } else if (lowerName.includes('chatbridge') || lowerName.includes('chat')) {
                iconBg = 'bg-[#ec4899]';
                IconComponent = Send;
              }

              return (
                <div
                  onMouseEnter={() => setHoveredProject(p)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onClick={() => {
                    setActiveProject(p);
                    setHoveredProject(null);
                  }}
                  key={idx}
                  className="absolute top-1/2 left-1/2 transition-transform duration-100 pointer-events-auto"
                  style={{
                    transform: `translate3d(calc(${rotatedX}px - 50%), calc(${rotatedY}px - 50%), 0) scale(${isHovered ? 1.15 : scale}) rotate(-10deg)`,
                    zIndex: isHovered ? 50 : zIndex,
                  }}
                >
                  <div className={`pl-3 pr-5 py-2.5 rounded-xl border border-white/10 bg-[var(--color-surface)]/85 backdrop-blur-md text-left flex items-center gap-3 cursor-pointer shadow-2xl hover:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.3)] hover:border-[rgba(var(--color-primary-rgb),0.4)] transition-all select-none duration-300 ${isHovered ? 'ring-2 ring-[rgba(var(--color-primary-rgb),0.5)] shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)]' : ''}`}>
                    <div className={`w-9 h-9 rounded-lg ${iconBg} text-white flex items-center justify-center shrink-0 shadow-md`}>
                      <IconComponent size={16} />
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold text-white tracking-wide block font-space leading-tight">{p.name}</span>
                      <span className="text-[9px] text-gray-400 block mt-0.5 font-sans-pref leading-none">{p.category.slice(0, 24)}</span>
                    </div>
                  </div>

                  {/* Floating Preview Overlay detail */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-2 w-56 glass-card p-4 rounded-[var(--radius-card)] shadow-xl z-50 text-left pointer-events-none"
                      >
                        <h5 className="text-xs font-extrabold text-[var(--color-primary)] uppercase tracking-wide">{p.name}</h5>
                        <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{p.description.slice(0, 80)}...</p>
                        <div className="flex gap-1.5 flex-wrap mt-3">
                          {p.technologies.slice(0, 3).map((tech: string, tIdx: number) => (
                            <span key={tIdx} className="text-[8px] bg-[rgba(var(--color-primary-rgb),0.1)] text-[var(--color-primary)] px-2 py-0.5 rounded uppercase font-bold">{tech}</span>
                          ))}
                        </div>
                        <span className="text-[8px] text-[var(--color-primary)] font-extrabold uppercase mt-3 flex items-center gap-0.5">
                          EXPLORE CASE STUDY <ChevronRight size={10} />
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* Orbiting Metallic 3D Spheres */}
            {mounted && [
              { radiusFactor: 0.28, angleOffset: 0.8, size: 'w-3 h-3' },
              { radiusFactor: 0.40, angleOffset: 2.2, size: 'w-5 h-5' },
              { radiusFactor: 0.52, angleOffset: 3.5, size: 'w-4 h-4' },
              { radiusFactor: 0.40, angleOffset: 4.8, size: 'w-3.5 h-3.5' },
              { radiusFactor: 0.52, angleOffset: 1.2, size: 'w-6 h-6' }
            ].map((sph, sIdx) => {
              const angle = sph.angleOffset + (orbitTime * 0.003);
              const screenRadius = Math.min(windowWidth, 1100) * sph.radiusFactor;
              const px = Math.cos(angle) * screenRadius;
              const py = Math.sin(angle) * screenRadius * 0.45;
              
              // Rotate coordinates to match tilt
              const tilt = -18 * Math.PI / 180;
              const rx = px * Math.cos(tilt) - py * Math.sin(tilt);
              const ry = px * Math.sin(tilt) + py * Math.cos(tilt);
              
              const sinZ = Math.sin(angle);
              const scale = 0.5 + (sinZ + 1) * 0.15; // smaller spheres
              const zIndex = Math.round((sinZ + 1) * 15);
              
              return (
                <div 
                  key={`sph-${sIdx}`}
                  className={`absolute top-1/2 left-1/2 ${sph.size} rounded-full bg-gradient-to-br from-purple-300 via-purple-800 to-[#020617] shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.4)] pointer-events-none transition-transform duration-100`}
                  style={{
                    transform: `translate3d(calc(${rx}px - 50%), calc(${ry}px - 50%), 0) scale(${scale})`,
                    zIndex: zIndex,
                  }}
                />
              );
            })}
          </div>

          {/* The Title */}
          <h1 className="relative z-10 text-6xl md:text-8xl lg:text-[7.5rem] font-black tracking-tighter leading-[0.85] font-outfit uppercase select-text text-shadow-glow">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-200 to-purple-500 drop-shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.2)]">
              {firstName.toUpperCase()} <br /> {lastName}
            </span>
          </h1>
        </div>

        <p className="text-xs md:text-sm text-gray-400 font-sans-pref max-w-xl mt-4 leading-relaxed">
          I turn ideas into immersive digital experiences <br className="hidden md:inline" /> and products that solve <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold select-text">real problems.</span>
        </p>

        {/* Central CTAs */}
        <div className="mt-8 flex gap-4">
          <motion.a 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="#projects"
            className="px-8 py-3.5 bg-[var(--color-surface)]/80 border border-[rgba(var(--color-primary-rgb),0.4)] hover:border-[var(--color-primary)] hover:bg-[var(--color-surface)] text-white rounded-full text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 cursor-pointer font-space transition-all duration-300 shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.15)] hover:shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.3)]"
          >
            Explore My Universe <Rocket size={12} strokeWidth={2.5} />
          </motion.a>
        </div>
        
        {/* Scroll directive indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 hover:opacity-80 transition-opacity">
          <span className="text-[9px] tracking-[0.25em] uppercase font-bold text-gray-500 font-space">Scroll to Explore</span>
          <div className="w-5 h-8 border-2 border-[rgba(var(--color-primary-rgb),0.35)] rounded-full flex justify-center p-1">
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-1.5 bg-[var(--color-primary)] rounded-full"
            />
          </div>
        </div>
      </div>
    </section>
  );

  const renderAbout = () => (
    <section id="about" className="py-24 px-6 md:px-12 lg:px-24 border-t border-b border-white/5 bg-black/30 relative z-10 scroll-mt-16" key="about">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left: Astronaut Graphic (Generate image) */}
        <div className="lg:col-span-5 flex justify-center relative">
          <div className="absolute inset-0 bg-[var(--color-primary)]/10 rounded-full blur-[100px] pointer-events-none" />
          <motion.div 
            whileHover={{ rotateY: 10, rotateX: -5 }}
            className="w-72 h-96 relative rounded-[var(--radius-card)] overflow-hidden border border-white/10 shadow-2xl bg-slate-950 p-2 transform transition-transform"
          >
            <img 
              src="/images/astronaut_space.png" 
              alt="Astronaut explorer"
              className="w-full h-full object-cover rounded-[var(--radius-card)] opacity-80"
            />
            {/* Visor scanning glow line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent animate-scan" style={{ animationDuration: '4s', animationIterationCount: 'infinite', animationTimingFunction: 'linear' }} />
          </motion.div>
        </div>

        {/* Right: Detailed positioning & trait cards */}
        <div className="lg:col-span-7 space-y-8 text-left">
          <div className="space-y-3">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[var(--color-primary)] uppercase font-space block">ABOUT ME</span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-outfit uppercase">
              I'm a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-indigo-400">builder, explorer</span> <br className="hidden sm:inline" />
              and problem solver.
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed font-sans-pref">
              {summary || 'I love building products that create impact, solve complex challenges and deliver exceptional user experiences.'}
            </p>
          </div>

          {/* Builder Traits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Product Thinking', desc: 'Focus on user first approach and core product objectives.', icon: Cpu },
              { title: 'Full Stack Builder', desc: 'End-to-end execution with reliable architectures.', icon: Code },
              { title: 'Problem Solver', desc: 'Deconstructing complex engineering problems into clean modules.', icon: Search },
              { title: 'Impact Driven', desc: 'Measuring outcomes, performance, and actual user value.', icon: Award }
            ].map((trait, idx) => {
              const Icon = trait.icon;
              return (
                <motion.div
                  whileHover={{ y: -4, borderColor: 'rgba(var(--color-primary-rgb),0.3)' }}
                  key={idx}
                  className="p-4 rounded-[var(--radius-card)] glass-card flex gap-4 items-start transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-[rgba(var(--color-primary-rgb),0.1)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                    <Icon size={15} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-space">{trait.title}</h4>
                    <p className="text-[10px] text-gray-500 mt-1 leading-relaxed font-sans-pref">{trait.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Stat Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-white/5">
            <div>
              <span className="text-2xl font-black font-space block text-[var(--color-primary)]">5+</span>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-extrabold mt-1 block">Products Built</span>
            </div>
            <div>
              <span className="text-2xl font-black font-space block text-[var(--color-primary)]">3+</span>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-extrabold mt-1 block">Years Experience</span>
            </div>
            <div>
              <span className="text-2xl font-black font-space block text-[var(--color-primary)]">End-to-End</span>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-extrabold mt-1 block">From Concept to Launch</span>
            </div>
            <div>
              <span className="text-2xl font-black font-space block text-[var(--color-primary)]">∞</span>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-extrabold mt-1 block">Learning Daily</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderProjects = () => (
    <section id="projects" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto scroll-mt-16" key="projects">
      <div className="flex justify-between items-end border-b border-white/5 pb-4 mb-12">
        <div className="text-left">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[var(--color-primary)] uppercase font-space">FEATURED {showcaseLabels.sectionTitle.toUpperCase()}</span>
          <h2 className="text-3xl font-extrabold font-outfit uppercase mt-1">Things I've Built</h2>
        </div>
        <a href="#projects" className="text-xs font-bold text-[var(--color-primary)] hover:text-[#8b5cf6] transition-colors flex items-center gap-1 uppercase tracking-widest font-space">
          View All {showcaseLabels.sectionTitle} <ArrowRight size={14} />
        </a>
      </div>

      {/* Portfolio Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allProjects.map((proj, idx) => (
          <motion.div 
            whileHover={{ y: -6 }}
            key={idx} 
            className="border border-white/5 rounded-[var(--radius-card)] overflow-hidden glass-card flex flex-col h-full group"
          >
            {/* Card top banner */}
            <div className="h-44 bg-[#0a0a14] border-b border-white/5 p-6 flex flex-col justify-between relative overflow-hidden shrink-0">
              <div className="absolute right-0 top-0 w-32 h-32 bg-[var(--color-primary)]/5 rounded-full blur-2xl pointer-events-none"></div>
              
              {/* Browser dots */}
              <div className="flex gap-1.5 z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60"></div>
              </div>
              
              <div className="text-white relative z-10 space-y-1">
                <span className="text-[8px] font-black text-[var(--color-primary)] tracking-wider uppercase">{proj.category}</span>
                <h4 className="text-lg font-bold font-space leading-tight">{proj.name}</h4>
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow text-left">
              {/* Description summary */}
              <p className="text-[11px] mb-4 leading-relaxed font-sans-pref text-gray-400">
                {proj.description}
              </p>
              
              {(proj as any).achievements && (proj as any).achievements.length > 0 && (
                <ul className="space-y-1.5 mb-6 flex-grow">
                  {(proj as any).achievements.slice(0, 3).map((bullet: string, bIdx: number) => (
                    <li key={bIdx} className="relative pl-3.5 before:content-['•'] before:absolute before:left-0 before:text-[var(--color-primary)] text-[10px] text-gray-400 leading-relaxed font-sans-pref">{bullet}</li>
                  ))}
                </ul>
              )}

              <div className="space-y-3 mb-6 shrink-0 border-t border-white/5 pt-4">
                <div className="text-[10px] leading-relaxed text-gray-500">
                  <strong className="font-bold text-gray-300">My Role:</strong> {proj.role}
                </div>
              </div>
              
              {/* Technologies */}
              {proj.technologies && proj.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6 shrink-0">
                  {proj.technologies.slice(0, 4).map((tech: string, tIdx: number) => (
                    <span key={tIdx} className="text-[8px] font-black px-2.5 py-1 bg-[rgba(var(--color-primary-rgb),0.1)] text-[var(--color-primary)] rounded uppercase tracking-wider">{tech}</span>
                  ))}
                </div>
              )}
              
              <button 
                onClick={() => setActiveProject(proj)}
                className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl border border-white/10 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer mt-auto font-space"
              >
                Explore Case Study <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );

  const renderJourney = () => (
    <section id="journey" className="py-24 px-6 md:px-12 lg:px-24 border-t border-b border-white/5 bg-black/20 scroll-mt-16" key="journey">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-left">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[var(--color-primary)] uppercase font-space block">MY JOURNEY</span>
          <h2 className="text-3xl font-extrabold font-outfit uppercase mt-1">The Journey So Far</h2>
        </div>

        {/* SVG Animated Connector Journey Path */}
        <div className="relative pt-6">
          {/* Connector path line */}
          <div className="hidden md:block absolute top-[15px] left-[5%] right-[5%] h-[2px] bg-gradient-to-r from-purple-500/10 via-purple-500/40 to-purple-500/10 z-0">
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              className="w-full h-full bg-[var(--color-primary)] origin-left shadow-[0_0_8px_var(--color-primary)]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-8 relative z-10">
            {journeyTimeline.map((item, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                key={idx} 
                className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 group"
              >
                {/* Glowing Node dot */}
                <div className="w-7 h-7 rounded-full bg-[var(--color-bg)] border-2 border-[rgba(var(--color-primary-rgb),0.4)] group-hover:border-[var(--color-primary)] flex items-center justify-center z-10 transition-colors shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.15)] relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:scale-110 transition-all shadow-[0_0_10px_var(--color-primary)]" />
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-[var(--color-primary)] tracking-wider font-space">{item.year}</span>
                  <h4 className="text-xs font-bold tracking-tight text-white mt-0.5">{item.title}</h4>
                  <p className="text-[9px] mt-1.5 leading-normal max-w-[170px] text-gray-500 font-sans-pref">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  const renderSkillsList = () => (
    <section id="skills" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto scroll-mt-16" key="skills">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left panel */}
        <div className="lg:col-span-4 space-y-6 text-left">
          <div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-[var(--color-primary)] uppercase font-space block">SKILLS UNIVERSE</span>
            <h2 className="text-3xl font-extrabold font-outfit uppercase mt-1">My Skills Universe</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed font-sans-pref">
            I work at the intersection of technology, design and product to build exceptional digital experiences.
          </p>
          <motion.a 
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            href="#contact"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 border border-white/10 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer font-space"
          >
            Explore My Skills <ChevronRight size={12} />
          </motion.a>
        </div>

        {/* Right: Rotating 3D Cube Canvas & orbiting skill nodes */}
        <div className="lg:col-span-8 flex justify-center items-center relative h-[450px]">
          {/* Background 3D Elliptical Orbits */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] border border-[rgba(var(--color-primary-rgb),0.05)] rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[220px] border border-[rgba(var(--color-primary-rgb),0.05)] rounded-full rotate-[15deg]" />
          </div>

          {/* Central Wireframe Vector 3D Cube Canvas */}
          <div className="relative z-10 w-48 h-48">
            <SkillsCubeCanvas />
          </div>

          {/* Orbiting Skill Node Badges */}
          {mounted && skillsList.map((s: { name: string; desc: string }, idx: number) => {
            // Mathematical offsets for orbiting skills
            const orbitRadiusX = 180 + (idx * 6);
            const orbitRadiusY = 90 + (idx * 2);
            const angleOffset = (idx * (2 * Math.PI) / 8) + (orbitTime * 0.002);
            
            const posX = Math.cos(angleOffset) * orbitRadiusX;
            const posY = Math.sin(angleOffset) * orbitRadiusY;
            
            const sinZ = Math.sin(angleOffset);
            const scale = 0.8 + (sinZ + 1) * 0.12;
            const zIndex = Math.round((sinZ + 1) * 15);
            
            const isHovered = hoveredSkill === s.name;

            return (
              <div
                onMouseEnter={() => setHoveredSkill(s.name)}
                onMouseLeave={() => setHoveredSkill(null)}
                key={idx}
                className="absolute top-1/2 left-1/2 transition-transform duration-100 pointer-events-auto"
                style={{
                  transform: `translate3d(calc(${posX}px - 50%), calc(${posY}px - 50%), 0) scale(${isHovered ? 1.1 : scale})`,
                  zIndex: isHovered ? 60 : zIndex,
                }}
              >
                <div className={`px-3 py-1.5 rounded-full glass-card text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-help border border-white/5 hover:border-[rgba(var(--color-primary-rgb),0.4)] select-none ${isHovered ? 'ring-1 ring-[rgba(var(--color-primary-rgb),0.5)] shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.1)]' : ''}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                  <span>{s.name}</span>
                </div>

                {/* Tooltip Description block */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 glass-card p-3 rounded-xl shadow-xl z-50 text-center pointer-events-none"
                    >
                      <h6 className="text-[10px] font-black text-[var(--color-primary)] uppercase leading-none">{s.name}</h6>
                      <p className="text-[8px] text-gray-500 mt-1 leading-normal font-sans-pref">{s.desc}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );

  const renderAchievements = () => (
    <section id="achievements" className="py-24 px-6 md:px-12 lg:px-24 border-t border-b border-white/5 bg-black/30 scroll-mt-16" key="achievements">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-left">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[var(--color-primary)] uppercase font-space block">ACHIEVEMENTS</span>
          <h2 className="text-3xl font-extrabold font-outfit uppercase mt-1">Milestones & Impact</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {milestonesStats.map((stat, idx) => (
            <motion.div
              whileHover={{ y: -4, borderColor: 'rgba(var(--color-primary-rgb),0.25)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              key={idx}
              className="p-6 rounded-[var(--radius-card)] glass-card flex flex-col justify-between text-left h-44 border border-white/5 relative group overflow-hidden"
            >
              {/* Visual glow element */}
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-[rgba(var(--color-primary-rgb),0.05)] rounded-full blur-xl pointer-events-none group-hover:bg-[var(--color-primary)]/10 transition-colors" />
              
              <div className="w-9 h-9 rounded-xl bg-[rgba(var(--color-primary-rgb),0.1)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                <Trophy size={16} />
              </div>
              
              <div className="space-y-1 mt-4">
                <span className="text-2xl font-black font-space block text-white group-hover:text-[var(--color-primary)] transition-colors">{stat.value}</span>
                <h4 className="text-[11px] font-bold font-space uppercase text-gray-300 mt-1">{stat.title}</h4>
                <p className="text-[10px] text-gray-500 mt-1 font-sans-pref leading-relaxed">{stat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderPracticeAreas = () => {
    const practiceAreasList = profile.extensions?.practiceAreas || [];
    if (practiceAreasList.length === 0) return null;
    return (
      <section id="practiceAreas" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto scroll-mt-16" key="practiceAreas">
        <div className="flex justify-between items-end border-b border-white/5 pb-4 mb-12">
          <div className="text-left">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[var(--color-primary)] uppercase font-space">LEGAL DEPTH</span>
            <h2 className="text-3xl font-extrabold font-outfit uppercase mt-1">Practice Areas</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {practiceAreasList.map((area, idx) => (
            <motion.div 
              whileHover={{ y: -4, borderColor: 'rgba(var(--color-primary-rgb),0.3)' }}
              key={idx} 
              className="p-5 rounded-[var(--radius-card)] glass-card flex items-center gap-4 transition-all duration-300 border border-white/5 hover:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.15)]"
            >
              <div className="w-10 h-10 rounded-xl bg-[rgba(var(--color-primary-rgb),0.1)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                <Shield size={18} />
              </div>
              <h4 className="font-bold text-white text-base font-space tracking-tight">{area}</h4>
            </motion.div>
          ))}
        </div>
      </section>
    );
  };

  const renderPublications = () => {
    const publicationsList = profile.publications || [];
    if (publicationsList.length === 0) return null;
    return (
      <section id="publications" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto scroll-mt-16" key="publications">
        <div className="flex justify-between items-end border-b border-white/5 pb-4 mb-12">
          <div className="text-left">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[var(--color-primary)] uppercase font-space">PUBLICATIONS</span>
            <h2 className="text-3xl font-extrabold font-outfit uppercase mt-1">Publications & Writing</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {publicationsList.map((pub, idx) => (
            <motion.div 
              whileHover={{ y: -4, borderColor: 'rgba(var(--color-primary-rgb),0.3)' }}
              key={idx} 
              className="p-6 rounded-[var(--radius-card)] glass-card flex items-start gap-4 transition-all duration-300 border border-white/5 hover:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.15)]"
            >
              <div className="w-10 h-10 rounded-xl bg-[rgba(var(--color-primary-rgb),0.1)] text-[var(--color-primary)] flex items-center justify-center shrink-0 mt-0.5">
                <BookOpen size={18} />
              </div>
              <p className="text-gray-300 text-sm font-sans-pref leading-relaxed">{pub}</p>
            </motion.div>
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
      <section id="portfolioShowcase" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto scroll-mt-16" key="portfolioShowcase">
        <div className="flex justify-between items-end border-b border-white/5 pb-4 mb-12">
          <div className="text-left">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[var(--color-primary)] uppercase font-space">DESIGN SHOWCASE</span>
            <h2 className="text-3xl font-extrabold font-outfit uppercase mt-1">Portfolio Showcase</h2>
          </div>
        </div>
        {(behanceUrl || dribbbleUrl) && (
          <div className="flex flex-wrap gap-4 mb-8">
            {behanceUrl && (
              <motion.a 
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                href={behanceUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="px-6 py-2.5 border border-[rgba(var(--color-primary-rgb),0.35)] text-[var(--color-primary)] hover:bg-[rgba(var(--color-primary-rgb),0.1)] rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 font-space"
              >
                <Globe size={14} /> Behance Portfolio
              </motion.a>
            )}
            {dribbbleUrl && (
              <motion.a 
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                href={dribbbleUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="px-6 py-2.5 border border-[rgba(var(--color-primary-rgb),0.35)] text-[var(--color-primary)] hover:bg-[rgba(var(--color-primary-rgb),0.1)] rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 font-space"
              >
                <Globe size={14} /> Dribbble Portfolio
              </motion.a>
            )}
          </div>
        )}
        {workSamplesList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {workSamplesList.map((sample, idx) => (
              <motion.div 
                whileHover={{ y: -6, borderColor: 'rgba(var(--color-primary-rgb),0.3)' }}
                key={idx} 
                className="p-6 rounded-[var(--radius-card)] glass-card flex flex-col justify-between transition-all duration-300 border border-white/5 hover:shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.15)] space-y-4"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white text-xl font-space tracking-tight">{sample.title}</h4>
                  {sample.url && (
                    <a href={sample.url} target="_blank" rel="noreferrer" className="text-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
                {sample.description && <p className="text-gray-400 text-xs font-light font-sans-pref leading-relaxed">{sample.description}</p>}
              </motion.div>
            ))}
          </div>
        )}
      </section>
    );
  };

  const renderDesignProcess = () => {
    const designTools = profile.extensions?.tools || ['User Research', 'Wireframing', 'UI Design', 'Prototyping', 'Usability Testing'];
    return (
      <section id="designProcess" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto scroll-mt-16" key="designProcess">
        <div className="flex justify-between items-end border-b border-white/5 pb-4 mb-12">
          <div className="text-left">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[var(--color-primary)] uppercase font-space">DESIGN PROCESS</span>
            <h2 className="text-3xl font-extrabold font-outfit uppercase mt-1">Design Process & Tools</h2>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {designTools.map((tool, idx) => (
            <motion.div 
              whileHover={{ scale: 1.05, borderColor: 'rgba(var(--color-primary-rgb),0.3)' }}
              key={idx} 
              className="px-5 py-3 border border-white/5 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-300 glass-card transition-colors flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
              <span className="font-space">{tool}</span>
            </motion.div>
          ))}
        </div>
      </section>
    );
  };

  const renderCampaigns = () => {
    const campaignsList = profile.extensions?.campaigns || [];
    if (campaignsList.length === 0) return null;
    return (
      <section id="campaigns" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto scroll-mt-16" key="campaigns">
        <div className="flex justify-between items-end border-b border-white/5 pb-4 mb-12">
          <div className="text-left">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[var(--color-primary)] uppercase font-space">MARKETING</span>
            <h2 className="text-3xl font-extrabold font-outfit uppercase mt-1">Campaigns</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {campaignsList.map((camp, idx) => (
            <motion.div 
              whileHover={{ y: -4, borderColor: 'rgba(var(--color-primary-rgb),0.3)' }}
              key={idx} 
              className="p-6 rounded-[var(--radius-card)] glass-card flex items-start gap-4 transition-all duration-300 border border-white/5 hover:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.15)]"
            >
              <div className="w-10 h-10 rounded-xl bg-[rgba(var(--color-primary-rgb),0.1)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                <Zap size={18} />
              </div>
              <div>
                <h4 className="font-bold text-white text-lg font-space tracking-tight leading-tight">{camp}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    );
  };

  const renderGrowthMetrics = () => {
    const growthMetricsList = profile.extensions?.growthMetrics || [];
    if (growthMetricsList.length === 0) return null;
    return (
      <section id="growthMetrics" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto scroll-mt-16" key="growthMetrics">
        <div className="flex justify-between items-end border-b border-white/5 pb-4 mb-12">
          <div className="text-left">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[var(--color-primary)] uppercase font-space">OUTCOMES</span>
            <h2 className="text-3xl font-extrabold font-outfit uppercase mt-1">Growth Metrics</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {growthMetricsList.map((metric, idx) => (
            <motion.div 
              whileHover={{ y: -4, borderColor: 'rgba(var(--color-primary-rgb),0.3)' }}
              key={idx} 
              className="p-6 rounded-[var(--radius-card)] glass-card flex items-center gap-4 transition-all duration-300 border border-white/5 hover:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.15)]"
            >
              <div className="w-10 h-10 rounded-xl bg-[rgba(var(--color-primary-rgb),0.1)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                <TrendingUp size={18} />
              </div>
              <h4 className="font-bold text-white text-base font-space tracking-tight leading-tight">{metric}</h4>
            </motion.div>
          ))}
        </div>
      </section>
    );
  };

  const renderCertificationsOnly = () => {
    if (!profile.certifications || profile.certifications.length === 0) return null;
    return (
      <section id="certifications" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto scroll-mt-16" key="certifications">
        <div className="flex justify-between items-end border-b border-white/5 pb-4 mb-12">
          <div className="text-left">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[var(--color-primary)] uppercase font-space">CREDENTIALS</span>
            <h2 className="text-3xl font-extrabold font-outfit uppercase mt-1">Certifications</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.certifications.map((cert, idx) => (
            <motion.div 
              whileHover={{ y: -4, borderColor: 'rgba(var(--color-primary-rgb),0.3)' }}
              key={idx} 
              className="p-5 rounded-[var(--radius-card)] glass-card flex justify-between items-start gap-4 border border-white/5 transition-all duration-300 hover:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.15)]"
            >
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-[rgba(var(--color-primary-rgb),0.1)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                  <Award size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-space leading-tight">{typeof cert === 'string' ? cert : (cert.title || (cert as any).name || 'Certification')}</h4>
                  <p className="text-[10px] text-gray-400 font-sans-pref mt-0.5">{typeof cert === 'string' ? '' : cert.issuer || 'Credential Issuer'} {cert.issueDate ? `(${typeof cert === 'string' ? '' : cert.issueDate})` : ''}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    );
  };

  const renderEducationOnly = () => {
    if (!profile.education || profile.education.length === 0) return null;
    return (
      <section id="education" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto scroll-mt-16" key="education">
        <div className="flex justify-between items-end border-b border-white/5 pb-4 mb-12">
          <div className="text-left">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[var(--color-primary)] uppercase font-space">ACADEMICS</span>
            <h2 className="text-3xl font-extrabold font-outfit uppercase mt-1">Education</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.education.map((edu, idx) => (
            <motion.div 
              whileHover={{ y: -4, borderColor: 'rgba(var(--color-primary-rgb),0.3)' }}
              key={idx} 
              className="p-5 rounded-[var(--radius-card)] glass-card flex justify-between items-start gap-4 border border-white/5 transition-all duration-300 hover:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.15)]"
            >
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-[rgba(var(--color-primary-rgb),0.1)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                  <BookOpen size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-space leading-tight">{edu.degree}</h4>
                  <p className="text-[10px] text-gray-400 font-sans-pref mt-0.5">{edu.institution} {edu.specialization ? `• ${edu.specialization}` : ''}</p>
                </div>
              </div>
              {(edu.startYear || edu.endYear) && (
                <span className="text-[9px] font-black text-[var(--color-primary)] font-space whitespace-nowrap bg-[rgba(var(--color-primary-rgb),0.1)] px-2 py-0.5 rounded">
                  {edu.startYear ? `${edu.startYear} - ` : ''}{edu.endYear || 'Present'}
                </span>
              )}
            </motion.div>
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
    experience: () => renderJourney(),
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
    <div className="min-h-screen font-sans overflow-x-hidden selection:bg-[rgba(var(--color-primary-rgb),0.3)] selection:text-[var(--color-text)] relative transition-colors duration-500" style={{
      backgroundColor: 'var(--color-bg)',
      color: 'var(--color-text)',
      '--color-primary': dna.tokens.colors.primary,
      '--color-primary-rgb': hexToRgb(dna.tokens.colors.primary),
      '--color-secondary': dna.tokens.colors.secondary,
      '--color-secondary-rgb': hexToRgb(dna.tokens.colors.secondary),
      '--color-bg': dna.tokens.colors.background,
      '--color-surface': dna.tokens.colors.surface,
      '--color-text': dna.tokens.colors.text,
      '--color-muted': dna.tokens.colors.muted,
      '--color-accent': dna.tokens.colors.accent,
      '--font-heading': dna.tokens.typography.heading,
      '--font-body': dna.tokens.typography.body,
      '--radius-card': dna.tokens.geometry.borderRadius,
      '--border-card': dna.tokens.geometry.cardBorder,
    } as React.CSSProperties}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('${dna.tokens.typography.importUrl}');
        
        .font-space { font-family: var(--font-body); }
        .font-outfit { font-family: var(--font-heading); }
        .font-sans-pref { font-family: var(--font-body); }
        
        html { scroll-behavior: smooth !important; }
        
        /* Glassmorphism utility */
        .glass-card {
          background: var(--color-surface);
          backdrop-filter: blur(16px) saturate(120%);
          border: var(--border-card);
        }
        
        .glow-purple {
          box-shadow: 0 0 40px rgba(var(--color-primary-rgb), 0.18);
        }

        .text-shadow-glow {
          filter: drop-shadow(0 2px 15px rgba(var(--color-primary-rgb),0.45)) drop-shadow(0 0 50px rgba(var(--color-primary-rgb),0.2));
        }
      `}} />

      {/* Global Canvas Particle System */}
      <SpaceParticles />

      {/* Sticky Top Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/45 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <span className="font-space font-bold text-2xl tracking-tighter cursor-pointer text-white" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {firstName.toUpperCase()}<span className="text-[var(--color-primary)]">.</span>
          </span>
          
          <div className="hidden lg:flex flex-wrap items-center justify-center gap-4 lg:gap-6 text-[11px] lg:text-[12px] font-semibold tracking-wider">
            {[
              { label: 'Home', id: 'home', name: 'intro' },
              ...activeOrder
                .filter(key => !['education', 'certifications', 'publications', 'achievements'].includes(key))
                .slice(0, 5)
                .map(key => ({
                  label: getSectionLabel(key),
                  id: key,
                  name: key
              })),
              { label: 'Contact', id: 'contact', name: 'connect' }
            ].map((item) => {
              const isActive = activeSection === item.name;
              return (
                <a 
                  key={item.id}
                  href={`#${item.id}`} 
                  className={`hover:text-[var(--color-primary)] transition-colors relative py-1 font-space text-xs tracking-wide ${isActive ? 'text-white font-bold' : 'text-gray-400'}`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span 
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[var(--color-primary)] rounded-full shadow-[0_0_8px_var(--color-primary)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <motion.a 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={`mailto:${personalInfo.email}`}
              className="bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-primary)] to-[var(--color-secondary)] hover:brightness-110 text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-wider flex items-center gap-1.5 cursor-pointer font-space shadow-lg shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.1)]"
            >
              Let's Connect <span className="font-sans">→</span>
            </motion.a>
            
            <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer" title="Settings">
              <Settings size={14} className="animate-[spin_10s_linear_infinite]" />
            </button>
          </div>
        </div>
      </nav>

      {/* Left Vertical Section Tracker */}
      <div className="fixed left-8 md:left-12 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-8 select-none">
        {/* Continuous timeline track line */}
        <div className="absolute left-[5px] top-[14px] bottom-[14px] w-[1px] bg-gradient-to-b from-purple-500/30 via-white/10 to-purple-500/30 z-0 pointer-events-none" />
        
        {[
          { label: 'INTRO', name: 'intro', num: '01', id: 'home' },
          ...activeOrder.map((key, idx) => ({
            label: getSectionLabel(key).toUpperCase(),
            name: key,
            num: String(idx + 2).padStart(2, '0'),
            id: key
          })),
          { label: 'CONNECT', name: 'connect', num: String(activeOrder.length + 2).padStart(2, '0'), id: 'contact' }
        ].map((item, idx) => {
          const isActive = activeSection === item.name;
          return (
            <a 
              key={idx}
              href={`#${item.id}`}
              className="flex items-center gap-4 group pointer-events-auto cursor-pointer z-10"
            >
              <div className="relative w-2.5 h-2.5 flex items-center justify-center shrink-0">
                {/* Circle node indicator */}
                <div className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 flex items-center justify-center ${isActive ? 'border-[var(--color-primary)] bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)]' : 'border-white/20 bg-[var(--color-bg)] group-hover:border-white/40'}`}>
                  {isActive && <div className="w-1 h-1 rounded-full bg-white" />}
                </div>
              </div>
              
              <div className="flex flex-col text-left">
                <span className={`text-[8px] font-black tracking-widest leading-none ${isActive ? 'text-[var(--color-primary)]' : 'text-gray-600'}`}>{item.num}</span>
                <span className={`text-[9px] font-bold tracking-widest mt-1 font-space transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-400'}`}>{item.label}</span>
              </div>
            </a>
          );
        })}
      </div>

      {/* Floating social sidebar */}
      <div className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-6 border border-white/10 bg-[var(--color-surface)]/40 backdrop-blur-xl px-3 py-6 rounded-full shadow-2xl">
        {personalInfo.github && (
          <a href={`https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-200" title="GitHub">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
          </a>
        )}
        {personalInfo.linkedin && (
          <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-200" title="LinkedIn">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
          </a>
        )}
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-200" title="Twitter / X">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
        </a>
        {personalInfo.email && (
          <a href={`mailto:${personalInfo.email}`} className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-200" title="Email">
            <Mail className="w-5 h-5" strokeWidth={1.8} />
          </a>
        )}
      </div>

      {/* Main Content Area: Padding prevents overlap with sidebars on large screens */}
      <main className="w-full lg:pl-[240px] lg:pr-[80px] flex flex-col">
        {/* Hero Section */}
        {renderHero()}

        {/* Dynamically ordered sections */}
        {activeOrder.map(key => {
          const renderer = sectionMap[key];
          return renderer ? <React.Fragment key={key}>{renderer()}</React.Fragment> : null;
        })}

        {/* Footer / Contact portal section */}
        <footer id="contact" className="py-24 px-6 md:px-12 lg:px-24 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left contact details */}
          <div className="lg:col-span-5 space-y-8 text-left z-10">
            <div className="space-y-3">
              <span className="text-[10px] font-bold tracking-[0.25em] text-[var(--color-primary)] uppercase font-space block">LET'S CONNECT</span>
              <h2 className="text-4xl font-extrabold font-outfit uppercase">
                Let's Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Something Amazing</span> Together.
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed font-sans-pref">
                I'm always open to discussing new ideas, collaborations, and opportunities to build impactful digital solutions.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5 text-[11px] font-bold uppercase tracking-wider text-gray-300 font-space">
              {personalInfo.email && (
                <div className="flex items-center gap-3">
                  <Mail size={15} className="text-[var(--color-primary)] shrink-0" />
                  <a href={`mailto:${personalInfo.email}`} className="hover:text-[var(--color-primary)] transition-colors select-text">{personalInfo.email}</a>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={15} className="text-[var(--color-primary)] shrink-0" />
                  <span className="select-text">{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-3">
                  <MapPin size={15} className="text-[var(--color-primary)] shrink-0" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
            </div>

            <motion.a 
              onMouseEnter={() => setIsPortalHovered(true)}
              onMouseLeave={() => setIsPortalHovered(false)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={`mailto:${personalInfo.email}`}
              className="px-8 py-3.5 bg-[var(--color-primary)] hover:bg-[#8b5cf6] text-white rounded-full font-extrabold text-xs uppercase tracking-widest inline-flex items-center gap-2 cursor-pointer font-space shadow-lg shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.1)]"
            >
              Let's Connect <span className="font-sans">→</span>
            </motion.a>
          </div>

          {/* Right contact portal canvas (swirling energy, gate vortex) */}
          <div className="lg:col-span-7 flex justify-center items-center relative h-[360px] z-10">
            <div className="absolute inset-0 bg-[rgba(var(--color-primary-rgb),0.05)] rounded-full blur-[100px] pointer-events-none" />
            
            {/* The ancient vortex portal canvas */}
            <div className="w-[300px] h-[300px] relative">
              <ContactPortalCanvas isHovered={isPortalHovered} setIsHovered={setIsPortalHovered} />
            </div>

            {/* Glowing social buttons beside portal */}
            <div className="absolute right-0 flex flex-col gap-3 font-space uppercase text-[9px] tracking-widest font-black">
              {personalInfo.linkedin && (
                <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gray-500 hover:text-[var(--color-primary)] transition-colors py-1">
                  LINKEDIN <ChevronRight size={10} />
                </a>
              )}
              {personalInfo.github && (
                <a href={`https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gray-500 hover:text-[var(--color-primary)] transition-colors py-1">
                  GITHUB <ChevronRight size={10} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom footer bar */}
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] text-gray-500 font-bold uppercase tracking-wider font-space">
          <span>&copy; {new Date().getFullYear()} {personalInfo.fullName}. All rights reserved.</span>
          <span className="flex items-center gap-1 mt-2 sm:mt-0">
            Designed & Built with <span className="text-red-500 font-sans">♥</span> and <span className="text-[var(--color-primary)]">GetProspectra</span>.
          </span>
        </div>
      </footer>
      </main>

      {/* Futuristic Case Study Modal Overlay */}
      <AnimatePresence>
        {activeProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[var(--color-bg)]/90 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6"
            onClick={() => setActiveProject(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[var(--color-bg)] rounded-[var(--radius-card)] overflow-hidden max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-white/10 shadow-2xl relative text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header block */}
              <div className="bg-[var(--color-primary)] text-white p-6 md:p-8 flex justify-between items-start relative overflow-hidden border-b border-white/5">
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="space-y-1.5 relative z-10">
                  <span className="text-[9px] font-black tracking-widest uppercase text-purple-100 font-space">Product Case Study</span>
                  <h3 className="text-2xl font-bold font-outfit uppercase">{activeProject.name}</h3>
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
                  <h4 className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest font-space">The Challenge</h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans-pref">
                    {activeProject.problemSolved || "Designing a digital workspace that streamlines user activity while providing exceptional security and speed."}
                  </p>
                </div>

                {/* Approach / Vision */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest font-space">Vision & Approach</h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans-pref">
                    {activeProject.description || "Approached execution by mapping requirements, focusing on decoupled server layers, and drafting comprehensive layouts."}
                  </p>
                </div>

                {/* Execution */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest font-space">Execution & Role</h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans-pref">
                    As <strong className="font-semibold text-white">{activeProject.role || "Full Stack Developer"}</strong>, utilized dynamic frameworks to construct modern API integrations, manage asynchronous operations, and verify responsive design.
                  </p>
                </div>

                {/* Outcome & Impact */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest font-space">Outcome & Impact</h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans-pref">
                    {activeProject.impact || "Successfully built and deployed the system, meeting timeline guidelines and exceeding performance expectations with clean code standards."}
                  </p>
                </div>

                {/* Tech Stack */}
                {activeProject.technologies && activeProject.technologies.length > 0 && (
                  <div className="pt-4 border-t border-white/5 flex flex-wrap gap-1.5">
                    {activeProject.technologies.map((tech: string, idx: number) => (
                      <span key={idx} className="text-[9px] font-black text-[var(--color-primary)] bg-[rgba(var(--color-primary-rgb),0.1)] px-2.5 py-1 rounded-md uppercase tracking-wider font-space">{tech}</span>
                    ))}
                  </div>
                )}
                
                {/* External links */}
                {(activeProject.liveUrl || activeProject.githubUrl) && (
                  <div className="pt-4 border-t border-white/5 flex gap-4 font-space">
                    {activeProject.liveUrl && (
                      <a href={activeProject.liveUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1.5 uppercase tracking-wider">
                        <Globe size={14} /> {showcaseLabels.link2 || 'Live Demo'} <ExternalLink size={12} />
                      </a>
                    )}
                    {activeProject.githubUrl && (
                      <a href={activeProject.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 uppercase tracking-wider">
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

// Background space particle simulation
function SpaceParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let backgroundParticles: { x: number; y: number; size: number; speedY: number; opacity: number }[] = [];
    let swirlParticles: { r: number; angle: number; speed: number; size: number; opacity: number; color: string }[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Initialize background stars
      backgroundParticles = [];
      const bgCount = Math.min(Math.floor(window.innerWidth / 20), 60);
      for (let i = 0; i < bgCount; i++) {
        backgroundParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.2 + 0.3,
          speedY: (Math.random() * 0.15 + 0.05) * -1, // slow float up
          opacity: Math.random() * 0.4 + 0.1
        });
      }

      // Initialize swirling galaxy dust particles
      swirlParticles = [];
      const swirlCount = 140;
      const maxRadius = Math.min(window.innerWidth, 1100) * 0.38;
      for (let i = 0; i < swirlCount; i++) {
        // Distribute radius using power of random to cluster more particles closer to the center orbits
        const rFactor = Math.pow(Math.random(), 1.5);
        const r = 100 + rFactor * (maxRadius - 100);
        
        // Random starting angle
        const angle = Math.random() * Math.PI * 2;
        
        // Speed: slightly faster closer to center
        const speed = (0.0006 + Math.random() * 0.0008) * (1 - rFactor * 0.4);
        
        // Size & opacity
        const size = Math.random() * 1.3 + 0.3;
        const opacity = Math.random() * 0.55 + 0.15;
        
        // Curated colors matching the purple/pink/silver aesthetic
        const rand = Math.random();
        let color = '168, 85, 247'; // Purple
        if (rand > 0.7) {
          color = '236, 72, 153'; // Pink
        } else if (rand > 0.4) {
          color = '99, 102, 241'; // Indigo/blue
        } else if (rand > 0.2) {
          color = '255, 255, 255'; // White/silver
        }

        swirlParticles.push({
          r,
          angle,
          speed,
          size,
          opacity,
          color
        });
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const tilt = -18 * Math.PI / 180;
    const cosTilt = Math.cos(tilt);
    const sinTilt = Math.sin(tilt);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background space background fill
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw background stars
      backgroundParticles.forEach(p => {
        ctx.fillStyle = `rgba(168, 85, 247, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.y += p.speedY;
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
      });

      // Draw swirling cosmic dust particles
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      swirlParticles.forEach(p => {
        p.angle += p.speed;
        
        // Calculate point on 2D horizontal ellipse
        const x = Math.cos(p.angle) * p.r;
        const y = Math.sin(p.angle) * p.r * 0.45; // flatten perspective
        
        // Rotate by -18 degrees to tilt the ellipse
        const rx = x * cosTilt - y * sinTilt + centerX;
        const ry = x * sinTilt + y * cosTilt + centerY;

        // Subtle twinkle factor
        const twinkle = Math.sin(p.angle * 3) * 0.15;
        const finalOpacity = Math.max(0.05, Math.min(1, p.opacity + twinkle));

        ctx.fillStyle = `rgba(${p.color}, ${finalOpacity})`;
        ctx.beginPath();
        ctx.arc(rx, ry, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 mix-blend-screen"
    />
  );
}

// Vector math wireframe 3D Cube Canvas component
function SkillsCubeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angleX = 0.01;
    let angleY = 0.015;

    // Define 3D wireframe cube vertices
    const vertices = [
      { x: -35, y: -35, z: -35 },
      { x: 35, y: -35, z: -35 },
      { x: 35, y: 35, z: -35 },
      { x: -35, y: 35, z: -35 },
      { x: -35, y: -35, z: 35 },
      { x: 35, y: -35, z: 35 },
      { x: 35, y: 35, z: 35 },
      { x: -35, y: 35, z: 35 }
    ];

    // Define edges connecting vertices
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // Back face
      [4, 5], [5, 6], [6, 7], [7, 4], // Front face
      [0, 4], [1, 5], [2, 6], [3, 7]  // Connectors
    ];

    const rotateX = (point: typeof vertices[0], angle: number) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const y = point.y * cos - point.z * sin;
      const z = point.y * sin + point.z * cos;
      return { ...point, y, z };
    };

    const rotateY = (point: typeof vertices[0], angle: number) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x = point.x * cos + point.z * sin;
      const z = -point.x * sin + point.z * cos;
      return { ...point, x, z };
    };

    const project = (point: typeof vertices[0], width: number, height: number) => {
      // Perspective calculation
      const depth = 200;
      const factor = depth / (depth + point.z);
      const x = point.x * factor + width / 2;
      const y = point.y * factor + height / 2;
      return { x, y };
    };

    // Tracking mouse movements for interactive cube rotation
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseRef.current = { x: x * 0.0002, y: y * 0.0002 };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update rotation angles dynamically incorporating mouse coords
      const rx = angleX + mouseRef.current.y;
      const ry = angleY + mouseRef.current.x;

      const projected = vertices.map(v => {
        let r = rotateX(v, rx);
        r = rotateY(r, ry);
        return project(r, canvas.width, canvas.height);
      });

      // Update angles
      angleX += 0.006;
      angleY += 0.008;

      // Draw wireframe faces (with semi-transparency)
      ctx.fillStyle = 'rgba(var(--color-primary-rgb),0.04)';
      ctx.beginPath();
      ctx.moveTo(projected[0].x, projected[0].y);
      ctx.lineTo(projected[1].x, projected[1].y);
      ctx.lineTo(projected[2].x, projected[2].y);
      ctx.lineTo(projected[3].x, projected[3].y);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(projected[4].x, projected[4].y);
      ctx.lineTo(projected[5].x, projected[5].y);
      ctx.lineTo(projected[6].x, projected[6].y);
      ctx.lineTo(projected[7].x, projected[7].y);
      ctx.closePath();
      ctx.fill();

      // Draw wireframe edges
      ctx.strokeStyle = 'rgba(var(--color-primary-rgb),0.28)';
      ctx.lineWidth = 1.2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'var(--color-primary)';
      
      edges.forEach(edge => {
        ctx.beginPath();
        ctx.moveTo(projected[edge[0]].x, projected[edge[0]].y);
        ctx.lineTo(projected[edge[1]].x, projected[edge[1]].y);
        ctx.stroke();
      });

      // Draw vertices nodes
      ctx.fillStyle = 'var(--color-primary)';
      projected.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.shadowBlur = 0; // reset shadow

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      width={192}
      height={192}
      className="w-full h-full"
    />
  );
}

// Swirling contact portal canvas widget
interface PortalProps {
  isHovered: boolean;
  setIsHovered: (val: boolean) => void;
}

function ContactPortalCanvas({ isHovered, setIsHovered }: PortalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { angle: number; radius: number; speed: number; size: number; opacity: number }[] = [];

    const initializeParticles = () => {
      particles = [];
      const count = 120;
      for (let i = 0; i < count; i++) {
        particles.push({
          angle: Math.random() * (Math.PI * 2),
          radius: Math.random() * 80 + 30, // distance from center portal bounds
          speed: Math.random() * 0.015 + 0.005,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.7 + 0.3
        });
      }
    };

    initializeParticles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw vortex circular base portal rings
      ctx.shadowBlur = isHovered ? 25 : 12;
      ctx.shadowColor = 'var(--color-primary)';
      ctx.strokeStyle = 'rgba(var(--color-primary-rgb),0.4)';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 95, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 105, 0, Math.PI * 2);
      ctx.stroke();

      // Swirling particles loop
      particles.forEach(p => {
        // Spiral particles inward or rotate them in orbit rings
        p.angle += isHovered ? p.speed * 2.2 : p.speed;
        
        // Calculate coords
        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius;

        // Draw particle node
        ctx.fillStyle = `rgba(168, 85, 247, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Oscillate radius slightly to simulate spiral depth
        p.radius -= isHovered ? 0.35 : 0.15;
        if (p.radius < 5) {
          p.radius = Math.random() * 80 + 30; // reset out to borders
          p.opacity = Math.random() * 0.7 + 0.3;
        }
      });

      ctx.shadowBlur = 0; // reset

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered]);

  return (
    <canvas 
      ref={canvasRef}
      width={300}
      height={300}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full h-full cursor-pointer"
    />
  );
}
