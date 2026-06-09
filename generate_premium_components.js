const fs = require('fs');
const path = require('path');

const styles = ['cinematic', 'brutalist', 'ethereal'];
const sections = ['Navbar', 'About', 'Experience', 'Projects', 'Skills', 'Education', 'Certifications', 'Differentiator', 'Footer'];
// Note: Hero is handled separately because it contains the WebGL Canvas logic. We will write BrutalistHero and EtherealHero manually to ensure high quality WebGL integration.

const baseDir = path.join(__dirname, 'src/components/portfolioTemplates/sections/premium');

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Ensure base dir exists
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

styles.forEach(style => {
  const styleDir = path.join(baseDir, style);
  if (!fs.existsSync(styleDir)) fs.mkdirSync(styleDir, { recursive: true });

  sections.forEach(section => {
    const componentName = `${capitalize(style)}${section}`;
    const filePath = path.join(styleDir, `${componentName}.tsx`);
    
    // We create a boilerplate that uses Framer Motion's useScroll and high-end animations
    const content = `'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';

export default function ${componentName}({ profile }: { profile: CareerProfile }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen py-32 flex flex-col items-center justify-center overflow-hidden bg-transparent text-[var(--color-text)]">
      <motion.div style={{ y, opacity }} className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter mb-12 border-b border-[var(--color-text)]/20 pb-4">
          ${section}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Example generic content mapping */}
          <div className="bg-[var(--color-surface)] p-8 rounded-3xl border border-[var(--color-text)]/10 hover:border-[var(--color-primary)] transition-colors duration-500">
             <p className="text-xl text-[var(--color-muted)] leading-relaxed">
               This is the premium ${style} highly animated ${section} section. The actual data mapping goes here.
             </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
`;
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  });
});

console.log("Premium Boilerplates Generated");
