export interface DiscoveryFollowUp {
  triggerOption: string;
  question: string;
  options: string[];
}

export interface DiscoveryGroup {
  id: string;
  question: string; // Conversational phrasing e.g. "What kinds of things did you work on?"
  subtitle: string;
  options: string[];
  followUps?: DiscoveryFollowUp[];
}

export interface DiscoveryConfig {
  configId: string;
  title: string;
  keywords: string[];
  groups: DiscoveryGroup[];
}

// --- WORK EXPERIENCE DISCOVERY CONFIGS (ROLE-BASED) ---
export const EXPERIENCE_DISCOVERY_CONFIGS: Record<string, DiscoveryConfig[]> = {
  developer: [
    {
      configId: "dev_frontend",
      title: "Frontend Developer",
      keywords: ["frontend", "front end", "react", "vue", "angular", "ui dev", "web dev", "client side"],
      groups: [
        {
          id: "features",
          question: "What kinds of features or user interfaces did you work on?",
          subtitle: "Select all deliverables that apply to your work",
          options: [
            "Dashboards & Analytics", "Landing Pages", "Admin Management Panels",
            "Authentication & Signup Flows", "Interactive Forms & Wizards",
            "User Profile Systems", "Global Search & Filtering", "Data Visualizations & Charts",
            "Responsive Mobile Layouts", "Reusable Component Libraries"
          ],
          followUps: [
            {
              triggerOption: "Authentication & Signup Flows",
              question: "Which authentication methods or security protocols were integrated?",
              options: ["JWT Tokens", "OAuth 2.0", "Firebase Auth", "Clerk", "Auth0", "Supabase Auth", "NextAuth"]
            },
            {
              triggerOption: "Data Visualizations & Charts",
              question: "Which charting or graphics libraries did you use?",
              options: ["Chart.js", "Recharts", "D3.js", "Highcharts", "ApexCharts"]
            }
          ]
        },
        {
          id: "technologies",
          question: "Which tools and technologies powered your work?",
          subtitle: "Select core tools in your technical stack",
          options: [
            "React", "Next.js", "TypeScript", "JavaScript (ES6+)", "Tailwind CSS",
            "HTML5 & CSS3", "Redux Toolkit", "Zustand", "Framer Motion", "Git & GitHub"
          ]
        },
        {
          id: "responsibilities",
          question: "How did you contribute to the engineering process?",
          subtitle: "Select your primary day-to-day responsibilities",
          options: [
            "Building New Features", "Fixing Bugs & Refactoring", "Integrating REST & GraphQL APIs",
            "Optimizing Page Load Speeds", "Conducting Code Reviews", "Configuring CI/CD Deployments",
            "Ensuring Accessibility (WCAG)", "Cross-Browser Testing"
          ]
        },
        {
          id: "achievements",
          question: "What key results or milestones did you achieve?",
          subtitle: "Select highlights that show your impact",
          options: [
            "Reduced Page Load Times by 40%+", "Built Product UI From Scratch", "Increased Conversion Rates",
            "Delivered Sprints Ahead of Schedule", "Maintained Zero Critical Production Bugs"
          ]
        }
      ]
    },
    {
      configId: "dev_backend",
      title: "Backend Developer",
      keywords: ["backend", "back end", "node", "express", "python", "java", "api", "database", "golang"],
      groups: [
        {
          id: "features",
          question: "What server architecture or backend services did you build?",
          subtitle: "Select server deliverables",
          options: [
            "RESTful API Architecture", "GraphQL Query Gateways", "Database Schema Models",
            "Payment Processor Integrations", "Real-time Messaging & WebSockets",
            "Background Queue & Job Handlers", "Authentication & Role Security", "Third-party Webhook Sync"
          ],
          followUps: [
            {
              triggerOption: "Payment Processor Integrations",
              question: "Which payment processors did you integrate?",
              options: ["Stripe", "PayPal", "Razorpay", "Square"]
            }
          ]
        },
        {
          id: "technologies",
          question: "Which backend technologies and databases were used?",
          subtitle: "Select backend stack components",
          options: [
            "Node.js", "Express.js", "Python / Django", "Java / Spring Boot", "PostgreSQL",
            "MongoDB", "Redis", "Docker", "Prisma ORM", "AWS Cloud Services"
          ]
        },
        {
          id: "responsibilities",
          question: "What were your primary backend engineering duties?",
          subtitle: "Select operational responsibilities",
          options: [
            "API Design & Specification", "Database Query Optimization", "Security & Encryption Audits",
            "Server Scaling & Caching", "Automated API Integration Testing", "Cloud Infrastructure Monitoring"
          ]
        },
        {
          id: "achievements",
          question: "What server performance records did you hit?",
          subtitle: "Select quantifiable outcomes",
          options: [
            "Cut API Response Latency by 50%", "Reduced Cloud Infrastructure Costs by 30%",
            "Supported 100k+ Concurrent Users", "Achieved 99.99% Server Uptime"
          ]
        }
      ]
    }
  ],
  designer: [
    {
      configId: "design_uiux",
      title: "UI/UX Designer",
      keywords: ["designer", "ui", "ux", "product designer", "interaction designer", "visual designer"],
      groups: [
        {
          id: "features",
          question: "What design assets or user experiences did you craft?",
          subtitle: "Select key design deliverables",
          options: [
            "Interactive Wireframes", "High-Fidelity Prototypes", "Comprehensive Design Systems",
            "Mobile Application UI", "Web Application Interfaces", "User Journey Flow Maps",
            "Brand Identity Assets"
          ]
        },
        {
          id: "technologies",
          question: "Which software tools did you rely on?",
          subtitle: "Select design software suite",
          options: ["Figma", "FigJam", "Adobe XD", "Sketch", "Photoshop", "Illustrator", "Framer", "Miro"]
        },
        {
          id: "responsibilities",
          question: "How did you facilitate the product design cycle?",
          subtitle: "Select design tasks",
          options: [
            "Conducting User Interviews & Research", "Building Component Libraries",
            "Managing Developer Handoffs", "Usability Testing & Iteration", "Auditing Visual Accessibility"
          ]
        },
        {
          id: "achievements",
          question: "What design milestones were accomplished?",
          subtitle: "Select design impact",
          options: [
            "Increased Signup Conversions by 25%", "Cut Developer Handoff Delay by 40%",
            "Standardized Product Visual Tokens", "Achieved High Usability Test Scores"
          ]
        }
      ]
    }
  ],
  marketing: [
    {
      configId: "mkt_digital",
      title: "Digital Marketer / Growth Specialist",
      keywords: ["marketing", "seo", "growth", "campaign", "google ads", "social media", "lead generator"],
      groups: [
        {
          id: "features",
          question: "What strategic campaigns or channels did you manage?",
          subtitle: "Select campaign initiatives",
          options: [
            "Google PPC Search Campaigns", "Meta (Facebook/IG) Paid Ads", "Organic SEO Content Strategy",
            "Outbound Lead Generation Funnels", "Automated Email Drip Campaigns", "Social Media Channel Growth"
          ]
        },
        {
          id: "technologies",
          question: "Which analytics and ad platforms were used?",
          subtitle: "Select marketing tools",
          options: ["Google Ads", "Meta Business Suite", "Google Analytics 4", "Ahrefs / Semrush", "Mailchimp", "HubSpot"]
        },
        {
          id: "responsibilities",
          question: "What were your daily marketing responsibilities?",
          subtitle: "Select execution duties",
          options: [
            "Ad Copywriting & Creative Testing", "Keyword Research & On-page Optimization",
            "Lead Sourcing & Pipeline Qualification", "Managing Campaign Budgets", "Monitoring Funnel Analytics"
          ]
        },
        {
          id: "achievements",
          question: "What campaign results did you achieve?",
          subtitle: "Select quantifiable records",
          options: [
            "Achieved 4.2x Average ROAS", "Grew Organic Search Traffic by 130%",
            "Qualified 250+ High-Value B2B Leads", "Lowered Customer Acquisition Cost (CAC) by 20%"
          ]
        }
      ]
    }
  ],
  general: [
    {
      configId: "gen_prof",
      title: "General Professional",
      keywords: ["general", "coordinator", "assistant", "associate", "manager", "operations", "project"],
      groups: [
        {
          id: "features",
          question: "What core initiatives or operational tasks did you coordinate?",
          subtitle: "Select organizational deliverables",
          options: [
            "Cross-functional Team Schedules", "Standard Operating Procedures (SOPs)",
            "Automated Weekly Status Reports", "Customer Inquiry & SLA Tracking",
            "Inventory & Procurement Logs", "Corporate Events & Seminars"
          ]
        },
        {
          id: "technologies",
          question: "Which workspace platforms did you use?",
          subtitle: "Select productivity tools",
          options: ["Trello / Asana", "Microsoft Office Suite", "Google Workspace", "Slack / Teams", "Jira", "Notion"]
        },
        {
          id: "responsibilities",
          question: "What were your primary operational duties?",
          subtitle: "Select key responsibilities",
          options: [
            "Calendar & Meeting Logistics", "Project Milestone Tracking", "Internal Communication Operations",
            "Resolving Escalated Client Requests", "Maintaining Vendor Databases"
          ]
        },
        {
          id: "achievements",
          question: "What operational records were accomplished?",
          subtitle: "Select performance outcomes",
          options: [
            "Reduced Scheduling Delays by 35%", "Improved Task Completion Speed by 25%",
            "Eliminated 8 Hours of Manual Weekly Reporting", "Elevated Client Satisfaction Scores"
          ]
        }
      ]
    }
  ]
};

// --- PROJECT / CAMPAIGN DISCOVERY CONFIGS (PROJECT-TYPE BASED) ---
export const PROJECT_DISCOVERY_CONFIGS: Record<string, DiscoveryConfig[]> = {
  developer: [
    {
      configId: "proj_webapp",
      title: "E-Commerce / Web Application",
      keywords: ["ecommerce", "e-commerce", "web app", "dashboard", "portal", "platform", "app"],
      groups: [
        {
          id: "features",
          question: "What core features and modules were built into this project?",
          subtitle: "Select project capabilities",
          options: [
            "User Authentication & Roles", "Interactive Product Catalog", "Shopping Cart & Checkout Flow",
            "Payment Gateway Integration", "Admin Analytics Dashboard", "Real-time Notifications",
            "Search & Multi-filter Engine", "Customer Review System"
          ]
        },
        {
          id: "technologies",
          question: "What tech stack powers this project?",
          subtitle: "Select architecture components",
          options: ["React / Next.js", "TypeScript", "Node.js / Express", "PostgreSQL / MongoDB", "Tailwind CSS", "Redux / Zustand", "Docker"]
        },
        {
          id: "challenges",
          question: "What technical challenges did you solve?",
          subtitle: "Select engineering hurdles",
          options: [
            "Optimizing Complex Database Queries", "Handling High Concurrent Traffic",
            "Securing User Payment Data", "Managing Complex State Across Pages", "Achieving Mobile Responsiveness"
          ]
        },
        {
          id: "achievements",
          question: "What was the final outcome or impact of this project?",
          subtitle: "Select project achievements",
          options: [
            "Successfully Deployed to Production", "Processed 10k+ User Transactions",
            "Achieved 95+ Lighthouse Performance Score", "Open-Sourced on GitHub with Stars"
          ]
        }
      ]
    }
  ],
  marketing: [
    {
      configId: "proj_campaign",
      title: "Marketing & Growth Campaign",
      keywords: ["campaign", "seo", "ads", "social media", "growth", "launch", "marketing"],
      groups: [
        {
          id: "features",
          question: "What type of campaign or channel strategy was executed?",
          subtitle: "Select campaign architecture",
          options: [
            "PPC Search Ad Campaign", "Meta Social Media Ads", "SEO Content Strategy & Audit",
            "Cold Email Lead Generation Drip", "Product Hunt Launch Campaign", "Influencer Collaboration Drive"
          ]
        },
        {
          id: "technologies",
          question: "Which tools were used to build and measure the campaign?",
          subtitle: "Select marketing tech stack",
          options: ["Google Ads", "Meta Ads Manager", "Google Analytics 4", "Ahrefs", "Mailchimp", "Google Tag Manager"]
        },
        {
          id: "achievements",
          question: "What performance metrics did the campaign deliver?",
          subtitle: "Select campaign outcomes",
          options: [
            "Exceeded Target ROAS Goals", "Generated 500+ Qualified Leads",
            "Ranked Target Keywords on Google Page 1", "Lowered Cost Per Click (CPC) by 25%"
          ]
        }
      ]
    }
  ],
  general: [
    {
      configId: "proj_general",
      title: "Project Showcase Case Study",
      keywords: ["project", "case study", "showcase", "initiative"],
      groups: [
        {
          id: "features",
          question: "What were the major deliverables of this project?",
          subtitle: "Select project outcomes",
          options: [
            "System Architecture Design", "Operational Process Redesign", "Analytical Data Model",
            "User Interface Prototype", "Strategic Planning Documentation", "Workflow Automation Script"
          ]
        },
        {
          id: "technologies",
          question: "Which software or frameworks were utilized?",
          subtitle: "Select tools",
          options: ["Figma / Design Tools", "Python / SQL", "Modern Web Frameworks", "Project Management Tools", "Excel / Analytics"]
        },
        {
          id: "achievements",
          question: "What key results were achieved?",
          subtitle: "Select achievements",
          options: [
            "Completed Project On Schedule", "Received Client Approval",
            "Improved Operational Efficiency", "Published Live Demo / Presentation"
          ]
        }
      ]
    }
  ]
};

/**
 * Gets the matching discovery config for Experience (Role-based) or Projects (Type-based)
 */
export function getDiscoveryConfig(title: string, professionCategory: string, type: 'experience' | 'project'): DiscoveryConfig {
  const t = (title || '').toLowerCase().trim();
  const prof = (professionCategory || '').toLowerCase().trim();

  let categoryKey = 'general';
  if (prof.includes('dev') || prof.includes('software')) categoryKey = 'developer';
  else if (prof.includes('design')) categoryKey = 'designer';
  else if (prof.includes('marketing')) categoryKey = 'marketing';
  else if (prof.includes('law')) categoryKey = 'law';
  else if (prof.includes('hr') || prof.includes('human')) categoryKey = 'hr';
  else if (prof.includes('finance') || prof.includes('accountant')) categoryKey = 'finance';
  else if (prof.includes('mba') || prof.includes('business') || prof.includes('data')) categoryKey = 'developer';

  const pool = type === 'experience'
    ? (EXPERIENCE_DISCOVERY_CONFIGS[categoryKey] || EXPERIENCE_DISCOVERY_CONFIGS['general'])
    : (PROJECT_DISCOVERY_CONFIGS[categoryKey] || PROJECT_DISCOVERY_CONFIGS['general']);

  if (t.length >= 3) {
    for (const config of pool) {
      if (config.keywords.some(kw => t.includes(kw) || kw.includes(t))) {
        return config;
      }
    }
  }

  return pool[0] || (type === 'experience' ? EXPERIENCE_DISCOVERY_CONFIGS['general'][0] : PROJECT_DISCOVERY_CONFIGS['general'][0]);
}

/**
 * Sentence Synthesis Engine:
 * Combines structured selections into 4-6 polished, recruiter-ready resume bullets.
 * Merges related concepts into fluid paragraphs instead of one-line checkboxes.
 */
export function synthesizeResumeBullets(
  selections: Record<string, string[]>,
  followUps: Record<string, string[]>,
  additionalNotes: string,
  type: 'experience' | 'project'
): string {
  const bullets: string[] = [];

  // 1. Synthesize Features / Scope
  const features = selections['features'] || [];
  if (features.length > 0) {
    const formattedList = formatListNatural(features);
    let bullet = type === 'experience'
      ? `Spearheaded end-to-end development of core product deliverables, including ${formattedList}.`
      : `Architected and executed comprehensive project modules encompassing ${formattedList}.`;
    
    // Attach follow-ups if any
    Object.entries(followUps).forEach(([trigger, opts]) => {
      if (opts.length > 0 && features.some(f => f.toLowerCase().includes(trigger.toLowerCase().split(' ')[0]))) {
        bullet += ` Specifically integrated ${opts.join(', ')} to reinforce security and architectural flexibility.`;
      }
    });
    bullets.push(`• ${bullet}`);
  }

  // 2. Synthesize Technologies
  const tech = selections['technologies'] || [];
  if (tech.length > 0) {
    const formattedTech = formatListNatural(tech);
    const bullet = `Utilized a robust technical stack comprising ${formattedTech} to build modular, maintainable, and scalable codebases.`;
    bullets.push(`• ${bullet}`);
  }

  // 3. Synthesize Responsibilities / Challenges
  const resp = selections['responsibilities'] || selections['challenges'] || [];
  if (resp.length > 0) {
    const formattedResp = formatListNatural(resp);
    const bullet = type === 'experience'
      ? `Managed core operational engineering duties across ${formattedResp}, maintaining strict adherence to corporate quality standards.`
      : `Overcame key engineering hurdles related to ${formattedResp}, ensuring structural integrity and performance optimization.`;
    bullets.push(`• ${bullet}`);
  }

  // 4. Synthesize Achievements
  const ach = selections['achievements'] || [];
  if (ach.length > 0) {
    const formattedAch = formatListNatural(ach);
    const bullet = `Delivered measurable business impact and performance milestones, achieving ${formattedAch}.`;
    bullets.push(`• ${bullet}`);
  }

  // 5. Additional Notes
  if (additionalNotes && additionalNotes.trim()) {
    bullets.push(`• ${additionalNotes.trim()}`);
  }

  // Fallback if no selections made
  if (bullets.length === 0) {
    return '• Coordinated core assignments aligned with standard professional metrics and deliverables.';
  }

  return bullets.join('\n');
}

function formatListNatural(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0].toLowerCase();
  if (items.length === 2) return `${items[0].toLowerCase()} and ${items[1].toLowerCase()}`;
  const firsts = items.slice(0, -1).map(i => i.toLowerCase()).join(', ');
  return `${firsts}, and ${items[items.length - 1].toLowerCase()}`;
}
