import React from 'react';
import { motion } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';

export default function CreativeSkills({ profile }: { profile: CareerProfile }) {
  if (!profile.skills || profile.skills.length === 0) return null;

  return (
    <section id="skills" className="w-full relative bg-[#0C1016] py-32 overflow-hidden flex flex-col items-center justify-center min-h-[80vh]">
      
      {/* Massive Background Marquee */}
      <div className="absolute inset-0 flex flex-col justify-center gap-12 opacity-30 select-none pointer-events-none z-0">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }} 
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          className="flex whitespace-nowrap"
        >
          <span className="text-[12rem] lg:text-[18rem] font-black uppercase text-transparent tracking-tighter" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.1)' }}>
            Capabilities Capabilities Capabilities Capabilities Capabilities
          </span>
        </motion.div>
        <motion.div 
          animate={{ x: ["-50%", "0%"] }} 
          transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
          className="flex whitespace-nowrap"
        >
          <span className="text-[12rem] lg:text-[18rem] font-black uppercase text-transparent tracking-tighter" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.1)' }}>
            Arsenal Arsenal Arsenal Arsenal Arsenal Arsenal
          </span>
        </motion.div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full relative z-10 px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {profile.skills.map((skill: any, idx: number) => {
            const skillName = typeof skill === 'string' ? skill : skill.name;
            const yOffset = idx % 2 === 0 ? 0 : 40;

            return (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: yOffset }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: idx * 0.1, type: "spring" }}
                whileHover={{ scale: 1.05, y: yOffset - 10 }}
                className="relative group cursor-default"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary)]/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative h-full px-8 py-12 rounded-3xl bg-[#1E242C]/80 border border-[var(--color-text)]/10 text-[#F0F6F8] shadow-2xl backdrop-blur-xl z-10 flex flex-col justify-between overflow-hidden group-hover:border-white/30 transition-colors">
                  <span className="text-5xl text-[var(--color-text)]/20 font-black tracking-tighter mb-8 block">0{idx + 1}</span>
                  <span className="text-3xl font-bold tracking-tight">{skillName}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
