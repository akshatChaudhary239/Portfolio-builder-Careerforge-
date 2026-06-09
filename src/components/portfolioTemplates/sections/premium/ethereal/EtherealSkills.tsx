'use client';
import React from 'react';
import { CareerProfile } from '@/db/local-db';

export default function EtherealSkills({ profile }: { profile: CareerProfile }) {
  if (!profile.skills || profile.skills.length === 0) return null;

  return (
    <section className="relative min-h-screen py-32 flex flex-col justify-center bg-[var(--color-background)] text-[var(--color-text)] overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee-skills {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-skills {
          animation: marquee-skills 50s linear infinite;
        }
        .group:hover .animate-marquee-skills {
          animation-play-state: paused;
        }
      `}} />
      <div className="w-full max-w-7xl mx-auto px-6 mb-16 text-center">
        <h2 className="text-4xl md:text-6xl font-serif font-light text-[var(--color-text)] mb-4">Core Competencies</h2>
        <div className="h-[1px] w-24 bg-[var(--color-muted)] mx-auto opacity-50" />
      </div>
      <div className="w-full relative flex overflow-x-hidden group">
        <div className="animate-marquee-skills flex whitespace-nowrap gap-12 px-4 py-8">
          {[...profile.skills, ...profile.skills, ...profile.skills, ...profile.skills].map((skill, i) => (
            <div key={i} className="text-4xl md:text-6xl font-serif text-[var(--color-muted)] opacity-40 hover:opacity-100 hover:text-[var(--color-primary)] transition-all duration-500 cursor-default">
              {skill.name} <span className="text-slate-300 mx-6 opacity-30">•</span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--color-background)] to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[var(--color-background)] to-transparent pointer-events-none z-10" />
    </section>
  );
}