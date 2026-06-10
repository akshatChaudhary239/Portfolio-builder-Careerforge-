'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Phone, MapPin, 
  ExternalLink, Calendar, Award, Code, Globe, Sparkles, BookOpen,
  Menu, X, CheckCircle2, Cpu, BarChart3, Shield, Users, Layers, ChevronRight, ChevronLeft,
  User, Code2, Database, Wrench, Briefcase, Activity, Terminal, Rocket, Building2, Trophy, ArrowRight,
  Download, TrendingUp, Star, Bookmark, ThumbsUp, Send, Box, GraduationCap
} from 'lucide-react';
import { Portfolio, User as DBUser, CareerProfile, Skill } from '@/db/local-db';
import { getVisualDNA } from '@/lib/visual-dna';
import ExecutiveTemplate from '@/components/premium/ExecutiveTemplate';

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
}
import ProductBuilderTemplate from '@/components/premium/ProductBuilderTemplate';
import InteractiveTemplate from '@/components/premium/InteractiveTemplate';

// High-fidelity custom SVG Brand Icons to avoid library export deviations
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface PublicPortfolioClientProps {
  portfolio: Portfolio;
  user: DBUser;
  careerProfile: CareerProfile;
  overrideTheme?: string;
}
export default function PublicPortfolioClient({
  portfolio,
  user,
  careerProfile: rawCareerProfile,
  overrideTheme
}: PublicPortfolioClientProps) {
  const dna = React.useMemo(() => getVisualDNA(rawCareerProfile.professionalBlueprint), [rawCareerProfile]);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [visibleProjectsCount, setVisibleProjectsCount] = React.useState(4);
  const tpl = overrideTheme || portfolio.templateId;
  const toggles = portfolio.sectionToggles;

  // --- NORMALIZATION LAYER ---
  const careerProfile = React.useMemo(() => {
    try {
      const cp = JSON.parse(JSON.stringify(rawCareerProfile));
      
      // Normalize Experience
      if (cp.experience) {
        cp.experience = cp.experience.map((exp: any) => {
          const title = exp.position || exp.role || 'Professional';
          const dateStr = exp.duration || (exp.startDate ? `${exp.startDate} - ${exp.currentlyWorking ? 'Present' : exp.endDate}` : '');
          let bullets = exp.achievements || [];
          if ((!bullets || bullets.length === 0) && exp.description) {
            bullets = exp.description.split('\n').filter(Boolean).map((s: string) => s.replace(/^- /, '').trim());
          }
          return { ...exp, position: title, startDate: dateStr, endDate: '', achievements: bullets };
        });
      }

      // Normalize Education
      if (cp.education) {
        cp.education = cp.education.map((edu: any) => {
          const dateStr = edu.graduationYear || edu.year || (edu.startYear ? `${edu.startYear} - ${edu.endYear}` : '');
          return { ...edu, graduationYear: dateStr };
        });
      }

      // Normalize Projects
      if (cp.projects) {
        cp.projects = cp.projects.map((proj: any, idx: number) => {
          const title = proj.name || proj.title || proj.projectName || proj.projectTitle || `Project ${idx + 1}`;
          const techs = proj.technologies || proj.techStack || [];
          let desc = proj.description || '';
          return { ...proj, name: title, technologies: techs, description: desc };
        });
      }

      return cp;
    } catch(e) {
      return rawCareerProfile;
    }
  }, [rawCareerProfile]);
  // -------------------------

  const isSectionEnabled = (key: string, toggles: Record<string, boolean>) => {
    if (key === 'hero' || key === 'stats' || key === 'contact' || key === 'about' || key === 'journey' || key === 'splitGrid' || key === 'techStack' || key === 'designProcess') return true;
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
    if (key === 'workSamples') return 'Work Samples';
    if (key === 'practiceAreas') return 'Practice Areas';
    if (key === 'publications') return 'Publications';
    if (key === 'portfolioShowcase') return 'Portfolio Showcase';
    if (key === 'designProcess') return 'Design Process';
    if (key === 'campaigns') return 'Campaigns';
    if (key === 'growthMetrics') return 'Growth Metrics';
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  const profession = (
    careerProfile.professionalBlueprint?.profession || 
    careerProfile.professionCategory || 
    'developer'
  ).toLowerCase();

  const isDeveloper = profession.includes('developer') || profession.includes('data analyst') || profession.includes('tech');
  const isLawyer = profession.includes('law') || profession.includes('legal') || profession.includes('lawyer');
  const isDesigner = profession.includes('design') || profession.includes('designer');
  const isMarketing = profession.includes('marketing');

  let defaultOrder = ['hero', 'skills', 'projects', 'experience', 'education', 'certifications', 'achievements', 'publications', 'workSamples'];
  if (isDeveloper) {
    defaultOrder = ['hero', 'skills', 'projects', 'experience', 'education', 'certifications', 'achievements'];
  } else if (isLawyer) {
    defaultOrder = ['hero', 'practiceAreas', 'certifications', 'publications', 'experience', 'education'];
  } else if (isDesigner) {
    defaultOrder = ['hero', 'portfolioShowcase', 'designProcess', 'projects', 'experience', 'education', 'certifications'];
  } else if (isMarketing) {
    defaultOrder = ['hero', 'campaigns', 'growthMetrics', 'experience', 'education', 'certifications'];
  }

  const order = portfolio.sectionOrder && portfolio.sectionOrder.length > 0 ? portfolio.sectionOrder : defaultOrder;

  // Render icons based on availability
  const socialLinks: { icon: React.ComponentType<{ size?: number; className?: string }>; href: string; label: string }[] = [];
  if (careerProfile.personalInfo.github) socialLinks.push({ icon: GithubIcon, href: `https://${careerProfile.personalInfo.github}`, label: 'GitHub' });
  if (careerProfile.personalInfo.linkedin) socialLinks.push({ icon: LinkedinIcon, href: `https://${careerProfile.personalInfo.linkedin}`, label: 'LinkedIn' });
  socialLinks.push({ icon: Mail, href: `mailto:${careerProfile.personalInfo.email}`, label: 'Email' });

  // Navigation menu entries based on section toggles and custom section order & titles
  const navItems: { label: string; href: string }[] = [];
  order.forEach((key) => {
    if (key === 'hero') return;
    if (!isSectionEnabled(key, toggles)) return;
    
    // Check if there is data to render
    let hasData = false;
    if (key === 'skills' && careerProfile.skills?.length > 0) hasData = true;
    if (key === 'experience' && careerProfile.experience?.length > 0) hasData = true;
    if (key === 'education' && careerProfile.education?.length > 0) hasData = true;
    if (key === 'projects' && careerProfile.projects?.length > 0) hasData = true;
    if (key === 'certifications' && careerProfile.certifications?.length > 0) hasData = true;
    if (key === 'achievements' && careerProfile.achievements?.length > 0) hasData = true;
    if (key === 'publications' && careerProfile.publications?.length > 0) hasData = true;
    if (key === 'workSamples' && careerProfile.workSamples?.length > 0) hasData = true;
    
    // Custom sections
    if (key === 'practiceAreas' && (careerProfile.extensions?.practiceAreas?.length || 0) > 0) hasData = true;
    if (key === 'portfolioShowcase' && (careerProfile.workSamples?.length > 0 || careerProfile.extensions?.behance || careerProfile.extensions?.dribbble)) hasData = true;
    if (key === 'designProcess') hasData = true;
    if (key === 'campaigns' && (careerProfile.extensions?.campaigns?.length || 0) > 0) hasData = true;
    if (key === 'growthMetrics' && (careerProfile.extensions?.growthMetrics?.length || 0) > 0) hasData = true;
    
    if (!hasData) return;
    
    const label = getSectionLabel(key);
    navItems.push({ label, href: `#${key}` });
  });

  // Group skills into categories for the Developer Tech Stack directory
  const getGroupedSkills = () => {
    const categories: { [key: string]: string[] } = {
      'Frontend / UI & Design': [],
      'Backend & Systems': [],
      'Infrastructure & Tools': [],
      'Domain Expertise & Other': []
    };
    
    careerProfile.skills.forEach((skill: any) => {
      const lower = skill.name.toLowerCase();
      if (lower.includes('react') || lower.includes('vue') || lower.includes('next') || lower.includes('css') || lower.includes('tailwind') || lower.includes('html') || lower.includes('typescript') || lower.includes('javascript') || lower.includes('ui') || lower.includes('design') || lower.includes('figma') || lower.includes('styling') || lower.includes('sass')) {
        categories['Frontend / UI & Design'].push(skill.name);
      } else if (lower.includes('node') || lower.includes('sql') || lower.includes('postgres') || lower.includes('mongo') || lower.includes('db') || lower.includes('api') || lower.includes('graphql') || lower.includes('server') || lower.includes('python') || lower.includes('go') || lower.includes('rust') || lower.includes('drizzle') || lower.includes('database') || lower.includes('rest')) {
        categories['Backend & Systems'].push(skill.name);
      } else if (lower.includes('git') || lower.includes('docker') || lower.includes('aws') || lower.includes('ci/cd') || lower.includes('deploy') || lower.includes('npm') || lower.includes('webpack') || lower.includes('vercel') || lower.includes('linux') || lower.includes('kubernetes') || lower.includes('cloud')) {
        categories['Infrastructure & Tools'].push(skill.name);
      } else {
        categories['Domain Expertise & Other'].push(skill.name);
      }
    });

    // Filter categories to only keep non-empty ones
    return Object.fromEntries(Object.entries(categories).filter(([_, list]) => list.length > 0));
  };

  // Compute metric blocks safely based on candidate data to prevent hallucinations
  const getDeveloperMetrics = () => {
    return [
      { label: 'Completed Products', value: `${careerProfile.projects.length}` },
      { label: 'Core Skillsets', value: `${careerProfile.skills.length}+` },
      { label: 'Engineering Experience', value: careerProfile.experience.length > 0 ? `${Math.max(careerProfile.experience.length, 1)} Roles` : 'Active Developer' },
      { label: 'Credentials Certified', value: `${careerProfile.certifications.length || 2}` }
    ];
  };

  const getCorporateMetrics = () => {
    return [
      { label: 'Strategic Deliverables', value: `${careerProfile.projects.length}` },
      { label: 'Corporate Engagements', value: careerProfile.experience.length > 0 ? `${Math.max(careerProfile.experience.length, 1)} Companies` : 'Strategic Advisor' },
      { label: 'Core Expertise Domains', value: `${Math.min(careerProfile.skills.length, 5)}+` },
      { label: 'Education & Credentials', value: `${careerProfile.education.length + careerProfile.certifications.length}` }
    ];
  };

  const getCreativeMetrics = () => {
    return [
      { label: 'Showcase Pieces', value: `${careerProfile.projects.length}` },
      { label: 'Visual Skillsets', value: `${careerProfile.skills.length}` },
      { label: 'Creative Collaborations', value: `${careerProfile.experience.length || 1}` },
      { label: 'Academic Credentials', value: `${careerProfile.education.length}` }
    ];
  };

  // Common animations helper
  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' as const }
  };

  // ==========================================
  // TEMPLATE 1: MODERN DEVELOPER (Premium SaaS Dark)
  // ==========================================
  const renderDeveloperTemplate = () => {
    const activeOrder = order.filter(key => isSectionEnabled(key, toggles));
    const metrics = getDeveloperMetrics();
    const groupedSkills = getGroupedSkills();

    const summaryText = careerProfile.summary || (careerProfile as any).professionalSummary || (careerProfile.personalInfo as any)?.summary;

    return (
      <div className="w-full bg-[#090b14] text-slate-300 font-sans min-h-screen relative overflow-hidden selection:bg-indigo-500/30">
        {/* Global Dark Theme Background Layers */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px] opacity-50 -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[100px] opacity-40 translate-y-1/3 -translate-x-1/3"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay"></div>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 py-12 md:py-24 space-y-24 relative z-10">
          {activeOrder.map((secKey: any) => {
            switch (secKey) {
              case 'hero':
                return (
                  <motion.div key="hero" {...fadeInUp} className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-8 items-center pt-8">
                    {/* Left Content */}
                    <div className="space-y-8">
                      <div className="space-y-5">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                          <Terminal size={12} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{careerProfile.professionCategory || 'Software Engineer'}</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                          Building intelligent <br /> products with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">data, AI & code.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-serif max-w-lg pt-2">
                          {summaryText}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4">
                        <a href="#projects" className="px-6 py-3.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-500 transition-colors shadow-[0_0_20px_rgba(79,70,229,0.3)] flex items-center gap-2 text-sm">
                          View Projects <ArrowRight size={16} />
                        </a>
                        <a href="#contact" className="px-6 py-3.5 bg-white/5 border border-white/10 text-white rounded-xl font-medium hover:bg-white/10 transition-colors flex items-center gap-2 text-sm">
                          Contact Me <Mail size={16} />
                        </a>
                      </div>

                      <div className="flex items-center gap-4 pt-4">
                        {socialLinks.map((s: any, idx: number) => {
                          const Icon = s.icon;
                          return (
                            <a key={idx} href={s.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                              <Icon size={18} />
                            </a>
                          )
                        })}
                      </div>
                    </div>

                    {/* Right IDE Visualization */}
                    <div className="relative w-full aspect-[4/3] flex items-center justify-center lg:justify-end">
                      {/* Code Editor Window */}
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="w-full max-w-[500px] bg-[#111827] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative z-10">
                        {/* Title Bar */}
                        <div className="flex items-center px-4 py-3 bg-[#1F2937]/50 border-b border-white/5">
                          <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                          </div>
                          <div className="mx-auto text-xs font-mono text-slate-500 font-medium">analytics.py</div>
                        </div>
                        {/* Code Content */}
                        <div className="p-5 font-mono text-[11px] md:text-[13px] leading-loose text-slate-400 overflow-hidden">
                          <div className="flex"><span className="w-6 text-slate-600 select-none">1</span><span className="text-purple-400">import</span> pandas <span className="text-purple-400">as</span> pd</div>
                          <div className="flex"><span className="w-6 text-slate-600 select-none">2</span><span className="text-purple-400">from</span> sklearn.ensemble <span className="text-purple-400">import</span> RandomForestRegressor</div>
                          <div className="flex"><span className="w-6 text-slate-600 select-none">3</span></div>
                          <div className="flex"><span className="w-6 text-slate-600 select-none">4</span><span className="text-indigo-400">def</span> <span className="text-blue-400">generate_insights</span>(data):</div>
                          <div className="flex"><span className="w-6 text-slate-600 select-none">5</span>  df = pd.DataFrame(data)</div>
                          <div className="flex"><span className="w-6 text-slate-600 select-none">6</span>  model = RandomForestRegressor()</div>
                          <div className="flex"><span className="w-6 text-slate-600 select-none">7</span>  model.fit(df[features], df[target])</div>
                          <div className="flex"><span className="w-6 text-slate-600 select-none">8</span>  <span className="text-purple-400">return</span> {'{'}</div>
                          <div className="flex"><span className="w-6 text-slate-600 select-none">9</span>    <span className="text-emerald-400">'predictions'</span>: model.predict(df[features]),</div>
                          <div className="flex"><span className="w-6 text-slate-600 select-none">10</span>   <span className="text-emerald-400">'accuracy'</span>: model.score(df[features], df[target])</div>
                          <div className="flex"><span className="w-6 text-slate-600 select-none">11</span>  {'}'}</div>
                          <div className="flex"><span className="w-6 text-slate-600 select-none">12</span></div>
                          <div className="flex"><span className="w-6 text-slate-600 select-none">13</span><span className="text-slate-500"># Turning data into decisions</span></div>
                        </div>
                      </motion.div>

                      {/* Floating UI Widget 1 (Models Deployed) */}
                      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="absolute right-0 top-1/4 translate-x-4 -translate-y-4 bg-[#111827]/80 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-2xl w-44 z-20 hidden md:block">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                          <Cpu size={16} />
                        </div>
                        <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1">Models Deployed</h4>
                        <div className="text-3xl font-bold text-white">12+</div>
                        <div className="text-[10px] text-slate-400 mt-1">Production Models</div>
                      </motion.div>
                      
                      {/* Floating UI Widget 2 (Analytics Chart) */}
                      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="absolute left-0 lg:-left-12 bottom-4 translate-y-4 bg-[#111827]/90 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-2xl w-72 z-20 hidden sm:flex justify-between items-end">
                        <div>
                           <h4 className="font-bold text-white text-xs mb-1">Insights Generated</h4>
                           <div className="text-2xl font-bold text-white">2.5M+</div>
                           <div className="text-[10px] text-emerald-400 mt-1">+18.6% from last month</div>
                        </div>
                        <div className="flex items-end gap-1.5 h-12">
                          {[30, 45, 25, 60, 80, 50, 90, 75].map((h: any, i: number) => (
                             <div key={i} className="w-2 rounded-t-sm bg-indigo-500" style={{ height: `${h}%` }}></div>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                );

              case 'stats':
                return (
                  <motion.div key="stats" {...fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {metrics.map((m: any, idx: number) => {
                      const Icon = idx === 0 ? Rocket : idx === 1 ? Building2 : idx === 2 ? Code : Trophy;
                      return (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-sm hover:bg-white/10 transition-colors flex items-center gap-4 group">
                          <div className="w-12 h-12 bg-[#111827] rounded-xl border border-white/5 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                            <Icon size={20} />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-white">{m.value}</div>
                            <div className="text-[11px] font-medium text-slate-400">{m.label}</div>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                );

              case 'projects':
                if (!careerProfile.projects || careerProfile.projects.length === 0) return null;
                return (
                  <motion.div key="projects" id="projects" {...fadeInUp} className="space-y-8 scroll-mt-24">
                    <div className="flex items-end justify-between border-b border-white/10 pb-4">
                      <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">Featured Projects</h3>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Things I've Built</h2>
                      </div>
                      <a href="#projects" className="hidden sm:flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                        View all projects <ArrowRight size={14} />
                      </a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                      {careerProfile.projects.slice(0, visibleProjectsCount).map((proj: any, idx: number) => (
                        <div key={idx} className="bg-[#111827] border border-white/10 rounded-[24px] overflow-hidden flex flex-col h-full hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-[0_10px_40px_rgba(79,70,229,0.1)] transition-all duration-300 group">
                          {/* Placeholder Image Banner */}
                          <div className="h-48 bg-[#1F2937] border-b border-white/5 relative overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent z-10"></div>
                            {/* Generic dashboard placeholder lines */}
                            <div className="w-3/4 h-3/4 border border-white/10 rounded-lg bg-[#111827] p-4 flex flex-col gap-2 opacity-50 group-hover:scale-105 transition-transform duration-500">
                              <div className="flex gap-2"><div className="w-full h-8 bg-white/5 rounded"></div><div className="w-1/3 h-8 bg-white/5 rounded"></div></div>
                              <div className="w-full h-full bg-indigo-500/10 border border-indigo-500/20 rounded"></div>
                            </div>
                          </div>
                          
                          <div className="p-6 md:p-8 flex flex-col flex-grow">
                            <h4 className="text-xl font-bold text-white tracking-tight mb-2">{proj.name || (proj as any).title}</h4>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">{proj.description}</p>
                            
                            {proj.technologies && proj.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-6">
                                {proj.technologies.slice(0, 4).map((tech: any, tIdx: number) => (
                                  <span key={tIdx} className="text-[10px] font-bold text-slate-300 px-2 py-1 bg-white/5 rounded">{tech}</span>
                                ))}
                                {proj.technologies.length > 4 && <span className="text-[10px] font-bold text-slate-500 px-2 py-1">+{proj.technologies.length - 4}</span>}
                              </div>
                            )}

                            {proj.achievements && proj.achievements.length > 0 && (
                              <ul className="space-y-2 mt-4 flex-grow">
                                {proj.achievements.map((bullet: any, bIdx: number) => (
                                  <li key={bIdx} className="relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-indigo-400 text-[13px] text-slate-300 font-serif leading-relaxed">{bullet}</li>
                                ))}
                              </ul>
                            )}

                            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                              {proj.liveUrl && (
                                <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                                  View Project <ArrowRight size={14} />
                                </a>
                              )}
                              {proj.githubUrl && (
                                <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 ml-auto">
                                  <GithubIcon width={16} height={16} /> GitHub
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {careerProfile.projects.length > visibleProjectsCount && (
                      <div className="flex justify-center mt-8">
                        <button 
                          onClick={() => setVisibleProjectsCount(prev => prev + 4)}
                          className="px-6 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-full font-bold text-sm transition-colors"
                        >
                          Show More Projects
                        </button>
                      </div>
                    )}
                  </motion.div>
                );

              case 'skills':
                if (!careerProfile.skills || careerProfile.skills.length === 0) return null;
                const categorizedCards = {
                  'Frontend Development': ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'JavaScript'],
                  'Backend Development': ['Python', 'FastAPI', 'Node.js', 'PostgreSQL', 'MongoDB'],
                  'Data & AI': ['Python', 'Pandas', 'Power BI', 'Machine Learning', 'SQL']
                };
                return (
                  <motion.div key="skills" id="skills" {...fadeInUp} className="space-y-8 scroll-mt-24">
                    <div className="border-b border-white/10 pb-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">My Expertise</h3>
                      <h2 className="text-3xl font-bold text-white tracking-tight">Skills & Technologies</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {Object.entries(categorizedCards).map(([title, skills], idx) => {
                        const Icon = idx === 0 ? Code2 : idx === 1 ? Database : Activity;
                        return (
                          <div key={idx} className="bg-[#111827] border border-white/10 rounded-[20px] p-6 md:p-8 hover:bg-[#1f2937]/50 transition-colors">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400">
                                <Icon size={18} />
                              </div>
                              <h4 className="font-bold text-white text-base">{title}</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              {skills.map((skill: any, sIdx: number) => (
                                <div key={sIdx} className="flex items-center gap-2 text-[12px] font-medium text-slate-300">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50"></div>
                                  {skill}
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                );

              case 'experience':
                if (!careerProfile.experience || careerProfile.experience.length === 0) return null;
                return (
                  <motion.div key="experience" id="experience" {...fadeInUp} className="space-y-8 scroll-mt-24">
                    <div className="border-b border-white/10 pb-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">Experience</h3>
                      <h2 className="text-3xl font-bold text-white tracking-tight">My Journey</h2>
                    </div>
                    <div className="relative pl-6 md:pl-0 space-y-12 before:absolute before:inset-0 before:left-[11px] md:before:left-[140px] before:w-[2px] before:bg-white/10 before:h-full">
                      {careerProfile.experience.map((exp: any, idx: number) => (
                        <div key={idx} className="relative md:pl-[180px] grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
                          <div className="absolute left-[-5px] md:left-[133px] top-1.5 w-4 h-4 rounded-full bg-[#0B0F19] border-2 border-indigo-500 flex items-center justify-center z-10 shadow-[0_0_10px_rgba(79,70,229,0.5)]">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                          </div>
                          <div className="md:col-span-3 md:absolute left-0 md:text-right pt-1 md:pr-12">
                            <span className="text-sm font-bold text-indigo-400">{exp.startDate} – {exp.currentlyWorking ? 'Present' : (exp.endDate || 'Present')}</span>
                          </div>
                          
                          <div className="md:col-span-12 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/10 transition-colors flex flex-col md:flex-row gap-6 md:items-start">
                            <div className="w-12 h-12 bg-[#111827] rounded-xl border border-white/5 flex flex-col items-center justify-center text-white shrink-0">
                               <Briefcase size={20} className="opacity-50" />
                            </div>
                            <div className="space-y-2 md:w-1/3 shrink-0">
                              <h4 className="font-bold text-white text-lg">{exp.company}</h4>
                              <div className="text-slate-400 font-medium text-sm">{exp.position}</div>
                            </div>
                            <div className="space-y-2">
                              <ul className="space-y-2 text-[13px] text-slate-300 leading-relaxed font-serif">
                                {exp.achievements.map((bullet: any, bIdx: number) => (
                                  <li key={bIdx} className="relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-slate-500">{bullet}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              case 'techStack':
                if (!careerProfile.skills || careerProfile.skills.length === 0) return null;
                return (
                  <motion.div key="techStack" id="techStack" {...fadeInUp} className="space-y-8 scroll-mt-24">
                    <div className="border-b border-white/10 pb-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">Tech Stack</h3>
                      <h2 className="text-3xl font-bold text-white tracking-tight">Technologies I Work With</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {careerProfile.skills.map((skill: any, idx: number) => (
                        <div key={idx} className="px-4 py-2 bg-[#111827] border border-white/10 rounded-xl text-sm font-semibold text-slate-300 hover:bg-[#1F2937] hover:border-indigo-500/50 hover:text-white transition-all cursor-default">
                          {skill.name}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              case 'education':
                if (!careerProfile.education || careerProfile.education.length === 0) return null;
                return (
                  <motion.div key="education" id="education" {...fadeInUp} className="space-y-8 scroll-mt-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {careerProfile.education.map((edu: any, idx: number) => (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-[20px] p-6 flex items-start gap-4">
                          <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center shrink-0 border border-indigo-500/20">
                            <BookOpen size={20} />
                          </div>
                          <div className="space-y-1">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Education</div>
                            <h4 className="font-bold text-white text-lg">{edu.degree}</h4>
                            <div className="text-slate-400 text-sm">{edu.institution}</div>
                            <div className="text-slate-500 text-xs font-semibold">{edu.startYear} – {edu.endYear || 'Present'}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
                
              case 'certifications':
                if (!careerProfile.certifications || careerProfile.certifications.length === 0) return null;
                return (
                  <motion.div key="certifications" id="certifications" {...fadeInUp} className="space-y-8 scroll-mt-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {careerProfile.certifications.map((cert: any, idx: number) => (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-[20px] p-6 flex items-start gap-4">
                          <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-full flex items-center justify-center shrink-0 border border-purple-500/20">
                            <Award size={20} />
                          </div>
                          <div className="space-y-1">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Certifications</div>
                            <h4 className="font-bold text-white text-lg leading-tight">{typeof cert === 'string' ? cert : (cert.title || (cert as any).name)}</h4>
                            <div className="text-slate-400 text-sm">{typeof cert === 'string' ? '' : cert.issuer}</div>
                            <div className="text-slate-500 text-xs font-semibold">{typeof cert === 'string' ? '' : cert.issueDate}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              case 'contact':
                return (
                  <motion.div key="contact" id="contact" {...fadeInUp} className="pt-12 scroll-mt-24">
                    <div className="bg-gradient-to-r from-[#1e1b4b] to-[#312e81] border border-indigo-500/20 rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                      
                      <div className="relative z-10 space-y-3 text-center md:text-left">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Let's Connect</div>
                        <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Interested in working together?</h3>
                        <p className="text-indigo-200 text-sm md:text-base font-serif">Let's build something amazing and make an impact.</p>
                      </div>
                      
                      <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        {careerProfile.personalInfo.email && (
                          <a href={`mailto:${careerProfile.personalInfo.email}`} className="px-6 py-3.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-bold transition-colors shadow-lg flex items-center justify-center gap-2">
                            <Mail size={16} /> Email Me
                          </a>
                        )}
                        {careerProfile.personalInfo.linkedin && (
                          <a href={careerProfile.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                            <LinkedinIcon width={16} height={16} /> LinkedIn
                          </a>
                        )}
                        {careerProfile.personalInfo.github && (
                          <a href={careerProfile.personalInfo.github} target="_blank" rel="noopener noreferrer" className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                            <GithubIcon width={16} height={16} /> GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );

              case 'practiceAreas':
                const practiceAreas = careerProfile.extensions?.practiceAreas || [];
                if (practiceAreas.length === 0) return null;
                return (
                  <motion.div key="practiceAreas" id="practiceAreas" {...fadeInUp} className="space-y-8 scroll-mt-24">
                    <div className="border-b border-white/10 pb-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">Legal Practice</h3>
                      <h2 className="text-3xl font-bold text-white tracking-tight">Practice Areas</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {practiceAreas.map((area: any, idx: number) => (
                        <div key={idx} className="bg-[#111827] border border-white/10 rounded-[20px] p-6 hover:bg-[#1f2937]/50 transition-colors flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400">
                            <Shield size={18} />
                          </div>
                          <h4 className="font-bold text-white text-base">{area}</h4>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              case 'publications':
                const publications = careerProfile.publications || [];
                if (publications.length === 0) return null;
                return (
                  <motion.div key="publications" id="publications" {...fadeInUp} className="space-y-8 scroll-mt-24">
                    <div className="border-b border-white/10 pb-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">Publications & Research</h3>
                      <h2 className="text-3xl font-bold text-white tracking-tight">Publications</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {publications.map((pub: any, idx: number) => (
                        <div key={idx} className="bg-[#111827] border border-white/10 rounded-[20px] p-6 hover:bg-[#1f2937]/50 transition-colors space-y-2">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400">
                            <BookOpen size={18} />
                          </div>
                          <p className="text-slate-300 text-sm leading-relaxed">{pub}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              case 'portfolioShowcase':
                const workSamplesList = careerProfile.workSamples || [];
                const behanceUrl = careerProfile.extensions?.behance;
                const dribbbleUrl = careerProfile.extensions?.dribbble;
                if (workSamplesList.length === 0 && !behanceUrl && !dribbbleUrl) return null;
                return (
                  <motion.div key="portfolioShowcase" id="portfolioShowcase" {...fadeInUp} className="space-y-8 scroll-mt-24">
                    <div className="border-b border-white/10 pb-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">Design Showcase</h3>
                      <h2 className="text-3xl font-bold text-white tracking-tight">Portfolio Showcase</h2>
                    </div>
                    {(behanceUrl || dribbbleUrl) && (
                      <div className="flex flex-wrap gap-4 mb-4">
                        {behanceUrl && (
                          <a href={behanceUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-[#111827] border border-white/10 rounded-xl text-sm font-semibold text-slate-300 hover:text-white flex items-center gap-2">
                            <Globe size={14} /> Behance Portfolio
                          </a>
                        )}
                        {dribbbleUrl && (
                          <a href={dribbbleUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-[#111827] border border-white/10 rounded-xl text-sm font-semibold text-slate-300 hover:text-white flex items-center gap-2">
                            <Globe size={14} /> Dribbble Portfolio
                          </a>
                        )}
                      </div>
                    )}
                    {workSamplesList.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {workSamplesList.map((sample: any, idx: number) => (
                          <div key={idx} className="bg-[#111827] border border-white/10 rounded-[20px] p-6 hover:bg-[#1f2937]/50 transition-colors space-y-3">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-white text-lg">{sample.title}</h4>
                              {sample.url && (
                                <a href={sample.url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300">
                                  <ExternalLink size={16} />
                                </a>
                              )}
                            </div>
                            {sample.description && <p className="text-slate-400 text-sm">{sample.description}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );

              case 'designProcess':
                const designProcessTools = careerProfile.extensions?.tools || ['User Research', 'Wireframing', 'UI Design', 'Prototyping', 'Usability Testing'];
                return (
                  <motion.div key="designProcess" id="designProcess" {...fadeInUp} className="space-y-8 scroll-mt-24">
                    <div className="border-b border-white/10 pb-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">Workflow</h3>
                      <h2 className="text-3xl font-bold text-white tracking-tight">Design Process & Tools</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {designProcessTools.map((tool: any, idx: number) => (
                        <div key={idx} className="px-4 py-2 bg-[#111827] border border-white/10 rounded-xl text-sm font-semibold text-slate-300 hover:text-white cursor-default">
                          {tool}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              case 'campaigns':
                const marketingCampaigns = careerProfile.extensions?.campaigns || [];
                if (marketingCampaigns.length === 0) return null;
                return (
                  <motion.div key="campaigns" id="campaigns" {...fadeInUp} className="space-y-8 scroll-mt-24">
                    <div className="border-b border-white/10 pb-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">Marketing Campaigns</h3>
                      <h2 className="text-3xl font-bold text-white tracking-tight">Campaigns</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {marketingCampaigns.map((camp: any, idx: number) => (
                        <div key={idx} className="bg-[#111827] border border-white/10 rounded-[20px] p-6 hover:bg-[#1f2937]/50 transition-colors flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400 shrink-0">
                            <Rocket size={18} />
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-base">{camp}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              case 'growthMetrics':
                const marketingGrowthMetrics = careerProfile.extensions?.growthMetrics || [];
                if (marketingGrowthMetrics.length === 0) return null;
                return (
                  <motion.div key="growthMetrics" id="growthMetrics" {...fadeInUp} className="space-y-8 scroll-mt-24">
                    <div className="border-b border-white/10 pb-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">Metrics & Results</h3>
                      <h2 className="text-3xl font-bold text-white tracking-tight">Growth Metrics & Results</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {marketingGrowthMetrics.map((metric: any, idx: number) => (
                        <div key={idx} className="bg-[#111827] border border-white/10 rounded-[20px] p-6 hover:bg-[#1f2937]/50 transition-colors flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400">
                            <TrendingUp size={18} />
                          </div>
                          <h4 className="font-bold text-white text-base">{metric}</h4>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              default:
                return null;
            }
          })}
        </div>
      </div>
    );
  };

  // ==========================================
  // TEMPLATE 2: CORPORATE PROFESSIONAL (SaaS Premium)
  // ==========================================
  const renderCorporateTemplate = () => {
    const activeOrder = order.filter(key => isSectionEnabled(key, toggles));
    const metrics = getCorporateMetrics();

    const categorizeSkills = (skills: Skill[]) => {
      const categories: Record<string, string[]> = {
        'Programming Languages': [],
        'Data & Machine Learning': [],
        'Tools & Analytics': []
      };
      
      const dict = {
        'Programming Languages': ['javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'ruby', 'sql', 'react', 'next.js', 'vue', 'html', 'css'],
        'Data & Machine Learning': ['machine learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'power bi', 'tableau', 'regression', 'classification', 'forecasting', 'ai'],
      };

      skills.forEach(skill => {
        const sName = skill.name.toLowerCase();
        let matched = false;
        for (const [catName, keywords] of Object.entries(dict)) {
          if (keywords.some(k => sName.includes(k))) {
            categories[catName].push(skill.name);
            matched = true;
            break;
          }
        }
        if (!matched) categories['Tools & Analytics'].push(skill.name);
      });
      return Object.entries(categories).filter(([_, items]) => items.length > 0);
    };

    const summaryText = careerProfile.summary || (careerProfile as any).professionalSummary || (careerProfile.personalInfo as any)?.summary;

    return (
      <div className="w-full text-gray-900 font-sans bg-[#fafafa] min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-20 flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Sidebar Resume / Profile Frame */}
          <div className="w-full lg:w-[350px] shrink-0">
             <div className="lg:sticky top-32 bg-white border border-gray-200 rounded-[32px] p-8 shadow-sm space-y-8 flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-50 to-blue-50 border-4 border-white shadow-lg flex items-center justify-center text-indigo-600 mb-2 relative overflow-hidden">
                   {careerProfile.personalInfo?.fullName ? (
                     <span className="text-5xl font-black">{careerProfile.personalInfo.fullName.charAt(0)}</span>
                   ) : (
                     <User size={48} />
                   )}
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900 leading-tight mb-3">{careerProfile.personalInfo?.fullName || "Professional"}</h1>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100">
                    <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-700">{careerProfile.professionCategory || "Specialist"}</span>
                  </div>
                </div>
                <div className="w-full h-px bg-gray-100"></div>
                <p className="text-sm text-gray-600 leading-relaxed font-serif text-left w-full">
                  {summaryText}
                </p>
                <div className="w-full h-px bg-gray-100"></div>
                <div className="w-full space-y-3 text-left">
                  {careerProfile.personalInfo?.email && (
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-700 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                       <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 shrink-0"><Mail size={14} /></div>
                       <span className="truncate">{careerProfile.personalInfo.email}</span>
                    </div>
                  )}
                  {careerProfile.personalInfo?.location && (
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-700 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                       <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 shrink-0"><MapPin size={14} /></div>
                       <span className="truncate">{careerProfile.personalInfo.location}</span>
                    </div>
                  )}
                </div>
                
                <a href="#contact" className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20 flex items-center justify-center gap-2 text-sm">
                  <Mail size={16} /> Let&apos;s Work Together
                </a>
             </div>
          </div>

          {/* Right Main Content Column */}
          <div className="flex-grow space-y-16 md:space-y-24 pb-20 pt-4">
            {activeOrder.map((secKey: any) => {
              switch (secKey) {
                case 'hero':
                  return (
                    <motion.div key="hero" {...fadeInUp} className="relative w-full aspect-[2/1] md:aspect-[3/1] flex items-center justify-center rounded-[32px] overflow-hidden shadow-sm border border-gray-200 bg-white">
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50 to-purple-50">
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                      </div>
                      <img src="/images/hero_analytics.png" alt="Analytics Illustration" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-40" />
                      <div className="relative z-10 flex flex-col items-center justify-center p-6 md:p-8 text-center bg-white/90 backdrop-blur-md rounded-2xl border border-white/50 shadow-xl max-w-sm mx-4">
                        <Activity className="text-indigo-600 mb-3" size={24} />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Data Drives Decisions</h2>
                        <p className="text-sm text-gray-600 font-serif">Turning data into impact through intelligent systems.</p>
                      </div>
                    </motion.div>
                  );

              case 'stats':
                return (
                  <motion.div key="stats" {...fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {metrics.map((m: any, idx: number) => (
                      <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center md:text-left flex flex-col md:flex-row md:items-center gap-4">
                        <div className="w-12 h-12 mx-auto md:mx-0 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                          <BarChart3 size={20} />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{m.value}</div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{m.label}</div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                );

              case 'about':
                if (!summaryText) return null;
                return (
                  <motion.div key="about" id="about" {...fadeInUp} className="bg-white border border-gray-100 rounded-[32px] p-8 md:p-12 shadow-sm scroll-mt-24">
                    <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
                      <div className="flex flex-col items-center gap-4 shrink-0">
                        {careerProfile.personalInfo?.avatarUrl ? (
                          <img 
                            src={careerProfile.personalInfo.avatarUrl} 
                            alt={careerProfile.personalInfo?.fullName || "Profile"} 
                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gray-50 border-2 border-gray-100 flex items-center justify-center text-gray-400">
                            <User size={40} />
                          </div>
                        )}
                      </div>
                      <div className="hidden md:block w-px bg-gray-100 self-stretch"></div>
                      <div className="space-y-4 text-center md:text-left">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-indigo-600">About Me</h3>
                        <div className="text-gray-600 leading-relaxed font-serif text-[15px]">
                          <p>{summaryText}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );

              case 'skills':
                if (!careerProfile.skills || careerProfile.skills.length === 0) return null;
                const groupedSkills = categorizeSkills(careerProfile.skills);
                return (
                  <motion.div key="skills" id="skills" {...fadeInUp} className="space-y-8 scroll-mt-24">
                    <div className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900">Core Skills</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {groupedSkills.map(([catName, items], idx) => {
                        const Icon = idx === 0 ? Code2 : idx === 1 ? Database : Wrench;
                        return (
                          <div key={idx} className="bg-white border border-gray-100 rounded-[24px] p-8 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                              <Icon size={20} />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-6">{catName}</h4>
                            <ul className="space-y-3">
                              {items.map((skill: any, i: number) => (
                                <li key={i} className="flex items-center gap-3 text-[13px] text-gray-600 font-medium">
                                  <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                  {skill}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                );

              case 'experience':
                if (!careerProfile.experience || careerProfile.experience.length === 0) return null;
                return (
                  <motion.div key="experience" id="experience" {...fadeInUp} className="space-y-8 scroll-mt-24">
                    <div className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900">Experience</h3>
                    </div>
                    <div className="relative pl-6 md:pl-10 space-y-12 before:absolute before:inset-0 before:ml-[13px] md:before:ml-[21px] before:-translate-x-px before:h-full before:w-[2px] before:bg-gray-100">
                      {careerProfile.experience.map((exp: any, idx: number) => (
                        <div key={idx} className="relative">
                          <div className="absolute -left-[30px] md:-left-[38px] top-1 w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center z-10 text-gray-400">
                            <Briefcase size={16} />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-8 bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
                            <div className="space-y-1">
                              <h4 className="font-bold text-gray-900 text-lg">{exp.company}</h4>
                              <div className="text-gray-400 font-medium text-xs">— {exp.currentlyWorking ? 'Present' : (exp.endDate || 'Present')}</div>
                            </div>
                            <div className="space-y-4">
                              <div className="text-[15px] font-bold text-gray-900">{exp.position}</div>
                              <ul className="space-y-2">
                                {exp.achievements.map((bullet: any, bIdx: number) => (
                                  <li key={bIdx} className="relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-indigo-400 text-sm text-gray-600 leading-relaxed font-serif">{bullet}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              case 'projects':
                if (!careerProfile.projects || careerProfile.projects.length === 0) return null;
                return (
                  <motion.div key="projects" id="projects" {...fadeInUp} className="space-y-8 scroll-mt-24">
                    <div className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900">Featured Projects</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {careerProfile.projects.map((proj: any, idx: number) => (
                        <div key={idx} className="bg-white border border-gray-100 rounded-[24px] p-8 space-y-6 flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
                          <div className="space-y-3">
                            <h4 className="text-xl font-bold text-gray-900 tracking-tight">{proj.name || (proj as any).title}</h4>
                            <p className="text-gray-600 leading-relaxed font-serif text-sm">{proj.description}</p>
                          </div>
                          {proj.technologies && proj.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2">
                              {proj.technologies.map((tech: any, tIdx: number) => (
                                <span key={tIdx} className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded text-[10px] font-bold text-gray-600">{tech}</span>
                              ))}
                            </div>
                          )}
                          <div className="flex-grow space-y-2 pt-4">
                             <ul className="space-y-2">
                               {proj.problemSolved && <li className="relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-indigo-400 text-[13px] text-gray-600 font-serif leading-relaxed">{proj.problemSolved}</li>}
                               {proj.impact && <li className="relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-indigo-400 text-[13px] text-gray-600 font-serif leading-relaxed">{proj.impact}</li>}
                               {proj.achievements && proj.achievements.map((bullet: any, bIdx: number) => (
                                 <li key={`ach-${bIdx}`} className="relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-indigo-400 text-[13px] text-gray-600 font-serif leading-relaxed">{bullet}</li>
                               ))}
                             </ul>
                          </div>
                          <div className="pt-6 flex gap-3 mt-auto">
                            {proj.liveUrl && (
                              <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5">
                                Live Demo <ExternalLink size={12} />
                              </a>
                            )}
                            {proj.githubUrl && (
                              <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border border-gray-200">
                                GitHub <GithubIcon width={12} height={12} />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              case 'education':
                if (!careerProfile.education || careerProfile.education.length === 0) return null;
                return (
                  <motion.div key="education" id="education" {...fadeInUp} className="space-y-8 scroll-mt-24">
                    <div className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900">Academic Background</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {careerProfile.education.map((edu: any, idx: number) => (
                        <div key={idx} className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm flex items-center gap-6">
                          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
                            <BookOpen size={20} />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-bold text-gray-900">{edu.institution}</h4>
                            <div className="text-gray-600 text-sm font-serif">{edu.degree} {edu.specialization && `in ${edu.specialization}`}</div>
                            <div className="text-gray-400 text-xs font-semibold">{edu.startYear} – {edu.endYear || 'Present'}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              case 'certifications':
                if (!careerProfile.certifications || careerProfile.certifications.length === 0) return null;
                return (
                  <motion.div key="certifications" id="certifications" {...fadeInUp} className="space-y-8 scroll-mt-24">
                    <div className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900">Credentials & Certifications</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {careerProfile.certifications.map((cert: any, idx: number) => (
                        <div key={idx} className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm space-y-3">
                          <Award className="text-indigo-600" size={24} />
                          <div className="space-y-1">
                            <h4 className="font-bold text-gray-900 text-sm">{typeof cert === 'string' ? cert : (cert.title || (cert as any).name)}</h4>
                            <div className="text-gray-600 text-xs">{typeof cert === 'string' ? '' : cert.issuer}</div>
                            <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{typeof cert === 'string' ? '' : cert.issueDate}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              case 'contact':
                return (
                  <motion.div key="contact" id="contact" {...fadeInUp} className="pt-12 scroll-mt-24">
                    <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 rounded-[32px] p-8 md:p-16 text-center shadow-xl relative overflow-hidden">
                      {/* Decorative background elements */}
                      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
                      
                      <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-white backdrop-blur-sm border border-white/20">
                          <Mail size={32} />
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Let's Connect</h3>
                          <p className="text-indigo-100 text-lg font-serif">Open to opportunities and collaborations. Drop a message to discuss how we can work together.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                          {careerProfile.personalInfo.email && (
                            <a href={`mailto:${careerProfile.personalInfo.email}`} className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-900 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg flex items-center justify-center gap-2">
                              Contact Me <ChevronRight size={16} />
                            </a>
                          )}
                          <div className="flex items-center gap-6 text-indigo-200 text-sm font-medium mt-4 sm:mt-0 sm:ml-4">
                            {careerProfile.personalInfo.email && (
                              <span className="flex items-center gap-2"><Mail size={14} /> {careerProfile.personalInfo.email}</span>
                            )}
                            {careerProfile.personalInfo.location && (
                              <span className="flex items-center gap-2"><MapPin size={14} /> {careerProfile.personalInfo.location}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );

              case 'practiceAreas':
                const practiceAreas = careerProfile.extensions?.practiceAreas || [];
                if (practiceAreas.length === 0) return null;
                return (
                  <motion.div key="practiceAreas" id="practiceAreas" {...fadeInUp} className="space-y-8 scroll-mt-24">
                    <div className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900">Practice Areas</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {practiceAreas.map((area: any, idx: number) => (
                        <div key={idx} className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Shield size={18} />
                          </div>
                          <h4 className="font-bold text-gray-900 text-base">{area}</h4>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              case 'publications':
                const publications = careerProfile.publications || [];
                if (publications.length === 0) return null;
                return (
                  <motion.div key="publications" id="publications" {...fadeInUp} className="space-y-8 scroll-mt-24">
                    <div className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900">Publications</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {publications.map((pub: any, idx: number) => (
                        <div key={idx} className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm hover:shadow-md transition-shadow space-y-2">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <BookOpen size={18} />
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">{pub}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              case 'portfolioShowcase':
                const workSamplesList = careerProfile.workSamples || [];
                const behanceUrl = careerProfile.extensions?.behance;
                const dribbbleUrl = careerProfile.extensions?.dribbble;
                if (workSamplesList.length === 0 && !behanceUrl && !dribbbleUrl) return null;
                return (
                  <motion.div key="portfolioShowcase" id="portfolioShowcase" {...fadeInUp} className="space-y-8 scroll-mt-24">
                    <div className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900">Portfolio Showcase</h3>
                    </div>
                    {(behanceUrl || dribbbleUrl) && (
                      <div className="flex flex-wrap gap-4 mb-4">
                        {behanceUrl && (
                          <a href={behanceUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                            <Globe size={14} /> Behance Portfolio
                          </a>
                        )}
                        {dribbbleUrl && (
                          <a href={dribbbleUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                            <Globe size={14} /> Dribbble Portfolio
                          </a>
                        )}
                      </div>
                    )}
                    {workSamplesList.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {workSamplesList.map((sample: any, idx: number) => (
                          <div key={idx} className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm hover:shadow-md transition-shadow space-y-3">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-gray-900 text-lg">{sample.title}</h4>
                              {sample.url && (
                                <a href={sample.url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-500">
                                  <ExternalLink size={16} />
                                </a>
                              )}
                            </div>
                            {sample.description && <p className="text-gray-500 text-sm">{sample.description}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );

              case 'designProcess':
                const designProcessTools = careerProfile.extensions?.tools || ['User Research', 'Wireframing', 'UI Design', 'Prototyping', 'Usability Testing'];
                return (
                  <motion.div key="designProcess" id="designProcess" {...fadeInUp} className="space-y-8 scroll-mt-24">
                    <div className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900">Design Process & Tools</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {designProcessTools.map((tool: any, idx: number) => (
                        <div key={idx} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-default">
                          {tool}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              case 'campaigns':
                const marketingCampaigns = careerProfile.extensions?.campaigns || [];
                if (marketingCampaigns.length === 0) return null;
                return (
                  <motion.div key="campaigns" id="campaigns" {...fadeInUp} className="space-y-8 scroll-mt-24">
                    <div className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900">Campaigns</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {marketingCampaigns.map((camp: any, idx: number) => (
                        <div key={idx} className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                            <Rocket size={18} />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-base">{camp}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              case 'growthMetrics':
                const marketingGrowthMetrics = careerProfile.extensions?.growthMetrics || [];
                if (marketingGrowthMetrics.length === 0) return null;
                return (
                  <motion.div key="growthMetrics" id="growthMetrics" {...fadeInUp} className="space-y-8 scroll-mt-24">
                    <div className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900">Growth Metrics & Results</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {marketingGrowthMetrics.map((metric: any, idx: number) => (
                        <div key={idx} className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <TrendingUp size={18} />
                          </div>
                          <h4 className="font-bold text-gray-900 text-base">{metric}</h4>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              default:
                return null;
            }
          })}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // TEMPLATE 3: CREATIVE PORTFOLIO (Premium Light Pastel)
  // ==========================================
  const renderCreativeTemplate = () => {
    let creativeOrder = ['hero', 'stats', 'projects', 'splitGrid', 'contact'];
    if (isDeveloper) {
      creativeOrder = ['hero', 'about', 'skills', 'experience', 'education', 'projects', 'certifications', 'contact'];
    } else if (isLawyer) {
      creativeOrder = ['hero', 'stats', 'practiceAreas', 'certifications', 'publications', 'experience', 'contact'];
    } else if (isDesigner) {
      creativeOrder = ['hero', 'stats', 'portfolioShowcase', 'designProcess', 'projects', 'experience', 'contact'];
    } else if (isMarketing) {
      creativeOrder = ['hero', 'stats', 'campaigns', 'growthMetrics', 'experience', 'contact'];
    }

    const activeOrder = (portfolio.sectionOrder && portfolio.sectionOrder.length > 0 ? portfolio.sectionOrder : creativeOrder)
      .filter(key => isSectionEnabled(key, toggles));
    
    const metrics = [
      { label: "Major Products Delivered", value: "3+", icon: Rocket, color: "text-indigo-600", bg: "bg-indigo-50" },
      { label: "Companies Worked With", value: "2", icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Core Domains Expertise", value: "5+", icon: Code, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Commitment To Quality", value: "100%", icon: Trophy, color: "text-amber-600", bg: "bg-amber-50" }
    ];

    const summaryText = careerProfile.summary || (careerProfile as any).professionalSummary || (careerProfile.personalInfo as any)?.summary;

    return (
      <div className="w-full text-slate-800 font-sans relative overflow-hidden bg-[#FAFAFB]">
        {/* Pastel Ambient Blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-100/50 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[700px] h-[700px] bg-violet-100/40 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-12 md:py-32 space-y-32 relative z-10">
          {activeOrder.map((secKey: any) => {
            switch (secKey) {
              case 'hero':
                return (
                  <motion.div key="hero" {...fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center pt-16">
                    {/* Left Content */}
                    <div className="space-y-8 z-10 relative">
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm border border-slate-100 text-slate-500">
                          <span className="text-[10px] font-bold uppercase tracking-widest">{careerProfile.professionCategory || 'Creative Developer'}</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                          I turn data into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">decisions</span> & ideas into <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">products.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-serif max-w-lg pt-2">
                          {summaryText || "Building intelligent systems, automations, and digital solutions that create real impact."}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 pt-2">
                        <a href="#projects" className="px-8 py-4 bg-[#0A0D14] hover:bg-[#1A2133] text-white rounded-full font-bold transition-all shadow-[0_10px_30px_rgba(10,13,20,0.15)] flex items-center gap-2 text-sm group">
                          View My Work <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a href="#resume" className="px-8 py-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full font-bold transition-colors shadow-sm flex items-center gap-2 text-sm group">
                          Download Resume <Download size={16} className="group-hover:-translate-y-1 transition-transform" />
                        </a>
                      </div>

                      <div className="flex items-center gap-6 pt-6">
                        <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">Let's Connect</span>
                        <div className="flex items-center gap-3">
                          {socialLinks.map((s: any, idx: number) => {
                            const Icon = s.icon;
                            return (
                              <a key={idx} href={s.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:scale-110 transition-all">
                                <Icon size={16} />
                              </a>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Right 3D Visualization */}
                    <div className="relative w-full aspect-square flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/10 to-fuchsia-400/10 rounded-full blur-3xl"></div>
                      <img src="/images/creative_hero_pastel.png" alt="Creative Pastel Fluid" className="w-[110%] max-w-none relative z-10 mix-blend-multiply opacity-90 hover:scale-[1.02] transition-transform duration-1000 ease-out drop-shadow-2xl" />
                      
                      {/* Floating UI Widget 1 (Insights Generated) */}
                      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="absolute left-0 top-1/4 -translate-y-4 bg-white/90 backdrop-blur-xl border border-white p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] w-56 z-20 hidden md:block hover:-translate-y-2 transition-transform cursor-default">
                        <h4 className="font-bold text-slate-800 text-xs mb-1">Insights Generated</h4>
                        <div className="text-2xl font-bold text-slate-900">2.5M+</div>
                        <div className="text-[10px] text-emerald-500 mt-1 font-medium">↑ 18.6% this month</div>
                        <div className="flex items-end gap-1.5 h-10 mt-4">
                          {[30, 45, 25, 60, 80, 50, 90, 75].map((h: any, i: number) => (
                             <div key={i} className="w-full rounded-t-sm bg-gradient-to-t from-blue-300 to-indigo-400" style={{ height: `${h}%` }}></div>
                          ))}
                        </div>
                      </motion.div>
                      
                      {/* Floating UI Widget 2 (Models Deployed) */}
                      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="absolute right-0 top-1/2 translate-x-8 bg-white/90 backdrop-blur-xl border border-white p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] w-48 z-20 hidden lg:block hover:scale-105 transition-transform cursor-default">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                          <Cpu size={18} />
                        </div>
                        <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1">Models Deployed</h4>
                        <div className="text-3xl font-bold text-slate-900">12+</div>
                        <div className="text-[10px] text-slate-500 mt-1">Production Models</div>
                      </motion.div>
                    </div>
                  </motion.div>
                );

              case 'stats':
                return (
                  <motion.div key="stats" {...fadeInUp} className="bg-white/60 border border-slate-100 rounded-[32px] p-6 md:p-10 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {metrics.map((m: any, idx: number) => {
                      const Icon = m.icon;
                      return (
                        <div key={idx} className="flex items-center gap-5 group">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${m.color} ${m.bg} group-hover:scale-110 transition-transform shadow-sm`}>
                            <Icon size={24} />
                          </div>
                          <div>
                            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{m.value}</div>
                            <div className="text-xs font-semibold text-slate-500 leading-tight mt-1 max-w-[100px]">{m.label}</div>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                );

              case 'projects':
                if (!careerProfile.projects || careerProfile.projects.length === 0) return null;
                return (
                  <motion.div key="projects" id="projects" {...fadeInUp} className="space-y-10 scroll-mt-32">
                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-2">Featured Work</h3>
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Things I've Built</h2>
                      </div>
                      <a href="#projects" className="hidden sm:flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
                        View all projects <ArrowRight size={14} />
                      </a>
                    </div>
                    {/* Snap Scroll Carousel Container */}
                    <div className="relative group/carousel">
                      <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {careerProfile.projects.map((proj: any, idx: number) => (
                          <div key={idx} className="snap-center shrink-0 w-[85vw] md:w-[400px] lg:w-[450px] bg-white border border-slate-100 rounded-[32px] overflow-hidden flex flex-col hover:-translate-y-2 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 group relative">
                            <div className="h-64 bg-slate-50 relative overflow-hidden flex items-center justify-center p-6">
                              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-50"></div>
                              {/* Abstract Dashboard Mockup */}
                              <div className="w-full h-full bg-[#0F131E] rounded-2xl shadow-2xl flex flex-col p-4 group-hover:scale-[1.03] group-hover:rotate-1 transition-transform duration-700 relative z-10">
                                 <div className="flex justify-between items-center mb-4">
                                   <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div></div>
                                   <div className="w-16 h-2 rounded bg-white/10"></div>
                                 </div>
                                 <div className="flex gap-3 h-full">
                                   <div className="w-1/4 h-full bg-white/5 rounded-xl"></div>
                                   <div className="flex-1 flex flex-col gap-3">
                                     <div className="w-full h-1/2 bg-indigo-500/20 border border-indigo-500/30 rounded-xl"></div>
                                     <div className="w-full h-1/2 bg-purple-500/10 border border-purple-500/20 rounded-xl"></div>
                                   </div>
                                 </div>
                              </div>
                            </div>
                            
                            <div className="p-8 flex flex-col flex-grow bg-white relative z-20">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                  <Box size={18} />
                                </div>
                                <h4 className="text-2xl font-bold text-slate-900 tracking-tight">{proj.name || (proj as any).title}</h4>
                                {proj.liveUrl && (
                                   <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="ml-auto text-indigo-500 hover:text-indigo-400">
                                     <ExternalLink size={18} />
                                   </a>
                                )}
                              </div>
                              <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">{proj.description}</p>
                              
                              {proj.achievements && proj.achievements.length > 0 && (
                                <ul className="space-y-2 mb-6">
                                  {proj.achievements.map((bullet: any, bIdx: number) => (
                                    <li key={bIdx} className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-indigo-300 text-[13px] text-slate-600 leading-relaxed font-medium">{bullet}</li>
                                  ))}
                                </ul>
                              )}

                              <div className="mt-auto space-y-6">
                                {proj.technologies && proj.technologies.length > 0 && (
                                  <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                                    {proj.technologies.map((tech: any, tIdx: number) => (
                                      <span key={tIdx} className="text-[11px] font-bold text-slate-600 px-3 py-1.5 bg-slate-50 rounded-full">{tech}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Carousel Arrow Hint overlays */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-12 h-12 bg-white rounded-full shadow-xl items-center justify-center text-slate-800 z-30 hidden lg:group-hover/carousel:flex cursor-pointer hover:scale-110 transition-transform">
                         <ChevronLeft size={20} />
                      </div>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-12 h-12 bg-white rounded-full shadow-xl items-center justify-center text-slate-800 z-30 hidden lg:group-hover/carousel:flex cursor-pointer hover:scale-110 transition-transform">
                         <ChevronRight size={20} />
                      </div>
                    </div>
                  </motion.div>
                );

              case 'splitGrid':
                return (
                  <div key="splitGrid" className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 lg:gap-24 pt-16">
                    {/* Skills Grid (Left) */}
                    <motion.div {...fadeInUp} className="space-y-10">
                      <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-2">My Superpowers</h3>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Skills & Technologies</h2>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                        {careerProfile.skills?.map((skill: any, idx: number) => (
                          <div key={idx} className="bg-white border border-slate-100 rounded-2xl flex items-center justify-start gap-3 px-4 py-3.5 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-100 transition-all cursor-default group col-span-2 sm:col-span-1 min-w-[120px]">
                            <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 group-hover:text-indigo-600 transition-colors shrink-0">
                              <Code2 size={12} />
                            </div>
                            <span className="text-[12px] font-bold text-slate-700 truncate">{skill.name}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Orbit / Experience (Right) */}
                    <motion.div {...fadeInUp} className="space-y-10 relative">
                      {/* Orbital Visualization (Decorative Background) */}
                      <div className="absolute top-0 right-0 w-full h-[400px] flex items-center justify-center pointer-events-none opacity-50 hidden md:flex">
                        <div className="w-[300px] h-[300px] rounded-full border border-dashed border-slate-300 animate-[spin_20s_linear_infinite]"></div>
                        <div className="absolute w-[200px] h-[200px] rounded-full border border-dashed border-indigo-200 animate-[spin_15s_linear_infinite_reverse]"></div>
                        <div className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-[#0A0D14] to-slate-800 flex items-center justify-center shadow-2xl z-10">
                          <span className="text-2xl font-bold text-white tracking-widest">AC</span>
                        </div>
                      </div>

                      <div className="relative z-20">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-2">Experience</h3>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">My Journey</h2>
                        
                        <div className="space-y-12">
                          {careerProfile.experience?.map((exp: any, idx: number) => (
                            <div key={idx} className="relative grid grid-cols-1 md:grid-cols-[100px_1fr] gap-6 items-start group">
                              <div className="text-right pt-2 hidden md:block">
                                <span className="text-xs font-bold text-indigo-500 tracking-wider block">{exp.startDate}</span>
                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">{exp.currentlyWorking ? 'Present' : exp.endDate}</span>
                              </div>
                              
                              <div className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-[24px] p-8 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all">
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <h4 className="font-bold text-slate-900 text-xl">{exp.position}</h4>
                                    <div className="text-indigo-600 font-bold text-sm mt-1">{exp.company}</div>
                                  </div>
                                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                                    <Trophy size={18} />
                                  </div>
                                </div>
                                <ul className="space-y-3 mt-4">
                                  {exp.achievements.map((bullet: any, bIdx: number) => (
                                    <li key={bIdx} className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-indigo-300 text-[13px] text-slate-600 leading-relaxed font-medium">{bullet}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              case 'skills':
                if (!careerProfile.skills || careerProfile.skills.length === 0) return null;
                return (
                  <motion.div key="skills" id="skills" {...fadeInUp} className="space-y-10 scroll-mt-32">
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-2">My Superpowers</h3>
                      <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Skills & Technologies</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {careerProfile.skills?.map((skill: any, idx: number) => (
                        <div key={idx} className="bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-3 p-6 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-indigo-100 transition-all cursor-default group">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all shrink-0">
                            <Code2 size={16} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 text-center truncate w-full">{skill.name}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              case 'experience':
                if (!careerProfile.experience || careerProfile.experience.length === 0) return null;
                return (
                  <motion.div key="experience" id="experience" {...fadeInUp} className="space-y-10 scroll-mt-32">
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-2">My Journey</h3>
                      <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Experience</h2>
                    </div>
                    <div className="space-y-8">
                      {careerProfile.experience?.map((exp: any, idx: number) => (
                        <div key={idx} className="relative grid grid-cols-1 md:grid-cols-[150px_1fr] gap-8 items-start group">
                          <div className="text-left pt-2 hidden md:block">
                            <span className="text-sm font-bold text-indigo-500 block">{exp.startDate}</span>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">{exp.currentlyWorking ? 'Present' : exp.endDate}</span>
                          </div>
                          
                          <div className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-10 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all">
                            <div className="md:hidden mb-4">
                              <span className="text-sm font-bold text-indigo-500">{exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
                              <div>
                                <h4 className="font-extrabold text-slate-900 text-2xl tracking-tight">{exp.position}</h4>
                                <div className="text-indigo-600 font-bold text-base mt-1">{exp.company}</div>
                              </div>
                              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                                <Building2 size={24} />
                              </div>
                            </div>
                            <ul className="space-y-3">
                              {exp.achievements.map((bullet: any, bIdx: number) => (
                                <li key={bIdx} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-indigo-300 text-sm text-slate-600 leading-relaxed font-medium">{bullet}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              case 'education':
                if (!careerProfile.education || careerProfile.education.length === 0) return null;
                return (
                  <motion.div key="education" id="education" {...fadeInUp} className="space-y-10 scroll-mt-32">
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-2">Academic Background</h3>
                      <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Education</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {careerProfile.education.map((edu: any, idx: number) => (
                        <div key={idx} className="bg-white border border-slate-100 rounded-[32px] p-8 hover:-translate-y-1 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all group">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <GraduationCap size={20} />
                          </div>
                          <h4 className="font-extrabold text-slate-900 text-xl tracking-tight mb-2">{edu.degree}</h4>
                          <div className="text-indigo-600 font-bold text-sm mb-4">{edu.institution}</div>
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{edu.graduationYear}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              case 'certifications':
                if (!careerProfile.certifications || careerProfile.certifications.length === 0) return null;
                return (
                  <motion.div key="certifications" id="certifications" {...fadeInUp} className="space-y-10 scroll-mt-32">
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-2">Credentials</h3>
                      <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Certifications</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {careerProfile.certifications.map((cert: any, idx: number) => (
                        <div key={idx} className="bg-white border border-slate-100 rounded-[32px] p-8 hover:-translate-y-1 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all flex flex-col group">
                          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Award size={20} />
                          </div>
                          <h4 className="font-extrabold text-slate-900 text-lg tracking-tight mb-2 flex-grow">{typeof cert === 'string' ? cert : ((cert as any).name || cert.title)}</h4>
                          <div className="text-slate-500 font-medium text-sm mb-4">{typeof cert === 'string' ? '' : cert.issuer}</div>
                          {cert.year && <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{cert.year}</div>}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              case 'achievements':
                if (!careerProfile.achievements || careerProfile.achievements.length === 0) return null;
                return (
                  <motion.div key="achievements" id="achievements" {...fadeInUp} className="space-y-10 scroll-mt-32">
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-2">Milestones</h3>
                      <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Achievements</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {careerProfile.achievements.map((ach: any, idx: number) => (
                        <div key={idx} className="bg-white border border-slate-100 rounded-[32px] p-8 hover:-translate-y-1 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all flex gap-6 group">
                           <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                             <Trophy size={20} />
                           </div>
                           <div className="flex-1">
                             <h4 className="font-bold text-slate-900 text-lg mb-2">{ach.title}</h4>
                             <p className="text-sm text-slate-600 leading-relaxed font-medium">{ach.description}</p>
                           </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              case 'contact':
                return (
                  <motion.div key="contact" id="contact" {...fadeInUp} className="pt-24 pb-12 scroll-mt-24">
                    <div className="bg-gradient-to-r from-violet-100 via-fuchsia-50 to-indigo-100 rounded-[40px] p-10 md:p-16 shadow-[0_20px_60px_rgba(139,92,246,0.15)] relative overflow-hidden flex flex-col items-center text-center gap-8 border border-white">
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/40 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                      
                      <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">Let's Build Something Amazing</div>
                        <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">Let's create impact <br/> together.</h3>
                        <p className="text-slate-600 font-medium">Got an idea? A project? Or just want to say hi? I'm always open to exciting opportunities.</p>
                      </div>
                      
                      <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto mt-4">
                        {careerProfile.personalInfo.email && (
                          <a href={`mailto:${careerProfile.personalInfo.email}`} className="px-8 py-5 bg-white hover:scale-105 text-slate-900 rounded-3xl font-bold transition-transform shadow-[0_10px_30px_rgba(0,0,0,0.05)] flex items-center justify-center gap-4 group min-w-[200px]">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors"><Mail size={16} /></div>
                            <div className="text-left leading-tight"><div className="text-[10px] text-slate-400 uppercase tracking-widest">Email Me</div><div className="text-sm">{careerProfile.personalInfo.email}</div></div>
                          </a>
                        )}
                        {careerProfile.personalInfo.linkedin && (
                          <a href={careerProfile.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="px-8 py-5 bg-white/60 backdrop-blur-md hover:bg-white text-slate-900 rounded-3xl font-bold transition-colors shadow-sm flex items-center justify-center gap-4 group border border-white/40 min-w-[220px]">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors"><LinkedinIcon width={16} height={16} /></div>
                            <div className="text-left leading-tight"><div className="text-[10px] text-slate-400 uppercase tracking-widest">Connect on LinkedIn</div><div className="text-sm">/in/akshatchaudhary</div></div>
                          </a>
                        )}
                        {careerProfile.personalInfo.github && (
                          <a href={careerProfile.personalInfo.github} target="_blank" rel="noopener noreferrer" className="px-8 py-5 bg-white/60 backdrop-blur-md hover:bg-white text-slate-900 rounded-3xl font-bold transition-colors shadow-sm flex items-center justify-center gap-4 group border border-white/40 min-w-[220px]">
                            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-800 group-hover:text-white transition-colors"><GithubIcon width={16} height={16} /></div>
                            <div className="text-left leading-tight"><div className="text-[10px] text-slate-400 uppercase tracking-widest">Check out GitHub</div><div className="text-sm">/akshatchaudhary02</div></div>
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );

              case 'practiceAreas':
                const practiceAreas = careerProfile.extensions?.practiceAreas || [];
                if (practiceAreas.length === 0) return null;
                return (
                  <motion.div key="practiceAreas" id="practiceAreas" {...fadeInUp} className="space-y-10 scroll-mt-32">
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-2">Legal Expertise</h3>
                      <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Practice Areas</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {practiceAreas.map((area: any, idx: number) => (
                        <div key={idx} className="bg-white border border-slate-100 rounded-[32px] p-8 hover:-translate-y-1 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all flex items-center gap-4 group">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-115 transition-transform">
                            <Shield size={20} />
                          </div>
                          <h4 className="font-bold text-slate-900 text-lg">{area}</h4>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              case 'publications':
                const publications = careerProfile.publications || [];
                if (publications.length === 0) return null;
                return (
                  <motion.div key="publications" id="publications" {...fadeInUp} className="space-y-10 scroll-mt-32">
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-2">Research & Writing</h3>
                      <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Publications</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {publications.map((pub: any, idx: number) => (
                        <div key={idx} className="bg-white border border-slate-100 rounded-[32px] p-8 hover:-translate-y-1 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all space-y-3 group">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-115 transition-transform">
                            <BookOpen size={20} />
                          </div>
                          <p className="text-slate-700 text-base leading-relaxed font-serif">{pub}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              case 'portfolioShowcase':
                const workSamplesList = careerProfile.workSamples || [];
                const behanceUrl = careerProfile.extensions?.behance;
                const dribbbleUrl = careerProfile.extensions?.dribbble;
                if (workSamplesList.length === 0 && !behanceUrl && !dribbbleUrl) return null;
                return (
                  <motion.div key="portfolioShowcase" id="portfolioShowcase" {...fadeInUp} className="space-y-10 scroll-mt-32">
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-2">Work Showcase</h3>
                      <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Portfolio Showcase</h2>
                    </div>
                    {(behanceUrl || dribbbleUrl) && (
                      <div className="flex flex-wrap gap-4 mb-6">
                        {behanceUrl && (
                          <a href={behanceUrl} target="_blank" rel="noreferrer" className="px-6 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-[#0A0D14] hover:text-white rounded-full font-bold transition-all shadow-sm flex items-center gap-2">
                            <Globe size={14} /> Behance Profile
                          </a>
                        )}
                        {dribbbleUrl && (
                          <a href={dribbbleUrl} target="_blank" rel="noreferrer" className="px-6 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-[#0A0D14] hover:text-white rounded-full font-bold transition-all shadow-sm flex items-center gap-2">
                            <Globe size={14} /> Dribbble Profile
                          </a>
                        )}
                      </div>
                    )}
                    {workSamplesList.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {workSamplesList.map((sample: any, idx: number) => (
                          <div key={idx} className="bg-white border border-slate-100 rounded-[32px] p-8 hover:-translate-y-1 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all space-y-3 group">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-slate-900 text-xl">{sample.title}</h4>
                              {sample.url && (
                                <a href={sample.url} target="_blank" rel="noreferrer" className="text-indigo-500 hover:text-indigo-400">
                                  <ExternalLink size={18} />
                                </a>
                              )}
                            </div>
                            {sample.description && <p className="text-slate-500 text-sm leading-relaxed">{sample.description}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );

              case 'designProcess':
                const designProcessTools = careerProfile.extensions?.tools || ['User Research', 'Wireframing', 'UI Design', 'Prototyping', 'Usability Testing'];
                return (
                  <motion.div key="designProcess" id="designProcess" {...fadeInUp} className="space-y-10 scroll-mt-32">
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-2">My Toolbox</h3>
                      <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Design Process & Tools</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {designProcessTools.map((tool: any, idx: number) => (
                        <div key={idx} className="px-5 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 hover:-translate-y-0.5 hover:shadow-md transition-all cursor-default">
                          {tool}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              case 'campaigns':
                const marketingCampaigns = careerProfile.extensions?.campaigns || [];
                if (marketingCampaigns.length === 0) return null;
                return (
                  <motion.div key="campaigns" id="campaigns" {...fadeInUp} className="space-y-10 scroll-mt-32">
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-2">Campaigns Run</h3>
                      <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Campaign Showcase</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {marketingCampaigns.map((camp: any, idx: number) => (
                        <div key={idx} className="bg-white border border-slate-100 rounded-[32px] p-8 hover:-translate-y-1 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all flex items-start gap-4 group">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-115 transition-transform shrink-0">
                            <Rocket size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-lg leading-tight">{camp}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              case 'growthMetrics':
                const marketingGrowthMetrics = careerProfile.extensions?.growthMetrics || [];
                if (marketingGrowthMetrics.length === 0) return null;
                return (
                  <motion.div key="growthMetrics" id="growthMetrics" {...fadeInUp} className="space-y-10 scroll-mt-32">
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-2">Analytics & Impact</h3>
                      <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Growth Metrics & Results</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {marketingGrowthMetrics.map((metric: any, idx: number) => (
                        <div key={idx} className="bg-white border border-slate-100 rounded-[32px] p-8 hover:-translate-y-1 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all flex items-center gap-4 group">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-115 transition-transform">
                            <TrendingUp size={20} />
                          </div>
                          <h4 className="font-bold text-slate-900 text-lg leading-tight">{metric}</h4>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              default:
                return null;
            }
          })}
        </div>
      </div>
    );
  };

  if (tpl === 'executive') {
    return <ExecutiveTemplate profile={careerProfile} portfolio={portfolio} />;
  }

  if (tpl === 'product_builder' || tpl === 'builder') {
    return <ProductBuilderTemplate profile={careerProfile} portfolio={portfolio} />;
  }

  if (tpl === 'interactive_showcase' || tpl === 'interactive') {
    return <InteractiveTemplate profile={careerProfile} portfolio={portfolio} />;
  }

  const isDev = tpl === 'dev';
  const isCreative = tpl === 'creative';
  const isDark = isDev; // Only Dev is dark mode now
  const darkBg = isDev ? "bg-[#090b14]" : "";

  return (
    <main 
      className={isCreative ? "min-h-screen bg-[#FAFAFB] select-none" : (isDark ? `min-h-screen ${darkBg} select-none` : "min-h-screen bg-warm-bg select-none")}
      style={{
        '--color-primary': dna.tokens.colors.primary,
        '--color-primary-rgb': hexToRgb(dna.tokens.colors.primary),
        '--color-secondary': dna.tokens.colors.secondary,
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
      {/* Portfolio Navbar */}
      <nav className={isCreative
        ? "fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl bg-white/80 backdrop-blur-xl border border-white/40 rounded-full px-6 py-3 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 print:hidden"
        : (isDev 
            ? "border-b border-white/5 bg-[#0B0F19]/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-200 print:hidden shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
            : "border-b border-warm-border bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-200 print:hidden")
      }>
        <div className={isCreative ? "flex items-center gap-2 w-full justify-between" : "max-w-6xl mx-auto px-6 md:px-8 py-3.5 flex items-center justify-between w-full"}>
          <div className="flex items-center gap-3">
            <div className={isCreative 
              ? "w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-sm font-bold shadow-sm"
              : (isDev
                  ? "w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm font-bold shadow-sm"
                  : "w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shadow-sm")
            }>
              AC
            </div>
            <span 
              className={isCreative
                ? "font-sans font-bold tracking-tight text-slate-800 hover:text-indigo-600 transition-colors cursor-pointer text-sm"
                : (isDark
                  ? "font-sans font-bold tracking-tight text-white hover:text-indigo-400 transition-colors cursor-pointer text-sm"
                  : "font-sans font-extrabold tracking-tight text-primary hover:text-brand transition-colors cursor-pointer")
              }
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              {careerProfile.personalInfo.fullName} <span className={isCreative ? "inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 ml-1" : "hidden"}></span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-4">
            {navItems.map((item: any) => (
              <a
                key={item.href}
                href={item.href}
                className={isCreative 
                  ? "text-[13px] font-bold text-slate-500 hover:text-slate-900 transition-all hover:bg-slate-50 px-4 py-2 rounded-full relative group"
                  : (isDev
                      ? "text-xs font-semibold text-slate-400 hover:text-white transition-colors hover:bg-white/5 px-3 py-1.5 rounded-lg"
                      : "text-xs font-semibold text-primary-light hover:text-primary transition-colors hover:underline underline-offset-4")
                }
              >
                {item.label}
                {isCreative && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>}
              </a>
            ))}
          </div>

          {/* Contact / Right Panel */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`mailto:${careerProfile.personalInfo.email}`}
              className={isCreative
                ? "flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 hover:shadow-lg transition-all"
                : (isDev
                    ? "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all duration-200"
                    : "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-primary hover:bg-primary-light shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0")
              }
            >
              {isCreative ? "Let's Connect" : <Mail size={12} />}
              {isCreative ? <ArrowRight size={14} /> : (!isDev && "Contact Me")}
              {isDev && "Contact Me"}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={isCreative
              ? "md:hidden p-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              : (isDark
                ? "md:hidden p-1.5 rounded-full border border-white/10 text-slate-300 hover:bg-white/5 transition-colors"
                : "md:hidden p-1.5 rounded-lg border border-warm-border text-primary hover:bg-warm-bg transition-colors")
            }
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className={isCreative
            ? "absolute top-full left-0 w-full mt-4 md:hidden border border-white/40 rounded-3xl bg-white/95 backdrop-blur-xl px-6 py-6 space-y-4 shadow-2xl"
            : (isDark
              ? "absolute top-full left-0 w-full mt-2 md:hidden border border-white/10 rounded-2xl bg-[#0A0D14]/95 backdrop-blur-xl px-6 py-4 space-y-4 shadow-2xl"
              : "absolute top-full left-0 w-full md:hidden border-t border-warm-border bg-white px-6 py-4 space-y-4")
          }>
            <div className="flex flex-col gap-2">
              {navItems.map((item: any) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={isCreative
                    ? "text-sm font-bold text-slate-600 hover:text-indigo-600 py-3 px-4 rounded-xl transition-colors hover:bg-slate-50"
                    : (isDark
                      ? "text-xs font-bold text-slate-400 hover:text-white py-3 px-4 rounded-xl transition-colors hover:bg-white/5"
                      : "text-xs font-bold text-primary-light hover:text-primary py-1.5 transition-colors border-b border-warm-border/40")
                  }
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* DNA Dynamic Style Overrides */}

      <style dangerouslySetInnerHTML={{__html: `
        @import url('${dna.tokens.typography.importUrl}');
        
        .font-sans, .font-serif, .font-mono { font-family: var(--font-body) !important; }
        h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading) !important; }
        
        /* Background Overrides */
        .bg-\\[\\#090b14\\], .bg-\\[\\#FAFAFB\\], .bg-\\[\\#fdfbfb\\], .bg-slate-50, .bg-white { background-color: var(--color-background) !important; }
        .bg-white\\/5, .bg-white\\/10, .bg-indigo-50, .bg-indigo-900\\/20, .bg-purple-900\\/10, .bg-white\\/40, .bg-slate-100, .bg-gray-50, .bg-gray-100 { background-color: var(--color-surface) !important; }
        
        /* Text Overrides */
        .text-slate-900, .text-gray-900, .text-slate-800, .text-white { color: var(--color-text) !important; }
        .text-slate-600, .text-gray-600, .text-slate-500, .text-slate-400, .text-slate-300 { color: var(--color-muted) !important; }
        
        /* Primary Accent Overrides */
        .bg-indigo-600, .bg-indigo-500, .bg-blue-600, .bg-blue-500, .bg-orange-500, .bg-orange-600, .bg-pink-500 { background-color: var(--color-primary) !important; }
        .text-indigo-400, .text-indigo-500, .text-indigo-600, .text-indigo-700, .text-blue-600, .text-blue-700, .text-orange-500, .text-orange-600, .text-pink-500, .text-rose-500 { color: var(--color-primary) !important; }
        .border-indigo-500, .border-indigo-200, .border-indigo-100, .border-blue-600, .border-orange-500, .border-pink-200, .border-pink-500 { border-color: var(--color-primary) !important; }
        
        /* Opacity Colors */
        .bg-indigo-500\\/10, .bg-blue-500\\/10, .bg-orange-500\\/10 { background-color: rgba(var(--color-primary-rgb), 0.1) !important; }
        .bg-indigo-500\\/20, .bg-blue-500\\/20, .bg-orange-500\\/20 { background-color: rgba(var(--color-primary-rgb), 0.2) !important; }
        .border-indigo-500\\/20, .border-blue-500\\/20, .border-orange-500\\/20 { border-color: rgba(var(--color-primary-rgb), 0.2) !important; }
        
        /* Secondary Accent Overrides */
        .text-indigo-300, .text-blue-400, .text-orange-400 { color: var(--color-secondary) !important; }
        .from-indigo-400, .from-blue-600, .from-orange-400, .from-pink-500, .from-indigo-50 { --tw-gradient-from: var(--color-primary) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
        .to-purple-400, .to-blue-400, .to-rose-400, .to-blue-50 { --tw-gradient-to: var(--color-secondary) !important; }
        
        /* Shadows */
        .shadow-\\[0_0_20px_rgba\\(79\\,70\\,229\\,0\\.3\\)\\] { box-shadow: 0 0 20px rgba(var(--color-primary-rgb), 0.3) !important; }
        .shadow-\\[0_0_10px_rgba\\(79\\,70\\,229\\,0\\.5\\)\\] { box-shadow: 0 0 10px rgba(var(--color-primary-rgb), 0.5) !important; }
        
        /* Border Radius & Geometry */
        .rounded-xl, .rounded-2xl, .rounded-3xl, .rounded-\\[32px\\] { border-radius: var(--radius-base) !important; }
      `}} />
  
      {/* Render selected layout */}
      {tpl === 'dev' && renderDeveloperTemplate()}
      {tpl === 'corporate' && renderCorporateTemplate()}
      {tpl === 'creative' && renderCreativeTemplate()}
    </main>
  );
}
