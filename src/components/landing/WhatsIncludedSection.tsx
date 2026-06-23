'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Globe, MessageSquare, BarChart, Trophy, Check } from 'lucide-react';

const features = [
  {
    icon: FileText,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50",
    title: "Professional Resume",
    items: ["ATS Friendly", "Recruiter Focused", "Impact Driven", "PDF & Docx Export"]
  },
  {
    icon: Globe,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    title: "Portfolio Website",
    items: ["Custom & Responsive", "Premium Domain", "Live & Shareable", "SSL & Hosting"]
  },
  {
    icon: MessageSquare,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    title: "Interview Preparation",
    items: ["Technical Questions", "Behavioral Questions", "Expected Answers", "Personalized for You"]
  },
  {
    icon: BarChart,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    title: "Career Insights",
    items: ["Strengths Analysis", "Gap Identification", "Improvement Tips", "Career Positioning"]
  },
  {
    icon: Trophy,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    title: "Achievement Dashboard",
    items: ["Track Progress", "Profile Score", "Milestone Insights", "Continuous Growth"]
  }
];

export default function WhatsIncludedSection() {
  return (
    <section className="w-full py-32 bg-[var(--color-v2-bg)] border-t border-[var(--color-v2-border)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-v2-primary)] mb-4">
            Everything You Need To Get Hired
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-black text-[var(--color-v2-text-primary)] tracking-tight">
            What's Included in Your Package
          </h2>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-[var(--color-v2-border)] shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.iconBg} ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} />
                </div>
                
                <h3 className="font-bold text-[var(--color-v2-text-primary)] mb-6 leading-tight">
                  {feature.title}
                </h3>
                
                <ul className="space-y-3 mt-auto flex-1">
                  {feature.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-v2-text-secondary)]">
                      <Check size={16} className="text-[var(--color-v2-success)] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
