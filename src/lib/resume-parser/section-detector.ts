import { DetectedSections } from './types';

const SECTION_SYNONYMS: Record<string, string[]> = {
  summary: [
    'summary', 'profile', 'objective', 'about', 'about me', 'career summary',
    'career objective', 'executive summary', 'professional summary'
  ],
  skills: [
    'skills', 'technical skills', 'core skills', 'core competencies', 'competencies',
    'technologies', 'key skills', 'expertise', 'tools & technologies', 'tools and technologies',
    'programming languages', 'technical expertise', 'skills & technologies', 'skills and technologies'
  ],
  experience: [
    'work experience', 'professional experience', 'relevant experience', 'experience',
    'employment', 'employment history', 'work history', 'career history', 'internships',
    'internship experience', 'training', 'apprenticeships', 'positions held',
    'positions of responsibility', 'professional background', 'job experience'
  ],
  projects: [
    'projects', 'academic projects', 'personal projects', 'key projects', 'notable projects',
    'selected projects', 'featured projects', 'portfolio', 'side projects', 'campaign', 'case studies'
  ],
  education: [
    'education', 'educational background', 'educational history', 'academic background',
    'academic history', 'qualifications', 'degrees'
  ],
  certifications: [
    'certifications', 'certificates', 'credentials', 'professional development',
    'licenses', 'courses', 'training', 'certificate'
  ],
  achievements: [
    'achievements', 'awards', 'awards & honors', 'awards and honors', 'honors',
    'accomplishments'
  ],
  publications: [
    'publications', 'papers', 'research', 'research papers', 'articles'
  ]
};

function matchSectionHeaderSynonym(line: string): string | null {
  const normalized = line.toLowerCase().replace(/[:\s]+/g, ' ').trim();
  // Ensure the line is short enough to be a header
  if (normalized.length > 60 || line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
    return null;
  }
  
  for (const [sectionName, synonyms] of Object.entries(SECTION_SYNONYMS)) {
    // We check for exact match or very close match
    if (synonyms.includes(normalized) || synonyms.some(syn => normalized === syn)) {
      return sectionName;
    }
  }
  return null;
}

export function detectSections(
  lines: string[]
): DetectedSections & { boundaries: any[]; detectedNames: string[] } {
  const sections: Record<string, string[]> = {
    header: [],
    summary: [],
    skills: [],
    experience: [],
    projects: [],
    education: [],
    certifications: [],
    achievements: [],
    publications: []
  };

  const detectedNames: string[] = [];
  let currentSection = 'header';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();
    
    if (!t) {
      // Empty lines can be kept or discarded. Keeping them for internal spacing context.
      sections[currentSection].push(line);
      continue;
    }

    const isAllCaps = t === t.toUpperCase() && /[A-Z]/.test(t);
    const hasWhitespaceAbove = i > 0 && lines[i - 1].trim() === '';
    
    // To be considered a major heading, it must either be all-caps or have whitespace above it.
    // This prevents false positives where someone writes "Projects" as a sub-bullet.
    if (isAllCaps || hasWhitespaceAbove || i === 0) {
      const headerMatch = matchSectionHeaderSynonym(line);

      if (headerMatch) {
        currentSection = headerMatch;
        if (!detectedNames.includes(headerMatch)) {
          detectedNames.push(headerMatch);
        }
        continue; // Skip the structural header line itself
      }
    }

    sections[currentSection].push(line);
  }

  return {
    boundaries: [],
    detectedNames,
    headerLines:        sections.header,
    summaryLines:       sections.summary,
    skillsLines:        sections.skills,
    projectsLines:      sections.projects,
    experienceLines:    sections.experience,
    educationLines:     sections.education,
    certificationLines: sections.certifications,
    achievementLines:   sections.achievements,
    publicationLines:   sections.publications,
  };
}
