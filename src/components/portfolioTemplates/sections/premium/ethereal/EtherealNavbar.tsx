'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';

export default function EtherealNavbar({ profile }: { profile: CareerProfile }) {
  const { scrollY } = useScroll();
  const width = useTransform(scrollY, [0, 100], ['80%', '60%']);
  const y = useTransform(scrollY, [0, 100], [24, 16]);
  
  const links = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
  ];

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none"
    >
      <motion.div 
        style={{ width, y }}
        className="pointer-events-auto flex justify-between items-center px-8 py-3 bg-[var(--color-surface)]/40 backdrop-blur-3xl border border-[var(--color-text)]/60 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
      >
        <div className="font-serif font-medium text-xl tracking-tight text-[var(--color-text)]">
          {profile.personalInfo.fullName.split(' ')[0]}
        </div>

        <div className="hidden md:flex gap-8">
          {links.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-xs uppercase tracking-[0.2em] font-semibold text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        <a 
          href={`mailto:${profile.personalInfo.email}`} 
          className="px-5 py-2 bg-slate-900 text-[var(--color-text)] text-xs uppercase tracking-widest font-semibold rounded-full hover:bg-[var(--color-primary)] hover:shadow-[0_0_20px_var(--color-primary)] transition-all duration-500"
        >
          Connect
        </a>
      </motion.div>
    </motion.nav>
  );
}