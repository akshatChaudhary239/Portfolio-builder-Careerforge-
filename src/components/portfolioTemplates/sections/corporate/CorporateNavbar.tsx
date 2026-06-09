'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';
import { Menu, X } from 'lucide-react';

export default function CorporateNavbar({ profile }: { profile: CareerProfile }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = ['About', 'Experience', 'Projects', 'Credentials'];

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-lg border-b border-slate-200 py-4 shadow-sm' : 'bg-transparent py-6'}`}
      >
        <div className="max-w-5xl mx-auto px-8 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight text-[var(--color-text)]" style={{ fontFamily: 'var(--font-serif, "Merriweather", serif)' }}>
            {profile.personalInfo.fullName}
          </div>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} className="text-sm font-medium text-slate-600 hover:text-[var(--color-primary)] transition-colors">
                {link}
              </a>
            ))}
            <a href="#contact" className="px-5 py-2 rounded bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors text-sm font-medium shadow-md">
              Contact Me
            </a>
          </div>

          <button className="md:hidden text-[var(--color-text)]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[72px] left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 z-40 md:hidden overflow-hidden shadow-lg"
          >
            <div className="p-6 flex flex-col gap-4">
              {links.map((link) => (
                <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-slate-700 hover:text-[var(--color-primary)] transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
