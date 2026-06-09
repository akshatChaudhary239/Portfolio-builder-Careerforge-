'use client';
import React from 'react';
import { CareerProfile } from '@/db/local-db';

export default function BrutalistDifferentiator({ profile }: { profile: CareerProfile }) {
  if (!profile.achievements || profile.achievements.length === 0) return null;
  return (
    <section className="relative min-h-screen py-32 flex flex-col justify-center bg-[var(--color-surface)] text-[var(--color-text)] border-b-[10px] border-[var(--color-text)]">
      <div className="w-full max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-16 text-[var(--color-text)]">Impact</h2>
        <div className="max-w-4xl mx-auto">
          {profile.achievements.map((ach, i) => (
            <div key={i} className="mb-12">
              <h3 className="text-4xl font-black uppercase mb-2">{ach.title}</h3>
              <p className="text-[var(--color-text)] text-xl font-medium leading-relaxed">{ach.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}