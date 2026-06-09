import React, { useMemo } from 'react';
import { CareerProfile } from '@/db/local-db';
import { getDynamicSections } from '@/lib/blueprint-engine';
import { TechHeader } from './TechHeader';
import { TechSummary } from './TechSummary';
import { TechSkills } from './TechSkills';
import { TechExperience } from './TechExperience';
import { TechProjects } from './TechProjects';
import { TechEducation } from './TechEducation';
import { TechCertifications } from './TechCertifications';
import { TechAchievements } from './TechAchievements';
import { EnhancementEngine } from './EnhancementEngine';

function calculateTotalMonthsOfExperience(experienceList: any[]): number {
  if (!experienceList || experienceList.length === 0) return 0;
  
  let totalMonths = 0;
  
  experienceList.forEach(exp => {
    try {
      const start = exp.startDate ? new Date(exp.startDate) : new Date();
      const end = (exp.currentlyWorking || !exp.endDate || exp.endDate.toLowerCase() === 'present') 
        ? new Date() 
        : new Date(exp.endDate);
        
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffInMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        totalMonths += Math.max(0, diffInMonths);
      } else {
        totalMonths += 12; 
      }
    } catch {
      totalMonths += 12;
    }
  });

  return totalMonths;
}

const TechCustomSection = ({ title, items }: { title: string; items: string[] }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="avoid-break mb-4">
      <div className="flex items-center mb-2 border-b border-gray-300 pb-1">
        <h3 className="text-[13px] font-extrabold uppercase tracking-widest text-gray-900">
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

const TechPortfolioSection = ({ profile }: { profile: any }) => {
  const workSamples = profile.workSamples || [];
  const behance = profile.extensions?.behance;
  const dribbble = profile.extensions?.dribbble;
  if (workSamples.length === 0 && !behance && !dribbble) return null;

  return (
    <div className="avoid-break mb-4">
      <div className="flex items-center mb-2 border-b border-gray-300 pb-1">
        <h3 className="text-[13px] font-extrabold uppercase tracking-widest text-gray-900">
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

export const TechnicalResume = ({ profile }: { profile: CareerProfile }) => {
  // STAGE 1: Enhancement Pipeline
  const enhancedProfile = useMemo(() => {
    return EnhancementEngine.enhanceProfile(profile);
  }, [profile]);

  const isExperienced = useMemo(() => {
    const totalMonths = calculateTotalMonthsOfExperience(enhancedProfile.enhancedExperience);
    return totalMonths >= 6;
  }, [enhancedProfile.enhancedExperience]);

  const profession = (
    profile.professionalBlueprint?.profession || 
    profile.professionCategory || 
    ''
  ).toLowerCase();

  const isDeveloper = profession.includes('developer') || profession.includes('data analyst') || profession.includes('tech');
  const isLawyer = profession.includes('law') || profession.includes('legal');
  const isDesigner = profession.includes('design');
  const isMarketing = profession.includes('marketing');

  // STAGE 2: Section Assembler
  const renderedSections = useMemo(() => {
    const list: React.ReactNode[] = [];

    const summarySec = <TechSummary key="summary" profile={enhancedProfile} />;
    const skillsSec = <TechSkills key="skills" profile={enhancedProfile} />;
    const experienceSec = <TechExperience key="experience" profile={enhancedProfile} />;
    const projectsSec = <TechProjects key="projects" profile={enhancedProfile} />;
    const educationSec = <TechEducation key="education" profile={enhancedProfile} />;
    const certificationsSec = <TechCertifications key="certifications" profile={enhancedProfile} />;
    const achievementsSec = <TechAchievements key="achievements" profile={enhancedProfile} />;

    // Custom sections
    const practiceAreasSec = (
      <TechCustomSection 
        key="practiceAreas" 
        title="Practice Areas" 
        items={enhancedProfile.extensions?.practiceAreas || []} 
      />
    );
    const publicationsSec = (
      <TechCustomSection 
        key="publications" 
        title="Publications" 
        items={enhancedProfile.publications || []} 
      />
    );
    const portfolioSec = <TechPortfolioSection key="portfolio" profile={enhancedProfile} />;
    const campaignsSec = (
      <TechCustomSection 
        key="campaigns" 
        title="Campaign Results" 
        items={enhancedProfile.extensions?.campaigns || []} 
      />
    );
    const growthMetricsSec = (
      <TechCustomSection 
        key="growthMetrics" 
        title="Growth Metrics" 
        items={enhancedProfile.extensions?.growthMetrics || []} 
      />
    );

    // Render Summary always right after Header
    list.push(summarySec);

    // LAYER 3 & 4: DYNAMIC MAPPING & ORDERING
    const blueprint = profile.professionalBlueprint;
    
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

      const bottomGridItems: React.ReactNode[] = [];

      // Loop through dynamic slots
      dynamicSlots.forEach(slot => {
        if (slot.id === 'experience') list.push(<TechExperience key={`slot-${slot.id}`} profile={enhancedProfile} title={slot.label} />);
        if (slot.id === 'projects') list.push(<TechProjects key={`slot-${slot.id}`} profile={enhancedProfile} title={slot.label} />);
        if (slot.id === 'skills') list.push(<TechSkills key={`slot-${slot.id}`} profile={enhancedProfile} title={slot.label} />);
        if (slot.id === 'education') list.push(<TechEducation key={`slot-${slot.id}`} profile={enhancedProfile} title={slot.label} />);
        if (slot.id === 'certifications') bottomGridItems.push(<TechCertifications key={`slot-${slot.id}`} profile={enhancedProfile} title={slot.label} />);
        if (slot.id === 'achievements') bottomGridItems.push(<TechAchievements key={`slot-${slot.id}`} profile={enhancedProfile} />); // Add title if needed
      });
      
      if (bottomGridItems.length > 0) {
        list.push(
          <div key="bottom-grid" className="grid grid-cols-2 gap-6 mt-4">
            {bottomGridItems[0] && <div>{bottomGridItems[0]}</div>}
            {bottomGridItems[1] && <div>{bottomGridItems[1]}</div>}
          </div>
        );
      }
    } else {
      // Default / general fallback if no blueprint exists
      list.push(skillsSec);
      if (isExperienced) {
        list.push(experienceSec);
        list.push(projectsSec);
      } else {
        list.push(projectsSec);
        list.push(experienceSec);
      }
      list.push(educationSec);
      list.push(
        <div key="bottom-grid" className="grid grid-cols-2 gap-6 mt-4">
          <div>{certificationsSec}</div>
          <div>{achievementsSec}</div>
        </div>
      );
    }

    return list;
  }, [enhancedProfile, isDeveloper, isLawyer, isDesigner, isMarketing, isExperienced]);

  // STAGE 3: Pure Renderer
  return (
    <div className="font-sans text-gray-900 bg-white">
      <TechHeader profile={enhancedProfile} />
      {renderedSections}
    </div>
  );
};
