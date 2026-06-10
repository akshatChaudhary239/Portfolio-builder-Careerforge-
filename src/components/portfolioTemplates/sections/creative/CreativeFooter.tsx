import React from 'react';
import { motion } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';
import { LinkedinIcon, GithubIcon } from '../shared/Icons';
import Magnetic from '@/components/shared/Magnetic';

export default function CreativeFooter({ profile }: { profile: CareerProfile }) {
  return (
    <footer id="contact" className="w-full relative bg-[#0C1016] text-[#F0F6F8] pt-32 pb-12 overflow-hidden flex flex-col items-center">
      
      {/* Massive CTA */}
      <div className="w-full px-6 lg:px-12 mb-20 flex flex-col items-center">
        <h2 className="text-[12vw] font-black uppercase tracking-tighter leading-[0.8] text-center w-full text-transparent bg-clip-text bg-gradient-to-b from-white to-[#A0A8B0]">
          Let&apos;s Talk
        </h2>
        
        <div className="mt-12 flex justify-center w-full">
          <Magnetic strength={0.4}>
            <a 
              href={`mailto:${profile.personalInfo.email}`} 
              className="relative flex items-center justify-center w-40 h-40 md:w-56 md:h-56 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-primary)] text-[var(--color-primary-contrast)] font-bold text-xl md:text-3xl hover:scale-105 transition-transform duration-500 shadow-[0_0_50px_rgba(217,70,239,0.3)] z-20 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              <span className="z-10 group-hover:-translate-y-1 transition-transform">Email Me</span>
            </a>
          </Magnetic>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-[var(--color-text)]/10 mt-12">
        <div className="flex gap-6">
          {profile.personalInfo.linkedin && (
            <Magnetic strength={0.2}>
              <a href={profile.personalInfo.linkedin} target="_blank" rel="noreferrer" className="w-16 h-16 rounded-full bg-[#1E242C] flex items-center justify-center hover:bg-white hover:text-[var(--color-text)] transition-colors duration-300">
                <LinkedinIcon className="w-6 h-6" />
              </a>
            </Magnetic>
          )}
          {profile.personalInfo.github && (
            <Magnetic strength={0.2}>
              <a href={profile.personalInfo.github} target="_blank" rel="noreferrer" className="w-16 h-16 rounded-full bg-[#1E242C] flex items-center justify-center hover:bg-white hover:text-[var(--color-text)] transition-colors duration-300">
                <GithubIcon className="w-6 h-6" />
              </a>
            </Magnetic>
          )}
        </div>
        
        <div className="text-[#A0A8B0] font-medium tracking-wide uppercase text-sm flex gap-8">
          <p>&copy; {new Date().getFullYear()} {profile.personalInfo.fullName}</p>
          <p>All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}
