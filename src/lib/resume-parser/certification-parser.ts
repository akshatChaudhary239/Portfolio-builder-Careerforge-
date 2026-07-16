import { Certification } from './types';
import { BULLET_LINE_RE } from './normalize';

const CERT_KW = /\b(Certificate|Certification|Course|Credential|License|Certified|AWS|Azure|GCP|Google|Microsoft|Cisco|CompTIA)\b/i;
const DATE_RE = /(?:\b\d{1,2}\/\d{2,4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\b|\b\d{4}\b)\s*(?:[-–—to]|[tT]o)\s*(?:\b\d{1,2}\/\d{2,4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\b|\b\d{4}\b|[pP]resent|[cC]urrent|[nN]ow|[oO]ngoing)/i;

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

export function parseCertifications(lines: string[]): Certification[] {
  const certifications: Certification[] = [];
  let currentCert: Certification | null = null;

  const finalizeCert = () => {
    if (currentCert && currentCert.title) {
      certifications.push(currentCert);
    }
    currentCert = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const t = rawLine.trim();
    if (!t) continue;

    const isBullet = BULLET_LINE_RE.test(rawLine);
    
    // Check if line is a sub-heading
    let isSubheading = false;
    
    if (!isBullet && t.length < 100) {
      if (CERT_KW.test(t)) {
          isSubheading = true;
      }
    }

    if (isSubheading) {
      finalizeCert();
      
      const dates = parseDateRange(t);
      
      currentCert = {
        title: '',
        issuer: '',
        issueDate: dates.endDate || dates.startDate || '',
        credentialUrl: ''
      };
      
      const parts = t.replace(DATE_RE, '').split(/[|,\-–—]/);
      if (parts.length >= 2) {
          currentCert.title = cleanString(parts[0]);
          currentCert.issuer = cleanString(parts.slice(1).join(','));
      } else {
          currentCert.title = cleanString(t.replace(DATE_RE, ''));
      }
    } else {
      if (currentCert) {
        if (!currentCert.issueDate) {
          const d = parseDateRange(t);
          if (d.startDate) {
             currentCert.issueDate = d.endDate || d.startDate;
          }
        }
        
        // Check for URL
        const urlMatch = t.match(/(https?:\/\/[^\s]+|www\.[^\s]+)/i);
        if (urlMatch && !currentCert.credentialUrl) {
            currentCert.credentialUrl = cleanString(urlMatch[0]);
        }
      }
    }
  }

  finalizeCert();
  return certifications;
}
