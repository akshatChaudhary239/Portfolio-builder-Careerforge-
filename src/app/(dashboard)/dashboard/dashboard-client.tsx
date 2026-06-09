'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, FileText, Globe, GraduationCap, Layout, 
  ExternalLink, Check, RefreshCw, Printer, LogOut,
  ChevronRight, Award, Layers, Plus, Trash2, Eye, EyeOff, Brain, Sparkles, BookOpen,
  ChevronUp, ChevronDown, Edit3, Lock, TrendingUp
} from 'lucide-react';
import { User as DBUser, CareerProfile, Portfolio, InterviewQuestion, IdentityStack, GeneratedAsset } from '@/db/local-db';
import { updateCareerProfileAction, updatePortfolioAction, logoutAction, resetProfileAction } from './actions';
import {
  ResumeHeader,
  ResumeSummary,
  ResumeSkills,
  ResumeExperience,
  ResumeProjects,
  ResumeEducation,
  ResumeCertifications,
  ResumeAchievements
} from './resume-renderers';
import { PremiumOverview } from '@/components/premium/PremiumOverview';
import { PremiumResumes } from '@/components/premium/PremiumResumes';
import { PremiumPortfolioSites } from '@/components/premium/PremiumPortfolioSites';
import { PremiumInterviewPrep } from '@/components/premium/PremiumInterviewPrep';
import { PremiumCareerInsights } from '@/components/premium/PremiumCareerInsights';

interface DashboardClientProps {
  user: DBUser;
  initialCareerProfile: CareerProfile;
  initialPortfolio?: Portfolio;
  initialInterviewQuestions: InterviewQuestion[];
  initialIdentityStacks?: IdentityStack[];
  initialGeneratedAssets?: GeneratedAsset[];
}

export default function DashboardClient({
  user,
  initialCareerProfile,
  initialPortfolio,
  initialInterviewQuestions,
  initialIdentityStacks = [],
  initialGeneratedAssets = []
}: DashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTabFromUrl = searchParams.get('tab') as any;

  const [activeTab, setActiveTab] = useState<
    'overview' | 'resume' | 'portfolio' | 'interview' | 'insights' |
    'premium_overview' | 'premium_resumes' | 'premium_portfolios' | 'premium_interview' | 'premium_insights'
  >(initialTabFromUrl || 'overview');
  
  // Identity Stacks State
  const [identityStacks, setIdentityStacks] = useState<IdentityStack[]>(initialIdentityStacks);
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>(initialGeneratedAssets);
  
  const [careerProfile, setCareerProfile] = useState<CareerProfile>(initialCareerProfile);
  const [portfolio, setPortfolio] = useState<Portfolio | undefined>(initialPortfolio);
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>(initialInterviewQuestions);

  // Figure out initial active stack for the current profile
  const validStacks = identityStacks.filter(s => s.profileId === careerProfile.id);
  
  const defaultStackId = validStacks.find(s => s.isActive)?.id || validStacks[0]?.id || null;
  const [activeStackId, setActiveStackId] = useState<string | null>(defaultStackId);

  // Premium Workspace State
  // Sort to get the most recent premium stack if there are multiple
  const userPremiumStacks = validStacks.filter(s => s.generationTier === 'premium').sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  const premiumStack = userPremiumStacks[0];
  const hasPremium = !!premiumStack;
  const [isPremiumWorkspaceOpen, setIsPremiumWorkspaceOpen] = useState(hasPremium);

  const handleMoveSection = (idx: number, direction: 'up' | 'down') => {
    if (!portfolio) return;
    const currentOrder = portfolio.sectionOrder || ['hero', 'skills', 'experience', 'education', 'projects', 'certifications', 'achievements', 'publications', 'workSamples'];
    const newOrder = [...currentOrder];
    if (direction === 'up' && idx > 0) {
      const temp = newOrder[idx];
      newOrder[idx] = newOrder[idx - 1];
      newOrder[idx - 1] = temp;
    } else if (direction === 'down' && idx < newOrder.length - 1) {
      const temp = newOrder[idx];
      newOrder[idx] = newOrder[idx + 1];
      newOrder[idx + 1] = temp;
    } else {
      return;
    }
    const updated = { ...portfolio, sectionOrder: newOrder };
    setPortfolio(updated);
    updatePortfolioAction(updated);
  };

  
  const handlePremiumCheckout = async () => {
    setIsProcessingPayment(true);
    try {
      // 1. Create order
      const { createRazorpayOrderAction, verifyRazorpayPaymentAction } = await import('./actions');
      const order = await createRazorpayOrderAction(user.id);
      
      if (!order.success || !order.orderId) {
        throw new Error(order.error || 'Failed to create Razorpay Order. Ensure Razorpay keys are configured in your Vercel environment variables.');
      }
      
      // 2. Initialize Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_dummykey', // Fallback for local testing
        amount: (order.amount || 199) * 100,
        currency: 'INR',
        name: 'CareerForge Premium',
        description: 'One-Time Premium Generation Package',
        order_id: order.orderId,
        handler: async function (response: any) {
          try {
            setPremiumModalStep(0);
            setShowPremiumFlowModal(true);
            
            await verifyRazorpayPaymentAction(user.id, response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature || '');
            setPremiumModalStep(1);
          } catch(e: any) {
            alert(`Payment verification failed: ${e.message || 'Unknown error'}`);
            setShowPremiumFlowModal(false);
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

  
  const handleStartFromScratch = () => {
    // Navigate to onboarding with premium intent flag
    router.push('/onboarding?mode=premium_new');
  };

  const handleUseExisting = () => {
    setPremiumModalStep(2);
  };
  
  const handleContinueAsIs = async () => {
    if (!careerProfile) {
      alert("You don't have an existing profile. Please Start From Scratch.");
      return;
    }
    setShowPremiumFlowModal(false);
    // Start Premium Generation Session immediately
    try {
      const { startPremiumGenerationSessionAction } = await import('./actions');
      const res = await startPremiumGenerationSessionAction(user.id, careerProfile.id);
      if(res.success) {
         // redirect to generation page
         router.push('/dashboard/premium/generate?sessionId=' + res.sessionId);
      }
    } catch(err: any) {
      alert(err.message || err);
    }
  };
  
  const handleEditBeforeGenerating = () => {
    if (!careerProfile) {
      alert("You don't have an existing profile. Please Start From Scratch.");
      return;
    }
    // Navigate to edit mode but with premium intent flag
    router.push('/profile/edit?mode=premium_edit');
  };

  const handleRenameSection = (key: string, title: string) => {
    if (!portfolio) return;
    const updatedTitles = { ...portfolio.sectionTitles, [key]: title };
    const updated = { ...portfolio, sectionTitles: updatedTitles };
    setPortfolio(updated);
    updatePortfolioAction(updated);
  };
  
  
  // Razorpay Premium State
  const [showPremiumFlowModal, setShowPremiumFlowModal] = useState(false);
  const [premiumModalStep, setPremiumModalStep] = useState(0); // 0 = start, 1 = pick, 2 = confirmation
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [premiumResumeVariant, setPremiumResumeVariant] = useState<'leadership' | 'technical' | 'recruiter'>('leadership');
  
  const [dbHasGeneratedAssets, setDbHasGeneratedAssets] = useState(false);
  React.useEffect(() => {
    const checkAssets = async () => {

      try {
        const { getGeneratedAssetsByUserIdAction } = await import('./actions');
        const assets = await getGeneratedAssetsByUserIdAction(user.id);
        if (assets && assets.length > 0) setDbHasGeneratedAssets(true);
      } catch (err) {}
    };
    checkAssets();
  }, [user.id]);




  // Status states
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Practiced questions and copy clipboard state
  const [practicedQuestions, setPracticedQuestions] = useState<Record<string, boolean>>({});
  const [copiedQuestionId, setCopiedQuestionId] = useState<string | null>(null);

  React.useEffect(() => {
    const saved = localStorage.getItem(`practiced_questions_${user.id}`);
    if (saved) {
      try {
        setPracticedQuestions(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, [user.id]);

  const togglePracticed = (qId: string) => {
    setPracticedQuestions(prev => {
      const updated = { ...prev, [qId]: !prev[qId] };
      localStorage.setItem(`practiced_questions_${user.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  const handleCopyQuestion = (qText: string, qId: string) => {
    navigator.clipboard.writeText(qText);
    setCopiedQuestionId(qId);
    setTimeout(() => setCopiedQuestionId(null), 2000);
  };

  // Resume editing inputs helper
  const handleDataChange = (field: keyof CareerProfile, val: any) => {
    setCareerProfile(prev => ({ ...prev, [field]: val }));
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await updateCareerProfileAction(careerProfile);
      if (portfolio) {
        await updatePortfolioAction(portfolio);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error(err);
      alert('Failed to save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  const handlePortfolioTemplateChange = (templateId: 'dev' | 'corporate' | 'creative' | 'executive' | 'product_builder' | 'interactive_showcase' | 'interactive') => {
    if (!portfolio) return;

    if (['executive', 'product_builder', 'interactive', 'interactive_showcase'].includes(templateId) && !hasPremium) {
      alert('This is a Premium template. Please upgrade your workspace to use it.');
      return;
    }

    const updated = { ...portfolio, templateId: templateId as any };
    setPortfolio(updated);
    updatePortfolioAction(updated);
  };

  const handlePortfolioToggle = (key: keyof Portfolio['sectionToggles']) => {
    if (!portfolio) return;
    const updatedToggles = { ...portfolio.sectionToggles, [key]: !portfolio.sectionToggles[key] };
    const updated = { ...portfolio, sectionToggles: updatedToggles };
    setPortfolio(updated);
    updatePortfolioAction(updated);
  };

  const triggerPDFExport = () => {
    window.print();
  };

  // Interview Card Helper State
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      {/* Sidebar Nav */}
      <aside className="no-print lg:col-span-1 space-y-4">
        <div className="bg-white border border-warm-border rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-warm-border">
            <div className="w-10 h-10 rounded-xl bg-warm-bg border border-warm-border flex items-center justify-center text-primary font-bold">
              {careerProfile.personalInfo.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="font-semibold text-primary text-sm leading-none">{careerProfile.personalInfo.fullName}</h3>
              <span className="text-[10px] text-primary-light font-medium mt-1 block">
                {careerProfile.professionCategory}
              </span>
            </div>
          </div>

          {/* Premium Workspace Section */}
          <div className="mb-6">
            <button 
              onClick={() => setIsPremiumWorkspaceOpen(!isPremiumWorkspaceOpen)}
              className="w-full flex items-center justify-between px-2 mb-2 group cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles size={12} className={hasPremium ? "text-brand" : "text-gray-400"} />
                <h4 className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${hasPremium ? "text-brand" : "text-primary-light"}`}>
                  Premium Workspace
                </h4>
              </div>
              {hasPremium && (
                <ChevronDown size={14} className={`text-primary-light transition-transform ${isPremiumWorkspaceOpen ? "rotate-180" : ""}`} />
              )}
            </button>
            
            {hasPremium ? (
              <AnimatePresence initial={false}>
                {isPremiumWorkspaceOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <nav className="space-y-1 mt-2 pl-2 border-l-2 border-brand/20 ml-3">
                      {[
                        { id: 'premium_overview', label: 'Overview', icon: Layout },
                        { id: 'premium_resumes', label: 'Premium Resumes', icon: FileText },
                        { id: 'premium_portfolios', label: 'Portfolio Sites', icon: Globe },
                        { id: 'premium_interview', label: 'Interview Prep Kit', icon: Brain },
                        { id: 'premium_insights', label: 'Career Insights', icon: Sparkles },
                      ].map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                              isActive 
                                ? 'bg-brand/10 text-brand shadow-sm border border-brand/20' 
                                : 'text-primary-light hover:bg-warm-bg hover:text-primary border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon size={14} className={isActive ? 'text-brand' : ''} />
                              {tab.label}
                            </div>
                          </button>
                        );
                      })}
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>
            ) : (
              <div className="px-2 mt-2">
                <div className="bg-gradient-to-br from-[#0B0F19] to-[#111827] border border-white/10 p-3 rounded-xl shadow-md text-center">
                  <h5 className="text-[10px] font-bold text-white uppercase tracking-wider mb-1 flex justify-center items-center gap-1">
                    <Award size={10} className="text-amber-500" /> Unlock Premium
                  </h5>
                  <p className="text-[9px] text-gray-400 mb-2 leading-tight">Get multiple resume variants, executive portfolios & AI interview prep.</p>
                  <button 
                    onClick={handlePremiumCheckout}
                    className="w-full py-1.5 px-2 rounded-lg text-[9px] font-bold text-white bg-brand hover:bg-brand-hover transition-colors shadow-sm"
                  >
                    Upgrade Now
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mb-3 px-2">
            <h4 className="text-[10px] font-bold text-primary-light uppercase tracking-wider">Stack Views</h4>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: Layout },
              { id: 'resume', label: 'Premium Resume', icon: FileText },
              { id: 'portfolio', label: 'Portfolio site', icon: Globe },
              { id: 'interview', label: 'Interview Prep Kit', icon: Brain },
              { id: 'insights', label: 'Career Insights', icon: Sparkles },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-primary text-white shadow-xs' 
                      : 'text-primary-light hover:bg-warm-bg hover:text-primary'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={14} />
                    {tab.label}
                  </div>
                  {isActive && <ChevronRight size={12} className="text-white" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Global Save Controls */}
        <div className="bg-white border border-warm-border rounded-2xl p-4 shadow-xs space-y-3">
          <button
            onClick={() => router.push('/dashboard/portfolio/enhance')}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-brand bg-brand/10 hover:bg-brand/20 transition-colors cursor-pointer border border-brand/20"
          >
            <Sparkles size={14} /> Enhance Portfolio
          </button>
          <button
            onClick={() => router.push('/profile/edit')}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <Edit3 size={14} /> Edit Profile
          </button>
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-light disabled:opacity-50 transition-colors cursor-pointer"
          >
            {saving ? (
              <>
                <RefreshCw size={12} className="animate-spin" /> Saving...
              </>
            ) : saveSuccess ? (
              <>
                <Check size={12} className="text-emerald-400" /> Changes Saved!
              </>
            ) : (
              'Save All Changes'
            )}
          </button>

          <button
            type="button"
            onClick={async () => {
              if (confirm("Are you sure you want to reset your portfolio and career profile? This will clear all parsed data, resume settings, customized section order/titles, and interview kits so you can start the wizard completely fresh to test a new profession.")) {
                setSaving(true);
                await resetProfileAction(user.id);
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 border border-warm-border rounded-xl text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100/70 transition-colors cursor-pointer"
          >
            <RefreshCw size={12} />
            Start Over / Re-Onboard
          </button>

          <form action={logoutAction} className="w-full">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 border border-warm-border rounded-xl text-xs font-semibold text-red-600 bg-white hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut size={12} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Tab Screen */}
      <section className="lg:col-span-3 flex flex-col gap-4">
        {(() => {
          const activeStack = validStacks.find(s => s.id === activeStackId);
          if (activeStack && activeStack.generationTier === 'premium') {
            const isOutdated = activeStack.profileVersion !== careerProfile.createdAt;
            if (isOutdated) {
              return (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <Brain className="text-amber-600" size={20} />
                    <div>
                      <h4 className="font-semibold text-sm">Outdated Identity Stack</h4>
                      <p className="text-xs mt-0.5">Your base profile has been edited since this premium stack was generated. The assets below may not reflect your latest changes.</p>
                    </div>
                  </div>
                  <button 
                    onClick={handlePremiumCheckout}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer"
                  >
                    Regenerate Stack
                  </button>
                </div>
              );
            }
          }
          return null;
        })()}
        
        <AnimatePresence mode="wait">
          {/* PREMIUM TABS */}
          {activeTab === 'premium_overview' && premiumStack && (
            <PremiumOverview 
              key="premium_overview"
              careerProfile={careerProfile} 
              premiumStack={premiumStack} 
              setActiveTab={setActiveTab} 
            />
          )}
          {activeTab === 'premium_resumes' && premiumStack && (
            <PremiumResumes
              key="premium_resumes"
              careerProfile={careerProfile}
              generatedAssets={generatedAssets}
              premiumStack={premiumStack}
              portfolio={portfolio}
            />
          )}
          {activeTab === 'premium_portfolios' && premiumStack && (
            <PremiumPortfolioSites
              key="premium_portfolios"
              premiumStack={premiumStack}
              portfolio={portfolio}
              onTemplateChange={handlePortfolioTemplateChange}
            />
          )}
          {activeTab === 'premium_interview' && premiumStack && (
            <PremiumInterviewPrep
              key="premium_interview"
              questions={interviewQuestions}
            />
          )}
          {activeTab === 'premium_insights' && premiumStack && (
            <PremiumCareerInsights
              key="premium_insights"
              premiumStack={premiumStack}
              generatedAssets={generatedAssets}
            />
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 no-print"
            >
              <div className="bg-white border border-warm-border rounded-2xl p-6 md:p-8 shadow-xs">
                <h1 className="text-2xl font-serif font-semibold text-primary">
                  Professional Identity Overview
                </h1>
                <p className="text-xs text-primary-light mt-1 max-w-xl">
                  CareerForge has packaged your details into standardized, recruiter-friendly assets. Review your package below:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  {/* Resume Card */}
                  <div className="border border-warm-border p-5 rounded-xl bg-warm-bg flex flex-col justify-between">
                    <div>
                      <FileText className="text-brand mb-3" size={24} />
                      <h4 className="font-semibold text-primary text-sm">Recruiter Resume</h4>
                      <p className="text-[11px] text-primary-light mt-1 leading-relaxed">
                        High-polish minimalist layout designed for reading clarity and print formatting.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('resume')}
                      className="mt-4 text-xs font-bold text-brand hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Configure Resume <ChevronRight size={12} />
                    </button>
                  </div>

                  {/* Portfolio Card */}
                  <div className="border border-warm-border p-5 rounded-xl bg-warm-bg flex flex-col justify-between">
                    <div>
                      <Globe className="text-accent-sage mb-3" size={24} />
                      <h4 className="font-semibold text-primary text-sm">Dynamic Portfolio</h4>
                      {portfolio ? (
                        <>
                          <p className="text-[11px] text-primary-light mt-1 leading-relaxed">
                            Active template: <strong className="capitalize">{portfolio.templateId}</strong>. Visible at:
                          </p>
                          <a
                            href={`/u/${portfolio.subdomain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-mono text-brand block mt-1 underline truncate"
                          >
                            platform.com/u/{portfolio.subdomain}
                          </a>
                        </>
                      ) : (
                        <p className="text-[11px] text-primary-light mt-1 leading-relaxed">
                          Portfolio website configuration is pending.
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setActiveTab('portfolio')}
                      className="mt-4 text-xs font-bold text-brand hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Configure Portfolio <ChevronRight size={12} />
                    </button>
                  </div>

                  {/* Interview prep Card */}
                  <div className="border border-warm-border p-5 rounded-xl bg-warm-bg flex flex-col justify-between">
                    <div>
                      <Brain className="text-accent-amber mb-3" size={24} />
                      <h4 className="font-semibold text-primary text-sm">Interview Kit</h4>
                      <p className="text-[11px] text-primary-light mt-1 leading-relaxed">
                        10 tailored preparation questions covering technical tradeoffs and leadership.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('interview')}
                      className="mt-4 text-xs font-bold text-brand hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Start Prep Simulation <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Data Summary Box */}
              <div className="bg-white border border-warm-border rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="font-serif font-semibold text-primary text-base">Your Active Identity Stack</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 bg-warm-bg/50 border border-warm-border/50 rounded-xl">
                    <span className="text-[10px] text-primary-light uppercase tracking-wider block">FullName</span>
                    <span className="font-semibold text-primary block mt-0.5">{careerProfile.personalInfo.fullName}</span>
                  </div>
                  <div className="p-3 bg-warm-bg/50 border border-warm-border/50 rounded-xl">
                    <span className="text-[10px] text-primary-light uppercase tracking-wider block">Profession</span>
                    <span className="font-semibold text-primary block mt-0.5">{careerProfile.professionCategory}</span>
                  </div>
                  <div className="p-3 bg-warm-bg/50 border border-warm-border/50 rounded-xl">
                    <span className="text-[10px] text-primary-light uppercase tracking-wider block">Skills Stack</span>
                    <span className="font-semibold text-primary block mt-0.5">{careerProfile.skills.length} Loaded</span>
                  </div>
                  <div className="p-3 bg-warm-bg/50 border border-warm-border/50 rounded-xl">
                    <span className="text-[10px] text-primary-light uppercase tracking-wider block">Portfolio Status</span>
                    <span className="font-semibold text-emerald-600 block mt-0.5">Live & Public</span>
                  </div>
                </div>


              {/* Premium Upgrade CTA */}
              <div className="bg-gradient-to-br from-[#0B0F19] to-[#111827] border border-white/10 rounded-2xl p-8 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-700">
                  <Sparkles size={120} className="text-brand" />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 mb-4">
                      <Sparkles size={12} className="text-brand" />
                      <span className="text-[10px] font-bold tracking-widest text-brand uppercase">One-Time Upgrade</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
                      Generate Premium Career Package
                    </h2>
                    <p className="text-sm text-gray-400 max-w-lg mb-6 leading-relaxed">
                      Unlock advanced generation modes including Executive & Product Builder portfolios, Leadership resumes, and personalized interview coaching. Permanent access to generated assets.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-300 font-medium">
                      <div className="flex items-center gap-2"><Check size={14} className="text-accent-sage" /> Leadership Resume</div>
                      <div className="flex items-center gap-2"><Check size={14} className="text-accent-sage" /> Executive Portfolio</div>
                      <div className="flex items-center gap-2"><Check size={14} className="text-accent-sage" /> Technical Resume</div>
                      <div className="flex items-center gap-2"><Check size={14} className="text-accent-sage" /> Product Builder Showcase</div>
                      <div className="flex items-center gap-2"><Check size={14} className="text-accent-sage" /> Recruiter Resume</div>
                      <div className="flex items-center gap-2"><Check size={14} className="text-accent-sage" /> Advanced Interview Coaching</div>
                    </div>
                  </div>
                  
                  <div className="shrink-0 flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm min-w-[200px]">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">One-Time Payment</span>
                    <span className="text-3xl font-bold text-white mb-4">₹199</span>
                    <button 
                      onClick={handlePremiumCheckout}
                      disabled={isProcessingPayment}
                      className="w-full py-3 px-6 rounded-lg font-bold text-sm text-white bg-brand hover:bg-brand-hover shadow-lg shadow-brand/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isProcessingPayment ? <RefreshCw size={16} className="animate-spin" /> : 'Generate Package'}
                    </button>
                    <p className="text-[9px] text-gray-500 mt-3 text-center">Secure checkout via Razorpay</p>
                  </div>
                </div>
              </div>

              </div>
            </motion.div>
          )}

          {/* TAB 2: RESUME BUILDER */}
          {activeTab === 'resume' && (
            <motion.div
              key="resume"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Toolbar */}
              <div className="no-print bg-white border border-warm-border rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-serif font-semibold text-primary">Resume Layout & Export</h2>
                  <p className="text-[11px] text-primary-light mt-0.5">
                    Layout: <strong>Modern Minimalist</strong>. Optimized for professional styling.
                  </p>
                </div>
                
                <button
                  onClick={triggerPDFExport}
                  className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-light transition-colors cursor-pointer"
                >
                  <Printer size={13} />
                  Print / Export PDF
                </button>
              </div>

              {/* Resume Sheet Preview (Pixel perfect paper card) */}
              <div className="bg-white border border-warm-border shadow-md rounded-2xl p-6 md:p-8 w-[92%] max-w-5xl mx-auto print-container" id="resume-sheet">
                <ResumeHeader profile={careerProfile} portfolioSubdomain={portfolio?.subdomain} />
                <ResumeSummary profile={careerProfile} />
                <ResumeSkills profile={careerProfile} />
                <ResumeExperience profile={careerProfile} />
                <ResumeProjects profile={careerProfile} />
                <ResumeEducation profile={careerProfile} />
                <ResumeCertifications profile={careerProfile} />
                <ResumeAchievements profile={careerProfile} />
              </div>
            </motion.div>
          )}

          {/* TAB 3: PORTFOLIO CONFIG */}
          {activeTab === 'portfolio' && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 no-print"
            >
              {portfolio && (
                <>
                  <div className="bg-white border border-warm-border rounded-2xl p-6 shadow-xs">
                    <h2 className="text-base font-serif font-semibold text-primary">Portfolio Customization</h2>
                    <p className="text-xs text-primary-light mt-0.5">
                      Configure how your public profile renders under your subdomain.
                    </p>

                    {/* Template Switching */}
                    <div className="mt-6">
                      <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-3">
                        Choose Visual Template
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => handlePortfolioTemplateChange('dev' as any)}
                          className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                            ['dev'].includes(portfolio.templateId) || !['interactive', 'executive', 'product_builder', 'corporate', 'creative'].includes(portfolio.templateId)
                              ? 'bg-white border-primary shadow-xs ring-1 ring-primary'
                              : 'bg-warm-bg border-warm-border hover:bg-white hover:border-warm-border-hover'
                          }`}
                        >
                          <div className="flex items-center gap-2 font-semibold text-xs text-primary">
                            Base Portfolio
                          </div>
                          <p className="text-[10px] text-primary-light mt-1.5 leading-relaxed">
                            Dynamic layout tailored to your professional background.
                          </p>
                          {(['dev'].includes(portfolio.templateId) || !['interactive', 'executive', 'product_builder', 'corporate', 'creative'].includes(portfolio.templateId)) && (
                            <span className="text-[9px] font-bold text-brand mt-3 inline-flex items-center gap-1">
                              <Check size={10} /> Active Template
                            </span>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (premiumStack) {
                              setActiveTab('premium_portfolios');
                            } else {
                              handlePremiumCheckout();
                            }
                          }}
                          className={`text-left p-4 rounded-xl border transition-all cursor-pointer bg-warm-bg border-warm-border hover:bg-brand/5 hover:border-brand/30 group relative overflow-hidden`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2 font-semibold text-xs text-primary">
                              Premium Portfolio Sites
                              {!premiumStack && (
                                <span className="bg-brand/10 text-brand px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider flex items-center gap-1">
                                  <Lock size={10} /> Locked
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-[10px] text-primary-light mt-1.5 leading-relaxed relative z-10">
                            Unlock advanced Corporate, Creative, Executive, and Interactive premium portfolio templates.
                          </p>
                          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Sparkles size={48} className="text-brand" />
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Section Manager */}
                    <div className="mt-8 space-y-4">
                      <label className="block text-xs font-bold text-primary uppercase tracking-wider">
                        Section Manager & Ordering
                      </label>
                      <p className="text-[11px] text-primary-light -mt-2">
                        Reorder sections, rename titles, and toggle visibility. Changes update instantly on your live portfolio.
                      </p>
                      <div className="border border-warm-border rounded-xl divide-y divide-warm-border bg-white overflow-hidden">
                        {(portfolio.sectionOrder || ['hero', 'skills', 'experience', 'education', 'projects', 'certifications', 'achievements', 'publications', 'workSamples']).map((secKey, idx) => {
                          const val = portfolio.sectionToggles[secKey as keyof Portfolio['sectionToggles']] ?? false;
                          const currentTitle = portfolio.sectionTitles?.[secKey] || (secKey.charAt(0).toUpperCase() + secKey.slice(1));
                          const sectionKeys = portfolio.sectionOrder || ['hero', 'skills', 'experience', 'education', 'projects', 'certifications', 'achievements', 'publications', 'workSamples'];
                          const isFirst = idx === 0;
                          const isLast = idx === sectionKeys.length - 1;
                          
                          return (
                            <div key={secKey} className="flex items-center justify-between p-3.5 gap-4 bg-white hover:bg-warm-bg/10 transition-colors">
                              {/* Reorder Buttons */}
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleMoveSection(idx, 'up')}
                                  disabled={isFirst}
                                  className="p-1 rounded hover:bg-warm-bg text-primary-light disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
                                  title="Move Up"
                                >
                                  <ChevronUp size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveSection(idx, 'down')}
                                  disabled={isLast}
                                  className="p-1 rounded hover:bg-warm-bg text-primary-light disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
                                  title="Move Down"
                                >
                                  <ChevronDown size={14} />
                                </button>
                              </div>

                              {/* Custom Renaming Input */}
                              <div className="flex-1 min-w-0">
                                <input
                                  type="text"
                                  value={currentTitle}
                                  onChange={(e) => handleRenameSection(secKey, e.target.value)}
                                  className="w-full bg-transparent border-b border-transparent hover:border-warm-border focus:border-primary px-1 py-0.5 text-xs font-medium text-primary focus:outline-none transition-colors"
                                  placeholder={`Rename ${secKey}`}
                                />
                                <span className="text-[9px] text-primary-light/60 block px-1 capitalize mt-0.5">Original: {secKey}</span>
                              </div>

                              {/* Visibility Toggle */}
                              <button
                                type="button"
                                onClick={() => handlePortfolioToggle(secKey as any)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-semibold cursor-pointer transition-all ${
                                  val
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                    : 'bg-warm-bg border-warm-border text-primary-light'
                                }`}
                              >
                                {val ? (
                                  <>
                                    <Eye size={12} className="text-emerald-600" />
                                    <span>Visible</span>
                                  </>
                                ) : (
                                  <>
                                    <EyeOff size={12} className="text-primary-light/60" />
                                    <span>Hidden</span>
                                  </>
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Public Link Box */}
                  <div className="bg-white border border-warm-border rounded-2xl p-6 shadow-xs flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-primary text-sm">Public Portfolio Site</h4>
                      <p className="text-xs text-primary-light mt-0.5">
                        Your professional identity is compiled and live. Anyone can visit:
                      </p>
                    </div>
                    <a
                      href={`/u/${portfolio.subdomain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-light transition-colors"
                    >
                      <ExternalLink size={12} />
                      Open Live Portfolio
                    </a>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* TAB 4: INTERVIEW PREP */}
          {activeTab === 'interview' && (
            <motion.div
              key="interview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 no-print"
            >
               <div className="bg-white border border-warm-border rounded-2xl p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-0.5">
                  <h2 className="text-base font-serif font-semibold text-primary">Contextual Interview Prep Kit</h2>
                  {(() => {
                    const activeStack = validStacks.find(s => s.id === activeStackId);
                    if (activeStack && activeStack.generationTier === 'premium') {
                      return <span className="bg-brand/10 text-brand px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase ml-2 flex items-center gap-1"><Sparkles size={10} /> Premium Insights</span>;
                    }
                    return null;
                  })()}
                </div>
                <p className="text-xs text-primary-light mt-0.5">
                  We analyzed your specific highlights, projects, and internships to generate targeted preparation flashcards.
                </p>
 
                 {/* Question List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {(() => {
                    const activeStack = validStacks.find(s => s.id === activeStackId);
                    const premiumInterviewAsset = activeStack && activeStack.generationTier === 'premium' 
                      ? generatedAssets.find(a => a.stackId === activeStackId && a.assetType === 'questions')
                      : null;
                    const displayQuestions = premiumInterviewAsset && premiumInterviewAsset.generatedContent 
                      ? premiumInterviewAsset.generatedContent 
                      : interviewQuestions;

                    return displayQuestions.map((q: any, idx: number) => {
                      const isPracticed = !!practicedQuestions[q.id];
                      const isSelected = selectedQuestionIdx === idx;
                      return (
                        <button
                          key={q.id || idx}
                          onClick={() => setSelectedQuestionIdx(idx)}
                          className={`relative text-left p-4 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-white border-primary shadow-xs ring-1 ring-primary'
                              : 'bg-warm-bg border-warm-border hover:bg-white hover:border-warm-border-hover'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              q.type === 'technical' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {q.type}
                            </span>
                            {isPracticed && (
                              <span className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <Check size={9} strokeWidth={3} /> Practiced
                              </span>
                            )}
                          </div>
                          <h4 className="font-semibold text-xs text-primary leading-relaxed mt-1">
                            {q.question}
                          </h4>
                          <p className="text-[10px] text-primary-light mt-2 italic truncate">
                            Ref: {q.contextRef || 'Premium AI Generation'}
                          </p>
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>
 
               {/* Selected Question Detail Flashcard */}
              <AnimatePresence>
                {selectedQuestionIdx !== null && (() => {
                  const activeStack = validStacks.find(s => s.id === activeStackId);
                  const premiumInterviewAsset = activeStack && activeStack.generationTier === 'premium' 
                    ? generatedAssets.find(a => a.stackId === activeStackId && a.assetType === 'questions')
                    : null;
                  const displayQuestions = premiumInterviewAsset && premiumInterviewAsset.generatedContent 
                    ? premiumInterviewAsset.generatedContent 
                    : interviewQuestions;
                  const activeQ = displayQuestions[selectedQuestionIdx];
                  if (!activeQ) return null;

                  return (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="bg-white border border-warm-border rounded-2xl p-6 md:p-8 shadow-sm space-y-6"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-brand uppercase tracking-wider">
                          Active Simulation Flashcard
                        </span>
                        <button
                          onClick={() => setSelectedQuestionIdx(null)}
                          className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                        >
                          Close Detail
                        </button>
                      </div>
 
                      <div className="space-y-2">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          activeQ.type === 'technical' 
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {activeQ.type} Question
                        </span>
                        <h2 className="text-lg font-serif font-semibold text-primary leading-relaxed">
                          {activeQ.question}
                        </h2>
                        <p className="text-xs text-primary-light">
                          Context Reference: <strong className="italic">{activeQ.contextRef || 'Premium AI Generation'}</strong>
                        </p>
                      </div>


 
                      {activeQ.suggestedPoints && (
                        <div className="mt-6 border-t border-warm-border pt-4">
                          <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5 mb-2">
                            <BookOpen size={12} className="text-brand" />
                            Recommended Answer Strategy
                          </h4>
                          
                          <div className="space-y-4">
                            {activeQ.suggestedPoints.map((pt: string, pIdx: number) => {
                              let title = "Talking Point";
                              let content = pt;
                              let colorClass = "bg-primary/5 border-primary/10 text-primary";
                              
                              if (pt.startsWith("What Recruiters Look For:")) {
                                title = "What Recruiters Look For";
                                content = pt.replace("What Recruiters Look For:", "").trim();
                                colorClass = "bg-indigo-50/70 border-indigo-100 text-indigo-950";
                              } else if (pt.startsWith("STAR Method Highlights:")) {
                                title = "STAR Method Strategy";
                                content = pt.replace("STAR Method Highlights:", "").trim();
                                colorClass = "bg-emerald-50/70 border-emerald-100 text-emerald-950";
                              } else if (pt.startsWith("Key Talking Points:")) {
                                title = "Key Talking Points";
                                content = pt.replace("Key Talking Points:", "").trim();
                                colorClass = "bg-amber-50/70 border-amber-100 text-amber-950";
                              }
 
                              return (
                                <div key={pIdx} className={`p-4 border rounded-xl ${colorClass} space-y-1`}>
                                  <h5 className="font-semibold text-[10px] uppercase tracking-wider block opacity-75">
                                    {title}
                                  </h5>
                                  <p className="text-xs leading-relaxed font-medium">
                                    {content}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
 
                      {/* Interactive Footer Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-warm-border pt-4">
                        <button
                          type="button"
                          onClick={() => handleCopyQuestion(activeQ.question, activeQ.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-warm-border hover:bg-warm-bg text-xs font-semibold text-primary transition-colors cursor-pointer"
                        >
                          {copiedQuestionId === activeQ.id ? (
                            <>
                              <Check size={12} className="text-emerald-500" /> Copied!
                            </>
                          ) : (
                            <>
                              <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                              </svg>
                              Copy Question
                            </>
                          )}
                        </button>
 
                        <button
                          type="button"
                          onClick={() => togglePracticed(activeQ.id)}
                          className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            practicedQuestions[activeQ.id]
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-warm-bg hover:bg-warm-border text-primary border border-warm-border'
                          }`}
                        >
                          <Check size={12} strokeWidth={practicedQuestions[activeQ.id] ? 3 : 2} />
                          {practicedQuestions[activeQ.id] ? 'Marked as Practiced' : 'Mark as Practiced'}
                        </button>
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>

      
      


            </motion.div>
          )}

          {/* TAB: CAREER INSIGHTS */}
          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 no-print"
            >
              {(() => {
                const getInsights = () => {
                  let score = 0;
                  const strengths: string[] = [];
                  const improvements: { text: string; tab: 'resume' | 'portfolio' | 'overview' }[] = [];
                  
                  // 1. Contact Details Check
                  const hasBasics = careerProfile.personalInfo.fullName && careerProfile.personalInfo.email && careerProfile.personalInfo.phone && careerProfile.personalInfo.location;
                  if (hasBasics) {
                    score += 15;
                    strengths.push("Essential contact information is fully populated.");
                  } else {
                    improvements.push({ text: "Add missing contact details (email, phone, location) on your profile.", tab: 'resume' });
                  }

                  // 2. Summary
                  if (careerProfile.summary && careerProfile.summary.trim().length > 20) {
                    score += 15;
                    strengths.push("Engaging and polished professional summary statement.");
                  } else {
                    improvements.push({ text: "Write or enhance your professional summary to grab recruiters' attention.", tab: 'resume' });
                  }

                  // 3. Experience
                  const expCount = careerProfile.experience?.length || 0;
                  if (expCount >= 2) {
                    score += 20;
                    strengths.push(`Strong career track record with ${expCount} professional roles.`);
                  } else if (expCount === 1) {
                    score += 10;
                    strengths.push("Has professional experience, but adding more roles could build credibility.");
                    improvements.push({ text: "Detail additional internships, freelance, or prior roles.", tab: 'resume' });
                  } else {
                    improvements.push({ text: "Add at least one professional work experience entry.", tab: 'resume' });
                  }

                  // 4. Projects
                  const projCount = careerProfile.projects?.length || 0;
                  if (projCount >= 2) {
                    score += 20;
                    strengths.push(`Rich project portfolio showing ${projCount} hands-on case studies.`);
                  } else if (projCount === 1) {
                    score += 10;
                    strengths.push("Has 1 project showcase. Adding a second project highlights versatility.");
                    improvements.push({ text: "Add another featured project with problem, solution, and impact metrics.", tab: 'resume' });
                  } else {
                    improvements.push({ text: "Add at least two detailed projects to showcase your technical capability.", tab: 'resume' });
                  }

                  // 5. Skills
                  const skillsCount = careerProfile.skills?.length || 0;
                  if (skillsCount >= 8) {
                    score += 15;
                    strengths.push(`Broad expertise stack with ${skillsCount} targeted technical skills.`);
                  } else if (skillsCount >= 4) {
                    score += 10;
                    strengths.push("Essential skills are listed, but consider expanding your keywords.");
                    improvements.push({ text: "Incorporate more industry-relevant skills and keywords to pass ATS checks.", tab: 'resume' });
                  } else {
                    improvements.push({ text: "Add more skills (at least 6-8 keywords) to improve recruiter search matching.", tab: 'resume' });
                  }

                  // 6. Education
                  const eduCount = careerProfile.education?.length || 0;
                  if (eduCount >= 1) {
                    score += 10;
                    strengths.push("Verified academic background is listed.");
                  } else {
                    improvements.push({ text: "Include your degree or educational credentials.", tab: 'resume' });
                  }

                  // 7. Certifications
                  const certCount = careerProfile.certifications?.length || 0;
                  if (certCount >= 1) {
                    score += 5;
                    strengths.push("Active professional certifications or credentials present.");
                  } else {
                    improvements.push({ text: "Add industry certifications or awards to validate your expertise.", tab: 'resume' });
                  }

                  // Flagship assets detection
                  const flagshipProject = careerProfile.projects?.find(p => p.impact || p.problemSolved) || careerProfile.projects?.[0];
                  const primarySkill = careerProfile.skills?.[0]?.name || "General Core";
                  const experienceYears = careerProfile.experience?.length ? "Active Professional" : "Aspiring Professional";

                  // Dynamic Base Roadmap
                  const roadmap = [];
                  const profession = careerProfile.professionCategory || "Professional";
                  
                  if (!careerProfile.experience?.length) {
                    roadmap.push({ timeframe: "Months 1-3", action: `Build a portfolio of 2-3 high-impact ${profession} projects.` });
                    roadmap.push({ timeframe: "Months 3-6", action: `Secure an entry-level role utilizing ${primarySkill}.` });
                    roadmap.push({ timeframe: "Year 1", action: `Transition to a full-time mid-level ${profession} role.` });
                  } else if (careerProfile.experience.length < 3) {
                    roadmap.push({ timeframe: "Next 6 Months", action: `Deepen expertise in ${primarySkill} and lead a mid-sized project.` });
                    roadmap.push({ timeframe: "Year 1", action: `Mentor junior team members and improve cross-functional communication.` });
                    roadmap.push({ timeframe: "Year 2-3", action: `Transition into a Senior ${profession} role focusing on strategy.` });
                  } else {
                    roadmap.push({ timeframe: "Next 6 Months", action: `Lead strategic initiatives and establish best practices for ${primarySkill}.` });
                    roadmap.push({ timeframe: "Year 1", action: `Drive measurable business impact and optimize team workflows.` });
                    roadmap.push({ timeframe: "Year 2-3", action: `Attain Staff/Principal level or transition into leadership.` });
                  }

                  return {
                    score,
                    strengths,
                    improvements,
                    flagshipProject,
                    primarySkill,
                    experienceYears,
                    roadmap
                  };
                };

                const insights = getInsights();
                const activeAnalysisAsset = generatedAssets.find(a => a.stackId === activeStackId && a.assetType === 'analysis');
                
                if (activeAnalysisAsset && activeAnalysisAsset.generatedContent) {
                  const aiAnalysis = activeAnalysisAsset.generatedContent;
                  const activeStack = validStacks.find(s => s.id === activeStackId);
                  return (
                    <div className="bg-white border border-warm-border rounded-2xl p-6 md:p-8 shadow-xs">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand border border-brand/20">
                          <Sparkles size={16} />
                        </div>
                        <h1 className="text-xl font-serif font-bold text-primary">
                          Premium AI Career Analysis
                        </h1>
                      </div>
                      <p className="text-xs text-primary-light max-w-xl">
                        AI-powered strategic breakdown of your profile based on the {activeStack?.stackName || 'Premium Stack'}.
                      </p>
                      
                      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-warm-border bg-brand/5 p-6 rounded-2xl">
                          <span className="text-[10px] text-brand uppercase tracking-wider font-bold mb-2 block">Match Role & Score</span>
                          <div className="flex items-end gap-3">
                            <span className="text-4xl font-serif font-bold text-primary">{aiAnalysis.matchScore}%</span>
                            <span className="text-sm font-medium text-primary-light pb-1">for {aiAnalysis.roleMatch}</span>
                          </div>
                        </div>
                        
                        <div className="border border-warm-border p-6 rounded-2xl bg-white space-y-4">
                          <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-warm-border pb-2">
                            Key Strengths
                          </h3>
                          <ul className="space-y-2">
                            {(aiAnalysis.strengths || []).map((s: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-[11px] text-primary-light"><Check size={12} className="text-emerald-500 shrink-0 mt-0.5" /> {s}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="border border-warm-border p-6 rounded-2xl bg-white space-y-4">
                          <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-warm-border pb-2">
                            Missing Skills & Next Steps
                          </h3>
                          <ul className="space-y-2 mb-4">
                            {(aiAnalysis.missingSkills || []).map((s: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-[11px] text-primary-light"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1" /> {s}</li>
                            ))}
                          </ul>
                          {aiAnalysis.recommendedNextSkill && (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                              <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider block mb-1">Recommended: {aiAnalysis.recommendedNextSkill.name}</span>
                              <p className="text-[10px] text-amber-900/80">{aiAnalysis.recommendedNextSkill.reason}</p>
                            </div>
                          )}
                        </div>

                        <div className="border border-warm-border p-6 rounded-2xl bg-white space-y-4">
                          <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-warm-border pb-2">
                            Career Roadmap
                          </h3>
                          <div className="space-y-3">
                            {((aiAnalysis.careerRoadmap && aiAnalysis.careerRoadmap.length > 0) ? aiAnalysis.careerRoadmap : insights.roadmap).map((r: any, i: number) => (
                              <div key={i} className="border-l-2 border-brand/30 pl-3">
                                <span className="text-[9px] font-bold text-brand block mb-0.5">{r.timeframe}</span>
                                <p className="text-[11px] text-primary-light leading-relaxed">{r.action}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="bg-white border border-warm-border rounded-2xl p-6 md:p-8 shadow-xs">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-warm-border">
                        <Sparkles size={16} />
                      </div>
                      <h1 className="text-xl font-serif font-semibold text-primary">
                        Recruiter Readiness & Career Insights
                      </h1>
                    </div>
                    <p className="text-xs text-primary-light max-w-xl">
                      A deterministic quality analysis of your current professional stack, measuring keyword density, impact metrics, and project presentation depth.
                    </p>

                    {/* Score panel */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1 border border-warm-border bg-warm-bg/40 p-6 rounded-2xl flex flex-col justify-between items-center text-center">
                        <span className="text-[10px] text-primary-light uppercase tracking-wider font-semibold">
                          Recruiter Match Score
                        </span>
                        <div className="my-4 relative flex items-center justify-center">
                          <span className="text-5xl font-serif font-bold text-primary tracking-tight">
                            {insights.score}%
                          </span>
                        </div>
                        <div className="w-full bg-warm-border/60 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-primary h-full transition-all duration-500" 
                            style={{ width: `${insights.score}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-primary-light/75 mt-3 leading-relaxed">
                          {insights.score >= 80 
                            ? "Excellent! Your profile meets elite standards and is ready for top-tier hiring." 
                            : insights.score >= 50 
                              ? "Good foundation. Complete the suggested improvements to maximize recruiter reach." 
                              : "Needs improvement. Populate more sections to clear minimum criteria."
                          }
                        </p>
                      </div>

                      {/* Flagship Assets Panel */}
                      <div className="md:col-span-2 border border-warm-border p-6 rounded-2xl bg-white space-y-4">
                        <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-warm-border pb-2">
                          Flagship Assets & Marketability
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-3 bg-warm-bg/30 border border-warm-border/50 rounded-xl space-y-1">
                            <span className="text-[9px] text-primary-light uppercase tracking-wider font-semibold">Primary Skill Anchor</span>
                            <div className="font-semibold text-xs text-primary">{insights.primarySkill}</div>
                            <p className="text-[10px] text-primary-light/70 leading-tight">Serves as your primary indexing stack keyword.</p>
                          </div>

                          <div className="p-3 bg-warm-bg/30 border border-warm-border/50 rounded-xl space-y-1">
                            <span className="text-[9px] text-primary-light uppercase tracking-wider font-semibold">Career Experience Stage</span>
                            <div className="font-semibold text-xs text-primary">{insights.experienceYears}</div>
                            <p className="text-[10px] text-primary-light/70 leading-tight">Based on detailed employment history count.</p>
                          </div>
                        </div>

                        {insights.flagshipProject ? (
                          <div className="p-3 border border-warm-border bg-warm-bg/10 rounded-xl space-y-1">
                            <span className="text-[9px] text-primary-light uppercase tracking-wider font-semibold block">Highlighted Flagship Project</span>
                            <div className="font-bold text-xs text-primary">{insights.flagshipProject.name}</div>
                            <p className="text-[10px] text-primary-light leading-snug">
                              {(insights.flagshipProject.description || '').length > 120 
                                ? `${(insights.flagshipProject.description || '').substring(0, 120)}...` 
                                : insights.flagshipProject.description
                              }
                            </p>
                          </div>
                        ) : (
                          <div className="p-3 border border-dashed border-warm-border rounded-xl text-center text-[10px] text-primary-light">
                            No projects found. Add a project to highlight your capabilities.
                          </div>
                        )}
                      </div>
                    </div>                    {/* Strengths & Improvements grids */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                      {/* Strengths */}
                      <div className="border border-warm-border rounded-2xl p-6 space-y-4">
                        <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-warm-border pb-2 flex items-center gap-1.5">
                          <Check className="text-emerald-600" size={14} strokeWidth={3} />
                          Profile Strengths ({insights.strengths.length})
                        </h3>
                        {insights.strengths.length > 0 ? (
                          <ul className="space-y-2.5 list-none pl-0">
                            {insights.strengths.map((str, idx) => (
                              <li key={idx} className="text-xs text-primary-light leading-relaxed flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                <span>{str}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-primary-light italic">No strengths logged yet. Fill out details to build list.</p>
                        )}
                      </div>

                      {/* Areas to Improve */}
                      <div className="border border-warm-border rounded-2xl p-6 space-y-4">
                        <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-warm-border pb-2 flex items-center gap-1.5">
                          <Sparkles className="text-accent-amber" size={14} />
                          Actionable Improvements ({insights.improvements.length})
                        </h3>
                        {insights.improvements.length > 0 ? (
                          <div className="space-y-3">
                            {insights.improvements.map((imp, idx) => (
                              <div key={idx} className="flex justify-between items-start gap-4 p-2.5 bg-warm-bg/25 border border-warm-border/40 rounded-xl">
                                <p className="text-xs text-primary-light leading-relaxed">
                                  {imp.text}
                                </p>
                                <button
                                  onClick={() => setActiveTab(imp.tab)}
                                  className="text-[10px] font-bold text-brand hover:underline shrink-0 flex items-center gap-0.5 cursor-pointer mt-0.5"
                                >
                                  Fix <ChevronRight size={10} />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-6 text-center space-y-2 bg-emerald-50/20 border border-emerald-100 rounded-xl">
                            <Check className="text-emerald-600" size={24} strokeWidth={3} />
                            <h4 className="font-bold text-xs text-primary">All Recruiter Checks Passed!</h4>
                            <p className="text-[10px] text-primary-light">Your profile matches all optimal performance checklists.</p>
                          </div>
                        )}
                      </div>

                      {/* Base Career Roadmap */}
                      <div className="border border-warm-border rounded-2xl p-6 space-y-4">
                        <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-warm-border pb-2 flex items-center gap-1.5">
                          <TrendingUp className="text-brand" size={14} />
                          Career Roadmap
                        </h3>
                        <div className="space-y-3">
                          {insights.roadmap.map((r: any, i: number) => (
                            <div key={i} className="border-l-2 border-brand/30 pl-3">
                              <span className="text-[9px] font-bold text-brand block mb-0.5">{r.timeframe}</span>
                              <p className="text-[11px] text-primary-light leading-relaxed">{r.action}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    
      {/* Premium Flow Modal Overlay */}
      <AnimatePresence>
        {showPremiumFlowModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl border border-warm-border p-8 max-w-2xl w-full"
            >
              {premiumModalStep === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-6 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-brand/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-brand border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles size={20} className="text-brand animate-pulse" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-primary mb-2">Verifying Payment...</h2>
                  <p className="text-sm text-primary-light">Please do not close this window.</p>
                </div>
              ) : premiumModalStep === 1 ? (
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-brand/10 text-brand flex items-center justify-center mx-auto mb-4">
                      <Sparkles size={32} />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-primary">Payment Successful!</h2>
                    <p className="text-sm text-primary-light mt-2">You now have 1 Premium Generation Credit.</p>
                  </div>
                  
                  <h3 className="text-center font-bold text-lg text-primary mb-6">Choose How To Continue</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div onClick={handleStartFromScratch} className="border border-warm-border hover:border-brand bg-warm-bg/50 p-6 rounded-xl cursor-pointer transition-all flex flex-col justify-between group">
                      <div>
                        <h4 className="font-bold text-primary flex items-center gap-2 mb-2">
                          <Plus size={16} className="text-brand" /> Start From Scratch
                        </h4>
                        <p className="text-xs text-primary-light leading-relaxed mb-6">
                          Create a completely new premium generation using a new profession/profile.
                        </p>
                      </div>
                      <button className="w-full py-2.5 px-4 rounded-lg font-bold text-xs text-white bg-primary group-hover:bg-brand transition-colors">
                        Start New Premium Profile
                      </button>
                    </div>

                    <div onClick={handleUseExisting} className="border border-warm-border hover:border-brand bg-warm-bg/50 p-6 rounded-xl cursor-pointer transition-all flex flex-col justify-between group">
                      <div>
                        <h4 className="font-bold text-primary flex items-center gap-2 mb-2">
                          <Layers size={16} className="text-brand" /> Use Existing Profile
                        </h4>
                        <p className="text-xs text-primary-light leading-relaxed mb-6">
                          Generate premium assets using your existing profile data.
                        </p>
                      </div>
                      <button className="w-full py-2.5 px-4 rounded-lg font-bold text-xs text-brand bg-brand/10 group-hover:bg-brand group-hover:text-white transition-colors">
                        Continue With Existing Profile
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-serif font-bold text-primary">How Would You Like To Continue?</h2>
                    <p className="text-sm text-primary-light mt-2">Your existing profile will be used to generate premium assets.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div onClick={handleContinueAsIs} className="border border-warm-border hover:border-brand bg-warm-bg/50 p-6 rounded-xl cursor-pointer transition-all flex flex-col justify-between group">
                      <div>
                        <h4 className="font-bold text-primary flex items-center gap-2 mb-2">
                          <Sparkles size={16} className="text-brand" /> Continue As Is
                        </h4>
                        <p className="text-xs text-primary-light leading-relaxed mb-6">
                          Use current profile data immediately and start generating the premium assets.
                        </p>
                      </div>
                      <button className="w-full py-2.5 px-4 rounded-lg font-bold text-xs text-white bg-brand hover:bg-brand-hover transition-colors">
                        Generate Premium Assets
                      </button>
                    </div>

                    <div onClick={handleEditBeforeGenerating} className="border border-warm-border hover:border-brand bg-warm-bg/50 p-6 rounded-xl cursor-pointer transition-all flex flex-col justify-between group">
                      <div>
                        <h4 className="font-bold text-primary flex items-center gap-2 mb-2">
                          <Edit3 size={16} className="text-brand" /> Edit Before Generating
                        </h4>
                        <p className="text-xs text-primary-light leading-relaxed mb-6">
                          Review and improve your profile data in the editor before generating premium assets.
                        </p>
                      </div>
                      <button className="w-full py-2.5 px-4 rounded-lg font-bold text-xs text-primary border border-warm-border bg-white group-hover:border-primary transition-colors">
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
