'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';
import { LinkedinIcon, GithubIcon } from '../shared/Icons';

export default function ModernFooter({ profile }: { profile: CareerProfile }) {
  return (
    <footer id="contact" className="w-full relative bg-transparent text-[var(--color-text)] pt-32 pb-12 overflow-hidden flex flex-col items-center">
      
      {/* Background Orbs */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-full max-w-4xl h-[400px] bg-[var(--color-primary)]/20 blur-[150px] rounded-[100%]" />

      <div className="w-full px-6 lg:px-12 mb-32 flex flex-col items-center relative z-10">
        <h2 className="text-[10vw] font-black tracking-tighter leading-[0.8] text-center w-full text-[var(--color-text)] mb-12">
          Let&apos;s build <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]">the future.</span>
        </h2>
        
        <div className="flex justify-center w-full mt-12">
          <a 
            href={`mailto:${profile.personalInfo.email}`} 
            className="group relative flex items-center justify-center w-40 h-40 md:w-56 md:h-56 rounded-full bg-white text-[var(--color-text)] font-bold text-xl md:text-3xl hover:scale-105 transition-transform duration-500 shadow-[0_0_50px_rgba(255,255,255,0.2)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="z-10 group-hover:-translate-y-1 transition-transform flex items-center gap-2">
              Email Me <span className="text-[var(--color-primary)] group-hover:rotate-45 transition-transform">↗</span>
            </span>
          </a>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-[var(--color-text)]/10 relative z-10">
        <div className="flex gap-6">
          {profile.personalInfo.linkedin && (
            <a href={profile.personalInfo.linkedin} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full bg-[var(--color-surface)] border border-[var(--color-text)]/10 flex items-center justify-center hover:bg-white hover:text-[var(--color-text)] transition-colors duration-300">
              <LinkedinIcon className="w-5 h-5" />
            </a>
          )}
          {profile.personalInfo.github && (
            <a href={profile.personalInfo.github} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full bg-[var(--color-surface)] border border-[var(--color-text)]/10 flex items-center justify-center hover:bg-white hover:text-[var(--color-text)] transition-colors duration-300">
              <GithubIcon className="w-5 h-5" />
            </a>
          )}
        </div>
        
        <div className="text-[var(--color-muted)] font-medium tracking-wide text-sm flex gap-8">
          <p>&copy; {new Date().getFullYear()} {profile.personalInfo.fullName}</p>
        </div>
      </div>
    </footer>
  );
}
