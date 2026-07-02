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
            {(profile as any).aboutMeTimeline && (profile as any).aboutMeTimeline.length > 0 ? (
              <div className="relative border-l border-[#CCCCCC] ml-4 pl-8 space-y-12 mb-16">
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
                    <div className="absolute -left-[41px] top-2 w-5 h-5 rounded-full bg-[#111111] border-4 border-[#FAFAFA] transition-transform duration-300 group-hover:scale-125" />
                    
                    <span className="text-xs font-mono text-[#555] uppercase tracking-widest block mb-1">
                      {item.year}
                    </span>
                    
                    <h3 className="text-xl md:text-2xl font-bold font-serif text-[#111111] mb-1">
                      {item.title}
                    </h3>
                    
                    <h4 className="text-sm font-bold uppercase tracking-wider text-[#777] mb-3">
                      {item.subTitle}
                    </h4>
                    
                    <p className="text-base text-[#555] font-light leading-relaxed max-w-2xl">
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
                transition={{ duration: 0.8 }}
                className="text-2xl md:text-3xl lg:text-4xl font-serif text-[#111111] leading-relaxed tracking-tight mb-16 space-y-6"
              >
                {((profile as any).aboutMe || profile.summary || '').split('\n\n').map((para: string, pIdx: number) => (
                  <p key={pIdx}>{para}</p>
                ))}
              </motion.div>
            )}

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
