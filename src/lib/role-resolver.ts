export interface RoleResolution {
  status: 'known' | 'ambiguous' | 'unknown' | 'invalid';
  confidence: number;
  matchedRole: string;
  category: string;
  suggestedRoles: string[];
  reason: string;
}

export interface CategoryOption {
  id: string;
  label: string;
  icon: string;
}

export const font_categories: CategoryOption[] = [
  { id: 'developer', label: 'Software Development', icon: 'Code' },
  { id: 'designer', label: 'UI/UX & Product Design', icon: 'Palette' },
  { id: 'data', label: 'Data Analytics & AI', icon: 'BarChart3' },
  { id: 'marketing', label: 'Growth & Marketing', icon: 'Megaphone' },
  { id: 'finance', label: 'Finance & Accounting', icon: 'DollarSign' },
  { id: 'law', label: 'Legal & Compliance', icon: 'Scale' },
  { id: 'hr', label: 'HR & Recruitment', icon: 'Users' },
  { id: 'mba', label: 'Product & Business Management', icon: 'Briefcase' },
  { id: 'general', label: 'Operations & General Workflows', icon: 'Settings' }
];

export const ROLE_CATALOG: Record<string, string[]> = {
  developer: [
    "Software Engineer", "Frontend Developer", "Backend Developer", "Fullstack Engineer",
    "DevOps Engineer", "Mobile App Developer", "QA Automation Engineer", "Cloud Architect",
    "Security Engineer", "Site Reliability Engineer (SRE)"
  ],
  designer: [
    "UI/UX Designer", "Product Designer", "Graphic Designer", "Interaction Designer",
    "Visual Designer", "Motion Designer", "Design Systems Lead", "UX Researcher"
  ],
  data: [
    "Data Analyst", "Data Scientist", "Business Intelligence (BI) Developer",
    "Data Engineer", "Machine Learning Engineer", "Analytics Manager"
  ],
  marketing: [
    "Growth Marketer", "SEO Specialist", "Digital Ads Manager", "Content Marketing Manager",
    "Social Media Manager", "Email Marketing Specialist", "Performance Marketer"
  ],
  finance: [
    "Financial Analyst", "Corporate Accountant", "Auditor", "Tax Consultant",
    "Investment Banker", "Treasury Analyst", "Financial Controller"
  ],
  law: [
    "Legal Counsel", "Corporate Attorney", "Compliance Manager", "Paralegal",
    "Legal Operations Associate", "Contract Administrator"
  ],
  hr: [
    "Talent Acquisition Specialist", "HR Generalist", "Technical Recruiter",
    "HR Business Partner (HRBP)", "People Operations Manager", "Compensation & Benefits Analyst"
  ],
  mba: [
    "Product Manager", "Product Owner", "Technical Product Manager", "Business Analyst",
    "Project Manager", "Operations Manager", "Founder / CEO", "Management Consultant", "Scrum Master"
  ],
  general: [
    "Operations Coordinator", "Project Specialist", "Executive Assistant",
    "Customer Success Manager", "Business Associate"
  ]
};

export const PROJECT_CATALOG: Record<string, string[]> = {
  developer: [
    "SaaS Web Application", "Mobile Banking App", "E-Commerce Platform",
    "Real-time Analytics Dashboard", "REST API Microservice Suite", "Open-Source Developer Tool"
  ],
  designer: [
    "Mobile App UX Case Study", "Web Redesign Project", "Brand Visual Identity System",
    "Figma Design System Component Kit", "Interactive Prototype Suite"
  ],
  data: [
    "Customer Churn Prediction Model", "Power BI Executive Dashboard",
    "Automated SQL Data Pipeline", "Exploratory Data Analysis (EDA) File"
  ],
  marketing: [
    "Google PPC Search Campaign", "Meta Social Ads Launch Drive",
    "Organic SEO Audit & Content Campaign", "Email Lead Automation Drip"
  ],
  finance: [
    "Corporate Valuation & DCF Model", "Operating Budget Variance Model",
    "Financial KPI Reporting Dashboard", "Tax Compliance Audit File"
  ],
  law: [
    "Commercial Contract Template Suite", "Data Privacy Compliance Audit",
    "Litigation Brief & Precedent Binder", "M&A Due Diligence Review"
  ],
  hr: [
    "Technical Sourcing Recruitment Drive", "Automated Employee Onboarding Workflow",
    "Employee Retention & Pulse Survey", "Workforce Policy Documentation Suite"
  ],
  mba: [
    "Product Launch GTM Strategy Blueprint", "Market Expansion Feasibility Study",
    "Operations Optimization Workflow", "Product Requirements Document (PRD)"
  ],
  general: [
    "Standard Operating Procedure (SOP) Suite", "Project Milestone Tracking Dashboard",
    "Client Support Knowledge Base File"
  ]
};

const INVALID_INPUT_LIST = [
  "akku", "abc", "xyz", "hello", "testing", "my job", "internship",
  "random", "company name", "123", "test", "job", "work", "stuff",
  "none", "asdf", "qwer", "1234", "dummy"
];

/**
 * Resolves raw job titles strictly. Returns confidence score and status.
 * FORBIDDEN from silently guessing or mapping unknown strings to default pools.
 */
export function resolveRoleTitle(rawTitle: string, professionCategory: string): RoleResolution {
  const title = (rawTitle || '').trim();
  const lower = title.toLowerCase();

  // 1. Invalid or Random String Gate
  if (!title || title.length < 3 || INVALID_INPUT_LIST.includes(lower)) {
    return {
      status: 'invalid',
      confidence: 0,
      matchedRole: '',
      category: professionCategory,
      suggestedRoles: getSuggestedRolesForCategory(professionCategory),
      reason: `We couldn't identify "${rawTitle || 'this title'}". Please select or search for your exact role below:`
    };
  }

  // 2. Exact match in catalog
  for (const [cat, roles] of Object.entries(ROLE_CATALOG)) {
    for (const role of roles) {
      if (role.toLowerCase() === lower) {
        return {
          status: 'known',
          confidence: 100,
          matchedRole: role,
          category: cat,
          suggestedRoles: [],
          reason: 'Exact role matched.'
        };
      }
    }
  }

  // 3. Partial / Substring match in catalog
  for (const [cat, roles] of Object.entries(ROLE_CATALOG)) {
    const matched = roles.find(r => r.toLowerCase().includes(lower) || lower.includes(r.toLowerCase()));
    if (matched) {
      return {
        status: 'known',
        confidence: 85,
        matchedRole: matched,
        category: cat,
        suggestedRoles: [],
        reason: 'Role confidently identified.'
      };
    }
  }

  // 4. Broad / Ambiguous keywords
  const ambiguousKeywords = ["manager", "engineer", "analyst", "lead", "consultant", "developer", "designer", "specialist", "director", "head"];
  if (ambiguousKeywords.some(kw => lower === kw || lower.startsWith(kw))) {
    return {
      status: 'ambiguous',
      confidence: 50,
      matchedRole: title,
      category: professionCategory,
      suggestedRoles: getSuggestedRolesForCategory(professionCategory),
      reason: `The title "${title}" is broad. Please select your exact specialization:`
    };
  }

  // 5. Completely Unknown Role
  return {
    status: 'unknown',
    confidence: 10,
    matchedRole: title,
    category: professionCategory,
    suggestedRoles: getSuggestedRolesForCategory(professionCategory),
    reason: `We couldn't understand "${title}" yet. Help us understand what kind of work this role involved:`
  };
}

/**
 * Resolves project titles strictly.
 */
export function resolveProjectTypeTitle(rawTitle: string, professionCategory: string): RoleResolution {
  const title = (rawTitle || '').trim();
  const lower = title.toLowerCase();

  if (!title || title.length < 3 || INVALID_INPUT_LIST.includes(lower)) {
    return {
      status: 'invalid',
      confidence: 0,
      matchedRole: '',
      category: professionCategory,
      suggestedRoles: getSuggestedProjectsForCategory(professionCategory),
      reason: `We couldn't identify the project scope for "${rawTitle || 'this project'}". Please select your project type below:`
    };
  }

  for (const [cat, projects] of Object.entries(PROJECT_CATALOG)) {
    for (const proj of projects) {
      if (proj.toLowerCase() === lower || proj.toLowerCase().includes(lower) || lower.includes(proj.toLowerCase())) {
        return {
          status: 'known',
          confidence: 90,
          matchedRole: proj,
          category: cat,
          suggestedRoles: [],
          reason: 'Project type identified.'
        };
      }
    }
  }

  const genericKeywords = ["app", "website", "project", "task", "assignment", "system", "module", "campaign", "model"];
  if (genericKeywords.some(kw => lower === kw)) {
    return {
      status: 'ambiguous',
      confidence: 45,
      matchedRole: title,
      category: professionCategory,
      suggestedRoles: getSuggestedProjectsForCategory(professionCategory),
      reason: `The project title "${title}" is broad. Please select your exact project scope:`
    };
  }

  return {
    status: 'unknown',
    confidence: 15,
    matchedRole: title,
    category: professionCategory,
    suggestedRoles: getSuggestedProjectsForCategory(professionCategory),
    reason: `Help us understand what kind of project "${title}" was:`
  };
}

export function getSuggestedRolesForCategory(categoryStr: string): string[] {
  const key = (categoryStr || '').toLowerCase();
  if (key.includes('dev') || key.includes('software')) return ROLE_CATALOG['developer'];
  if (key.includes('design')) return ROLE_CATALOG['designer'];
  if (key.includes('data')) return ROLE_CATALOG['data'];
  if (key.includes('marketing')) return ROLE_CATALOG['marketing'];
  if (key.includes('finance')) return ROLE_CATALOG['finance'];
  if (key.includes('law')) return ROLE_CATALOG['law'];
  if (key.includes('hr')) return ROLE_CATALOG['hr'];
  if (key.includes('mba') || key.includes('business')) return ROLE_CATALOG['mba'];
  return ROLE_CATALOG['general'];
}

export function getSuggestedProjectsForCategory(categoryStr: string): string[] {
  const key = (categoryStr || '').toLowerCase();
  if (key.includes('dev') || key.includes('software')) return PROJECT_CATALOG['developer'];
  if (key.includes('design')) return PROJECT_CATALOG['designer'];
  if (key.includes('data')) return PROJECT_CATALOG['data'];
  if (key.includes('marketing')) return PROJECT_CATALOG['marketing'];
  if (key.includes('finance')) return PROJECT_CATALOG['finance'];
  if (key.includes('law')) return PROJECT_CATALOG['law'];
  if (key.includes('hr')) return PROJECT_CATALOG['hr'];
  if (key.includes('mba') || key.includes('business')) return PROJECT_CATALOG['mba'];
  return PROJECT_CATALOG['general'];
}

export function searchAllRoles(query: string): string[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  const results = new Set<string>();
  Object.values(ROLE_CATALOG).flat().forEach(role => {
    if (role.toLowerCase().includes(q)) results.add(role);
  });
  return Array.from(results).slice(0, 8);
}
