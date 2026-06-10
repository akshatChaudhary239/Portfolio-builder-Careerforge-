import React from 'react';
import { BalancedResumeResult } from '@/lib/ai-service';
import { getShowcaseLabels } from '@/lib/label-mapping';

export const BalancedProjects = ({ profile, title }: { profile: BalancedResumeResult; title?: string }) => {
  if (!profile.projects || profile.projects.length === 0) return null;

  const labels = getShowcaseLabels(profile.professionCategory);

  return (
    <div className="mb-3 print:mb-1.5">
      <div className="flex items-center mb-1.5 border-b border-gray-300 pb-1">
        <h3 className="text-[12px] print:text-[11px] font-extrabold uppercase tracking-widest text-gray-900">
          {title || labels.sectionTitle}
        </h3>
      </div>
      
      <div className="space-y-2 print:space-y-1">
        {profile.projects.map((proj, idx) => (
          <div key={idx} className="avoid-break space-y-1 pb-1.5">
            <div className="flex justify-between items-baseline">
              <div className="flex items-center flex-wrap gap-2">
                <h4 className="text-[11px] print:text-[10px] font-bold text-[#2563EB] leading-snug print:leading-tight">
                  {proj.link ? (
                    <a href={proj.link?.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noreferrer" className="hover:underline">
                      {proj.title}
                    </a>
                  ) : proj.github ? (
                    <a href={proj.github?.startsWith('http') ? proj.github : `https://${proj.github}`} target="_blank" rel="noreferrer" className="hover:underline">
                      {proj.title}
                    </a>
                  ) : (
                    proj.title
                  )}
                </h4>
              </div>
            </div>

            {proj.techStack && proj.techStack.length > 0 && (
              <div className="text-[10px] print:text-[9px] text-gray-700">
                <span className="font-bold text-gray-900">{labels.tech}:</span> {proj.techStack.join(', ')}
              </div>
            )}
            
            {proj.overview && (
              <p className="text-[10.5px] print:text-[9.5px] text-gray-800 leading-relaxed print:leading-snug">
                {proj.overview}
              </p>
            )}

            <ul className="list-disc pl-4 space-y-0.5 print:space-y-0 text-[10.5px] print:text-[9.5px] text-gray-800 leading-relaxed print:leading-snug">
              {proj.achievements?.map((ach: any, i: number) => {
                let content = typeof ach === 'string' ? ach : (ach.description || ach.title || ach.name || JSON.stringify(ach));
                return (
                  <li key={i} className="pl-1 avoid-break">
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
