/**
 * pipeline.ts — Phase 12: Main Parsing Pipeline
 *
 * Orchestrates all phases in order:
 *  Phase 1  – normalizeLines()
 *  Phase 2  – extractPersonalInfo()   (independent of sections)
 *  Phase 3  – detectSections() (AI-Assisted)
 *  Phase 4  – extractSkills()
 *  Phase 5  – parseProjects()
 *  Phase 6  – parseExperience()
 *  Phase 7  – parseEducation()
 *  Phase 8  – parseCertifications()
 *  Phase 9  – calculateConfidence()
 *  Phase 10 – Emit debug diagnostics (dev mode)
 *
 * Returns ParsedResumeResult — exactly matches what onboarding-client.tsx expects.
 * Never generates placeholder data. Low-confidence fields are left empty.
 */

import { ProfessionCategory } from '@/db/local-db';
import { devLog } from '@/lib/model-config';

import { ParsedResumeResult, ParserDebugInfo } from './types';
import { normalizeLines } from './normalize';
import { detectSections } from './section-detector';
import { extractPersonalInfo } from './personal-parser';
import { extractSkills } from './skills-parser';
import { parseProjects } from './project-parser';
import { parseExperience } from './experience-parser';
import { parseEducation } from './education-parser';
import { parseCertifications } from './certification-parser';
import { calculateConfidence } from './confidence';
import { validateProject, validateExperience } from './validators';


// ─── Main Entry Point ─────────────────────────────────────────────────────────

export async function parseResume(
  rawText: string,
  category: ProfessionCategory,
  originalFileName?: string
): Promise<ParsedResumeResult> {
  const t0 = Date.now();
  const isDev = process.env.NODE_ENV === 'development';

  // ── Phase 1: Normalize ────────────────────────────────────────────────────
  const lines = normalizeLines(rawText);

  // ── Phase 2: Section Detection ──────────────────────────────
  const sections = detectSections(lines);

  // ── Phase 3: Entity Extraction ────────────────────────────────────────────
  const personal = extractPersonalInfo(lines, rawText);
  const { primarySkills, secondarySkills } = extractSkills(
    sections.skillsLines,
    sections.experienceLines,
    sections.projectsLines,
    category
  );
  const skills = primarySkills.map(s => ({ name: s }));
  let projects = parseProjects(sections.projectsLines);
  let experience = parseExperience(sections.experienceLines);
  const education = parseEducation(sections.educationLines);
  const certifications = parseCertifications(sections.certificationLines);

  // ── Phase 4: Validation ───────────────────────────────────────────────────
  const projectsRejected: { item: string; reason: string }[] = [];
  projects = projects.filter((p) => {
    const res = validateProject(p);
    if (!res.valid) {
      projectsRejected.push({ item: p.name || 'Unknown', reason: res.reason || 'Invalid' });
      return false;
    }
    return true;
  });

  const experienceRejected: { item: string; reason: string }[] = [];
  const validExperience = [];
  for (const exp of experience) {
    const res = validateExperience(exp);
    if (res.valid) {
      validExperience.push((res.fixed as any) || exp);
    } else {
      experienceRejected.push({ item: exp.company || exp.position || 'Unknown', reason: res.reason || 'Invalid' });
    }
  }
  experience = validExperience;

  // ── Phase 5: Confidence ───────────────────────────────────────────────────
  const confidenceScores = calculateConfidence({
    fullName:       personal.fullName ?? '',
    email:          personal.email ?? '',
    phone:          personal.phone ?? '',
    location:       personal.location ?? '',
    skills,
    education,
    experience,
    projects,
    certifications,
  });

  const parserDebug: ParserDebugInfo | undefined = isDev ? {
    sectionsDetected:       sections.detectedNames,
    projectsAccepted:       projects.map(p => p.name || 'Unknown Project'),
    projectsRejected,
    experienceAccepted:     experience.map(e => e.company || 'Unknown Company'),
    experienceRejected,
    aiUsed:                 false,
    aiStatus:               'skipped',
    confidenceScores,
    validationErrors:       [],
  } : undefined;

  if (isDev) {
    devLog('[Pipeline] Grouping Engine Finished', {
      ms:       Date.now() - t0,
      skills:   skills.length,
      exp:      experience.length,
      projects: projects.length,
      edu:      education.length,
      certs:    certifications.length,
      confidence: confidenceScores,
    });
  }

  function cleanEmptyParenRemnants(val: any): any {
    if (typeof val === 'string') {
      return val
        .replace(/\(\s*\)/g, '')
        .replace(/\[\s*\]/g, '')
        .replace(/[ \t]+/g, ' ')
        .split('\n')
        .map(line => line.trim())
        .join('\n')
        .trim();
    }
    if (Array.isArray(val)) {
      return val.map(item => cleanEmptyParenRemnants(item));
    }
    if (val !== null && typeof val === 'object') {
      const cleaned: any = {};
      for (const key of Object.keys(val)) {
        cleaned[key] = cleanEmptyParenRemnants(val[key]);
      }
      return cleaned;
    }
    return val;
  }

  const result: ParsedResumeResult = {
    summary: '',
    achievements: [],
    personalInfo: personal,
    skills,
    education,
    experience,
    projects,
    certifications,
    confidenceScores,
    rawText,
    extractedAt: new Date().toISOString(),
    originalFileName,
    isPartialExtraction: confidenceScores.overall < 45,
    suggestedSkills: secondarySkills,
    parserDebug,
  };

  return cleanEmptyParenRemnants(result);
}
