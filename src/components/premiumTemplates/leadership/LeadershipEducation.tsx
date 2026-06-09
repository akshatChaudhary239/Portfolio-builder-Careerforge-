import React from 'react';
import { LeadershipResumeResult } from '@/lib/ai-service';

export const LeadershipEducation = ({ profile, title }: { profile: LeadershipResumeResult; title?: string }) => {
  if (!profile.education || profile.education.length === 0) return null;

  return (
    <div className="mb-3 print:mb-1">
      <div className="flex items-center mb-2 border-b border-gray-300 pb-1">
        <h3 className="text-[12px] print:text-[11px] font-extrabold uppercase tracking-widest text-gray-900">
          {title || "Education"}
        </h3>
      </div>
      
      <div className="space-y-1.5 print:space-y-0.5">
        {profile.education.map((edu, idx) => (
          <div key={idx} className="avoid-break flex justify-between items-baseline">
            <div>
              <h4 className="text-[11px] print:text-[10px] print:text-[9px] font-bold text-gray-900 leading-snug print:leading-tight">
                {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
              </h4>
              <div className="text-[10.5px] print:text-[9.5px] italic text-gray-800">
                {edu.institution}
              </div>
            </div>
            <div className="text-[10px] print:text-[9px] text-gray-500 font-medium whitespace-nowrap text-right shrink-0 ml-4">
              {edu.startDate} – {edu.endDate || 'Present'}
              {edu.grade && <span className="block font-semibold text-gray-700">{edu.grade}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
