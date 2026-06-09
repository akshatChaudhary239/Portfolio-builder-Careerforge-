import React from 'react';
import { EnhancedProfile } from './EnhancementEngine';
import { User } from 'lucide-react';

export const TechSummary = ({ profile }: { profile: EnhancedProfile }) => {
  const summaryText = profile.enhancedSummary;
  
  if (!summaryText) return null;
  
  return (
    <div className="avoid-break mb-4">
      <div className="flex items-center mb-2 border-b border-gray-300 pb-1">
        <h3 className="text-[13px] font-extrabold uppercase tracking-widest text-gray-900">
          Professional Summary
        </h3>
      </div>
      <p className="text-[10.5px] text-gray-800 leading-relaxed">
        {profile.enhancedSummary}
      </p>
    </div>
  );
};
