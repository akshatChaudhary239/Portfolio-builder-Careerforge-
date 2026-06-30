/**
 * Maps project titles to specific checklist suggestions by profession.
 */

export interface ProjectTemplate {
  keywords: string[];
  suggestions: string[];
}

export const PROFESSION_PROJECT_TEMPLATES: Record<string, ProjectTemplate[]> = {
  developer: [
    {
      keywords: ["e-commerce", "ecommerce", "store", "shop"],
      suggestions: [
        "Authentication",
        "Payment Gateway",
        "Cart System",
        "Order Management",
        "Product Management",
        "Admin Dashboard",
        "Inventory Tracking"
      ]
    },
    {
      keywords: ["portfolio", "personal website", "blog"],
      suggestions: [
        "Responsive Design",
        "SEO Optimization",
        "Performance Optimization",
        "Contact Form",
        "Deployment",
        "Markdown Support",
        "Dark Mode"
      ]
    },
    {
      keywords: ["social", "chat", "messaging", "community"],
      suggestions: [
        "Real-time WebSockets",
        "User Profiles",
        "Follower System",
        "Media Uploads",
        "Push Notifications"
      ]
    }
  ],
  designer: [
    {
      keywords: ["redesign", "mobile app", "website design"],
      suggestions: [
        "User Research",
        "Wireframes",
        "Design System",
        "Prototype",
        "Usability Testing",
        "Handoff Documentation"
      ]
    },
    {
      keywords: ["branding", "identity", "logo"],
      suggestions: [
        "Color Palette",
        "Typography System",
        "Logo Variations",
        "Brand Guidelines",
        "Marketing Assets"
      ]
    }
  ],
  data: [
    {
      keywords: ["dashboard", "sales", "tracker"],
      suggestions: [
        "Data Cleaning",
        "KPI Tracking",
        "Interactive Filters",
        "Data Visualization",
        "Insights Generation"
      ]
    },
    {
      keywords: ["prediction", "model", "analysis"],
      suggestions: [
        "Feature Engineering",
        "Model Training",
        "Hyperparameter Tuning",
        "Performance Metrics",
        "Deployment/API"
      ]
    }
  ],
  marketing: [
    {
      keywords: ["campaign", "lead generation", "ads"],
      suggestions: [
        "Audience Research",
        "Ad Creatives",
        "A/B Testing",
        "Conversion Tracking",
        "Performance Reporting"
      ]
    },
    {
      keywords: ["seo", "content", "blog"],
      suggestions: [
        "Keyword Research",
        "Content Strategy",
        "On-page Optimization",
        "Link Building",
        "Traffic Analysis"
      ]
    }
  ],
  mba: [
    {
      keywords: ["strategy", "market entry", "business plan"],
      suggestions: [
        "Competitive Analysis",
        "Financial Projections",
        "Go-To-Market Strategy",
        "Risk Assessment",
        "Executive Summary"
      ]
    },
    {
      keywords: ["operations", "process", "optimization"],
      suggestions: [
        "Process Mapping",
        "Bottleneck Identification",
        "Cost Reduction Analysis",
        "Change Management Plan"
      ]
    }
  ],
  finance: [
    {
      keywords: ["budget", "model", "forecast"],
      suggestions: [
        "Forecasting",
        "Cost Analysis",
        "Scenario Planning",
        "Sensitivity Analysis",
        "Variance Reporting"
      ]
    },
    {
      keywords: ["valuation", "m&a", "investment"],
      suggestions: [
        "DCF Modeling",
        "Comparable Company Analysis",
        "Precedent Transactions",
        "Due Diligence"
      ]
    }
  ],
  law: [
    {
      keywords: ["contract", "compliance", "policy"],
      suggestions: [
        "Compliance Tracking",
        "Document Review",
        "Legal Research",
        "Risk Mitigation",
        "Drafting/Negotiation"
      ]
    },
    {
      keywords: ["litigation", "case", "dispute"],
      suggestions: [
        "Fact Investigation",
        "Brief Drafting",
        "Evidence Gathering",
        "Settlement Negotiation"
      ]
    }
  ],
  hr: [
    {
      keywords: ["engagement", "culture", "initiative"],
      suggestions: [
        "Employee Surveys",
        "Participation Metrics",
        "Feedback Analysis",
        "Action Planning"
      ]
    },
    {
      keywords: ["recruitment", "hiring", "onboarding"],
      suggestions: [
        "Candidate Sourcing",
        "Interview Structure",
        "Offer Negotiation",
        "Orientation Program"
      ]
    }
  ],
  general: [
    {
      keywords: ["project", "initiative", "task force"],
      suggestions: [
        "Project Planning",
        "Stakeholder Alignment",
        "Execution Tracking",
        "Final Reporting"
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
 * Returns tailored project suggestions based on profession and project title.
 * Falls back to generic if no match.
 */
export function getSuggestionsForProject(professionCategory: string, projectTitle: string): string[] {
  const normalizedTitle = projectTitle.toLowerCase().trim();
  const profKey = normalizeProfession(professionCategory);
  
  const templates = PROFESSION_PROJECT_TEMPLATES[profKey] || PROFESSION_PROJECT_TEMPLATES['general'];
  
  for (const template of templates) {
    if (template.keywords.some(kw => normalizedTitle.includes(kw))) {
      return template.suggestions;
    }
  }

  // Generic fallback if no specific match within the profession
  return [
    "Project Planning",
    "Execution Strategy",
    "Stakeholder Updates",
    "Performance Tracking",
    "Final Delivery"
  ];
}
