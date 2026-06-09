import React from 'react';
import { EnhancedProfile } from './EnhancementEngine';
import { Briefcase } from 'lucide-react';

export const TechExperience = ({ profile, title }: { profile: EnhancedProfile; title?: string }) => {
  if (!profile.enhancedExperience || profile.enhancedExperience.length === 0) return null;
  
  return (
    <div className="mb-4">
      <div className="flex items-center mb-2 border-b border-gray-300 pb-1">
        <h3 className="text-[13px] font-extrabold uppercase tracking-widest text-gray-900">
          {title || "Professional Experience"}
        </h3>
      </div>
      <div className="space-y-2">
        {profile.enhancedExperience.map((exp, idx: number) => (
          <div key={idx} className="avoid-break space-y-1.5 pb-2 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="mb-1.5">
              <div className="flex justify-between items-start">
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-[#2563EB] rounded-full mt-1.5 shrink-0" />
                  <div>
                    <div className="text-[12px] font-bold text-gray-900 leading-tight">{exp.position}</div>
                    <div className="text-[10.5px] text-gray-800 font-medium italic mt-0.5">
                      {exp.company} {((exp as any).location) ? `| ${((exp as any).location)}` : ''}
                    </div>
                  </div>
                </div>
                <div className="text-[10.5px] font-bold text-[#2563EB] shrink-0 mt-0.5">
                  {exp.startDate} – {exp.currentlyWorking ? 'Present' : (exp.endDate || 'Present')}
                </div>
              </div>
            </div>
            
            <ul className="list-disc pl-3 text-[10px] text-gray-800 space-y-0.5 leading-snug mb-1">
              {exp.enhancedAchievements.map((ach, aIdx) => (
                <li key={aIdx} className="pl-1">{ach}</li>
              ))}
            </ul>
            
            {exp.extractedTechnologies && exp.extractedTechnologies.length > 0 && (
              <div className="text-[10px] font-medium mt-1 pl-3.5">
                <span className="font-semibold text-[#2563EB]">Technologies:</span> <span className="text-gray-800">{exp.extractedTechnologies}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
