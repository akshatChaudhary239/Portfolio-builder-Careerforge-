/**
 * section-detector.ts — Phase 3: Section Boundary Detection
 * Maps normalized lines into named resume sections with strict header matching.
 * No content leakage between sections.
 */

import { DetectedSections } from './types';
import { isSectionHeader } from './normalize';

interface SectionBoundary {
  name: string;
  startLine: number;
  endLine: number;
}

const SECTION_MAP: { re: RegExp; name: string }[] = [
  { re: /^(professional\s+)?summary$|^profile$|^objective$|^about\s*me$|^career\s+(summary|objective)$|^executive\s+summary$/i, name: 'summary' },
  { re: /^(technical\s+)?skills?$|^core\s+(skills?|competencies)$|^competencies$|^technologies?$|^key\s+skills?$|^expertise$|^tools?\s*(&|and)\s*technologies?$|^programming\s+languages?$|^technical\s+expertise$/i, name: 'skills' },
  { re: /^(work\s+|professional\s+|relevant\s+)?experience$|^employment(\s+history)?$|^work\s+history$|^career\s+history$|^internships?$|^internship\s+experience$|^training$|^apprenticeships?$|^positions?\s+(held|of\s+responsibility)$|^professional\s+background$/i, name: 'experience' },
  { re: /^(academic\s+|personal\s+|key\s+|notable\s+|selected\s+|featured\s+)?projects?$|^portfolio$|^side\s+projects?$/i, name: 'projects' },
  { re: /^education(al\s+(background|history))?$|^academic\s+(background|history)$|^qualifications?$|^degrees?$/i, name: 'education' },
  { re: /^certifications?$|^certificates?$|^credentials?$|^professional\s+development$|^licenses?$|^courses?$|^training$/i, name: 'certifications' },
  { re: /^achievements?$|^awards?\s*(&|and)\s*honors?$|^honors?$|^accomplishments?$/i, name: 'achievements' },
  { re: /^publications?$|^papers?$|^research(\s+papers?)?$|^articles?$/i, name: 'publications' },
];

function matchHeader(line: string): string | null {
  const t = line.trim();
  if (!t || t.length > 55) return null;
  for (const { re, name } of SECTION_MAP) {
    if (re.test(t)) return name;
  }
  return null;
}

function buildBoundaries(lines: string[]): SectionBoundary[] {
  const hits: { name: string; idx: number }[] = [];
  for (let i = 0; i < lines.length; i++) {
    const sn = matchHeader(lines[i]);
    if (sn) hits.push({ name: sn, idx: i });
  }

  const bounds: SectionBoundary[] = [];
  const firstSectionStart = hits[0]?.idx ?? lines.length;
  bounds.push({ name: 'header', startLine: 0, endLine: firstSectionStart });

  for (let i = 0; i < hits.length; i++) {
    bounds.push({
      name: hits[i].name,
      startLine: hits[i].idx + 1,
      endLine: hits[i + 1]?.idx ?? lines.length,
    });
  }
  return bounds;
}

function getLines(lines: string[], bounds: SectionBoundary[], name: string): string[] {
  const b = bounds.find((s) => s.name === name);
  if (!b) return [];
  return lines.slice(b.startLine, b.endLine);
}

export function detectSections(lines: string[]): DetectedSections & { boundaries: SectionBoundary[]; detectedNames: string[] } {
  const bounds = buildBoundaries(lines);
  const detectedNames = bounds.map((b) => b.name);

  return {
    boundaries: bounds,
    detectedNames,
    headerLines:      getLines(lines, bounds, 'header'),
    summaryLines:     getLines(lines, bounds, 'summary'),
    skillsLines:      getLines(lines, bounds, 'skills'),
    projectsLines:    getLines(lines, bounds, 'projects'),
    experienceLines:  getLines(lines, bounds, 'experience'),
    educationLines:   getLines(lines, bounds, 'education'),
    certificationLines: getLines(lines, bounds, 'certifications'),
    achievementLines: getLines(lines, bounds, 'achievements'),
    publicationLines: getLines(lines, bounds, 'publications'),
  };
}

export { matchHeader };
