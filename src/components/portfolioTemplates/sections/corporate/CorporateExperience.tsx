'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';
import { getSectionMetadata } from '@/utils/professionMap';

export default function CorporateExperience({ profile }: { profile: CareerProfile }) {
  if (!profile.experience || profile.experience.length === 0) return null;

  const { title } = getSectionMetadata(profile.professionCategory, 'experience');

  return (
    <section id="experience" className="w-full relative bg-[#FAFAFA] text-[#111111] py-32 border-b border-[#EAEAEA]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-4 border-t border-[#111111] pt-8">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] sticky top-32">{title}</h2>
          </div>

          <div className="lg:col-span-8 flex flex-col">
            {profile.experience.map((exp: any, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="flex flex-col border-t border-[#CCCCCC] pt-12 pb-16"
              >
                <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-8 gap-4">
                  <h3 className="text-3xl md:text-5xl font-serif font-bold text-[#111] leading-tight">{exp.company}</h3>
                  <span className="text-sm font-mono text-[#555] uppercase tracking-widest whitespace-nowrap">
                    {exp.duration || `${exp.startDate} - ${exp.endDate || 'Present'}`}
                  </span>
                </div>
                
                <h4 className="text-xl font-bold uppercase tracking-wider text-[#333] mb-6">{exp.position || exp.title}</h4>
                
                {exp.description && (
                  <p className="text-xl text-[#555] font-light leading-relaxed mb-8 max-w-3xl">
                    {exp.description}
                  </p>
                )}
                
                {exp.achievements && exp.achievements.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pt-8 border-t border-[#EAEAEA]">
                    {exp.achievements.map((ach: string, i: number) => (
                      <div key={i} className="flex items-start gap-4">
                        <span className="text-[#111] mt-1 text-xs">■</span>
                        <span className="text-[#555] leading-relaxed">{ach}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
