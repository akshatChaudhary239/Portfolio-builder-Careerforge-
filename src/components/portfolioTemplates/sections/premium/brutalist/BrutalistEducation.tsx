'use client';
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';

export default function BrutalistEducation({ profile }: { profile: CareerProfile }) {
  if (!profile.education || profile.education.length === 0) return null;
  return (
    <section className="relative min-h-screen py-32 flex flex-col justify-center bg-[var(--color-surface)] text-[var(--color-text)] border-b-[10px] border-[var(--color-text)]">
      <div className="w-full max-w-7xl mx-auto px-6">
        <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-16 text-[var(--color-text)]">Education</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {profile.education.map((edu, i) => (
            <motion.div key={i} whileHover={{ scale: 1.02 }} className="bg-[var(--color-surface)] border-[4px] border-[var(--color-text)] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[8px] hover:translate-y-[8px] transition-all duration-200">
              <h3 className="text-4xl font-black uppercase mb-2">{edu.degree} in {edu.specialization}</h3>
              <span className="text-base font-bold bg-black text-[var(--color-text)] px-2 py-1 inline-block uppercase tracking-widest mb-4">{edu.institution}</span>
              <p className="text-sm uppercase tracking-widest opacity-60 mix-blend-difference">{edu.startYear} - {edu.endYear}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}