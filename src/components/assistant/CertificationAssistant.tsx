import React from 'react';
import { Plus, Award } from 'lucide-react';
import { getCertificationsForSkills } from '@/lib/assistant/skill-mapping';
import { recommendCertifications } from '@/lib/assistant/recommendation-engine';

interface CertificationAssistantProps {
  professionCategory: string;
  currentSkills: { name: string }[];
  currentCertifications: { title: string }[];
  onAddCertification: (certTitle: string) => void;
}

export default function CertificationAssistant({ professionCategory, currentSkills, currentCertifications, onAddCertification }: CertificationAssistantProps) {
  const currentSkillNames = currentSkills.map(s => s.name);
  
  // Requirement: Do not show generic lists on load. Must have at least one skill or profession context.
  if (currentSkillNames.length === 0 && !professionCategory) return null;

  // Gather deterministic cert recommendations
  const certsBySkills = getCertificationsForSkills(currentSkillNames);
  const certsByProfession = professionCategory ? recommendCertifications(professionCategory, currentCertifications.map(c => c.title)) : [];

  const combinedSet = new Set([...certsBySkills, ...certsByProfession]);
  const currentSet = new Set(currentCertifications.map(c => c.title.toLowerCase().trim()));

  const finalRecommendations = Array.from(combinedSet)
    .filter(cert => !currentSet.has(cert.toLowerCase().trim()))
    .slice(0, 6);

  if (finalRecommendations.length === 0) return null;

  return (
    <div className="mt-4 pt-3 border-t border-warm-border">
      <span className="text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-2 flex items-center gap-1">
        <Award size={10} />
        Suggested Certifications
      </span>
      <div className="flex flex-wrap gap-1.5">
        {finalRecommendations.map(cert => (
          <button
            key={cert}
            onClick={() => onAddCertification(cert)}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50 border border-amber-100 text-amber-700 hover:bg-amber-100 transition-colors text-[10px] font-medium"
          >
            <Plus size={10} />
            {cert}
          </button>
        ))}
      </div>
    </div>
  );
}
