import { Experience } from './types';
import { BULLET_LINE_RE, preserveBulletStructure, separateEmbeddedFields } from './normalize';

const POSITION_KW = /\b(intern|engineer|marketer|executive|software engineer|analyst|developer|scientist|manager|consultant|architect|lead|associate|specialist|director|coordinator|technician)\b/i;
const COMPANY_KW = /\b(pvt|ltd|lmtd|company|corp|inc|llp|technologies|labs|solutions|systems|services|group|corporation|co|llc)\b/i;
const DATE_RE = /(?:\b\d{1,2}\/\d{2,4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\b|\b\d{4}\b)\s*(?:[-–—to]|[tT]o)\s*(?:\b\d{1,2}\/\d{2,4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\b|\b\d{4}\b|[pP]resent|[cC]urrent|[nN]ow|[oO]ngoing)/i;
const LOCATION_RE = /\b([A-Z][a-zA-Z]{1,20}),\s*([A-Z]{2}|[A-Z][a-zA-Z]{2,20})\b/;

function cleanString(str: string): string {
  if (!str) return '';
  return str
    .replace(/\(\s*\)/g, '')
    .replace(/\[\s*\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseDateRange(text: string) {
  const m = text.match(DATE_RE);
  if (!m) return {};
  const r = m[0];
  const parts = r.split(/\s*(?:[-–—to]|[tT]o)\s*/i);
  if (parts.length >= 2) {
    const start = cleanString(parts[0]);
    const end = cleanString(parts[1]);
    return { startDate: start, endDate: end };
  }
  const years = [...r.matchAll(/\b(19|20)\d{2}\b/g)].map((x) => x[0]);
  return { startDate: years[0], endDate: years[1] };
}

function parseJobHeaderLine(line: string): { title: string; company: string } {
  let t = line.replace(LOCATION_RE, '').trim();
  t = cleanString(t);

  let parts: string[] = [];
  if (t.includes('|')) {
    parts = t.split('|');
  } else if (/[–—]/.test(t)) {
    parts = t.split(/[–—]/);
  } else if (t.includes(' - ')) {
    parts = t.split(' - ');
  } else if (t.includes(',')) {
    parts = t.split(',');
  } else {
    const atMatch = t.match(/\s+at\s+/i);
    if (atMatch) {
      const idx = t.indexOf(atMatch[0]);
      parts = [t.substring(0, idx), t.substring(idx + atMatch[0].length)];
    }
  }

  if (parts.length >= 2) {
    const part1 = cleanString(parts[0]);
    const part2 = cleanString(parts.slice(1).join(','));

    const p1HasPos = POSITION_KW.test(part1);
    const p2HasComp = COMPANY_KW.test(part2);
    
    if (p1HasPos || p2HasComp) {
      return { title: part1, company: part2 };
    }
    
    const p2HasPos = POSITION_KW.test(part2);
    const p1HasComp = COMPANY_KW.test(part1);
    
    if (p2HasPos || p1HasComp) {
      return { title: part2, company: part1 };
    }
  }
  
  // Attempt inline parsing
  const suffixMatch = t.match(COMPANY_KW);
  if (suffixMatch && suffixMatch.index) {
     const titlePart = t.substring(0, suffixMatch.index).trim();
     if (POSITION_KW.test(titlePart)) {
         const words = t.split(/\s+/);
         const suffixIdx = words.findIndex(w => COMPANY_KW.test(w));
         if (suffixIdx !== -1) {
             let compStartIdx = suffixIdx;
             while (compStartIdx > 0 && !POSITION_KW.test(words[compStartIdx - 1])) {
                 compStartIdx--;
             }
             if (compStartIdx === suffixIdx && suffixIdx > 0) compStartIdx--;
             const title = words.slice(0, compStartIdx).join(' ');
             const company = words.slice(compStartIdx).join(' ');
             return { title: cleanString(title), company: cleanString(company) };
         }
     }
  }
  
  // Fallback to keyword matching without separators
  if (POSITION_KW.test(t)) {
      return { title: t, company: '' };
  }

  return { title: '', company: '' };
}

export function parseExperience(lines: string[]): Experience[] {
  const experiences: Experience[] = [];
  let currentJob: Experience | null = null;
  let descriptionLines: string[] = [];

  const finalizeJob = () => {
    if (currentJob) {
      currentJob.description = preserveBulletStructure(descriptionLines);
      experiences.push(currentJob);
    }
    currentJob = null;
    descriptionLines = [];
  };

  let lastShortLine = '';

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const t = rawLine.trim();
    if (!t) continue;

    // Check if line is a bullet
    const isBullet = BULLET_LINE_RE.test(rawLine);
    
    // Check if it's the company name right after the title
    if (currentJob && !currentJob.company && !isBullet && t.length < 60 && descriptionLines.length === 0 && !DATE_RE.test(t) && !LOCATION_RE.test(t)) {
       currentJob.company = cleanString(t);
       continue;
    }

    // Attempt to parse line as a sub-heading (if not a bullet and relatively short)
    let isSubheading = false;
    let possibleHeader: { title: string; company: string } | null = null;
    
    if (!isBullet && t.length < 100) {
      possibleHeader = parseJobHeaderLine(t);
      if (possibleHeader.title || possibleHeader.company || POSITION_KW.test(t) || COMPANY_KW.test(t)) {
          isSubheading = true;
      }
    }

    if (isSubheading) {
      finalizeJob(); // close previous job
      
      const dates = parseDateRange(t);
      const locMatch = t.match(LOCATION_RE);
      
      // If we found a title but no company, the previous short line might have been the company
      let comp = possibleHeader?.company || '';
      if (!comp && lastShortLine && !DATE_RE.test(lastShortLine) && !LOCATION_RE.test(lastShortLine)) {
          comp = lastShortLine;
          // Remove it from the previous job's description if it was mistakenly added there
          if (experiences.length > 0) {
              const prevJob = experiences[experiences.length - 1];
              prevJob.description = prevJob.description.replace(lastShortLine, '').trim();
          }
      }

      currentJob = {
        position: possibleHeader?.title || '',
        company: comp,
        location: locMatch ? cleanString(locMatch[0]) : '',
        startDate: dates.startDate || '',
        endDate: dates.endDate || '',
        description: '',
        currentlyWorking: false,
        achievements: []
      };
      
      // If we didn't extract title/company well, but we know it's a subheading, store it all in title for now
      if (!currentJob.position && !currentJob.company) {
          currentJob.position = cleanString(t.replace(DATE_RE, '').replace(LOCATION_RE, ''));
      }
      
      lastShortLine = ''; // Reset
    } else {
      // It's a bullet point or description line
      if (!isBullet && t.length < 60) {
          lastShortLine = t;
      } else {
          lastShortLine = '';
      }
      
      if (currentJob) {
        descriptionLines.push(rawLine);
        
        // Sometimes dates/locations are on the line immediately following the heading
        if (!currentJob.startDate) {
          const d = parseDateRange(t);
          if (d.startDate) {
             currentJob.startDate = d.startDate;
             currentJob.endDate = d.endDate || '';
          }
        }
        if (!currentJob.location) {
          const l = t.match(LOCATION_RE);
          if (l) currentJob.location = cleanString(l[0]);
        }
      }
    }
  }

  finalizeJob();
  return experiences;
}
