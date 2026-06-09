'use client';
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';

export default function BrutalistAbout({ profile }: { profile: CareerProfile }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section id="about" className="relative w-full bg-[#dfdfdf] text-[#050505] overflow-hidden border-b-[10px] border-[#050505]">
      <style dangerouslySetInnerHTML={{__html: `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;900&display=swap');`}} />

      <div className="w-full" style={{ fontFamily: "'Space Grotesk', sans-serif" }} ref={ref}>
        {/* Header Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b-[10px] border-[#050505]">
          <div className="col-span-1 lg:col-span-4 border-b-[5px] lg:border-b-0 lg:border-r-[10px] border-[#050505] p-6 lg:p-12 flex flex-col justify-between bg-[var(--color-primary)]">
            <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter">
              Manifesto
            </h2>
            <div className="mt-12 text-2xl font-bold uppercase border-t-[5px] border-[#050505] pt-4">
              [ IDENTITY ]
            </div>
          </div>
          
          <div className="col-span-1 lg:col-span-8 p-6 lg:p-12 bg-[#dfdfdf]">
            <div className="relative overflow-hidden">
              <p className="text-3xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9] break-words">
                {profile.summary || "No summary provided. Expect greatness."}
              </p>
              <motion.div 
                initial={{ x: 0 }}
                animate={isInView ? { x: "100%" } : {}}
                transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
                className="absolute inset-0 bg-[#050505] z-20 origin-left"
              />
            </div>
          </div>
        </div>

        {/* Info Grid (Spreadsheet Vibe) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div className="border-b-[5px] md:border-b-0 lg:border-r-[10px] border-[#050505] p-6 lg:p-12 hover:bg-[#050505] hover:text-[#dfdfdf] transition-colors">
            <h3 className="text-xl font-bold uppercase opacity-50 mb-4">Location</h3>
            <p className="text-3xl font-black uppercase tracking-tighter">{profile.personalInfo.location || 'GLOBAL'}</p>
          </div>
          <div className="border-b-[5px] md:border-b-0 lg:border-r-[10px] border-[#050505] p-6 lg:p-12 hover:bg-[#050505] hover:text-[#dfdfdf] transition-colors">
            <h3 className="text-xl font-bold uppercase opacity-50 mb-4">Status</h3>
            <p className="text-3xl font-black uppercase tracking-tighter text-[var(--color-primary)] bg-black px-2 inline-block">ACTIVE_</p>
          </div>
          <div className="border-b-[5px] md:border-b-0 lg:border-r-[10px] border-[#050505] p-6 lg:p-12 hover:bg-[#050505] hover:text-[#dfdfdf] transition-colors">
            <h3 className="text-xl font-bold uppercase opacity-50 mb-4">Level</h3>
            <p className="text-3xl font-black uppercase tracking-tighter">{profile.professionalBlueprint?.experienceLevel || 'EXPERT'}</p>
          </div>
          <div className="p-6 lg:p-12 hover:bg-[#050505] hover:text-[#dfdfdf] transition-colors flex items-center justify-center">
            <a href={`mailto:${profile.personalInfo.email}`} className="text-3xl font-black uppercase tracking-tighter underline decoration-[5px] underline-offset-[10px] hover:text-[var(--color-primary)]">
              INITIATE
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}