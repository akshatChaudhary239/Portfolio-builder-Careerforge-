'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { CareerProfile } from '@/db/local-db';

const fadeInUp: any = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: "easeOut" }
};

export default function ModernDifferentiator({ profile }: { profile: CareerProfile }) {
  const differentiator = profile.professionalBlueprint?.primaryStrength;
  if (!differentiator) return null;

  return (
    <section className="scroll-mt-24 w-full relative">
      <motion.div {...fadeInUp} className="relative py-16 px-8 md:px-16 bg-gradient-to-br from-indigo-900/20 to-[#0A0D14] border border-indigo-500/10 rounded-3xl overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
          <Zap size={200} />
        </div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-indigo-400 font-mono text-sm mb-6 uppercase tracking-wider">
            <Zap size={16} />
            <span>Core Differentiator</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black text-[var(--color-text)] leading-tight mb-6">
            &quot;{differentiator}&quot;
          </h2>
          
          <p className="text-lg text-[var(--color-muted)] font-light leading-relaxed">
            This core strength allows me to approach problems differently and consistently deliver outsized impact across all my professional endeavors.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
