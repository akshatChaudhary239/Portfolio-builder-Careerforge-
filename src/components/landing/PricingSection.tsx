'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import Link from 'next/link';

export default function PricingSection() {
  const comparisonFeatures = [
    { name: "Professional Resume", other: true, getprospectra: true },
    { name: "Portfolio Website", other: false, getprospectra: true },
    { name: "Interview Preparation", other: false, getprospectra: true },
    { name: "Career Insights", other: false, getprospectra: true },
    { name: "Single Profile System", other: false, getprospectra: true },
    { name: "Recruiter Focused Content", other: false, getprospectra: true },
    { name: "Affordable Pricing", other: false, getprospectra: true },
  ];

  return (
    <section id="pricing" className="w-full py-32 bg-white relative">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-v2-primary)]/5 border border-[var(--color-v2-primary)]/10 text-xs font-bold uppercase tracking-widest text-[var(--color-v2-primary)] mb-6">
            Portfolio Showcase
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-black text-[var(--color-v2-text-primary)] tracking-tight">
            Choose The Plan That's Right for You
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Pricing Cards (Left) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Free Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 border border-[var(--color-v2-border)] flex flex-col h-full"
            >
              <h3 className="font-bold text-lg text-[var(--color-v2-text-primary)]">Free Plan</h3>
              <div className="mt-4 mb-2">
                <span className="text-4xl font-black text-[var(--color-v2-text-primary)]">₹0</span>
              </div>
              <p className="text-sm text-[var(--color-v2-text-secondary)] mb-8">Perfect to get started</p>
              
              <ul className="space-y-4 flex-1 mb-8">
                {['1 Professional Resume', '1 Portfolio Website', '10 Interview Questions', 'Basic Career Insights'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[var(--color-v2-text-secondary)]">
                    <Check size={18} className="text-gray-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              
              <Link href="/register" className="w-full py-3 px-4 rounded-xl border border-[var(--color-v2-border)] text-[var(--color-v2-text-primary)] font-bold text-center hover:bg-gray-50 transition-colors">
                Get Started Free
              </Link>
            </motion.div>

            {/* Premium Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative bg-white rounded-2xl p-8 border-2 border-[var(--color-v2-primary)] shadow-[0_20px_40px_-15px_rgba(109,93,246,0.2)] flex flex-col h-full overflow-hidden"
            >
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-[var(--color-v2-primary)] text-white text-[10px] font-bold uppercase tracking-wider rounded-bl-lg">
                Most Popular
              </div>
              <h3 className="font-bold text-lg text-[var(--color-v2-text-primary)] pr-20">Premium Plan</h3>
              <div className="mt-4 mb-2">
                <span className="text-4xl font-black text-[var(--color-v2-text-primary)]">₹199</span>
              </div>
              <p className="text-sm text-[var(--color-v2-text-secondary)] mb-8">Complete professional identity suite</p>
              
              <ul className="space-y-4 flex-1 mb-8">
                {[
                  '3 Differently Positioned Resumes', 
                  '1 High-End Premium Portfolio Website', 
                  '10 Interview Questions + Expected Answers', 
                  'Advanced Career Insights & Positioning',
                  'Priority Support'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[var(--color-v2-text-primary)] font-medium">
                    <div className="w-5 h-5 rounded-full bg-[var(--color-v2-success)]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} className="text-[var(--color-v2-success)]" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              
              <Link href="/register" className="w-full py-3 px-4 rounded-xl bg-[var(--color-v2-primary)] text-white font-bold text-center hover:bg-[var(--color-v2-accent)] shadow-[0_4px_14px_0_rgba(109,93,246,0.39)] transition-all transform hover:-translate-y-0.5">
                Upgrade to Premium
              </Link>
            </motion.div>

          </div>

          {/* Comparison Table (Right) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-6 bg-gray-50/50 rounded-2xl p-8 border border-[var(--color-v2-border)]"
          >
            <h3 className="text-xl font-bold text-[var(--color-v2-text-primary)] text-center mb-8 font-serif">
              Why Choose GetProspectra?
            </h3>
            
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-[var(--color-v2-border)]">
                    <th className="pb-4 font-bold text-[var(--color-v2-text-primary)] w-1/2">Features</th>
                    <th className="pb-4 font-bold text-[var(--color-v2-text-secondary)] text-center w-1/4">Other Tools</th>
                    <th className="pb-4 font-bold text-[var(--color-v2-primary)] text-center w-1/4">GetProspectra</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-v2-border)]">
                  {comparisonFeatures.map((feat, i) => (
                    <tr key={i} className="group hover:bg-white transition-colors">
                      <td className="py-4 text-[var(--color-v2-text-secondary)] font-medium">{feat.name}</td>
                      <td className="py-4 text-center">
                        {feat.other ? 
                          <Check size={16} className="text-gray-400 mx-auto" /> : 
                          <X size={16} className="text-gray-300 mx-auto" />
                        }
                      </td>
                      <td className="py-4 text-center">
                        {feat.getprospectra ? 
                          <div className="w-6 h-6 rounded-full bg-[var(--color-v2-success)]/10 flex items-center justify-center mx-auto">
                            <Check size={14} className="text-[var(--color-v2-success)]" />
                          </div> : 
                          <X size={16} className="text-gray-300 mx-auto" />
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
