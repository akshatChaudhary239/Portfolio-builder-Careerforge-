'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { CareerProfile } from '@/db/local-db';
import { getSectionMetadata } from '@/utils/professionMap';

export default function CorporateProjects({ profile }: { profile: CareerProfile }) {
  if (!profile.projects || profile.projects.length === 0) return null;

  const { title } = getSectionMetadata(profile.professionCategory, 'projects');

  return (
    <section id="projects" className="w-full relative bg-[#111111] text-[#FAFAFA] py-32 border-b border-[#333333]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-24">
          <div className="lg:col-span-4 border-t border-[#FAFAFA] pt-8">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#FAFAFA]">{title}</h2>
          </div>
          <div className="lg:col-span-8 border-t border-[#333333] pt-8 hidden lg:block" />
        </div>

        <div className="flex flex-col gap-24">
          {profile.projects.map((proj, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="group flex flex-col lg:flex-row gap-12 lg:gap-24 items-start border-b border-[#333333] pb-24"
            >
              <div className="lg:w-1/2 flex flex-col order-2 lg:order-1">
                <div className="flex justify-between items-start mb-8">
                  <h3 className="text-4xl md:text-6xl font-serif text-[#FAFAFA] leading-tight group-hover:text-[#CCCCCC] transition-colors">{proj.name}</h3>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-[#555] flex items-center justify-center text-[#FAFAFA] hover:bg-[#FAFAFA] hover:text-[#111] transition-colors shrink-0">
                      <ArrowUpRight size={20} />
                    </a>
                  )}
                </div>
                
                <p className="text-xl text-[#A0A8B0] font-light leading-relaxed mb-12">
                  {proj.description}
                </p>
                
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-x-8 gap-y-4 pt-8 border-t border-[#333333]">
                    {proj.technologies.map((tech: string, i: number) => (
                      <span key={i} className="text-xs font-bold uppercase tracking-widest text-[#777]">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="lg:w-1/2 w-full aspect-[4/3] bg-[#222222] overflow-hidden order-1 lg:order-2 flex items-center justify-center">
                {/* Minimalist project representation */}
                <div className="w-3/4 h-3/4 border border-[#333] flex items-center justify-center bg-[#1A1A1A] group-hover:scale-105 transition-transform duration-700 ease-[0.22,1,0.36,1]">
                  <span className="text-[#555] font-serif italic text-2xl px-6 text-center">Case Study No. {idx + 1}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
