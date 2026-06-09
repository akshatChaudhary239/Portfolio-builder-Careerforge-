'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';

export default function CinematicCertifications({ profile }: { profile: CareerProfile }) {
  if (!profile.certifications || profile.certifications.length === 0) return null;
  return (
    <section className="relative min-h-screen py-32 flex flex-col justify-center bg-[var(--color-background)] text-[var(--color-text)]">
      <div className="w-full max-w-7xl mx-auto px-6">
        <h2 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter mb-16 text-[var(--color-text)] drop-shadow-2xl opacity-90">Certifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {profile.certifications.map((cert, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }} className="bg-black/50 backdrop-blur-xl border border-[var(--color-text)]/5 p-8 rounded-3xl hover:border-[var(--color-primary)] transition-all duration-500">
              <h3 className="text-2xl font-bold mb-2">{cert.title}</h3>
              <span className="text-sm text-[var(--color-primary)] uppercase tracking-widest mb-4 block">{cert.issuer}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}