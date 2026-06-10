'use client';
import React from 'react';
import { CareerProfile } from '@/db/local-db';

export default function CinematicFooter({ profile }: { profile: CareerProfile }) {
  return (
    <footer className="w-full py-20 px-10 text-center mix-blend-difference border-t border-current/10">
      <h2 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter mb-8">
        Let's Build Together.
      </h2>
      <a href={`mailto:${profile.personalInfo.email}`} className="text-2xl md:text-4xl font-light hover:text-[var(--color-primary)] transition-colors underline decoration-1 underline-offset-8">
        {profile.personalInfo.email}
      </a>
      <div className="mt-16 text-sm uppercase tracking-widest opacity-50 flex justify-center gap-8">
        {profile.personalInfo.linkedin && <a href={profile.personalInfo.linkedin} target="_blank">LinkedIn</a>}
        {profile.personalInfo.github && <a href={profile.personalInfo.github} target="_blank">GitHub</a>}
      </div>
      <p className="mt-12 text-xs opacity-30">
        © {new Date().getFullYear()} {profile.personalInfo.fullName}. Crafted with GetProspectra.
      </p>
    </footer>
  );
}