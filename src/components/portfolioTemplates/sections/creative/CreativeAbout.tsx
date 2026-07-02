import React from 'react';
import { motion } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';

export default function CreativeAbout({ profile }: { profile: CareerProfile }) {
  if (!profile.summary && !(profile as any).aboutMe) return null;

  const aboutText = (profile as any).aboutMe || profile.summary || '';

  return (
    <section id="about" className="w-full relative bg-[#0C1016] py-32 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-4 flex flex-col gap-12 border-t border-white/20 pt-8">
            <h2 className="text-sm font-bold text-[#A0A8B0] uppercase tracking-[0.2em]">The Narrative</h2>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl lg:text-6xl font-light text-[var(--color-text)]">{profile.experience?.length || 0}</span>
                <span className="text-sm font-bold text-[#A0A8B0] uppercase tracking-widest leading-tight">Years<br/>Experience</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-4xl lg:text-6xl font-light text-[var(--color-text)]">{profile.projects?.length || 0}</span>
                <span className="text-sm font-bold text-[#A0A8B0] uppercase tracking-widest leading-tight">Featured<br/>Projects</span>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-8">
            {(profile as any).aboutMeTimeline && (profile as any).aboutMeTimeline.length > 0 ? (
              <div className="relative border-l border-white/10 ml-4 pl-8 space-y-12">
                {(profile as any).aboutMeTimeline.map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="relative group"
                  >
                    {/* Dot */}
                    <div className="absolute -left-[41px] top-2 w-5 h-5 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-primary)] border-4 border-[#0C1016] transition-transform duration-300 group-hover:scale-125" />
                    
                    <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider block mb-1">
                      {item.year}
                    </span>
                    
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                      {item.title}
                    </h3>
                    
                    <h4 className="text-sm font-semibold text-[#A0A8B0] mb-3">
                      {item.subTitle}
                    </h4>
                    
                    <p className="text-base text-[#A0A8B0]/80 font-light leading-relaxed max-w-2xl">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                {aboutText.split('\n\n').map((para: string, pIdx: number) => {
                  const words = para.split(' ');
                  return (
                    <h3 key={pIdx} className="text-xl md:text-3xl lg:text-4xl font-light tracking-normal leading-[1.6] text-[var(--color-text)]/90 flex flex-wrap gap-x-2 gap-y-1">
                      {words.map((word, i) => (
                        <motion.span 
                          key={i}
                          initial={{ opacity: 0.15, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: false, margin: "-50px", amount: "all" }}
                          transition={{ duration: 0.4, delay: i * 0.01 }}
                        >
                          {word}
                        </motion.span>
                      ))}
                    </h3>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
