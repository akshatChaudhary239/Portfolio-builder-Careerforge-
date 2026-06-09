'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';

export default function CinematicAbout({ profile }: { profile: CareerProfile }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 1, 0]);

  const words = profile.summary.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.5,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(8px)",
    },
  };

  return (
    <section id="about" className="relative h-[150vh] flex flex-col justify-center bg-[#050505] text-[#f5f5f5] overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap');`}} />

      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_60%)] pointer-events-none"
      />

      <div className="w-full max-w-5xl mx-auto px-6 relative z-10 flex flex-col items-center text-center" ref={ref} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 2, ease: "easeOut" }}
          className="w-[1px] h-32 bg-gradient-to-b from-transparent via-white/50 to-transparent mb-12"
        />
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          className="text-sm tracking-[0.8em] uppercase text-white/40 mb-16"
        >
          Prologue
        </motion.h2>
        
        <motion.div 
          variants={container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-wrap justify-center gap-x-4 gap-y-4 md:gap-y-6"
        >
          {words.map((word, index) => (
            <motion.span 
              variants={child} 
              key={index} 
              className="text-4xl md:text-6xl lg:text-[5rem] leading-[1.2] font-medium italic text-white/90"
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}