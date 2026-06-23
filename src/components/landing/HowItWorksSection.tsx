'use client';

import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    num: 1,
    title: "Create Account",
    desc: "Sign up and create your personal workspace.",
    mockup: (
      <div className="w-full h-32 bg-white rounded-xl shadow-sm border border-[var(--color-v2-border)] p-4 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-[var(--color-v2-primary)] font-bold text-xs">1</div>
        <div className="w-24 h-2 bg-gray-100 rounded-full"></div>
        <div className="w-20 h-2 bg-gray-100 rounded-full"></div>
        <div className="w-full h-6 bg-[var(--color-v2-primary)] rounded mt-2"></div>
      </div>
    )
  },
  {
    num: 2,
    title: "Build Career Profile",
    desc: "Fill your education, experience, skills, projects & more.",
    mockup: (
      <div className="w-full h-32 bg-white rounded-xl shadow-sm border border-[var(--color-v2-border)] p-4 flex flex-col space-y-2">
        <div className="flex justify-between items-center mb-2">
          <div className="w-16 h-2 bg-gray-200 rounded-full"></div>
          <div className="w-6 h-2 bg-[var(--color-v2-success)] rounded-full"></div>
        </div>
        {[1,2,3,4].map(i => (
          <div key={i} className="flex justify-between items-center">
            <div className="w-12 h-2 bg-gray-100 rounded-full"></div>
            <div className="w-3 h-3 rounded-full bg-[var(--color-v2-success)]/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-v2-success)]"></div>
            </div>
          </div>
        ))}
      </div>
    )
  },
  {
    num: 3,
    title: "Verify Information",
    desc: "We verify and structure your data for maximum impact.",
    mockup: (
      <div className="w-full h-32 bg-white rounded-xl shadow-sm border border-[var(--color-v2-border)] p-4 flex flex-col space-y-3">
        <div className="w-20 h-2 bg-gray-200 rounded-full mx-auto"></div>
        <div className="space-y-2 mt-2">
          {[1,2,3].map(i => (
            <div key={i} className="flex justify-between items-center">
              <div className="w-14 h-2 bg-gray-100 rounded-full"></div>
              <div className="w-4 h-2 bg-[var(--color-v2-primary)]/20 rounded-full"></div>
            </div>
          ))}
        </div>
        <div className="w-full h-6 bg-[var(--color-v2-primary)] rounded mt-auto"></div>
      </div>
    )
  },
  {
    num: 4,
    title: "Generate Assets",
    desc: "AI creates your resume, portfolio, questions & insights.",
    mockup: (
      <div className="w-full h-32 bg-white rounded-xl shadow-sm border border-[var(--color-v2-border)] p-4 flex flex-col space-y-2">
        <div className="w-24 h-2 bg-gray-200 rounded-full"></div>
        <div className="space-y-2 mt-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex justify-between items-center">
              <div className="w-16 h-2 bg-gray-100 rounded-full"></div>
              <div className="w-2 h-2 rounded-full bg-[var(--color-v2-primary)]"></div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    num: 5,
    title: "Review & Customize",
    desc: "Review everything and make any edits you need.",
    mockup: (
      <div className="w-full h-32 bg-white rounded-xl shadow-sm border border-[var(--color-v2-border)] p-2 flex gap-2">
        <div className="w-1/3 h-full bg-gray-50 rounded border border-gray-100 p-1 space-y-1">
          <div className="w-full h-1 bg-gray-200 rounded"></div>
          <div className="w-full h-1 bg-gray-200 rounded"></div>
          <div className="w-3/4 h-1 bg-gray-200 rounded"></div>
        </div>
        <div className="w-2/3 h-full bg-gray-50 rounded border border-gray-100 p-2 flex flex-col space-y-2">
          <div className="w-full h-8 bg-[var(--color-v2-primary)]/10 rounded"></div>
          <div className="flex gap-1 mt-auto">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          </div>
        </div>
      </div>
    )
  },
  {
    num: 6,
    title: "Publish & Apply",
    desc: "Download, publish and start applying with confidence.",
    mockup: (
      <div className="w-full h-32 bg-white rounded-xl shadow-sm border border-[var(--color-v2-border)] p-4 flex flex-col items-center justify-center space-y-3">
        <div className="flex -space-x-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs">🚀</div>
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-xs">🎉</div>
        </div>
        <div className="w-24 h-2 bg-gray-200 rounded-full text-center mt-2"></div>
        <div className="w-full h-6 bg-[var(--color-v2-primary)] rounded mt-2"></div>
      </div>
    )
  }
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full py-32 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-v2-primary)]/5 border border-[var(--color-v2-primary)]/10 text-xs font-bold uppercase tracking-widest text-[var(--color-v2-primary)] mb-6">
            How GetProspectra Works
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-black text-[var(--color-v2-text-primary)] tracking-tight">
            Your Journey From Profile to Professional Identity
          </h2>
        </div>

        {/* Timeline Desktop */}
        <div className="hidden lg:block relative">
          {/* Animated Connecting Line */}
          <div className="absolute top-6 left-[8%] right-[8%] h-[2px] bg-gray-100 -z-10">
            <motion.div 
              className="h-full bg-[var(--color-v2-primary)]"
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>

          <div className="grid grid-cols-6 gap-6 relative z-10">
            {steps.map((step, idx) => (
              <motion.div 
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="flex flex-col items-center text-center"
              >
                {/* Number Circle */}
                <motion.div 
                  className="w-12 h-12 rounded-full bg-[var(--color-v2-primary)] text-white flex items-center justify-center font-bold text-lg mb-6 shadow-lg shadow-[var(--color-v2-primary)]/20"
                  whileHover={{ scale: 1.1 }}
                >
                  {step.num}
                </motion.div>
                
                {/* Text Content */}
                <h3 className="font-bold text-[var(--color-v2-text-primary)] mb-2 text-sm">{step.title}</h3>
                <p className="text-[11px] text-[var(--color-v2-text-secondary)] leading-relaxed mb-8 px-2 min-h-[50px]">
                  {step.desc}
                </p>

                {/* Mockup Box */}
                <div className="w-full transform hover:-translate-y-2 transition-transform duration-300">
                  {step.mockup}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline Mobile/Tablet */}
        <div className="lg:hidden relative space-y-12">
          {/* Vertical Connecting Line */}
          <div className="absolute top-0 bottom-0 left-6 w-[2px] bg-gray-100 -z-10">
            <motion.div 
              className="w-full bg-[var(--color-v2-primary)]"
              initial={{ height: "0%" }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>

          {steps.map((step, idx) => (
            <motion.div 
              key={step.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex gap-6 relative z-10"
            >
              {/* Number Circle */}
              <div className="w-12 h-12 shrink-0 rounded-full bg-[var(--color-v2-primary)] text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-[var(--color-v2-primary)]/20">
                {step.num}
              </div>
              
              {/* Content */}
              <div className="pt-2 flex-1">
                <h3 className="font-bold text-[var(--color-v2-text-primary)] mb-1">{step.title}</h3>
                <p className="text-sm text-[var(--color-v2-text-secondary)] leading-relaxed mb-4">
                  {step.desc}
                </p>
                <div className="w-full max-w-[280px]">
                  {step.mockup}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
