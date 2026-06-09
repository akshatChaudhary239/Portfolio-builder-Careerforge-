import { Experience } from './types';
import { BULLET_LINE_RE } from './normalize';
import { groupSectionBlocks } from './grouping-engine';

const POSITION_KW = /\b(Intern|Analyst|Engineer|Developer|Scientist|Manager|Consultant|Architect|Lead|Associate|Specialist|Director|Coordinator|Executive|Technician)\b/i;
const COMPANY_KW = /\b(Ltd|LLP|Inc|Technologies|Labs|Solutions|Systems|Services|Group|Corporation|Corp|Co|LLC)\b/i;
const DATE_RE = /(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?\d{4}\s*[-–—to]+\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?\d{4}|(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?\d{4}\s*[-–—to]+\s*(?:Present|Current|Now|Ongoing)/i;
const LOCATION_RE = /\b([A-Z][a-zA-Z]{1,20}),\s*([A-Z]{2}|[A-Z][a-zA-Z]{2,20})\b/;

function parseDateRange(text: string) {
  const m = text.match(DATE_RE);
  if (!m) return {};
  const r = m[0];
  const years = [...r.matchAll(/\b(19|20)\d{2}\b/g)].map((x) => x[0]);
  return { startDate: years[0], endDate: years[1] };
}

function mapExperienceBlock(block: string[]): Experience | null {
  const exp: Experience = {
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
description: '',
    achievements: [],
  };

  // 1. Gather bullets
  for (const line of block) {
    if (BULLET_LINE_RE.test(line)) {
      exp.achievements.push(line.replace(BULLET_LINE_RE, '').trim());
    }
  }

  // 2. Identify fields from non-bullet lines
  const headerLines = block.filter(l => !BULLET_LINE_RE.test(l) && l.trim().length > 0);

  for (const line of headerLines) {
    const t = line.trim();
    const dates = parseDateRange(t);
    const locMatch = t.match(LOCATION_RE);

    if (dates.startDate && !exp.startDate) {
      exp.startDate = dates.startDate;
      exp.endDate = dates.endDate || '';
      // If the line is mostly dates, skip treating it as company/position
      if (t.length < 50) continue;
    }



    const cleanT = t.replace(DATE_RE, '').replace(LOCATION_RE, '').replace(/[,|\-–—]/g, '').trim();
    if (!cleanT) continue;

    const hasPos = POSITION_KW.test(cleanT);
    const hasComp = COMPANY_KW.test(cleanT);

    if (hasComp && !hasPos) {
      if (!exp.company) exp.company = cleanT;
    } else if (hasPos && !hasComp) {
      if (!exp.position) exp.position = cleanT;
    } else {
      // Ambiguous line. Try to assign to whatever is missing, favoring Company first if neither present
      if (!exp.company && !exp.position) {
        exp.company = cleanT;
      } else if (exp.company && !exp.position) {
        exp.position = cleanT;
      } else if (!exp.company && exp.position) {
        exp.company = cleanT;
      }
    }
  }

  // If there's no company and no position but there are achievements, it's malformed
  if (!exp.company && !exp.position && exp.achievements.length === 0) return null;

  return exp;
}

export function parseExperience(lines: string[]): Experience[] {
  // A new block starts if we see a new date range or position keyword when the block already has one.
  const splitCondition = (line: string, currentBlock: string[]) => {
    const hasDate = !!parseDateRange(line).startDate;
    const hasPos = POSITION_KW.test(line);
    
    if (hasDate && currentBlock.some(l => !!parseDateRange(l).startDate)) return true;
    if (hasPos && currentBlock.some(l => POSITION_KW.test(l))) return true;
    return false;
  };

  const blocks = groupSectionBlocks(lines, splitCondition);
  const results: Experience[] = [];

  for (const block of blocks) {
    const entity = mapExperienceBlock(block);
    if (entity && (entity.company || entity.position || entity.achievements.length > 0)) {
      results.push(entity);
    }
  }

  return results;
}
