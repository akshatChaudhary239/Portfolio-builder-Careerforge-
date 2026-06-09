import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
import { BaseSectionProps } from '@/components/portfolio/types';

export default function ContactPremiumInteractive({ profile }: BaseSectionProps) {
  if (!profile.personalInfo) return null;

  return (
    <motion.div 
      key="contact" 
      id="contact" 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="scroll-mt-32 space-y-16 relative"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(var(--color-primary-rgb),0.05)] rounded-[4rem] -z-10"></div>

      <div className="flex flex-col items-center text-center space-y-6 py-20 px-4">
        <h2 className="text-5xl md:text-7xl font-black text-[var(--color-text)] tracking-tight">
          Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">Connect</span>
        </h2>
        <p className="text-xl text-[var(--color-muted)] font-medium max-w-2xl mx-auto">
          Currently open for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
        </p>
        
        <div className="pt-12 flex flex-wrap justify-center gap-6">
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={`mailto:${profile.personalInfo.email}`}
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg shadow-[0_10px_30px_rgba(var(--color-primary-rgb),0.3)] hover:shadow-[0_15px_40px_rgba(var(--color-primary-rgb),0.5)] transition-shadow"
          >
            <Mail size={20} /> Say Hello
          </motion.a>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mt-16 pt-16 border-t border-white/5 w-full max-w-3xl">
          {profile.personalInfo.email && (
            <div className="flex items-center gap-3 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] flex items-center justify-center border border-white/5 group-hover:border-[var(--color-primary)] transition-colors">
                <Mail size={16} />
              </div>
              <span className="font-medium">{profile.personalInfo.email}</span>
            </div>
          )}
          {profile.personalInfo.phone && (
            <div className="flex items-center gap-3 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] flex items-center justify-center border border-white/5 group-hover:border-[var(--color-primary)] transition-colors">
                <Phone size={16} />
              </div>
              <span className="font-medium">{profile.personalInfo.phone}</span>
            </div>
          )}
          {profile.personalInfo.location && (
            <div className="flex items-center gap-3 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] flex items-center justify-center border border-white/5 group-hover:border-[var(--color-primary)] transition-colors">
                <MapPin size={16} />
              </div>
              <span className="font-medium">{profile.personalInfo.location}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
