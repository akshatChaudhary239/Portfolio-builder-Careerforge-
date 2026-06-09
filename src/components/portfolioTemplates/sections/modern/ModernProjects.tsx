'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { CareerProfile } from '@/db/local-db';

const staggerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants: any = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function ModernProjects({ profile }: { profile: CareerProfile }) {
  if (!profile.projects || profile.projects.length === 0) return null;

  return (
    <section id="projects" className="w-full relative bg-transparent py-32 px-6 lg:px-12 text-[var(--color-text)] min-h-screen">
      <div className="max-w-[1400px] mx-auto w-full">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-8xl lg:text-[8rem] font-black tracking-tighter leading-[0.9]"
          >
            Featured <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]">Works</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="hidden md:block w-32 h-32 rounded-full border border-[var(--color-text)]/10 flex items-center justify-center text-sm uppercase tracking-widest font-semibold"
          >
            Explore
          </motion.div>
        </div>

        <motion.div 
          variants={staggerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
        >
          {profile.projects.map((proj, idx) => (
            <motion.div 
              key={idx}
              variants={cardVariants}
              className="group relative flex flex-col rounded-[2.5rem] bg-[var(--color-surface)]/50 border border-[var(--color-text)]/10 p-8 lg:p-12 overflow-hidden hover:border-blue-500/30 transition-colors duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/0 to-[var(--color-primary)]/0 group-hover:from-[var(--color-primary)]/10 group-hover:to-[var(--color-primary)]/10 transition-colors duration-500" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-12">
                  <div className="flex flex-wrap gap-2">
                    {(proj.technologies?.slice(0,3) || []).map((tech: string, i: number) => (
                      <span key={i} className="px-4 py-2 rounded-full bg-[var(--color-surface)] text-xs font-bold tracking-wide uppercase text-[var(--color-secondary)] backdrop-blur-md">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full bg-white text-[var(--color-text)] flex items-center justify-center hover:scale-110 transition-transform duration-300">
                      <ArrowUpRight size={24} />
                    </a>
                  )}
                </div>
                
                <div className="mt-auto pt-16">
                  <h3 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 group-hover:text-[var(--color-primary)] transition-colors">
                    {proj.name}
                  </h3>
                  <p className="text-lg md:text-2xl text-[var(--color-muted)] font-light leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
