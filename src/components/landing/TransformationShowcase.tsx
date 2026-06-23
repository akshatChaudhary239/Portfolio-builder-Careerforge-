'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = ["Developer", "Data Analyst", "Designer", "MBA", "Marketing"];

export default function TransformationShowcase() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <section className="w-full py-32 bg-[var(--color-v2-bg)] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-v2-primary)]/5 border border-[var(--color-v2-primary)]/10 text-xs font-bold uppercase tracking-widest text-[var(--color-v2-primary)] mb-6">
            Live Transformation Showcase
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-black text-[var(--color-v2-text-primary)] tracking-tight mb-4">
            See the Results for Your Role
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            GetProspectra adapts perfectly to any industry. Here is exactly what your output package could look like.
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-16">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${
                activeTab === tab 
                ? "bg-[var(--color-v2-primary)] text-white shadow-lg shadow-[var(--color-v2-primary)]/30" 
                : "bg-white border border-[var(--color-v2-border)] text-[var(--color-v2-text-secondary)] hover:border-[var(--color-v2-primary)]/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="relative w-full bg-white rounded-[2rem] border border-[var(--color-v2-border)] shadow-xl p-6 md:p-12 min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full"
            >
              
              {/* Output Menu */}
              <div className="lg:col-span-3 border-r border-[var(--color-v2-border)] pr-6 flex flex-col justify-center space-y-8">
                <div className="space-y-1">
                  <h4 className="font-bold text-[var(--color-v2-text-primary)] text-lg">Resume</h4>
                  <p className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded inline-block">Generated & Optimized</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-[var(--color-v2-text-primary)] text-lg">Portfolio Website</h4>
                  <p className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded inline-block">Live on Web</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-[var(--color-v2-text-primary)] text-lg">Interview Kit</h4>
                  <p className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-1 rounded inline-block">Ready to Practice</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-[var(--color-v2-text-primary)] text-lg">Career Insights</h4>
                  <p className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded inline-block">Analysis Complete</p>
                </div>
              </div>

              {/* Preview Area Placeholder */}
              <div className="lg:col-span-9 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="text-center relative z-10">
                  <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-4 text-2xl">
                    ✨
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-v2-text-primary)] mb-2">
                    {activeTab} Outputs Generating...
                  </h3>
                  <p className="text-sm text-[var(--color-v2-text-secondary)]">
                    In a real implementation, this area will show an interactive preview or high-quality mockups of the specific outputs for the {activeTab} role.
                  </p>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
