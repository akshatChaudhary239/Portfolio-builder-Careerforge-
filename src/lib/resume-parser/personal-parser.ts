/**
 * personal-parser.ts — Phase 5: Personal Information Extraction
 * Deterministic extraction only. No AI. Runs before section detection.
 */

import { PersonalInfo } from './types';

const PHONE_RE =
  /(?:\+?\d{1,3}[\s\-.]?)?\(?\d{2,4}\)?[\s\-.]?\d{3,4}[\s\-.]?\d{3,4}(?:[\s\-.]?\d{1,4})?/g;
const GITHUB_RE = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_\-]+)/i;
const LINKEDIN_RE = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_\-]+)/i;
const URL_RE = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi;

const ACTION_VERB_START =
  /^(Designed|Developed|Built|Created|Implemented|Deployed|Engineered|Led|Managed|Optimized|Launched|Delivered|Reduced|Improved|Analyzed|Solved|Transformed|AI-powered|AI\s+powered)/i;

/** Tech words that must not appear in the location field */
const TECH_IN_LOCATION =
  /\b(python|sql|java|javascript|typescript|react|node|aws|gcp|azure|docker|git|tableau|excel|power\s*bi|pandas|numpy|tensorflow|pytorch|mongodb|postgresql|mysql|html|css|figma|kotlin|swift|rust|go|php|ruby|scala|r\b)/i;

function cleanString(str: string): string {
  if (!str) return '';
  return str
    .replace(/\(\s*\)/g, '')
    .replace(/\[\s*\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ─── Phone Extraction ─────────────────────────────────────────────────────────

function extractPhone(fullText: string): string {
  const matches = [...fullText.matchAll(PHONE_RE)];
  for (const m of matches) {
    const raw = m[0];
    const digits = raw.replace(/\D/g, '');
    if (digits.length >= 7 && digits.length <= 15) {
      return cleanString(raw);
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
    if (TECH_IN_LOCATION.test(t)) continue;
    if (ACTION_VERB_START.test(t)) continue;
    if ((t.match(/,/g) ?? []).length > 2) continue;

    const m = t.match(LOCATION_RE);
    if (m) return cleanString(m[0]);
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
  const phone = extractPhone(fullText);
  const links = extractLinks(fullText);
  const location = extractLocation(normalizedLines);

  return { 
    fullName: '', 
    email: '', 
    phone: cleanString(phone), 
    location: cleanString(location), 
    github: cleanString(links.github || ''),
    linkedin: cleanString(links.linkedin || ''),
    website: cleanString(links.website || '')
  };
}
