import React from 'react';
import { motion } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';

export default function CreativeAbout({ profile }: { profile: CareerProfile }) {
  if (!profile.summary && !(profile as any).aboutMe) return null;

  const aboutText = (profile as any).aboutMe || profile.summary || '';

  return (
    <section id="about" className="w-full relative bg-[#0C1016] py-32 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-4 flex flex-col gap-12 border-t border-white/20 pt-8">
            <h2 className="text-sm font-bold text-[#A0A8B0] uppercase tracking-[0.2em]">The Narrative</h2>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl lg:text-6xl font-light text-[var(--color-text)]">{profile.experience?.length || 0}</span>
                <span className="text-sm font-bold text-[#A0A8B0] uppercase tracking-widest leading-tight">Years<br/>Experience</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-4xl lg:text-6xl font-light text-[var(--color-text)]">{profile.projects?.length || 0}</span>
                <span className="text-sm font-bold text-[#A0A8B0] uppercase tracking-widest leading-tight">Featured<br/>Projects</span>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-8 space-y-8">
            {aboutText.split('\n\n').map((para: string, pIdx: number) => {
              const words = para.split(' ');
              return (
                <h3 key={pIdx} className="text-xl md:text-3xl lg:text-4xl font-light tracking-normal leading-[1.6] text-[var(--color-text)]/90 flex flex-wrap gap-x-2 gap-y-1">
                  {words.map((word, i) => (
                    <motion.span 
                      key={i}
                      initial={{ opacity: 0.15, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, margin: "-50px", amount: "all" }}
                      transition={{ duration: 0.4, delay: i * 0.01 }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </h3>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
