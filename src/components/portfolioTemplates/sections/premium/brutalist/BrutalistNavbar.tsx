'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';

export default function BrutalistNavbar({ profile }: { profile: CareerProfile }) {
  const links = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Work', href: '#projects' },
  ];

  return (
    <motion.nav 
      initial={{ y: "-100%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "anticipate" }}
      className="fixed top-0 left-0 w-full z-50 bg-[var(--color-primary)] border-b-[8px] border-[var(--color-text)] flex flex-col md:flex-row justify-between items-center px-4 md:px-10 py-4 shadow-[0_8px_0px_0px_rgba(0,0,0,1)]"
    >
      <div className="font-black text-3xl md:text-5xl tracking-tighter uppercase text-[var(--color-text)] mb-4 md:mb-0">
        {profile.personalInfo.fullName.split(' ')[0]}<span className="text-[var(--color-text)] mix-blend-difference">.</span>
      </div>

      <div className="flex gap-4 md:gap-8 items-center">
        {links.map((link) => (
          <a 
            key={link.name} 
            href={link.href} 
            className="text-[var(--color-text)] font-bold uppercase tracking-widest text-sm md:text-lg hover:bg-black hover:text-[var(--color-primary)] px-3 py-1 transition-colors border-2 border-transparent hover:border-[var(--color-text)]"
          >
            {link.name}
          </a>
        ))}
        
        <a 
          href={`mailto:${profile.personalInfo.email}`} 
          className="ml-4 px-6 py-2 bg-black text-[var(--color-primary)] font-black uppercase tracking-widest text-lg border-4 border-[var(--color-text)] hover:bg-transparent hover:text-[var(--color-text)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          Contact
        </a>
      </div>
    </motion.nav>
  );
}