import React from 'react';
import { Education } from '@/db/local-db';
import { EnhancedProfile } from './EnhancementEngine';
import { GraduationCap } from 'lucide-react';

export const TechEducation = ({ profile, title }: { profile: EnhancedProfile; title?: string }) => {
  if (!profile.education || profile.education.length === 0) return null;
  
  return (
    <div className="avoid-break mb-4">
      <div className="flex items-center mb-2 border-b border-gray-300 pb-1">
        <h3 className="text-[13px] font-extrabold uppercase tracking-widest text-gray-900">
          {title || "Education"}
        </h3>
      </div>
      <div className="space-y-2">
        {profile.education.map((edu: Education, idx: number) => (
          <div key={idx} className="flex justify-between items-start">
            <div>
              <div className="text-[12px] font-bold text-gray-900">
                {edu.degree} {((edu as any).fieldOfStudy || edu.specialization) && `in ${((edu as any).fieldOfStudy || edu.specialization)}`}
              </div>
              <div className="text-[10.5px] text-gray-800 italic mt-0.5">
                {edu.institution} {((edu as any).grade || edu.cgpa) ? `| CGPA: ${((edu as any).grade || edu.cgpa)}` : ''}
              </div>
            </div>
            <div className="text-[10.5px] font-bold text-[#2563EB] shrink-0 mt-0.5">
              {((edu as any).startDate || edu.startYear) ? `${((edu as any).startDate || edu.startYear)} – ` : ''}{((edu as any).endDate || edu.endYear) || 'Present'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
