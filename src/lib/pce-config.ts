export interface PCEFollowUp {
  triggerOption: string;
  question: string;
  options: string[];
}

export interface PCEQuestionGroup {
  id: string;
  question: string;
  subtitle: string;
  options: string[];
  followUps?: PCEFollowUp[];
}

export interface PCEDiscoveryConfig {
  configId: string;
  title: string;
  keywords: string[];
  experienceGroups: PCEQuestionGroup[];
  projectGroups: PCEQuestionGroup[];
}

export interface CrossFunctionalRoleWeight {
  roleKeywords: string[];
  primaryContextWeight: number; // e.g. 0.7
  secondaryContextWeight: number; // e.g. 0.3
  secondaryRoleCategory: string; // e.g. 'mba', 'developer', 'general'
}

// --- CROSS FUNCTIONAL ROLES WEIGHTING REGISTRY ---
export const CROSS_FUNCTIONAL_ROLE_WEIGHTS: CrossFunctionalRoleWeight[] = [
  {
    roleKeywords: ["product manager", "product owner", "technical product manager", "tpm"],
    primaryContextWeight: 0.7,
    secondaryContextWeight: 0.3,
    secondaryRoleCategory: "mba" // Product Management / Strategy
  },
  {
    roleKeywords: ["project manager", "program manager", "delivery manager", "scrum master"],
    primaryContextWeight: 0.7,
    secondaryContextWeight: 0.3,
    secondaryRoleCategory: "general" // Agile & Operations
  },
  {
    roleKeywords: ["founder", "co-founder", "entrepreneur", "ceo"],
    primaryContextWeight: 0.7,
    secondaryContextWeight: 0.3,
    secondaryRoleCategory: "mba" // Business & Growth Strategy
  },
  {
    roleKeywords: ["business analyst", "systems analyst", "implementation consultant"],
    primaryContextWeight: 0.7,
    secondaryContextWeight: 0.3,
    secondaryRoleCategory: "data" // Data Analysis & Requirements
  },
  {
    roleKeywords: ["operations manager", "coo", "operations executive"],
    primaryContextWeight: 0.7,
    secondaryContextWeight: 0.3,
    secondaryRoleCategory: "general" // Operations & Workflows
  },
  {
    roleKeywords: ["technical lead", "tech lead", "engineering manager", "solutions architect"],
    primaryContextWeight: 0.7,
    secondaryContextWeight: 0.3,
    secondaryRoleCategory: "developer" // Architecture & Team Leadership
  }
];

// --- DEDICATED DISCOVERY POOLS FOR ALL 9 PROFESSIONS ---
export const DEDICATED_PROFESSION_POOLS: Record<string, PCEDiscoveryConfig> = {
  developer: {
    configId: "pool_developer",
    title: "Software Engineering & Development",
    keywords: ["developer", "dev", "software", "engineer", "frontend", "backend", "fullstack", "coder"],
    experienceGroups: [
      {
        id: "architecture",
        question: "What system architecture or core modules did you engineer?",
        subtitle: "Select technical architecture deliverables",
        options: [
          "RESTful API Suite", "Microservices Architecture", "Frontend Design System",
          "Database Schemas & Indexing", "Authentication & OAuth Gateways",
          "Real-time WebSockets Engine", "CI/CD Deployment Pipelines", "Cloud Server Infrastructure"
        ],
        followUps: [
          {
            triggerOption: "Authentication & OAuth Gateways",
            question: "Which authentication methods were integrated?",
            options: ["JWT Tokens", "OAuth 2.0", "Firebase Auth", "Clerk", "Auth0", "Supabase"]
          }
        ]
      },
      {
        id: "stack",
        question: "Which tools and frameworks powered your development?",
        subtitle: "Select core tools in your stack",
        options: ["React / Next.js", "TypeScript", "Node.js / Express", "Python / Django", "PostgreSQL / MongoDB", "Redis", "Docker", "Tailwind CSS", "AWS"]
      },
      {
        id: "responsibilities",
        question: "How did you manage code quality and operations?",
        subtitle: "Select daily engineering practices",
        options: ["Writing Unit & Integration Tests", "Code Reviews & Peer Mentoring", "Performance & Load Speed Tuning", "Bug Fixing & Refactoring", "Cross-browser Quality Assurance"]
      },
      {
        id: "impact",
        question: "What quantifiable engineering results did you deliver?",
        subtitle: "Select performance milestones",
        options: ["Cut API Response Latency by 50%", "Reduced Cloud Infrastructure Costs by 30%", "Achieved 99.99% Server Uptime", "Zero Critical Bugs Released"]
      }
    ],
    projectGroups: [
      {
        id: "project_scope",
        question: "What major software application or module did you build?",
        subtitle: "Select project architecture type",
        options: ["SaaS Web Platform", "E-Commerce System", "Real-time Analytics Portal", "REST API Service", "Mobile App Core", "Open-Source Library"]
      },
      {
        id: "project_stack",
        question: "Which technologies were integrated into this project?",
        subtitle: "Select development stack",
        options: ["React / Next.js", "TypeScript", "Node.js", "PostgreSQL / MongoDB", "Tailwind CSS", "Docker"]
      },
      {
        id: "project_outcomes",
        question: "What were the project results?",
        subtitle: "Select project achievements",
        options: ["Deployed to Production Server", "Processed 10k+ User Requests", "Achieved 95+ Lighthouse Score", "Published Repo on GitHub"]
      }
    ]
  },
  designer: {
    configId: "pool_designer",
    title: "UI/UX & Product Design",
    keywords: ["designer", "design", "ui", "ux", "product designer", "interaction", "visual"],
    experienceGroups: [
      {
        id: "design_assets",
        question: "What design systems or user experiences did you craft?",
        subtitle: "Select key design deliverables",
        options: [
          "Figma Design Systems", "Interactive Prototypes", "Wireframes & User Journey Maps",
          "Mobile Application UI", "Web Dashboard Layouts", "Usability Test Reports", "Brand Identity Kits"
        ],
        followUps: [
          {
            triggerOption: "Figma Design Systems",
            question: "What components were standardized in the design system?",
            options: ["Typography Tokens", "Color Palettes", "Button Variants", "Form Input Fields", "Modal Dialogs"]
          }
        ]
      },
      {
        id: "design_tools",
        question: "Which design and prototyping tools did you rely on?",
        subtitle: "Select software tools",
        options: ["Figma", "FigJam", "Adobe XD", "Sketch", "Photoshop", "Illustrator", "Framer", "Miro"]
      },
      {
        id: "design_process",
        question: "How did you facilitate the user experience cycle?",
        subtitle: "Select operational design duties",
        options: ["Conducting User Interviews", "Building Component Libraries", "Managing Developer Handoffs", "Usability Testing & Iteration", "Auditing Visual Accessibility (WCAG)"]
      },
      {
        id: "design_impact",
        question: "What design milestones were accomplished?",
        subtitle: "Select measurable impact",
        options: ["Increased Signup Conversions by 25%", "Cut Developer Handoff Time by 40%", "Standardized Visual Tokens", "Achieved High Usability Scores"]
      }
    ],
    projectGroups: [
      {
        id: "project_scope",
        question: "What design case study or asset package did you produce?",
        subtitle: "Select design project scope",
        options: ["Mobile App UX Case Study", "Web Redesign Project", "Brand Visual Identity System", "Dashboard UI Kit"]
      },
      {
        id: "project_tools",
        question: "Which tools were used for this project?",
        subtitle: "Select software",
        options: ["Figma", "Framer", "Photoshop", "Illustrator", "FigJam"]
      },
      {
        id: "project_outcomes",
        question: "What was the validation outcome?",
        subtitle: "Select achievements",
        options: ["Validated via User Testing", "Published Live Interactive Demo", "Adopted by Engineering Squads"]
      }
    ]
  },
  data: {
    configId: "pool_data",
    title: "Data Analysis & Science",
    keywords: ["data", "analyst", "analytics", "bi", "sql", "tableau", "python", "data scientist"],
    experienceGroups: [
      {
        id: "data_deliverables",
        question: "What data pipelines or intelligence dashboards did you build?",
        subtitle: "Select analytical deliverables",
        options: [
          "Power BI / Tableau Executive Dashboards", "Automated SQL ETL Data Pipelines",
          "Customer Churn Prediction Models", "Sales Funnel Analytics Audits",
          "Statistical A/B Test Evaluations", "Automated Weekly KPI Decks"
        ],
        followUps: [
          {
            triggerOption: "Automated SQL ETL Data Pipelines",
            question: "Which SQL databases or data warehouses were queried?",
            options: ["PostgreSQL", "Snowflake", "Google BigQuery", "Amazon Redshift", "MySQL"]
          }
        ]
      },
      {
        id: "data_stack",
        question: "Which data languages and tools powered your analysis?",
        subtitle: "Select analytical tech stack",
        options: ["SQL", "Python (Pandas / NumPy)", "Tableau", "Power BI", "R", "Excel (Advanced DAX)", "Scikit-Learn"]
      },
      {
        id: "data_duties",
        question: "What were your core data responsibilities?",
        subtitle: "Select analytical practices",
        options: ["Data Cleaning & Normalization", "Writing Complex Database Queries", "Building Interactive Metrics Dashboards", "Statistical Modeling & Forecasting", "Presenting Insights to Executives"]
      },
      {
        id: "data_impact",
        question: "What business findings or metrics did you drive?",
        subtitle: "Select analytical results",
        options: ["Saved 15+ Hours Weekly in Manual Reporting", "Hit 93% Churn Prediction Accuracy", "Identified 15% Operational Cost Reductions", "Optimized Marketing Funnel Conversions"]
      }
    ],
    projectGroups: [
      {
        id: "project_scope",
        question: "What dataset or predictive model did you analyze?",
        subtitle: "Select analytical project type",
        options: ["Exploratory Data Analysis (EDA)", "Machine Learning Prediction Model", "Business Intelligence Dashboard", "Customer Segmentation Analysis"]
      },
      {
        id: "project_tools",
        question: "Which tools were used for this analysis?",
        subtitle: "Select tools",
        options: ["Python (Pandas / Jupyter)", "SQL", "Tableau / Power BI", "Excel"]
      },
      {
        id: "project_outcomes",
        question: "What was the analytical outcome?",
        subtitle: "Select project findings",
        options: ["Discovered Key Business Insights", "Published Interactive Dashboard", "Achieved High Model Accuracy Score"]
      }
    ]
  },
  marketing: {
    configId: "pool_marketing",
    title: "Growth Marketing & Campaigns",
    keywords: ["marketing", "seo", "growth", "campaign", "google ads", "social media", "lead generator", "content"],
    experienceGroups: [
      {
        id: "mkt_channels",
        question: "What marketing channels or campaigns did you manage?",
        subtitle: "Select campaign initiatives",
        options: [
          "Google PPC Search Campaigns", "Meta (Facebook/IG) Paid Ads", "Organic SEO Keyword Optimization",
          "Outbound Cold Email Lead Generation", "Content Marketing & Editorial Strategy", "Social Media Channel Growth"
        ],
        followUps: [
          {
            triggerOption: "Organic SEO Keyword Optimization",
            question: "Which SEO areas did you focus on?",
            options: ["On-page Content SEO", "Technical SEO Audits", "Link Building & Backlinks", "Local SEO Optimization"]
          }
        ]
      },
      {
        id: "mkt_tools",
        question: "Which ad managers and analytics platforms were used?",
        subtitle: "Select marketing tools",
        options: ["Google Ads", "Meta Business Suite", "Google Analytics 4 (GA4)", "Ahrefs / Semrush", "Mailchimp / HubSpot", "Google Tag Manager"]
      },
      {
        id: "mkt_duties",
        question: "What were your primary growth duties?",
        subtitle: "Select marketing practices",
        options: ["Ad Copywriting & Creative Split Testing", "Keyword Sourcing & Mapping", "Lead Pipeline Sourcing & Qualification", "Campaign Budget Allocation", "Monitoring Conversion Funnels"]
      },
      {
        id: "mkt_impact",
        question: "What marketing records did you hit?",
        subtitle: "Select growth metrics",
        options: ["Achieved 4.2x Average ROAS", "Grew Organic Search Traffic by 130%", "Generated 250+ High-Value B2B Leads", "Lowered Customer Acquisition Cost (CAC) by 20%"]
      }
    ],
    projectGroups: [
      {
        id: "project_scope",
        question: "What growth project or campaign launch did you execute?",
        subtitle: "Select project type",
        options: ["PPC Search Ad Campaign", "Meta Social Ads Launch", "SEO Audit & Content Drive", "Email Automation Lead Funnel"]
      },
      {
        id: "project_tools",
        question: "Which platforms drove this campaign?",
        subtitle: "Select tools",
        options: ["Google Ads", "Meta Ads Manager", "Google Analytics 4", "Mailchimp"]
      },
      {
        id: "project_outcomes",
        question: "What were the campaign outcomes?",
        subtitle: "Select metrics hit",
        options: ["Exceeded ROAS Target Goals", "Generated 500+ Qualified Leads", "Ranked Target Keywords on Page 1"]
      }
    ]
  },
  finance: {
    configId: "pool_finance",
    title: "Corporate Finance & Accounting",
    keywords: ["finance", "financial", "accountant", "audit", "banking", "cpa", "cfa", "valuation"],
    experienceGroups: [
      {
        id: "fin_deliverables",
        question: "What financial models or compliance reports did you construct?",
        subtitle: "Select financial deliverables",
        options: [
          "3-Statement Corporate Models", "Discounted Cash Flow (DCF) Valuations", "Operating Budget Variance Reviews",
          "Power BI Executive Dashboards", "Long-term Revenue Forecasts", "Tax & Statutory Compliance Audits"
        ],
        followUps: [
          {
            triggerOption: "Long-term Revenue Forecasts",
            question: "Which financial forecasting areas did you model?",
            options: ["Revenue Streams", "Operating Expenses", "Capital Expenditures (CapEx)", "Cash Flow Statements"]
          }
        ]
      },
      {
        id: "fin_tools",
        question: "Which financial software and systems were used?",
        subtitle: "Select financial software",
        options: ["Advanced Excel (VBA / DAX)", "Power BI", "Tableau", "SAP ERP", "Bloomberg Terminal", "SQL"]
      },
      {
        id: "fin_duties",
        question: "What were your daily financial responsibilities?",
        subtitle: "Select financial practices",
        options: ["Financial Modeling & Cash Forecasting", "Variance Cost Auditing", "Verifying Audit Records (GAAP)", "Tracking Investment Portfolios", "Preparing Executive Decks"]
      },
      {
        id: "fin_impact",
        question: "What financial milestones did you achieve?",
        subtitle: "Select financial results",
        options: ["Hit 98.2% Forecast Accuracy", "Identified $120k in Systemic Cost Savings", "Automated Weekly Reporting Workflows", "Secured 100% GAAP Audit Compliance"]
      }
    ],
    projectGroups: [
      {
        id: "project_scope",
        question: "What financial evaluation model did you build?",
        subtitle: "Select model type",
        options: ["Corporate Valuation Model", "Budget Variance Spreadsheet", "Financial KPI Dashboard", "Tax Compliance Audit File"]
      },
      {
        id: "project_tools",
        question: "Which software built this model?",
        subtitle: "Select tools",
        options: ["Excel (Advanced)", "Power BI", "SAP", "SQL"]
      },
      {
        id: "project_outcomes",
        question: "What were the financial model outcomes?",
        subtitle: "Select results",
        options: ["Guided M&A Investment Decisions", "Highlighted Systemic Overhead Savings", "Verified Audit Compliance"]
      }
    ]
  },
  law: {
    configId: "pool_law",
    title: "Legal & Regulatory Compliance",
    keywords: ["law", "legal", "lawyer", "attorney", "counsel", "compliance", "paralegal"],
    experienceGroups: [
      {
        id: "law_deliverables",
        question: "What legal documentation or filings did you execute?",
        subtitle: "Select legal deliverables",
        options: [
          "Commercial Contract Drafting", "Regulatory Compliance Audits", "M&A Due Diligence Reviews",
          "Intellectual Property Filings", "Litigation Briefs & Research", "SLA Vendor Contract Negotiations"
        ],
        followUps: [
          {
            triggerOption: "Regulatory Compliance Audits",
            question: "Which regulatory frameworks did you verify?",
            options: ["GDPR / CCPA Data Privacy", "ISO Quality Standards", "Employment & Labor Laws", "Corporate Governance"]
          }
        ]
      },
      {
        id: "law_tools",
        question: "Which legal research databases and tools were used?",
        subtitle: "Select legal tech tools",
        options: ["Westlaw", "LexisNexis", "DocuSign", "Clio", "GDPR / CCPA Frameworks", "MS Office / Excel"]
      },
      {
        id: "law_duties",
        question: "What were your daily legal duties?",
        subtitle: "Select legal practices",
        options: ["Case Precedent Research", "Client Consultations", "Reviewing Contract Terms", "Risk Assessment Reports", "Filing Regulatory Documents"]
      },
      {
        id: "law_impact",
        question: "What legal records were accomplished?",
        subtitle: "Select legal results",
        options: ["Finalized 70+ Commercial Contracts", "Zero Non-Compliance Fines", "Resolved Complex Business Litigation", "Negotiated 25% Savings in SLA Overhead"]
      }
    ],
    projectGroups: [
      {
        id: "project_scope",
        question: "What legal initiative or research file did you compile?",
        subtitle: "Select project type",
        options: ["Commercial Contract Template Suite", "Data Privacy Compliance Audit", "Litigation Research Binder", "IP Filing Package"]
      },
      {
        id: "project_tools",
        question: "Which legal tools assisted this project?",
        subtitle: "Select tools",
        options: ["Westlaw", "LexisNexis", "DocuSign", "Excel"]
      },
      {
        id: "project_outcomes",
        question: "What were the legal outcomes?",
        subtitle: "Select achievements",
        options: ["Standardized Corporate Contract Risk", "Secured Regulatory Compliance", "Resolved Legal Dispute"]
      }
    ]
  },
  hr: {
    configId: "pool_hr",
    title: "Human Resources & Talent Acquisition",
    keywords: ["hr", "recruiter", "talent", "human resources", "onboarding", "people"],
    experienceGroups: [
      {
        id: "hr_deliverables",
        question: "What HR or recruitment programs did you manage?",
        subtitle: "Select people operation programs",
        options: [
          "End-to-End Technical Sourcing", "Automated Employee Onboarding", "Employee Retention & Recognition",
          "ATS Pipeline Workflow Setup", "Workforce Policy Manuals", "Employer Branding Events"
        ],
        followUps: [
          {
            triggerOption: "End-to-End Technical Sourcing",
            question: "Which sourcing channels or talent pools did you target?",
            options: ["Technical Software Engineering", "Executive Leadership", "High-Volume Customer Support", "Sales & Marketing"]
          }
        ]
      },
      {
        id: "hr_tools",
        question: "Which HRIS and candidate tracking software were used?",
        subtitle: "Select HR systems",
        options: ["Greenhouse ATS", "Lever", "Workday", "LinkedIn Recruiter", "BambooHR", "Typeform / CultureAmp"]
      },
      {
        id: "hr_duties",
        question: "What were your primary daily HR responsibilities?",
        subtitle: "Select operational HR tasks",
        options: ["Screening & Interviewing Candidates", "Onboarding Documentation", "Labor Law Compliance Monitoring", "Managing Employee Performance Reviews", "Payroll Coordination"]
      },
      {
        id: "hr_impact",
        question: "What talent acquisition records were hit?",
        subtitle: "Select HR metrics",
        options: ["Hired 45+ Technical Candidates", "Reduced Cost-per-Hire by 22%", "Cut Onboarding Ramp-up Time by 50%", "Lowered Annual Employee Turnover by 18%"]
      }
    ],
    projectGroups: [
      {
        id: "project_scope",
        question: "What HR initiative or recruitment drive did you lead?",
        subtitle: "Select project type",
        options: ["Technical Sourcing Campaign", "Onboarding Framework Redesign", "Employee Engagement Survey", "Workforce Training Module"]
      },
      {
        id: "project_tools",
        question: "Which HR systems were utilized?",
        subtitle: "Select tools",
        options: ["Greenhouse ATS", "LinkedIn Recruiter", "BambooHR", "CultureAmp"]
      },
      {
        id: "project_outcomes",
        question: "What were the HR project outcomes?",
        subtitle: "Select results",
        options: ["Expanded Candidate Pipeline Volumes", "Streamlined New Hire Ramp Times", "Elevated Employee Satisfaction"]
      }
    ]
  },
  mba: {
    configId: "pool_mba",
    title: "Business Strategy & Product Management",
    keywords: ["mba", "business", "product manager", "strategy", "consultant", "operations", "founder"],
    experienceGroups: [
      {
        id: "biz_deliverables",
        question: "What business strategies or product roadmaps did you execute?",
        subtitle: "Select strategic deliverables",
        options: [
          "Product Feature Roadmaps", "Go-To-Market (GTM) Launch Strategies", "Cross-Functional Agile Squad Leadership",
          "Competitive Pricing Analysis", "Business Process Optimization", "Investor Pitch Decks & Projections"
        ],
        followUps: [
          {
            triggerOption: "Product Feature Roadmaps",
            question: "Which prioritization frameworks did you use?",
            options: ["RICE Scoring", "Kano Model", "MoSCoW Matrix", "User Impact vs Effort"]
          }
        ]
      },
      {
        id: "biz_tools",
        question: "Which strategic planning and tracking tools were used?",
        subtitle: "Select business tools",
        options: ["Jira / Confluence", "Asana / Trello", "Miro / FigJam", "Mixpanel / Amplitude", "Excel (Financial Modeling)", "Tableau"]
      },
      {
        id: "biz_duties",
        question: "What were your primary management duties?",
        subtitle: "Select leadership practices",
        options: ["Leading Agile Sprints & Standups", "Gathering Customer Feedback & Surveys", "Defining Product Requirements (PRDs)", "Aligning Executive Stakeholders", "Managing Department Budgets"]
      },
      {
        id: "biz_impact",
        question: "What growth or operational milestones were accomplished?",
        subtitle: "Select strategic results",
        options: ["Captured 8% Market Share in Launch Regions", "Accelerated Feature Delivery Speed by 25%", "Lowered User Churn Rates by 12%", "Acquired 10k Initial Trial Users"]
      }
    ],
    projectGroups: [
      {
        id: "project_scope",
        question: "What product roadmap or market entry strategy did you create?",
        subtitle: "Select strategic project type",
        options: ["GTM Product Launch Blueprint", "Market Expansion Feasibility Study", "Operations Optimization Workflow", "Product Requirements Document (PRD)"]
      },
      {
        id: "project_tools",
        question: "Which management tools guided this project?",
        subtitle: "Select tools",
        options: ["Jira", "Miro", "Mixpanel", "Excel"]
      },
      {
        id: "project_outcomes",
        question: "What were the strategic project outcomes?",
        subtitle: "Select results",
        options: ["Secured Senior Executive Approval", "Completed Milestones Ahead of Schedule", "Expanded Market Reach"]
      }
    ]
  },
  general: {
    configId: "pool_general",
    title: "General Professional Workflows",
    keywords: ["general", "coordinator", "assistant", "associate", "manager", "operations", "project"],
    experienceGroups: [
      {
        id: "gen_deliverables",
        question: "What operational initiatives or tasks did you coordinate?",
        subtitle: "Select organizational deliverables",
        options: [
          "Cross-functional Team Schedules", "Standard Operating Procedures (SOPs)", "Automated Weekly Status Summaries",
          "Customer Support SLA Tracking", "Inventory & Procurement Records", "Corporate Seminars & Logistics"
        ]
      },
      {
        id: "gen_tools",
        question: "Which workspace platforms did you use?",
        subtitle: "Select productivity tools",
        options: ["Trello / Asana", "Microsoft Office Suite", "Google Workspace", "Slack / Teams", "Jira", "Notion"]
      },
      {
        id: "gen_duties",
        question: "What were your primary operational tasks?",
        subtitle: "Select key responsibilities",
        options: ["Calendar & Meeting Logistics", "Project Milestone Tracking", "Internal Communication Logs", "Resolving Client Support Inquiries", "Maintaining Supplier Records"]
      },
      {
        id: "gen_impact",
        question: "What operational outcomes were accomplished?",
        subtitle: "Select performance outcomes",
        options: ["Reduced Scheduling Delays by 35%", "Improved Task Completion Speed by 25%", "Saved 8 Hours Weekly in Manual Reporting", "Elevated Client Satisfaction Scores"]
      }
    ],
    projectGroups: [
      {
        id: "project_scope",
        question: "What operational project or documentation file did you produce?",
        subtitle: "Select project type",
        options: ["Standard Operating Procedure (SOP) Suite", "Project Schedule Milestone Board", "Client Support Knowledge Base"]
      },
      {
        id: "project_tools",
        question: "Which tools assisted this project?",
        subtitle: "Select tools",
        options: ["Trello / Asana", "Google Workspace", "MS Office"]
      },
      {
        id: "project_outcomes",
        question: "What were the project achievements?",
        subtitle: "Select results",
        options: ["Completed Milestones on Schedule", "Streamlined Internal Operations", "Improved Team Collaboration"]
      }
    ]
  }
};

// --- GRANULAR SUB-ROLE SPECIFIC OVERRIDES ---
export const GRANULAR_SUB_ROLE_POOLS: Record<string, Partial<PCEDiscoveryConfig>> = {
  // Developer Sub-roles
  "developer_ai": {
    title: "AI & Machine Learning Engineering",
    keywords: ["ai", "machine learning", "ml", "deep learning", "llm", "ai engineer", "nlp"],
    experienceGroups: [
      {
        id: "architecture",
        question: "What AI models or intelligent architectures did you engineer?",
        subtitle: "Select AI & ML engineering deliverables",
        options: ["LLM Integration Services", "RAG Retrieval Architecture", "Custom Model Fine-tuning", "NLP Text Pipelines", "Computer Vision Pipelines", "Vector Database Indexing"]
      },
      {
        id: "stack",
        question: "Which AI frameworks and tools powered your models?",
        subtitle: "Select AI technical stack",
        options: ["Python", "PyTorch", "TensorFlow", "OpenAI API", "Hugging Face", "LangChain", "Pinecone / ChromaDB", "Scikit-Learn"]
      }
    ]
  },
  "developer_devops": {
    title: "Cloud Infrastructure & DevOps Engineering",
    keywords: ["devops", "cloud", "kubernetes", "aws", "terraform", "ci/cd", "sre"],
    experienceGroups: [
      {
        id: "architecture",
        question: "What cloud infrastructure or deployment automation did you engineer?",
        subtitle: "Select DevOps architecture deliverables",
        options: ["Kubernetes Microservice Clusters", "Terraform Infrastructure-as-Code (IaC)", "Automated CI/CD Deployment Pipelines", "Prometheus & Grafana Monitoring Systems", "Cloud Server Load Balancing"]
      },
      {
        id: "stack",
        question: "Which cloud and DevOps platforms were utilized?",
        subtitle: "Select DevOps toolchain",
        options: ["AWS", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Jenkins", "Helm", "Prometheus"]
      }
    ]
  },

  // Designer Sub-roles
  "designer_graphic": {
    title: "Graphic & Brand Visual Design",
    keywords: ["graphic designer", "graphic", "brand designer", "visual designer", "illustrator", "logo"],
    experienceGroups: [
      {
        id: "design_assets",
        question: "What brand identity assets or visual graphics did you produce?",
        subtitle: "Select graphic design deliverables",
        options: ["Brand Visual Identity Kits", "Vector Logo Suites", "Print & Marketing Banners", "Typography System Guidelines", "Social Media Asset Packages", "Custom Vector Illustrations"]
      },
      {
        id: "design_tools",
        question: "Which graphic software and creative tools did you use?",
        subtitle: "Select creative software",
        options: ["Adobe Illustrator", "Adobe Photoshop", "InDesign", "Figma", "After Effects", "Canva"]
      }
    ]
  },

  // HR Sub-roles
  "hr_payroll": {
    title: "HR Payroll & Compensation Management",
    keywords: ["payroll", "compensation", "benefits", "payroll specialist", "payroll manager"],
    experienceGroups: [
      {
        id: "hr_deliverables",
        question: "What payroll systems or compensation frameworks did you manage?",
        subtitle: "Select payroll & benefits deliverables",
        options: ["Bi-weekly Payroll Processing", "Tax Deduction & Statutory Filings", "Employee Compensation Benchmarking", "HRIS Database Reconciliation", "Annual Benefits Open Enrollment"]
      },
      {
        id: "hr_tools",
        question: "Which payroll software and HRIS systems were used?",
        subtitle: "Select payroll software",
        options: ["ADP Workforce", "Gusto", "Workday Payroll", "BambooHR", "Advanced Excel (VBA/DAX)"]
      }
    ]
  },

  // Finance Sub-roles
  "finance_tax": {
    title: "Tax Accounting & Statutory Auditing",
    keywords: ["tax", "auditor", "cpa", "statutory", "accounting"],
    experienceGroups: [
      {
        id: "fin_deliverables",
        question: "What tax filings or audit workpapers did you prepare?",
        subtitle: "Select tax & audit deliverables",
        options: ["Corporate Income Tax Filings", "Statutory Audit Reconciliation Papers", "Sales Tax & VAT Filings", "Quarterly GAAP Financial Reviews", "Internal Audit Risk Logs"]
      },
      {
        id: "fin_tools",
        question: "Which accounting and tax filing platforms were used?",
        subtitle: "Select tax tools",
        options: ["QuickBooks", "NetSuite", "SAP ERP", "CCH Axcess / Drake Tax", "Excel"]
      }
    ]
  },

  // Marketing Sub-roles
  "marketing_seo": {
    title: "Search Engine Optimization (SEO)",
    keywords: ["seo", "search engine", "organic growth", "keyword"],
    experienceGroups: [
      {
        id: "mkt_channels",
        question: "What organic search initiatives or technical audits did you execute?",
        subtitle: "Select SEO deliverables",
        options: ["On-page Content Optimization", "Technical SEO Site Audits", "Strategic Keyword Mapping", "Authority Link Building Drives", "Local SEO Google Business Profiles"]
      },
      {
        id: "mkt_tools",
        question: "Which SEO research and analytics tools were used?",
        subtitle: "Select SEO tools",
        options: ["Ahrefs", "Semrush", "Google Search Console", "Screaming Frog", "Google Analytics 4"]
      }
    ]
  }
};
