'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';
import { getSectionMetadata } from '@/utils/professionMap';

export default function CreativeEducation({ profile }: { profile: CareerProfile }) {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  if (!profile.education || profile.education.length === 0) return null;

  const { title } = getSectionMetadata(profile.professionCategory, 'education');

  return (
    <section id="education" ref={containerRef} className="w-full relative bg-[#EFEFEF] py-32 px-6 lg:px-12 text-[#1A1A1A] min-h-[80vh] overflow-hidden">
      
      {/* Massive Background Typography */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-none opacity-[0.03]">
        <h2 className="text-[20vw] font-black leading-none text-center uppercase whitespace-nowrap">{title}</h2>
      </div>

      <div className="max-w-[1400px] mx-auto w-full relative z-10 flex flex-col items-center">
        
        <motion.div style={{ y }} className="mb-32 flex flex-col items-center text-center">
          <h2 className="text-xl md:text-3xl font-bold tracking-[0.3em] uppercase text-[#1A1A1A] mb-4">
            {title}
          </h2>
          <div className="w-px h-24 bg-[#1A1A1A]" />
        </motion.div>

        <div className="w-full max-w-5xl flex flex-col gap-24">
          {profile.education.map((edu: any, idx: number) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col md:flex-row gap-8 md:gap-16 items-start"
            >
              <div className="md:w-1/3 flex flex-col">
                <span className="text-6xl md:text-8xl font-black text-[#1A1A1A] leading-none mb-4">
                  {edu.year || `${edu.startDate?.split(' ')[1] || edu.startDate} - ${edu.endDate?.split(' ')[1] || edu.endDate || 'Present'}`}
                </span>
                <span className="text-xl font-bold tracking-widest uppercase text-[#555]">{edu.degree}</span>
              </div>
              
              <div className="md:w-2/3 flex flex-col pt-4">
                <h3 className="text-4xl md:text-5xl font-black text-[#1A1A1A] tracking-tighter mb-6">{edu.institution}</h3>
                {edu.description && (
                  <p className="text-xl md:text-3xl text-[#555] font-light leading-tight">
                    {edu.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
