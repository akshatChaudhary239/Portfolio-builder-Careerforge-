import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { CareerProfile } from '@/db/local-db';
import Magnetic from '@/components/shared/Magnetic';

const textReveal: any = {
  initial: { y: "100%" },
  whileInView: { y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

export default function CreativeProjects({ profile }: { profile: CareerProfile }) {
  if (!profile.projects || profile.projects.length === 0) return null;

  return (
    <section id="projects" className="w-full relative bg-[#0C1016] py-32 px-6 lg:px-12 text-[#F0F6F8]">
      <div className="max-w-[1400px] mx-auto w-full">
        
        <div className="overflow-hidden mb-24">
          <motion.h2 
            {...textReveal}
            className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter uppercase leading-[0.85]"
          >
            Selected <span className="text-[#A0A8B0]">Works</span>
          </motion.h2>
        </div>

        <div className="flex flex-col gap-12 lg:gap-24">
          {profile.projects.map((proj, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="group relative flex flex-col border-b border-[var(--color-text)]/10 pb-12 lg:pb-24"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 z-10">
                <a href={proj.link || '#'} target={proj.link ? "_blank" : "_self"} className="block overflow-hidden max-w-4xl">
                  <h3 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter group-hover:-translate-y-2 transition-transform duration-500 origin-left uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-white group-hover:from-[var(--color-primary)] group-hover:to-[var(--color-primary)]">
                    {proj.name}
                  </h3>
                </a>
                
                {proj.link && (
                  <Magnetic strength={0.2}>
                    <a href={proj.link} target="_blank" rel="noreferrer" className="hidden lg:flex w-24 h-24 rounded-full border border-white/20 items-center justify-center group-hover:bg-white group-hover:text-[var(--color-text)] transition-colors duration-500">
                      <ArrowUpRight size={32} />
                    </a>
                  </Magnetic>
                )}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 mt-8 lg:mt-16 gap-8 items-start">
                <div className="lg:col-span-4 flex flex-wrap gap-2">
                  {proj.technologies?.map((tech: string, i: number) => (
                    <span key={i} className="px-4 py-2 rounded-full border border-[var(--color-text)]/10 bg-[#1E242C] text-sm font-semibold tracking-wide uppercase text-[#A0A8B0]">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="lg:col-span-8">
                  <p className="text-xl md:text-3xl text-[#A0A8B0] font-light leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              </div>
              
              {/* Dynamic Image Hover Reveal Background effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[150%] bg-gradient-to-tr from-[var(--color-primary)]/5 to-[var(--color-primary)]/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
