'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';

export default function CinematicNavbar({ profile }: { profile: CareerProfile }) {
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(scrollY, [0, 100], ['rgba(5, 5, 5, 0)', 'rgba(5, 5, 5, 0.6)']);
  const backdropFilter = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(20px)']);
  const borderColor = useTransform(scrollY, [0, 100], ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.05)']);

  const links = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Work', href: '#projects' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 w-full z-50 px-6 py-6 transition-all duration-300 pointer-events-none flex justify-center"
    >
      <motion.div 
        style={{ backgroundColor, backdropFilter, borderColor }}
        className="pointer-events-auto flex items-center justify-between w-full max-w-7xl px-8 py-4 rounded-full border border-transparent shadow-[0_0_40px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[var(--color-primary)] animate-pulse shadow-[0_0_15px_var(--color-primary)]" />
          <span className="font-bold text-xl tracking-tighter text-[var(--color-text)] uppercase drop-shadow-md">
            {profile.personalInfo.fullName.split(' ')[0]}
          </span>
        </div>

        <div className="hidden md:flex gap-10">
          {links.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="group relative text-xs uppercase tracking-[0.2em] font-semibold text-gray-300 hover:text-[var(--color-text)] transition-colors"
            >
              {link.name}
              <span className="absolute -bottom-2 left-1/2 w-0 h-[1px] bg-[var(--color-primary)] transition-all duration-300 group-hover:w-1/2" />
              <span className="absolute -bottom-2 right-1/2 w-0 h-[1px] bg-[var(--color-primary)] transition-all duration-300 group-hover:w-1/2" />
            </a>
          ))}
        </div>

        <a 
          href={`mailto:${profile.personalInfo.email}`} 
          className="relative px-6 py-2 overflow-hidden rounded-full group"
        >
          <span className="absolute inset-0 w-full h-full bg-[var(--color-primary)] opacity-80 group-hover:opacity-100 transition-opacity" />
          <span className="relative text-xs uppercase tracking-widest font-bold text-[var(--color-text)] z-10">Let's Talk</span>
        </a>
      </motion.div>
    </motion.nav>
  );
}