import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Check, Search, Tag } from 'lucide-react';
import { getRelatedSkills, PROFESSION_SKILL_CLUSTERS } from '@/lib/assistant/skill-mapping';

interface SkillAssistantProps {
  professionCategory: string;
  currentSkills: any[];
  onAddSkill: (skillName: string) => void;
  onRemoveSkill?: (skillName: string) => void;
  parsedSuggestedSkills?: string[];
}

export default function SkillAssistant({ professionCategory, currentSkills, onAddSkill, onRemoveSkill, parsedSuggestedSkills }: SkillAssistantProps) {
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [popularChips, setPopularChips] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const normalizeProf = (prof: string): string => {
    const p = (prof || '').toLowerCase();
    if (p.includes('design')) return 'designer';
    if (p.includes('data')) return 'data';
    if (p.includes('marketing')) return 'marketing';
    if (p.includes('mba') || p.includes('business')) return 'mba';
    if (p.includes('finance')) return 'finance';
    if (p.includes('law')) return 'law';
    if (p.includes('hr') || p.includes('human')) return 'hr';
    if (p.includes('dev') || p.includes('software')) return 'developer';
    return 'general';
  };

  useEffect(() => {
    // Collect pre-defined popular chips for the current profession category
    const profKey = normalizeProf(professionCategory);
    const clusters = PROFESSION_SKILL_CLUSTERS[profKey] || PROFESSION_SKILL_CLUSTERS['general'];
    const flattened = Array.from(new Set(clusters.flat()));
    setPopularChips(flattened);

    // Existing dynamic related skill suggestions logic
    const related = new Set<string>();
    
    if (parsedSuggestedSkills) {
      parsedSuggestedSkills.forEach(s => related.add(s));
    }

    currentSkills.forEach(skill => {
      if (skill?.name) {
        const suggestions = getRelatedSkills(professionCategory, skill.name);
        suggestions.forEach(s => related.add(s));
      }
    });

    // Filter out existing skills
    currentSkills.forEach(skill => {
      if (skill?.name) {
        related.delete(skill.name);
        for (const r of Array.from(related)) {
          if (r.toLowerCase() === skill.name.toLowerCase()) {
            related.delete(r);
          }
        }
      }
    });

    setSuggestedSkills(Array.from(related).slice(0, 15));
  }, [currentSkills, professionCategory, parsedSuggestedSkills]);

  const isSkillSelected = (skillName: string) => {
    return currentSkills.some(s => s?.name?.toLowerCase() === skillName.toLowerCase());
  };

  const handleToggleChip = (skillName: string) => {
    if (isSkillSelected(skillName)) {
      if (onRemoveSkill) {
        onRemoveSkill(skillName);
      }
    } else {
      onAddSkill(skillName);
    }
  };

  const filteredChips = popularChips.filter(chip => 
    chip.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="mt-4 pt-4 border-t border-warm-border space-y-3">
      {/* Search Bar for Skill Chips */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Tag size={13} className="text-brand" />
          <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Quick Select Skill Chips</span>
        </div>
        <div className="relative w-40 sm:w-48">
          <Search size={12} className="absolute left-2 top-2 text-primary-light" />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-6 pr-2 py-1 bg-white border border-warm-border rounded-md text-xs text-primary focus:outline-none focus:border-brand"
          />
        </div>
      </div>

      {/* Selectable Skill Chips */}
      <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-warm-bg/50 rounded-lg border border-warm-border/60">
        {filteredChips.map(chip => {
          const selected = isSkillSelected(chip);
          return (
            <button
              key={chip}
              onClick={() => handleToggleChip(chip)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all shadow-xs ${
                selected
                  ? 'bg-brand text-white border border-brand'
                  : 'bg-white text-primary border border-warm-border hover:border-brand/40 hover:bg-brand/5'
              }`}
            >
              {selected ? <Check size={11} /> : <Plus size={11} className="text-brand" />}
              <span>{chip}</span>
            </button>
          );
        })}
        {filteredChips.length === 0 && (
          <span className="text-xs text-primary-light italic p-1">No matching skills found.</span>
        )}
      </div>

      {/* Existing Dynamic Recommended Skills */}
      {suggestedSkills.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles size={12} className="text-amber-500" />
            <span className="text-[10px] font-bold text-primary-light uppercase tracking-wider">Smart Recommendations</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestedSkills.map(skill => (
              <button
                key={skill}
                onClick={() => onAddSkill(skill)}
                className="group flex items-center gap-1 px-2 py-1 rounded bg-amber-50/60 border border-amber-200 hover:bg-amber-100/80 transition-colors"
              >
                <Plus size={10} className="text-amber-600 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold text-amber-900">{skill}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
