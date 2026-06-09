const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src/components/portfolioTemplates/sections/premium');

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const styles = [
  { 
    name: 'cinematic', 
    containerClass: 'relative min-h-screen py-32 flex flex-col justify-center bg-[#050505] text-[var(--color-text)]',
    cardClass: 'bg-black/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl hover:border-[var(--color-primary)] transition-all duration-500',
    navClass: 'fixed top-0 left-0 w-full z-50 py-6 px-10 bg-black/50 backdrop-blur-md border-b border-white/10 flex justify-between items-center',
    titleClass: 'text-5xl md:text-8xl font-bold uppercase tracking-tighter mb-16 text-white drop-shadow-2xl opacity-90',
    itemTitle: 'text-3xl font-semibold mb-2 text-white',
    itemMeta: 'text-sm text-[var(--color-primary)] uppercase tracking-widest mb-4 block',
    itemDesc: 'text-gray-400 text-lg leading-relaxed font-light'
  },
  { 
    name: 'brutalist', 
    containerClass: 'relative min-h-screen py-32 flex flex-col justify-center bg-white text-black border-b-[10px] border-black',
    cardClass: 'bg-white border-[4px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[8px] hover:translate-y-[8px] transition-all duration-200',
    navClass: 'fixed top-0 left-0 w-full z-50 py-4 px-8 bg-white border-b-[6px] border-black flex justify-between items-center uppercase font-black tracking-tighter',
    titleClass: 'text-6xl md:text-9xl font-black uppercase tracking-tighter mb-16 text-black',
    itemTitle: 'text-4xl font-black uppercase mb-2',
    itemMeta: 'text-base font-bold bg-black text-white px-2 py-1 inline-block uppercase tracking-widest mb-4',
    itemDesc: 'text-black text-xl font-medium leading-relaxed'
  },
  { 
    name: 'ethereal', 
    containerClass: 'relative min-h-screen py-32 flex flex-col justify-center bg-[#F8FAFC] text-slate-800',
    cardClass: 'bg-white/40 backdrop-blur-2xl border border-white p-8 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] transition-all duration-700',
    navClass: 'fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 py-4 px-8 bg-white/70 backdrop-blur-2xl border border-white/80 rounded-full shadow-xl flex justify-between items-center',
    titleClass: 'text-5xl md:text-7xl font-serif font-light tracking-tight mb-16 text-slate-900',
    itemTitle: 'text-3xl font-serif text-slate-900 mb-2',
    itemMeta: 'text-xs font-semibold text-slate-500 uppercase tracking-[0.2em] mb-4 block',
    itemDesc: 'text-slate-600 text-lg leading-relaxed font-light'
  }
];

const generators = {
  Navbar: (style) => `'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';

export default function ${capitalize(style.name)}Navbar({ profile }: { profile: CareerProfile }) {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="${style.navClass}"
    >
      <div className="font-bold text-2xl tracking-tighter mix-blend-difference">
        {profile.personalInfo.fullName.split(' ')[0]}
      </div>
      <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest font-semibold mix-blend-difference">
        <a href="#about" className="hover:text-[var(--color-primary)] transition-colors">About</a>
        <a href="#experience" className="hover:text-[var(--color-primary)] transition-colors">Experience</a>
        <a href="#projects" className="hover:text-[var(--color-primary)] transition-colors">Work</a>
      </div>
      <a href={\`mailto:\${profile.personalInfo.email}\`} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-full font-bold text-sm uppercase tracking-wider hover:scale-105 transition-transform">
        Contact
      </a>
    </motion.nav>
  );
}`,

  About: (style) => `'use client';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';

export default function ${capitalize(style.name)}About({ profile }: { profile: CareerProfile }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);

  return (
    <section id="about" ref={ref} className="${style.containerClass}">
      <motion.div style={{ opacity, y }} className="w-full max-w-7xl mx-auto px-6">
        <h2 className="${style.titleClass}">About</h2>
        <div className="max-w-4xl">
          <p className="text-3xl md:text-5xl leading-tight font-medium mix-blend-difference">
            {profile.summary}
          </p>
        </div>
      </motion.div>
    </section>
  );
}`,

  Experience: (style) => `'use client';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';

export default function ${capitalize(style.name)}Experience({ profile }: { profile: CareerProfile }) {
  const ref = useRef<HTMLDivElement>(null);
  
  if (!profile.experience || profile.experience.length === 0) return null;

  return (
    <section id="experience" ref={ref} className="${style.containerClass}">
      <div className="w-full max-w-7xl mx-auto px-6">
        <h2 className="${style.titleClass}">Experience</h2>
        <div className="space-y-8">
          {profile.experience.map((exp, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="${style.cardClass}"
            >
              <div className="md:flex justify-between items-start mb-6">
                <div>
                  <h3 className="${style.itemTitle}">{exp.position}</h3>
                  <span className="${style.itemMeta}">{exp.company}</span>
                </div>
                <div className="text-sm uppercase tracking-widest opacity-60 mt-2 md:mt-0">
                  {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                </div>
              </div>
              <p className="${style.itemDesc} mb-6">{exp.description}</p>
              {exp.achievements && exp.achievements.length > 0 && (
                <ul className="list-disc pl-5 space-y-2 text-sm opacity-80 mix-blend-difference">
                  {exp.achievements.map((ach, j) => (
                    <li key={j}>{ach}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}`,

  Projects: (style) => `'use client';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';
import { ExternalLink, Github } from 'lucide-react';

export default function ${capitalize(style.name)}Projects({ profile }: { profile: CareerProfile }) {
  const ref = useRef<HTMLDivElement>(null);
  
  if (!profile.projects || profile.projects.length === 0) return null;

  return (
    <section id="projects" ref={ref} className="${style.containerClass}">
      <div className="w-full max-w-7xl mx-auto px-6">
        <h2 className="${style.titleClass}">Selected Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {profile.projects.map((proj, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="${style.cardClass} flex flex-col h-full"
            >
              <div className="flex-1">
                <h3 className="${style.itemTitle}">{proj.title || proj.name}</h3>
                <span className="${style.itemMeta}">{(proj.technologies || proj.tools || []).join(' • ')}</span>
                <p className="${style.itemDesc} mt-4">{proj.description}</p>
              </div>
              
              <div className="flex gap-4 mt-8 pt-6 border-t border-current/10">
                {proj.liveUrl && (
                  <a href={proj.liveUrl} target="_blank" className="flex items-center gap-2 text-sm font-bold uppercase hover:text-[var(--color-primary)] transition-colors">
                    <ExternalLink size={16} /> Live Site
                  </a>
                )}
                {proj.githubUrl && (
                  <a href={proj.githubUrl} target="_blank" className="flex items-center gap-2 text-sm font-bold uppercase hover:text-[var(--color-primary)] transition-colors">
                    <Github size={16} /> Source
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}`,

  Skills: (style) => `'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';

export default function ${capitalize(style.name)}Skills({ profile }: { profile: CareerProfile }) {
  if (!profile.skills || profile.skills.length === 0) return null;

  return (
    <section className="${style.containerClass} overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-6 mb-12">
        <h2 className="${style.titleClass}">Capabilities</h2>
      </div>
      <div className="w-full relative flex overflow-x-hidden group">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
          className="flex whitespace-nowrap gap-8 px-4"
        >
          {/* Double the array for seamless infinite marquee */}
          {[...profile.skills, ...profile.skills, ...profile.skills].map((skill, i) => (
            <div key={i} className="text-5xl md:text-8xl font-black uppercase tracking-tighter opacity-20 hover:opacity-100 hover:text-[var(--color-primary)] transition-all duration-300 cursor-default">
              {skill.name} <span className="text-[var(--color-primary)] mx-4">•</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}`,

  Footer: (style) => `'use client';
import React from 'react';
import { CareerProfile } from '@/db/local-db';

export default function ${capitalize(style.name)}Footer({ profile }: { profile: CareerProfile }) {
  return (
    <footer className="w-full py-20 px-10 text-center mix-blend-difference border-t border-current/10">
      <h2 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter mb-8">
        Let's Build Together.
      </h2>
      <a href={\`mailto:\${profile.personalInfo.email}\`} className="text-2xl md:text-4xl font-light hover:text-[var(--color-primary)] transition-colors underline decoration-1 underline-offset-8">
        {profile.personalInfo.email}
      </a>
      <div className="mt-16 text-sm uppercase tracking-widest opacity-50 flex justify-center gap-8">
        {profile.personalInfo.linkedin && <a href={profile.personalInfo.linkedin} target="_blank">LinkedIn</a>}
        {profile.personalInfo.github && <a href={profile.personalInfo.github} target="_blank">GitHub</a>}
      </div>
      <p className="mt-12 text-xs opacity-30">
        © {new Date().getFullYear()} {profile.personalInfo.fullName}. Crafted with CareerForge.
      </p>
    </footer>
  );
}`,

  // We map the remaining sections to simple card grids utilizing the style presets
  Education: (style) => `'use client';
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';

export default function ${capitalize(style.name)}Education({ profile }: { profile: CareerProfile }) {
  if (!profile.education || profile.education.length === 0) return null;
  return (
    <section className="${style.containerClass}">
      <div className="w-full max-w-7xl mx-auto px-6">
        <h2 className="${style.titleClass}">Education</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {profile.education.map((edu, i) => (
            <motion.div key={i} whileHover={{ scale: 1.02 }} className="${style.cardClass}">
              <h3 className="${style.itemTitle}">{edu.degree} in {edu.specialization}</h3>
              <span className="${style.itemMeta}">{edu.institution}</span>
              <p className="text-sm uppercase tracking-widest opacity-60 mix-blend-difference">{edu.startYear} - {edu.endYear}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}`,

  Certifications: (style) => `'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';

export default function ${capitalize(style.name)}Certifications({ profile }: { profile: CareerProfile }) {
  if (!profile.certifications || profile.certifications.length === 0) return null;
  return (
    <section className="${style.containerClass}">
      <div className="w-full max-w-7xl mx-auto px-6">
        <h2 className="${style.titleClass}">Certifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {profile.certifications.map((cert, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }} className="${style.cardClass}">
              <h3 className="text-2xl font-bold mb-2">{cert.title}</h3>
              <span className="${style.itemMeta}">{cert.issuer}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}`,

  Differentiator: (style) => `'use client';
import React from 'react';
import { CareerProfile } from '@/db/local-db';

export default function ${capitalize(style.name)}Differentiator({ profile }: { profile: CareerProfile }) {
  if (!profile.achievements || profile.achievements.length === 0) return null;
  return (
    <section className="${style.containerClass}">
      <div className="w-full max-w-7xl mx-auto px-6 text-center">
        <h2 className="${style.titleClass}">Impact</h2>
        <div className="max-w-4xl mx-auto">
          {profile.achievements.map((ach, i) => (
            <div key={i} className="mb-12">
              <h3 className="${style.itemTitle}">{ach.title}</h3>
              <p className="${style.itemDesc}">{ach.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}`
};

styles.forEach(style => {
  const styleDir = path.join(baseDir, style.name);
  
  Object.keys(generators).forEach(section => {
    const componentName = `${capitalize(style.name)}${section}`;
    const filePath = path.join(styleDir, `${componentName}.tsx`);
    
    const content = generators[section](style);
    fs.writeFileSync(filePath, content, 'utf8');
  });
});

console.log("Real Premium Components Populated Successfully!");
