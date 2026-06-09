import { EnhancedProfile } from './EnhancementEngine';
import { Folder, Code, ExternalLink, FolderGit2 } from 'lucide-react';
import { getShowcaseLabels } from '@/lib/label-mapping';

export const TechProjects = ({ profile, title }: { profile: EnhancedProfile; title?: string }) => {
  if (!profile.enhancedProjects || profile.enhancedProjects.length === 0) return null;
  
  const labels = getShowcaseLabels(profile.professionCategory);

  return (
    <div className="mb-4">
      <div className="flex items-center mb-2 border-b border-gray-300 pb-1">
        <h3 className="text-[13px] font-extrabold uppercase tracking-widest text-gray-900">
          {title || labels.sectionTitle}
        </h3>
      </div>
      <div className="space-y-3">
        {profile.enhancedProjects.map((proj, idx: number) => {
          return (
            <div key={idx} className="avoid-break space-y-1.5 pb-2 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-1">
                <div className="text-[12px] font-extrabold text-[#2563EB]">
                  {proj.name}
                </div>
                
                <div className="flex items-center gap-3 text-[10px] text-[#2563EB] font-bold">
                  {proj.enhancedLinks.map((link, lIdx) => (
                    <div key={lIdx} className="flex items-center gap-2">
                      {lIdx > 0 && <span className="text-gray-400">|</span>}
                      <a href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                        {(link as any).isGit ? <Code size={10} /> : <ExternalLink size={10} />} {link.label}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
              
              {proj.extractedTechnologies && proj.extractedTechnologies.length > 0 && (
                <div className="text-[10px] mt-0 mb-1.5">
                  <span className="font-bold text-gray-900">Tech Stack:</span> <span className="text-gray-800 italic">{proj.extractedTechnologies.join(', ')}</span>
                </div>
              )}
              
              <p className="text-[10.5px] text-gray-800 leading-snug mb-1">
                {proj.enhancedOverview}
              </p>
              
              <ul className="list-disc pl-3 text-[10px] text-gray-800 space-y-0.5 leading-snug">
                {proj.enhancedAchievements.map((ach, aIdx) => (
                  <li key={aIdx} className="pl-1">{ach}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};
