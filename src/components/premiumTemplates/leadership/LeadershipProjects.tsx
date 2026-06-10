import React from 'react';
import { LeadershipResumeResult } from '@/lib/ai-service';
import { Link, Code } from 'lucide-react';
import { getShowcaseLabels } from '@/lib/label-mapping';

export const LeadershipProjects = ({ profile, title }: { profile: LeadershipResumeResult; title?: string }) => {
  if (!profile.projects || profile.projects.length === 0) return null;

  const labels = getShowcaseLabels(profile.professionCategory);

  return (
    <div className="mb-3 print:mb-1">
      <div className="flex items-center mb-2 border-b border-gray-300 pb-1">
        <h3 className="text-[12px] print:text-[11px] font-extrabold uppercase tracking-widest text-gray-900">
          {title || labels.sectionTitle}
        </h3>
      </div>
      
      <div className="space-y-2 print:space-y-0.5">
        {profile.projects.map((proj, idx) => (
          <div key={idx} className="avoid-break space-y-1.5 pb-2 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="flex justify-between items-baseline mb-0.5">
              <h4 className="text-[11px] print:text-[10px] print:text-[9px] font-bold text-[#2563EB] leading-snug print:leading-tight">
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

            {proj.role && (
              <div className="text-[10px] print:text-[9px] font-bold text-gray-800 mb-1 tracking-wide uppercase">
                Role: <span className="font-semibold text-gray-700">{proj.role}</span>
              </div>
            )}

            {proj.overview && (
              <p className="text-[10.5px] print:text-[9.5px] leading-relaxed print:leading-snug text-gray-800">
                {proj.overview}
              </p>
            )}

            <ul className="list-disc pl-4 space-y-1">
              {proj.achievements?.map((ach: any, i: number) => {
                let content = typeof ach === 'string' ? ach : '';
                if (typeof ach === 'object' && ach !== null) {
                  content = ach.description || ach.title || ach.name || JSON.stringify(ach);
                }
                return (
                  <li key={i} className="text-[10.5px] print:text-[9.5px] leading-relaxed print:leading-snug text-gray-800 pl-1 avoid-break">
                    {content}
                  </li>
                );
              })}
            </ul>

            {proj.technologies && proj.technologies.length > 0 && (
              <div className="mt-1.5 text-[10px] print:text-[9px] text-gray-600">
                <span className="font-bold text-gray-800">{labels.tech}:</span> {proj.technologies.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
