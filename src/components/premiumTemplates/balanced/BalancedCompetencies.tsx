import React from 'react';
import { BalancedResumeResult } from '@/lib/ai-service';

export const BalancedCompetencies = ({ profile, title }: { profile: BalancedResumeResult; title?: string }) => {
  if (!profile.coreCompetencies || (!profile.coreCompetencies.technical.length && !profile.coreCompetencies.leadership.length)) return null;

  return (
    <div className="mb-3 print:mb-1.5">
      <div className="flex items-center mb-1.5 border-b border-gray-300 pb-1">
        <h3 className="text-[12px] print:text-[11px] font-extrabold uppercase tracking-widest text-gray-900">
          {title || "Core Competencies"}
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-[10px] print:text-[9px] font-bold text-gray-600 uppercase mb-1">Technical Expertise</h4>
          <div className="flex flex-wrap gap-x-1.5 gap-y-1">
            {profile.coreCompetencies.technical.map((skill, idx) => (
              <span key={idx} className="text-[10.5px] print:text-[9.5px] text-gray-800 font-medium">
                {skill}{idx < profile.coreCompetencies.technical.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-[10px] print:text-[9px] font-bold text-gray-600 uppercase mb-1">Leadership & Collaboration</h4>
          <div className="flex flex-wrap gap-x-1.5 gap-y-1">
            {profile.coreCompetencies.leadership.map((skill, idx) => (
              <span key={idx} className="text-[10.5px] print:text-[9.5px] text-gray-800 font-medium">
                {skill}{idx < profile.coreCompetencies.leadership.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
