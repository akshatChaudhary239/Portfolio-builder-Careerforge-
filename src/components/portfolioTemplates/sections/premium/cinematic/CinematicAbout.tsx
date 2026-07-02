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

  const aboutText = (profile as any).aboutMe || profile.summary || '';

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    }),
  };

  const child: any = {
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
    <section id="about" className="relative min-h-[150vh] py-32 flex flex-col justify-center bg-[#050505] text-[#f5f5f5] overflow-hidden">
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
        
        <div className="w-full">
          {(profile as any).aboutMeTimeline && (profile as any).aboutMeTimeline.length > 0 ? (
            <div className="relative border-l border-white/10 ml-8 pl-12 space-y-16 max-w-4xl mx-auto text-left">
              {(profile as any).aboutMeTimeline.map((item: any, idx: number) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: idx * 0.15 }}
                  className="relative group"
                >
                  {/* Dot */}
                  <div className="absolute -left-[57px] top-2 w-5 h-5 rounded-full bg-white border-4 border-black transition-transform duration-500 group-hover:scale-125 shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                  
                  <span className="text-xs font-semibold text-white/50 uppercase tracking-[0.2em] block mb-2 font-mono">
                    {item.year}
                  </span>
                  
                  <h3 className="text-2xl md:text-4xl font-bold text-white tracking-tight mb-1">
                    {item.title}
                  </h3>
                  
                  <h4 className="text-base text-white/70 italic mb-4 font-light">
                    {item.subTitle}
                  </h4>
                  
                  <p className="text-lg text-white/60 leading-relaxed font-light">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-12">
              {aboutText.split('\n\n').map((para: string, pIdx: number) => {
                const words = para.split(' ');
                return (
                  <motion.div 
                    key={pIdx}
                    variants={container}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="flex flex-wrap justify-center gap-x-3 gap-y-2 md:gap-y-3"
                  >
                    {words.map((word, index) => (
                      <motion.span 
                        variants={child} 
                        key={index} 
                        className="text-2xl md:text-4xl lg:text-[2.8rem] leading-[1.4] font-medium italic text-white/90"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}