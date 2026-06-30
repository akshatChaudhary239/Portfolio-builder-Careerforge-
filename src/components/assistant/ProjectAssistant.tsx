import React, { useState, useEffect } from 'react';
import { Sparkles, HelpCircle, Plus } from 'lucide-react';

interface ProjectQuestion {
  question: string;
  upgradedPoint: string;
}

interface ProjectAssistantProps {
  projectTitle: string;
  professionCategory: string;
  currentSkills: { name: string }[];
  currentDescription: string;
  onUpdateDescription: (newDescription: string) => void;
}

// Sub-role specific questions database for projects, mapped by keywords in project titles
const SUB_ROLE_PROJECT_REGISTRY: {
  keywords: string[];
  questions: ProjectQuestion[];
}[] = [
  // --- E-COMMERCE / WEB STORES ---
  {
    keywords: ["e-commerce", "ecommerce", "store", "shop", "marketplace", "retail"],
    questions: [
      {
        question: "Did you build user authentication using [Skill1]?",
        upgradedPoint: "Implemented secure OAuth2.0 authentication and authorization protocols in [Skill1] with JSON Web Tokens (JWT) for the e-commerce client logins."
      },
      {
        question: "Did you integrate payment gateways using [Skill2]?",
        upgradedPoint: "Integrated secure Stripe checkout gateways using [Skill2], configuring custom webhooks to update client transactions in real-time."
      },
      {
        question: "Did you construct a shopping cart/checkout flow using [Skill1]?",
        upgradedPoint: "Developed an interactive client-side shopping cart in [Skill1], reducing checkout completion friction by 18%."
      }
    ]
  },
  // --- REAL-TIME CHAT / COMMUNITY ---
  {
    keywords: ["chat", "messaging", "community", "social", "stream", "forum"],
    questions: [
      {
        question: "Did you build real-time communication features using [Skill2]?",
        upgradedPoint: "Integrated bi-directional messaging streams using WebSockets and [Skill2], raising active in-app user communication metrics by 25%."
      },
      {
        question: "Did you design user profile systems using [Skill1]?",
        upgradedPoint: "Built customizable user profiles and relational user relationship feeds in [Skill1], boosting community interactions."
      }
    ]
  },
  // --- DATA VISUALIZATION / LOOKER / DASHBOARDS ---
  {
    keywords: ["dashboard", "looker", "tableau", "visual", "tracker", "analytics"],
    questions: [
      {
        question: "Did you create marketing/financial KPI dashboards in [Skill3]?",
        upgradedPoint: "Developed interactive dashboards in [Skill3], enabling teams to trace sales pipeline performance and customer acquisition metrics live."
      },
      {
        question: "Did you clean or prepare data files using [Skill1]?",
        upgradedPoint: "Automated large dataset parsing and normalization using [Skill1] scripts, reducing database upload noise by 30%."
      }
    ]
  },
  // --- MACHINE LEARNING / ALGORITHMS ---
  {
    keywords: ["prediction", "model", "analysis", "algorithm", "ml", "ai"],
    questions: [
      {
        question: "Did you train or deploy predictive models using [Skill1]?",
        upgradedPoint: "Trained and deployed a gradient-boosted forecast algorithm in [Skill1], achieving 93% accuracy in predicting customer churn."
      },
      {
        question: "Did you wrap and deploy the ML model as a container using [Skill2]?",
        upgradedPoint: "Containerized the predictive machine learning model using [Skill2] tools to serve live inference calls."
      }
    ]
  },
  // --- DESIGN SYSTEMS / BRANDING ---
  {
    keywords: ["brand", "identity", "design system", "guidelines", "typography"],
    questions: [
      {
        question: "Did you build a typography/color token system using [Skill1]?",
        upgradedPoint: "Curated a comprehensive typography and color token framework in [Skill1], raising design-to-development handoff speed by 35%."
      },
      {
        question: "Did you establish logo guidelines using [Skill2]?",
        upgradedPoint: "Developed cohesive brand visual manuals and vector asset kits in [Skill2], standardizing style guidelines across 3 products."
      }
    ]
  },
  // --- OUTBOUND CAMPAIGNS / LEAD GENERATION ---
  {
    keywords: ["campaign", "lead generation", "sales", "outbound", "outreach", "funnel"],
    questions: [
      {
        question: "Did you configure conversion analytics funnels using [Skill1]?",
        upgradedPoint: "Configured custom analytics conversion funnels with [Skill1], highlighting user drop-off nodes to optimize onboarding by 15%."
      },
      {
        question: "Did you craft and run A/B testing variations using [Skill2]?",
        upgradedPoint: "Created 15 variations of creative copies for A/B split-testing using [Skill2], raising average click-through rate (CTR) by 24%."
      },
      {
        question: "Did you launch targeted email marketing initiatives with [Skill3]?",
        upgradedPoint: "Structured segmented email outreach campaigns leveraging [Skill3], achieving a 26% open rate and raising sales conversion revenue by 19%."
      }
    ]
  },
  // --- STRATEGY & BUSINESS PLANS ---
  {
    keywords: ["strategy", "market entry", "business plan", "gtm", "pitch deck"],
    questions: [
      {
        question: "Did you model strategic financial projections using [Skill3]?",
        upgradedPoint: "Calculated 3-year cash flow projections and NPV values using [Skill3], assisting company leadership in capital allocation planning."
      },
      {
        question: "Did you audit competitors or market conditions using [Skill1]?",
        upgradedPoint: "Executed competitive analyses using [Skill1] on 5 market competitors to outline target regions, capturing an 8% increase in market share."
      },
      {
        question: "Did you coordinate project decks or pitches using [Skill2]?",
        upgradedPoint: "Authored corporate investor-facing GTM strategy plans using [Skill2], aligning goals for seed funding reviews."
      }
    ]
  }
];

// Fallback universal questions per parent profession category
const UNIVERSAL_PROJECT_REGISTRY: Record<string, ProjectQuestion[]> = {
  developer: [
    {
      question: "Did you build user authentication using [Skill1]?",
      upgradedPoint: "Implemented secure OAuth2.0 authentication and authorization protocols in [Skill1] with JSON Web Tokens (JWT)."
    },
    {
      question: "Did you optimize database load times using [Skill3]?",
      upgradedPoint: "Redesigned relational query indexes and optimized slow joins using [Skill3] configurations, reducing catalog response times by 40%."
    }
  ],
  designer: [
    {
      question: "Did you build a typography/color token system using [Skill1]?",
      upgradedPoint: "Curated a comprehensive typography and color token framework in [Skill1], raising design-to-development handoff speed by 35%."
    },
    {
      question: "Did you design interactive high-fidelity prototypes in [Skill1]?",
      upgradedPoint: "Designed fully interactive, animated high-fidelity prototypes in [Skill1], accelerating stakeholder buy-in by 50%."
    }
  ],
  data: [
    {
      question: "Did you clean or prepare data files using [Skill1]?",
      upgradedPoint: "Automated large dataset parsing and normalization using [Skill1] scripts, reducing database upload noise by 30%."
    },
    {
      question: "Did you create marketing/financial KPI dashboards in [Skill3]?",
      upgradedPoint: "Developed interactive dashboards in [Skill3], enabling teams to trace sales pipeline performance and customer acquisition metrics live."
    }
  ],
  marketing: [
    {
      question: "Did you configure conversion analytics funnels using [Skill1]?",
      upgradedPoint: "Configured custom analytics conversion funnels with [Skill1], highlighting user drop-off nodes to optimize onboarding by 15%."
    },
    {
      question: "Did you craft and run A/B testing variations using [Skill2]?",
      upgradedPoint: "Created 15 variations of creative copies for A/B split-testing using [Skill2], raising average click-through rate (CTR) by 24%."
    }
  ],
  mba: [
    {
      question: "Did you model strategic financial projections using [Skill3]?",
      upgradedPoint: "Calculated 3-year cash flow projections and NPV values using [Skill3], assisting company leadership in capital allocation planning."
    },
    {
      question: "Did you audit competitors or market conditions using [Skill1]?",
      upgradedPoint: "Executed competitive analyses using [Skill1] on 5 market competitors to outline target regions, capturing an 8% increase in market share."
    }
  ],
  general: [
    {
      question: "Did you plan execution steps using [Skill1]?",
      upgradedPoint: "Structured task lists and sprint targets using [Skill1], ensuring project milestones were completed within budget."
    },
    {
      question: "Did you align stakeholders using [Skill2]?",
      upgradedPoint: "Facilitated project status meetings using [Skill2] across 4 internal departments, maintaining project delivery alignment."
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

// Normalizes and returns key matched category based on project title
function getTargetCategory(professionCategory: string, title: string): string {
  const t = title.toLowerCase().trim();
  
  // Try matching project title against sub-role keywords first
  for (const entry of SUB_ROLE_PROJECT_REGISTRY) {
    if (entry.keywords.some(kw => t.includes(kw))) {
      return entry.keywords[0]; // returns unique identifier key
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
  
  // Find default skills key
  let defaultKey = 'general';
  if (category.includes('commerce') || category.includes('chat') || category.includes('developer') || category.includes('dev')) defaultKey = 'developer';
  else if (category.includes('design') || category.includes('brand')) defaultKey = 'designer';
  else if (category.includes('data') || category.includes('dashboard') || category.includes('model') || category.includes('prediction')) defaultKey = 'data';
  else if (category.includes('campaign') || category.includes('marketing')) defaultKey = 'marketing';
  else if (category.includes('strategy') || category.includes('mba') || category.includes('project')) defaultKey = 'mba';
  else if (category.includes('hr')) defaultKey = 'hr';
  else if (category.includes('finance')) defaultKey = 'finance';
  else if (category.includes('law')) defaultKey = 'law';

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

export default function ProjectAssistant({
  projectTitle,
  professionCategory,
  currentSkills,
  currentDescription,
  onUpdateDescription
}: ProjectAssistantProps) {
  const [questions, setQuestions] = useState<ProjectQuestion[]>([]);
  const skillsHash = JSON.stringify(currentSkills);

  useEffect(() => {
    if (projectTitle && projectTitle.trim().length >= 3) {
      const targetKey = getTargetCategory(professionCategory, projectTitle);
      
      // Look for matched sub-role project questions
      const matchedRegistry = SUB_ROLE_PROJECT_REGISTRY.find(entry => entry.keywords[0] === targetKey);
      let selectedQuestions: ProjectQuestion[] = [];
      
      if (matchedRegistry) {
        selectedQuestions = matchedRegistry.questions;
      } else {
        // Fallback to universal parent category
        const parentKey = targetKey;
        selectedQuestions = UNIVERSAL_PROJECT_REGISTRY[parentKey] || UNIVERSAL_PROJECT_REGISTRY['general'];
      }
      
      // Shuffle questions to ensure uniqueness on each card
      const shuffled = [...selectedQuestions].sort(() => 0.5 - Math.random());
      
      const processedQuestions = shuffled.slice(0, 3).map(item => ({
        question: substituteSkills(item.question, currentSkills, targetKey),
        upgradedPoint: substituteSkills(item.upgradedPoint, currentSkills, targetKey)
      }));

      setQuestions(processedQuestions);
    } else {
      setQuestions([]);
    }
  }, [projectTitle, professionCategory, skillsHash]);

  // Hide entirely if the project title isn't filled in yet to avoid cluttering the UI initially
  if (!projectTitle || projectTitle.trim().length < 3 || questions.length === 0) {
    return null;
  }

  const handleAddSuggestion = (point: string) => {
    const formatted = `• ${point}`;
    const newDesc = currentDescription.trim() 
      ? `${currentDescription}\n${formatted}`
      : formatted;
    onUpdateDescription(newDesc);
  };

  return (
    <div className="mt-4 pt-3 border-t border-warm-border">
      <span className="text-[10px] font-semibold text-primary-light uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <Sparkles size={11} className="text-teal-500" />
        Interactive Project Feature Enhancer
      </span>
      <p className="text-[9px] text-primary-light mb-2">
        Click a key question about your project <span className="font-semibold text-brand">"{projectTitle}"</span> to instantly insert a quantified, high-impact detail:
      </p>
      <div className="flex flex-col gap-1.5">
        {questions.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleAddSuggestion(item.upgradedPoint)}
            className="flex items-start text-left gap-2 px-3 py-2 rounded-lg bg-teal-50/50 border border-teal-100 hover:border-teal-300 text-teal-900 hover:bg-teal-50 transition-all text-[10.5px] font-medium group"
          >
            <HelpCircle size={13} className="shrink-0 mt-0.5 text-teal-600 group-hover:scale-110 transition-transform" />
            <div className="flex-1">
              <span className="text-primary hover:text-teal-900 transition-colors">{item.question}</span>
              <div className="text-[9.5px] text-teal-700/80 italic mt-0.5 group-hover:text-teal-800 transition-colors font-normal">
                Upgrade → "{item.upgradedPoint.slice(0, 70)}..."
              </div>
            </div>
            <Plus size={12} className="shrink-0 mt-1 text-teal-600 font-bold" />
          </button>
        ))}
      </div>
    </div>
  );
}
