'use client';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';
import { ExternalLink, Code } from 'lucide-react';

export default function CinematicProjects({ profile }: { profile: CareerProfile }) {
  const targetRef = useRef<HTMLDivElement>(null);
  
  if (!profile.projects || profile.projects.length === 0) return null;

  // Horizontal scroll logic
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-[#050505] text-[#f5f5f5]">
      <style dangerouslySetInnerHTML={{__html: `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap');`}} />
      
      <div className="sticky top-0 h-screen overflow-hidden flex items-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        
        {/* Background Ambient Light */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_80%)] pointer-events-none" />

        <motion.div style={{ x }} className="flex gap-16 md:gap-32 px-[10vw] md:px-[20vw] items-center h-full">
          {/* Intro Slide */}
          <div className="min-w-[80vw] md:min-w-[50vw] flex flex-col justify-center">
            <span className="text-[var(--color-primary)] tracking-[0.5em] uppercase text-sm mb-4">Director's Cut</span>
            <h2 className="text-6xl md:text-8xl font-medium italic">Selected <br/> Works</h2>
            <p className="mt-8 text-xl text-gray-400 font-light max-w-md">A curated collection of digital experiences, crafted with precision and intent.</p>
          </div>

          {/* Project Slides */}
          {profile.projects.map((proj, i) => (
            <div key={i} className="min-w-[85vw] md:min-w-[60vw] h-[70vh] flex flex-col justify-between border-l-[1px] border-white/20 pl-8 md:pl-16 relative group">
              <div className="absolute -left-[1px] top-0 w-[1px] h-0 bg-white group-hover:h-full transition-all duration-1000 ease-in-out" />
              
              <div>
                <span className="text-2xl md:text-4xl text-white/30 italic mb-4 block">0{i+1}</span>
                <h3 className="text-5xl md:text-7xl font-medium tracking-tight mb-6">{proj.title || proj.name}</h3>
                <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed max-w-2xl">{proj.description}</p>
              </div>

              <div className="flex flex-col gap-8">
                <div className="flex flex-wrap gap-4">
                  {(proj.technologies || proj.tools || []).map((tech, tIdx) => (
                    <span key={tIdx} className="text-sm md:text-base tracking-widest uppercase border border-white/20 px-4 py-2 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-8">
                  {proj.liveUrl && (
                    <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-lg hover:text-[var(--color-primary)] transition-colors italic">
                      View Premiere <ExternalLink size={18} />
                    </a>
                  )}
                  {proj.githubUrl && (
                    <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-lg hover:text-[var(--color-primary)] transition-colors italic">
                      Behind The Scenes <Code size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Outro Slide */}
          <div className="min-w-[80vw] md:min-w-[50vw] flex flex-col justify-center items-center text-center">
            <h2 className="text-4xl md:text-6xl font-medium italic text-white/50">Fin.</h2>
          </div>
        </motion.div>
      </div>
    </section>
  );
}