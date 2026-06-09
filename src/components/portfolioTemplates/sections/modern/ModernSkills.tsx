'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';
import { getSectionMetadata } from '@/utils/professionMap';

export default function ModernSkills({ profile }: { profile: CareerProfile }) {
  if (!profile.skills || profile.skills.length === 0) return null;

  const { title, icon } = getSectionMetadata(profile.professionCategory, 'skills');

  return (
    <section id="skills" className="w-full relative bg-transparent py-32 overflow-hidden flex flex-col items-center justify-center min-h-screen">
      
      {/* Dynamic Background Blur */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">
        <div className="w-[80vw] h-[80vw] bg-[var(--color-primary)]/10 rounded-full blur-[200px]" />
      </div>

      <div className="max-w-[1400px] mx-auto w-full relative z-10 px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-24 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[var(--color-surface)] border border-[var(--color-text)]/10 backdrop-blur-xl mb-8">
            <span className="text-[var(--color-primary)]">{icon}</span>
            <h2 className="text-sm font-bold text-[var(--color-text)] tracking-[0.2em] uppercase">{title}</h2>
          </div>
          
          <h3 className="text-5xl md:text-8xl lg:text-[10rem] font-black tracking-tighter text-center leading-[0.8] text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
            {title.split(' ')[0]} <br/> <span className="text-[var(--color-primary)]">{title.split(' ').slice(1).join(' ') || 'Expertise'}</span>
          </h3>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 lg:gap-8 max-w-5xl mx-auto">
          {profile.skills.map((skill: any, idx: number) => {
            const skillName = typeof skill === 'string' ? skill : skill.name;

            return (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (idx % 10) * 0.05, type: "spring" }}
                whileHover={{ scale: 1.1, y: -10 }}
                className="relative group cursor-default"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary)]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative px-8 py-4 lg:px-10 lg:py-5 rounded-full bg-[var(--color-surface)]/80 border border-[var(--color-text)]/10 text-slate-200 font-bold tracking-wide shadow-xl backdrop-blur-xl z-10 flex items-center justify-center text-lg lg:text-2xl group-hover:border-blue-400/50 transition-colors">
                  {skillName}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
