import React from 'react';
import { motion } from 'framer-motion';
import { BaseSectionProps } from '@/components/portfolio/types';

export default function SkillsCreative({ profile }: BaseSectionProps) {
  if (!profile.skills || profile.skills.length === 0) return null;

  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' as const }
  };

  return (
    <motion.div key="skills" id="skills" {...fadeInUp} className="space-y-10 scroll-mt-32">
      <div className="text-center">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] mb-2">My Toolkit</h3>
        <h2 className="text-4xl font-extrabold text-[var(--color-text)] tracking-tight">Skills & Expertise</h2>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {profile.skills.map((skill: any, idx: number) => (
          <span key={idx} className="px-6 py-3 bg-[var(--color-surface)] shadow-lg hover:shadow-xl hover:-translate-y-1 rounded-full border border-[rgba(var(--color-primary-rgb),0.1)] text-base font-bold text-[var(--color-text)] transition-all cursor-default">
            {skill.name}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
