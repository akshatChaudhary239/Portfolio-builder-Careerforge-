import { Education } from './types';
import { BULLET_LINE_RE } from './normalize';

const DEGREE_KW = /\b(B\.S|BS|B\.Sc|BSc|Bachelor|Bachelors|B\.Tech|BTech|B\.E|BE|M\.S|MS|M\.Sc|MSc|Master|Masters|M\.Tech|MTech|MBA|MCA|Ph\.D|PhD|Doctorate|Doctor|B\.A|BA|B\.Com|BCom|BBA|LLB|LLM|B\.Arch|BArch|Associate|Diploma|High School)\b/i;
const INSTITUTION_KW = /\b(University|College|School|Institute|Institution|Academy|Polytechnic|IIT|NIT|IIM|BITS)\b/i;

const GRADE_RE = /(?:GPA|CGPA|Grade|Score)[:\s]*([0-9.]+(?:\s*\/\s*[0-9.]+)?)/i;
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

export function parseEducation(lines: string[]): Education[] {
  const educations: Education[] = [];
  let currentEdu: Education | null = null;

  const finalizeEdu = () => {
    if (currentEdu && (currentEdu.degree || currentEdu.institution)) {
      educations.push(currentEdu);
    }
    currentEdu = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const t = rawLine.trim();
    if (!t) continue;

    const isBullet = BULLET_LINE_RE.test(rawLine);
    
    // Check if line is a sub-heading (has degree or institution keywords, not a bullet)
    let isSubheading = false;
    
    if (!isBullet && t.length < 100) {
      if (DEGREE_KW.test(t) || INSTITUTION_KW.test(t)) {
          isSubheading = true;
      }
    }

    if (isSubheading) {
      finalizeEdu();
      
      const dates = parseDateRange(t);
      const locMatch = t.match(LOCATION_RE);
      const gradeMatch = t.match(GRADE_RE);
      
      currentEdu = {
        degree: '',
        institution: '',
        specialization: '',
        startYear: dates.startDate || '',
        endYear: dates.endDate || '',
        year: dates.endDate || dates.startDate || '',
        cgpa: gradeMatch ? cleanString(gradeMatch[1]) : '',
        location: locMatch ? cleanString(locMatch[0]) : ''
      };
      
      const parts = t.replace(DATE_RE, '').replace(LOCATION_RE, '').replace(GRADE_RE, '').split(/[|,\-–—]/);
      for (const part of parts) {
          const pt = part.trim();
          if (DEGREE_KW.test(pt) && !currentEdu.degree) {
              currentEdu.degree = cleanString(pt);
          } else if (INSTITUTION_KW.test(pt) && !currentEdu.institution) {
              currentEdu.institution = cleanString(pt);
          }
      }
      
      if (!currentEdu.degree && !currentEdu.institution) {
          currentEdu.degree = cleanString(t);
      }
    } else {
      if (currentEdu) {
        if (!currentEdu.startYear) {
          const d = parseDateRange(t);
          if (d.startDate) {
             currentEdu.startYear = d.startDate;
             currentEdu.endYear = d.endDate || '';
             currentEdu.year = d.endDate || d.startDate;
          }
        }
        if (!currentEdu.cgpa) {
            const g = t.match(GRADE_RE);
            if (g) currentEdu.cgpa = cleanString(g[1]);
        }
      }
    }
  }

  finalizeEdu();
  return educations;
}
