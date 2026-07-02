'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Eye, RefreshCw, LayoutTemplate, Briefcase, Zap, Check } from 'lucide-react';
import { IdentityStack, Portfolio } from '@/db/local-db';
import { useRouter } from 'next/navigation';

interface PremiumPortfolioSitesProps {
  premiumStack: IdentityStack;
  portfolio?: Portfolio;
  onTemplateChange?: (templateId: 'dev' | 'corporate' | 'creative' | 'executive' | 'product_builder' | 'interactive_showcase') => void;
}

export function PremiumPortfolioSites({ premiumStack, portfolio, onTemplateChange }: PremiumPortfolioSitesProps) {
  const router = useRouter();

  const themes = [
    {
      id: 'interactive_showcase',
      name: 'Premium Site',
      icon: Zap,
      focus: 'Creative presentation, Advanced animations',
      desc: 'A modern, vibrant showcase with dynamic layouts, micro-interactions, and bold visual storytelling.',
      color: 'text-purple-600',
      bg: 'bg-purple-600/10',
    }
  ];

  const handleRegenerate = () => {
    router.push('/dashboard/premium/generate?sessionId=' + premiumStack.generationSessionId);
  };

  const handleOpenSite = (themeId: string) => {
    if (portfolio?.subdomain) {
      window.open(`/u/${portfolio.subdomain}?theme=${themeId}`, '_blank');
    } else {
      alert("Please configure your public subdomain in the standard Portfolio section first.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 no-print"
    >
      <div className="bg-white border border-warm-border rounded-2xl p-6 md:p-8 shadow-xs">
        <h2 className="text-xl font-serif font-semibold text-primary mb-1">Premium Portfolio Themes</h2>
        <p className="text-xs text-primary-light mb-8 max-w-2xl">
          Instantly transform your live portfolio site with these exclusive premium layouts. Each theme is engineered to highlight different facets of your professional identity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {themes.map(theme => {
            const Icon = theme.icon;
            return (
              <div key={theme.id} className="group border border-warm-border rounded-2xl bg-white hover:shadow-xl hover:shadow-brand/5 hover:border-brand/20 transition-all duration-300 flex flex-col overflow-hidden">
                <div className="h-32 bg-warm-bg relative flex items-center justify-center border-b border-warm-border">
                  <div className={`absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${theme.bg} ${theme.color}`}>
                    Premium
                  </div>
                  <Icon size={40} className={`opacity-20 ${theme.color}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent"></div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h4 className="font-bold text-primary text-base mb-1">{theme.name}</h4>
                  <p className="text-[10px] font-semibold text-brand uppercase tracking-wider mb-2">Focus: {theme.focus}</p>
                  <p className="text-[11px] text-primary-light leading-relaxed mb-6 flex-1">
                    {theme.desc}
                  </p>
                  
                  <div className="space-y-2 mt-auto">
                    <div className="flex items-center gap-2">
                      {portfolio?.templateId === theme.id ? (
                        <span className="flex-1 py-2 text-xs font-bold text-brand bg-brand/10 border border-brand/20 rounded-xl flex items-center justify-center gap-1 select-none">
                          <Check size={14} /> Active
                        </span>
                      ) : (
                        <button 
                          onClick={() => onTemplateChange?.(theme.id as any)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-primary border border-warm-border hover:bg-warm-bg transition-colors cursor-pointer bg-white"
                        >
                          Activate
                        </button>
                      )}
                      <button 
                        onClick={() => handleRegenerate()}
                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-warm-border bg-warm-bg text-primary hover:bg-white transition-colors cursor-pointer"
                        title="Regenerate Assets"
                      >
                        <RefreshCw size={14} />
                      </button>
                    </div>

                    <button 
                      onClick={() => handleOpenSite(theme.id)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-light transition-colors cursor-pointer"
                    >
                      <ExternalLink size={14} /> Open Site
                    </button>

                    {portfolio?.templateId === theme.id && (
                      <button 
                        onClick={() => router.push(`/dashboard/portfolio/editor?premium=true&templateId=${theme.id}`)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all cursor-pointer border border-amber-500/20 shadow-sm shadow-amber-500/10 font-bold"
                      >
                        🛠️ Customize Premium Layout
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
