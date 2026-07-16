/**
 * normalize.ts — Phase 1: Text Normalization
 * Converts raw extracted text into a clean, consistently formatted line array.
 *
 * Key operations:
 *  1. Normalize unicode bullets → standard "•"
 *  2. Collapse multiple spaces/tabs
 *  3. Merge PDF-wrapped continuation lines (lowercase continuation)
 *  4. Collapse repeated blank lines → single blank
 */

const BULLET_CHAR = '•';
const BULLET_LINE_RE = /^•\s+/;

/** All unicode bullet characters mapped to standard bullet */
const UNICODE_BULLET_RE = /[▸▹►▶→✓✗✦✧‣⁃◦⦿⦾➢➣➤★♦◆]/g;

/** Section header keywords — needed so we never merge a header into the previous line */
const SECTION_KW_RE =
  /^(summary|profile|objective|about|skills?|technical\s+skills?|core\s+skills?|experience|work\s+experience|professional\s+experience|employment|internships?|projects?|academic\s+projects?|personal\s+projects?|education|certifications?|certificates?|achievements?|awards?|honors?|leadership|publications?|positions?\s+of\s+responsibility|extracurricular)(\s*:)?$/i;

/** Page markers, footers, headers that should be stripped entirely */
const PAGE_MARKER_RE = /^(?:page\s+\d+(?:\s+of\s+\d+)?|--\s*\d+\s+of\s+\d+\s*--|generated\s+by\s+microsoft\s+word|confidential)$/i;

function isSectionHeader(line: string): boolean {
  return SECTION_KW_RE.test(line.trim());
}

/**
 * Normalizes raw resume text into a clean array of lines.
 * - PDF-wrapped lines (lowercase continuation) are merged into one
 * - Unicode bullets → "• "
 * - Multiple blank lines → single blank
 */
export function normalizeLines(rawText: string): string[] {
  // 1. Unify line endings
  let text = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // 2. Normalize bullets
  text = text
    .replace(UNICODE_BULLET_RE, `${BULLET_CHAR} `)
    .replace(/\n[ \t]*[-*][ \t]+/g, `\n${BULLET_CHAR} `) // leading - or * → bullet
    .replace(/[ \t]+/g, ' ');

  // 3. Split and merge wrapped lines
  const rawLines = text.split('\n');
  const merged: string[] = [];

  for (const rawLine of rawLines) {
    const line = rawLine.trim();

    if (!line) {
      merged.push('');
      continue;
    }

    // Completely drop page markers
    if (PAGE_MARKER_RE.test(line)) {
      continue;
    }

    // Section headers and bullet lines always start fresh
    if (isSectionHeader(line) || BULLET_LINE_RE.test(line)) {
      merged.push(line);
      continue;
    }

    // Continuation: lowercase start + previous non-empty, non-sentence-ending line
    const prev = merged[merged.length - 1];
    const startsLower = /^[a-z]/.test(line);
    const prevIsOpen =
      prev !== undefined &&
      prev !== '' &&
      !BULLET_LINE_RE.test(prev) &&
      !prev.endsWith('.') &&
      !prev.endsWith('?') &&
      !prev.endsWith('!') &&
      !prev.endsWith(':') &&
      !isSectionHeader(prev);

    if (startsLower && prevIsOpen) {
      merged[merged.length - 1] = prev + ' ' + line;
    } else {
      merged.push(line);
    }
  }

  // 4. Collapse repeated blank lines
  const collapsed: string[] = [];
  let prevBlank = false;
  for (const line of merged) {
    if (!line) {
      if (!prevBlank) collapsed.push('');
      prevBlank = true;
    } else {
      collapsed.push(line);
      prevBlank = false;
    }
  }

  return collapsed;
}

const DATE_RANGE_PATTERN = /(?:\b\d{1,2}\/\d{2,4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\b|\b\d{4}\b)\s*(?:[-–—to]|[tT]o)\s*(?:\b\d{1,2}\/\d{2,4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\b|\b\d{4}\b|[pP]resent|[cC]urrent|[nN]ow|[oO]ngoing)/i;

export function separateEmbeddedFields(rawValue: string): { main: string; dateRange: string | null } {
  if (!rawValue) return { main: '', dateRange: null };

  const rangeMatch = rawValue.match(DATE_RANGE_PATTERN);
  if (rangeMatch) {
    const dateRange = rangeMatch[0].trim().replace(/^[\s()]+|[\s()]+$/g, '');
    const mainText = rawValue.substring(0, rangeMatch.index).replace(/[,|\-–—\s()]+$/, '').trim();
    return { main: mainText, dateRange };
  }

  const singleYearMatch = rawValue.match(/\b(19|20)\d{2}\b/);
  if (singleYearMatch && singleYearMatch.index !== undefined) {
    const dateRange = singleYearMatch[0];
    const mainText = rawValue.substring(0, singleYearMatch.index).replace(/[,|\-–—\s()]+$/, '').trim();
    return { main: mainText, dateRange };
  }

  return { main: rawValue.trim(), dateRange: null };
}

export function preserveBulletStructure(descLines: string[]): string {
  const bulletMarkers = ['•', '-', '*', '▪', '◦'];
  const bullets: string[] = [];
  let current = '';

  for (const line of descLines) {
    const text = line.trim();
    if (!text) continue;

    // Split on inline bullets if they got merged
    if (text.includes('•')) {
      if (current) {
        bullets.push(current.trim());
        current = '';
      }
      const parts = text.split('•').map(p => p.trim()).filter(Boolean);
      bullets.push(...parts);
      continue;
    }

    const startsNewBullet =
      bulletMarkers.some(m => text.startsWith(m)) ||
      /^\d+[\.\)]/.test(text);

    if (startsNewBullet) {
      if (current) {
        bullets.push(current.trim());
      }
      let cleanText = text;
      for (const marker of bulletMarkers) {
        if (cleanText.startsWith(marker)) {
          cleanText = cleanText.substring(marker.length).trim();
          break;
        }
      }
      const numMatch = cleanText.match(/^\d+[\.\)]\s*/);
      if (numMatch) {
        cleanText = cleanText.substring(numMatch[0].length).trim();
      }
      current = cleanText;
    } else {
      if (current) {
        current += ' ' + text;
      } else {
        current = text;
      }
    }
  }

  if (current) {
    bullets.push(current.trim());
  }

  return bullets.map(b => `• ${b}`).join('\n');
}

export { BULLET_LINE_RE, BULLET_CHAR, isSectionHeader };
