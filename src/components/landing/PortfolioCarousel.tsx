'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const portfolios = [
  {
    id: 1,
    title: "Developer Portfolio",
    desc: "Clean code. Great design. Real impact.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "MBA Portfolio",
    desc: "Leadership. Strategy. Results that matter.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Data Analyst Portfolio",
    desc: "Turning data into meaningful insights.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "UI/UX Designer Portfolio",
    desc: "Designs that are clean and intuitive.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
  }
];

export default function PortfolioCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === portfolios.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? portfolios.length - 1 : prev - 1));
  };

  return (
    <section id="portfolio-showcase" className="w-full bg-[#0B0D14] py-32 overflow-hidden border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-v2-primary)]/10 border border-[var(--color-v2-primary)]/20 text-xs font-bold uppercase tracking-widest text-[var(--color-v2-accent)] mb-6">
            Portfolio Showcase
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-black text-white tracking-tight mb-4">
            Beautiful Portfolios That Make You Stand Out
          </h2>
          <p className="text-gray-400">
            Modern, responsive websites built to impress recruiters and showcase your work.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full flex items-center justify-center">
          
          {/* Nav Buttons */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 z-30 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm -ml-4 lg:-ml-6"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="w-full max-w-6xl overflow-hidden relative pb-10">
            <motion.div 
              className="flex gap-6"
              animate={{ x: `calc(-${currentIndex * 100}% - ${currentIndex * 24}px)` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {portfolios.map((item, idx) => (
                <div key={item.id} className="min-w-full lg:min-w-[calc(33.333%-16px)] shrink-0 group perspective-1000">
                  <motion.div 
                    whileHover={{ rotateX: 5, rotateY: -5, scale: 1.02 }}
                    className="w-full bg-[#1A1D24] border border-white/10 rounded-2xl p-4 flex flex-col items-center transition-all duration-300 transform-style-3d shadow-2xl"
                  >
                    {/* Browser Mockup Window */}
                    <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden relative border border-white/10 shadow-inner">
                      {/* Browser Bar */}
                      <div className="h-6 w-full bg-[#2A2E39] flex items-center px-3 gap-1.5 absolute top-0 left-0 z-10 border-b border-white/5">
                        <div className="w-2 h-2 rounded-full bg-red-500/80"></div>
                        <div className="w-2 h-2 rounded-full bg-amber-500/80"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
                      </div>
                      <div className="w-full h-full pt-6 relative">
                        <Image 
                          src={item.image} 
                          alt={item.title} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-[var(--color-v2-primary)]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                          <span className="px-6 py-2 bg-white text-[var(--color-v2-primary)] font-bold rounded-full text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                            Live Preview <ExternalLink size={16} />
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 text-center w-full">
                      <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>

          <button 
            onClick={nextSlide}
            className="absolute right-0 z-30 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm -mr-4 lg:-mr-6"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="mt-12 text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-v2-accent)] hover:text-white transition-colors">
            View More Live Portfolios <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}

function ArrowRight(props: any) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
}
