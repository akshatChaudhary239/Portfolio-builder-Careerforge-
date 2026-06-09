import { Certification } from './types';
import { BULLET_LINE_RE } from './normalize';
import { groupSectionBlocks } from './grouping-engine';

const ISSUER_KW = /\b(Coursera|Udemy|edX|Amazon|AWS|Google|Microsoft|IBM|Oracle|Cisco|CompTIA|HackerRank|FreeCodeCamp)\b/i;
const DATE_RE = /(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?\d{4}\s*[-–—to]*\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?\d{4}?/i;

function parseDate(text: string) {
  const m = text.match(DATE_RE);
  if (!m) return null;
  return m[0].trim();
}

function mapCertificationBlock(block: string[]): Certification | null {
  const cert: Certification = {
    title: '',
    issuer: '',
    issueDate: '',
    credentialUrl: '',
  };

  const lines = block.map(l => l.replace(BULLET_LINE_RE, '').trim()).filter(Boolean);

  let description = '';

  for (const line of lines) {
    const dates = parseDate(line);
    if (dates && !cert.issueDate) {
      cert.issueDate = dates;
      continue;
    }

    const hasIssuer = ISSUER_KW.test(line);
    if (hasIssuer && !cert.issuer) {
      cert.issuer = line.replace(/[,|\-–—]/g, '').trim();
      continue;
    }

    if (!cert.title && line.length > 5 && line.length < 100) {
      cert.title = line.replace(/[,|\-–—]/g, '').trim();
      continue;
    }

    if (!description && line.length >= 20) {
      description = line;
      continue;
    }
  }

  // Fallback: If no issuer but we have a description, assume the first line is title and second is issuer if short
  if (cert.title && !cert.issuer && description && description.length < 50) {
    cert.issuer = description;
    description = '';
  }

  if (!cert.title) return null;
  return cert;
}

export function parseCertifications(lines: string[]): Certification[] {
  // A new certification starts if we see a new date
  const splitCondition = (line: string, currentBlock: string[]) => {
    const hasDate = !!parseDate(line);
    if (hasDate && currentBlock.some(l => !!parseDate(l))) return true;
    return false;
  };

  const blocks = groupSectionBlocks(lines, splitCondition);
  const results: Certification[] = [];

  for (const block of blocks) {
    const entity = mapCertificationBlock(block);
    if (entity) results.push(entity);
  }

  return results;
}
