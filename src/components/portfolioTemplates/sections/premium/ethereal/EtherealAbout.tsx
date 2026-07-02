'use client';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';

export default function EtherealAbout({ profile }: { profile: CareerProfile }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  
  const filter = useTransform(scrollYProgress, [0, 1], ["blur(20px)", "blur(0px)"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);

  return (
    <section id="about" className="relative min-h-[120vh] py-32 flex flex-col justify-center bg-[#fafafa] text-[#222222] overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;300;400;500;700&display=swap');`}} />

      {/* Extreme Glass Blur & Nodes */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-blue-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-40" 
        />
        <motion.div 
          animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-40" 
        />
      </div>

      {/* Glassmorphic Container for the Text */}
      <div className="w-full max-w-5xl mx-auto px-6 relative z-10" ref={ref} style={{ fontFamily: "'Outfit', sans-serif" }}>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 2, ease: "easeOut" }}
          className="bg-white/30 backdrop-blur-3xl border border-white/40 p-12 md:p-20 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] text-center relative overflow-hidden"
        >
          {/* Decorative glowing lines inside card */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            className="flex items-center justify-center gap-6 mb-12"
          >
            <div className="h-[1px] w-12 bg-gray-300" />
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-[0.4em]">
              Introduction
            </h2>
            <div className="h-[1px] w-12 bg-gray-300" />
          </motion.div>
          
          <motion.div style={{ filter, opacity, y }} className="max-w-4xl mx-auto space-y-6">
            {((profile as any).aboutMe || profile.summary || '').split('\n\n').map((para: string, pIdx: number) => (
              <p key={pIdx} className="text-xl md:text-2xl lg:text-3xl leading-[1.6] font-light text-gray-800 tracking-wide">
                {para}
              </p>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}