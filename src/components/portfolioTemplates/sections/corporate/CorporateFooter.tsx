'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';
import { LinkedinIcon, GithubIcon } from '../shared/Icons';

export default function CorporateFooter({ profile }: { profile: CareerProfile }) {
  return (
    <footer id="contact" className="w-full relative bg-[#FAFAFA] text-[#111111] py-32 border-b-[20px] border-[#111111]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-32">
          <div className="lg:col-span-8 border-t border-[#111111] pt-8">
            <h2 className="text-5xl md:text-7xl lg:text-[8rem] font-serif leading-[0.9] tracking-tight mb-12">
              Let&apos;s discuss <br/>opportunities.
            </h2>
            <a 
              href={`mailto:${profile.personalInfo.email}`} 
              className="group inline-flex items-center gap-6 pb-2 border-b-2 border-[#111111] hover:border-blue-600 transition-colors"
            >
              <span className="text-2xl md:text-4xl font-light group-hover:text-[var(--color-primary)] transition-colors">{profile.personalInfo.email}</span>
            </a>
          </div>
          
          <div className="lg:col-span-4 border-t border-[#CCCCCC] pt-8 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-8">Social Connect</h3>
              <div className="flex gap-4">
                {profile.personalInfo.linkedin && (
                  <a href={profile.personalInfo.linkedin} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-[#CCCCCC] flex items-center justify-center hover:bg-[#111111] hover:text-[#FAFAFA] hover:border-[#111111] transition-all">
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                )}
                {profile.personalInfo.github && (
                  <a href={profile.personalInfo.github} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-[#CCCCCC] flex items-center justify-center hover:bg-[#111111] hover:text-[#FAFAFA] hover:border-[#111111] transition-all">
                    <GithubIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center border-t border-[#EAEAEA] pt-8">
          <p className="text-[#777] text-sm uppercase tracking-widest font-bold">
            &copy; {new Date().getFullYear()} {profile.personalInfo.fullName}
          </p>
          <p className="text-[#777] text-sm uppercase tracking-widest font-bold">
            All Rights Reserved
          </p>
        </div>

      </div>
    </footer>
  );
}
