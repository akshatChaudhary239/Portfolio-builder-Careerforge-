import React from 'react';
import { BalancedResumeResult } from '@/lib/ai-service';

export const BalancedProfile = ({ profile }: { profile: BalancedResumeResult }) => {
  if (!profile.professionalProfile) return null;

  return (
    <div className="mb-3 print:mb-1.5">
      <div className="flex items-center mb-1.5 border-b border-gray-300 pb-1">
        <h3 className="text-[12px] print:text-[11px] font-extrabold uppercase tracking-widest text-gray-900">
          Professional Profile
        </h3>
      </div>
      <p className="text-[10.5px] print:text-[9.5px] leading-relaxed print:leading-snug text-gray-800 text-justify">
        {profile.professionalProfile}
      </p>
    </div>
  );
};
