'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Globe } from 'lucide-react';
import { BaseSectionProps } from '@/components/portfolio/types';
import { usePortfolioLiveConfig } from '../editor/LiveEditorContext';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function ProjectsTechnical({ profile }: BaseSectionProps) {
  const liveConfig = usePortfolioLiveConfig('projects');
  if (!liveConfig.visible || !profile.projects || profile.projects.length === 0) return null;

  const sectionSubtitle = liveConfig.customSubtitle || 'Featured Projects';
  const sectionTitle = liveConfig.customTitle || "Things I've Built";

  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' as const }
  };

  const alignClass = liveConfig.alignment === 'center' ? 'text-center' : liveConfig.alignment === 'right' ? 'text-right' : 'text-left';

  const gridClass = liveConfig.variant === 'variantB' ? 'grid-cols-1 md:grid-cols-2' : liveConfig.variant === 'variantC' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <motion.div key="projects" id="projects" {...fadeInUp} className="space-y-8 scroll-mt-24">
      <div className={`border-b border-[rgba(var(--color-primary-rgb),0.1)] pb-4 ${alignClass}`}>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] mb-2">{sectionSubtitle}</h3>
        <h2 className="text-3xl font-bold text-[var(--color-text)] tracking-tight">{sectionTitle}</h2>
      </div>
      <div className={`grid ${gridClass} gap-6 md:gap-8`}>
        {profile.projects.map((proj: any, idx: number) => {
          const itemId = proj.id || proj.name || `proj_${idx}`;
          const itemOverride = liveConfig.itemOverrides[itemId] || liveConfig.itemOverrides[proj.name] || {};

          const displayName = itemOverride.name || proj.name || (proj as any).title;
          const displayDesc = itemOverride.description || proj.description;
          const displayLiveUrl = itemOverride.liveUrl || proj.liveUrl || proj.link;

          return (
            <div key={idx} className="bg-[var(--color-surface)] border border-[rgba(var(--color-primary-rgb),0.1)] rounded-[var(--radius-base)] overflow-hidden flex flex-col h-full hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-[0_10px_40px_rgba(var(--color-primary-rgb),0.1)] transition-all duration-300 group">
              <div className="h-48 bg-[#1F2937] border-b border-[rgba(var(--color-primary-rgb),0.1)] relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] to-transparent z-10"></div>
                <div className="w-3/4 h-3/4 border border-white/10 rounded-lg bg-[var(--color-background)] p-4 flex flex-col gap-2 opacity-50 group-hover:scale-105 transition-transform duration-500">
                  <div className="flex gap-2"><div className="w-full h-8 bg-[var(--color-muted)] rounded"></div></div>
                  <div className="w-full h-full bg-[rgba(var(--color-primary-rgb),0.1)] border border-[rgba(var(--color-primary-rgb),0.2)] rounded"></div>
                </div>
              </div>
              
              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <h4 className="text-xl font-bold text-[var(--color-text)] tracking-tight mb-2">{displayName}</h4>
                <p className="text-[var(--color-muted)] text-sm leading-relaxed mb-6 flex-grow font-[var(--font-body)]">{displayDesc}</p>
                
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {proj.technologies.slice(0, 4).map((tech: any, tIdx: number) => (
                      <span key={tIdx} className="text-[10px] font-bold text-[var(--color-muted)] px-2 py-1 bg-[rgba(var(--color-primary-rgb),0.1)] rounded">{tech}</span>
                    ))}
                  </div>
                )}

                {proj.achievements && proj.achievements.length > 0 && (
                  <ul className="space-y-2 mt-4 flex-grow">
                    {proj.achievements.map((bullet: any, bIdx: number) => {
                      const cleanBullet = typeof bullet === 'string' ? bullet.replace(/^[\s•\-\*\u2022\u2023\u25E6\u2043\u2219]+/, '').trim() : String(bullet || '');
                      return (
                        <li key={bIdx} className="relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-[var(--color-primary)] text-[13px] text-[var(--color-muted)] leading-relaxed">
                          {cleanBullet}
                        </li>
                      );
                    })}
                  </ul>
                )}

                <div className="flex items-center gap-4 pt-4 border-t border-[rgba(var(--color-primary-rgb),0.1)] mt-auto">
                  {displayLiveUrl && (
                    <a href={displayLiveUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[var(--color-primary)] hover:opacity-80 transition-opacity flex items-center gap-1.5">
                      View Project <ExternalLink size={14} />
                    </a>
                  )}
                  {proj.githubUrl && (
                    <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors ml-auto">
                      {proj.githubUrl.toLowerCase().includes('github') ? <GithubIcon style={{ fontSize: 18 }} /> : <Globe size={18} />}
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
