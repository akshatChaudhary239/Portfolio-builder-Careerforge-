'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';
import { getSectionMetadata } from '@/utils/professionMap';

export default function CorporateAbout({ profile }: { profile: CareerProfile }) {
  if (!profile.summary) return null;

  const { title } = getSectionMetadata(profile.professionCategory, 'about');

  return (
    <section id="about" className="w-full relative bg-[#FAFAFA] py-32 border-b border-[#EAEAEA]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          <div className="lg:col-span-4 border-t border-[#111111] pt-8">
            <h2 className="text-sm font-bold text-[#111111] uppercase tracking-[0.2em]">{title}</h2>
          </div>
          
          <div className="lg:col-span-8 border-t border-[#CCCCCC] pt-8">
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-5xl lg:text-6xl font-serif text-[#111111] leading-snug tracking-tight mb-16"
            >
              {profile.summary}
            </motion.p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 border-t border-[#EAEAEA] pt-12">
              <div className="flex flex-col">
                <span className="text-4xl md:text-6xl font-light text-[#111] mb-2">{profile.experience?.length || 0}</span>
                <span className="text-xs font-bold text-[#777] uppercase tracking-widest">Key Roles</span>
              </div>
              <div className="flex flex-col">
                <span className="text-4xl md:text-6xl font-light text-[#111] mb-2">{profile.projects?.length || 0}</span>
                <span className="text-xs font-bold text-[#777] uppercase tracking-widest">Major Initiatives</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
