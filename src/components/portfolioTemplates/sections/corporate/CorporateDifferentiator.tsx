'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { CareerProfile } from '@/db/local-db';

const fadeUp: any = {
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
};

export default function CorporateDifferentiator({ profile }: { profile: CareerProfile }) {
  const differentiator = profile.professionalBlueprint?.primaryStrength;
  if (!differentiator) return null;

  return (
    <section className="w-full bg-blue-900 text-[var(--color-text)] py-20 mt-24">
      <div className="max-w-5xl mx-auto px-8">
        <motion.div {...fadeUp} className="max-w-3xl">
          <div className="flex items-center gap-2 text-[var(--color-secondary)] font-bold tracking-widest uppercase text-sm mb-6">
            <Star size={16} />
            Primary Value Proposition
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold leading-relaxed" style={{ fontFamily: 'var(--font-serif, "Merriweather", serif)' }}>
            &quot;{differentiator}&quot;
          </h2>
          
          <div className="w-24 h-1 bg-[var(--color-primary)] mt-8" />
        </motion.div>
      </div>
    </section>
  );
}
