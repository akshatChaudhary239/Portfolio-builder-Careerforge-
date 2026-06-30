/**
 * Skill clusters define broader technical domains keyed by profession.
 */
export const PROFESSION_SKILL_CLUSTERS: Record<string, string[][]> = {
  developer: [
    ["HTML", "CSS", "JavaScript", "React", "Next.js", "TypeScript", "Tailwind CSS", "Bootstrap", "Responsive Design", "Git"],
    ["JavaScript", "Node.js", "Express.js", "MongoDB", "REST APIs", "TypeScript", "GraphQL"],
    ["Python", "Pandas", "NumPy", "Machine Learning", "Data Visualization", "Django", "FastAPI"],
    ["AWS", "Docker", "Kubernetes", "Linux", "CI/CD", "GitHub Actions", "Terraform", "Serverless"],
    ["SQL", "PostgreSQL", "MySQL", "Database Design", "MongoDB", "Redis", "Prisma"],
    ["Java", "Spring Boot", "Microservices", "Hibernate", "Kafka"],
    ["C#", ".NET", "ASP.NET", "Entity Framework", "Azure"]
  ],
  designer: [
    ["Figma", "Wireframing", "Prototyping", "Design Systems", "User Research", "Interaction Design", "Adobe XD"],
    ["Photoshop", "Illustrator", "Branding", "Visual Design", "Typography", "Color Theory"],
    ["HTML", "CSS", "Tailwind CSS", "Web Design"]
  ],
  data: [ // Data Analyst / Data Scientist
    ["Excel", "SQL", "Power BI", "Tableau", "Data Cleaning", "Data Visualization"],
    ["Python", "Pandas", "NumPy", "Matplotlib", "Machine Learning", "Scikit-Learn"],
    ["R", "Statistical Analysis", "Predictive Modeling", "A/B Testing"]
  ],
  marketing: [
    ["SEO", "Google Analytics", "Search Console", "Keyword Research", "Content Marketing", "SEM", "Link Building"],
    ["Social Media Marketing", "Meta Ads", "Campaign Analysis", "Content Strategy", "Copywriting"],
    ["Email Marketing", "Mailchimp", "HubSpot", "Marketing Automation", "CRM"]
  ],
  mba: [ // MBA / Business
    ["Business Strategy", "Market Research", "Stakeholder Management", "Business Analysis", "Financial Modeling"],
    ["Operations Management", "Process Optimization", "Team Leadership", "Supply Chain"],
    ["Project Management", "Agile", "Scrum", "Risk Management"]
  ],
  finance: [
    ["Financial Analysis", "Valuation", "Budgeting", "Forecasting", "Financial Modeling"],
    ["Excel", "Power BI", "SQL", "Data Analysis"],
    ["Risk Management", "Corporate Finance", "Accounting", "M&A"]
  ],
  law: [
    ["Legal Research", "Contract Drafting", "Compliance", "Case Analysis", "Negotiation"],
    ["Corporate Law", "Regulatory Compliance", "Risk Assessment", "Intellectual Property"],
    ["Litigation", "Legal Writing", "Dispute Resolution"]
  ],
  hr: [
    ["Recruitment", "Talent Acquisition", "Interviewing", "Candidate Screening", "ATS Management"],
    ["Employee Relations", "Performance Management", "HR Operations", "Conflict Resolution"],
    ["Onboarding", "Training & Development", "Compensation & Benefits", "Payroll"]
  ],
  general: [
    ["Communication", "Leadership", "Problem Solving", "Team Collaboration", "Time Management"],
    ["Project Management", "Stakeholder Management", "Planning", "Presentations"]
  ]
};

function normalizeProfession(prof: string): string {
  const p = (prof || '').toLowerCase();
  if (p.includes('design')) return 'designer';
  if (p.includes('data')) return 'data';
  if (p.includes('marketing')) return 'marketing';
  if (p.includes('mba') || p.includes('business')) return 'mba';
  if (p.includes('finance')) return 'finance';
  if (p.includes('law')) return 'law';
  if (p.includes('hr') || p.includes('human')) return 'hr';
  if (p.includes('dev') || p.includes('software')) return 'developer';
  return 'general';
}

/**
 * Returns a list of related skills by matching against profession-specific clusters.
 */
export function getRelatedSkills(professionCategory: string, skill: string): string[] {
  const normalizedSkill = skill.toLowerCase().trim();
  const profKey = normalizeProfession(professionCategory);
  
  const related = new Set<string>();
  const clusters = PROFESSION_SKILL_CLUSTERS[profKey] || PROFESSION_SKILL_CLUSTERS['general'];

  clusters.forEach(cluster => {
    // If the entered skill is in this cluster (loose match)
    if (cluster.some(item => item.toLowerCase().trim() === normalizedSkill || item.toLowerCase().includes(normalizedSkill))) {
      cluster.forEach(item => {
        if (item.toLowerCase().trim() !== normalizedSkill) {
          related.add(item);
        }
      });
    }
  });

  return Array.from(related);
}

export const CERTIFICATION_MAPPINGS: Record<string, string[]> = {
  "react": ["Meta Front-End Developer", "Advanced React Certification"],
  "node.js": ["OpenJS Node.js Application Developer", "Full Stack JavaScript Certification"],
  "javascript": ["JavaScript Certification", "Full Stack JavaScript Certification"],
  "python": ["PCEP - Certified Entry-Level Python Programmer", "PCAP - Certified Associate in Python Programming"],
  "aws": ["AWS Certified Solutions Architect", "AWS Certified Developer", "AWS Certified Cloud Practitioner"],
  "docker": ["Docker Certified Associate (DCA)"],
  "kubernetes": ["Certified Kubernetes Administrator (CKA)", "Certified Kubernetes Application Developer (CKAD)"],
  "sql": ["Oracle Database SQL Certified Associate", "Microsoft Certified: Azure Data Fundamentals"],
  "seo": ["Google Analytics Certification", "HubSpot SEO Certification"],
  "machine learning": ["AWS Certified Machine Learning", "Google Cloud Professional Machine Learning Engineer"],
  "ui/ux design": ["Google UX Design Professional Certificate", "Nielsen Norman Group UX Certification"]
};

/**
 * Recommends certifications strictly based on the user's current skills mapping.
 */
export function getCertificationsForSkills(skills: string[]): string[] {
  const certs = new Set<string>();
  skills.forEach(skill => {
    const normalized = skill.toLowerCase().trim();
    if (CERTIFICATION_MAPPINGS[normalized]) {
      CERTIFICATION_MAPPINGS[normalized].forEach(c => certs.add(c));
    }
  });
  return Array.from(certs);
}

/**
 * Recommends achievement templates based on skills.
 */
export function getAchievementsForSkills(skills: string[]): string[] {
  const achievements = new Set<string>();
  
  const skillSet = new Set(skills.map(s => s.toLowerCase().trim()));
  
  if (skillSet.has('react') || skillSet.has('next.js')) {
    achievements.add("Improved frontend performance metrics by 30% through code splitting and lazy loading in React/Next.js.");
  }
  if (skillSet.has('node.js') || skillSet.has('express')) {
    achievements.add("Optimized backend API endpoints, reducing average response time by 40%.");
  }
  if (skillSet.has('sql') || skillSet.has('postgresql')) {
    achievements.add("Redesigned complex database queries, resulting in a 50% decrease in query execution time.");
  }
  if (skillSet.has('aws') || skillSet.has('docker')) {
    achievements.add("Streamlined CI/CD deployment pipelines, reducing deployment times by 60%.");
  }
  if (skillSet.has('seo')) {
    achievements.add("Increased organic search traffic by 150% over six months through targeted SEO strategies.");
  }
  if (skillSet.has('ui/ux design') || skillSet.has('figma')) {
    achievements.add("Led the complete redesign of the core user flow, increasing conversion rates by 25%.");
  }
  
  return Array.from(achievements);
}
