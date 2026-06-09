import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { BaseSectionProps } from '@/components/portfolio/types';

export default function NavbarGlass({ profile, portfolio }: BaseSectionProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const defaultOrder = ['hero', 'about', 'experience', 'projects', 'skills', 'certifications', 'contact'];
  const activeOrder = (portfolio.sectionOrder?.length ? portfolio.sectionOrder : defaultOrder)
    .filter((key: string) => (portfolio.sectionToggles as Record<string, boolean>)[key] !== false);

  const navItems = activeOrder
    .filter((k: string) => k !== 'hero')
    .map((k: string) => ({ label: k.charAt(0).toUpperCase() + k.slice(1), href: `#${k}` }));

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className={`
          flex items-center justify-between px-6 py-4 rounded-full
          border border-white/10 shadow-2xl
          backdrop-blur-xl bg-[var(--color-surface)]/60
          transition-all duration-500
          ${scrolled ? 'shadow-[0_8px_32px_rgba(0,0,0,0.12)] border-white/20' : 'shadow-[0_8px_32px_rgba(0,0,0,0.05)]'}
        `}>
          
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform duration-300">
              {profile.personalInfo?.fullName?.charAt(0) || 'P'}
            </div>
            <span className="font-extrabold tracking-tight text-[var(--color-text)] hidden md:block">
              {profile.personalInfo?.fullName}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1 bg-[var(--color-background)]/50 p-1.5 rounded-full border border-white/5">
            {navItems.map((item: any) => (
              <a 
                key={item.href} 
                href={item.href} 
                className="px-5 py-2 text-xs font-bold text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] rounded-full transition-all duration-300"
              >
                {item.label}
              </a>
            ))}
          </div>

          <a 
            href={`mailto:${profile.personalInfo?.email}`} 
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-[var(--color-background)] bg-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 shadow-[0_4px_14px_rgba(var(--color-primary-rgb),0.3)] hover:shadow-[0_6px_20px_rgba(var(--color-primary-rgb),0.5)] hover:-translate-y-0.5"
          >
            <Mail size={14} /> 
            <span className="hidden sm:block">Let's Talk</span>
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
