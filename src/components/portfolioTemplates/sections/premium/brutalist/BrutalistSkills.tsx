'use client';
import React from 'react';
import { CareerProfile } from '@/db/local-db';

export default function BrutalistSkills({ profile }: { profile: CareerProfile }) {
  if (!profile.skills || profile.skills.length === 0) return null;

  return (
    <section className="relative min-h-screen py-32 flex flex-col justify-center bg-[var(--color-surface)] text-[var(--color-text)] border-b-[10px] border-[var(--color-text)] overflow-hidden">
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
      <div className="w-full max-w-7xl mx-auto px-6 mb-12 border-l-[10px] border-[var(--color-text)] pl-6">
        <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-[var(--color-text)]">Capabilities</h2>
      </div>
      <div className="w-full relative flex overflow-x-hidden group bg-[var(--color-primary)] border-y-[10px] border-[var(--color-text)] py-8">
        <div className="animate-marquee-skills flex whitespace-nowrap gap-8 px-4">
          {[...profile.skills, ...profile.skills, ...profile.skills, ...profile.skills].map((skill, i) => (
            <div key={i} className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-[var(--color-text)] hover:text-white hover:scale-110 transition-all duration-300 cursor-default">
              {skill.name} <span className="text-[var(--color-text)] mx-4">•</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}