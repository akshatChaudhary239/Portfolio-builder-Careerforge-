import React from 'react';
import { motion } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';

export default function CreativeDifferentiator({ profile }: { profile: CareerProfile }) {
  const differentiator = profile.professionalBlueprint?.primaryStrength;
  if (!differentiator) return null;

  return (
    <section className="w-full relative bg-[#0C1016] text-[#F0F6F8] min-h-[120vh]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0C1016] to-[#1E242C]/20 pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-12 relative z-10 pt-32 h-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 h-full relative">
          <div className="lg:col-span-5 h-[100vh] sticky top-0 flex flex-col justify-center">
            <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-primary)] uppercase tracking-[0.3em] mb-8">
              The Edge
            </h2>
            <h3 className="text-5xl md:text-7xl lg:text-[6rem] font-black tracking-tighter leading-[0.9] text-[var(--color-text)] uppercase">
              Why <br/><span className="text-[#A0A8B0]">Me?</span>
            </h3>
          </div>
          
          <div className="lg:col-span-7 flex flex-col justify-center min-h-screen py-32 lg:py-0">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-200px" }}
              transition={{ duration: 1, type: "spring" }}
            >
              <h4 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[var(--color-text)] leading-tight tracking-tighter mb-12">
                &quot;{differentiator}&quot;
              </h4>
              <p className="text-2xl lg:text-4xl text-[#A0A8B0] font-light leading-relaxed max-w-2xl">
                This is the secret sauce. The core perspective I bring to every single project to ensure it doesn&apos;t just work, but it dazzles and outperforms the competition.
              </p>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
