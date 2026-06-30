'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { CareerProfile } from '@/db/local-db';
import Magnetic from '@/components/shared/Magnetic';

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const wordVariants: any = {
  hidden: { y: "120%", opacity: 0, rotate: 5 },
  visible: { y: 0, opacity: 1, rotate: 0, transition: { type: "spring", damping: 20, stiffness: 100 } }
};

export default function CreativeHero({ profile }: { profile: CareerProfile }) {
  const firstName = profile.personalInfo.fullName.split(' ')[0];
  
  return (
    <section className="relative min-h-screen flex flex-col justify-center w-full overflow-hidden bg-transparent text-[var(--color-text)] px-6 lg:px-12 selection:bg-[var(--color-primary)]/30">
      {/* Immersive Dark Background Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-primary)] opacity-30 blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-secondary)] opacity-20 blur-[150px] mix-blend-screen" />
      </div>

      <div className="max-w-[1400px] mx-auto w-full relative z-10 pt-20">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col">
          
          <div className="overflow-hidden mb-8">
            <motion.div variants={wordVariants} className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[var(--color-surface)] text-[var(--color-text)] text-sm md:text-base font-semibold tracking-wide border border-[var(--color-text)]/10">
              <Sparkles size={16} className="text-[var(--color-primary)]" />
              <span>{profile.professionCategory || 'Creative Visionary'}</span>
            </motion.div>
          </div>
          
          <h1 className="text-[3rem] sm:text-[4.5rem] md:text-[9rem] lg:text-[12rem] xl:text-[14rem] font-bold tracking-tighter leading-[0.85] uppercase flex flex-col -ml-2 lg:-ml-4">
            <div className="overflow-hidden pb-4">
              <motion.span variants={wordVariants} className="block">Hello, I&apos;m</motion.span>
            </div>
            <div className="overflow-hidden pb-4">
              <motion.span variants={wordVariants} className="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)] bg-[length:200%_auto] animate-gradient">
                {firstName}.
              </motion.span>
            </div>
          </h1>
          
          <div className="mt-12 md:mt-24 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
            <motion.p variants={wordVariants} className="text-xl md:text-3xl lg:text-4xl text-[var(--color-muted)] leading-tight max-w-3xl font-medium tracking-tight">
              {profile.summary || 'I craft beautiful, engaging digital experiences that leave a lasting impression.'}
            </motion.p>
            
            <Magnetic strength={0.3}>
              <motion.a 
                variants={wordVariants}
                href={`mailto:${profile.personalInfo.email}`} 
                className="group relative flex items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-full bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-[var(--color-background)] transition-colors duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                <span className="font-bold text-lg md:text-xl z-10 flex items-center gap-2 group-hover:scale-110 transition-transform duration-500">
                  Connect <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                </span>
              </motion.a>
            </Magnetic>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-6 lg:left-12 flex items-center gap-4 text-[#A0A8B0] font-semibold tracking-widest uppercase text-sm"
      >
        <span>Scroll</span>
        <div className="w-12 h-[2px] bg-white/20 overflow-hidden">
          <motion.div 
            animate={{ x: ["-100%", "100%"] }} 
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-full h-full bg-[var(--color-primary)]"
          />
        </div>
      </motion.div>
    </section>
  );
}
