'use client';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';
import { ExternalLink, Code } from 'lucide-react';

export default function EtherealProjects({ profile }: { profile: CareerProfile }) {
  const ref = useRef<HTMLDivElement>(null);
  
  if (!profile.projects || profile.projects.length === 0) return null;

  return (
    <section id="projects" ref={ref} className="relative min-h-[150vh] py-40 flex flex-col items-center bg-[#fafafa] text-[#222222] overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;300;400;500;700&display=swap');`}} />

      {/* Floating orbs for ethereal background */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 w-[400px] h-[400px] bg-pink-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-4000 pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-6 relative z-10" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-center mb-24"
        >
          <h2 className="text-5xl md:text-8xl font-light tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500">
            Selected Work
          </h2>
          <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">
            A glimpse into the digital spaces I've helped shape and create.
          </p>
        </motion.div>

        <div className="columns-1 md:columns-2 gap-8 space-y-8">
          {profile.projects.map((proj, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.2, delay: (i % 2) * 0.2, type: "spring", bounce: 0.2 }}
              className="break-inside-avoid relative group"
            >
              <div className="absolute inset-0 bg-white/40 rounded-[2.5rem] transform group-hover:scale-105 transition-transform duration-700 pointer-events-none" />
              
              <div className="relative bg-white/20 backdrop-blur-3xl border border-white/50 p-8 md:p-12 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-700 flex flex-col h-full transform group-hover:-translate-y-2">
                <div className="flex-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-[0.2em] mb-4 block">
                    {(proj.technologies || proj.tools || []).slice(0, 3).join(' • ')}
                  </span>
                  <h3 className="text-3xl font-medium text-gray-900 mb-6">{proj.title || proj.name}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed font-light">{proj.description}</p>
                </div>
                
                <div className="flex gap-6 mt-12 pt-8 border-t border-gray-200/50">
                  {proj.liveUrl && (
                    <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors">
                      <ExternalLink size={16} /> Live
                    </a>
                  )}
                  {proj.githubUrl && (
                    <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors">
                      <Code size={16} /> Source
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}