'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, XCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function BeforeAfterSection() {
  return (
    <section className="w-full bg-[var(--color-v2-dark)] py-32 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--color-v2-primary)]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
        
        {/* Left Typography */}
        <div className="lg:col-span-4 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-[var(--color-v2-accent)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-v2-accent)] animate-pulse" />
            Real Transformation
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-black text-white leading-[1.1] tracking-tight">
            From Ordinary to Outstanding
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            We don't just fill templates. We position you as a problem solver who delivers impact.
          </p>
          <Link 
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-v2-primary)] text-white font-bold hover:bg-[var(--color-v2-accent)] transition-colors shadow-lg shadow-[var(--color-v2-primary)]/20"
          >
            See More Transformations <ArrowRight size={18} />
          </Link>
        </div>

        {/* Right Cards */}
        <div className="lg:col-span-8 flex flex-col md:flex-row items-center gap-4 md:gap-0 relative">
          
          {/* Before Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-1/2 bg-[#1A1D24] border border-red-900/30 rounded-2xl p-8 relative z-10 opacity-70 filter grayscale-[50%]"
          >
            <div className="absolute -top-3 left-8 px-3 py-1 bg-red-950 border border-red-900 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
              Before
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Junior Developer</h3>
            <p className="text-sm text-gray-500 mb-6">2 Years Experience</p>
            
            <ul className="space-y-4">
              {['Responsible for coding in frontend.', 'Worked on website for the company.', 'Helped team in fixing issues.'].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-400">{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-8 pt-4 border-t border-white/5 flex items-start gap-2 text-red-400/80">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <p className="text-xs">Generic, low impact, and hard to stand out.</p>
            </div>
          </motion.div>

          {/* Center Arrow */}
          <div className="w-12 h-12 rounded-full bg-[var(--color-v2-primary)] flex items-center justify-center text-white shrink-0 z-20 shadow-[0_0_30px_rgba(109,93,246,0.5)] md:-mx-6 rotate-90 md:rotate-0">
            <ArrowRight size={24} />
          </div>

          {/* After Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full md:w-1/2 bg-[#1A1D24] border border-[var(--color-v2-success)]/30 rounded-2xl p-8 relative z-30 shadow-2xl shadow-[var(--color-v2-success)]/10"
          >
            <div className="absolute -top-3 left-8 px-3 py-1 bg-[#064E3B] border border-[#059669] text-[var(--color-v2-success)] text-[10px] font-bold uppercase tracking-widest rounded-full">
              After
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Frontend Developer</h3>
            <p className="text-sm text-gray-400 mb-6">2 Years Experience</p>
            
            <ul className="space-y-4">
              {[
                'Developed responsive dashboard using Next.js, improving load speed by 37%.', 
                'Built reusable UI components library that reduced development time by 20%.', 
                'Collaborated with backend team to integrate APIs and improve system performance.'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-[var(--color-v2-success)] shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-200">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-4 border-t border-white/5 flex items-start gap-2 text-[var(--color-v2-success)]">
              <SparklesIcon />
              <p className="text-xs font-medium">Impact-driven, results-focused, and recruiter-ready.</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function SparklesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  );
}
