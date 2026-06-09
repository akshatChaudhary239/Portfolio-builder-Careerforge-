/**
 * personal-parser.ts — Phase 5: Personal Information Extraction
 * Deterministic extraction only. No AI. Runs before section detection.
 *
 * Fixes vs v3:
 *  - Name: scans first 15 normalized lines (not just header section)
 *    handles merged lines like "Name | Title" by splitting on separators
 *  - Phone: scans full text (not just first 1000 chars)
 *  - Location: strict — rejects lines with tech keywords or commas that look like skill lists
 */

import { PersonalInfo } from './types';

const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
const PHONE_RE =
  /(?:\+?\d{1,3}[\s\-.]?)?\(?\d{2,4}\)?[\s\-.]?\d{3,4}[\s\-.]?\d{3,4}(?:[\s\-.]?\d{1,4})?/g;
const GITHUB_RE = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_\-]+)/i;
const LINKEDIN_RE = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_\-]+)/i;
const URL_RE = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi;

const ACTION_VERB_START =
  /^(Designed|Developed|Built|Created|Implemented|Deployed|Engineered|Led|Managed|Optimized|Launched|Delivered|Reduced|Improved|Analyzed|Solved|Transformed|AI-powered|AI\s+powered)/i;

const JOB_TITLE_KW =
  /\b(intern|junior|senior|engineer|analyst|developer|designer|manager|consultant|executive|director|architect|researcher|scientist|specialist|coordinator|advisor|trainee|expert)\b/i;

const SECTION_KW_RE =
  /^(summary|profile|objective|about|skills?|core\s+skills?|technical\s+skills?|experience|work\s+experience|professional\s+experience|employment|internships?|internship\s+experience|training|apprenticeships?|projects?|academic\s+projects?|personal\s+projects?|education|certifications?|certificates?|achievements?|awards?|honors?|leadership|publications?|positions?\s+of\s+responsibility|extracurricular)(\s*:)?$/i;

const BAD_NAMES_RE =
  /^(python|sql|power\s*bi|excel|tableau|machine\s*learning|core\s*skills?|projects?|experience|education)$/i;

/** Tech words that must not appear in the location field */
const TECH_IN_LOCATION =
  /\b(python|sql|java|javascript|typescript|react|node|aws|gcp|azure|docker|git|tableau|excel|power\s*bi|pandas|numpy|tensorflow|pytorch|mongodb|postgresql|mysql|html|css|figma|kotlin|swift|rust|go|php|ruby|scala|r\b)/i;

// ─── Name Extraction ─────────────────────────────────────────────────────────

function looksLikeName(candidate: string): boolean {
  const t = candidate.trim();
  if (!t || t.length < 3 || t.length > 50) return false;
  if (/\d/.test(t)) return false;
  if (/@|http|linkedin|github/i.test(t)) return false;
  if (ACTION_VERB_START.test(t)) return false;
  if (JOB_TITLE_KW.test(t)) return false;
  if (SECTION_KW_RE.test(t)) return false;
  if (BAD_NAMES_RE.test(t)) return false;

  const words = t.split(/\s+/);
  if (words.length < 2 || words.length > 5) return false;

  // Every word starts with uppercase letter (allow hyphens, apostrophes, initials)
  return words.every((w) => /^[A-Z][a-zA-Z\-'\.]{0,}$/.test(w));
}

/**
 * Extracts name from the first ~15 lines.
 * Handles mixed lines like "Akshat Chaudhary | Data Analyst" by splitting on | or –
 */
function extractName(lines: string[]): string {
  for (const rawLine of lines.slice(0, 15)) {
    if (!rawLine) continue;

    // Try splitting on common separators used in header lines
    const segments = rawLine.split(/[|\-–—,]/).map((s) => s.trim());
    for (const seg of segments) {
      if (looksLikeName(seg)) return seg;
    }

    // Try the whole line
    if (looksLikeName(rawLine.trim())) return rawLine.trim();
  }
  return '';
}

// ─── Phone Extraction ─────────────────────────────────────────────────────────

function extractPhone(fullText: string): string {
  const matches = [...fullText.matchAll(PHONE_RE)];
  for (const m of matches) {
    const raw = m[0];
    const digits = raw.replace(/\D/g, '');
    // Must have 7–15 digits and look like a real phone number
    if (digits.length >= 7 && digits.length <= 15) {
      return raw.trim();
    }
  }
  return '';
}

// ─── Location Extraction ─────────────────────────────────────────────────────

const LOCATION_RE = /\b([A-Z][a-zA-Z]{1,20}),\s*([A-Z]{2}|[A-Z][a-zA-Z]{2,20})\b/;

function extractLocation(lines: string[]): string {
  for (const line of lines.slice(0, 15)) {
    const t = line.trim();
    if (!t || t.length > 55) continue;
    // Skip lines with tech keywords — those are skill lists, not locations
    if (TECH_IN_LOCATION.test(t)) continue;
    // Skip lines that look like sentences
    if (ACTION_VERB_START.test(t)) continue;
    // Skip lines with many commas (skill lists)
    if ((t.match(/,/g) ?? []).length > 2) continue;

    const m = t.match(LOCATION_RE);
    if (m) return m[0];
  }
  return '';
}

// ─── Link Extraction ─────────────────────────────────────────────────────────

function extractLinks(fullText: string): { github?: string; linkedin?: string; website?: string } {
  const github = fullText.match(GITHUB_RE)?.[0];
  const linkedin = fullText.match(LINKEDIN_RE)?.[0];
  const allUrls = [...(fullText.matchAll(new RegExp(URL_RE.source, 'gi')))].map((m) => m[0]);
  const website = allUrls.find(
    (u) => !u.includes('github.com') && !u.includes('linkedin.com')
  );
  return { github, linkedin, website };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function extractPersonalInfo(normalizedLines: string[], fullText: string): PersonalInfo {
  const email = (fullText.match(EMAIL_RE) ?? [])[0]?.toLowerCase() ?? '';
  const phone = extractPhone(fullText);
  const links = extractLinks(fullText);
  const fullName = extractName(normalizedLines);
  const location = extractLocation(normalizedLines);

  return { 
    fullName, 
    email, 
    phone, 
    location, 
     
    github: links.github || '',
    linkedin: links.linkedin || '',
    website: links.website || ''
  };
}
