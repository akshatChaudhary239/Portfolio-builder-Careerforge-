'use client';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';

export default function EtherealExperience({ profile }: { profile: CareerProfile }) {
  const ref = useRef<HTMLDivElement>(null);
  
  if (!profile.experience || profile.experience.length === 0) return null;

  return (
    <section id="experience" ref={ref} className="relative min-h-screen py-32 flex flex-col justify-center bg-[var(--color-background)] text-[var(--color-text)]">
      <div className="w-full max-w-7xl mx-auto px-6">
        <h2 className="text-5xl md:text-7xl font-serif font-light tracking-tight mb-16 text-[var(--color-text)]">Experience</h2>
        <div className="space-y-8">
          {profile.experience.map((exp, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="bg-[var(--color-surface)]/40 backdrop-blur-2xl border border-[var(--color-text)] p-8 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] transition-all duration-700"
            >
              <div className="md:flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-serif text-[var(--color-text)] mb-2">{exp.position}</h3>
                  <span className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-[0.2em] mb-4 block">{exp.company}</span>
                </div>
                <div className="text-sm uppercase tracking-widest opacity-60 mt-2 md:mt-0">
                  {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                </div>
              </div>
              <p className="text-[var(--color-muted)] text-lg leading-relaxed font-light mb-6">{exp.description}</p>
              {exp.achievements && exp.achievements.length > 0 && (
                <ul className="list-disc pl-5 space-y-2 text-sm opacity-80 mix-blend-difference">
                  {exp.achievements.map((ach: any, j) => {
                    const achText = typeof ach === 'string' ? ach : (ach?.description || ach?.title || ach?.name || JSON.stringify(ach));
                    return <li key={j}>{achText}</li>;
                  })}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}