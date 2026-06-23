'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function FinalCTA() {
  return (
    <section className="w-full py-24 bg-[var(--color-v2-bg)] relative px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto bg-[#231773] rounded-3xl p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl">
        
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-v2-primary)]/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 z-0" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#8B7FFF]/30 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 z-0" />

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full">
          <div className="w-20 h-20 shrink-0 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white">
            <Trophy size={40} strokeWidth={1.5} />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-white leading-[1.1] mb-4">
              Ready to Build Your Professional Identity?
            </h2>
            <p className="text-lg text-[#B1A9FF] font-medium">
              Join thousands of ambitious professionals who are getting noticed.
            </p>
          </div>

          <div className="shrink-0 mt-8 md:mt-0">
            <Link 
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-5 rounded-xl bg-white text-[#231773] font-bold text-lg hover:scale-105 transition-transform shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
            >
              Create Your Free Profile <ArrowRight size={20} />
            </Link>
          </div>
        </div>
        
      </div>
    </section>
  );
}
