import { getProfession } from "./profession-registry";
import { getRelatedSkills as fetchRelatedSkills } from "./skill-mapping";

/**
 * Recommends skills for a profession, excluding those the user already has.
 */
export function recommendSkillsForProfession(professionId: string, currentSkills: string[] = []): string[] {
  const prof = getProfession(professionId);
  if (!prof) return [];

  const currentSet = new Set(currentSkills.map(s => s.toLowerCase().trim()));
  return prof.suggestedSkills.filter(skill => !currentSet.has(skill.toLowerCase().trim()));
}

/**
 * Recommends related skills based on a given skill.
 */
export function recommendRelatedSkills(skill: string, currentSkills: string[] = []): string[] {
  const currentSet = new Set(currentSkills.map(s => s.toLowerCase().trim()));
  const related = fetchRelatedSkills(skill);
  return related.filter(s => !currentSet.has(s.toLowerCase().trim()));
}

/**
 * Recommends certifications for a profession, excluding already owned ones.
 */
export function recommendCertifications(professionId: string, currentCertifications: string[] = []): string[] {
  const prof = getProfession(professionId);
  if (!prof) return [];

  const currentSet = new Set(currentCertifications.map(c => c.toLowerCase().trim()));
  return prof.suggestedCertifications.filter(cert => !currentSet.has(cert.toLowerCase().trim()));
}

/**
 * Recommends achievement templates/examples for a profession.
 */
export function recommendAchievementTemplates(professionId: string): string[] {
  const prof = getProfession(professionId);
  return prof ? prof.suggestedAchievements : [];
}

/**
 * Recommends keywords for a profession.
 */
export function recommendKeywords(professionId: string): string[] {
  const prof = getProfession(professionId);
  return prof ? prof.suggestedKeywords : [];
}

/**
 * Detects missing ATS keywords by scanning the resume text.
 */
export function detectMissingAtsKeywords(professionId: string, resumeText: string): { missing: string[]; present: string[] } {
  const prof = getProfession(professionId);
  if (!prof) return { missing: [], present: [] };

  const normalizedText = resumeText.toLowerCase();
  const present: string[] = [];
  const missing: string[] = [];

  for (const keyword of prof.suggestedKeywords) {
    if (normalizedText.includes(keyword.toLowerCase())) {
      present.push(keyword);
    } else {
      missing.push(keyword);
    }
  }

  return { missing, present };
}
