import React, { useState, useEffect } from 'react';
import { Plus, Trophy, HelpCircle } from 'lucide-react';

interface AchievementQuestion {
  question: string;
  upgradedPoint: string;
}

interface AchievementAssistantProps {
  jobTitle: string;
  professionCategory: string;
  currentSkills: { name: string }[];
  currentDescription: string;
  onUpdateDescription: (newDescription: string) => void;
}

// Sub-role specific questions database to guarantee targeted suggestions based on job title keywords
const SUB_ROLE_ACHIEVEMENT_REGISTRY: {
  keywords: string[];
  questions: AchievementQuestion[];
}[] = [
  // --- FRONTEND DEVELOPER ---
  {
    keywords: ["frontend", "front end", "react", "angular", "vue", "ui/ux dev"],
    questions: [
      {
        question: "Did you improve frontend application load times using [Skill1]?",
        upgradedPoint: "Reduced frontend initial load times by 42% through implementation of route-based lazy loading, code-splitting, and asset optimizations using [Skill1]."
      },
      {
        question: "Did you build reusable frontend components with [Skill1]?",
        upgradedPoint: "Engineered a modular, accessible UI component library using [Skill1], reducing overall project development time by 30% for 3 product squads."
      },
      {
        question: "Did you convert design mockups into layouts using [Skill2]?",
        upgradedPoint: "Translated complex Figma wireframes into responsive, high-performance web interfaces using [Skill2], ensuring pixel-perfect browser compatibility."
      }
    ]
  },
  // --- BACKEND DEVELOPER ---
  {
    keywords: ["backend", "back end", "node", "python dev", "java", "api", "database", "golang"],
    questions: [
      {
        question: "Did you build or redesign backend architecture using [Skill2]?",
        upgradedPoint: "Spearheaded the migration of legacy monolithic endpoints to a robust microservices architecture using [Skill2], increasing server scalability by 150%."
      },
      {
        question: "Did you optimize complex database queries or schemas using [Skill3]?",
        upgradedPoint: "Redesigned relational database schemas and optimized indexed queries in [Skill3], reducing average API response latency by 35%."
      },
      {
        question: "Did you design secure RESTful or GraphQL APIs with [Skill2]?",
        upgradedPoint: "Architected and documented secure REST/GraphQL API contracts using [Skill2], facilitating seamless integration for mobile clients."
      }
    ]
  },
  // --- DEVOPS & INFRASTRUCTURE ---
  {
    keywords: ["devops", "cloud", "aws", "docker", "kubernetes", "ci/cd", "infrastructure", "sre"],
    questions: [
      {
        question: "Did you automate deployment pipelines using [Skill1]?",
        upgradedPoint: "Built custom automated CI/CD pipelines integrating [Skill1], reducing deployment cycle times from 3 days to under 15 minutes."
      },
      {
        question: "Did you manage cloud scaling or hosting using [Skill2]?",
        upgradedPoint: "Optimized infrastructure scaling parameters in [Skill2], reducing average cloud hosting overhead expenses by 22%."
      },
      {
        question: "Did you monitor server reliability or uptime with [Skill3]?",
        upgradedPoint: "Implemented proactive server metrics monitoring utilizing [Skill3], securing a 99.9% application uptime record."
      }
    ]
  },
  // --- GENERAL DEVELOPER / SOFTWARE ENGINEER ---
  {
    keywords: ["developer", "dev", "software", "engineer", "coder", "programmer"],
    questions: [
      {
        question: "Did you resolve complex technical bugs using [Skill1]?",
        upgradedPoint: "Debugged and patched critical workflow blockages utilizing [Skill1], increasing system execution stability by 20%."
      },
      {
        question: "Did you integrate third-party payment gateways or APIs using [Skill2]?",
        upgradedPoint: "Designed and integrated secure payment processors and third-party webhooks in [Skill2], handling 120k+ monthly transaction events seamlessly."
      },
      {
        question: "Did you coordinate technical sprints or sprint plans using [Skill3]?",
        upgradedPoint: "Managed technical delivery timelines and code reviews using [Skill3] frameworks, raising sprint velocity by 25%."
      }
    ]
  },
  // --- LEAD GENERATOR / OUTBOUND SALES ---
  {
    keywords: ["lead generator", "lead generation", "sales", "outbound", "outreach", "bizdev", "business development", "sdr", "bdr"],
    questions: [
      {
        question: "Did you identify prospective high-value leads using [Skill1]?",
        upgradedPoint: "Identified and qualified 250+ high-value corporate leads using [Skill1], expanding outbound sales pipeline value by 30%."
      },
      {
        question: "Did you orchestrate cold email outreach using [Skill2]?",
        upgradedPoint: "Orchestrated cold email and LinkedIn outreach campaigns leveraging [Skill2] tools, achieving a 22% book-rate conversion."
      },
      {
        question: "Did you close accounts or manage sales funnels using [Skill3]?",
        upgradedPoint: "Nurtured qualified client pipelines using [Skill3], closing deals that generated $45k in quarterly contract value."
      }
    ]
  },
  // --- DIGITAL MARKETING / SEO / ADS ---
  {
    keywords: ["marketing", "seo", "growth", "brand", "ads", "campaign", "social media", "content"],
    questions: [
      {
        question: "Did you manage digital campaigns or paid ad budgets using [Skill2]?",
        upgradedPoint: "Managed multi-channel digital campaigns leveraging [Skill2], achieving a record-high 4.2x ROAS (Return on Ad Spend) through audience targeting."
      },
      {
        question: "Did you optimize search engine optimization (SEO) using [Skill1]?",
        upgradedPoint: "Executed comprehensive on-page and off-page SEO strategies with [Skill1], driving a 130% YoY growth in organic search landing page traffic."
      },
      {
        question: "Did you launch targeted email marketing initiatives with [Skill3]?",
        upgradedPoint: "Structured segmented email outreach campaigns leveraging [Skill3], achieving a 26% open rate and raising sales conversion revenue by 19%."
      }
    ]
  },
  // --- PRODUCT MANAGER ---
  {
    keywords: ["product manager", "pm", "product analyst", "product owner"],
    questions: [
      {
        question: "Did you lead cross-functional product squads using [Skill2]?",
        upgradedPoint: "Facilitated agile alignment among design, engineering, and QA utilizing [Skill2], completing product milestones 2 weeks ahead of target schedule."
      },
      {
        question: "Did you design product roadmaps using [Skill1]?",
        upgradedPoint: "Managed prioritization of a 150-item roadmap backlog in [Skill1] using RICE scoring, boosting features delivery speed by 25%."
      },
      {
        question: "Did you conduct customer surveys or interviews using [Skill3]?",
        upgradedPoint: "Gathered actionable user feedback from 40+ client interviews using [Skill3], refining product requirements to lower user churn by 12%."
      }
    ]
  },
  // --- PROJECT MANAGER / SCRUM MASTER / OPERATIONS ---
  {
    keywords: ["project manager", "scrum master", "operations", "coordinator", "ops"],
    questions: [
      {
        question: "Did you streamline project workflows or operation speed using [Skill2]?",
        upgradedPoint: "Mapped out product operations workflows using [Skill2], identifying bottlenecks to reduce supply delivery lead times by 12%."
      },
      {
        question: "Did you track daily deliverables and task sprints using [Skill1]?",
        upgradedPoint: "Supervised project deliveries and sprint progress using [Skill1], ensuring 100% compliance with strict corporate deadlines."
      },
      {
        question: "Did you coordinate resource planning or budgets using [Skill3]?",
        upgradedPoint: "Administered project budget allocation spreadsheets and resource calendars using [Skill3], saving $20k in resource overlap overhead."
      }
    ]
  },
  // --- FOUNDER / CEO / ENTREPRENEUR ---
  {
    keywords: ["founder", "ceo", "co-founder", "entrepreneur", "chief"],
    questions: [
      {
        question: "Did you establish initial product strategy using [Skill1]?",
        upgradedPoint: "Defined core GTM strategies and MVP features utilizing [Skill1] blueprints, successfully acquiring 10k initial active trial users."
      },
      {
        question: "Did you close strategic B2B client partnerships using [Skill2]?",
        upgradedPoint: "Negotiated key commercial partnerships with 5 corporate distributors using [Skill2] pitches, boosting sales channel reach."
      },
      {
        question: "Did you manage initial business runways and capital with [Skill3]?",
        upgradedPoint: "Optimized operational budget spend in [Skill3], extending startup business runway by 6 months through lean management practices."
      }
    ]
  },
  // --- DESIGNER (UI/UX / VISUAL / GRAPHIC) ---
  {
    keywords: ["designer", "design", "ux", "ui", "creative", "graphic", "illustrator"],
    questions: [
      {
        question: "Did you create or scale a design system using [Skill1]?",
        upgradedPoint: "Created and published a centralized Figma design system in [Skill1], reducing design handoff cycles by 40% across 5 engineering squads."
      },
      {
        question: "Did you lead usability testing or user research using [Skill2]?",
        upgradedPoint: "Organized and analyzed usability test sessions using [Skill2] with 35+ users, leading to design iterations that improved signup flow conversion by 28%."
      },
      {
        question: "Did you design interactive high-fidelity prototypes in [Skill1]?",
        upgradedPoint: "Designed fully interactive, animated high-fidelity prototypes in [Skill1], accelerating stakeholder buy-in by 50%."
      }
    ]
  },
  // --- DATA ANALYST / DATA SCIENTIST ---
  {
    keywords: ["analyst", "data", "scientist", "science", "bi", "tableau", "statistics"],
    questions: [
      {
        question: "Did you build dashboards for strategic decision making using [Skill3]?",
        upgradedPoint: "Developed high-impact, interactive dashboards in [Skill3], enabling executives to visualize metrics that reduced operating costs by 15%."
      },
      {
        question: "Did you automate manual ETL or reporting pipelines using [Skill2]?",
        upgradedPoint: "Automated core data-extraction and ETL pipelines in [Skill2], saving team members 15+ hours of manual analysis every week."
      },
      {
        question: "Did you train or deploy predictive ML models with [Skill1]?",
        upgradedPoint: "Trained and deployed a gradient-boosted churn prediction model in [Skill1], achieving 93% accuracy in predicting customer renewal rates."
      }
    ]
  },
  // --- HR / TALENT ACQUISITION ---
  {
    keywords: ["recruiter", "hr", "talent", "human", "people", "onboarding"],
    questions: [
      {
        question: "Did you lead recruitment or sourcing using [Skill1]?",
        upgradedPoint: "Scaled talent sourcing pipelines using [Skill1], hiring 45+ technical and operations candidates, reducing overall cost-per-hire by 22%."
      },
      {
        question: "Did you revamp the onboarding program using [Skill2]?",
        upgradedPoint: "Designed an automated HRIS onboarding protocol using [Skill2], lowering new hire ramp-up time from 3 weeks to 1.5 weeks."
      },
      {
        question: "Did you run wellness or engagement initiatives using [Skill3]?",
        upgradedPoint: "Launched employee-centric recognition programs and tracked metrics via [Skill3], lowering corporate annual employee turnover metrics by 18%."
      }
    ]
  },
  // --- FINANCE / ACCOUNTING ---
  {
    keywords: ["finance", "accountant", "audit", "banking", "investment", "cpa", "cfa"],
    questions: [
      {
        question: "Did you build corporate financial models using [Skill1]?",
        upgradedPoint: "Constructed comprehensive financial models in [Skill1] to forecast cash flows, improving budget forecast accuracy to 98.2%."
      },
      {
        question: "Did you execute operational cost audits using [Skill2]?",
        upgradedPoint: "Conducted variance reviews of historical company spending using [Skill2] dashboards, identifying $120k in systemic operational savings."
      },
      {
        question: "Did you lead accounting compliance or GAAPs using [Skill3]?",
        upgradedPoint: "Administered internal corporate tax audits using [Skill3] systems, securing 100% compliance with local legal requirements and standard GAAP principles."
      }
    ]
  },
  // --- LAW / LEGAL ---
  {
    keywords: ["legal", "law", "lawyer", "counsel", "attorney", "compliance", "contracts"],
    questions: [
      {
        question: "Did you draft or negotiate corporate agreements using [Skill1]?",
        upgradedPoint: "Drafted and finalized 70+ commercial software licenses and service contracts using [Skill1] protocols, minimizing corporate legal liability."
      },
      {
        question: "Did you conduct legal due diligence using [Skill2]?",
        upgradedPoint: "Led corporate due diligence reviews using [Skill2] databases, identifying $50k in potential regulatory compliance liabilities."
      },
      {
        question: "Did you research case law or draft litigation briefs using [Skill3]?",
        upgradedPoint: "Researched and drafted legal memoranda using [Skill3], contributing to successful case arguments that resolved a business litigation dispute."
      }
    ]
  }
];

// Fallback universal questions per parent profession category
const UNIVERSAL_PROF_ACHIEVEMENT_REGISTRY: Record<string, AchievementQuestion[]> = {
  developer: [
    {
      question: "Did you resolve complex technical bugs using [Skill1]?",
      upgradedPoint: "Debugged and patched critical workflow blockages utilizing [Skill1], increasing system execution stability by 20%."
    },
    {
      question: "Did you integrate third-party payment gateways or APIs using [Skill2]?",
      upgradedPoint: "Designed and integrated secure payment processors and third-party webhooks in [Skill2], handling 120k+ monthly transaction events seamlessly."
    },
    {
      question: "Did you deploy code or set up pipelines using [SkillsCombined]?",
      upgradedPoint: "Built custom automated deployment and release pipelines integrating [SkillsCombined], reducing errors in production by 25%."
    }
  ],
  designer: [
    {
      question: "Did you create or scale a design system using [Skill1]?",
      upgradedPoint: "Created and published a centralized design system in [Skill1], reducing design handoff cycles by 40% across 5 engineering squads."
    },
    {
      question: "Did you design interactive high-fidelity prototypes in [Skill1]?",
      upgradedPoint: "Designed fully interactive, animated high-fidelity prototypes in [Skill1], accelerating stakeholder buy-in by 50%."
    }
  ],
  data: [
    {
      question: "Did you build dashboards for strategic decision making using [Skill3]?",
      upgradedPoint: "Developed high-impact, interactive dashboards in [Skill3], enabling executives to visualize metrics that reduced operating costs by 15%."
    },
    {
      question: "Did you automate manual ETL or reporting pipelines using [Skill2]?",
      upgradedPoint: "Automated core data-extraction and ETL pipelines in [Skill2], saving team members 15+ hours of manual analysis every week."
    }
  ],
  marketing: [
    {
      question: "Did you manage campaigns or ad budgets using [Skill2]?",
      upgradedPoint: "Managed multi-channel digital campaigns leveraging [Skill2], achieving a record-high 4.2x ROAS (Return on Ad Spend) through audience targeting."
    },
    {
      question: "Did you optimize search engine optimization (SEO) using [Skill1]?",
      upgradedPoint: "Executed comprehensive on-page and off-page SEO strategies with [Skill1], driving a 130% YoY growth in organic search landing page traffic."
    }
  ],
  mba: [
    {
      question: "Did you lead cross-functional product squads using [Skill2]?",
      upgradedPoint: "Facilitated agile alignment among design, engineering, and QA utilizing [Skill2], completing product milestones 2 weeks ahead of target schedule."
    },
    {
      question: "Did you draft a Go-To-Market (GTM) plan using [Skill1]?",
      upgradedPoint: "Conducted extensive competitive pricing analysis with [Skill1] to craft a GTM strategy, resulting in a successful market share capture of 8% in launch regions."
    }
  ],
  hr: [
    {
      question: "Did you lead recruitment or sourcing using [Skill1]?",
      upgradedPoint: "Scaled talent sourcing pipelines using [Skill1], hiring 45+ technical and operations candidates, reducing overall cost-per-hire by 22%."
    },
    {
      question: "Did you revamp the onboarding program using [Skill2]?",
      upgradedPoint: "Designed an automated HRIS onboarding protocol using [Skill2], lowering new hire ramp-up time from 3 weeks to 1.5 weeks."
    }
  ],
  finance: [
    {
      question: "Did you build corporate financial models using [Skill1]?",
      upgradedPoint: "Constructed comprehensive financial models in [Skill1] to forecast cash flows, improving budget forecast accuracy to 98.2%."
    },
    {
      question: "Did you execute operational cost audits using [Skill2]?",
      upgradedPoint: "Conducted variance reviews of historical company spending using [Skill2] dashboards, identifying $120k in systemic operational savings."
    }
  ],
  law: [
    {
      question: "Did you draft or negotiate corporate agreements using [Skill1]?",
      upgradedPoint: "Drafted and finalized 70+ commercial software licenses and service contracts using [Skill1] protocols, minimizing corporate legal liability."
    },
    {
      question: "Did you conduct legal due diligence using [Skill2]?",
      upgradedPoint: "Led corporate due diligence reviews using [Skill2] databases, identifying $50k in potential regulatory compliance liabilities."
    }
  ],
  general: [
    {
      question: "Did you coordinate team schedules or events using [Skill1]?",
      upgradedPoint: "Organized schedules and client logistics using [Skill1], decreasing scheduling conflicts by 35% and improving project turnaround times."
    },
    {
      question: "Did you streamline internal communication tools using [Skill2]?",
      upgradedPoint: "Consolidated team documentation files on [Skill2], increasing collaboration efficiency by 25%."
    }
  ]
};

const DEFAULT_PROFESSION_SKILLS: Record<string, string[]> = {
  developer: ['React', 'Node.js', 'SQL'],
  designer: ['Figma', 'Adobe Creative Suite', 'Sketch'],
  data: ['Python', 'SQL', 'Tableau'],
  marketing: ['SEO Tools', 'Google Ads', 'Mailchimp'],
  mba: ['Strategic Planning', 'Asana', 'Excel'],
  hr: ['HRIS Tools', 'ATS Systems', 'LinkedIn Recruiter'],
  finance: ['Excel', 'Bloomberg Terminal', 'ERP systems'],
  law: ['LexisNexis', 'Westlaw', 'DocuSign'],
  general: ['project tracking systems', 'communication tools', 'Office suite']
};

// Returns key matched sub-role category based on job title words
function getTargetCategory(professionCategory: string, title: string): string {
  const t = title.toLowerCase().trim();
  
  // Attempt to match against sub-role registry keywords first
  for (const entry of SUB_ROLE_ACHIEVEMENT_REGISTRY) {
    if (entry.keywords.some(kw => t.includes(kw))) {
      return entry.keywords[0]; // Returns a unique identifier represented by first keyword
    }
  }

  // Fallback to parent category mapping
  const p = (professionCategory || '').toLowerCase();
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

function substituteSkills(text: string, currentSkills: { name: string }[], category: string): string {
  const skillNames = currentSkills.map(s => s.name).filter(Boolean);
  
  // Normalize key for default skills fallback
  let defaultKey = 'general';
  if (category.includes('frontend') || category.includes('backend') || category.includes('developer') || category.includes('devops')) defaultKey = 'developer';
  else if (category.includes('designer') || category.includes('design')) defaultKey = 'designer';
  else if (category.includes('data') || category.includes('analyst')) defaultKey = 'data';
  else if (category.includes('marketing') || category.includes('lead')) defaultKey = 'marketing';
  else if (category.includes('product') || category.includes('project') || category.includes('mba') || category.includes('founder')) defaultKey = 'mba';
  else if (category.includes('hr') || category.includes('recruiter')) defaultKey = 'hr';
  else if (category.includes('finance') || category.includes('accountant')) defaultKey = 'finance';
  else if (category.includes('law') || category.includes('legal')) defaultKey = 'law';

  const defaults = DEFAULT_PROFESSION_SKILLS[defaultKey] || DEFAULT_PROFESSION_SKILLS['general'];
  
  const skill1 = skillNames[0] || defaults[0];
  const skill2 = skillNames[1] || defaults[1];
  const skill3 = skillNames[2] || defaults[2];
  
  const combined = skillNames.length >= 2
    ? `${skill1} and ${skill2}`
    : `${skill1}`;

  return text
    .replace(/\[Skill1\]/g, skill1)
    .replace(/\[Skill2\]/g, skill2)
    .replace(/\[Skill3\]/g, skill3)
    .replace(/\[SkillsCombined\]/g, combined);
}

export default function AchievementAssistant({
  jobTitle,
  professionCategory,
  currentSkills,
  currentDescription,
  onUpdateDescription
}: AchievementAssistantProps) {
  const [questions, setQuestions] = useState<AchievementQuestion[]>([]);
  const skillsHash = JSON.stringify(currentSkills);

  useEffect(() => {
    if (jobTitle && jobTitle.trim().length >= 3) {
      const targetKey = getTargetCategory(professionCategory, jobTitle);
      
      // Look for matched sub-role questions
      const matchedRegistry = SUB_ROLE_ACHIEVEMENT_REGISTRY.find(entry => entry.keywords[0] === targetKey);
      let selectedQuestions: AchievementQuestion[] = [];
      
      if (matchedRegistry) {
        selectedQuestions = matchedRegistry.questions;
      } else {
        // Fallback to universal parent category
        const parentKey = targetKey;
        selectedQuestions = UNIVERSAL_PROF_ACHIEVEMENT_REGISTRY[parentKey] || UNIVERSAL_PROF_ACHIEVEMENT_REGISTRY['general'];
      }
      
      // Shuffle questions to ensure uniqueness on each card
      const shuffled = [...selectedQuestions].sort(() => 0.5 - Math.random());
      
      // Substitute user-entered skills
      const processedQuestions = shuffled.slice(0, 3).map(item => ({
        question: substituteSkills(item.question, currentSkills, targetKey),
        upgradedPoint: substituteSkills(item.upgradedPoint, currentSkills, targetKey)
      }));

      setQuestions(processedQuestions);
    } else {
      setQuestions([]);
    }
  }, [jobTitle, professionCategory, skillsHash]);

  // Hide entirely if the job title isn't filled in yet to avoid cluttering the UI initially
  if (!jobTitle || jobTitle.trim().length < 3 || questions.length === 0) {
    return null;
  }

  const handleAddAchievement = (point: string) => {
    const formatted = `• ${point}`;
    const newDesc = currentDescription.trim() 
      ? `${currentDescription}\n${formatted}`
      : formatted;
    onUpdateDescription(newDesc);
  };

  return (
    <div className="mt-4 pt-3 border-t border-warm-border">
      <span className="text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <Trophy size={11} className="text-amber-500" />
        Interactive Achievement Enhancer
      </span>
      <p className="text-[9px] text-primary-light mb-2">
        Click a question about your role as <span className="font-semibold text-brand">"{jobTitle}"</span> to instantly insert a quantified, high-impact bullet point:
      </p>
      <div className="flex flex-col gap-1.5">
        {questions.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleAddAchievement(item.upgradedPoint)}
            className="flex items-start text-left gap-2 px-3 py-2 rounded-lg bg-emerald-50/50 border border-emerald-100 hover:border-emerald-300 text-emerald-900 hover:bg-emerald-50 transition-all text-[10.5px] font-medium group"
          >
            <HelpCircle size={13} className="shrink-0 mt-0.5 text-emerald-600 group-hover:scale-110 transition-transform" />
            <div className="flex-1">
              <span className="text-primary hover:text-emerald-900 transition-colors">{item.question}</span>
              <div className="text-[9.5px] text-emerald-700/80 italic mt-0.5 group-hover:text-emerald-800 transition-colors font-normal font-sans">
                Upgrade → "{item.upgradedPoint.slice(0, 70)}..."
              </div>
            </div>
            <Plus size={12} className="shrink-0 mt-1 text-emerald-600 font-bold" />
          </button>
        ))}
      </div>
    </div>
  );
}
