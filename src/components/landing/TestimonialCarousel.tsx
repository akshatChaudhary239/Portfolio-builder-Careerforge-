'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Senior Product Manager",
    company: "TechNova",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    quote: "My resume finally represented my actual capabilities. The difference in response rate from recruiters was night and day."
  },
  {
    name: "David Chen",
    role: "Full Stack Engineer",
    company: "Stratos",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    quote: "The developer portfolio it generated was absolutely stunning. I didn't have to write a single line of CSS, yet it looks totally custom."
  },
  {
    name: "Aisha Patel",
    role: "Data Scientist",
    company: "Quantico",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    quote: "The interview prep kit was scarily accurate. Three of the technical questions it predicted were asked word-for-word in my final loop."
  }
];

export default function TestimonialCarousel() {
  return (
    <section className="w-full py-32 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-v2-primary)]/5 border border-[var(--color-v2-primary)]/10 text-xs font-bold uppercase tracking-widest text-[var(--color-v2-primary)] mb-6">
            Success Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-black text-[var(--color-v2-text-primary)] tracking-tight">
            Loved By Ambitious Professionals
          </h2>
        </div>

        {/* Carousel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className="bg-[var(--color-v2-bg)] rounded-2xl p-8 border border-[var(--color-v2-border)] flex flex-col relative"
            >
              {/* Quote Mark */}
              <div className="absolute top-6 right-8 text-6xl font-serif text-[var(--color-v2-primary)]/10 leading-none">
                "
              </div>
              
              <div className="flex-1">
                <p className="text-[var(--color-v2-text-secondary)] leading-relaxed relative z-10 font-medium">
                  "{test.quote}"
                </p>
              </div>
              
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-[var(--color-v2-border)] relative z-10">
                <div className="w-12 h-12 rounded-full overflow-hidden relative border border-[var(--color-v2-border)]">
                  <Image src={test.image} alt={test.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-[var(--color-v2-text-primary)] text-sm">{test.name}</h4>
                  <p className="text-[11px] text-[var(--color-v2-text-secondary)]">{test.role} @ {test.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
