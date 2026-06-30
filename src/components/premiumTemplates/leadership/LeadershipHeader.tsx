import React from 'react';
import { LeadershipResumeResult } from '@/lib/ai-service';

export const LeadershipHeader = ({ profile }: { profile: LeadershipResumeResult }) => {
  const contactParts = [
    { label: profile.email, url: `mailto:${profile.email}` },
    { label: profile.phone, url: `tel:${profile.phone}` },
    { label: profile.location, url: null },
    { label: profile.linkedin ? 'LinkedIn' : null, url: profile.linkedin?.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}` },
    { label: profile.website ? profile.website.replace('https://', '').replace('http://', '') : null, url: profile.website?.startsWith('http') ? profile.website : `https://${profile.website}` },
    { label: profile.github ? 'GitHub' : null, url: profile.github?.startsWith('http') ? profile.github : `https://${profile.github}` }
  ].filter(part => part.label);

  return (
    <div className="mb-5 text-center avoid-break">
      <h1 className="text-[32px] font-sans font-bold text-gray-900 tracking-tight leading-none mb-1.5 uppercase">
        {profile.fullName}
      </h1>
      <p className="text-[13px] font-semibold text-gray-800 mb-3 tracking-wide">
        {profile.title}
      </p>
      
      {contactParts.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] print:text-[9px] text-gray-600 font-medium print:flex-nowrap print:w-full print:justify-center">
          {contactParts.map((part, idx) => {
            return (
              <React.Fragment key={idx}>
                <div className="flex items-center print:shrink-0">
                  {part.url ? (
                    <a href={part.url} target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                      {part.label!.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  ) : (
                    <span>{part.label}</span>
                  )}
                </div>
                {idx < contactParts.length - 1 && <span className="text-gray-300 mx-1.5">|</span>}
              </React.Fragment>
            );
          })}
        </div>
      )}
      <div className="w-full border-b-[1.5px] border-gray-900 mt-4 mb-2"></div>
    </div>
  );
};
