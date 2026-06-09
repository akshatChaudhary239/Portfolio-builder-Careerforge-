'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { CareerProfile } from '@/db/local-db';

const itemVariants: any = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

export default function CreativeExperience({ profile }: { profile: CareerProfile }) {
  if (!profile.experience || profile.experience.length === 0) return null;

  return (
    <section id="experience" className="scroll-mt-32 w-full mt-32 relative z-10">
      <motion.div variants={itemVariants} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-black text-[var(--color-text)] mb-4">The Journey</h2>
        <p className="text-[var(--color-muted)] text-lg">Where I&apos;ve made an impact</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {profile.experience.map((exp, idx) => (
          <motion.div key={idx} variants={itemVariants} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl -z-10" />
            <div className="h-full bg-[var(--color-surface)] backdrop-blur-xl border border-[var(--color-text)]/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-[var(--color-text)] shadow-lg">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-text)]">{exp.position}</h3>
                  <p className="text-[var(--color-primary)] font-medium">{exp.company}</p>
                </div>
              </div>
              
              <div className="inline-block px-3 py-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-text)]/10 text-xs text-[var(--color-muted)] mb-6 font-medium tracking-wide">
                {exp.startDate} — {exp.endDate || 'Present'}
              </div>
              
              <p className="text-[var(--color-muted)] leading-relaxed text-sm mb-6">
                {exp.description}
              </p>

              {(exp as any).technologies && (exp as any).technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-auto">
                  {(exp as any).technologies.map((tech: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 text-xs font-semibold text-[var(--color-text)] bg-black/20 rounded-xl backdrop-blur-md">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
