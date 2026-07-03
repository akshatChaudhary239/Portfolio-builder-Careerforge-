'use client';

import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    num: 1,
    title: "Create Account",
    desc: "Sign up and create your personal workspace.",
    mockup: (
      <div className="w-full h-36 bg-slate-950 rounded-xl shadow-md border border-slate-855 p-3 flex flex-col justify-between text-left overflow-hidden">
        <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
          <span className="text-[9px] text-slate-500 font-mono ml-auto">getprospectra.com/register</span>
        </div>
        <div className="space-y-1.5 my-auto">
          <div className="h-5 bg-white/5 border border-white/10 rounded px-2 flex items-center justify-between text-[8px] text-slate-400">
            <span>Email Address</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-pulse"></span>
          </div>
          <div className="h-5 bg-white/5 border border-white/10 rounded px-2 flex items-center justify-between text-[8px] text-slate-400">
            <span>Password</span>
            <span>••••••</span>
          </div>
        </div>
        <div className="h-5.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 rounded text-[9px] text-white font-bold flex items-center justify-center cursor-pointer shadow-md shadow-indigo-500/10">
          Create Account
        </div>
      </div>
    )
  },
  {
    num: 2,
    title: "Build Career Profile",
    desc: "Fill your education, experience, skills, projects & more.",
    mockup: (
      <div className="w-full h-36 bg-slate-950 rounded-xl shadow-md border border-slate-855 p-3 flex flex-col justify-between text-left overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider">Onboarding System</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[8px] font-bold">Step 2 of 3</span>
        </div>
        <div className="space-y-1.5 my-auto">
          <div className="text-[10px] text-white font-bold truncate">Academic & Professional Details</div>
          <div className="flex flex-wrap gap-1">
            <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[8px] text-indigo-300 font-medium">Education</span>
            <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[8px] text-indigo-300 font-medium">Work History</span>
            <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[8px] text-indigo-300 font-medium">Skills</span>
          </div>
          <div className="h-3.5 bg-white/5 rounded border border-white/10 flex items-center px-1.5 text-[8px] text-slate-400">
            <span>Add experience (e.g. Lead Software Engineer)</span>
          </div>
        </div>
        <div className="h-5.5 bg-indigo-600 rounded text-[9px] text-white font-semibold flex items-center justify-center cursor-pointer">
          Next Phase
        </div>
      </div>
    )
  },
  {
    num: 3,
    title: "Verify Information",
    desc: "We verify and structure your data for maximum impact.",
    mockup: (
      <div className="w-full h-36 bg-slate-950 rounded-xl shadow-md border border-slate-855 p-3 flex flex-col justify-between text-left overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider font-mono">Verify Information</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        <div className="space-y-2 my-auto">
          <div className="flex items-center justify-between text-[8px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span>
              <span>Parse Experience schema</span>
            </div>
            <span className="text-slate-500">100%</span>
          </div>
          <div className="flex items-center justify-between text-[8px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span>
              <span>Validate Achievements list</span>
            </div>
            <span className="text-slate-500">100%</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="w-[100%] h-full bg-gradient-to-r from-indigo-500 to-emerald-500"></div>
          </div>
        </div>
        <div className="h-5.5 bg-emerald-600 text-white rounded text-[9px] font-bold flex items-center justify-center">
          Information Confirmed
        </div>
      </div>
    )
  },
  {
    num: 4,
    title: "Generate Assets",
    desc: "AI creates your resume, portfolio, questions & insights.",
    mockup: (
      <div className="w-full h-36 bg-slate-950 rounded-xl shadow-md border border-slate-855 p-3 flex flex-col justify-between text-left overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="text-[9px] text-amber-500 font-bold uppercase tracking-wider">Asset Generator</span>
          <span className="text-[8px] text-slate-400 font-mono">Status: Processing</span>
        </div>
        <div className="space-y-2 my-auto">
          <div className="flex gap-2 justify-center">
            <div className="p-1.5 bg-slate-900 border border-white/10 rounded-lg text-center flex-1">
              <div className="text-[10px]">📁</div>
              <div className="text-[7.5px] text-slate-400 mt-1 font-bold">Resume</div>
            </div>
            <div className="p-1.5 bg-slate-900 border border-amber-500/20 rounded-lg text-center flex-1 animate-pulse">
              <div className="text-[10px]">🌐</div>
              <div className="text-[7.5px] text-amber-400 mt-1 font-bold">Portfolio</div>
            </div>
            <div className="p-1.5 bg-slate-900 border border-white/10 rounded-lg text-center flex-1">
              <div className="text-[10px]">💡</div>
              <div className="text-[7.5px] text-slate-400 mt-1 font-bold">Insights</div>
            </div>
          </div>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="w-[66%] h-full bg-amber-500"></div>
        </div>
      </div>
    )
  },
  {
    num: 5,
    title: "Review & Customize",
    desc: "Review everything and make any edits you need.",
    mockup: (
      <div className="w-full h-36 bg-slate-950 rounded-xl shadow-md border border-slate-855 p-2.5 flex justify-between gap-2 text-left overflow-hidden">
        {/* Mock Customizer Sidebar */}
        <div className="w-[45%] h-full bg-slate-900 rounded border border-white/5 p-1.5 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-[7px] text-amber-400 uppercase tracking-widest font-black">Visual Studio</div>
            <div className="w-full h-1 bg-white/10 rounded"></div>
            <div className="w-3/4 h-1 bg-white/10 rounded"></div>
          </div>
          <div className="space-y-1">
            <div className="text-[6.5px] text-slate-400 font-bold">Flavor: Cinematic</div>
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded bg-indigo-500 cursor-pointer"></div>
              <div className="w-2.5 h-2.5 rounded bg-amber-500 cursor-pointer"></div>
              <div className="w-2.5 h-2.5 rounded bg-rose-500 cursor-pointer"></div>
            </div>
          </div>
        </div>
        {/* Mock Canvas View */}
        <div className="w-[55%] h-full bg-slate-900/60 rounded border border-white/5 p-2 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:10px_10px]" />
          <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-amber-500 rounded-full animate-spin-slow z-10 flex items-center justify-center text-[8px]">✨</div>
          <div className="text-[7.5px] font-bold text-white mt-1.5 z-10 font-mono">Brutalist.tsx</div>
        </div>
      </div>
    )
  },
  {
    num: 6,
    title: "Publish & Apply",
    desc: "Download, publish and start applying with confidence.",
    mockup: (
      <div className="w-full h-36 bg-slate-950 rounded-xl shadow-md border border-slate-855 p-3 flex flex-col justify-between text-left overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Live Deploy</span>
          <span className="text-[8px] text-emerald-400 font-mono">Active</span>
        </div>
        <div className="space-y-1.5 my-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-white/5 text-[8.5px] text-slate-300 font-mono max-w-full truncate mx-auto">
            <span>🔗 akku.getprospectra.dev</span>
          </div>
          <p className="text-[8px] text-slate-400">Recruiter ready and online.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 h-5.5 bg-slate-900 hover:bg-slate-850 border border-white/10 text-white rounded text-[8.5px] font-semibold flex items-center justify-center cursor-pointer">
            PDF Resume
          </div>
          <div className="flex-1 h-5.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded text-[8.5px] text-slate-950 font-black flex items-center justify-center cursor-pointer">
            Launch Site
          </div>
        </div>
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
