import React from 'react';
import { BalancedResumeResult } from '@/lib/ai-service';

export const BalancedAchievements = ({ profile }: { profile: BalancedResumeResult }) => {
  if (!profile.achievements || profile.achievements.length === 0) return null;

  return (
    <div className="mb-3 print:mb-1.5">
      <div className="flex items-center mb-1.5 border-b border-gray-300 pb-1">
        <h3 className="text-[12px] print:text-[11px] font-extrabold uppercase tracking-widest text-gray-900">
          Achievements
        </h3>
      </div>
      <ul className="list-disc pl-4 space-y-0.5 print:space-y-0">
        {profile.achievements.map((ach: any, idx) => {
          let content = typeof ach === 'string' ? ach : '';
          if (typeof ach === 'object' && ach !== null) {
            content = ach.title || ach.description || ach.name || JSON.stringify(ach);
          }
          return (
            <li key={idx} className="text-[10.5px] print:text-[9.5px] leading-relaxed print:leading-snug text-gray-800 pl-1">
              {content}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
