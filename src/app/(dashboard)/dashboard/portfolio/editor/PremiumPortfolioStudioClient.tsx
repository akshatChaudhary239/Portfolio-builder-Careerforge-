'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { User, CareerProfile, Portfolio } from '@/db/local-db';
import { LiveEditorProvider, useLiveEditor } from '@/components/portfolio/editor/LiveEditorContext';
import PremiumLiveSidebarEditor from '@/components/portfolio/editor/PremiumLiveSidebarEditor';
import ProfileSyncBanner from '@/components/portfolio/editor/ProfileSyncBanner';
import PremiumPortfolioEngine from '@/components/portfolioTemplates/premium/PremiumPortfolioEngine';
import { 
  CloudLightning, ArrowLeft, Sparkles, CheckCircle2 
} from 'lucide-react';
import Link from 'next/link';
import { savePortfolioStudioConfigAction } from '../../actions';
import { generatePortfolioData } from '@/lib/portfolio-enhancements';
import { DEFAULT_SECTION_ORDER } from '@/types/portfolio-customization';

interface StudioProps {
  user: User;
  careerProfile: CareerProfile;
  portfolio: Portfolio;
}

function PremiumStudioInner({ 
  careerProfile, 
  portfolio,
  user
}: { 
  careerProfile: CareerProfile; 
  portfolio: Portfolio;
  user: User;
}) {
  const { customization } = useLiveEditor();
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'published'>('idle');

  // Auto-save draft customization configuration directly back to the database on change
  useEffect(() => {
    setSaveStatus('saving');
    const saveDraft = async () => {
      try {
        await savePortfolioStudioConfigAction(user.id, customization, undefined, undefined, portfolio.templateId);
        setSaveStatus('saved');
      } catch (err) {
        console.error('Auto-save error:', err);
      }
    };

    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [customization, user.id, portfolio.templateId]);

  const handlePublish = async () => {
    setPublishStatus('publishing');
    try {
      await savePortfolioStudioConfigAction(user.id, customization, customization, undefined, portfolio.templateId);
      setPublishStatus('published');
      setTimeout(() => setPublishStatus('idle'), 3000);
    } catch (err) {
      console.error('Publish error:', err);
      setPublishStatus('idle');
    }
  };

  // Dynamically merge profile with real-time enhancements state for zero-reload visual preview
  const currentEnhancements = customization.sections.global?.customProps?.enhancements || portfolio.enhancements;
  const enhancedProfile = generatePortfolioData(careerProfile, currentEnhancements);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-white font-sans selection:bg-amber-600 selection:text-white">
      {/* Top Studio Toolbar */}
      <header className="h-16 border-b border-amber-500/10 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard" 
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-amber-500" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="w-[1px] h-6 bg-white/10" />
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              <span>GetProspectra Premium Studio</span>
            </h1>
            <span className="bg-amber-500/20 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono border border-amber-500/20 animate-pulse">
              Premium V2
            </span>
          </div>
        </div>

        {/* Save & Publish Action Group */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className={`w-2 h-2 rounded-full ${saveStatus === 'saved' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
            <span>{saveStatus === 'saved' ? 'Saved just now' : 'Saving draft...'}</span>
          </div>

          <button
            onClick={handlePublish}
            disabled={publishStatus === 'publishing'}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-amber-700/50 text-white text-xs font-bold transition-all shadow-md shadow-amber-600/25 cursor-pointer"
          >
            {publishStatus === 'publishing' ? (
              <>
                <CloudLightning className="w-3.5 h-3.5 animate-bounce text-slate-950" />
                <span>Publishing...</span>
              </>
            ) : publishStatus === 'published' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                <span>Published Live!</span>
              </>
            ) : (
              <>
                <CloudLightning className="w-3.5 h-3.5" />
                <span>Publish Portfolio</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Studio Shell */}
      <div className="flex-1 flex overflow-hidden">
        {/* Visual Editing Canvas */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-950 flex flex-col items-center">
          <ProfileSyncBanner />
          
          <div className="w-full transition-all duration-300 border border-amber-500/10 rounded-3xl overflow-hidden shadow-2xl bg-slate-900 max-w-full min-h-screen">
            <PremiumPortfolioEngine 
              profile={enhancedProfile} 
              portfolio={portfolio} 
            />
          </div>
        </main>

        {/* Premium Studio Editor Panel */}
        <PremiumLiveSidebarEditor 
          templateId={portfolio.templateId || 'executive'} 
          careerProfile={enhancedProfile}
        />
      </div>
    </div>
  );
}

export default function PremiumPortfolioStudioClient({ user, careerProfile, portfolio }: StudioProps) {
  const mergedCustomization = useMemo(() => {
    const draft = portfolio.draftConfiguration || {};
    const dbSections: Record<string, any> = {};
    if (portfolio.sectionToggles) {
      Object.entries(portfolio.sectionToggles).forEach(([key, val]) => {
        dbSections[key] = {
          ...(draft.sections?.[key] || {}),
          visible: val
        };
      });
    }

    return {
      ...draft,
      sectionOrder: portfolio.sectionOrder || draft.sectionOrder || DEFAULT_SECTION_ORDER,
      sections: {
        ...(draft.sections || {}),
        ...dbSections
      }
    };
  }, [portfolio]);

  return (
    <LiveEditorProvider initialCustomization={mergedCustomization}>
      <PremiumStudioInner 
        careerProfile={careerProfile} 
        portfolio={portfolio} 
        user={user} 
      />
    </LiveEditorProvider>
  );
}
