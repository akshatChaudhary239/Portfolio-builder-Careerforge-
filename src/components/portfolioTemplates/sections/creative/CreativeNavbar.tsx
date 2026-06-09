'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';
import { Menu, X, Sparkles } from 'lucide-react';

export default function CreativeNavbar({ profile }: { profile: CareerProfile }) {
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
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[95%] max-w-5xl rounded-full ${scrolled ? 'bg-[#050505]/60 backdrop-blur-2xl border border-[var(--color-text)]/10 py-3 px-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)]' : 'bg-transparent py-4 px-2'}`}
      >
        <div className="flex items-center justify-between w-full">
          <div className="font-bold tracking-tight text-[var(--color-text)] flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-primary)] flex items-center justify-center">
              <Sparkles size={14} className="text-[var(--color-text)]" />
            </div>
            <span className={scrolled ? 'hidden sm:block' : ''}>{profile.personalInfo.fullName.split(' ')[0]}</span>
          </div>

          <div className="hidden md:flex items-center gap-1 bg-[var(--color-surface)] rounded-full p-1 border border-[var(--color-text)]/10">
            {links.map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} className="px-4 py-1.5 rounded-full text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-white/10 transition-all">
                {link}
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <a href="#contact" className="px-5 py-2 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)] text-[var(--color-text)] font-bold text-sm shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] hover:scale-105 transition-all">
              Say Hi
            </a>
          </div>

          <button className="md:hidden text-[var(--color-text)] w-10 h-10 flex items-center justify-center bg-white/10 rounded-full" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-x-4 top-24 bg-[#111]/90 backdrop-blur-2xl border border-[var(--color-text)]/10 rounded-3xl z-40 md:hidden p-6 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-[var(--color-text)] p-4 rounded-2xl hover:bg-white/10 transition-colors">
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
