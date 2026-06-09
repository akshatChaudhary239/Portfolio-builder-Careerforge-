import React from 'react';
import { LeadershipResumeResult } from '@/lib/ai-service';

export const LeadershipStrengths = ({ profile }: { profile: LeadershipResumeResult }) => {
  if (!profile.coreStrengths || profile.coreStrengths.length === 0) return null;

  return (
    <div className="avoid-break mb-4">
      <div className="flex items-center mb-1.5 border-b border-gray-300 pb-1">
        <h3 className="text-[12px] print:text-[11px] font-extrabold uppercase tracking-widest text-gray-900">
          Core Strengths
        </h3>
      </div>
      <div className="flex flex-wrap gap-x-2 gap-y-1">
        {profile.coreStrengths.map((strength, idx) => (
          <React.Fragment key={idx}>
            <span className="text-[10.5px] print:text-[9.5px] leading-relaxed print:leading-snug font-semibold text-gray-800">
              {strength}
            </span>
            {idx < profile.coreStrengths.length - 1 && (
              <span className="text-gray-300 text-[10.5px] print:text-[9.5px]">•</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
