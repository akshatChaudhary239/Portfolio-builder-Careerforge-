import React, { useMemo } from 'react';
import { LeadershipResumeResult } from '@/lib/ai-service';
import { getDynamicSections } from '@/lib/blueprint-engine';
import { LeadershipValidationLayer } from './ValidationLayer';
import { LeadershipHeader } from './LeadershipHeader';
import { LeadershipSummary } from './LeadershipSummary';
import { LeadershipHighlights } from './LeadershipHighlights';
import { LeadershipExperience } from './LeadershipExperience';
import { LeadershipProjects } from './LeadershipProjects';
import { LeadershipStrengths } from './LeadershipStrengths';
import { LeadershipEducation } from './LeadershipEducation';
import { LeadershipCertifications } from './LeadershipCertifications';
import { LeadershipAchievements } from './LeadershipAchievements';
import { AlertCircle } from 'lucide-react';



const LeadershipCustomSection = ({ title, items }: { title: string; items: string[] }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="avoid-break mb-4">
      <div className="flex items-center mb-1.5 border-b border-gray-300 pb-1">
        <h3 className="text-[12px] print:text-[11px] font-extrabold uppercase tracking-widest text-gray-900">
          {title}
        </h3>
      </div>
      <ul className="list-disc pl-3 text-[10px] text-gray-800 space-y-0.5 leading-snug">
        {items.map((item, idx) => (
          <li key={idx} className="pl-1">{item}</li>
        ))}
      </ul>
    </div>
  );
};

const LeadershipPortfolioSection = ({ profile }: { profile: any }) => {
  const workSamples = profile.workSamples || [];
  const behance = profile.extensions?.behance;
  const dribbble = profile.extensions?.dribbble;
  if (workSamples.length === 0 && !behance && !dribbble) return null;

  return (
    <div className="avoid-break mb-4">
      <div className="flex items-center mb-1.5 border-b border-gray-300 pb-1">
        <h3 className="text-[12px] print:text-[11px] font-extrabold uppercase tracking-widest text-gray-900">
          Portfolio & Samples
        </h3>
      </div>
      <div className="space-y-2 text-[10px] text-gray-800">
        {(behance || dribbble) && (
          <div className="flex gap-4 mb-2">
            {behance && (
              <div>
                <span className="font-bold text-gray-900">Behance:</span>{' '}
                <a href={behance} target="_blank" rel="noreferrer" className="text-brand hover:underline">
                  {behance}
                </a>
              </div>
            )}
            {dribbble && (
              <div>
                <span className="font-bold text-gray-900">Dribbble:</span>{' '}
                <a href={dribbble} target="_blank" rel="noreferrer" className="text-brand hover:underline">
                  {dribbble}
                </a>
              </div>
            )}
          </div>
        )}
        {workSamples.length > 0 && (
          <ul className="list-disc pl-3 space-y-1">
            {workSamples.map((sample: any, idx: number) => (
              <li key={idx} className="pl-1">
                <span className="font-bold text-gray-900">{sample.title}</span>
                {sample.url && (
                  <>
                    {' - '}
                    <a href={sample.url} target="_blank" rel="noreferrer" className="text-brand hover:underline">
                      {sample.url}
                    </a>
                  </>
                )}
                {sample.description && <p className="text-[9.5px] text-gray-600 mt-0.5">{sample.description}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export const LeadershipResume = ({ profile, onRegenerate }: { profile: any; onRegenerate?: () => void }) => {
  const { isValid, errors, typedProfile } = useMemo(() => {
    const validation = LeadershipValidationLayer.validate(profile);
    return {
      isValid: validation.isValid,
      errors: validation.errors,
      typedProfile: profile as LeadershipResumeResult
    };
  }, [profile]);

  const profession = (
    typedProfile?.professionalBlueprint?.profession || 
    typedProfile?.professionCategory || 
    ''
  ).toLowerCase();

  const isDeveloper = profession.includes('developer') || profession.includes('data analyst') || profession.includes('tech');
  const isLawyer = profession.includes('law') || profession.includes('legal');
  const isDesigner = profession.includes('design');
  const isMarketing = profession.includes('marketing');

  const renderedSections = useMemo(() => {
    const list: React.ReactNode[] = [];

    const summarySec = <LeadershipSummary key="summary" profile={typedProfile} />;
    const highlightsSec = <LeadershipHighlights key="highlights" profile={typedProfile} />;
    const experienceSec = <LeadershipExperience key="experience" profile={typedProfile} />;
    const projectsSec = <LeadershipProjects key="projects" profile={typedProfile} />;
    const strengthsSec = <LeadershipStrengths key="strengths" profile={typedProfile} />;
    const educationSec = <LeadershipEducation key="education" profile={typedProfile} />;
    const certificationsSec = <LeadershipCertifications key="certifications" profile={typedProfile} />;
    const achievementsSec = <LeadershipAchievements key="achievements" profile={typedProfile} />;

    // Custom sections
    const practiceAreasSec = (
      <LeadershipCustomSection 
        key="practiceAreas" 
        title="Practice Areas" 
        items={typedProfile?.extensions?.practiceAreas || []} 
      />
    );
    const publicationsSec = (
      <LeadershipCustomSection 
        key="publications" 
        title="Publications" 
        items={typedProfile?.publications || []} 
      />
    );
    const portfolioSec = <LeadershipPortfolioSection key="portfolio" profile={typedProfile} />;
    const campaignsSec = (
      <LeadershipCustomSection 
        key="campaigns" 
        title="Campaign Results" 
        items={typedProfile?.extensions?.campaigns || []} 
      />
    );
    const growthMetricsSec = (
      <LeadershipCustomSection 
        key="growthMetrics" 
        title="Growth Metrics" 
        items={typedProfile?.extensions?.growthMetrics || []} 
      />
    );

    // Render Summary and Highlights always right after Header
    list.push(summarySec);
    list.push(highlightsSec);

    // LAYER 3 & 4: DYNAMIC MAPPING & ORDERING
    const blueprint = typedProfile?.professionalBlueprint;
    
    if (blueprint) {
      const dynamicSlots = getDynamicSections(blueprint);
      
      // Inject some custom role-based sections before the dynamic slots if needed
      if (isDesigner) list.push(portfolioSec);
      if (isMarketing) {
        list.push(campaignsSec);
        list.push(growthMetricsSec);
      }
      if (isLawyer) {
        list.push(practiceAreasSec);
        list.push(publicationsSec);
      }

      // Loop through dynamic slots
      dynamicSlots.forEach(slot => {
        if (slot.id === 'experience') list.push(<LeadershipExperience key={`slot-${slot.id}`} profile={typedProfile} title={slot.label} />);
        if (slot.id === 'projects') list.push(<LeadershipProjects key={`slot-${slot.id}`} profile={typedProfile} title={slot.label} />);
        if (slot.id === 'skills') list.push(<LeadershipStrengths key={`slot-${slot.id}`} profile={typedProfile} />); // Strengths is equivalent to skills in leadership
        if (slot.id === 'education') list.push(<LeadershipEducation key={`slot-${slot.id}`} profile={typedProfile} title={slot.label} />);
        if (slot.id === 'certifications') list.push(<LeadershipCertifications key={`slot-${slot.id}`} profile={typedProfile} title={slot.label} />);
        if (slot.id === 'achievements') list.push(<LeadershipAchievements key={`slot-${slot.id}`} profile={typedProfile} />); 
      });
      
    } else {
      // Default fallback
      list.push(experienceSec);
      list.push(projectsSec);
      list.push(strengthsSec);
      list.push(educationSec);
      list.push(certificationsSec);
      list.push(achievementsSec);
    }

    return list;
  }, [typedProfile, isDesigner, isMarketing, isLawyer]);

  if (!isValid) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">Schema Upgrade Required</h3>
        <p className="text-sm print:text-xs text-gray-600 mb-4 max-w-md">
          This leadership resume was generated with an older version of our AI engine. To access the new strict Leadership formatting (which includes dedicated highlights, roles, and strengths), please regenerate this resume.
        </p>
        <button 
          onClick={() => {
            if (onRegenerate) onRegenerate();
            else alert('Please click the small Regenerate (refresh) icon at the top right of this resume card!');
          }}
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm print:text-xs font-semibold mb-6 hover:bg-brand/90 transition-colors"
        >
          Click the Regenerate Icon Above
        </button>
        <div className="text-left bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-full max-w-md">
          <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">Missing Requirements:</h4>
          <ul className="list-disc pl-4 text-xs text-red-600 space-y-1">
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans text-gray-900 bg-white">
      <LeadershipHeader profile={typedProfile} />
      {renderedSections}
    </div>
  );
};
