'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { User, CareerProfile, Portfolio } from '@/db/local-db';
import { LiveEditorProvider, useLiveEditor } from '@/components/portfolio/editor/LiveEditorContext';
import PremiumLiveSidebarEditor from '@/components/portfolio/editor/PremiumLiveSidebarEditor';
import ProfileSyncBanner from '@/components/portfolio/editor/ProfileSyncBanner';
import PremiumPortfolioEngine from '@/components/portfolioTemplates/premium/PremiumPortfolioEngine';
import { 
  CloudLightning, ArrowLeft, Sparkles, CheckCircle2, X 
} from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';
import { savePortfolioStudioConfigAction } from '../../actions';
import { generatePortfolioData } from '@/lib/portfolio-enhancements';
import { DEFAULT_SECTION_ORDER } from '@/types/portfolio-customization';

interface StudioProps {
  user: User;
  careerProfile: CareerProfile;
  portfolio: Portfolio;
  hasPremium: boolean;
}

function PremiumStudioInner({ 
  careerProfile, 
  portfolio,
  user,
  hasPremium
}: { 
  careerProfile: CareerProfile; 
  portfolio: Portfolio;
  user: User;
  hasPremium: boolean;
}) {
  const { customization } = useLiveEditor();
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'published'>('idle');

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeStep, setUpgradeStep] = useState<0 | 1 | 2>(0); // 0 = checkout prompt, 1 = verifying, 2 = success

  const premiumTemplates = ['executive', 'product_builder', 'interactive_showcase', 'product'];
  const previewTemplateId = premiumTemplates.includes(portfolio.templateId || '') 
    ? (portfolio.templateId as any) 
    : 'interactive_showcase';

  // Auto-save draft customization configuration directly back to the database on change (only if upgraded)
  useEffect(() => {
    if (!hasPremium) return;
    setSaveStatus('saving');
    const saveDraft = async () => {
      try {
        await savePortfolioStudioConfigAction(user.id, customization, undefined, undefined, previewTemplateId);
        setSaveStatus('saved');
      } catch (err) {
        console.error('Auto-save error:', err);
      }
    };

    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [customization, user.id, previewTemplateId, hasPremium]);

  const handlePublish = async () => {
    setPublishStatus('publishing');
    try {
      await savePortfolioStudioConfigAction(user.id, customization, customization, undefined, previewTemplateId);
      setPublishStatus('published');
      setTimeout(() => setPublishStatus('idle'), 3000);
    } catch (err) {
      console.error('Publish error:', err);
      setPublishStatus('idle');
    }
  };

  const onPublishClick = () => {
    if (!hasPremium) {
      setShowUpgradeModal(true);
    } else {
      handlePublish();
    }
  };

  const handlePremiumCheckout = async () => {
    setIsProcessingPayment(true);
    try {
      const { createRazorpayOrderAction, verifyRazorpayPaymentAction } = await import('../../actions');
      const order = await createRazorpayOrderAction(user.id);
      
      if (!order.success || !order.orderId) {
        throw new Error(order.error || 'Failed to create Razorpay Order.');
      }
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_dummykey',
        amount: (order.amount || 199) * 100,
        currency: 'INR',
        name: 'GetProspectra Premium',
        description: 'Unlock Premium Layouts & Features',
        order_id: order.orderId,
        handler: async function (response: any) {
          try {
            setUpgradeStep(1);
            setShowUpgradeModal(true);
            
            await verifyRazorpayPaymentAction(user.id, response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature || '');
            
            // Save customization draft & publish active template to DB upon success
            await savePortfolioStudioConfigAction(user.id, customization, customization, undefined, previewTemplateId);
            
            setUpgradeStep(2);
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } catch(e: any) {
            alert(`Payment verification failed: ${e.message || 'Unknown error'}`);
            setUpgradeStep(0);
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: careerProfile.personalInfo?.fullName || user.name,
          email: careerProfile.personalInfo?.email || user.email,
        },
        theme: {
          color: '#1f2022'
        },
        modal: {
          ondismiss: function() {
            setIsProcessingPayment(false);
          }
        }
      };
      
      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error(err);
      alert(`Failed to initiate premium checkout: ${err.message || 'Unknown error'}`);
      setIsProcessingPayment(false);
    }
  };

  // Dynamically merge profile with real-time enhancements state for zero-reload visual preview
  const currentEnhancements = customization.sections.global?.customProps?.enhancements || portfolio.enhancements;
  const enhancedProfile = generatePortfolioData(careerProfile, currentEnhancements);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-white font-sans selection:bg-amber-600 selection:text-white">
      {!hasPremium && <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />}

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
              {hasPremium ? 'Premium V2' : 'Sandbox V2'}
            </span>
          </div>
        </div>

        {/* Save & Publish Action Group */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            {hasPremium ? (
              <>
                <span className={`w-2 h-2 rounded-full ${saveStatus === 'saved' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                <span>{saveStatus === 'saved' ? 'Saved just now' : 'Saving draft...'}</span>
              </>
            ) : (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-wider">
                Sandbox Mode
              </span>
            )}
          </div>

          <button
            onClick={onPublishClick}
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
                <span>{hasPremium ? 'Publish Portfolio' : 'Upgrade to Publish'}</span>
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

          {/* Locked Premium Banner Overlay for Sandbox previews */}
          {!hasPremium && (
            <div className="w-full max-w-5xl mb-6 bg-slate-900/80 backdrop-blur-md border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xl shadow-amber-500/5 animate-in slide-in-from-top duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Premium Visual Sandbox Mode</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Customize typography, section paradigms, and color tokens. Upgrade to activate and host this premium template live!</p>
                </div>
              </div>
              <button
                onClick={handlePremiumCheckout}
                disabled={isProcessingPayment}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md shadow-amber-500/10 cursor-pointer shrink-0"
              >
                Unlock Premium (49/- INR)
              </button>
            </div>
          )}
          
          <div className="w-full transition-all duration-300 border border-amber-500/10 rounded-3xl overflow-hidden shadow-2xl bg-slate-900 max-w-full min-h-screen">
            <PremiumPortfolioEngine 
              profile={enhancedProfile} 
              portfolio={{ ...portfolio, templateId: previewTemplateId }} 
            />
          </div>
        </main>

        {/* Premium Studio Editor Panel */}
        <PremiumLiveSidebarEditor 
          templateId={previewTemplateId} 
          careerProfile={enhancedProfile}
        />
      </div>

      {/* Premium Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            onClick={() => !isProcessingPayment && setShowUpgradeModal(false)} 
            className="absolute inset-0 cursor-default" 
          />
          <div className="bg-slate-900 border border-amber-500/20 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200 text-white">
            <button 
              onClick={() => !isProcessingPayment && setShowUpgradeModal(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors p-1 cursor-pointer disabled:opacity-50"
              disabled={isProcessingPayment}
            >
              <X size={18} />
            </button>
            
            {upgradeStep === 0 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4 mx-auto border border-amber-500/20">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="font-bold text-lg text-white font-serif">Unlock Premium Studio</h3>
                  <p className="text-xs text-slate-400 mt-1">Get immediate live access to publish your custom layouts</p>
                </div>
                
                <div className="bg-slate-950/50 rounded-2xl p-4 border border-white/5 space-y-3">
                  <div className="flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="text-amber-500 font-bold">•</span>
                    <span><strong>Publish Executive & Interactive layouts</strong> live on your subdomain.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="text-amber-500 font-bold">•</span>
                    <span><strong>Save customizations</strong>, section orders, design flavors, and typography packs.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="text-amber-500 font-bold">•</span>
                    <span><strong>Export Recruiter-Grade Resumes</strong> (Balanced & Leadership layouts) without watermarks.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="text-amber-500 font-bold">•</span>
                    <span><strong>AI Interview Simulator</strong> with custom questions.</span>
                  </div>
                </div>
                
                <div className="text-center pt-2">
                  <div className="text-xs text-slate-400 mb-3">One-time payment of <strong className="text-white text-sm font-semibold">49/- INR</strong></div>
                  <button 
                    onClick={handlePremiumCheckout}
                    disabled={isProcessingPayment}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/10 disabled:opacity-50"
                  >
                    {isProcessingPayment ? 'Initiating Checkout...' : 'Upgrade Workspace Now'}
                  </button>
                </div>
              </div>
            )}
            
            {upgradeStep === 1 && (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-300 font-medium">Verifying payment signature...</p>
              </div>
            )}
            
            {upgradeStep === 2 && (
              <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle2 size={28} />
                </div>
                <h4 className="font-bold text-base text-white font-serif">Workspace Upgraded!</h4>
                <p className="text-xs text-slate-400">Saving customized template and reloading editor...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PremiumPortfolioStudioClient({ user, careerProfile, portfolio, hasPremium }: StudioProps) {
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
        hasPremium={hasPremium}
      />
    </LiveEditorProvider>
  );
}
