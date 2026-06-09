'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';
import { getSectionMetadata } from '@/utils/professionMap';

export default function ModernEducation({ profile }: { profile: CareerProfile }) {
  if (!profile.education || profile.education.length === 0) return null;

  const { title, icon } = getSectionMetadata(profile.professionCategory, 'education');

  return (
    <section id="education" className="w-full relative bg-transparent py-32 px-6 lg:px-12 text-[var(--color-text)] min-h-[70vh]">
      <div className="max-w-[1400px] mx-auto w-full relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8 border-b border-[var(--color-text)]/10 pb-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[var(--color-surface)]/50 border border-[var(--color-text)]/10 backdrop-blur-xl mb-8">
              <span className="text-[var(--color-primary)]">{icon}</span>
              <h2 className="text-sm font-bold text-[var(--color-text)] tracking-[0.2em] uppercase">{title}</h2>
            </div>
            
            <h3 className="text-5xl md:text-7xl lg:text-[7rem] font-black tracking-tighter leading-[0.9]">
              Academic <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]">Foundation</span>
            </h3>
          </motion.div>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[var(--color-primary)]/50 via-[var(--color-secondary)]/20 to-transparent hidden lg:block" />

          <div className="flex flex-col gap-16 lg:gap-24">
            {profile.education.map((edu: any, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="relative flex flex-col lg:flex-row gap-8 lg:gap-16 group"
              >
                <div className="hidden lg:flex absolute left-[31px] -translate-x-1/2 top-4 w-4 h-4 rounded-full bg-[var(--color-primary)] border-[4px] border-slate-900 group-hover:scale-150 transition-transform duration-300" />
                
                <div className="lg:w-1/3 lg:pl-16 flex flex-col pt-2">
                  <span className="text-lg md:text-2xl font-bold text-[var(--color-primary)] mb-2">{edu.year || `${edu.startDate} - ${edu.endDate || 'Present'}`}</span>
                  <h4 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-text)] mb-2">{edu.institution}</h4>
                </div>
                
                <div className="lg:w-2/3 bg-[var(--color-surface)]/30 border border-[var(--color-text)]/10 rounded-[2rem] p-8 lg:p-12 hover:bg-[var(--color-surface)]/50 hover:border-blue-500/30 transition-colors duration-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <h5 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-4 relative z-10">{edu.degree}</h5>
                  {edu.description && (
                    <p className="text-xl md:text-2xl text-[var(--color-muted)] leading-relaxed font-light relative z-10">
                      {edu.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
