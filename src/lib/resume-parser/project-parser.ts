import { Project } from './types';
import { BULLET_LINE_RE } from './normalize';
import { groupSectionBlocks } from './grouping-engine';

const TECH_LABEL_RE = /^(?:tech(?:nologies)?|stack|built\s+with|tools?(?:\s*used)?|environment)[:\s]+/i;
const SPECIFIC_TECH_KW = /\b(React|TypeScript|JavaScript|Python|FastAPI|Supabase|PostgreSQL|MongoDB|Node\.js|TensorFlow|Scikit-learn|AWS|Docker|Kubernetes|Next\.js|Vue|Angular|Java|Spring|C#|\\.NET|Golang|Ruby)\b/i;
const METRIC_RE = /\b(\d+(?:\.\d+)?[%xkmb+]+|\$\d+(?:\.\d+)?[kmb]?)\b/i;
const PROBLEM_KW = /\b(challenge|problem|goal|objective|aimed to|designed to solve|resolved)\b/i;
const IMPACT_KW = /\b(impact|resulted in|led to|improved|increased|decreased|optimized|saved)\b/i;

function extractTechItems(line: string): string[] {
  const labelMatch = line.match(TECH_LABEL_RE);
  if (labelMatch) {
    const content = line.substring(labelMatch[0].length);
    return content.split(/[,/|]+/).map(t => t.trim()).filter(Boolean);
  }
  
  // If it just lists technologies
  if (SPECIFIC_TECH_KW.test(line)) {
    const parts = line.split(/[,|]/);
    if (parts.length > 1 && parts.every(p => p.trim().split(/\s+/).length <= 3)) {
      return parts.map(p => p.trim()).filter(Boolean);
    }
  }
  return [];
}

function mapProjectBlock(block: string[]): Project | null {
  const proj: Project = {
    name: '',
    technologies: [],
    description: '',
    problemSolved: '',
    impact: '',
githubUrl: '',
liveUrl: '',
  };

  const headerLines = [];
  const bullets = [];

  for (const line of block) {
    if (BULLET_LINE_RE.test(line)) {
      bullets.push(line.replace(BULLET_LINE_RE, '').trim());
    } else {
      headerLines.push(line.trim());
    }
  }

  // Parse header lines
  for (const line of headerLines) {
    if (!line) continue;

    const techItems = extractTechItems(line);
    if (techItems.length > 0) {
      proj.technologies.push(...techItems);
      continue;
    }

    // Title is usually the first non-tech line
    if (!proj.name && line.split(/\s+/).length <= 10) {
      proj.name = line.replace(/[,|\-–—]/g, '').trim();
      continue;
    }

    // Description is the next paragraph
    if (!proj.description && line.length > 20) {
      proj.description = line;
      continue;
    }
  }

  // Parse bullets for problem and impact
  for (const bullet of bullets) {
    // If we don't have a description, the first bullet can act as one
    if (!proj.description) {
      proj.description = bullet;
    }

    if (!proj.problemSolved && PROBLEM_KW.test(bullet)) {
      proj.problemSolved = bullet;
    }

    if (!proj.impact && (IMPACT_KW.test(bullet) || METRIC_RE.test(bullet))) {
      proj.impact = bullet;
    }

    // Detect tech in bullets if not found
    if (proj.technologies.length === 0 && SPECIFIC_TECH_KW.test(bullet)) {
      const match = bullet.match(new RegExp(SPECIFIC_TECH_KW.source, 'gi'));
      if (match) {
        proj.technologies.push(...match.map(m => m.trim()));
      }
    }
  }

  // Deduplicate tech
  proj.technologies = Array.from(new Set(proj.technologies));

  if (!proj.name) return null;
  return proj;
}

export function parseProjects(lines: string[]): Project[] {
  // A new project starts if we see a short line that doesn't look like tech or a date
  const splitCondition = (line: string, currentBlock: string[]) => {
    // If the line looks like a title (short, no tech keywords) and we already have a title
    const isTech = TECH_LABEL_RE.test(line) || SPECIFIC_TECH_KW.test(line);
    const isShort = line.split(/\s+/).length <= 10;
    const hasExistingTitle = currentBlock.some(l => !BULLET_LINE_RE.test(l) && l.split(/\s+/).length <= 10 && !TECH_LABEL_RE.test(l) && !SPECIFIC_TECH_KW.test(l));
    
    return isShort && !isTech && hasExistingTitle;
  };

  const blocks = groupSectionBlocks(lines, splitCondition);
  const results: Project[] = [];

  for (const block of blocks) {
    const entity = mapProjectBlock(block);
    if (entity) results.push(entity);
  }

  return results;
}
