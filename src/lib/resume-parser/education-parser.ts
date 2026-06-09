import { Education } from './types';
import { BULLET_LINE_RE } from './normalize';
import { groupSectionBlocks } from './grouping-engine';

const DEGREE_KW = [
  'B.S','BS','B.Sc','BSc','Bachelor','Bachelors','B.Tech','BTech','B.E','BE',
  'M.S','MS','M.Sc','MSc','Master','Masters','M.Tech','MTech','MBA','MCA',
  'Ph.D','PhD','Doctorate','Doctor',
  'B.A','BA','B.Com','BCom','BBA','LLB','LLM','B.Arch','BArch',
  'Associate','Diploma','Certificate','High School','Secondary',
];

const INSTITUTION_RE = /university|college|school|institute|institution|academy|polytechnic|iit|nit|iim|bits/i;
const GRADE_RE = /(?:GPA|CGPA|Grade|Score)[:\s]*([0-9.]+(?:\s*\/\s*[0-9.]+)?)/i;
const DATE_RE = /(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?\d{4}\s*[-–—to]+\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?\d{4}|(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?\d{4}\s*[-–—to]+\s*(?:Present|Current|Now)/i;
const LOCATION_RE = /\b([A-Z][a-zA-Z]{1,20}),\s*([A-Z]{2}|[A-Z][a-zA-Z]{2,20})\b/;

function parseDateRange(text: string) {
  const m = text.match(DATE_RE);
  if (!m) return {};
  const r = m[0];
  const years = [...r.matchAll(/\b(19|20)\d{2}\b/g)].map((x) => x[0]);
  return { startDate: years[0], endDate: years[1] };
}

function mapEducationBlock(block: string[]): Education | null {
  const edu: Education = {
    institution: '',
    degree: '',
    specialization: '',
    startYear: '',
    endYear: '',
    
    cgpa: '',
  };

  for (const line of block) {
    const t = line.replace(BULLET_LINE_RE, '').trim();
    if (!t) continue;

    const hasDegree = DEGREE_KW.some((kw) => new RegExp(`\\b${kw}\\b`, 'i').test(t));
    const hasInstitution = INSTITUTION_RE.test(t);
    const gradeMatch = t.match(GRADE_RE);
    const dates = parseDateRange(t);
    const locMatch = t.match(LOCATION_RE);

    if (hasDegree && !edu.degree) {
      edu.degree = t.replace(/[,|].*$/, '').trim();
      const fm = t.match(/(?:\bin\b|\bof\b)\s+([A-Za-z\s&]+?)(?:\s*[|\-,]|\s*\d{4}|$)/i);
      if (fm) edu.specialization = fm[1].trim();
    }
    
    if (hasInstitution && !edu.institution) {
      edu.institution = t.replace(/[,|].*$/, '').trim();
    }

    if (gradeMatch && !edu.cgpa) edu.cgpa = gradeMatch[1].trim();
    
    if (dates.startDate && !edu.startYear) {
      edu.startYear = dates.startDate;
      edu.endYear = dates.endDate || '';
    }


  }

  if (!edu.institution && !edu.degree) return null;
  return edu;
}

export function parseEducation(lines: string[]): Education[] {
  // A new date or a new institution keyword signals a new education block
  const splitCondition = (line: string, currentBlock: string[]) => {
    const isNewDate = !!parseDateRange(line).startDate && currentBlock.some(l => !!parseDateRange(l).startDate);
    const isNewInst = INSTITUTION_RE.test(line) && currentBlock.some(l => INSTITUTION_RE.test(l));
    return isNewDate || isNewInst;
  };

  const blocks = groupSectionBlocks(lines, splitCondition);
  const results: Education[] = [];

  for (const block of blocks) {
    const entity = mapEducationBlock(block);
    if (entity) results.push(entity);
  }

  return results;
}
