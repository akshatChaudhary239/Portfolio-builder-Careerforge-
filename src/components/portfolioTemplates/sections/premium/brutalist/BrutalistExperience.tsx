'use client';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';

export default function BrutalistExperience({ profile }: { profile: CareerProfile }) {
  const ref = useRef<HTMLDivElement>(null);
  
  if (!profile.experience || profile.experience.length === 0) return null;

  return (
    <section id="experience" ref={ref} className="relative min-h-screen py-32 flex flex-col justify-center bg-[var(--color-surface)] text-[var(--color-text)] border-b-[10px] border-[var(--color-text)]">
      <div className="w-full max-w-7xl mx-auto px-6">
        <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-16 text-[var(--color-text)]">Experience</h2>
        <div className="space-y-8">
          {profile.experience.map((exp, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="bg-[var(--color-surface)] border-[4px] border-[var(--color-text)] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[8px] hover:translate-y-[8px] transition-all duration-200"
            >
              <div className="md:flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-4xl font-black uppercase mb-2">{exp.position}</h3>
                  <span className="text-base font-bold bg-black text-[var(--color-text)] px-2 py-1 inline-block uppercase tracking-widest mb-4">{exp.company}</span>
                </div>
                <div className="text-sm uppercase tracking-widest opacity-60 mt-2 md:mt-0">
                  {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                </div>
              </div>
              <p className="text-[var(--color-text)] text-xl font-medium leading-relaxed mb-6">{exp.description}</p>
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