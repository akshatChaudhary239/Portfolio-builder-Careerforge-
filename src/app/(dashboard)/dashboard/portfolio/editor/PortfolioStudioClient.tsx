'use client';

import React, { useState, useEffect } from 'react';
import { User, CareerProfile, Portfolio } from '@/db/local-db';
import { LiveEditorProvider, useLiveEditor } from '@/components/portfolio/editor/LiveEditorContext';
import LiveSidebarEditor from '@/components/portfolio/editor/LiveSidebarEditor';
import ProfileSyncBanner from '@/components/portfolio/editor/ProfileSyncBanner';
import BasePortfolioEngine from '@/components/portfolioTemplates/base/BasePortfolioEngine';
import { 
  Monitor, Tablet, Smartphone, CloudLightning, ArrowLeft, 
  Sparkles, CheckCircle2, History, RotateCcw 
} from 'lucide-react';
import Link from 'next/link';
import { savePortfolioStudioConfigAction } from '../../actions';
import { generatePortfolioData } from '@/lib/portfolio-enhancements';

interface StudioProps {
  user: User;
  careerProfile: CareerProfile;
  portfolio: Portfolio;
}

function StudioInner({ 
  careerProfile, 
  portfolio,
  user
}: { 
  careerProfile: CareerProfile; 
  portfolio: Portfolio;
  user: User;
}) {
  const { customization, updateSectionCustomization } = useLiveEditor();
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'published'>('idle');

  // Auto-save draft customization configuration directly back to the database on change
  useEffect(() => {
    setSaveStatus('saving');
    const saveDraft = async () => {
      try {
        await savePortfolioStudioConfigAction(user.id, customization);
        setSaveStatus('saved');
      } catch (err) {
        console.error('Auto-save error:', err);
      }
    };

    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [customization, user.id]);

  const handlePublish = async () => {
    setPublishStatus('publishing');
    try {
      await savePortfolioStudioConfigAction(user.id, customization, customization);
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
    <div className="min-h-screen bg-slate-950 flex flex-col text-white font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Studio Toolbar */}
      <header className="h-16 border-b border-white/10 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard" 
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="w-[1px] h-6 bg-white/10" />
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-white">GetProspectra Studio</h1>
            <span className="bg-indigo-500/20 text-indigo-300 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
              V2 Engine
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700/50 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/25 cursor-pointer"
          >
            {publishStatus === 'publishing' ? (
              <>
                <CloudLightning className="w-3.5 h-3.5 animate-bounce" />
                <span>Publishing...</span>
              </>
            ) : publishStatus === 'published' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
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
          
          <div className="w-full transition-all duration-300 border border-white/5 rounded-3xl overflow-hidden shadow-2xl bg-slate-900 max-w-full min-h-screen">
            <BasePortfolioEngine 
              profile={enhancedProfile} 
              portfolio={portfolio} 
            />
          </div>
        </main>

        {/* Dynamic Studio Editor Panel */}
        <LiveSidebarEditor 
          templateId={portfolio.templateId || 'dev'} 
          careerProfile={enhancedProfile}
        />
      </div>
    </div>
  );
}

export default function PortfolioStudioClient({ user, careerProfile, portfolio }: StudioProps) {
  return (
    <LiveEditorProvider initialCustomization={portfolio.draftConfiguration || portfolio.customization}>
      <StudioInner 
        careerProfile={careerProfile} 
        portfolio={portfolio} 
        user={user} 
      />
    </LiveEditorProvider>
  );
}
