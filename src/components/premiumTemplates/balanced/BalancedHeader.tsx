import React from 'react';
import { BalancedResumeResult } from '@/lib/ai-service';
// No icons needed based on the user's styling request

export const BalancedHeader = ({ profile }: { profile: BalancedResumeResult }) => {
  return (
    <div className="text-center mb-3 print:mb-1.5 pb-3 border-b border-gray-300">
      <h1 className="text-3xl print:text-2xl font-extrabold text-gray-900 tracking-tight uppercase">
        {profile.fullName}
      </h1>
      
      {profile.title && (
        <h2 className="text-[13px] print:text-[11px] font-bold text-gray-700 tracking-widest uppercase mt-1 mb-2">
          {profile.title}
        </h2>
      )}

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10.5px] print:text-[9.5px] text-gray-600 font-medium mt-2">
        {profile.email && (
          <a href={`mailto:${profile.email}`} className="flex items-center hover:text-[#2563EB] transition-colors">
            {profile.email}
          </a>
        )}
        {profile.phone && (
          <span className="flex items-center">
            <span className="text-gray-300 mx-1">|</span> {profile.phone}
          </span>
        )}
        {profile.location && (
          <span className="flex items-center">
            <span className="text-gray-300 mx-1">|</span> {profile.location}
          </span>
        )}
        {profile.linkedin && (
          <a href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-[#2563EB] transition-colors">
            <span className="text-gray-300 mx-1">|</span> LinkedIn
          </a>
        )}
        {profile.github && (
          <a href={profile.github.startsWith('http') ? profile.github : `https://${profile.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-[#2563EB] transition-colors">
            <span className="text-gray-300 mx-1">|</span> GitHub
          </a>
        )}
        {profile.website && (
          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-[#2563EB] transition-colors font-bold">
            <span className="text-gray-300 mx-1 font-medium">|</span> Portfolio
          </a>
        )}
      </div>
    </div>
  );
};
