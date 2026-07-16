import { Project } from './types';
import { BULLET_LINE_RE, preserveBulletStructure } from './normalize';

const DATE_RE = /(?:\b\d{1,2}\/\d{2,4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\b|\b\d{4}\b)\s*(?:[-–—to]|[tT]o)\s*(?:\b\d{1,2}\/\d{2,4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\b|\b\d{4}\b|[pP]resent|[cC]urrent|[nN]ow|[oO]ngoing)/i;

const URL_RE = /(https?:\/\/[^\s]+|www\.[^\s]+|github\.com\/[^\s]+)/i;
const GITHUB_RE = /github\.com/i;

const TECH_KW = /\b(Technologies|Tech Stack|Built with|Tools|Skills)\b/i;

function cleanString(str: string): string {
  if (!str) return '';
  return str
    .replace(/\(\s*\)/g, '')
    .replace(/\[\s*\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseProjects(lines: string[]): Project[] {
  const projects: Project[] = [];
  let currentProject: Project | null = null;
  let descriptionLines: string[] = [];

  const finalizeProject = () => {
    if (currentProject && currentProject.name) {
      currentProject.description = preserveBulletStructure(descriptionLines);
      projects.push(currentProject);
    }
    currentProject = null;
    descriptionLines = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const t = rawLine.trim();
    if (!t) continue;

    const isBullet = BULLET_LINE_RE.test(rawLine);
    
    // Check if line is a sub-heading (short, not a bullet, not starting with tech keyword)
    const isSubheading = !isBullet && t.length > 2 && t.length < 60 && !TECH_KW.test(t);
    
    if (isSubheading) {
      finalizeProject();
      
      const title = cleanString(t.replace(DATE_RE, '').replace(URL_RE, ''));
      
      currentProject = {
        name: title,
        description: '',
        liveUrl: '',
        githubUrl: '',
        technologies: [],
        problemSolved: '',
        impact: ''
      };
      
      // Extract links if on the same line
      const urlMatch = t.match(URL_RE);
      if (urlMatch) {
          if (GITHUB_RE.test(urlMatch[0])) {
              currentProject.githubUrl = urlMatch[0];
          } else {
              currentProject.liveUrl = urlMatch[0];
          }
      }
    } else {
      if (currentProject) {
        // Look for tech stack line
        if (TECH_KW.test(t)) {
           const techString = t.replace(TECH_KW, '').replace(/^[:\-]/, '').trim();
           if (techString) {
               currentProject.technologies = techString.split(',').map(s => cleanString(s)).filter(s => s.length > 0);
           }
        } else {
           // Look for isolated links
           const urlMatch = t.match(URL_RE);
           if (urlMatch && !t.includes(' ')) {
              if (GITHUB_RE.test(urlMatch[0]) && !currentProject.githubUrl) {
                  currentProject.githubUrl = urlMatch[0];
              } else if (!currentProject.liveUrl) {
                  currentProject.liveUrl = urlMatch[0];
              }
           } else {
              descriptionLines.push(rawLine);
           }
        }
      }
    }
  }

  finalizeProject();
  return projects;
}
