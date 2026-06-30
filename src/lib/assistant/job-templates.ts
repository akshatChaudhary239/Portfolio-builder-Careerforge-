/**
 * Maps job titles to specific responsibility templates by profession.
 */

export interface JobTemplate {
  keywords: string[];
  responsibilities: string[];
}

export const PROFESSION_JOB_TEMPLATES: Record<string, JobTemplate[]> = {
  developer: [
    {
      keywords: ["frontend", "front end", "react", "ui", "web developer"],
      responsibilities: [
        "Developed responsive user interfaces",
        "Optimized application performance",
        "Collaborated with backend teams",
        "Built reusable UI components",
        "Integrated REST APIs",
        "Implemented state management",
        "Ensured cross-browser compatibility"
      ]
    },
    {
      keywords: ["backend", "back end", "node", "api", "server"],
      responsibilities: [
        "Designed and developed scalable backend architectures",
        "Implemented secure RESTful and GraphQL APIs",
        "Optimized database schemas and queries",
        "Integrated third-party services and webhooks",
        "Ensured data security and compliance",
        "Set up CI/CD deployment pipelines"
      ]
    },
    {
      keywords: ["fullstack", "full stack", "mern", "software engineer"],
      responsibilities: [
        "Built end-to-end web applications from scratch",
        "Designed robust database schemas",
        "Created seamless API integrations",
        "Developed interactive frontend components",
        "Managed deployment and server infrastructure"
      ]
    }
  ],
  designer: [
    {
      keywords: ["ux", "user experience", "research"],
      responsibilities: [
        "Conducted extensive user research and interviews",
        "Created user personas and journey maps",
        "Performed usability testing sessions",
        "Analyzed user feedback to improve product flows"
      ]
    },
    {
      keywords: ["ui", "user interface", "visual", "product designer"],
      responsibilities: [
        "Created high-fidelity wireframes and prototypes",
        "Developed comprehensive design systems",
        "Collaborated with engineering for design handoff",
        "Designed cohesive visual branding elements"
      ]
    }
  ],
  data: [
    {
      keywords: ["data analyst", "bi analyst", "business intelligence"],
      responsibilities: [
        "Analyzed large datasets to identify trends",
        "Created interactive business dashboards",
        "Built automated reporting pipelines",
        "Generated actionable business insights"
      ]
    },
    {
      keywords: ["data scientist", "machine learning"],
      responsibilities: [
        "Developed predictive machine learning models",
        "Performed comprehensive data cleaning",
        "Conducted statistical analysis on A/B tests",
        "Deployed ML models to production"
      ]
    }
  ],
  marketing: [
    {
      keywords: ["seo", "organic", "content"],
      responsibilities: [
        "Optimized website SEO to increase organic traffic",
        "Conducted extensive keyword research",
        "Managed content calendar and blog strategy",
        "Analyzed traffic metrics and bounce rates"
      ]
    },
    {
      keywords: ["digital marketing", "growth", "performance", "ads"],
      responsibilities: [
        "Managed comprehensive ad campaigns across channels",
        "Conducted extensive market research",
        "Analyzed campaign performance metrics",
        "Created engaging marketing creatives",
        "Managed social media strategy"
      ]
    }
  ],
  mba: [
    {
      keywords: ["strategy", "consultant", "business analyst"],
      responsibilities: [
        "Developed comprehensive GTM strategies",
        "Conducted competitive market analysis",
        "Created complex financial models",
        "Presented findings to executive stakeholders"
      ]
    },
    {
      keywords: ["product manager", "project manager", "operations"],
      responsibilities: [
        "Managed product roadmap and backlog",
        "Led agile sprint planning and scrums",
        "Streamlined internal business operations",
        "Managed cross-functional team delivery"
      ]
    }
  ],
  finance: [
    {
      keywords: ["financial analyst", "fp&a", "finance"],
      responsibilities: [
        "Built complex financial models in Excel",
        "Conducted variance analysis on monthly budgets",
        "Prepared quarterly financial reports for executives",
        "Developed long-term financial forecasts"
      ]
    },
    {
      keywords: ["accountant", "audit", "compliance"],
      responsibilities: [
        "Ensured GAAP and regulatory compliance",
        "Managed accounts payable/receivable",
        "Conducted internal financial audits",
        "Prepared corporate tax filings"
      ]
    }
  ],
  law: [
    {
      keywords: ["attorney", "counsel", "associate", "lawyer"],
      responsibilities: [
        "Drafted and negotiated complex commercial contracts",
        "Conducted extensive legal research",
        "Advised stakeholders on regulatory compliance",
        "Managed intellectual property portfolios"
      ]
    },
    {
      keywords: ["paralegal", "legal assistant"],
      responsibilities: [
        "Prepared legal documents and briefs",
        "Maintained organized case files",
        "Coordinated with external legal counsel",
        "Conducted due diligence reviews"
      ]
    }
  ],
  hr: [
    {
      keywords: ["recruiter", "talent acquisition", "sourcing"],
      responsibilities: [
        "Managed end-to-end recruitment lifecycle",
        "Sourced passive candidates through LinkedIn",
        "Conducted initial screening interviews",
        "Negotiated candidate offers and compensation"
      ]
    },
    {
      keywords: ["hr generalist", "hr manager", "human resources"],
      responsibilities: [
        "Managed employee onboarding programs",
        "Administered payroll and benefits",
        "Resolved complex employee relations issues",
        "Developed company culture initiatives"
      ]
    }
  ],
  general: [
    {
      keywords: ["intern", "assistant", "coordinator"],
      responsibilities: [
        "Supported daily operational tasks",
        "Coordinated team schedules and meetings",
        "Drafted internal team communications",
        "Assisted with special project execution"
      ]
    }
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
 * Returns tailored responsibilities based on profession and job title.
 * Falls back to generic if no match.
 */
export function getResponsibilitiesForJob(professionCategory: string, jobTitle: string): string[] {
  const normalizedTitle = jobTitle.toLowerCase().trim();
  const profKey = normalizeProfession(professionCategory);
  
  const templates = PROFESSION_JOB_TEMPLATES[profKey] || PROFESSION_JOB_TEMPLATES['general'];
  
  for (const template of templates) {
    if (template.keywords.some(kw => normalizedTitle.includes(kw))) {
      return template.responsibilities;
    }
  }

  // Profession-specific fallback
  if (templates.length > 0) {
    return templates[0].responsibilities;
  }

  // Generic fallback if no specific match within the profession
  return [
    "Led project deliverables to completion",
    "Collaborated with cross-functional teams",
    "Improved operational efficiency",
    "Managed stakeholder communications",
    "Resolved complex technical issues"
  ];
}
