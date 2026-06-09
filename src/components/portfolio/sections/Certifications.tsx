import React from 'react';
import { motion } from 'framer-motion';
import { Award, ArrowUpRight } from 'lucide-react';
import { BaseSectionProps } from '@/components/portfolio/types';

export default function CertificationsPremiumGrid({ profile }: BaseSectionProps) {
  if (!profile.certifications || profile.certifications.length === 0) return null;

  return (
    <motion.div 
      key="certifications" 
      id="certifications" 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="scroll-mt-32 space-y-16 relative"
    >
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-[var(--color-primary)] rounded-full mix-blend-multiply filter blur-[100px] opacity-10"></div>
      
      <div className="flex flex-col items-center text-center space-y-4 mb-12 relative z-10">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[rgba(var(--color-primary-rgb),0.1)] border border-[rgba(var(--color-primary-rgb),0.2)] text-[var(--color-primary)] font-bold text-xs tracking-widest uppercase">
          Continuous Learning
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-[var(--color-text)] tracking-tight">
          Certifications
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {profile.certifications.map((cert: any, idx: number) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group bg-[var(--color-surface)]/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl hover:border-[rgba(var(--color-primary-rgb),0.3)] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--color-primary)] rounded-full mix-blend-multiply filter blur-[40px] opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
            
            <div className="w-14 h-14 rounded-2xl bg-[rgba(var(--color-primary-rgb),0.1)] border border-[rgba(var(--color-primary-rgb),0.2)] flex items-center justify-center text-[var(--color-primary)] mb-8 group-hover:scale-110 transition-transform duration-300">
              <Award size={24} />
            </div>
            
            <h3 className="text-xl font-bold text-[var(--color-text)] mb-2 leading-tight">
              {cert.name}
            </h3>
            <p className="text-[var(--color-muted)] font-medium mb-6">
              {cert.issuer}
            </p>
            
            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <span className="text-sm font-bold text-[var(--color-muted)]">
                {cert.date}
              </span>
              {cert.url && (
                <a href={cert.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm font-bold text-[var(--color-primary)] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Verify <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
