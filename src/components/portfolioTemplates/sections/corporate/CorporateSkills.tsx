'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';
import { getSectionMetadata } from '@/utils/professionMap';

export default function CorporateSkills({ profile }: { profile: CareerProfile }) {
  if (!profile.skills || profile.skills.length === 0) return null;

  const { title } = getSectionMetadata(profile.professionCategory, 'skills');

  return (
    <section id="skills" className="w-full relative bg-[#111111] text-[#FAFAFA] py-32 border-b border-[#333333]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 border-b border-[#333333] pb-8">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em]">{title}</h2>
          <span className="hidden md:block text-xs text-[#777] uppercase tracking-widest">Expertise Index</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {profile.skills.map((skill: any, idx: number) => {
            const skillName = typeof skill === 'string' ? skill : skill.name;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (idx % 6) * 0.1 }}
                className="flex flex-col border-t border-[#333333] pt-6 group"
              >
                <div className="flex justify-between items-center">
                  <span className="text-2xl md:text-3xl font-serif text-[#EAEAEA] group-hover:text-[var(--color-text)] transition-colors">{skillName}</span>
                  <span className="text-xs font-mono text-[#555]">0{idx + 1}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
