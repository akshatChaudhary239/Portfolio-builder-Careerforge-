import React from 'react';
import { Achievement } from '@/db/local-db';
import { EnhancedProfile } from './EnhancementEngine';
import { Trophy } from 'lucide-react';

export const TechAchievements = ({ profile }: { profile: EnhancedProfile }) => {
  if (!profile.achievements || profile.achievements.length === 0) return null;
  
  return (
    <div className="mb-4">
      <div className="flex items-center mb-2 border-b border-gray-300 pb-1">
        <h3 className="text-[13px] font-extrabold uppercase tracking-widest text-gray-900">
          Achievements
        </h3>
      </div>
      <ul className="list-disc pl-3 text-[10px] text-gray-800 space-y-0.5 leading-snug">
        {profile.achievements.map((ach: Achievement, idx: number) => {
          const achText = typeof ach === 'string' ? ach : ach.description || (ach as any).name || '';
          return <li key={idx} className="pl-1">{achText}</li>;
        })}
      </ul>
    </div>
  );
};
