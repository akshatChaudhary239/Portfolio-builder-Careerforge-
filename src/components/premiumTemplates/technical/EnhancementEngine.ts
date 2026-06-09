import { CareerProfile, Experience, Project } from '@/db/local-db';

export interface EnhancedExperience extends Experience {
  enhancedAchievements: string[];
  extractedTechnologies: string;
}

export interface EnhancedProject extends Project {
  enhancedOverview: string;
  enhancedAchievements: string[];
  extractedTechnologies: string[];
  enhancedLinks: { label: string; url: string }[];
}

export interface CategorizedSkills {
  category: string;
  items: string[];
}

export interface EnhancedProfile extends Omit<CareerProfile, 'experience' | 'projects'> {
  enhancedSummary: string;
  categorizedSkills: CategorizedSkills[];
  enhancedExperience: EnhancedExperience[];
  enhancedProjects: EnhancedProject[];
}

const extractTech = (text: string): string[] => {
  const commonTech = ['React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Express.js', 'Next.js', 'Vue', 'Angular', 'Java', 'C++', 'Go', 'Redis', 'GraphQL', 'REST API', 'Power BI', 'Machine Learning', 'Pandas', 'Scikit-Learn'];
  const found = commonTech.filter(t => text.toLowerCase().includes(t.toLowerCase()));
  return found;
};

const upgradeVerbs = (text: any): string => {
  let result = typeof text === 'string' ? text : String(text || '');
  if (result === '[object Object]') {
    result = text.description || text.title || text.name || Object.values(text)[0] || '';
    if (typeof result !== 'string') result = String(result);
  }
  const verbReplacements = [
    { pattern: /^(Responsible for|In charge of|Tasked with|Worked on|Made|Did) /i, replacement: "Developed and managed " },
    { pattern: /^Helped (with|to) /i, replacement: "Collaborated to " },
    { pattern: /^Participated in /i, replacement: "Actively contributed to " },
  ];
  for (const { pattern, replacement } of verbReplacements) {
    result = result.replace(pattern, replacement);
  }
  return result;
};

const cleanRedundancy = (text: any): string => {
  let str = typeof text === 'string' ? text : String(text || '');
  if (str === '[object Object]') {
    str = text.description || text.title || text.name || Object.values(text)[0] || '';
    if (typeof str !== 'string') str = String(str);
  }
  return str.replace(/successfully /ig, '').replace(/in order to /ig, 'to ').trim();
};

const generateTechnicalBullets = (name: string, techs: string[], needed: number): string[] => {
  const t1 = techs[0] || 'modern frameworks';
  const t2 = techs[1] || 'scalable backend services';
  const t3 = techs[2] || 'optimized databases';
  
  const templates = [
    `Architected and deployed the core infrastructure for ${name} using ${t1} and ${t2}, ensuring high availability and scalable performance.`,
    `Engineered seamless data integration and API workflows utilizing ${t3}, significantly reducing latency and improving data reliability.`,
    `Implemented robust authentication, security protocols, and state management across the ${name} ecosystem.`,
    `Optimized frontend rendering performance and database queries with ${t1}, achieving substantial improvements in application load times.`,
    `Designed scalable component architecture and integrated third-party services to expand core platform capabilities.`
  ];
  return templates.slice(0, needed);
};

const splitIntoBullets = (text: any, name: string, techs: string[], min: number = 3): string[] => {
  let str = typeof text === 'string' ? text : String(text || '');
  if (str === '[object Object]') {
    str = text.description || text.title || text.name || Object.values(text)[0] || '';
    if (typeof str !== 'string') str = String(str);
  }
  if (!str) return generateTechnicalBullets(name, techs, min);
  const sentences = str.split(/(?<=[.!?])\s+/).filter(s => s.length > 10);
  let bullets = sentences.map(s => upgradeVerbs(cleanRedundancy(s)));
  
  // Filter out any known bad generic bullets if they somehow made it in
  const badPatterns = [/Engineered core functionality/i, /Ensured quality deliverables/i, /Worked on project/i];
  bullets = bullets.filter((b: string) => !badPatterns.some(p => p.test(b)));

  if (bullets.length < min) {
    const generated = generateTechnicalBullets(name, techs, min - bullets.length);
    bullets = [...bullets, ...generated];
  }
  
  return bullets.slice(0, 5); // Max 5
};

export class EnhancementEngine {
  static enhanceSummary(profile: CareerProfile): string {
    const raw = profile.summary || (profile as any).professionalSummary || (profile.personalInfo as any)?.summary || '';
    if (raw.length > 100) return raw; // Probably already enhanced
    
    // Generate a professional summary if weak
    const title = profile.professionCategory || (profile.personalInfo as any).title || 'Technical Professional';
    const topSkills = profile.skills?.slice(0, 4).join(', ') || 'modern technologies';
    return `${title} with expertise in ${topSkills}. Skilled in developing intelligent solutions, scalable architectures, and automated workflows. Proven ability to transform complex requirements into robust technical deliverables.`;
  }

  static categorizeSkills(skills: any[]): CategorizedSkills[] {
    if (!skills || skills.length === 0) return [];
    
    const categories: Record<string, string[]> = {
      'Languages & Core': [],
      'Backend & Databases': [],
      'Data & Analytics': [],
      'Cloud & DevOps': [],
      'Tools & Platforms': [],
      'Other Technologies': []
    };

    const dict: Record<string, string[]> = {
      'Languages & Core': ['javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'c', 'html', 'css', 'react', 'next.js', 'vue', 'angular', 'node.js', 'express', 'machine learning', 'regression', 'classification', 'ai', 'pipeline', 'web dev', 'automation', 'structured data'],
      'Backend & Databases': ['sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'cassandra', 'dynamodb', 'elasticsearch', 'supabase', 'backend'],
      'Data & Analytics': ['power bi', 'pandas', 'numpy', 'kpi design', 'business intelligence', 'tableau', 'excel', 'data visualization', 'matplotlib', 'seaborn', 'forecasting', 'analytics'],
      'Cloud & DevOps': ['aws', 'gcp', 'azure', 'docker', 'kubernetes', 'terraform', 'ci/cd', 'linux', 'github actions', 'vercel', 'cloud', 'devops'],
      'Tools & Platforms': ['git', 'github', 'jira', 'figma', 'postman', 'webpack', 'vite', 'npm']
    };

    skills.forEach(skill => {
      const name = typeof skill === 'string' ? skill : skill?.name;
      if (!name) return;
      const sName = name.toLowerCase();
      let matched = false;
      for (const [catName, keywords] of Object.entries(dict)) {
        if (keywords.some(k => sName.includes(k))) {
          if (!categories[catName].includes(name)) categories[catName].push(name);
          matched = true;
          break;
        }
      }
      if (!matched) {
        if (!categories['Other Technologies'].includes(name)) categories['Other Technologies'].push(name);
      }
    });

    return Object.entries(categories)
      .filter(([_, items]) => items.length > 0)
      .map(([category, items]) => ({ category, items }));
  }

  static enhanceExperience(experienceList: Experience[]): EnhancedExperience[] {
    if (!experienceList) return [];
    
    return experienceList
      .filter(exp => exp.position || exp.company || exp.description) 
      .map(exp => {
        const position = exp.position || (exp as any).title || '';
        const company = exp.company || '';

        // Handle OpenRouter output mapping
        let rawAchievements = exp.achievements || (exp as any).highlights || [];
        if (!Array.isArray(rawAchievements)) rawAchievements = [];
        
        // Extract Tech
        let rawTech = (exp as any).technologies || '';
        if (Array.isArray(rawTech)) rawTech = rawTech.join(', ');
        
        let techText = String(rawTech);
        if (!techText.trim()) {
          const allText = `${exp.description || ''} ${rawAchievements.join(' ')}`;
          techText = extractTech(allText).join(', ');
        }
        const techArray = techText.split(',').map((t: string) => t.trim()).filter(Boolean);

        // Ensure 3-5 bullets
        let finalBullets = rawAchievements.map((a: string) => upgradeVerbs(cleanRedundancy(a)));
        
        // Filter out bad generic bullets
        const badPatterns = [/Engineered core functionality/i, /Ensured quality deliverables/i, /Worked on project/i];
        finalBullets = finalBullets.filter((b: string) => !badPatterns.some(p => p.test(b)));

        if (finalBullets.length < 3) {
           const generated = splitIntoBullets(exp.description || '', position, techArray, 3 - finalBullets.length);
           finalBullets = [...finalBullets, ...generated];
        }
        if (finalBullets.length === 0) finalBullets = splitIntoBullets('', position, techArray, 3); // Failsafe fallback
        
        finalBullets = finalBullets.slice(0, 5);

        return {
          ...exp,
          position,
          company,
          enhancedAchievements: finalBullets,
          extractedTechnologies: techText
        };
      });
  }

  static enhanceProjects(projectList: Project[]): EnhancedProject[] {
    if (!projectList) return [];

    return projectList
      .filter(proj => proj.name || proj.description || (proj.technologies && proj.technologies.length > 0) || proj.githubUrl || proj.liveUrl) 
      .map(proj => {
        const name = proj.name || (proj as any).title || '';

        // Tech Stack
        let rawTech: any = proj.technologies;
        let techArray: string[] = [];
        if (Array.isArray(rawTech)) techArray = rawTech;
        else if (typeof rawTech === 'string') techArray = rawTech.split(',').map(t => t.trim()).filter(Boolean);
        
        if (!techArray || techArray.length === 0) {
          techArray = extractTech(`${proj.description || ''} ${(proj as any).impact || ''}`);
        }
        
        // Overview
        let overview = proj.description || '';
        if (overview.length < 10 && name) overview = `Developed and maintained ${name}, ensuring optimal performance and functionality.`;
        overview = upgradeVerbs(cleanRedundancy(overview));

        // Achievements
        let rawAchievements = (proj as any).achievements || (proj as any).highlights || [];
        if (!Array.isArray(rawAchievements)) rawAchievements = [];
        
        let finalBullets = rawAchievements.map((a: string) => upgradeVerbs(cleanRedundancy(a)));
        
        // Filter out bad generic bullets
        const badPatterns = [/Engineered core functionality/i, /Ensured quality deliverables/i, /Worked on project/i];
        finalBullets = finalBullets.filter((b: string) => !badPatterns.some(p => p.test(b)));

        if (finalBullets.length < 3) {
           const generated = splitIntoBullets(proj.impact || '', name, techArray, 3 - finalBullets.length);
           finalBullets = [...finalBullets, ...generated];
        }
        if (finalBullets.length === 0) finalBullets = splitIntoBullets('', name, techArray, 3);
        finalBullets = finalBullets.slice(0, 5);

        // Links
        const links: { label: string; url: string; isGit?: boolean }[] = [];
        if (proj.githubUrl) links.push({ label: 'Code', url: proj.githubUrl, isGit: true });
        if (proj.liveUrl) links.push({ label: 'Demo', url: proj.liveUrl });
        if ((proj as any).link && !proj.githubUrl && !proj.liveUrl) links.push({ label: 'Link', url: (proj as any).link });

        return {
          ...proj,
          name,
          enhancedOverview: overview,
          enhancedAchievements: finalBullets,
          extractedTechnologies: techArray,
          enhancedLinks: links
        };
      });
  }

  static enhanceProfile(profile: CareerProfile): EnhancedProfile {
    return {
      ...profile,
      enhancedSummary: this.enhanceSummary(profile),
      categorizedSkills: this.categorizeSkills(profile.skills || []),
      enhancedExperience: this.enhanceExperience(profile.experience || []),
      enhancedProjects: this.enhanceProjects(profile.projects || [])
    };
  }
}
