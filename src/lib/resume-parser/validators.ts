/**
 * validators.ts — Phase 10: Validation Layer
 * Hard rules that reject malformed projects, experience, and contact fields
 * before they can reach the UI.
 *
 * Principle: Accuracy over completeness. An empty field is better than a wrong field.
 */

import { Project, Experience, PersonalInfo, ValidationResult } from './types';

// ─── Job Title Keywords ───────────────────────────────────────────────────────
// Lines containing these are job roles, never project titles or company names.
const JOB_TITLE_RE =
  /\b(intern|internship|junior|senior|sr\.|jr\.|lead|staff|principal|manager|director|head\s+of|vp\s+of|chief|president|engineer|analyst|developer|designer|consultant|executive|officer|coordinator|specialist|associate|researcher|scientist|architect|administrator|supervisor|mentor|advisor|trainee|fellow|apprentice)\b/i;

// ─── Action Verbs (bullets, never titles) ────────────────────────────────────
const ACTION_VERB_RE =
  /^(Designed|Developed|Built|Created|Implemented|Deployed|Engineered|Architected|Led|Managed|Optimized|Integrated|Launched|Delivered|Reduced|Improved|Increased|Streamlined|Automated|Migrated|Configured|Collaborated|Coordinated|Conducted|Analyzed|Achieved|Solved|Resolved|Transformed|Shipped|Wrote|Maintained|Supported|Monitored|Researched|Reviewed|Trained|Mentored|Generated|Extracted|Processed|Tested|Debugged|Fixed|Refactored|Enhanced|Extended|Upgraded|Documented|Presented|Reported|Visualized|Modeled|Forecasted|Computed|Simulated|Improving|Managing|Building|Designing|Developing|Creating|Implementing|Delivering|Leading|Coordinating|Monitoring|Achieving|Launching|Collaborating|Automating|Handling|Driving|Scaling)\b/i;

// ─── Technology Words (not valid company names) ───────────────────────────────
const TECH_COMPANY_BLOCKLIST = new Set([
  'python', 'sql', 'r', 'java', 'javascript', 'typescript', 'c++', 'c#', 'go', 'rust',
  'php', 'ruby', 'swift', 'kotlin', 'react', 'angular', 'vue', 'node', 'node.js',
  'express', 'django', 'flask', 'spring', 'rails', 'postgresql', 'mysql', 'mongodb',
  'redis', 'elasticsearch', 'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'terraform',
  'git', 'linux', 'html', 'css', 'sass', 'tailwind', 'webpack', 'vite', 'jest',
  'pandas', 'numpy', 'scipy', 'tensorflow', 'pytorch', 'keras', 'sklearn', 'scikit',
  'tableau', 'power bi', 'excel', 'figma', 'sketch', 'xd', 'ai', 'ml', 'nlp',
  'data', 'analytics', 'visualization', 'machine learning', 'deep learning',
]);

// ─── Sentence structure patterns that prove a line is a description, not a title ─
const SENTENCE_STRUCTURE_RE =
  /\bto\s+(analyze|improve|build|develop|create|implement|manage|support|enhance|automate|handle|process|ensure|provide|enable|deploy|generate|predict|forecast|monitor|track|visualize|optimize|scale|integrate)\b|\bin\s+order\s+to\b|\bfor\s+(the|a|an|all|every|each|future|real|existing|better)\b/i;

// ─── Public API ───────────────────────────────────────────────────────────────

export function isJobTitle(text: string): boolean {
  return JOB_TITLE_RE.test(text);
}

export function isTechWord(text: string): boolean {
  return TECH_COMPANY_BLOCKLIST.has(text.toLowerCase().trim());
}

/**
 * Validates a project entry.
 * Returns { valid: false, reason } for any malformed project.
 */
export function validateProject(p: Partial<Project>): ValidationResult {
  const title = (p.name ?? '').trim();

  if (!title || title.length < 2) return { valid: false, reason: 'Title is empty or too short' };
  if (title.length > 65) return { valid: false, reason: 'Title too long (> 65 chars) — likely a sentence' };
  if (title.endsWith('.') || title.endsWith('?') || title.endsWith('!')) {
    return { valid: false, reason: 'Title ends with sentence punctuation' };
  }
  if (!/^[A-Z0-9]/.test(title)) {
    return { valid: false, reason: 'Title starts with lowercase — likely a wrapped sentence fragment' };
  }
  if (ACTION_VERB_RE.test(title)) {
    return { valid: false, reason: `Title starts with action verb "${title.split(' ')[0]}" — it is a bullet point` };
  }
  if (isJobTitle(title)) {
    return { valid: false, reason: `Title contains job role keyword — "${title}" is a job title, not a project` };
  }
  
  const eduKeywords = /\b(university|college|school|institute|academy|bachelor|bachelors|master|masters|degree|diploma|secondary|education|bca|mca|btech|mtech)\b/i;
  if (eduKeywords.test(title)) {
    return { valid: false, reason: 'Title contains education keyword' };
  }

  const certKeywords = /\b(certificat|certifications?|course|credential|license)\b/i;
  if (certKeywords.test(title)) {
    return { valid: false, reason: 'Title contains certification keyword' };
  }

  if (SENTENCE_STRUCTURE_RE.test(title)) {
    return { valid: false, reason: 'Title contains sentence structure ("to [verb]") — it is a description' };
  }
  const wordCount = title.split(/\s+/).length;
  if (wordCount > 8) {
    return { valid: false, reason: `Title has ${wordCount} words — too many for a project name` };
  }
  
  // Reject single numbers, date ranges, or years (e.g. "2025", "2022-2025")
  if (/^\d+$/.test(title) || /^\d{4}(?:\s*[-–—to\s]+\s*\d{4})?$/.test(title)) {
    return { valid: false, reason: 'Title is a date, range, or number' };
  }

  return { valid: true };
}

/**
 * Validates an experience entry.
 * Detects and corrects company/role swaps automatically.
 */
export function validateExperience(e: Partial<Experience>): ValidationResult & { fixed?: Partial<Experience> } {
  const company = (e.company ?? '').trim();
  const position = (e.position ?? '').trim();

  if (!company && !position) return { valid: false, reason: 'Both company and position are empty' };

  // Detect company/position swap: company contains job title keywords, position does not
  const companyLooksLikeRole = isJobTitle(company);
  const roleLooksLikeCompany =
    !isJobTitle(position) &&
    /^[A-Z]/.test(position) &&
    position.split(/\s+/).length <= 4 &&
    !ACTION_VERB_RE.test(position);

  if (companyLooksLikeRole && roleLooksLikeCompany && position) {
    // Auto-repair: swap the fields
    return {
      valid: true,
      reason: `Swapped company/position — "${company}" is a job title, "${position}" is the company`,
      fixed: { ...e, company: position, position: company },
    };
  }

  // Reject if company is a technology word
  if (isTechWord(company)) {
    return { valid: false, reason: `Company "${company}" is a technology keyword, not a company name` };
  }

  // Reject if company is a pure action verb sentence
  if (ACTION_VERB_RE.test(company)) {
    return { valid: false, reason: `Company "${company}" starts with an action verb — it is an achievement bullet` };
  }

  return { valid: true };
}

/**
 * Validates personal info fields individually.
 */
export function validatePersonalInfo(info: Partial<PersonalInfo>): ValidationResult & { warnings: string[] } {
  const warnings: string[] = [];

  if (!info.email) warnings.push('Email not found');
  if (!info.phone) warnings.push('Phone number not found');
  if (!info.fullName) warnings.push('Full name not detected');

  // Sanity check: name shouldn't be a sentence
  if (info.fullName && info.fullName.split(' ').length > 5) {
    warnings.push(`Name "${info.fullName}" may be incorrect — too many words`);
  }
  if (info.fullName && ACTION_VERB_RE.test(info.fullName)) {
    warnings.push(`Name "${info.fullName}" starts with a verb — may have captured summary text`);
  }

  return { valid: warnings.length === 0, warnings };
}
