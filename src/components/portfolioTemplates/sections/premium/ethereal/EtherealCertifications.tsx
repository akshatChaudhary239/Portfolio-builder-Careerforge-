'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';

export default function EtherealCertifications({ profile }: { profile: CareerProfile }) {
  if (!profile.certifications || profile.certifications.length === 0) return null;
  return (
    <section className="relative min-h-screen py-32 flex flex-col justify-center bg-[var(--color-background)] text-[var(--color-text)]">
      <div className="w-full max-w-7xl mx-auto px-6">
        <h2 className="text-5xl md:text-7xl font-serif font-light tracking-tight mb-16 text-[var(--color-text)]">Certifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {profile.certifications.map((cert, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }} className="bg-[var(--color-surface)]/40 backdrop-blur-2xl border border-[var(--color-text)] p-8 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] transition-all duration-700">
              <h3 className="text-2xl font-bold mb-2">{cert.title}</h3>
              <span className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-[0.2em] mb-4 block">{cert.issuer}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}