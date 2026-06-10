'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Eye, RefreshCw, Printer, Shield, Code, Briefcase } from 'lucide-react';
import { CareerProfile, GeneratedAsset, IdentityStack, Portfolio } from '@/db/local-db';
import {
  ResumeHeader,
  ResumeSummary,
  ResumeSkills,
  ResumeExperience,
  ResumeProjects,
  ResumeEducation,
  ResumeCertifications,
  ResumeAchievements
} from '@/app/(dashboard)/dashboard/resume-renderers';
import { useRouter } from 'next/navigation';
import { TechnicalResume } from '../premiumTemplates/technical/TechnicalResume';
import { LeadershipResume } from '../premiumTemplates/leadership/LeadershipResume';
import { BalancedResume } from '../premiumTemplates/balanced/BalancedResume';
import { BalancedValidationLayer } from '../premiumTemplates/balanced/ValidationLayer';
import { LeadershipValidationLayer } from '../premiumTemplates/leadership/ValidationLayer';

interface PremiumResumesProps {
  careerProfile: CareerProfile;
  generatedAssets: GeneratedAsset[];
  premiumStack: IdentityStack;
  portfolio?: Portfolio;
}

export function PremiumResumes({ careerProfile, generatedAssets, premiumStack, portfolio }: PremiumResumesProps) {
  const router = useRouter();
  const [variant, setVariant] = useState<'technical' | 'leadership' | 'balanced'>('balanced');

  const variants = [
    {
      id: 'technical',
      name: 'Technical Resume',
      icon: Code,
      desc: 'Optimized for technical and engineering roles. Project-first, technical depth, skills emphasis.'
    },
    {
      id: 'leadership',
      name: 'Leadership Resume',
      icon: Shield,
      desc: 'Optimized for leadership, management, ownership, and business impact.'
    },
    {
      id: 'balanced',
      name: 'Balanced Professional',
      icon: Briefcase,
      desc: 'Balanced recruiter-friendly format combining technical expertise and business value.'
    }
  ];

  const [isRegenerating, setIsRegenerating] = useState(false);

  const activeResumeAsset = generatedAssets.find(a => 
    a.stackId === premiumStack.id && 
    a.assetType === 'resume' && 
    (a.assetVariant === variant || (variant === 'balanced' && a.assetVariant === 'recruiter'))
  );
  
  const handleRegenerate = async () => {
    if (!activeResumeAsset) return;
    setIsRegenerating(true);
    try {
      const { regenerateSingleVariantAction } = await import('@/app/(dashboard)/dashboard/premium/generate/actions');
      await regenerateSingleVariantAction(activeResumeAsset.id, careerProfile, variant);
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const triggerPDFExport = () => {
    window.print();
  };

  const baseProfile = activeResumeAsset ? activeResumeAsset.generatedContent : null;

  const displayProfile = React.useMemo(() => {
    let rawProfile;
    
    if (variant === 'balanced') {
      rawProfile = BalancedValidationLayer.upgrade(baseProfile, careerProfile);
    } else if (variant === 'leadership') {
      rawProfile = LeadershipValidationLayer.upgrade(baseProfile, careerProfile);
    } else {
      // Technical or standard fallback
      if (!activeResumeAsset) {
        rawProfile = careerProfile;
      } else {
        rawProfile = {
          ...careerProfile,
          personalInfo: {
            ...careerProfile.personalInfo,
            fullName: careerProfile.personalInfo.fullName || activeResumeAsset.generatedContent.fullName,
            email: careerProfile.personalInfo.email || activeResumeAsset.generatedContent.email,
            phone: careerProfile.personalInfo.phone || activeResumeAsset.generatedContent.phone,
            location: careerProfile.personalInfo.location || activeResumeAsset.generatedContent.location,
            website: careerProfile.personalInfo.website || activeResumeAsset.generatedContent.website,
            github: careerProfile.personalInfo.github || activeResumeAsset.generatedContent.github,
            linkedin: careerProfile.personalInfo.linkedin || activeResumeAsset.generatedContent.linkedin,
          },
          summary: activeResumeAsset.generatedContent.summary || careerProfile.summary,
          skills: activeResumeAsset.generatedContent.skills || careerProfile.skills,
          experience: activeResumeAsset.generatedContent.experience || careerProfile.experience,
          education: activeResumeAsset.generatedContent.education || careerProfile.education,
          projects: activeResumeAsset.generatedContent.projects ? activeResumeAsset.generatedContent.projects.map((p: any, i: number) => {
            const orig = ((careerProfile.projects && careerProfile.projects[i]) || {}) as any;
            const originalName = orig.name || orig.title || '';
            return {
              ...orig,
              name: p.name || p.title || originalName,
              title: p.title || p.name || originalName,
              description: p.description || orig.description,
              techStack: p.techStack || orig.techStack,
              link: p.link || orig.link,
              highlights: p.achievements || p.highlights || orig.highlights
            };
          }) : careerProfile.projects,
          certifications: (activeResumeAsset.generatedContent.certifications && activeResumeAsset.generatedContent.certifications.length > 0) ? activeResumeAsset.generatedContent.certifications : careerProfile.certifications,
          achievements: (activeResumeAsset.generatedContent.achievements && activeResumeAsset.generatedContent.achievements.length > 0) ? activeResumeAsset.generatedContent.achievements : careerProfile.achievements,
        } as CareerProfile;
      }
    }
    
    // Globally inject the portfolio subdomain as the primary website if it exists
    if (portfolio?.subdomain) {
      const baseDomain = typeof window !== 'undefined' ? window.location.origin : `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'getprospectra.com'}`;
      const subdomainUrl = `${baseDomain}/u/${portfolio.subdomain}`;
      return {
        ...rawProfile,
        website: subdomainUrl,
        personalInfo: {
          ...(rawProfile as any).personalInfo,
          website: subdomainUrl
        }
      } as any;
    }
    
    return rawProfile;
  }, [variant, activeResumeAsset, careerProfile, baseProfile, portfolio]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="bg-white border border-warm-border rounded-2xl p-6 shadow-xs no-print">
        <h2 className="text-xl font-serif font-semibold text-primary mb-1">Premium Resume Vault</h2>
        <p className="text-xs text-primary-light mb-6">Switch between targeted variations of your profile optimized for different roles.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {variants.map(v => {
            const Icon = v.icon;
            const isSelected = variant === v.id;
            return (
              <div 
                key={v.id}
                className={`border rounded-xl p-4 flex flex-col justify-between transition-all duration-300 ${
                  isSelected ? 'border-brand bg-brand/5 shadow-md shadow-brand/5' : 'border-warm-border bg-white hover:border-brand/30 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${isSelected ? 'bg-brand text-white' : 'bg-warm-bg text-primary'}`}>
                    <Icon size={16} />
                  </div>
                  <h4 className="font-bold text-sm text-primary mb-1">{v.name}</h4>
                  <p className="text-[10px] text-primary-light leading-relaxed mb-4">{v.desc}</p>
                </div>
                
                <div className="flex items-center gap-2 mt-auto">
                  <button 
                    onClick={() => setVariant(v.id as any)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                      isSelected ? 'bg-brand text-white' : 'bg-warm-bg text-primary hover:bg-warm-border'
                    }`}
                  >
                    <Eye size={12} /> {isSelected ? 'Previewing' : 'Preview'}
                  </button>
                  <button 
                    onClick={triggerPDFExport}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold bg-warm-bg text-primary hover:bg-warm-border transition-colors cursor-pointer"
                  >
                    <Download size={12} /> Download
                  </button>
                  <button 
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg bg-warm-bg text-primary hover:bg-warm-border transition-colors cursor-pointer ${isRegenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Regenerate"
                  >
                    <RefreshCw size={12} className={isRegenerating ? 'animate-spin' : ''} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-white border border-warm-border shadow-md rounded-2xl p-6 md:p-8 w-[92%] max-w-5xl mx-auto print-container print:!border-0 print:!border-none print:shadow-none print:rounded-none print:p-0 print:m-0 print:w-full print:max-w-none" id="resume-sheet">
        <div
          key={variant}
          className="bg-white shadow-2xl rounded-xl mx-auto w-[210mm] min-h-[297mm] h-auto p-8 relative overflow-hidden print:w-[210mm] print:h-[297mm] print:p-0 print:m-0 print:shadow-none print:border-x-0 print:!transform-none"
        >
          {isRegenerating ? (
            <div className="flex flex-col items-center justify-center h-[50vh]">
              <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Rebuilding with AI...</p>
            </div>
          ) : variant === 'technical' ? (
            <TechnicalResume profile={displayProfile as CareerProfile} />
          ) : variant === 'leadership' ? (
            <LeadershipResume profile={displayProfile} onRegenerate={handleRegenerate} />
          ) : variant === 'balanced' ? (
            <BalancedResume profile={displayProfile} onRegenerate={handleRegenerate} />
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
