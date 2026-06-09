import React from 'react';
import { BalancedResumeResult } from '@/lib/ai-service';

export const BalancedExperience = ({ profile, title }: { profile: BalancedResumeResult; title?: string }) => {
  if (!profile.experience || profile.experience.length === 0) return null;

  return (
    <div className="mb-3 print:mb-1.5">
      <div className="flex items-center mb-1.5 border-b border-gray-300 pb-1">
        <h3 className="text-[12px] print:text-[11px] font-extrabold uppercase tracking-widest text-gray-900">
          {title || "Professional Experience"}
        </h3>
      </div>
      
      <div className="space-y-2 print:space-y-1">
        {profile.experience.map((exp, idx) => (
          <div key={idx} className="avoid-break space-y-1 pb-1.5">
            <div className="flex justify-between items-baseline">
              <div>
                <h4 className="text-[11px] print:text-[10px] font-bold text-gray-900 leading-snug print:leading-tight">
                  {exp.position}
                </h4>
                <div className="text-[10.5px] print:text-[9.5px] font-medium text-[#2563EB]">
                  {exp.company}
                </div>
              </div>
              <div className="text-[10px] print:text-[9px] text-gray-500 font-medium whitespace-nowrap text-right shrink-0 ml-4">
                {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                {exp.location && <span className="block italic text-gray-400">{exp.location}</span>}
              </div>
            </div>

            <ul className="list-disc pl-4 space-y-0.5 print:space-y-0 text-[10.5px] print:text-[9.5px] text-gray-800 leading-relaxed print:leading-snug">
              {exp.achievements?.map((ach: any, idx: number) => {
                let content = typeof ach === 'string' ? ach : (ach.description || ach.title || ach.name || JSON.stringify(ach));
                return (
                  <li key={idx} className="pl-1 avoid-break">
                    {content}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
