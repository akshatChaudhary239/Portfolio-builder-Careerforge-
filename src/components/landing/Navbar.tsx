'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--color-v2-bg)]/80 backdrop-blur-md border-b border-[var(--color-v2-border)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 relative overflow-hidden rounded-xl bg-white shadow-sm border border-[var(--color-v2-border)] group-hover:shadow-md transition-shadow shrink-0">
            <Image src="/images/getprospectra_logo.png" alt="GetProspectra Logo" fill className="object-cover" />
          </div>
          <span className="hidden min-[400px]:block font-serif font-bold text-base sm:text-xl tracking-tight text-[var(--color-v2-text-primary)] whitespace-nowrap">
            GetProspectra
          </span>
        </Link>

        {/* Center Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          {['How it Works', 'Features', 'Portfolio Showcase', 'Pricing', 'FAQ'].map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm font-medium text-[var(--color-v2-text-secondary)] hover:text-[var(--color-v2-primary)] transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3 sm:gap-6">
          <Link 
            href="/login" 
            className="hidden sm:block text-sm font-semibold text-[var(--color-v2-text-primary)] hover:text-[var(--color-v2-primary)] transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/register"
            className="px-3.5 py-2 sm:px-6 sm:py-2.5 rounded-lg bg-[var(--color-v2-primary)] text-white text-xs sm:text-sm font-bold shadow-[0_4px_14px_0_rgba(109,93,246,0.39)] hover:shadow-[0_6px_20px_rgba(109,93,246,0.23)] hover:bg-[var(--color-v2-accent)] transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
          >
            Get Started Free
          </Link>
        </div>

      </div>
    </header>
  );
}
