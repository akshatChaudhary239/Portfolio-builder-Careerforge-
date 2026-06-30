export interface ProfessionRegistryEntry {
  id: string;
  label: string;
  suggestedSkills: string[];
  suggestedCertifications: string[];
  suggestedTools: string[];
  suggestedTechnologies: string[];
  suggestedAchievements: string[];
  suggestedKeywords: string[]; // for ATS detection
}

export const PROFESSION_REGISTRY: Record<string, ProfessionRegistryEntry> = {
  developer: {
    id: "developer",
    label: "Developer",
    suggestedSkills: ["System Design", "API Development", "Database Management", "CI/CD", "Agile Methodologies"],
    suggestedCertifications: ["AWS Certified Developer", "Google Cloud Professional Developer", "Certified Kubernetes Administrator"],
    suggestedTools: ["Git", "Docker", "Kubernetes", "Jira", "Jenkins"],
    suggestedTechnologies: ["React", "Node.js", "TypeScript", "PostgreSQL", "Next.js", "Python"],
    suggestedAchievements: [
      "Reduced application load time by 40%",
      "Led migration of monolithic architecture to microservices",
      "Mentored 3 junior developers to mid-level roles"
    ],
    suggestedKeywords: ["frontend", "backend", "full-stack", "scalability", "RESTful API", "GraphQL", "microservices"]
  },
  designer: {
    id: "designer",
    label: "Designer",
    suggestedSkills: ["UI/UX Design", "Wireframing", "Prototyping", "User Research", "Interaction Design"],
    suggestedCertifications: ["Google UX Design Professional Certificate", "Nielsen Norman Group UX Certification"],
    suggestedTools: ["Figma", "Sketch", "Adobe XD", "InVision", "Framer"],
    suggestedTechnologies: ["HTML", "CSS", "TailwindCSS"],
    suggestedAchievements: [
      "Increased user retention by 25% through UX redesign",
      "Established company-wide design system used by 5 product teams",
      "Conducted 50+ user interviews to drive product strategy"
    ],
    suggestedKeywords: ["user-centered design", "usability testing", "accessibility", "visual design", "design thinking"]
  },
  data_analyst: {
    id: "data_analyst",
    label: "Data Analyst",
    suggestedSkills: ["Data Mining", "Statistical Analysis", "Data Visualization", "A/B Testing", "Predictive Modeling"],
    suggestedCertifications: ["Google Data Analytics Professional Certificate", "Microsoft Certified: Data Analyst Associate"],
    suggestedTools: ["Tableau", "Power BI", "Excel", "Jupyter", "Looker"],
    suggestedTechnologies: ["SQL", "Python", "R", "Pandas", "Snowflake"],
    suggestedAchievements: [
      "Identified $100k in cost savings through operational data analysis",
      "Automated weekly reporting, saving 15 hours of manual work per week",
      "Built interactive dashboards adopted by C-level executives"
    ],
    suggestedKeywords: ["business intelligence", "ETL", "machine learning", "data modeling", "quantitative analysis"]
  },
  marketing: {
    id: "marketing",
    label: "Marketing",
    suggestedSkills: ["SEO/SEM", "Content Strategy", "Campaign Management", "Social Media Marketing", "Email Marketing"],
    suggestedCertifications: ["Google Ads Certification", "HubSpot Content Marketing Certification", "Facebook Blueprint"],
    suggestedTools: ["Google Analytics", "HubSpot", "Mailchimp", "Hootsuite", "Ahrefs"],
    suggestedTechnologies: ["WordPress", "Webflow", "Shopify"],
    suggestedAchievements: [
      "Grew organic website traffic by 150% YoY",
      "Managed $500k annual ad spend with 3.5x ROAS",
      "Launched successful rebranding campaign reaching 1M+ users"
    ],
    suggestedKeywords: ["conversion rate optimization", "brand awareness", "B2B", "B2C", "market research"]
  },
  mba: {
    id: "mba",
    label: "MBA / Business",
    suggestedSkills: ["Strategic Planning", "Financial Modeling", "Operations Management", "Business Development", "Project Management"],
    suggestedCertifications: ["PMP", "Certified ScrumMaster (CSM)", "Six Sigma Green Belt"],
    suggestedTools: ["Salesforce", "Asana", "Monday.com", "Notion", "Miro"],
    suggestedTechnologies: ["ERP Systems", "CRM Platforms"],
    suggestedAchievements: [
      "Negotiated vendor contracts resulting in 15% cost reduction",
      "Led cross-functional team of 20 to deliver flagship product ahead of schedule",
      "Developed go-to-market strategy for new regional expansion"
    ],
    suggestedKeywords: ["leadership", "P&L responsibility", "stakeholder management", "KPI tracking", "process improvement"]
  },
  hr: {
    id: "hr",
    label: "HR",
    suggestedSkills: ["Talent Acquisition", "Employee Relations", "HRIS Administration", "Performance Management", "Compliance"],
    suggestedCertifications: ["SHRM-CP", "PHR"],
    suggestedTools: ["Workday", "BambooHR", "LinkedIn Recruiter", "Lattice"],
    suggestedTechnologies: ["HRIS Platforms", "ATS Systems"],
    suggestedAchievements: [
      "Reduced employee turnover by 18% through engagement programs",
      "Managed full-cycle recruitment scaling team by 50+ members",
      "Implemented automated HRIS onboarding saving 10 hours weekly"
    ],
    suggestedKeywords: ["HRIS", "talent acquisition", "employee engagement", "performance management", "organizational development", "workforce planning"]
  },
  finance: {
    id: "finance",
    label: "Finance",
    suggestedSkills: ["Financial Analysis", "Forecasting", "Asset Management", "Risk Valuation", "Auditing"],
    suggestedCertifications: ["CFA", "CPA", "FRM"],
    suggestedTools: ["Excel", "Bloomberg Terminal", "QuickBooks", "SAP"],
    suggestedTechnologies: ["ERP Financials", "SQL"],
    suggestedAchievements: [
      "Optimized operational budget reducing annual overhead by 12%",
      "Engineered financial forecasting models with 98% prediction accuracy",
      "Supervised audit process achieving 100% compliance record"
    ],
    suggestedKeywords: ["financial analysis", "forecasting", "risk management", "regulatory compliance", "budget optimization", "portfolio management"]
  },
  law: {
    id: "law",
    label: "Law",
    suggestedSkills: ["Legal Research", "Contract Drafting", "Case Analysis", "Litigation Support", "Client Representation"],
    suggestedCertifications: ["Bar Admission Certificate"],
    suggestedTools: ["Westlaw", "LexisNexis", "Clio", "DocuSign"],
    suggestedTechnologies: [],
    suggestedAchievements: [
      "Drafted 200+ commercial contracts with zero liability issues",
      "Assisted senior counsel in winning complex corporate litigation disputes",
      "Authored 5 legal research publications on data privacy regulations"
    ],
    suggestedKeywords: ["legal research", "contract drafting", "litigation support", "compliance monitoring", "due diligence", "dispute resolution"]
  },
  general: {
    id: "general",
    label: "General Professional",
    suggestedSkills: ["Communication", "Problem Solving", "Time Management", "Team Collaboration", "Adaptability"],
    suggestedCertifications: ["Microsoft Office Specialist"],
    suggestedTools: ["Microsoft Office", "Google Workspace", "Slack", "Zoom", "Trello"],
    suggestedTechnologies: [],
    suggestedAchievements: [
      "Recognized as Employee of the Month for outstanding contribution",
      "Streamlined internal communication process across departments",
      "Successfully onboarded 10 new team members"
    ],
    suggestedKeywords: ["detail-oriented", "organized", "proactive", "customer-focused", "cross-functional"]
  }
};

export function getProfession(professionId: string): ProfessionRegistryEntry | undefined {
  const normalized = professionId.toLowerCase().trim();
  // Try direct ID match
  if (PROFESSION_REGISTRY[normalized]) {
    return PROFESSION_REGISTRY[normalized];
  }
  // Try matching by label
  return Object.values(PROFESSION_REGISTRY).find(
    p => p.label.toLowerCase() === normalized || p.id === normalized || normalized.includes(p.id)
  );
}

export function getAllProfessions(): ProfessionRegistryEntry[] {
  return Object.values(PROFESSION_REGISTRY);
}
