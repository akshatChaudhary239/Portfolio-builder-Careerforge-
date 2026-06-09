import React from 'react';
import { BalancedResumeResult } from '@/lib/ai-service';

export const BalancedEducation = ({ profile, title }: { profile: BalancedResumeResult; title?: string }) => {
  if (!profile.education || profile.education.length === 0) return null;

  return (
    <div className="mb-3 print:mb-1.5">
      <div className="flex items-center mb-1.5 border-b border-gray-300 pb-1">
        <h3 className="text-[12px] print:text-[11px] font-extrabold uppercase tracking-widest text-gray-900">
          {title || "Education"}
        </h3>
      </div>
      <div className="space-y-1.5 print:space-y-0.5">
        {profile.education.map((edu, idx) => (
          <div key={idx} className="flex justify-between items-baseline avoid-break">
            <div>
              <div className="text-[11px] print:text-[10px] font-bold text-gray-900">
                {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
              </div>
              <div className="text-[10.5px] print:text-[9.5px] text-gray-700 italic">
                {edu.institution}
              </div>
              {edu.grade && (
                <div className="text-[10px] print:text-[9px] text-gray-600 mt-0.5">
                  CGPA/Grade: {edu.grade}
                </div>
              )}
            </div>
            <div className="text-[10px] print:text-[9px] text-gray-500 font-medium text-right shrink-0">
              {edu.startDate ? `${edu.startDate} – ` : ''}{edu.endDate || 'Present'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
