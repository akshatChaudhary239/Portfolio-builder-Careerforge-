'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BaseSectionProps } from '@/components/portfolio/types';
import { usePortfolioLiveConfig } from '../editor/LiveEditorContext';

export default function SkillsCreative({ profile }: BaseSectionProps) {
  const liveConfig = usePortfolioLiveConfig('skills');
  if (!liveConfig.visible || !profile.skills || profile.skills.length === 0) return null;

  const sectionSubtitle = liveConfig.customSubtitle || 'My Toolkit';
  const sectionTitle = liveConfig.customTitle || 'Skills & Expertise';

  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' as const }
  };

  const alignClass = liveConfig.alignment === 'left' ? 'text-left justify-start' : liveConfig.alignment === 'right' ? 'text-right justify-end' : 'text-center justify-center';

  return (
    <motion.div key="skills" id="skills" {...fadeInUp} className="space-y-10 scroll-mt-32">
      <div className={alignClass}>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] mb-2">{sectionSubtitle}</h3>
        <h2 className="text-4xl font-extrabold text-[var(--color-text)] tracking-tight">{sectionTitle}</h2>
      </div>
      <div className={`flex flex-wrap ${alignClass} gap-3 md:gap-4`}>
        {profile.skills.map((skill: any, idx: number) => {
          const skillName = typeof skill === 'string' ? skill : skill.name;
          return (
            <span key={idx} className="px-5 py-2.5 bg-[var(--color-surface)] shadow-md hover:shadow-xl hover:-translate-y-1 rounded-full border border-[rgba(var(--color-primary-rgb),0.1)] text-sm md:text-base font-bold text-[var(--color-text)] transition-all cursor-default">
              {skillName}
            </span>
          );
        })}
      </div>
    </motion.div>
  );
}
