'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';

const fadeUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

export default function CorporateHero({ profile }: { profile: CareerProfile }) {
  return (
    <section className="relative min-h-screen flex flex-col justify-center w-full bg-transparent text-[var(--color-text)] overflow-hidden pt-24 border-b border-[var(--color-text)]/10">
      {/* Strict Grid Background */}
      <div className="absolute inset-0 pointer-events-none z-0 flex justify-between px-6 lg:px-12 opacity-20">
        <div className="w-[1px] h-full bg-[var(--color-text)] opacity-20" />
        <div className="w-[1px] h-full bg-[var(--color-text)] opacity-20" />
        <div className="w-[1px] h-full bg-[var(--color-text)] opacity-20" />
        <div className="w-[1px] h-full bg-[var(--color-text)] opacity-20" />
        <div className="w-[1px] h-full bg-[var(--color-text)] opacity-20" />
      </div>

      <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-12 relative z-10 flex flex-col items-center text-center">
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="w-full flex flex-col items-center">
          
          <motion.div variants={fadeUp} className="mb-12 border border-[var(--color-text)]/30 px-6 py-2 rounded-full">
            <span className="text-xs font-bold uppercase tracking-[0.3em]">{profile.professionCategory || 'Executive Professional'}</span>
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-3xl sm:text-5xl md:text-7xl lg:text-[9rem] font-serif tracking-tight leading-[0.9] text-[var(--color-text)] mb-8 max-w-6xl">
            {profile.personalInfo.fullName}
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-xl md:text-3xl text-[var(--color-muted)] font-light leading-relaxed max-w-3xl mb-16">
            {(profile as any).intro || profile.summary || 'Driving strategic growth and operational excellence through proven leadership and vision.'}
          </motion.p>
          
          <motion.a 
            variants={fadeUp}
            href={`mailto:${profile.personalInfo.email}`} 
            className="group relative flex items-center justify-center w-40 h-40 rounded-full bg-[var(--color-primary)] text-[var(--color-background)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-[var(--color-secondary)] transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.22,1,0.36,1]" />
            <span className="relative z-10 font-bold tracking-widest uppercase text-sm group-hover:scale-105 transition-transform duration-500">
              Contact
            </span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
