'use client';
import React from 'react';
import { CareerProfile } from '@/db/local-db';

export default function CinematicSkills({ profile }: { profile: CareerProfile }) {
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
      <div className="w-full max-w-7xl mx-auto px-6 mb-12">
        <h2 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter mb-16 text-[var(--color-text)] drop-shadow-2xl opacity-90">Capabilities</h2>
      </div>
      <div className="w-full relative flex overflow-x-hidden group">
        <div className="animate-marquee-skills flex whitespace-nowrap gap-8 px-4">
          {[...profile.skills, ...profile.skills, ...profile.skills, ...profile.skills].map((skill, i) => (
            <div key={i} className="text-5xl md:text-8xl font-black uppercase tracking-tighter opacity-20 hover:opacity-100 hover:text-[var(--color-primary)] transition-all duration-300 cursor-default">
              {skill.name} <span className="text-[var(--color-primary)] mx-4">•</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}