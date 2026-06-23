'use client';

import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, FileText, Globe, ThumbsUp } from 'lucide-react';

function Counter({ from, to, suffix = "", duration = 2 }: { from: number, to: number, suffix?: string, duration?: number }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / (duration * 1000), 1);
      
      // Easing function (easeOutQuart)
      const easeOut = 1 - Math.pow(1 - percentage, 4);
      const currentVal = Math.floor(from + (to - from) * easeOut);
      
      setCount(currentVal);
      
      if (percentage < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(to);
      }
    };
    
    requestAnimationFrame(updateCount);
  }, [from, to, duration, isInView]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function SocialProofBar() {
  const stats = [
    { icon: Users, value: 43, suffix: "+", label: "Career Profiles Created", color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { icon: FileText, value: 91, suffix: "+", label: "Resumes Generated", color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { icon: Globe, value: 27, suffix: "+", label: "Portfolio Websites Published", color: "text-amber-400", bg: "bg-amber-500/10" },
    { icon: ThumbsUp, value: 98, suffix: "%", label: "Users Recommend Us", color: "text-rose-400", bg: "bg-rose-500/10" }
  ];

  return (
    <section className="w-full bg-[var(--color-v2-bg)] px-6 lg:px-12 pb-20">
      <div className="max-w-[1400px] mx-auto bg-[var(--color-v2-dark)] rounded-2xl md:rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-v2-primary)]/10 via-transparent to-[var(--color-v2-accent)]/10" />
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative z-10">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-black text-white tracking-tight">
                    <Counter from={0} to={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-[11px] md:text-sm text-gray-400 font-medium mt-1 uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
