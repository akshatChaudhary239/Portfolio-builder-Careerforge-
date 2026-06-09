/**
 * skills-parser.ts — Phase 7: Skills Extraction
 * Profession-aware dictionary matching. No AI required.
 */

import { ProfessionCategory } from '@/db/local-db';

const SKILL_DICTIONARIES: Record<ProfessionCategory, string[]> = {
  Developer: [
    'JavaScript','TypeScript','Python','Java','C++','C#','Go','Rust','PHP','Ruby','Swift','Kotlin',
    'React','Next.js','Vue','Angular','Svelte','Node.js','Express','NestJS','FastAPI','Django','Flask',
    'Spring Boot','Laravel','Rails','GraphQL','REST','gRPC','WebSockets',
    'PostgreSQL','MySQL','MongoDB','Redis','SQLite','Elasticsearch','DynamoDB','Cassandra','Supabase',
    'Docker','Kubernetes','AWS','GCP','Azure','Terraform','CI/CD','GitHub Actions','Jenkins',
    'Git','Linux','Nginx','Apache','Webpack','Vite',
    'HTML','CSS','TailwindCSS','SASS','Figma',
    'Jest','Cypress','Playwright','Vitest','Mocha',
    'Machine Learning','TensorFlow','PyTorch','scikit-learn','OpenAI API',
    'Agile','Scrum','Microservices','System Design','Data Structures','Algorithms',
  ],
  Designer: [
    'Figma','Sketch','Adobe XD','InVision','Zeplin','Framer',
    'Photoshop','Illustrator','After Effects','Premiere Pro','InDesign','Lightroom',
    'Blender','Cinema 4D','SketchUp','AutoCAD',
    'UI Design','UX Design','Product Design','Interaction Design','Visual Design',
    'Wireframing','Prototyping','User Research','Usability Testing','A/B Testing',
    'Design Systems','Typography','Color Theory','Grid Systems','Accessibility','WCAG',
    'Design Thinking','Information Architecture','User Journeys','Personas',
    'Motion Design','Brand Identity','Logo Design','Storyboarding','Design Sprints',
  ],
  'Data Analyst': [
    'Python','R','SQL','MATLAB','SAS','Scala','Julia',
    'Pandas','NumPy','SciPy','Matplotlib','Seaborn','Plotly',
    'scikit-learn','TensorFlow','PyTorch','Keras','XGBoost','LightGBM',
    'Tableau','Power BI','Looker','Metabase','Grafana',
    'Jupyter','Google Colab','Databricks','Snowflake','BigQuery','Redshift',
    'Excel','VBA','Google Sheets','DAX','MDX',
    'Statistics','Regression','Classification','Clustering','NLP','Computer Vision',
    'A/B Testing','Hypothesis Testing','Bayesian Analysis','Time Series',
    'ETL','Data Pipelines','Airflow','dbt','Spark','Hadoop',
    'Machine Learning','Feature Engineering','Model Evaluation','Cross Validation',
  ],
  'MBA / Business': [
    'Strategy','Business Analysis','Financial Modeling','Market Research','Competitive Analysis',
    'P&L Management','Revenue Operations','Business Development','Go-to-Market',
    'Product Management','Product Strategy','Roadmapping','OKRs','KPIs',
    'Project Management','Stakeholder Management','Change Management','Risk Management',
    'Excel','PowerPoint','SQL','Tableau','Power BI',
    'Agile','Scrum','Lean','Six Sigma','PMP',
    'Operations','Supply Chain','Logistics','Procurement','Vendor Management',
    'CRM','Salesforce','HubSpot','SAP','ERP Systems',
    'Consulting','Due Diligence','Mergers & Acquisitions','Valuation','DCF',
    'Fundraising','Investor Relations','Pitch Decks',
  ],
  Marketing: [
    'SEO','SEM','PPC','Google Ads','Facebook Ads','LinkedIn Ads','TikTok Ads',
    'Content Marketing','Email Marketing','Social Media Marketing','Influencer Marketing',
    'Growth Hacking','Demand Generation','Lead Generation','Account Based Marketing',
    'Brand Strategy','Copywriting','Content Strategy',
    'Google Analytics','HubSpot','Marketo','Mailchimp','Salesforce','CRM',
    'Marketing Automation','A/B Testing','Conversion Rate Optimization',
    'Product Marketing','Market Research','Positioning','PR','Media Relations',
    'WordPress','Webflow','Shopify','Adobe Creative Suite','Canva',
  ],
  Law: [
    'Legal Research','Contract Drafting','Contract Review','Case Analysis','Legal Writing',
    'Litigation','Civil Litigation','Criminal Law','Corporate Law','Commercial Law',
    'Intellectual Property','Patent Law','Trademark','Copyright',
    'Employment Law','Labor Law','Regulatory Compliance','Compliance',
    'Mergers & Acquisitions','Due Diligence','Corporate Governance',
    'Family Law','Arbitration','Mediation','Alternative Dispute Resolution',
    'Tax Law','International Law','Immigration Law',
    'Westlaw','LexisNexis','Clio','E-discovery','Legal Technology',
  ],
  HR: [
    'Talent Acquisition','Recruiting','Full Cycle Recruiting','Executive Search',
    'HR Business Partner','Employee Relations','Performance Management',
    'Learning & Development','Training','Onboarding','Offboarding',
    'Compensation & Benefits','Total Rewards','Payroll','HRIS',
    'Workday','BambooHR','SAP SuccessFactors','ADP','Greenhouse','Lever',
    'Organizational Development','Change Management','Culture',
    'Diversity & Inclusion','DEI','Employer Branding',
    'Labor Law','Employment Law','EEO','Workforce Planning','HR Analytics',
    'Conflict Resolution','Mediation','Coaching','Mentoring',
  ],
  Finance: [
    'Financial Modeling','Valuation','DCF','LBO','M&A','Due Diligence',
    'Financial Analysis','Budget Management','Forecasting','Financial Planning',
    'Accounting','GAAP','IFRS','Audit','Tax',
    'Investment Banking','Private Equity','Venture Capital','Hedge Fund',
    'Portfolio Management','Asset Management','Equity Research',
    'Derivatives','Fixed Income','Options','Futures','Risk Management',
    'Bloomberg','FactSet','Capital IQ',
    'Excel','VBA','SQL','Python','R','Tableau',
    'CFA','CPA','ACCA','FRM','Series 7',
    'Treasury','Cash Management','Credit Analysis','Loan Underwriting',
  ],
  'General Professional': [
    'Project Management','Program Management','Operations','Process Improvement',
    'Strategic Planning','Business Analysis','Stakeholder Management',
    'Data Analysis','Reporting','Dashboard','KPIs','OKRs',
    'Communication','Presentation','Public Speaking','Leadership',
    'Team Management','Coaching','Mentoring','Collaboration',
    'Microsoft Office','Excel','PowerPoint','Word','Outlook',
    'Google Workspace','Notion','Slack','Trello','Asana','Jira',
    'Customer Service','Client Management','Account Management',
    'Research','Documentation','Policy','Compliance',
    'Agile','Scrum','Lean','Change Management','Risk Management',
  ],
};

/**
 * Extracts skills using profession-aware dictionary matching.
 * Searches the skills section first, then falls back to full text.
 */
export function extractSkills(
  skillsSectionLines: string[],
  category: ProfessionCategory,
  fullText: string
): string[] {
  const dict = SKILL_DICTIONARIES[category] ?? SKILL_DICTIONARIES['General Professional'];
  // Prefer section text; if skills section is tiny, also scan full text
  const sectionText = skillsSectionLines.join(' ');
  const searchText = sectionText.length > 30 ? sectionText : fullText;

  const found: string[] = [];
  for (const skill of dict) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(?:^|[\\s,/|•\\-:(\n])${escaped}(?:[\\s,/|•\\-:.\n)]|$)`, 'im');
    if (re.test(searchText)) found.push(skill);
  }

  return [...new Set(found)];
}
