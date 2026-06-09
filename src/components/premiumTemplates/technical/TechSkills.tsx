import React from 'react';
import { Code } from 'lucide-react';
import { EnhancedProfile } from './EnhancementEngine';

export const TechSkills = ({ profile, title }: { profile: EnhancedProfile; title?: string }) => {
  if (!profile.categorizedSkills || profile.categorizedSkills.length === 0) return null;
  
  const groupedSkills = profile.categorizedSkills;

  return (
    <div className="avoid-break mb-4">
      <div className="flex items-center mb-2 border-b border-gray-300 pb-1">
        <h3 className="text-[13px] font-extrabold uppercase tracking-widest text-gray-900">
          {title || "Technical Skills"}
        </h3>
      </div>
      <div className="space-y-2">
        {groupedSkills.map((cat, idx) => (
          <div key={idx} className="flex text-[10.5px] leading-relaxed">
            <span className="font-bold text-gray-900 w-[140px] shrink-0">{cat.category}:</span>
            <span className="text-gray-800">{cat.items.join(', ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
