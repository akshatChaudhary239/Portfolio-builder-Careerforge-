'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';

export default function BrutalistCertifications({ profile }: { profile: CareerProfile }) {
  if (!profile.certifications || profile.certifications.length === 0) return null;
  return (
    <section className="relative min-h-screen py-32 flex flex-col justify-center bg-[var(--color-surface)] text-[var(--color-text)] border-b-[10px] border-[var(--color-text)]">
      <div className="w-full max-w-7xl mx-auto px-6">
        <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-16 text-[var(--color-text)]">Certifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {profile.certifications.map((cert, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }} className="bg-[var(--color-surface)] border-[4px] border-[var(--color-text)] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[8px] hover:translate-y-[8px] transition-all duration-200">
              <h3 className="text-2xl font-bold mb-2">{cert.title}</h3>
              <span className="text-base font-bold bg-black text-[var(--color-text)] px-2 py-1 inline-block uppercase tracking-widest mb-4">{cert.issuer}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}