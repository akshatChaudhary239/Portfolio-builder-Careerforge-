import React from 'react';
import { LeadershipResumeResult } from '@/lib/ai-service';

export const LeadershipExperience = ({ profile, title }: { profile: LeadershipResumeResult; title?: string }) => {
  if (!profile.experience || profile.experience.length === 0) return null;

  return (
    <div className="mb-3 print:mb-1">
      <div className="flex items-center mb-2 border-b border-gray-300 pb-1">
        <h3 className="text-[12px] print:text-[11px] font-extrabold uppercase tracking-widest text-gray-900">
          {title || "Leadership Experience"}
        </h3>
      </div>
      
      <div className="space-y-2 print:space-y-0.5">
        {profile.experience.map((exp, idx) => (
          <div key={idx} className="avoid-break space-y-1.5 pb-2 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="flex justify-between items-baseline">
              <div>
                <h4 className="text-[11px] print:text-[10px] print:text-[9px] font-bold text-gray-900 leading-snug print:leading-tight">
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

            <ul className="list-disc pl-4 space-y-1">
              {exp.achievements?.map((ach: any, idx: number) => {
                let content = typeof ach === 'string' ? ach : '';
                if (typeof ach === 'object' && ach !== null) {
                  content = ach.description || ach.title || ach.name || JSON.stringify(ach);
                }
                return (
                  <li key={idx} className="text-[10.5px] print:text-[9.5px] leading-relaxed print:leading-snug text-gray-800 pl-1 avoid-break">
                    {content}
                  </li>
                );
              })}
            </ul>

            {exp.leadershipSkills && (
              <div className="mt-1.5 text-[10px] print:text-[9px] text-gray-700">
                <span className="font-bold text-gray-900">Key Contributions:</span> {exp.leadershipSkills}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
