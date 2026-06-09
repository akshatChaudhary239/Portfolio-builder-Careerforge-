'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CareerProfile } from '@/db/local-db';

const staggerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

export default function ModernHero({ profile }: { profile: CareerProfile }) {
  const words = profile.personalInfo.fullName.split(' ');
  const firstName = words[0];
  const lastName = words.length > 1 ? words.slice(1).join(' ') : '';

  return (
    <section className="relative min-h-screen flex flex-col justify-center w-full overflow-hidden bg-transparent text-[var(--color-text)]">
      
      {/* Dynamic Animated Glass Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-[var(--color-primary)] opacity-30 blur-[150px] mix-blend-screen" 
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[var(--color-secondary)] opacity-30 blur-[150px] mix-blend-screen" 
        />
      </div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-12 relative z-10 pt-24">
        <motion.div variants={staggerVariants} initial="hidden" animate="visible" className="flex flex-col">
          
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-text)]/10 backdrop-blur-xl w-max mb-12 shadow-[0_0_30px_var(--color-primary)]">
            <Sparkles size={16} className="text-[var(--color-primary)]" />
            <span className="text-sm font-semibold tracking-wide text-[var(--color-text)] uppercase">{profile.professionCategory || 'Modern Professional'}</span>
          </motion.div>
          
          <h1 className="text-[6rem] md:text-[10rem] lg:text-[14rem] font-black tracking-tighter leading-[0.85] flex flex-col mb-12">
            <motion.span variants={itemVariants} className="block text-[var(--color-text)]/90">
              {firstName}
            </motion.span>
            {lastName && (
              <motion.span variants={itemVariants} className="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)] animate-gradient bg-[length:200%_auto] -mt-2 md:-mt-6 lg:-mt-10">
                {lastName}
              </motion.span>
            )}
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <motion.p variants={itemVariants} className="text-2xl md:text-4xl text-[var(--color-muted)] font-light leading-snug max-w-3xl">
                {profile.summary || 'Delivering highly polished, performant, and scalable solutions for the modern web.'}
              </motion.p>
            </div>
            
            <div className="lg:col-span-4 flex lg:justify-end">
              <motion.a 
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`mailto:${profile.personalInfo.email}`} 
                className="group flex items-center gap-4 px-10 py-5 bg-[var(--color-text)] text-[var(--color-background)] rounded-full font-bold text-xl hover:opacity-90 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.2)]"
              >
                Let&apos;s Talk 
                <div className="w-10 h-10 rounded-full bg-[var(--color-background)] flex items-center justify-center transition-colors">
                  <ArrowRight size={20} className="text-[var(--color-text)] group-hover:-rotate-45 transition-transform duration-300" />
                </div>
              </motion.a>
            </div>
          </div>
          
        </motion.div>
      </div>
    </section>
  );
}
