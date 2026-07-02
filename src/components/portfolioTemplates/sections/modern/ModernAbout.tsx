'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';
import { getSectionMetadata } from '@/utils/professionMap';

export default function ModernAbout({ profile }: { profile: CareerProfile }) {
  if (!profile.summary) return null;

  const { title, icon } = getSectionMetadata(profile.professionCategory, 'about');

  return (
    <section id="about" className="scroll-mt-32 w-full relative max-w-[1400px] mx-auto px-6 lg:px-12 mt-32 min-h-screen flex items-center">
      
      {/* Background Blur Elements */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/2 h-1/2 bg-[var(--color-primary)]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16 flex justify-start"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[var(--color-surface)]/50 border border-[var(--color-text)]/10 backdrop-blur-xl">
            <span className="text-[var(--color-primary)]">{icon}</span>
            <h2 className="text-xl font-bold text-[var(--color-text)] tracking-wide uppercase">{title}</h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <div className="lg:col-span-8">
            {(profile as any).aboutMeTimeline && (profile as any).aboutMeTimeline.length > 0 ? (
              <div className="relative border-l border-[var(--color-text)]/10 ml-4 pl-8 space-y-12 mb-16">
                {(profile as any).aboutMeTimeline.map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="relative group"
                  >
                    {/* Dot */}
                    <div className="absolute -left-[41px] top-2 w-5 h-5 rounded-full bg-[var(--color-primary)] border-4 border-[#0F172A] transition-transform duration-300 group-hover:scale-125" />
                    
                    <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider block mb-1">
                      {item.year}
                    </span>
                    
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--color-text)] mb-1">
                      {item.title}
                    </h3>
                    
                    <h4 className="text-sm font-semibold text-[var(--color-muted)] mb-3">
                      {item.subTitle}
                    </h4>
                    
                    <p className="text-base text-[var(--color-muted)] leading-relaxed max-w-2xl font-light">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="space-y-6 text-xl md:text-2xl lg:text-3xl font-light text-[var(--color-text)]/90 leading-relaxed"
              >
                {((profile as any).aboutMe || profile.summary || '').split('\n\n').map((para: string, pIdx: number) => (
                  <p key={pIdx}>{para}</p>
                ))}
              </motion.div>
            )}
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-12 h-[1px] w-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-transparent"
            />
          </div>
          
          <div className="lg:col-span-4 flex flex-col gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[var(--color-surface)]/30 border border-[var(--color-text)]/10 rounded-3xl p-10 flex flex-col items-center justify-center text-center hover:bg-[var(--color-surface)]/50 transition-colors"
            >
              <span className="text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary)] mb-2">
                {profile.experience?.length || 0}
              </span>
              <span className="text-sm font-bold text-[var(--color-muted)] uppercase tracking-widest">Career Milestones</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
