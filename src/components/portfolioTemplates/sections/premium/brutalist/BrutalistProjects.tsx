'use client';
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';
import { ExternalLink, ArrowRight } from 'lucide-react';

export default function BrutalistProjects({ profile }: { profile: CareerProfile }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  
  const projects = profile.projects || [];
  if (projects.length === 0) return null;

  return (
    <section id="projects" ref={ref} className="relative w-full bg-[#dfdfdf] text-[#050505] overflow-hidden py-32 border-b-[10px] border-[#050505]">
      {/* Explicitly load Space Grotesk for brutalist vibe */}
      <style dangerouslySetInnerHTML={{__html: `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;900&display=swap');`}} />
      
      <div className="w-full px-4 md:px-12" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        <h2 className="text-[12vw] font-black uppercase tracking-tighter leading-[0.8] mb-20 border-b-[10px] border-[#050505] pb-8">
          Selected<br/>Works
        </h2>
        
        <div className="flex flex-col border-t-[10px] border-[#050505]">
          {projects.map((proj, i) => (
            <div 
              key={i}
              className="group relative flex flex-col md:flex-row justify-between items-start md:items-center py-12 md:py-20 border-b-[5px] md:border-b-[10px] border-[#050505] hover:bg-[#050505] hover:text-[#dfdfdf] transition-colors duration-300 cursor-pointer px-4"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex-1 z-10">
                <span className="text-xl md:text-3xl font-bold tracking-widest uppercase opacity-50 block mb-4">
                  0{i + 1}
                </span>
                <h3 className="text-5xl md:text-[8vw] font-black uppercase leading-[0.85] tracking-tighter mb-6 group-hover:text-[var(--color-primary)] transition-colors duration-300">
                  {proj.title || proj.name}
                </h3>
                <div className="flex flex-wrap gap-3 mt-8">
                  {(proj.technologies || proj.tools || []).map((tech, tIdx) => (
                    <span key={tIdx} className="border-[3px] border-current px-4 py-1 text-sm md:text-xl font-bold uppercase bg-transparent group-hover:bg-[var(--color-primary)] group-hover:text-[#050505] group-hover:border-[var(--color-primary)] transition-all duration-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="w-full md:w-1/3 mt-12 md:mt-0 z-10 flex flex-col items-start md:items-end text-left md:text-right">
                <p className="text-xl md:text-2xl font-medium leading-tight mb-12 max-w-lg">
                  {proj.description}
                </p>
                <div className="flex gap-6">
                  {proj.liveUrl && (
                    <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-2xl font-black uppercase hover:text-[var(--color-primary)] hover:underline decoration-[4px] underline-offset-8 transition-all">
                      Live <ExternalLink size={28} strokeWidth={3} />
                    </a>
                  )}
                  {proj.githubUrl && (
                    <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-2xl font-black uppercase hover:text-[var(--color-primary)] hover:underline decoration-[4px] underline-offset-8 transition-all">
                      Code <ArrowRight size={28} strokeWidth={3} />
                    </a>
                  )}
                </div>
              </div>

              {/* Hover Reveal Image */}
              <AnimatePresence>
                {hoveredIdx === i && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: Math.random() * 10 - 5 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[var(--color-primary)] border-[10px] border-[#050505] pointer-events-none z-0 hidden lg:flex items-center justify-center overflow-hidden mix-blend-difference"
                  >
                    <span className="text-[12rem] font-black text-[#050505] opacity-20 transform -rotate-45 tracking-tighter uppercase whitespace-nowrap">
                      {proj.title}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}