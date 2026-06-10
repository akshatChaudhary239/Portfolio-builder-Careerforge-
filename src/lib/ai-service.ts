import { ProfessionCategory, CareerProfile, InterviewQuestion, ProfessionalBlueprint, ProfileExtensions, WorkSampleEntry } from '@/db/local-db';
import { MODEL_CONFIG, CareerForgeError, devLog, buildOpenRouterRequest } from './model-config';
import { BalancedValidationLayer } from '@/components/premiumTemplates/balanced/ValidationLayer';
import { LeadershipValidationLayer } from '@/components/premiumTemplates/leadership/ValidationLayer';
import { QuestionnaireAnswers, getDynamicSections } from './blueprint-engine';
import { normalizeShowcaseItems } from './normalization-layer';
import { getShowcaseLabels } from './label-mapping';

// Types
export interface EnhancedResumeResult {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  skills: string[];
  education: {
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    grade?: string;
  }[];
  experience: {
    company: string;
    position: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    current: boolean;
    highlights: string[];
  }[];
  projects: {
    title: string;
    description: string;
    techStack?: string[];
    link?: string;
    highlights?: string[];
    problemSolved?: string;
    keyImpact?: string;
  }[];
  certifications: string[];
  achievements: string[];
  publications?: string[];
  workSamples?: { title: string; url?: string; description?: string }[];
}

export interface LeadershipResumeResult {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  website?: string;
  github?: string;
  linkedin?: string;
  leadershipProfile: string;
  leadershipHighlights: string[];
  coreStrengths: string[];
  education: {
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    grade?: string;
  }[];
  experience: {
    company: string;
    position: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    achievements: string[];
    leadershipSkills?: string;
  }[];
  projects: {
    title: string;
    role: string;
    overview: string;
    achievements: string[];
    technologies: string[];
    link?: string;
    github?: string;
  }[];
  certifications?: string[];
  achievements?: string[];
  professionalBlueprint?: ProfessionalBlueprint;
  extensions?: ProfileExtensions;
  publications?: string[];
  workSamples?: WorkSampleEntry[];
  professionCategory?: ProfessionCategory;
}

export interface BalancedResumeResult {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  website?: string;
  github?: string;
  linkedin?: string;
  professionalProfile: string;
  coreCompetencies: {
    technical: string[];
    leadership: string[];
  };
  education: {
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    grade?: string;
  }[];
  experience: {
    company: string;
    position: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    achievements: string[];
  }[];
  projects: {
    title: string;
    techStack?: string[];
    overview: string;
    achievements: string[];
    link?: string;
    github?: string;
  }[];
  certifications?: string[];
  achievements?: string[];
  professionalBlueprint?: ProfessionalBlueprint;
  extensions?: ProfileExtensions;
  publications?: string[];
  workSamples?: WorkSampleEntry[];
  professionCategory?: ProfessionCategory;
}

// ─────────────────────────────────────────────────────────────────────────────
// PARSING & API UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

async function callOpenRouterWithFailover(
  systemPrompt: string,
  userContent: string,
  apiKey: string
): Promise<string> {
  const models = [MODEL_CONFIG.PRIMARY_FREE_MODEL, MODEL_CONFIG.BACKUP_FREE_MODEL];

  for (const model of models) {
    try {
      devLog(`Attempting model: ${model}`);
      const requestOptions = buildOpenRouterRequest(model, systemPrompt, userContent, apiKey);
      const response = await fetch(MODEL_CONFIG.OPENROUTER_BASE_URL, requestOptions);

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new CareerForgeError(
          'MODEL_ERROR',
          `Model ${model} returned HTTP ${response.status}: ${errText}`,
        );
      }

      const payload = await response.json();
      const rawContent = payload?.choices?.[0]?.message?.content?.trim();
      if (!rawContent) throw new CareerForgeError('MODEL_ERROR', `Empty response from model ${model}`);

      devLog(`Model ${model} succeeded`);
      return rawContent;
    } catch (err) {
      if (err instanceof CareerForgeError) {
        console.warn(`[GetProspectra] ${err.category}: ${err.message}. Trying next model...`);
      } else {
        console.warn(`[GetProspectra] NETWORK_ERROR calling ${model}:`, err);
      }
    }
  }

  throw new CareerForgeError('MODEL_ERROR', 'All AI models failed. Using local programmatic enhancement fallback.');
}

function parseJsonSafely<T>(raw: string, label: string): T | null {
  try {
    // Extract JSON block even if preceded by conversational text
    const startObj = raw.indexOf('{');
    const startArr = raw.indexOf('[');
    let startIndex = -1;
    let endIndex = -1;

    // Check if it's likely an object or an array
    if (startObj !== -1 && (startArr === -1 || startObj < startArr)) {
      startIndex = startObj;
      endIndex = raw.lastIndexOf('}');
    } else if (startArr !== -1) {
      startIndex = startArr;
      endIndex = raw.lastIndexOf(']');
    }

    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      const cleaned = raw.substring(startIndex, endIndex + 1);
      return JSON.parse(cleaned) as T;
    }

    // Fallback if no braces found
    const cleaned = raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();
    return JSON.parse(cleaned) as T;
  } catch (err) {
    console.error(`[GetProspectra] JSON_PARSE_ERROR in ${label}:`, err);
    console.error(`[GetProspectra] Raw content was:`, raw.slice(0, 500));
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LOCAL GENERATION FALLBACKS
// ─────────────────────────────────────────────────────────────────────────────

function localEnhanceProfile(careerProfile: CareerProfile, questionnaireAnswers: QuestionnaireAnswers): CareerProfile {
  const enhanced = { ...careerProfile };
  // Programmatic simple mapping of questionnaire answers if AI fails
  return enhanced;
}

function localGenerateInterviewQuestions(
  careerProfile: CareerProfile
): Omit<InterviewQuestion, 'id' | 'userId' | 'createdAt'>[] {
  const questions: Omit<InterviewQuestion, 'id' | 'userId' | 'createdAt'>[] = [];

  const blueprint = careerProfile.professionalBlueprint;
  const profession = (blueprint?.profession || careerProfile.professionCategory || 'developer').toLowerCase();
  const experienceLevel = (blueprint?.experienceLevel || 'mid').toLowerCase();
  const specialization = blueprint?.specialization || (careerProfile.skills?.[0]?.name) || 'Generalist';
  const primaryStrength = blueprint?.primaryStrength || 'adaptability';
  const careerGoal = blueprint?.careerGoal || 'professional growth';

  const normalizedProjects = normalizeShowcaseItems(careerProfile);
  const primaryProject = normalizedProjects?.[0]?.title || 'your core work';
  const showcaseLabels = getShowcaseLabels(careerProfile.professionCategory);
  const showcaseItemLabel = showcaseLabels.itemLabel.toLowerCase();
  
  const primaryCompany = careerProfile.experience?.[0]?.company || 'your workplace';

  const isDeveloper = profession.includes('developer') || profession.includes('data analyst') || profession.includes('tech');
  const isLawyer = profession.includes('law') || profession.includes('legal') || profession.includes('lawyer');
  const isDesigner = profession.includes('design') || profession.includes('designer');
  const isMarketing = profession.includes('marketing');

  if (isDeveloper) {
    // 5 Developer Technical Questions
    questions.push({
      question: `For your ${showcaseItemLabel} "${primaryProject}", how did you design the backend/frontend integration, and what were the main challenges you faced with System Design?`,
      type: 'technical',
      contextRef: primaryProject,
      suggestedPoints: [
        'What Recruiters Look For: Technical foresight, understanding of resource constraints, and API design principles.',
        'STAR Method Highlights: Describe the integration bottleneck (Situation), explain data synchronization limits (Task), discuss system architecture design (Action), list failure prevention safeguards (Result).',
        'Key Talking Points: REST/GraphQL API design, caching layer, or latency optimization.',
      ],
    });
    questions.push({
      question: `You specialize in "${specialization}". Can you explain a complex problem you solved using this technology, and how you ensured code quality and performance?`,
      type: 'technical',
      contextRef: specialization,
      suggestedPoints: [
        'What Recruiters Look For: Deep understanding of technical details and architectural trade-offs.',
        'STAR Method Highlights: Describe the technical challenge (Situation), define quality/performance goals (Task), implement best practices and testing (Action), detail performance improvements (Result).',
        'Key Talking Points: Framework internals, rendering performance, memory leaks, or type safety.',
      ],
    });
    questions.push({
      question: `If you had to scale "${primaryProject}" to support 100x traffic or concurrent users tomorrow, what part of the database or architecture would break first, and how would you fix it?`,
      type: 'technical',
      contextRef: primaryProject,
      suggestedPoints: [
        'What Recruiters Look For: Scalability concepts, database indexing, horizontal scaling, and load-balancing.',
        'STAR Method Highlights: Identify the primary bottleneck under load (Situation), target the scaling constraints (Task), propose indexing, replication, or load balancing (Action), secure 99.9% uptime (Result).',
        'Key Talking Points: Read/write replicas, Redis cache, horizontal pod autoscaling, or CDN caching.',
      ],
    });
    questions.push({
      question: `Describe your experience with ${specialization}. How do you decide between importing third-party libraries versus building custom solutions?`,
      type: 'technical',
      contextRef: 'Technical Stack',
      suggestedPoints: [
        'What Recruiters Look For: Dependency management, maintenance cost, and codebase optimization strategy.',
        'STAR Method Highlights: Outline a dependency debate (Situation), evaluate size, security, and maintenance (Task), write lightweight helper functions (Action), reduce bundle size and vulnerability risks (Result).',
        'Key Talking Points: Bundle size optimization, license risks, and security audits.',
      ],
    });
    questions.push({
      question: `How do you handle state management, data consistency, or security vulnerabilities in your applications, and what is your general strategy for testing these flows?`,
      type: 'technical',
      contextRef: 'Architecture',
      suggestedPoints: [
        'What Recruiters Look For: Race conditions handling, unit/integration testing, and security fundamentals.',
        'STAR Method Highlights: Define state requirement (Situation), choose local vs global state (Task), write unit/integration tests (Action), achieve bug-free secure execution (Result).',
        'Key Talking Points: Redux/Zustand, database transactions, OWASP Top 10, or Jest testing.',
      ],
    });
  } else if (isLawyer) {
    // 5 Lawyer Questions
    questions.push({
      question: `In your legal experience or studies, how do you handle complex ${specialization} or legal research challenges under tight deadlines?`,
      type: 'technical',
      contextRef: specialization,
      suggestedPoints: [
        'What Recruiters Look For: Meticulous attention to detail, contract drafting skills, and risk mitigation strategies.',
        'STAR Method Highlights: Highlight a complex contract or transaction (Situation), identify key risk clauses (Task), draft protective clauses and provisions (Action), close transaction with minimized liability (Result).',
        'Key Talking Points: Indemnification, liability caps, warranties, or jurisdiction clauses.',
      ],
    });
    questions.push({
      question: `Can you describe a time when you had to navigate a difficult legal ethics or compliance dilemma? How did you resolve it?`,
      type: 'technical',
      contextRef: 'Ethics',
      suggestedPoints: [
        'What Recruiters Look For: Integrity, professional ethics, compliance understanding, and conflict resolution.',
        'STAR Method Highlights: State the ethical/compliance conflict (Situation), identify applicable rules of professional conduct (Task), consult resources and communicate professionally (Action), achieve compliant and ethical resolution (Result).',
        'Key Talking Points: Client confidentiality, conflict of interest, regulatory compliance, or fiduciary duty.',
      ],
    });
    questions.push({
      question: `When conducting legal research, what databases and methods do you use to ensure your citations, arguments, and precedents are bulletproof?`,
      type: 'technical',
      contextRef: 'Research',
      suggestedPoints: [
        'What Recruiters Look For: Thorough legal research skills, familiarity with databases, and analytical rigor.',
        'STAR Method Highlights: Identify an ambiguous legal question (Situation), define search queries and keywords (Task), research via Westlaw/LexisNexis and verify citations (Action), draft a robust legal memo (Result).',
        'Key Talking Points: Westlaw, LexisNexis, citation checkers, or secondary sources.',
      ],
    });
    questions.push({
      question: `How do you approach drafting legal documents to protect client interests while maintaining transactional deal momentum?`,
      type: 'technical',
      contextRef: 'Legal Drafting',
      suggestedPoints: [
        'What Recruiters Look For: Drafting efficiency, clarity, client advocacy, and negotiation style.',
        'STAR Method Highlights: Identify client negotiation bottlenecks (Situation), draft clear and concise contract edits (Task), negotiate compromises with opposing counsel (Action), sign the contract on schedule (Result).',
        'Key Talking Points: Plain English drafting, contract markup, commercial compromises.',
      ],
    });
    questions.push({
      question: `Describe a time when you had to quickly master an unfamiliar area of law or regulatory framework for a case or client matter.`,
      type: 'technical',
      contextRef: 'Regulatory Compliance',
      suggestedPoints: [
        'What Recruiters Look For: Rapid learning capability, adaptability, and legal synthesis.',
        'STAR Method Highlights: Describe a case involving a novel regulatory topic (Situation), break down the regulatory text and guidance (Task), consult legal experts and treatises (Action), present actionable compliance advice (Result).',
        'Key Talking Points: Synthesis of regulatory text, compliance guidelines, or secondary legal sources.',
      ],
    });
  } else if (isDesigner) {
    // 5 Designer Questions
    questions.push({
      question: `For your ${showcaseItemLabel} "${primaryProject}", walk us through your design process from initial user research to final high-fidelity showcase.`,
      type: 'technical',
      contextRef: 'Design Process',
      suggestedPoints: [
        'What Recruiters Look For: Structured user-centric design methodologies, wireframing, and design iteration.',
        'STAR Method Highlights: State the design project goal (Situation), outline the user problem to solve (Task), conduct user research and iterate wireframes (Action), deliver a verified design showcase (Result).',
        'Key Talking Points: User personas, user flows, low-fidelity wireframes, UI kits, design systems.',
      ],
    });
    questions.push({
      question: `How do you approach user research and usability testing? Can you give an example of a design decision that was directly changed by user feedback?`,
      type: 'technical',
      contextRef: 'User Research',
      suggestedPoints: [
        'What Recruiters Look For: Empathy, research methods, usability metric tracking, and humility in iterating.',
        'STAR Method Highlights: Detail a design hypothesis (Situation), set up a usability testing protocol (Task), conduct user interviews and analyze heatmaps (Action), redesign layouts to improve conversion (Result).',
        'Key Talking Points: Usability testing, user interviews, heatmaps, user metrics, prototype testing.',
      ],
    });
    questions.push({
      question: `How do you balance creative visual aesthetics with web accessibility (WCAG guidelines) and functional UX constraints?`,
      type: 'technical',
      contextRef: 'Accessibility',
      suggestedPoints: [
        'What Recruiters Look For: Web accessibility standards, inclusive design, and design system constraints.',
        'STAR Method Highlights: Review a visually heavy layout (Situation), audit for color contrast and screen reader accessibility (Task), adjust contrast and design semantic layouts (Action), pass WCAG AAA standards (Result).',
        'Key Talking Points: Color contrast, semantic HTML layout, typography hierarchy, aria labels, keyboard navigation.',
      ],
    });
    questions.push({
      question: `How do you collaborate with developers and product managers to ensure your design files and design systems translate accurately to code?`,
      type: 'technical',
      contextRef: 'Collaboration',
      suggestedPoints: [
        'What Recruiters Look For: Team collaboration, handoff processes, design systems management, and technical understanding.',
        'STAR Method Highlights: Identify developer-design handoff friction (Situation), create component libraries and layout specs (Task), hold handoff walkthroughs and review staging builds (Action), build high-fidelity production matches (Result).',
        'Key Talking Points: Figma variables, tokens, developer handoff specs, design QA reviews.',
      ],
    });
    questions.push({
      question: `Tell us about a design critique where your work was heavily challenged. How did you handle the feedback and iterate on the design?`,
      type: 'technical',
      contextRef: 'Design Critique',
      suggestedPoints: [
        'What Recruiters Look For: Constructive feedback reception, collaborative iteration, and design rationale communication.',
        'STAR Method Highlights: Present designs in a peer critique (Situation), listen to conflicting feedback on layouts (Task), gather objective user data and adjust spacing/structure (Action), deliver approved designs with teammate alignment (Result).',
        'Key Talking Points: Active listening, design critiques, layout rationale, objective user data.',
      ],
    });
  } else if (isMarketing) {
    // 5 Marketing Questions
    questions.push({
      question: `For your marketing campaigns in ${specialization}, what were the primary metrics (like CAC, LTV, conversion rates) you tracked, and how did you measure success?`,
      type: 'technical',
      contextRef: 'Growth Metrics',
      suggestedPoints: [
        'What Recruiters Look For: Data-driven marketing approach, tracking metrics, and ROI calculation.',
        'STAR Method Highlights: State campaign budget and goals (Situation), define CAC and ROI targets (Task), launch paid/organic campaigns and track UTMs (Action), reduce CAC and achieve high ROI (Result).',
        'Key Talking Points: Customer Acquisition Cost (CAC), Lifetime Value (LTV), CTR, conversion rates, UTM tracking.',
      ],
    });
    questions.push({
      question: `Can you explain a time when you used ${specialization} or other digital marketing strategies to successfully drive a significant increase in organic traffic or leads?`,
      type: 'technical',
      contextRef: specialization,
      suggestedPoints: [
        'What Recruiters Look For: SEO expertise, content strategy, keyword research, and analytics tools.',
        'STAR Method Highlights: Audit low organic traffic ranking (Situation), conduct keyword research and optimize meta tags (Task), publish high-quality content and build backlinks (Action), rank in Google Top 3 and double organic traffic (Result).',
        'Key Talking Points: Keyword research, on-page optimization, search intent, domain authority, Google Analytics.',
      ],
    });
    questions.push({
      question: `When a campaign is underperforming, what is your step-by-step process to audit it, find the bottleneck, and optimize it for better ROI?`,
      type: 'technical',
      contextRef: 'Campaign Analytics',
      suggestedPoints: [
        'What Recruiters Look For: Analytical troubleshooting, A/B testing, and campaign optimization.',
        'STAR Method Highlights: Identify underperforming paid ad campaigns (Situation), isolate variables like copy, creative, or landing page conversion (Task), launch A/B tests and tweak targeting (Action), improve CTR and lower CPA (Result).',
        'Key Talking Points: A/B testing, landing page optimization, audience targeting, conversion funnel auditing.',
      ],
    });
    questions.push({
      question: `How do you balance creative storytelling and copywriting with data-driven analytics and marketing automation tools?`,
      type: 'technical',
      contextRef: 'Campaigns',
      suggestedPoints: [
        'What Recruiters Look For: Dual-minded marketing capability, balancing creativity with analytical tooling.',
        'STAR Method Highlights: Target a complex product value proposition (Situation), draft engaging email newsletter copies (Task), set up trigger-based automated workflows (Action), drive high engagement and subscription retention (Result).',
        'Key Talking Points: Email marketing, storytelling, Hubspot/Marketo automation, lead scoring.',
      ],
    });
    questions.push({
      question: `Describe a time you had to launch a campaign on a very tight budget. What creative hacks did you use to maximize growth?`,
      type: 'technical',
      contextRef: 'Growth',
      suggestedPoints: [
        'What Recruiters Look For: Resourcefulness, viral loop marketing, and creative hacking.',
        'STAR Method Highlights: Launch a product with low advertising budget (Situation), target organic referral channels (Task), build interactive calculators or referral loops (Action), trigger word-of-mouth signup growth (Result).',
        'Key Talking Points: Viral loops, product-led marketing, referral systems, social media engagement.',
      ],
    });
  } else {
    // 5 General/Finance Fallback Questions
    questions.push({
      question: `In your role at "${primaryCompany}", how do you manage quantitative data analysis, financial modeling, or ${specialization} challenges to support business decisions?`,
      type: 'technical',
      contextRef: specialization,
      suggestedPoints: [
        'What Recruiters Look For: Data literacy, structured reporting, and supporting decisions with quantitative modeling.',
        'STAR Method Highlights: Describe a major capital or resource decision (Situation), define data requirements and models (Task), analyze inputs and compile reports (Action), guide executive decisions safely (Result).',
        'Key Talking Points: Financial modeling, Excel forecasting, KPI dashboards, business intelligence.',
      ],
    });
    questions.push({
      question: `What is your process for auditing financial metrics, budgeting, or forecasting for a project or department?`,
      type: 'technical',
      contextRef: 'Budgeting & Forecasting',
      suggestedPoints: [
        'What Recruiters Look For: Fiscal responsibility, budgeting accuracy, and forecasting techniques.',
        'STAR Method Highlights: Address annual budget forecasting (Situation), identify cost drivers and historical runs (Task), build projection models with scenario analyses (Action), deliver a precise, balanced budget draft (Result).',
        'Key Talking Points: Variance analysis, zero-based budgeting, forecasting frameworks.',
      ],
    });
    questions.push({
      question: `How do you stay compliant with regulatory standards and financial audit requirements in your work?`,
      type: 'technical',
      contextRef: 'Regulatory Compliance',
      suggestedPoints: [
        'What Recruiters Look For: Compliance awareness, risk assessment, and standard operating procedures.',
        'STAR Method Highlights: Identify auditing requirements (Situation), create standard check-lists and reviews (Task), implement strict compliance protocols (Action), pass external audits with zero citations (Result).',
        'Key Talking Points: Auditing compliance, risk frameworks, internal controls, regulatory updates.',
      ],
    });
    questions.push({
      question: `Describe a time when you identified a cost-saving opportunity or revenue leak. How did you implement the solution?`,
      type: 'technical',
      contextRef: 'Cost Optimization',
      suggestedPoints: [
        'What Recruiters Look For: Operational efficiency, financial metrics tracking, and proactive optimization.',
        'STAR Method Highlights: Notice redundant vendor spending or fee leaks (Situation), analyze contract terms and usage data (Task), consolidate accounts and renegotiate terms (Action), reduce overhead expenses by a solid margin (Result).',
        'Key Talking Points: Operational cost reduction, vendor negotiations, overhead analysis.',
      ],
    });
    questions.push({
      question: `How do you present complex financial or quantitative analysis to non-technical stakeholders to drive strategic decisions?`,
      type: 'technical',
      contextRef: 'Stakeholder Communication',
      suggestedPoints: [
        'What Recruiters Look For: Data storytelling, presentation clarity, and stakeholder alignment.',
        'STAR Method Highlights: Address complex quarterly financial reports (Situation), translate heavy charts into high-level business takeaways (Task), present to cross-functional leads using simple slides (Action), achieve immediate budget approvals (Result).',
        'Key Talking Points: Data visualization, executive presentations, KPI translation.',
      ],
    });
  }

  // 5 Tailored Behavioral Questions
  const isSenior = experienceLevel.includes('senior') || experienceLevel.includes('lead') || experienceLevel.includes('executive') || experienceLevel.includes('director') || experienceLevel.includes('manager');

  if (isSenior) {
    questions.push({
      question: `As a senior leader/strategic contributor, how do you manage project timelines, allocate resources, and keep cross-functional stakeholders aligned under tight deadlines?`,
      type: 'behavioral',
      contextRef: 'Resource Management',
      suggestedPoints: [
        'What Recruiters Look For: Project management, resource allocation, and stakeholder negotiation.',
        'STAR Method Highlights: Describe a critical project with competing priorities (Situation), define timeline and budget constraints (Task), delegate work and report status clearly (Action), launch successfully on-time (Result).',
        'Key Talking Points: Stakeholder expectations management, resource delegation, risk management.',
      ],
    });
  } else {
    questions.push({
      question: `Tell me about a time you had to pick up a complex concept or tool under a tight deadline. How did you learn it fast?`,
      type: 'behavioral',
      contextRef: 'Adaptability',
      suggestedPoints: [
        'What Recruiters Look For: Self-guided learning, curiosity, and rapid execution under pressure.',
        'STAR Method Highlights: Face an unfamiliar technology or framework (Situation), target core competencies (Task), learn from docs, build sandboxes, and seek mentorship (Action), deploy working code on-time (Result).',
        'Key Talking Points: Documentation reading, sandbox experimentation, core fundamentals.',
      ],
    });
  }

  questions.push({
    question: `Have you ever disagreed with a teammate or lead about how to design or build something? How did you handle that conversation?`,
    type: 'behavioral',
    contextRef: 'Collaboration',
    suggestedPoints: [
      'What Recruiters Look For: Emotional intelligence, professional communication, and constructive conflict resolution.',
      'STAR Method Highlights: Face a design/architectural debate (Situation), seek the most objective outcome (Task), present data-backed options and listen to objections (Action), reach team alignment (Result).',
      'Key Talking Points: Active listening, objective evaluation, compromising for project goals.',
    ],
  });

  questions.push({
    question: `Tell me about a time you made a significant mistake or oversight in a project. How did you fix it and what did you learn?`,
    type: 'behavioral',
    contextRef: primaryProject,
    suggestedPoints: [
      'What Recruiters Look For: Accountability, self-reflection, and corrective action.',
      'STAR Method Highlights: State the oversight clearly (Situation), define immediate correction goals (Task), fix the issue and communicate transparently (Action), implement safeguards and post-mortem review (Result).',
      'Key Talking Points: Owning mistakes, post-mortem analysis, future risk mitigation.',
    ],
  });

  questions.push({
    question: `You mentioned your primary strength is "${primaryStrength}". Can you describe a specific situation where this strength helped you overcome a major project bottleneck?`,
    type: 'behavioral',
    contextRef: primaryStrength,
    suggestedPoints: [
      'What Recruiters Look For: Self-awareness, applying personal strengths, and problem-solving.',
      'STAR Method Highlights: Detail a project bottleneck (Situation), identify how to apply "${primaryStrength}" (Task), execute targeted solutions (Action), measure the bottleneck resolution (Result).',
      'Key Talking Points: Strengths application, personal contribution, bottleneck resolution.',
    ],
  });

  questions.push({
    question: `Your current career goal is "${careerGoal}". How does this position align with that goal, and what do you hope to achieve here in the next 2-3 years?`,
    type: 'behavioral',
    contextRef: 'Career Focus',
    suggestedPoints: [
      'What Recruiters Look For: Long-term career vision, company alignment, and commitment.',
      'STAR Method Highlights: Describe current growth stage (Situation), target skill and contribution milestones (Task), align contributions to team strategy (Action), achieve mutual growth and success (Result).',
      'Key Talking Points: Growth targets, mutual alignment, value addition over time.',
    ],
  });

  return questions;
}

// ─────────────────────────────────────────────────────────────────────────────
// AISERVICE OBJECT DEFINITION
// ─────────────────────────────────────────────────────────────────────────────

export const AIService = {
  enhanceResumeData: async (careerProfile: CareerProfile, apiKey?: string): Promise<EnhancedResumeResult> => {
    return {
      fullName: careerProfile.personalInfo?.fullName || '',
      email: careerProfile.personalInfo?.email || '',
      phone: careerProfile.personalInfo?.phone || '',
      location: careerProfile.personalInfo?.location || '',
      summary: careerProfile.summary || '',
      website: careerProfile.personalInfo?.website,
      github: careerProfile.personalInfo?.github,
      linkedin: careerProfile.personalInfo?.linkedin,
      skills: careerProfile.skills?.map(s => s.name) || [],
      education: careerProfile.education?.map(e => ({
        institution: e.institution,
        degree: e.degree,
        fieldOfStudy: e.specialization,
        startDate: e.startYear,
        endDate: e.endYear,
        grade: e.cgpa
      })) || [],
      experience: careerProfile.experience?.map(e => ({
        company: e.company,
        position: e.position,
        startDate: e.startDate,
        endDate: e.endDate,
        current: e.currentlyWorking,
        highlights: e.achievements || []
      })) || [],
      projects: normalizeShowcaseItems(careerProfile),
      certifications: careerProfile.certifications?.map(c => c.title) || [],
      achievements: careerProfile.achievements?.map(a => a.title) || [],
      publications: careerProfile.publications || [],
      workSamples: careerProfile.workSamples || []
    };
  },

  enhanceProfileWithQuestionnaire: async (
    careerProfile: CareerProfile,
    questionnaireAnswers: QuestionnaireAnswers
  ): Promise<CareerProfile> => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      devLog('No API key — using local enhancement fallback');
      return localEnhanceProfile(careerProfile, questionnaireAnswers);
    }

    const systemPrompt = `You are an elite career consultant and resume editor. Upgrade the user's structured resume data using their questionnaire answers.
CRITICAL RULES:
1. NEVER fabricate years of experience, titles, certifications, leadership scopes, or achievements.
2. NEVER invent metrics. If a metric is not provided, use realistic qualitative descriptions.
3. Professional Summary: Rewrite to match actual career level. No buzzwords.
4. Experience Highlights: Incorporate questionnaire answers into active achievement bullet points. MUST HAVE EXACTLY 3 BULLET POINTS per experience, tailored strictly to their specific profession.
5. Projects: Rewrite with (a) what was built, (b) problem solved, (c) key impact. MUST HAVE EXACTLY 3 BULLET POINTS per project, tailored strictly to their specific profession.
Respond ONLY with raw JSON, no markdown fences.`;

    const userContent = `Original Resume Data:\n${JSON.stringify(careerProfile, null, 2)}\n\nQuestionnaire Answers:\n${JSON.stringify(questionnaireAnswers, null, 2)}`;

    try {
      const raw = await callOpenRouterWithFailover(systemPrompt, userContent, apiKey);
      const parsed = parseJsonSafely<CareerProfile>(raw, 'enhanceProfileWithQuestionnaire');
      if (!parsed) throw new CareerForgeError('JSON_PARSE_ERROR', 'Failed to parse enhancement JSON');
      devLog('Profile enhancement succeeded via AI');
      return parsed;
    } catch (err) {
      console.warn('[GetProspectra] AI enhancement failed, using local fallback:', err);
      return localEnhanceProfile(careerProfile, questionnaireAnswers);
    }
  },

  generateInterviewQuestions: async (
    careerProfile: CareerProfile
  ): Promise<Omit<InterviewQuestion, 'id' | 'userId' | 'createdAt'>[]> => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      devLog('No API key — generating local interview questions');
      return localGenerateInterviewQuestions(careerProfile);
    }

    const blueprint = careerProfile.professionalBlueprint;
    const profession = blueprint?.profession || careerProfile.professionCategory || 'general professional';
    const specialization = blueprint?.specialization || 'general';
    const experienceLevel = blueprint?.experienceLevel || 'mid-level';
    const primaryStrength = blueprint?.primaryStrength || 'adaptability';
    const careerGoal = blueprint?.careerGoal || 'professional growth';

    const systemPrompt = `You are an elite, demanding, and probing interviewer/recruiter specialized in the ${profession} field.
Create exactly 10 high-quality, tricky, and hard interview prep questions tailored deeply to a ${experienceLevel}-level candidate specializing in ${specialization}.
The candidate's primary strength is "${primaryStrength}" and their career goal is "${careerGoal}".

CRITICAL INSTRUCTION:
Make these questions challenging, unexpected, and highly personalized. They should validate the candidate's actual depth of knowledge based strictly on their specific projects, stated skills, and personality profile. Do not generate generic "textbook" questions.

Of the 10 questions:
- 5 should be highly specific, tricky technical/profession-related questions focused on edge cases, difficult trade-offs, or complex problems related to their specialization (${specialization}) and exact projects.
- 5 should be hard behavioral/leadership questions testing their primary strength ("${primaryStrength}"), conflict management under high pressure, and unexpected scenarios affecting their career goal ("${careerGoal}").

TONE & STYLE RULES:
- The interviewer persona should match the profession (e.g. for developer: Principal Engineer, for lawyer: Managing Partner, for marketing: CMO, for business: Director of Strategy).
- The questions must sound like a real, spoken interviewer conducting a rigorous, probing interview.
- Each question must include suggestedPoints with exactly three elements:
  1. "What Recruiters Look For: [evaluation criteria tailored to their experience level]"
  2. "STAR Method Highlights: [Situation, Task, Action, Result mapping]"
  3. "Key Talking Points: [specific details to mention]"

Return a JSON array matching this structure exactly (do NOT include markdown fences, return ONLY raw JSON):
[
  {
    "question": "The question text",
    "type": "technical" | "behavioral",
    "contextRef": "Brief reference context (e.g. project name, skill, or strength)",
    "suggestedPoints": [
      "What Recruiters Look For: ...",
      "STAR Method Highlights: ...",
      "Key Talking Points: ..."
    ]
  }
]`;

    const userContent = `Candidate Profile:\n${JSON.stringify(careerProfile, null, 2)}`;

    try {
      const raw = await callOpenRouterWithFailover(systemPrompt, userContent, apiKey);
      const parsed = parseJsonSafely<Omit<InterviewQuestion, 'id' | 'userId' | 'createdAt'>[]>(
        raw,
        'generateInterviewQuestions'
      );
      if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
        throw new CareerForgeError('JSON_PARSE_ERROR', 'Invalid questions array');
      }
      devLog(`Generated ${parsed.length} interview questions via AI`);
      return parsed.slice(0, 10);
    } catch (err) {
      console.warn('[GetProspectra] Interview question generation failed, using local fallback:', err);
      return localGenerateInterviewQuestions(careerProfile);
    }
  },

  generatePremiumResumeVariant: async (
    careerProfile: CareerProfile,
    variant: 'leadership' | 'technical' | 'balanced',
    apiKey?: string
  ): Promise<EnhancedResumeResult | LeadershipResumeResult | BalancedResumeResult> => {
    if (!apiKey) {
      const fallback = await AIService.enhanceResumeData(careerProfile, apiKey);
      if (variant === 'leadership') {
        return LeadershipValidationLayer.upgrade(fallback, careerProfile);
      } else if (variant === 'balanced') {
        return BalancedValidationLayer.upgrade(fallback, careerProfile);
      }
      return fallback;
    }

    const blueprint = careerProfile.professionalBlueprint;
    const extensions = careerProfile.extensions;
    let blueprintInstructions = '';
    if (blueprint) {
      blueprintInstructions = `
CRITICAL TAILORING DIRECTIONS (Based on Candidate's Professional Blueprint):
- Profession Category: ${blueprint.profession}
- Specialization: ${blueprint.specialization}
- Career Stage / Experience Level: ${blueprint.experienceLevel}
- Primary Strength: ${blueprint.primaryStrength}
- Desired Image: ${blueprint.desiredImage} (Ensure the tone and narrative align with a ${blueprint.desiredImage} professional)
- Career Goal: ${blueprint.careerGoal}
- Style/Tone Preference: ${blueprint.stylePreference}

Incorporate the candidate's core strength (${blueprint.primaryStrength}) and specialization (${blueprint.specialization}) deeply into the summary/profile and experience/project bullet points.
`;
      if (extensions) {
        const extStrings: string[] = [];
        if (extensions.apis && extensions.apis.length > 0) extStrings.push(`APIs developed/consumed: ${extensions.apis.join(', ')}`);
        if (extensions.openSource && extensions.openSource.length > 0) extStrings.push(`Open source contributions: ${extensions.openSource.join(', ')}`);
        if (extensions.behance) extStrings.push(`Behance Portfolio URL: ${extensions.behance}`);
        if (extensions.dribbble) extStrings.push(`Dribbble Portfolio URL: ${extensions.dribbble}`);
        if (extensions.tools && extensions.tools.length > 0) extStrings.push(`Design tools: ${extensions.tools.join(', ')}`);
        if (extensions.practiceAreas && extensions.practiceAreas.length > 0) extStrings.push(`Practice Areas: ${extensions.practiceAreas.join(', ')}`);
        if (extensions.cases && extensions.cases.length > 0) extStrings.push(`Key Cases: ${extensions.cases.join(', ')}`);
        if (extensions.campaigns && extensions.campaigns.length > 0) extStrings.push(`Marketing Campaigns: ${extensions.campaigns.join(', ')}`);
        if (extensions.growthMetrics && extensions.growthMetrics.length > 0) extStrings.push(`Growth Metrics: ${extensions.growthMetrics.join(', ')}`);
        if (extensions.seoExperience) extStrings.push(`SEO Experience: ${extensions.seoExperience}`);
        if (extensions.financialModels && extensions.financialModels.length > 0) extStrings.push(`Financial Models: ${extensions.financialModels.join(', ')}`);
        if (extensions.research && extensions.research.length > 0) extStrings.push(`Research/Publications: ${extensions.research.join(', ')}`);
        if (extensions.dashboards && extensions.dashboards.length > 0) extStrings.push(`Dashboards: ${extensions.dashboards.join(', ')}`);
        if (extensions.pipelines && extensions.pipelines.length > 0) extStrings.push(`Data Pipelines: ${extensions.pipelines.join(', ')}`);
        if (extensions.hris && extensions.hris.length > 0) extStrings.push(`HRIS/ATS Systems: ${extensions.hris.join(', ')}`);
        if (extensions.initiatives && extensions.initiatives.length > 0) extStrings.push(`HR Initiatives: ${extensions.initiatives.join(', ')}`);
        if (extensions.methodologies && extensions.methodologies.length > 0) extStrings.push(`Project Methodologies: ${extensions.methodologies.join(', ')}`);
        if (extensions.businessFrameworks && extensions.businessFrameworks.length > 0) extStrings.push(`Business Frameworks: ${extensions.businessFrameworks.join(', ')}`);
        if (extensions.caseCompetitions && extensions.caseCompetitions.length > 0) extStrings.push(`Case Competitions: ${extensions.caseCompetitions.join(', ')}`);
        
        if (extStrings.length > 0) {
          blueprintInstructions += `
- Include relevant industry-specific extension data in the experience/projects highlights if appropriate:
  ${extStrings.map(s => `* ${s}`).join('\n  ')}
`;
        }
      }
      
      const dynamicSlots = getDynamicSections(blueprint);
      const slotInstructions = dynamicSlots.map(slot => `- Content mapped to standard section '${slot.id}' must be written assuming it will be rendered under the header '${slot.label}'. Tailor the vocabulary appropriately.`).join('\n');
      
      blueprintInstructions += `
CRITICAL SECTION MAPPING DIRECTIONS:
${slotInstructions}
`;
    }

    let systemPrompt = '';
    
    if (variant === 'leadership') {
      systemPrompt = `
You are an Executive Resume writer. Transform this profile into a LEADERSHIP & IMPACT focused resume.
Rules:
- Answer the question: "Can this person take initiative, lead projects, coordinate people, own outcomes, and drive execution?"
- The goal is NOT to showcase technologies. The goal is to showcase Leadership, Ownership, Initiative, Decision Making, and Impact. Technical details become supporting evidence.
- Extract leadership qualities from bullet points and elevate the language to sound executive (e.g. "Led", "Directed", "Managed").
- AVOID overusing: Built, Coded, Programmed.
- Your output must transform standard projects into 'Leadership Initiatives' by identifying a leadership "role" (e.g., Founder, Project Lead, Team Lead, Coordinator) for each project.
- Ensure every project and experience entry has EXACTLY 3 bullet points focusing on Leadership, Ownership, and Outcomes.
- Generate a 3-5 line "leadershipProfile" focusing on leadership qualities.
- Generate 4-6 "leadershipHighlights" summarizing core leadership achievements.
- Extract "coreStrengths" focused on leadership capabilities.
${blueprintInstructions}
Return ONLY raw JSON matching this structure exactly:
{
  "fullName": string, "email": string, "phone": string, "location": string, "title": string,
  "website": string, "github": string, "linkedin": string,
  "leadershipProfile": string,
  "leadershipHighlights": string[],
  "coreStrengths": string[],
  "education": [{ "institution": string, "degree": string, "fieldOfStudy": string, "startDate": string, "endDate": string, "grade": string }],
  "experience": [{ "company": string, "position": string, "location": string, "startDate": string, "endDate": string, "current": boolean, "achievements": string[], "leadershipSkills": string }],
  "projects": [{ "title": string, "role": string, "overview": string, "achievements": string[], "technologies": string[], "link": string, "github": string }],
  "certifications": string[],
  "achievements": string[]
}
Do NOT use markdown fences.`;
    } else if (variant === 'technical') {
      systemPrompt = `
You are a Staff Engineer Resume writer. Transform this profile into a HIGHLY TECHNICAL, implementation-focused resume.
Rules:
- Maximize the density of technical keywords, stacks, cloud platforms, and architecture patterns.
- Rewrite experience highlights to focus on HOW things were built (e.g., "Architected a scalable microservices backend using Go and gRPC").
- Emphasize complex problems solved, performance optimizations, and scaling achievements.
- The summary must clearly state the tech stack expertise and engineering philosophy.
- EVERY experience and project MUST have EXACTLY 3 bullet points tailored to the profession.
- STRICT RULE: Improve wording but NEVER invent Revenue, User counts, Business metrics, Performance percentages, Traffic numbers, or Financial impact.
${blueprintInstructions}
Return ONLY raw JSON matching this structure exactly:
{
  "fullName": string, "email": string, "phone": string, "location": string,
  "summary": string, "website": string, "github": string, "linkedin": string,
  "skills": string[],
  "education": [{ "institution": string, "degree": string, "fieldOfStudy": string, "startDate": string, "endDate": string, "grade": string }],
  "experience": [{ "company": string, "position": string, "location": string, "startDate": string, "endDate": string, "current": boolean, "achievements": string[] }],
  "projects": [{ "title": string, "description": string, "techStack": string[], "link": string, "achievements": string[], "problemSolved": string, "keyImpact": string }],
  "certifications": string[],
  "achievements": string[],
  "publications": string[],
  "workSamples": [{ "title": string, "url": string, "description": string }]
}
Do NOT use markdown fences.`;
    } else if (variant === 'balanced') {
      systemPrompt = `
You are an expert Resume Writer crafting GetProspectra's flagship "Balanced Professional Resume".
This resume perfectly balances Technical Capability with Leadership, Ownership, and Execution.

RULES:
- Answer the question: "Can this person build, communicate, collaborate, and own outcomes?"
- The "professionalProfile" must be exactly 3-5 lines. It must combine technical ability, ownership, and professional value.
- "coreCompetencies" must be cleanly split into two arrays: "technical" (languages, tools, frameworks) and "leadership" (e.g. Project Ownership, Communication).
- EVERY experience and project MUST have EXACTLY 3 bullet points tailored to the profession.
- WORD POSITIONING ENGINE (CRITICAL): Every project and experience bullet point MUST contain Technical Evidence + Ownership Evidence.
  - Intentionally mix Technical Words (Built, Developed, Architected) with Leadership Words (Led, Managed, Coordinated, Executed).
- do not invent revenue, users, or metrics. Use qualitative impact instead.
${blueprintInstructions}
Return ONLY raw JSON matching this structure exactly:
{
  "fullName": string, "email": string, "phone": string, "location": string, "title": string,
  "website": string, "github": string, "linkedin": string,
  "professionalProfile": string,
  "coreCompetencies": { "technical": string[], "leadership": string[] },
  "education": [{ "institution": string, "degree": string, "fieldOfStudy": string, "startDate": string, "endDate": string, "grade": string }],
  "experience": [{ "company": string, "position": string, "location": string, "startDate": string, "endDate": string, "current": boolean, "achievements": string[] }],
  "projects": [{ "title": string, "overview": string, "achievements": string[], "techStack": string[], "link": string, "github": string }],
  "certifications": string[],
  "achievements": string[]
}
Do NOT use markdown fences.`;
    }

    const userContent = `Original Profile Data:
${JSON.stringify(careerProfile, null, 2)}`;

    try {
      let raw = await callOpenRouterWithFailover(systemPrompt, userContent, apiKey);
      let parsed = parseJsonSafely<EnhancedResumeResult | LeadershipResumeResult | BalancedResumeResult>(raw, `generatePremiumResume_${variant}`);

      if (variant === 'leadership') {
        const isValidLeadership = (data: any): boolean => {
          if (!data || !data.fullName || !data.leadershipProfile || !data.leadershipHighlights || !Array.isArray(data.leadershipHighlights)) return false;
          if (data.leadershipHighlights.length < 3) return false;
          if (data.projects && Array.isArray(data.projects)) {
            for (const p of data.projects) {
              if (!p.role || !p.achievements || p.achievements.length !== 3) return false;
            }
          }
          if (data.experience && Array.isArray(data.experience)) {
            for (const e of data.experience) {
              if (!e.achievements || e.achievements.length !== 3) return false;
            }
          }
          return true;
        };

        if (!isValidLeadership(parsed)) {
          devLog('Leadership validation failed. Attempting 1 retry...');
          raw = await callOpenRouterWithFailover(systemPrompt, userContent, apiKey);
          parsed = parseJsonSafely<EnhancedResumeResult | LeadershipResumeResult | BalancedResumeResult>(raw, `generatePremiumResume_leadership_retry`);
          if (!isValidLeadership(parsed)) {
            throw new CareerForgeError('JSON_PARSE_ERROR', 'Failed strict leadership validation requirements after retry.');
          }
        }
      } else if (variant === 'balanced') {
        const isValidBalanced = (data: any): boolean => {
          if (!data || !data.fullName || !data.professionalProfile || !data.coreCompetencies) return false;
          if (!Array.isArray(data.coreCompetencies.technical) || !Array.isArray(data.coreCompetencies.leadership)) return false;
          if (data.projects && Array.isArray(data.projects)) {
            for (const p of data.projects) {
              if (!p.achievements || p.achievements.length !== 3) return false;
            }
          }
          if (data.experience && Array.isArray(data.experience)) {
            for (const e of data.experience) {
              if (!e.achievements || e.achievements.length !== 3) return false;
            }
          }
          return true;
        };

        if (!isValidBalanced(parsed)) {
          devLog('Balanced validation failed. Attempting 1 retry...');
          raw = await callOpenRouterWithFailover(systemPrompt, userContent, apiKey);
          parsed = parseJsonSafely<EnhancedResumeResult | LeadershipResumeResult | BalancedResumeResult>(raw, `generatePremiumResume_balanced_retry`);
          if (!isValidBalanced(parsed)) {
            throw new CareerForgeError('JSON_PARSE_ERROR', 'Failed strict balanced validation requirements after retry.');
          }
        }
      } else {
        if (!parsed || !parsed.fullName) {
          throw new CareerForgeError('JSON_PARSE_ERROR', 'Invalid premium resume data');
        }
      }
      return parsed as EnhancedResumeResult | LeadershipResumeResult | BalancedResumeResult;
    } catch (err) {
      console.warn(`[GetProspectra] Premium ${variant} resume failed, falling back to basic:`, err);
      const fallback = await AIService.enhanceResumeData(careerProfile, apiKey);
      
      if (variant === 'leadership') {
         return LeadershipValidationLayer.upgrade(fallback, careerProfile);
      } else if (variant === 'balanced') {
         return BalancedValidationLayer.upgrade(fallback, careerProfile);
      }
      return fallback;
    }
  },

  generatePremiumCareerAnalysis: async (careerProfile: CareerProfile, apiKey?: string): Promise<any> => {
    const fallbackAnalysis = {
      roleMatch: careerProfile.professionCategory || "Professional",
      matchScore: 85,
      strengths: [
        "Solid foundation in core competencies",
        "Clear professional trajectory",
        "Demonstrated technical aptitude"
      ],
      missingSkills: [
        "Advanced System Design",
        "Cross-functional Leadership"
      ],
      recommendedNextSkill: {
        name: "Advanced Architecture",
        reason: "Crucial for scaling systems and moving into technical leadership roles."
      },
      recommendedRoles: [
        `Senior ${careerProfile.professionCategory || 'Professional'}`,
        "Project Lead",
        "Technical Architect"
      ],
      careerRoadmap: [
        { timeframe: "Next 6 Months", action: "Master advanced technical architecture and lead a major feature delivery." },
        { timeframe: "1 Year", action: "Transition into a team lead role, mentoring junior peers." },
        { timeframe: "2-3 Years", action: "Attain Principal/Architect level, focusing on high-level system strategy." }
      ]
    };

    if (!apiKey) return fallbackAnalysis;

    const systemPrompt = `You are a Senior Career Analyst. Analyze this candidate's profile and evaluate their suitability for their targeted field.
Provide:
1. "roleMatch" (the exact candidate role title evaluated)
2. "matchScore" (a realistic suitability score between 50 and 99 based on matching experience/skills)
3. "strengths" (an array of 3-4 specific core strengths they exhibit)
4. "missingSkills" (an array of 2-3 technical or leadership skills they lack)
5. "recommendedNextSkill" (object with "name" and "reason" for the single most important skill to learn next)
6. "recommendedRoles" (an array of 3 realistic growth roles or career paths)
7. "careerRoadmap" (an array of 3 milestone objects with "timeframe" and "action")

Return ONLY JSON matching this structure:
{
  "roleMatch": string,
  "matchScore": number,
  "strengths": string[],
  "missingSkills": string[],
  "recommendedNextSkill": { "name": string, "reason": string },
  "recommendedRoles": string[],
  "careerRoadmap": [
    { "timeframe": string, "action": string }
  ]
}
Do NOT use markdown fences.`;

    const userContent = `Candidate Profile:\n${JSON.stringify(careerProfile, null, 2)}`;

    try {
      const raw = await callOpenRouterWithFailover(systemPrompt, userContent, apiKey);
      const parsed = parseJsonSafely<any>(raw, 'generatePremiumCareerAnalysis');
      if (!parsed || !parsed.roleMatch || typeof parsed.matchScore !== 'number') {
        return fallbackAnalysis;
      }
      return parsed;
    } catch (err) {
      console.warn('Premium Career Analysis failed:', err);
      return fallbackAnalysis;
    }
  },

  generatePremiumInterviewPrep: async (careerProfile: CareerProfile, apiKey?: string): Promise<any[]> => {
    const fallbackQuestions = localGenerateInterviewQuestions(careerProfile).map((q, idx) => ({
      ...q,
      id: `premium_fallback_q${idx}`,
      premiumAnswer: {
        overview: "A strong, confident opening statement directly addressing the core of the question based on industry best practices.",
        deepDive: "A strategic breakdown using the STAR method, emphasizing metrics, cross-functional collaboration, and scalable decision-making that aligns with senior/leadership expectations."
      }
    }));

    if (!apiKey) return fallbackQuestions;

    const blueprint = careerProfile.professionalBlueprint;
    const profession = blueprint?.profession || careerProfile.professionCategory || 'general professional';
    const specialization = blueprint?.specialization || 'general';
    const experienceLevel = blueprint?.experienceLevel || 'mid-level';
    const primaryStrength = blueprint?.primaryStrength || 'adaptability';
    const careerGoal = blueprint?.careerGoal || 'professional growth';
    const showcaseLabels = getShowcaseLabels(careerProfile.professionCategory);
    const showcaseItemPlural = showcaseLabels.sectionTitle.toLowerCase();

    const systemPrompt = `You are an elite recruiter and senior leader (e.g. Lead Engineer/Tech Lead for developers, Managing Partner for lawyers, CMO for marketing, or Director/VP for business roles) conducting a premium, high-stakes interview in the ${profession} field.
Generate exactly 5 highly tailored, challenging interview prep questions for a ${experienceLevel}-level candidate specializing in ${specialization}.
The candidate's primary strength is "${primaryStrength}" and their career goal is "${careerGoal}".

Of the 5 questions:
- 2-3 should be deep-dive technical/profession-specific questions targeting their specialization (${specialization}), ${showcaseItemPlural}, or professional challenges.
- 2-3 should be sophisticated behavioral questions addressing leadership, conflict resolution, or growth, aligned with their primary strength ("${primaryStrength}") and career goal ("${careerGoal}").

For EACH question, provide the standard "suggestedPoints" AND a "premiumAnswer" that shows the user exactly how a top-tier candidate would respond.

Return exactly this JSON array structure (do NOT use markdown fences, return ONLY raw JSON):
[
  {
    "id": "premium_q_something",
    "type": "technical" | "behavioral",
    "question": "The question text",
    "suggestedPoints": [
      "What Recruiters Look For: ...",
      "STAR Method Highlights: ...",
      "Key Talking Points: ..."
    ],
    "premiumAnswer": {
      "overview": "A 1-2 sentence strong, high-impact opening statement answering the question.",
      "deepDive": "A detailed 3-4 sentence breakdown using the STAR method, with concrete metrics or specific industry-standard actions."
    }
  }
]`;

    const userContent = `Candidate Profile:\n${JSON.stringify(careerProfile, null, 2)}`;

    try {
      const raw = await callOpenRouterWithFailover(systemPrompt, userContent, apiKey);
      const parsed = parseJsonSafely<any[]>(raw, 'generatePremiumInterviewPrep');
      if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
        return fallbackQuestions;
      }
      return parsed;
    } catch (err) {
      console.warn('Premium Interview Prep generation failed:', err);
      return fallbackQuestions;
    }
  },
};
