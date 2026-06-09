import { CareerProfile, ProfessionalBlueprint } from '@/db/local-db';

export interface QuestionnaireAnswers {
  general?: {
    targetRoles?: string;
    targetCompanies?: string;
    careerStage?: string;
    primaryStrength?: string;
    desiredImage?: string;
    careerGoal?: string;
    stylePreference?: string;
  };
  leadership?: {
    ledTeam?: boolean;
  };
  experience?: {
    ledTeam?: boolean;
  }[];
  [key: string]: unknown;
}

export function generateProfessionalBlueprint(
  careerProfile: CareerProfile,
  questionnaireAnswers?: QuestionnaireAnswers
): ProfessionalBlueprint {
  // Infer Category
  const cat = careerProfile.professionCategory;
  const profession = mapCategoryToProfession(cat);

  // Heuristic Specialization
  let specialization = inferSpecialization(cat, careerProfile, questionnaireAnswers);

  // Heuristic Experience Level
  let experienceLevel = inferExperienceLevel(careerProfile, questionnaireAnswers);

  // Heuristic Primary Strength
  let primaryStrength = inferPrimaryStrength(cat, careerProfile, questionnaireAnswers);

  // Heuristic Desired Image
  let desiredImage = inferDesiredImage(cat, questionnaireAnswers);

  // Heuristic Career Goal
  let careerGoal = inferCareerGoal(questionnaireAnswers);

  // Heuristic Style Preference
  let stylePreference = inferStylePreference(cat, questionnaireAnswers);

  // Override with explicit answers if present in Phase 3 questionnaire updates
  // (We'll check for keys like general.careerStage, general.primaryStrength, etc.)
  if (questionnaireAnswers?.general) {
    const gen = questionnaireAnswers.general;
    if (gen.careerStage) {
      experienceLevel = mapCareerStage(gen.careerStage);
    }
    if (gen.primaryStrength) {
      primaryStrength = gen.primaryStrength.toLowerCase();
    }
    if (gen.desiredImage) {
      desiredImage = gen.desiredImage.toLowerCase();
    }
    if (gen.careerGoal) {
      careerGoal = mapCareerGoal(gen.careerGoal);
    }
    if (gen.stylePreference) {
      stylePreference = gen.stylePreference.toLowerCase();
    }
  }

  return {
    profession,
    specialization,
    experienceLevel,
    primaryStrength,
    desiredImage,
    careerGoal,
    stylePreference,
  };
}

function mapCategoryToProfession(category: string): string {
  switch (category) {
    case 'Developer':
      return 'developer';
    case 'Designer':
      return 'designer';
    case 'Data Analyst':
      return 'data_analyst';
    case 'MBA / Business':
      return 'business';
    case 'Marketing':
      return 'marketing';
    case 'Law':
      return 'lawyer';
    case 'HR':
      return 'hr';
    case 'Finance':
      return 'finance';
    case 'General Professional':
      return 'general';
    default:
      return 'developer';
  }
}

function inferSpecialization(category: string, profile: CareerProfile, questionnaireAnswers?: QuestionnaireAnswers): string {
  const textToScan = [
    questionnaireAnswers?.general?.targetRoles || '',
    profile.personalInfo?.fullName || '',
    profile.summary || '',
    profile.skills?.map(s => s.name).join(' ') || '',
    profile.projects?.map(p => `${p.name} ${p.description}`).join(' ') || '',
    profile.experience?.map(e => `${e.position} ${e.description}`).join(' ') || '',
  ].join(' ').toLowerCase();

  if (category === 'Developer') {
    if (/\b(frontend|react|vue|angular|next\.js|ui|css|html|tailwind|javascript|typescript|front-end)\b/.test(textToScan)) {
      return 'frontend';
    }
    if (/\b(backend|node|express|django|flask|spring|java|go|golang|rust|c\+\+|sql|postgres|redis|graphql|api|back-end)\b/.test(textToScan)) {
      return 'backend';
    }
    if (/\b(data|ml|ai|python|tensor|pytorch|model|pandas|analytics|scikit|machine learning|deep learning)\b/.test(textToScan)) {
      return 'data_science';
    }
    if (/\b(devops|aws|docker|kubernetes|cicd|jenkins|cloud|gcp|azure)\b/.test(textToScan)) {
      return 'devops';
    }
    return 'fullstack';
  }

  if (category === 'Designer') {
    if (/\b(ux|ui|figma|product|user experience|user interface)\b/.test(textToScan)) {
      return 'ui_ux';
    }
    if (/\b(graphic|photoshop|illustrator|adobe|print|branding)\b/.test(textToScan)) {
      return 'graphic_design';
    }
    if (/\b(motion|video|animation|after effects|editor)\b/.test(textToScan)) {
      return 'motion_design';
    }
    return 'product';
  }

  if (category === 'MBA / Business') {
    if (/\b(product|pm|product manager|scrum|agile)\b/.test(textToScan)) {
      return 'product_management';
    }
    if (/\b(founder|ceo|co-founder|startup|entrepreneur|venture)\b/.test(textToScan)) {
      return 'entrepreneurship';
    }
    return 'business_strategy';
  }

  if (category === 'Marketing') {
    if (/\b(seo|sem|content|copywriting|blog|organic)\b/.test(textToScan)) {
      return 'digital_marketing';
    }
    if (/\b(brand|pr|public relations|creative director)\b/.test(textToScan)) {
      return 'brand_strategy';
    }
    return 'growth_marketing';
  }

  if (category === 'Law') {
    if (/\b(corporate|m&a|mergers|acquisition|contract|compliance)\b/.test(textToScan)) {
      return 'corporate_law';
    }
    if (/\b(ip|patent|trademark|copyright|intellectual property)\b/.test(textToScan)) {
      return 'intellectual_property';
    }
    return 'general_practice';
  }

  if (category === 'Finance') {
    if (/\b(model|analyst|valuation|excel|forecasting)\b/.test(textToScan)) {
      return 'financial_analysis';
    }
    if (/\b(investment|ib|m&a|venture|equity)\b/.test(textToScan)) {
      return 'investment_banking';
    }
    return 'corporate_finance';
  }

  return 'general';
}

function inferExperienceLevel(profile: CareerProfile, questionnaireAnswers?: QuestionnaireAnswers): string {
  // Check titles for seniority keywords
  const titleText = [
    profile.experience?.map(e => e.position).join(' ') || '',
  ].join(' ').toLowerCase();

  if (/\b(senior|lead|principal|staff|director|manager|head|vp|chief|founder)\b/.test(titleText)) {
    return 'senior';
  }

  if (/\b(intern|junior|associate|fresher|student|entry)\b/.test(titleText)) {
    return 'junior';
  }

  // Fallback to counting experience items
  const expCount = profile.experience?.length || 0;
  if (expCount === 0) return 'student';
  if (expCount === 1) return 'junior';
  if (expCount >= 4) return 'senior';

  return 'mid';
}

function inferPrimaryStrength(category: string, profile: CareerProfile, questionnaireAnswers?: QuestionnaireAnswers): string {
  // If questionnaire indicated ledTeam is true
  if (questionnaireAnswers?.leadership?.ledTeam || questionnaireAnswers?.experience?.some(e => e.ledTeam)) {
    return 'leadership';
  }

  const titleText = [
    profile.experience?.map(e => e.position).join(' ') || '',
  ].join(' ').toLowerCase();

  if (/\b(lead|manager|director|vp|founder|head)\b/.test(titleText)) {
    return 'leadership';
  }

  if (category === 'Designer') return 'creativity';
  if (category === 'Marketing') return 'communication';
  if (category === 'MBA / Business') return 'problem_solving';

  return 'technical';
}

function inferDesiredImage(category: string, questionnaireAnswers?: QuestionnaireAnswers): string {
  if (category === 'Developer' || category === 'Designer') return 'innovative';
  if (category === 'Data Analyst' || category === 'Finance') return 'analytical';
  if (category === 'MBA / Business' || category === 'Marketing') return 'strategic';
  if (category === 'Law' || category === 'HR') return 'reliable';
  return 'strategic';
}

function inferCareerGoal(questionnaireAnswers?: QuestionnaireAnswers): string {
  const targetCompanies = (questionnaireAnswers?.general?.targetCompanies || '').toLowerCase();
  if (/\b(startup|start-up|early|seed|founder)\b/.test(targetCompanies)) {
    return 'startup';
  }
  return 'get_hired';
}

function inferStylePreference(category: string, questionnaireAnswers?: QuestionnaireAnswers): string {
  if (category === 'Developer') return 'modern';
  if (category === 'Designer') return 'creative';
  if (category === 'MBA / Business' || category === 'Law' || category === 'Finance') return 'corporate';
  return 'minimal';
}

// Maps Phase 3 Career Stage answers
function mapCareerStage(stage: string): string {
  const s = stage.toLowerCase();
  if (s.includes('student')) return 'student';
  if (s.includes('fresher')) return 'junior';
  if (s.includes('mid')) return 'mid';
  if (s.includes('senior')) return 'senior';
  return 'mid';
}

// Maps Phase 3 Career Goal answers
function mapCareerGoal(goal: string): string {
  const g = goal.toLowerCase();
  if (g.includes('startup') || g.includes('founder')) return 'startup';
  if (g.includes('freelance')) return 'freelance';
  if (g.includes('promotion')) return 'promotion';
  if (g.includes('leadership')) return 'leadership';
  if (g.includes('switch')) return 'career_switch';
  return 'get_hired';
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYER 2: TEMPLATE SELECTION
// ─────────────────────────────────────────────────────────────────────────────

export function getTemplateRecommendations(blueprint: ProfessionalBlueprint): { resume: string[], portfolio: string[] } {
  const isLeader = blueprint.primaryStrength === 'leadership' || blueprint.experienceLevel === 'senior';
  const isCreative = blueprint.profession === 'designer' || blueprint.stylePreference === 'creative';
  const isTech = blueprint.profession === 'developer' || blueprint.profession === 'data_analyst';

  const resume = [];
  const portfolio = [];

  // Resume Recommendations
  if (isLeader) resume.push('leadership');
  if (isTech) resume.push('technical');
  if (!isLeader && !isTech) resume.push('balanced');
  
  // Fill the rest as fallbacks so they always have 3 available
  if (!resume.includes('balanced')) resume.push('balanced');
  if (!resume.includes('technical') && resume.length < 3) resume.push('technical');
  if (!resume.includes('leadership') && resume.length < 3) resume.push('leadership');

  // Portfolio Recommendations
  if (isLeader) portfolio.push('executive');
  if (isTech || blueprint.careerGoal === 'startup') portfolio.push('builder');
  if (!isLeader && !isTech) portfolio.push('professional');

  // Fill fallbacks
  if (!portfolio.includes('professional')) portfolio.push('professional');
  if (!portfolio.includes('builder') && portfolio.length < 3) portfolio.push('builder');
  if (!portfolio.includes('executive') && portfolio.length < 3) portfolio.push('executive');

  return { resume, portfolio };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYERS 3 & 4: DYNAMIC SECTION MAPPING & ORDERING
// ─────────────────────────────────────────────────────────────────────────────

export interface SectionSlot {
  id: 'experience' | 'projects' | 'education' | 'certifications' | 'skills' | 'achievements';
  label: string;
}

export function getDynamicSections(blueprint: ProfessionalBlueprint): SectionSlot[] {
  let slots: SectionSlot[] = [];

  const isSenior = blueprint.experienceLevel === 'senior';
  const isJunior = blueprint.experienceLevel === 'student' || blueprint.experienceLevel === 'junior';
  const isTech = blueprint.profession === 'developer' || blueprint.profession === 'data_analyst';
  const isLaw = blueprint.profession === 'lawyer';
  const isFinance = blueprint.profession === 'finance';
  const isAcademic = blueprint.profession === 'researcher' || blueprint.careerGoal === 'academic';

  // 1. Establish the pool of available components/slots and map labels
  
  // Experience Slot
  let expLabel = 'Professional Experience';
  if (isLaw) expLabel = 'Legal Experience';
  else if (isFinance) expLabel = 'Financial Experience';
  else if (blueprint.primaryStrength === 'leadership') expLabel = 'Leadership Experience';

  // Projects Slot (This acts as the wildcard slot for various professions)
  let projLabel = 'Key Projects';
  if (isLaw) projLabel = 'Practice Areas & Cases';
  else if (isFinance) projLabel = 'Financial Models & Deals';
  else if (blueprint.profession === 'marketing') projLabel = 'Campaigns & Growth Metrics';
  else if (blueprint.profession === 'designer') projLabel = 'Design Portfolio';

  // Certifications / Extras Slot
  let certLabel = 'Certifications';
  if (isAcademic || isLaw) certLabel = 'Publications & Certifications';

  const expSlot: SectionSlot = { id: 'experience', label: expLabel };
  const projSlot: SectionSlot = { id: 'projects', label: projLabel };
  const eduSlot: SectionSlot = { id: 'education', label: 'Education' };
  const certSlot: SectionSlot = { id: 'certifications', label: certLabel };
  const skillSlot: SectionSlot = { id: 'skills', label: isTech ? 'Technical Arsenal' : 'Core Competencies' };

  // 2. Dynamic Ordering Logic
  
  if (isJunior) {
    // Juniors: Education -> Projects -> Experience -> Skills -> Certs
    slots = [eduSlot, projSlot, expSlot, skillSlot, certSlot];
  } else if (isSenior) {
    // Seniors: Experience -> Projects -> Skills -> Education -> Certs
    slots = [expSlot, projSlot, skillSlot, eduSlot, certSlot];
  } else if (isTech) {
    // Mid-level Tech: Projects -> Experience -> Skills -> Education -> Certs
    slots = [projSlot, expSlot, skillSlot, eduSlot, certSlot];
  } else {
    // Default Mid-level: Experience -> Projects -> Skills -> Education -> Certs
    slots = [expSlot, projSlot, skillSlot, eduSlot, certSlot];
  }

  return slots;
}

