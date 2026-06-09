'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';
import { Menu, X } from 'lucide-react';

export default function ModernNavbar({ profile }: { profile: CareerProfile }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = ['About', 'Skills', 'Experience', 'Projects'];

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0A0D14]/80 backdrop-blur-xl border-b border-[var(--color-text)]/10 py-4 shadow-lg' : 'bg-transparent py-6'}`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tighter text-[var(--color-text)]">
            {profile.personalInfo.fullName.split(' ')[0]}<span className="text-indigo-500">.dev</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] hover:text-indigo-400 transition-colors">
                {link}
              </a>
            ))}
            <a href="#contact" className="px-5 py-2 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors text-sm font-medium">
              Contact
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
            className="fixed top-[72px] left-0 right-0 bg-[#0A0D14]/95 backdrop-blur-xl border-b border-[var(--color-text)]/10 z-40 md:hidden overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-4">
              {links.map((link) => (
                <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-[var(--color-muted)] hover:text-indigo-400 transition-colors">
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
