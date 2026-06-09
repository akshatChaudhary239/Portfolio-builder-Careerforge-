import React from 'react';
import { LeadershipResumeResult } from '@/lib/ai-service';

export const LeadershipSummary = ({ profile }: { profile: LeadershipResumeResult }) => {
  if (!profile.leadershipProfile) return null;

  return (
    <div className="avoid-break mb-4">
      <div className="flex items-center mb-1.5 border-b border-gray-300 pb-1">
        <h3 className="text-[12px] print:text-[11px] font-extrabold uppercase tracking-widest text-gray-900">
          Personal Leadership Profile
        </h3>
      </div>
      <p className="text-[10.5px] print:text-[9.5px] leading-relaxed print:leading-snug text-gray-800 whitespace-pre-wrap">
        {profile.leadershipProfile}
      </p>
    </div>
  );
};
