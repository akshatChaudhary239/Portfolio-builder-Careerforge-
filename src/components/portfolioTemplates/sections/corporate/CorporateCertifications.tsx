'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';
import { getSectionMetadata } from '@/utils/professionMap';
import { ArrowUpRight } from 'lucide-react';

export default function CorporateCertifications({ profile }: { profile: CareerProfile }) {
  if (!profile.certifications || profile.certifications.length === 0) return null;

  const { title } = getSectionMetadata(profile.professionCategory, 'certifications');

  return (
    <section id="certifications" className="w-full relative bg-[#111111] text-[#FAFAFA] py-32 border-b border-[#333333]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-24">
          <div className="lg:col-span-4 border-t border-[#FAFAFA] pt-8">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#FAFAFA]">{title}</h2>
          </div>
          <div className="lg:col-span-8 border-t border-[#333333] pt-8 hidden lg:block" />
        </div>

        <div className="flex flex-col gap-12">
          {profile.certifications.map((cert: any, idx: number) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="group flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#333333] pb-12 hover:border-[#FAFAFA] transition-colors duration-500"
            >
              <div className="flex flex-col gap-4">
                <span className="text-xs font-mono text-[#777] group-hover:text-[#FAFAFA] transition-colors">0{idx + 1}</span>
                <h3 className="text-3xl md:text-5xl font-serif text-[#FAFAFA] leading-tight">{cert.name}</h3>
                <p className="text-xl text-[#888] font-light">Issued by {cert.issuer}</p>
              </div>
              
              <div className="flex items-center gap-8 mt-8 md:mt-0">
                <span className="text-sm font-mono uppercase tracking-widest text-[#777]">{cert.year}</span>
                {cert.link && (
                  <a href={cert.link} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-[#555] flex items-center justify-center text-[#FAFAFA] hover:bg-[#FAFAFA] hover:text-[#111] transition-colors shrink-0">
                    <ArrowUpRight size={20} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
