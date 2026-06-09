'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';
import { getSectionMetadata } from '@/utils/professionMap';

export default function CreativeCertifications({ profile }: { profile: CareerProfile }) {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  if (!profile.certifications || profile.certifications.length === 0) return null;

  const { title } = getSectionMetadata(profile.professionCategory, 'certifications');

  return (
    <section id="certifications" ref={containerRef} className="w-full relative bg-[#1A1A1A] py-32 px-6 lg:px-12 text-[#EFEFEF] min-h-[80vh] overflow-hidden">
      
      {/* Massive Background Typography */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-none opacity-[0.03]">
        <h2 className="text-[20vw] font-black leading-none text-center uppercase whitespace-nowrap">{title}</h2>
      </div>

      <div className="max-w-[1400px] mx-auto w-full relative z-10 flex flex-col items-center">
        
        <motion.div style={{ y }} className="mb-32 flex flex-col items-center text-center">
          <h2 className="text-xl md:text-3xl font-bold tracking-[0.3em] uppercase text-[#EFEFEF] mb-4">
            {title}
          </h2>
          <div className="w-px h-24 bg-[#EFEFEF]" />
        </motion.div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {profile.certifications.map((cert: any, idx: number) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
              whileHover={{ y: -20 }}
              className="group flex flex-col items-center text-center p-8 lg:p-12 border border-[#333] hover:border-[#EFEFEF] transition-all duration-500 rounded-[3rem] bg-[#222]"
            >
              <span className="text-7xl font-black text-[#555] group-hover:text-[#EFEFEF] transition-colors duration-500 mb-8 leading-none">
                0{idx + 1}
              </span>
              
              <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-[#EFEFEF] mb-4">{cert.name}</h3>
              <p className="text-xl text-[#888] font-medium tracking-wide uppercase mb-8">{cert.issuer}</p>
              
              <div className="mt-auto flex justify-between items-center w-full pt-8 border-t border-[#333]">
                <span className="text-lg font-bold text-[#555] group-hover:text-[#EFEFEF] transition-colors duration-500">{cert.year}</span>
                {cert.link && (
                  <a href={cert.link} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-[#555] flex items-center justify-center text-[#EFEFEF] hover:bg-[#EFEFEF] hover:text-[#1A1A1A] transition-all duration-300">
                    ↗
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
