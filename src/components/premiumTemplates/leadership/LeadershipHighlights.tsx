import React from 'react';
import { LeadershipResumeResult } from '@/lib/ai-service';

export const LeadershipHighlights = ({ profile }: { profile: LeadershipResumeResult }) => {
  if (!profile.leadershipHighlights || profile.leadershipHighlights.length === 0) return null;

  return (
    <div className="avoid-break mb-4">
      <div className="flex items-center mb-1.5 border-b border-gray-300 pb-1">
        <h3 className="text-[12px] print:text-[11px] font-extrabold uppercase tracking-widest text-gray-900">
          Leadership Highlights
        </h3>
      </div>
      <ul className="list-disc pl-4 space-y-1">
        {profile.leadershipHighlights.map((highlight, idx) => (
          <li key={idx} className="text-[10.5px] print:text-[9.5px] leading-relaxed print:leading-snug text-gray-800 pl-1">
            {highlight}
          </li>
        ))}
      </ul>
    </div>
  );
};
