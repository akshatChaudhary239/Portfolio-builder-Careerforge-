import { prisma } from '@/lib/prisma';

// --- DATABASE TYPES ---

export type ProfessionCategory =
  | 'Developer'
  | 'Designer'
  | 'Data Analyst'
  | 'MBA / Business'
  | 'Marketing'
  | 'Law'
  | 'HR'
  | 'Finance'
  | 'General Professional';

export interface ProfessionalBlueprint {
  profession: string;
  specialization: string;
  experienceLevel: string;
  primaryStrength: string;
  desiredImage: string;
  careerGoal: string;
  stylePreference: string;
}

export interface Skill {
  name: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
  achievements: string[];
}

export interface ShowcaseItem {
  title: string;
  description: string;
  outcome?: string;
  
  // Legacy project fields for backward compatibility
  name?: string;
  technologies?: string[];
  problemSolved?: string;
  impact?: string;
  githubUrl?: string;
  liveUrl?: string;
  link?: string;
  
  // Profession-specific extensions
  behanceUrl?: string;
  dribbbleUrl?: string;
  figmaUrl?: string;
  designTools?: string[];
  
  tools?: string[];
  dashboardUrl?: string;
  datasetType?: string;
  
  domain?: string;
  teamSize?: string;
  presentationUrl?: string;
  
  campaignType?: string;
  reach?: string;
  conversions?: string;
  campaignUrl?: string;
  
  practiceArea?: string;
  caseType?: string;
  publicationUrl?: string;
  
  initiativeType?: string;
  participants?: string;
  
  modelType?: string;
  valuationType?: string;
  reportUrl?: string;
  
  category?: string;
  supportingUrl?: string;
}

export type Project = ShowcaseItem;

export interface Education {
  institution: string;
  degree: string;
  specialization: string;
  startYear: string;
  endYear: string;
  cgpa: string;
}

export interface Certification {
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string;
}

export interface Achievement {
  title: string;
  description: string;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  github?: string;
  linkedin: string;
  website?: string;
  avatarUrl?: string;
}

export interface WorkSampleEntry {
  title: string;
  url: string;
  description?: string;
}

export interface ProfileExtensions {
  apis?: string[];
  openSource?: string[];
  behance?: string;
  dribbble?: string;
  tools?: string[];
  practiceAreas?: string[];
  cases?: string[];
  campaigns?: string[];
  growthMetrics?: string[];
  seoExperience?: string;
  financialModels?: string[];
  research?: string[];
  dashboards?: string[];
  pipelines?: string[];
  hris?: string[];
  initiatives?: string[];
  methodologies?: string[];
  businessFrameworks?: string[];
  caseCompetitions?: string[];
}

export interface CareerProfile {
  id: string;
  userId: string;
  professionCategory: ProfessionCategory;
  personalInfo: PersonalInfo;
  summary: string;
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
  achievements: Achievement[];
  publications: string[];
  workSamples: WorkSampleEntry[];
  confirmed: boolean;
  createdAt: string;
  premiumCredits?: number;
  professionalBlueprint?: ProfessionalBlueprint;
  extensions?: ProfileExtensions;
}

export interface PortfolioEnhancements {
  additionalProjects?: Project[];
  additionalCertifications?: Certification[];
  additionalAchievements?: Achievement[];
  additionalExperience?: Experience[];
  additionalPublications?: string[];
  additionalWorkSamples?: WorkSampleEntry[];
  profilePhotoUrl?: string;
  externalLinks?: {
    github?: string;
    behance?: string;
    dribbble?: string;
    figma?: string;
    linkedin?: string;
  };
}

export interface Portfolio {
  id: string;
  userId: string;
  templateId: 'dev' | 'corporate' | 'creative' | 'executive' | 'product_builder' | 'interactive_showcase';
  customAccentColor?: string;
  visibility: 'public' | 'private';
  subdomain: string;
  sectionToggles: {
    hero: boolean;
    skills: boolean;
    experience: boolean;
    education: boolean;
    projects: boolean;
    certifications: boolean;
    achievements: boolean;
    publications: boolean;
    workSamples: boolean;
  
  };
  sectionOrder?: string[];
  sectionTitles?: Record<string, string>;
  enhancements?: PortfolioEnhancements;
  draftConfiguration?: any;
  publishedConfiguration?: any;
  versionHistory?: { id: string; timestamp: string; config: any }[];
  updatedAt: string;
}

export interface InterviewQuestion {
  id: string;
  userId: string;
  question: string;
  type: 'technical' | 'behavioral';
  contextRef?: string;
  suggestedPoints?: string[];
  premiumAnswer?: any;
  createdAt: string;
}

export interface IdentityStack {
  id: string;
  userId: string;
  profileId: string;
  stackName: string;
  stackType: 'free' | 'premium' | 'executive' | 'product_builder' | 'interactive_showcase';
  generationTier: 'free' | 'premium';
  profileVersion: string;
  generationSessionId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface GeneratedAsset {
  id: string;
  userId: string;
  stackId: string;
  assetType: 'resume' | 'portfolio' | 'questions' | 'analysis';
  assetVariant: 'standard' | 'premium' | 'creative' | 'leadership' | 'technical' | 'recruiter' | 'executive' | 'product_builder' | 'interactive_showcase' | 'balanced';
  generatedContent: any;
  createdAt: string;
}

export interface PremiumGenerationSession {
  id: string;
  userId: string;
  profileId: string;
  status: 'pending' | 'completed' | 'failed';
  paymentId?: string;
  createdAt: string;
  completedAt?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
  premiumCredits?: number;
}


// --- POSTGRES DB ACTIONS (ASYNCHRONOUS PRISMA) ---

export const LocalDB = {
  // Users
  getUserByEmail: async (email: string): Promise<User | undefined> => {
    const user = await prisma.user.findUnique({ 
      where: { email: email.toLowerCase() },
      include: { careerProfile: true }
    });
    if (!user) return undefined;
    return {
      ...user,
      passwordHash: user.password,
      premiumCredits: user.careerProfile?.premiumCredits ?? undefined,
      createdAt: user.createdAt.toISOString()
    };
  },

  getUserById: async (id: string): Promise<User | undefined> => {
    const user = await prisma.user.findUnique({ 
      where: { id },
      include: { careerProfile: true }
    });
    if (!user) return undefined;
    return {
      ...user,
      passwordHash: user.password,
      premiumCredits: user.careerProfile?.premiumCredits ?? undefined,
      createdAt: user.createdAt.toISOString()
    };
  },

  createUser: async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    const newUser = await prisma.user.create({
      data: {
        email: user.email.toLowerCase(),
        name: user.name,
        password: user.passwordHash,
      }
    });
    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      passwordHash: newUser.password,
      createdAt: newUser.createdAt.toISOString(),
    };
  },

  // Parsed Data / Identity
  getCareerProfileByUserId: async (userId: string): Promise<CareerProfile | undefined> => {
    const profile = await prisma.careerProfile.findUnique({ where: { userId } });
    if (!profile) return undefined;
    return {
      ...profile,
      professionCategory: profile.professionCategory as ProfessionCategory,
      personalInfo: profile.personalInfo as any,
      skills: profile.skills as any,
      experience: profile.experience as any,
      projects: profile.projects as any,
      education: profile.education as any,
      certifications: profile.certifications as any,
      achievements: profile.achievements as any,
      publications: profile.publications as any,
      workSamples: profile.workSamples as any,
      professionalBlueprint: profile.professionalBlueprint as any,
      extensions: profile.extensions as any,
      premiumCredits: profile.premiumCredits ?? undefined,
      createdAt: profile.createdAt.toISOString()
    };
  },

  saveCareerProfile: async (data: Omit<CareerProfile, 'id' | 'createdAt'>): Promise<CareerProfile> => {
    const profile = await prisma.careerProfile.upsert({
      where: { userId: data.userId },
      update: {
        professionCategory: data.professionCategory,
        personalInfo: (data.personalInfo as any) || {},
        summary: data.summary,
        skills: (data.skills as any) || [],
        experience: (data.experience as any) || [],
        projects: (data.projects as any) || [],
        education: (data.education as any) || [],
        certifications: (data.certifications as any) || [],
        achievements: (data.achievements as any) || [],
        publications: (data.publications as any) || [],
        workSamples: (data.workSamples as any) || [],
        confirmed: data.confirmed,
        premiumCredits: data.premiumCredits,
        professionalBlueprint: (data.professionalBlueprint as any) || null,
        extensions: (data.extensions as any) || null,
      },
      create: {
        userId: data.userId,
        professionCategory: data.professionCategory,
        personalInfo: (data.personalInfo as any) || {},
        summary: data.summary,
        skills: (data.skills as any) || [],
        experience: (data.experience as any) || [],
        projects: (data.projects as any) || [],
        education: (data.education as any) || [],
        certifications: (data.certifications as any) || [],
        achievements: (data.achievements as any) || [],
        publications: (data.publications as any) || [],
        workSamples: (data.workSamples as any) || [],
        confirmed: data.confirmed,
        premiumCredits: data.premiumCredits,
        professionalBlueprint: (data.professionalBlueprint as any) || null,
        extensions: (data.extensions as any) || null,
      }
    });

    return {
      ...profile,
      professionCategory: profile.professionCategory as ProfessionCategory,
      personalInfo: profile.personalInfo as any,
      skills: profile.skills as any,
      experience: profile.experience as any,
      projects: profile.projects as any,
      education: profile.education as any,
      certifications: profile.certifications as any,
      achievements: profile.achievements as any,
      publications: profile.publications as any,
      workSamples: profile.workSamples as any,
      professionalBlueprint: profile.professionalBlueprint as any,
      extensions: profile.extensions as any,
      premiumCredits: profile.premiumCredits ?? undefined,
      createdAt: profile.createdAt.toISOString()
    };
  },

  updateCareerProfile: async (userId: string, data: Partial<CareerProfile>): Promise<CareerProfile> => {
    const profile = await prisma.careerProfile.update({
      where: { userId },
      data: {
        professionCategory: data.professionCategory,
        personalInfo: data.personalInfo as any,
        summary: data.summary,
        skills: data.skills as any,
        experience: data.experience as any,
        projects: data.projects as any,
        education: data.education as any,
        certifications: data.certifications as any,
        achievements: data.achievements as any,
        publications: data.publications as any,
        workSamples: data.workSamples as any,
        confirmed: data.confirmed,
        premiumCredits: data.premiumCredits,
        professionalBlueprint: data.professionalBlueprint as any,
        extensions: data.extensions as any,
      }
    });
    
    return {
      ...profile,
      professionCategory: profile.professionCategory as ProfessionCategory,
      personalInfo: profile.personalInfo as any,
      skills: profile.skills as any,
      experience: profile.experience as any,
      projects: profile.projects as any,
      education: profile.education as any,
      certifications: profile.certifications as any,
      achievements: profile.achievements as any,
      publications: profile.publications as any,
      workSamples: profile.workSamples as any,
      professionalBlueprint: profile.professionalBlueprint as any,
      extensions: profile.extensions as any,
      premiumCredits: profile.premiumCredits ?? undefined,
      createdAt: profile.createdAt.toISOString()
    };
  },

  // Portfolios
  getPortfolioByUserId: async (userId: string): Promise<Portfolio | undefined> => {
    const portfolio = await prisma.portfolio.findUnique({ where: { userId } });
    if (!portfolio) return undefined;
    const enhancements = (portfolio.enhancements as any) || {};
    return {
      ...portfolio,
      templateId: portfolio.templateId as any,
      visibility: portfolio.visibility as any,
      sectionToggles: portfolio.sectionToggles as any,
      sectionOrder: portfolio.sectionOrder as any,
      sectionTitles: portfolio.sectionTitles as any,
      enhancements: portfolio.enhancements as any,
      draftConfiguration: enhancements.draftConfiguration ?? undefined,
      publishedConfiguration: enhancements.publishedConfiguration ?? undefined,
      customAccentColor: portfolio.customAccentColor ?? undefined,
      updatedAt: portfolio.updatedAt.toISOString()
    };
  },

  getPortfolioBySubdomain: async (subdomain: string): Promise<{ portfolio: Portfolio; user: User; careerProfile?: CareerProfile } | undefined> => {
    const portfolio = await prisma.portfolio.findUnique({ 
      where: { subdomain },
      include: {
        user: { include: { careerProfile: true } }
      }
    });
    
    if (!portfolio) return undefined;
    
    const userDb = portfolio.user as any;
    const user: User = {
      id: userDb.id,
      email: userDb.email,
      name: userDb.name,
      passwordHash: userDb.password,
      createdAt: userDb.createdAt.toISOString()
    };
    
    let cp: CareerProfile | undefined;
    if (userDb.careerProfile) {
      cp = {
        ...userDb.careerProfile,
        professionCategory: userDb.careerProfile.professionCategory as ProfessionCategory,
        personalInfo: userDb.careerProfile.personalInfo as any,
        skills: userDb.careerProfile.skills as any,
        experience: userDb.careerProfile.experience as any,
        projects: userDb.careerProfile.projects as any,
        education: userDb.careerProfile.education as any,
        certifications: userDb.careerProfile.certifications as any,
        achievements: userDb.careerProfile.achievements as any,
        publications: userDb.careerProfile.publications as any,
        workSamples: userDb.careerProfile.workSamples as any,
        professionalBlueprint: userDb.careerProfile.professionalBlueprint as any,
        extensions: userDb.careerProfile.extensions as any,
        createdAt: userDb.careerProfile.createdAt.toISOString()
      };
    }
    
    const enhancements = (portfolio.enhancements as any) || {};
    return {
      portfolio: {
        ...portfolio,
        templateId: portfolio.templateId as any,
        visibility: portfolio.visibility as any,
        sectionToggles: portfolio.sectionToggles as any,
        sectionOrder: portfolio.sectionOrder as any,
        sectionTitles: portfolio.sectionTitles as any,
        enhancements: portfolio.enhancements as any,
        draftConfiguration: enhancements.draftConfiguration ?? undefined,
        publishedConfiguration: enhancements.publishedConfiguration ?? undefined,
        customAccentColor: portfolio.customAccentColor ?? undefined,
        updatedAt: portfolio.updatedAt.toISOString()
      },
      user,
      careerProfile: cp
    };
  },

  savePortfolio: async (portfolio: Omit<Portfolio, 'id' | 'updatedAt'>): Promise<Portfolio> => {
    const p = await prisma.portfolio.upsert({
      where: { userId: portfolio.userId },
      update: {
        templateId: portfolio.templateId,
        customAccentColor: portfolio.customAccentColor,
        visibility: portfolio.visibility,
        subdomain: portfolio.subdomain,
        sectionToggles: (portfolio.sectionToggles as any) || {},
        sectionOrder: (portfolio.sectionOrder as any) || null,
        sectionTitles: (portfolio.sectionTitles as any) || null,
        enhancements: (portfolio.enhancements as any) || null,
      },
      create: {
        userId: portfolio.userId,
        templateId: portfolio.templateId,
        customAccentColor: portfolio.customAccentColor,
        visibility: portfolio.visibility,
        subdomain: portfolio.subdomain,
        sectionToggles: (portfolio.sectionToggles as any) || {},
        sectionOrder: (portfolio.sectionOrder as any) || null,
        sectionTitles: (portfolio.sectionTitles as any) || null,
        enhancements: (portfolio.enhancements as any) || null,
      }
    });

    return {
      ...p,
      templateId: p.templateId as any,
      visibility: p.visibility as any,
      sectionToggles: p.sectionToggles as any,
      sectionOrder: p.sectionOrder as any,
      sectionTitles: p.sectionTitles as any,
      enhancements: p.enhancements as any,
      customAccentColor: p.customAccentColor ?? undefined,
      updatedAt: p.updatedAt.toISOString()
    };
  },

  updatePortfolio: async (userId: string, data: Partial<Portfolio>): Promise<Portfolio> => {
    const p = await prisma.portfolio.update({
      where: { userId },
      data: {
        templateId: data.templateId,
        customAccentColor: data.customAccentColor,
        visibility: data.visibility,
        subdomain: data.subdomain,
        sectionToggles: data.sectionToggles as any,
        sectionOrder: data.sectionOrder as any,
        sectionTitles: data.sectionTitles as any,
        enhancements: data.enhancements as any,
      }
    });
    
    return {
      ...p,
      templateId: p.templateId as any,
      visibility: p.visibility as any,
      sectionToggles: p.sectionToggles as any,
      sectionOrder: p.sectionOrder as any,
      sectionTitles: p.sectionTitles as any,
      enhancements: p.enhancements as any,
      customAccentColor: p.customAccentColor ?? undefined,
      updatedAt: p.updatedAt.toISOString()
    };
  },

  // Interview Questions
  saveInterviewQuestions: async (questions: Omit<InterviewQuestion, 'id' | 'createdAt'>[]): Promise<void> => {
    await prisma.interviewQuestion.createMany({
      data: questions.map(q => ({
        userId: q.userId,
        question: q.question,
        type: q.type,
        contextRef: q.contextRef,
        suggestedPoints: q.suggestedPoints as any,
        premiumAnswer: q.premiumAnswer as any,
      }))
    });
  },

  getInterviewQuestionsByUserId: async (userId: string): Promise<InterviewQuestion[]> => {
    const questions = await prisma.interviewQuestion.findMany({ where: { userId } });
    return questions.map((q: any) => ({
      ...q,
      type: q.type as any,
      suggestedPoints: q.suggestedPoints as any,
      premiumAnswer: q.premiumAnswer as any,
      createdAt: q.createdAt.toISOString()
    }));
  },

  // Identity Stacks
  saveIdentityStack: async (stack: Omit<IdentityStack, 'id' | 'createdAt'>): Promise<IdentityStack> => {
    const s = await prisma.identityStack.create({
      data: {
        userId: stack.userId,
        profileId: stack.profileId,
        stackName: stack.stackName,
        stackType: stack.stackType,
        generationTier: stack.generationTier,
        profileVersion: stack.profileVersion,
        generationSessionId: stack.generationSessionId,
        isActive: stack.isActive,
      }
    });
    
    return {
      ...s,
      generationSessionId: s.generationSessionId ?? undefined,
      stackType: s.stackType as any,
      generationTier: s.generationTier as any,
      createdAt: s.createdAt.toISOString()
    };
  },

  getIdentityStacksByUserId: async (userId: string): Promise<IdentityStack[]> => {
    const stacks = await prisma.identityStack.findMany({ where: { userId } });
    return stacks.map((s: any) => ({
      ...s,
      generationSessionId: s.generationSessionId ?? undefined,
      stackType: s.stackType as any,
      generationTier: s.generationTier as any,
      createdAt: s.createdAt.toISOString()
    }));
  },

  // Generated Assets
  saveGeneratedAsset: async (asset: Omit<GeneratedAsset, 'id' | 'createdAt'>): Promise<GeneratedAsset> => {
    const a = await prisma.generatedAsset.create({
      data: {
        userId: asset.userId,
        stackId: asset.stackId,
        assetType: asset.assetType,
        assetVariant: asset.assetVariant,
        generatedContent: asset.generatedContent as any,
      }
    });
    
    return {
      ...a,
      assetType: a.assetType as any,
      assetVariant: a.assetVariant as any,
      generatedContent: a.generatedContent as any,
      createdAt: a.createdAt.toISOString()
    };
  },

  getGeneratedAssetsByUserId: async (userId: string): Promise<GeneratedAsset[]> => {
    const assets = await prisma.generatedAsset.findMany({ where: { userId } });
    return assets.map((a: any) => ({
      ...a,
      assetType: a.assetType as any,
      assetVariant: a.assetVariant as any,
      generatedContent: a.generatedContent as any,
      createdAt: a.createdAt.toISOString()
    }));
  },

  // User Deletion / Reset
  deleteUserAndData: async (userId: string): Promise<void> => {
    await prisma.user.delete({ where: { id: userId } });
  },

  resetProfileData: async (userId: string): Promise<void> => {
    await prisma.$transaction([
      prisma.careerProfile.deleteMany({ where: { userId } }),
      prisma.portfolio.deleteMany({ where: { userId } }),
      prisma.interviewQuestion.deleteMany({ where: { userId } }),
      prisma.identityStack.deleteMany({ where: { userId } }),
      prisma.generatedAsset.deleteMany({ where: { userId } }),
    ]);
  },

  // Premium Credits
  addPremiumCredit: async (userId: string, amount: number): Promise<void> => {
    await prisma.careerProfile.update({
      where: { userId },
      data: { premiumCredits: { increment: amount } }
    });
  },

  consumePremiumCredit: async (userId: string): Promise<boolean> => {
    const profile = await prisma.careerProfile.findUnique({ where: { userId } });
    if (!profile || !profile.premiumCredits || profile.premiumCredits < 1) return false;
    
    await prisma.careerProfile.update({
      where: { userId },
      data: { premiumCredits: { decrement: 1 } }
    });
    return true;
  },

  // Premium Sessions (We don't strictly need a DB table if it's transient, but let's mock it using user or just return a fake session for now since there's no PremiumSession model in schema.prisma, wait, let's just create a generic session ID).
  // Actually, since the user already consumed the credit, we can just return a fake sessionId if we don't track them.
  createPremiumSession: async (userId: string, profileId: string): Promise<{ id: string }> => {
    return { id: Math.random().toString(36).substring(2, 11) };
  },

  getPremiumSessionById: async (sessionId: string): Promise<{ id: string, status: string } | undefined> => {
    return { id: sessionId, status: 'pending' };
  },

  updatePremiumSessionStatus: async (sessionId: string, status: string): Promise<void> => {
    // No-op for now unless we add PremiumSession model. The frontend doesn't strictly depend on DB state for this.
  },

  getGeneratedAssetsByStackId: async (stackId: string): Promise<GeneratedAsset[]> => {
    const assets = await prisma.generatedAsset.findMany({ where: { stackId } });
    return assets.map((a: any) => ({
      ...a,
      assetType: a.assetType as any,
      assetVariant: a.assetVariant as any,
      generatedContent: a.generatedContent as any,
      createdAt: a.createdAt.toISOString()
    }));
  },

  updateIdentityStackStatus: async (stackId: string, isActive: boolean): Promise<void> => {
    await prisma.identityStack.update({
      where: { id: stackId },
      data: { isActive }
    });
  }
};
