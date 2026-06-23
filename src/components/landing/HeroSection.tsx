'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, FileText, Globe, MessageSquare, BarChart } from 'lucide-react';

export default function HeroSection() {
  // Animation variants
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const treeLineVariants: any = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1, transition: { duration: 1.5, ease: "easeInOut", delay: 0.5 } }
  };

  const treeNodeVariants: any = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "backOut", delay: 1 } }
  };

  return (
    <section className="relative w-full bg-[var(--color-v2-bg)] pt-20 pb-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Typography */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl"
        >
          <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-6 text-[10px] uppercase font-bold tracking-widest text-[var(--color-v2-text-secondary)]">
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-[var(--color-v2-border)] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-v2-primary)]"></span>
              AI Powered
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-[var(--color-v2-border)] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-v2-accent)]"></span>
              Recruiter Vetted
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-[var(--color-v2-border)] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
              Career Focused
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-serif font-black text-[var(--color-v2-text-primary)] leading-[1.1] tracking-tight mb-6">
            Your Career Deserves <br className="hidden md:block"/>
            More Than a Generic <br className="hidden md:block"/>
            Resume Builder
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg text-[var(--color-v2-text-secondary)] leading-relaxed mb-10 max-w-xl">
            GetProspectra creates your complete professional identity package — Resume, Portfolio Website, Interview Prep, and Career Insights — all powered by verified information and real achievements.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mb-12">
            <Link 
              href="/register"
              className="px-8 py-4 rounded-xl bg-[var(--color-v2-primary)] text-white font-bold shadow-[0_8px_20px_-4px_rgba(109,93,246,0.5)] hover:shadow-[0_12px_25px_-4px_rgba(109,93,246,0.6)] hover:bg-[var(--color-v2-accent)] transition-all transform hover:-translate-y-1 flex items-center gap-2"
            >
              Create Your Free Profile
            </Link>
            <Link 
              href="#how-it-works"
              className="px-8 py-4 rounded-xl bg-white border border-[var(--color-v2-border)] text-[var(--color-v2-primary)] font-bold shadow-sm hover:shadow-md hover:border-[var(--color-v2-primary)] transition-all flex items-center gap-2 group"
            >
              See How It Works
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden relative shadow-sm">
                  <Image src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User avatar" fill className="object-cover" />
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex gap-1 text-[#FBBF24]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs font-semibold text-[var(--color-v2-text-secondary)] mt-1">Loved by early professionals</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side: Animated Workflow Map */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative h-[600px] w-full hidden lg:block"
        >
          {/* Main Central Profile Box */}
          <motion.div 
            className="absolute top-1/2 left-0 -translate-y-1/2 w-[340px] bg-white rounded-2xl p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-[var(--color-v2-border)] z-20"
            initial={{ y: "-50%", x: -50, opacity: 0 }}
            animate={{ y: "-50%", x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-[var(--color-v2-text-primary)]">Your Career Profile</h3>
              <span className="text-[10px] font-bold text-[var(--color-v2-success)] bg-green-50 px-2 py-1 rounded-full">100% Complete</span>
            </div>
            <div className="space-y-4">
              {['Education', 'Experience', 'Projects', 'Skills', 'Achievements'].map((item, i) => (
                <div key={item} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-[var(--color-v2-primary)] transition-colors" />
                    </div>
                    <span className="text-sm font-medium text-[var(--color-v2-text-secondary)]">{item}</span>
                  </div>
                  <CheckCircle2 size={16} className="text-[var(--color-v2-success)]" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Connection Lines SVG */}
          <svg className="absolute top-0 left-0 w-full h-full z-10" pointerEvents="none">
            {/* Top right branch */}
            <motion.path 
              d="M 340 300 C 400 300, 420 100, 480 100" 
              stroke="var(--color-v2-primary)" 
              strokeWidth="2" 
              strokeDasharray="4 4"
              fill="none" 
              variants={treeLineVariants}
              initial="hidden"
              animate="visible"
            />
            {/* Mid top right branch */}
            <motion.path 
              d="M 340 300 C 400 300, 420 230, 480 230" 
              stroke="var(--color-v2-primary)" 
              strokeWidth="2" 
              strokeDasharray="4 4"
              fill="none" 
              variants={treeLineVariants}
              initial="hidden"
              animate="visible"
            />
            {/* Mid bottom right branch */}
            <motion.path 
              d="M 340 300 C 400 300, 420 370, 480 370" 
              stroke="var(--color-v2-primary)" 
              strokeWidth="2" 
              strokeDasharray="4 4"
              fill="none" 
              variants={treeLineVariants}
              initial="hidden"
              animate="visible"
            />
            {/* Bottom right branch */}
            <motion.path 
              d="M 340 300 C 400 300, 420 500, 480 500" 
              stroke="var(--color-v2-primary)" 
              strokeWidth="2" 
              strokeDasharray="4 4"
              fill="none" 
              variants={treeLineVariants}
              initial="hidden"
              animate="visible"
            />
            
            {/* Purple pulse dot in center */}
            <motion.circle 
              cx="360" cy="300" r="12" 
              fill="var(--color-v2-primary)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
            <motion.circle cx="360" cy="300" r="6" fill="#fff" />
          </svg>

          {/* Connected Nodes */}
          <div className="absolute right-0 top-0 h-full w-[280px] flex flex-col justify-between py-6 z-20">
            {/* Node 1 */}
            <motion.div variants={treeNodeVariants} initial="hidden" animate="visible" className="bg-white p-4 rounded-xl shadow-lg border border-[var(--color-v2-border)] flex items-center gap-4 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-[var(--color-v2-primary)]">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[var(--color-v2-text-primary)]">Professional Resume</h4>
                <p className="text-[10px] text-[var(--color-v2-text-secondary)]">ATS Friendly • Recruiter Focused</p>
              </div>
            </motion.div>

            {/* Node 2 */}
            <motion.div variants={treeNodeVariants} initial="hidden" animate="visible" className="bg-white p-4 rounded-xl shadow-lg border border-[var(--color-v2-border)] flex items-center gap-4 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Globe size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[var(--color-v2-text-primary)]">Portfolio Website</h4>
                <p className="text-[10px] text-[var(--color-v2-text-secondary)]">Custom • Responsive • Live</p>
              </div>
            </motion.div>

            {/* Node 3 */}
            <motion.div variants={treeNodeVariants} initial="hidden" animate="visible" className="bg-white p-4 rounded-xl shadow-lg border border-[var(--color-v2-border)] flex items-center gap-4 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <MessageSquare size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[var(--color-v2-text-primary)]">Interview Preparation</h4>
                <p className="text-[10px] text-[var(--color-v2-text-secondary)]">Personalized Questions</p>
              </div>
            </motion.div>

            {/* Node 4 */}
            <motion.div variants={treeNodeVariants} initial="hidden" animate="visible" className="bg-white p-4 rounded-xl shadow-lg border border-[var(--color-v2-border)] flex items-center gap-4 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                <BarChart size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[var(--color-v2-text-primary)]">Career Insights</h4>
                <p className="text-[10px] text-[var(--color-v2-text-secondary)]">Strengths • Gaps • Recommendations</p>
              </div>
            </motion.div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
