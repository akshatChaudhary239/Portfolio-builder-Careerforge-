import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, ArrowRight, Mail } from 'lucide-react';
import { BaseSectionProps } from '@/components/portfolio/types';

interface Props extends BaseSectionProps {}

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

export default function HeroTechnical({ profile }: Props) {
  const summaryText = profile.summary || (profile as any).professionalSummary || (profile.personalInfo as any)?.summary;

  const socialLinks = [
    profile.personalInfo?.github && { icon: GithubIcon, href: profile.personalInfo.github },
    profile.personalInfo?.linkedin && { icon: LinkedinIcon, href: profile.personalInfo.linkedin },
  ].filter(Boolean);

  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' as const }
  };

  return (
    <motion.div key="hero" {...fadeInUp} className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-8 items-center pt-8">
      <div className="space-y-8">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(var(--color-primary-rgb),0.1)] border border-[rgba(var(--color-primary-rgb),0.2)] text-[var(--color-primary)]">
            <Terminal size={12} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{profile.professionCategory || 'Software Engineer'}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[var(--color-text)] leading-[1.1]">
            Building intelligent <br /> products with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">data, AI & code.</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-muted)] leading-relaxed font-[var(--font-body)] max-w-lg pt-2">
            {summaryText}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <a href="#projects" className="px-6 py-3.5 bg-[var(--color-primary)] text-white rounded-[var(--radius-base)] font-medium hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.3)] flex items-center gap-2 text-sm">
            View Projects <ArrowRight size={16} />
          </a>
          <a href="#contact" className="px-6 py-3.5 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[var(--color-text)] rounded-[var(--radius-base)] font-medium hover:bg-[rgba(255,255,255,0.1)] transition-colors flex items-center gap-2 text-sm">
            Contact Me <Mail size={16} />
          </a>
        </div>

        <div className="flex items-center gap-4 pt-4">
          {socialLinks.map((s: any, idx: number) => {
            const Icon = s.icon;
            return (
              <a key={idx} href={s.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                <Icon size={18} />
              </a>
            )
          })}
        </div>
      </div>

      <div className="relative w-full aspect-[4/3] flex items-center justify-center lg:justify-end">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="w-full max-w-[500px] bg-[#111827] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative z-10">
          <div className="flex items-center px-4 py-3 bg-[#1F2937]/50 border-b border-white/5">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            </div>
            <div className="mx-auto text-xs font-mono text-slate-500 font-medium">analytics.ts</div>
          </div>
          <div className="p-5 font-mono text-[11px] md:text-[13px] leading-loose text-slate-400 overflow-hidden">
            <div className="flex"><span className="w-6 text-slate-600 select-none">1</span><span className="text-purple-400">import</span> data <span className="text-purple-400">from</span> './insights';</div>
            <div className="flex"><span className="w-6 text-slate-600 select-none">2</span></div>
            <div className="flex"><span className="w-6 text-slate-600 select-none">3</span><span className="text-indigo-400">function</span> <span className="text-blue-400">generate_insights</span>(dataset) {'{'}</div>
            <div className="flex"><span className="w-6 text-slate-600 select-none">4</span>  <span className="text-purple-400">return</span> {'{'}</div>
            <div className="flex"><span className="w-6 text-slate-600 select-none">5</span>    <span className="text-emerald-400">'accuracy'</span>: <span className="text-orange-400">0.99</span>,</div>
            <div className="flex"><span className="w-6 text-slate-600 select-none">6</span>    <span className="text-emerald-400">'impact'</span>: <span className="text-emerald-400">'high'</span></div>
            <div className="flex"><span className="w-6 text-slate-600 select-none">7</span>  {'}'}</div>
            <div className="flex"><span className="w-6 text-slate-600 select-none">8</span>{'}'}</div>
            <div className="flex"><span className="w-6 text-slate-600 select-none">9</span></div>
            <div className="flex"><span className="w-6 text-slate-600 select-none">10</span><span className="text-slate-500">// Turning data into decisions</span></div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
