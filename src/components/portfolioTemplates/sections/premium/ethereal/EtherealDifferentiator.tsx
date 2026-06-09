'use client';
import React from 'react';
import { CareerProfile } from '@/db/local-db';

export default function EtherealDifferentiator({ profile }: { profile: CareerProfile }) {
  if (!profile.achievements || profile.achievements.length === 0) return null;
  return (
    <section className="relative min-h-screen py-32 flex flex-col justify-center bg-[var(--color-background)] text-[var(--color-text)]">
      <div className="w-full max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-5xl md:text-7xl font-serif font-light tracking-tight mb-16 text-[var(--color-text)]">Impact</h2>
        <div className="max-w-4xl mx-auto">
          {profile.achievements.map((ach, i) => (
            <div key={i} className="mb-12">
              <h3 className="text-3xl font-serif text-[var(--color-text)] mb-2">{ach.title}</h3>
              <p className="text-[var(--color-muted)] text-lg leading-relaxed font-light">{ach.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}