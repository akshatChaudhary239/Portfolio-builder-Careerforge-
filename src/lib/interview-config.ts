export interface InterviewFollowUp {
  triggerOption: string;
  question: string;
  options: string[];
}

export interface InterviewCategory {
  id: string;
  title: string;
  subtitle: string;
  options: string[];
  followUps?: InterviewFollowUp[];
}

export interface RoleInterviewConfig {
  roleName: string;
  keywords: string[];
  categories: InterviewCategory[];
}

export const ROLE_INTERVIEW_CONFIGS: Record<string, RoleInterviewConfig[]> = {
  developer: [
    {
      roleName: "Frontend Developer",
      keywords: ["frontend", "front end", "react", "vue", "angular", "ui dev", "web dev", "client side"],
      categories: [
        {
          id: "features",
          title: "What features or core components did you build?",
          subtitle: "Select all that apply to your project or job scope",
          options: [
            "Landing Pages", "Dashboard UI", "Authentication UI", "Interactive Forms",
            "User Profile", "Global Search", "Admin Panel", "Data Charts", "Data Tables",
            "Responsive Layouts", "Micro-animations", "Reusable Design System"
          ],
          followUps: [
            {
              triggerOption: "Authentication UI",
              question: "Which authentication methods or providers were integrated?",
              options: ["JWT Tokens", "OAuth 2.0", "Firebase Auth", "Clerk", "Auth0", "Supabase Auth", "NextAuth"]
            },
            {
              triggerOption: "Data Charts",
              question: "Which visualization libraries were used?",
              options: ["Chart.js", "Recharts", "D3.js", "Highcharts", "Nivo", "ApexCharts"]
            },
            {
              triggerOption: "Reusable Design System",
              question: "What architecture or styling tools framed the design system?",
              options: ["Tailwind CSS", "Storybook", "Figma Tokens", "CSS Modules", "Styled Components", "Radix UI", "Shadcn UI"]
            }
          ]
        },
        {
          id: "technologies",
          title: "Which technologies and tools did you utilize?",
          subtitle: "Select the core stack tools used",
          options: [
            "React", "Next.js", "Vue.js", "Angular", "TypeScript", "JavaScript",
            "Tailwind CSS", "Redux Toolkit", "Zustand", "Framer Motion", "HTML5/CSS3", "Git/GitHub"
          ]
        },
        {
          id: "responsibilities",
          title: "What were your primary daily responsibilities?",
          subtitle: "Select key technical operational duties",
          options: [
            "Feature Engineering", "Bug Fixing", "REST/GraphQL Integration", "Responsive Styling",
            "Code Reviews", "CI/CD Deployment", "Lighthouse Performance Tuning", "Accessibility (WCAG)", "Cross-browser Testing"
          ]
        },
        {
          id: "achievements",
          title: "What key measurable achievements did you accomplish?",
          subtitle: "Select impact highlights",
          options: [
            "Reduced Load Time by 40%+", "Built Product From Scratch", "Improved UX Conversion Rate",
            "Delivered Sprint 2 Weeks Ahead", "Optimized Core Web Vitals", "Zero Critical Bugs Released"
          ]
        }
      ]
    },
    {
      roleName: "Backend Developer",
      keywords: ["backend", "back end", "node", "express", "python", "java", "api", "database", "golang"],
      categories: [
        {
          id: "features",
          title: "What backend systems or endpoints did you architect?",
          subtitle: "Select core server deliverables",
          options: [
            "RESTful API Suite", "GraphQL Endpoint Gateway", "OAuth Authentication Service", "Database Schema & Indexing",
            "Payment Gateway Integration", "WebSockets Real-time Chat", "Background Queue Jobs", "Third-party Webhooks", "File Upload Microservice"
          ],
          followUps: [
            {
              triggerOption: "Payment Gateway Integration",
              question: "Which payment processors were integrated?",
              options: ["Stripe", "PayPal", "Razorpay", "Square", "Braintree"]
            },
            {
              triggerOption: "Background Queue Jobs",
              question: "Which message broker or queue tools were implemented?",
              options: ["BullMQ", "RabbitMQ", "Apache Kafka", "Redis Queue", "AWS SQS"]
            }
          ]
        },
        {
          id: "technologies",
          title: "Which backend stack & databases were used?",
          subtitle: "Select technology components",
          options: [
            "Node.js", "Express.js", "Python / Django", "Java / Spring Boot", "PostgreSQL",
            "MongoDB", "Redis", "Docker", "Prisma ORM", "AWS / Serverless"
          ]
        },
        {
          id: "responsibilities",
          title: "What were your primary engineering duties?",
          subtitle: "Select operational responsibilities",
          options: [
            "API Design & Documentation", "Database Schema Optimization", "Security & Auth Audits",
            "Server Scaling", "Unit & Integration Testing", "DevOps Pipeline Management"
          ]
        },
        {
          id: "achievements",
          title: "What backend performance milestones were hit?",
          subtitle: "Select quantifiable achievements",
          options: [
            "Reduced API Response Latency by 50%", "Cut Cloud Hosting Costs by 30%", "Handled 100k+ Concurrent Users",
            "Maintained 99.99% Uptime", "Zero Security Vulnerabilities"
          ]
        }
      ]
    },
    {
      roleName: "Full Stack Developer",
      keywords: ["full stack", "fullstack", "software engineer", "web developer", "developer"],
      categories: [
        {
          id: "features",
          title: "What end-to-end applications or modules did you build?",
          subtitle: "Select full-stack scope items",
          options: [
            "SaaS Web Application", "E-Commerce Platform", "Real-time Dashboard", "REST API & UI Integration",
            "Authentication & Role Permissions", "Database & Frontend State Sync", "CMS Platform"
          ]
        },
        {
          id: "technologies",
          title: "Which full-stack technologies were used?",
          subtitle: "Select tools from frontend to backend",
          options: [
            "React / Next.js", "Node.js / Express", "TypeScript", "Tailwind CSS",
            "PostgreSQL / MongoDB", "Prisma", "Redis", "Docker", "Git"
          ]
        },
        {
          id: "responsibilities",
          title: "What were your key responsibilities?",
          subtitle: "Select cross-functional duties",
          options: [
            "End-to-End Feature Development", "Database & Frontend Architecture", "API Integration",
            "Performance Optimization", "Automated Testing", "Product Deployment"
          ]
        },
        {
          id: "achievements",
          title: "What major results did you deliver?",
          subtitle: "Select impact milestones",
          options: [
            "Launched MVP in Record Time", "Boosted Overall System Performance", "Scaled User Base to 10k+",
            "Streamlined Deployment Pipelines"
          ]
        }
      ]
    }
  ],
  designer: [
    {
      roleName: "UI/UX Designer",
      keywords: ["designer", "ui", "ux", "product designer", "interaction designer", "visual designer"],
      categories: [
        {
          id: "features",
          title: "What design assets or user flows did you produce?",
          subtitle: "Select key design deliverables",
          options: [
            "Interactive Prototypes", "Wireframes & User Flows", "Figma Design System", "Mobile App UI",
            "Web Dashboard Design", "Usability Testing Reports", "Brand Identity & Vector Kits"
          ],
          followUps: [
            {
              triggerOption: "Figma Design System",
              question: "What components were standardized in the design system?",
              options: ["Typography Tokens", "Color Palettes", "Button Variants", "Form Fields", "Modal Dialogs", "Navigation Bars"]
            }
          ]
        },
        {
          id: "technologies",
          title: "Which design tools and software were used?",
          subtitle: "Select software suite",
          options: [
            "Figma", "FigJam", "Adobe XD", "Sketch", "Photoshop", "Illustrator", "Framer", "Miro"
          ]
        },
        {
          id: "responsibilities",
          title: "What were your primary design responsibilities?",
          subtitle: "Select operational tasks",
          options: [
            "User Research & Interviews", "Wireframing & Prototyping", "Developer Handoff Support",
            "Design System Maintenance", "Accessibility Audits (WCAG)", "A/B Testing Visuals"
          ]
        },
        {
          id: "achievements",
          title: "What design achievements were accomplished?",
          subtitle: "Select measurable impact",
          options: [
            "Improved Signup Conversion by 25%", "Reduced Developer Handoff Time by 40%",
            "Standardized Company-wide Design Tokens", "Achieved 95%+ Usability Score"
          ]
        }
      ]
    }
  ],
  marketing: [
    {
      roleName: "Digital Marketer / SEO Specialist",
      keywords: ["marketing", "seo", "growth", "campaign", "google ads", "social media", "lead generator"],
      categories: [
        {
          id: "features",
          title: "What marketing campaigns or initiatives did you manage?",
          subtitle: "Select strategic campaign types",
          options: [
            "Google PPC Search Ads", "Meta (Facebook/IG) Ads", "Organic SEO Audit & Optimization",
            "Outbound Cold Email Campaigns", "Content Marketing Strategy", "Social Media Channel Growth"
          ],
          followUps: [
            {
              triggerOption: "Google PPC Search Ads",
              question: "What key metrics were targeted for Google Ads?",
              options: ["High ROAS (4x+)", "Reduced CPA", "Target Keyword Match", "Click-Through Rate (CTR)"]
            }
          ]
        },
        {
          id: "technologies",
          title: "Which marketing platforms & analytics tools were used?",
          subtitle: "Select marketing tech stack",
          options: [
            "Google Ads", "Meta Business Suite", "Google Analytics 4 (GA4)", "Ahrefs / Semrush",
            "Mailchimp / HubSpot", "Google Tag Manager", "WordPress / Webflow"
          ]
        },
        {
          id: "responsibilities",
          title: "What were your daily marketing responsibilities?",
          subtitle: "Select core execution duties",
          options: [
            "Keyword Research & On-page SEO", "Ad Copywriting & Split Testing", "Lead Sourcing & Qualification",
            "Campaign Budget Allocation", "Funnel Analytics Monitoring"
          ]
        },
        {
          id: "achievements",
          title: "What campaign growth records did you achieve?",
          subtitle: "Select quantifiable outcomes",
          options: [
            "Achieved 4.2x ROAS", "Increased Organic Search Traffic by 130%", "Generated 250+ High-Value B2B Leads",
            "Lowered Customer Acquisition Cost (CAC) by 20%"
          ]
        }
      ]
    }
  ],
  law: [
    {
      roleName: "Corporate Lawyer / Legal Associate",
      keywords: ["law", "legal", "lawyer", "attorney", "counsel", "compliance", "paralegal"],
      categories: [
        {
          id: "features",
          title: "What legal work or documentation did you execute?",
          subtitle: "Select core legal deliverables",
          options: [
            "Commercial Contract Drafting", "Regulatory Compliance Audits", "M&A Due Diligence",
            "Intellectual Property Filings", "Litigation Briefs & Research", "SLA Vendor Negotiations"
          ]
        },
        {
          id: "technologies",
          title: "Which legal databases and compliance tools were used?",
          subtitle: "Select legal tech tools",
          options: [
            "Westlaw", "LexisNexis", "DocuSign", "Clio", "GDPR / CCPA Frameworks", "MS Office / Excel"
          ]
        },
        {
          id: "responsibilities",
          title: "What were your primary legal duties?",
          subtitle: "Select operational responsibilities",
          options: [
            "Legal Research & Case Precedents", "Client Consultations", "Contract Terms Review",
            "Risk Assessment Reports", "Regulatory Filing Verification"
          ]
        },
        {
          id: "achievements",
          title: "What key legal milestones were accomplished?",
          subtitle: "Select legal achievements",
          options: [
            "Finalized 70+ Commercial Contracts", "Zero Regulatory Non-Compliance Fines",
            "Resolved Complex Business Litigation", "Negotiated 25% Savings in SLA Overhead"
          ]
        }
      ]
    }
  ],
  hr: [
    {
      roleName: "HR / Talent Acquisition Specialist",
      keywords: ["hr", "recruiter", "talent", "human resources", "onboarding", "people"],
      categories: [
        {
          id: "features",
          title: "What HR or recruitment initiatives did you lead?",
          subtitle: "Select people operation programs",
          options: [
            "End-to-End Technical Sourcing", "Automated Employee Onboarding", "Employee Retention & Recognition",
            "ATS Pipeline Workflow Setup", "Workforce Policy Manuals", "Employer Branding Events"
          ]
        },
        {
          id: "technologies",
          title: "Which HRIS and recruitment platforms were used?",
          subtitle: "Select HR systems",
          options: [
            "Greenhouse ATS", "Lever", "Workday", "LinkedIn Recruiter", "BambooHR", "Typeform / CultureAmp"
          ]
        },
        {
          id: "responsibilities",
          title: "What were your daily HR responsibilities?",
          subtitle: "Select operational duties",
          options: [
            "Candidate Screening & Interviewing", "Onboarding Documentation", "Labor Law Compliance Checks",
            "Employee Performance Reviews", "Payroll & Benefits Coordination"
          ]
        },
        {
          id: "achievements",
          title: "What recruitment & HR targets were hit?",
          subtitle: "Select impact metrics",
          options: [
            "Hired 45+ Technical Candidates", "Reduced Cost-per-Hire by 22%", "Cut Onboarding Ramp-up Time by 50%",
            "Lowered Annual Employee Turnover by 18%"
          ]
        }
      ]
    }
  ],
  finance: [
    {
      roleName: "Financial Analyst / Accountant",
      keywords: ["finance", "financial", "accountant", "audit", "banking", "cpa", "cfa"],
      categories: [
        {
          id: "features",
          title: "What financial models or reports did you construct?",
          subtitle: "Select core financial deliverables",
          options: [
            "3-Statement Corporate Models", "Discounted Cash Flow (DCF) Valuations", "Operating Cost Variance Audits",
            "Power BI Executive Dashboards", "Long-term Revenue Forecasts", "Tax Compliance Audits"
          ]
        },
        {
          id: "technologies",
          title: "Which financial software and tools were used?",
          subtitle: "Select financial tech stack",
          options: [
            "Advanced Excel (VBA / DAX)", "Power BI", "Tableau", "SAP ERP", "Bloomberg Terminal", "SQL"
          ]
        },
        {
          id: "responsibilities",
          title: "What were your daily financial duties?",
          subtitle: "Select operational tasks",
          options: [
            "Financial Modeling & Forecasting", "Budget Variance Reviews", "Audit Data Verification",
            "Investment Portfolio Tracking", "Executive Deck Preparation"
          ]
        },
        {
          id: "achievements",
          title: "What financial optimization records did you achieve?",
          subtitle: "Select financial achievements",
          options: [
            "Hit 98.2% Forecast Accuracy", "Identified $120k in Systemic Cost Savings",
            "Automated Weekly Financial Reporting", "Secured 100% GAAP Audit Compliance"
          ]
        }
      ]
    }
  ],
  general: [
    {
      roleName: "General Professional / Project Coordinator",
      keywords: ["general", "coordinator", "assistant", "associate", "manager", "operations", "project"],
      categories: [
        {
          id: "features",
          title: "What operational initiatives or projects did you coordinate?",
          subtitle: "Select core organizational deliverables",
          options: [
            "Cross-functional Schedule Planning", "Standard Operating Procedures (SOPs)", "Automated Team Status Reports",
            "Customer Support Ticketing SLA", "Inventory & Procurement Tracking", "Corporate Seminars & Events"
          ]
        },
        {
          id: "technologies",
          title: "Which productivity tools were used?",
          subtitle: "Select software stack",
          options: [
            "Trello / Asana", "Microsoft Office Suite", "Google Workspace", "Slack / Teams", "Jira", "Notion"
          ]
        },
        {
          id: "responsibilities",
          title: "What were your daily operational tasks?",
          subtitle: "Select key duties",
          options: [
            "Meeting Logistics & Calendar Management", "Project Task Tracking", "Internal Communication Logs",
            "Customer Inquiry Resolution", "Vendor Record Maintenance"
          ]
        },
        {
          id: "achievements",
          title: "What operational milestones were reached?",
          subtitle: "Select performance outcomes",
          options: [
            "Decreased Schedule Lag by 35%", "Raised Task Completion Rate by 25%",
            "Saved 8 Hours Weekly in Manual Reporting", "Boosted Customer Satisfaction by 15%"
          ]
        }
      ]
    }
  ]
};

/**
 * Gets the closest adaptive role interview configuration.
 */
export function getInterviewConfig(title: string, professionCategory: string): RoleInterviewConfig {
  const t = (title || '').toLowerCase().trim();
  const prof = (professionCategory || '').toLowerCase().trim();

  let categoryKey = 'general';
  if (prof.includes('dev') || prof.includes('software')) categoryKey = 'developer';
  else if (prof.includes('design')) categoryKey = 'designer';
  else if (prof.includes('marketing')) categoryKey = 'marketing';
  else if (prof.includes('law')) categoryKey = 'law';
  else if (prof.includes('hr') || prof.includes('human')) categoryKey = 'hr';
  else if (prof.includes('finance') || prof.includes('accountant')) categoryKey = 'finance';
  else if (prof.includes('mba') || prof.includes('business') || prof.includes('data')) categoryKey = 'developer'; // fallback or dev match

  const pool = ROLE_INTERVIEW_CONFIGS[categoryKey] || ROLE_INTERVIEW_CONFIGS['general'];

  if (t.length >= 3) {
    for (const config of pool) {
      if (config.keywords.some(kw => t.includes(kw) || kw.includes(t))) {
        return config;
      }
    }
  }

  return pool[0] || ROLE_INTERVIEW_CONFIGS['general'][0];
}
