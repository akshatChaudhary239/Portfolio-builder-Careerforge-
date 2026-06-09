import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { BaseSectionProps } from '@/components/portfolio/types';

export default function ExperienceProfessional({ profile }: BaseSectionProps) {
  if (!profile.experience || profile.experience.length === 0) return null;

  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' as const }
  };

  return (
    <motion.div key="experience" id="experience" {...fadeInUp} className="space-y-8 scroll-mt-24">
      <div className="border-b border-[var(--color-surface)] pb-4 mb-8">
        <h2 className="text-3xl font-extrabold text-[var(--color-text)] tracking-tight">Professional Experience</h2>
      </div>
      <div className="space-y-8">
        {profile.experience.map((exp: any, idx: number) => (
          <div key={idx} className="bg-[var(--color-background)] border border-[var(--color-surface)] rounded-[var(--radius-base)] p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
              <div>
                <h4 className="text-xl font-bold text-[var(--color-text)]">{exp.position}</h4>
                <div className="text-[var(--color-primary)] font-semibold flex items-center gap-2 mt-1">
                  <Briefcase size={16} /> {exp.company}
                </div>
              </div>
              <div className="text-sm font-bold text-[var(--color-muted)] bg-[var(--color-surface)] px-3 py-1 rounded-full w-fit">
                {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
              </div>
            </div>
            
            {exp.achievements && exp.achievements.length > 0 && (
              <ul className="space-y-2 mt-6">
                {exp.achievements.map((bullet: any, bIdx: number) => (
                  <li key={bIdx} className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[var(--color-primary)] text-[var(--color-muted)] leading-relaxed text-sm">
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
