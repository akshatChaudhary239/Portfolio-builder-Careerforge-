'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';
import { getSectionMetadata } from '@/utils/professionMap';

export default function ModernCertifications({ profile }: { profile: CareerProfile }) {
  if (!profile.certifications || profile.certifications.length === 0) return null;

  const { title, icon } = getSectionMetadata(profile.professionCategory, 'certifications');

  return (
    <section id="certifications" className="w-full relative bg-transparent py-32 px-6 lg:px-12 text-[var(--color-text)] min-h-[70vh]">
      <div className="max-w-[1400px] mx-auto w-full relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
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
              Professional <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]">Credentials</span>
            </h3>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {profile.certifications.map((cert: any, idx: number) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative flex flex-col rounded-3xl bg-[var(--color-surface)]/30 border border-[var(--color-text)]/10 p-8 lg:p-10 hover:border-purple-500/30 transition-colors duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="mb-8 w-16 h-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-[var(--color-text)] transition-colors duration-500">
                {icon}
              </div>
              
              <h4 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--color-text)] mb-4 relative z-10">{cert.name}</h4>
              <p className="text-lg md:text-xl text-[var(--color-muted)] font-medium relative z-10">{cert.issuer}</p>
              
              <div className="mt-8 pt-8 border-t border-[var(--color-text)]/10 flex justify-between items-center relative z-10">
                <span className="text-sm font-bold tracking-widest uppercase text-[var(--color-muted)]">{cert.year}</span>
                {cert.link && (
                  <a href={cert.link} target="_blank" rel="noreferrer" className="text-sm font-bold uppercase tracking-widest text-[var(--color-primary)] hover:text-[var(--color-secondary)]">View →</a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
