import fs from 'fs';
import path from 'path';

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

export interface DeveloperShowcase extends ShowcaseItem {
  githubUrl?: string;
  liveUrl?: string;
  techStack?: string[];
  openSourceLinks?: string[];
}

export interface DesignerShowcase extends ShowcaseItem {
  behanceUrl?: string;
  dribbbleUrl?: string;
  figmaUrl?: string;
  designTools?: string[];
}

export interface DataAnalystShowcase extends ShowcaseItem {
  tools?: string[];
  dashboardUrl?: string;
  datasetType?: string;
}

export interface BusinessShowcase extends ShowcaseItem {
  domain?: string;
  teamSize?: string;
  impact?: string;
  presentationUrl?: string;
}

export interface MarketingShowcase extends ShowcaseItem {
  campaignType?: string;
  reach?: string;
  conversions?: string;
  campaignUrl?: string;
}

export interface LawShowcase extends ShowcaseItem {
  practiceArea?: string;
  caseType?: string;
  publicationUrl?: string;
}

export interface HRShowcase extends ShowcaseItem {
  initiativeType?: string;
  participants?: string;
}

export interface FinanceShowcase extends ShowcaseItem {
  modelType?: string;
  valuationType?: string;
  reportUrl?: string;
}

export interface GeneralShowcase extends ShowcaseItem {
  category?: string;
  supportingUrl?: string;
}

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
  updatedAt: string;
}

export interface InterviewQuestion {
  id: string;
  userId: string;
  question: string;
  type: 'technical' | 'behavioral';
  contextRef?: string; // refers to a specific project or experience
  suggestedPoints?: string[]; // professional pointers/guidelines
  premiumAnswer?: any; // premium generated answer framework
  createdAt: string;
}


export interface IdentityStack {
  id: string;
  userId: string;
  profileId: string;
  stackName: string;
  stackType: 'free' | 'premium' | 'executive' | 'product_builder' | 'interactive_showcase';
  generationTier: 'free' | 'premium';
  profileVersion: string; // snapshot hash or timestamp
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
  generatedContent: any; // storing JSON configurations for templates
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

export interface DBState {
  users: User[];
  careerProfiles: CareerProfile[];
  portfolios: Portfolio[];
  interviewQuestions: InterviewQuestion[];
  identityStacks: IdentityStack[];
  generatedAssets: GeneratedAsset[];
  premiumGenerations: PremiumGenerationSession[];
}

// --- DB STORAGE & PERSISTENCE ---

const DB_FILE = path.join(process.cwd(), 'src', 'db', 'db-storage.json');

function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function normalizeStringArray(arr: any): string[] {
  if (!Array.isArray(arr)) return [];
  return arr.map(item => {
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && item !== null) {
      return item.bulletPoint || item.description || item.title || item.name || Object.values(item)[0] || '';
    }
    return String(item || '');
  }).filter(Boolean) as string[];
}

function normalizeCareerProfile(profile: any): void {
  if (Array.isArray(profile.experience)) {
    profile.experience.forEach((exp: any) => {
      exp.achievements = normalizeStringArray(exp.achievements);
      exp.technologies = normalizeStringArray(exp.technologies);
    });
  }
  if (Array.isArray(profile.projects)) {
    profile.projects.forEach((proj: any) => {
      proj.achievements = normalizeStringArray(proj.achievements);
      proj.technologies = normalizeStringArray(proj.technologies);
    });
  }
}

function loadDB(): DBState {
  try {
    ensureDirectoryExistence(DB_FILE);
    if (!fs.existsSync(DB_FILE)) {
      const initial: DBState = {
        users: [],
        careerProfiles: [],
        portfolios: [],
        interviewQuestions: [],
        identityStacks: [],
        generatedAssets: [],
        premiumGenerations: [],
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    
    let state: DBState = {
      users: parsed.users || [],
      careerProfiles: parsed.careerProfiles || parsed.parsedData || [],
      portfolios: parsed.portfolios || [],
      interviewQuestions: parsed.interviewQuestions || [],
      identityStacks: parsed.identityStacks || [],
      generatedAssets: parsed.generatedAssets || [],
      premiumGenerations: parsed.premiumGenerations || [],
    };

    // NORMALIZE CORRUPTED DATA
    state.careerProfiles.forEach(normalizeCareerProfile);

    // MIGRATION: Convert old generated assets to a Default Stack if missing
    if (state.generatedAssets.length > 0 && state.identityStacks.length === 0) {
      const userIds = Array.from(new Set(state.generatedAssets.map(a => a.userId)));
      
      userIds.forEach(userId => {
        const userAssets = state.generatedAssets.filter(a => a.userId === userId);
        const profileId = (userAssets[0] as any)?.profileId || 'legacy-profile';
        const stackId = 'stack_' + Math.random().toString(36).substring(2, 9);
        
        const defaultStack: IdentityStack = {
          id: stackId,
          userId: userId,
          profileId: profileId,
          stackName: 'Developer Stack',
          stackType: 'free',
          generationTier: 'free',
          profileVersion: 'legacy',
          isActive: true,
          createdAt: new Date().toISOString()
        };
        
        state.identityStacks.push(defaultStack);
        
        // Update assets to point to this new stack
        userAssets.forEach(a => {
          a.stackId = stackId;
        });
      });
      
      // Save the migrated DB
      fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
    }

    return state;
  } catch (err) {
    console.error('Error loading local DB file, returning empty state', err);
    return {
      users: [],
      careerProfiles: [],
      portfolios: [],
      interviewQuestions: [],
      identityStacks: [],
      generatedAssets: [],
      premiumGenerations: [],
    };
  }
}

function saveDB(state: DBState) {
  try {
    ensureDirectoryExistence(DB_FILE);
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local DB file', err);
  }
}

function migrateProfileBlueprint(profile: CareerProfile | undefined, db: DBState): boolean {
  if (profile && !profile.professionalBlueprint) {
    try {
      const { generateProfessionalBlueprint } = require('../lib/blueprint-engine');
      profile.professionalBlueprint = generateProfessionalBlueprint(profile);
      return true;
    } catch (err) {
      console.error('Failed to lazy generate blueprint:', err);
    }
  }
  return false;
}

// --- LOCAL DB ACTIONS (SYNCHRONOUS TO BE THREAD-SAFE IN MEMORY/FILE) ---

export const LocalDB = {
  // Users
  getUserByEmail: (email: string): User | undefined => {
    const db = loadDB();
    return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  getUserById: (id: string): User | undefined => {
    const db = loadDB();
    return db.users.find((u) => u.id === id);
  },

  createUser: (user: Omit<User, 'id' | 'createdAt'>): User => {
    const db = loadDB();
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    saveDB(db);
    return newUser;
  },

  // Parsed Data / Identity
  getCareerProfileByUserId: (userId: string): CareerProfile | undefined => {
    const db = loadDB();
    const profile = db.careerProfiles.find((d) => d.userId === userId);
    if (migrateProfileBlueprint(profile, db)) {
      saveDB(db);
    }
    return profile;
  },

  saveCareerProfile: (data: Omit<CareerProfile, 'id' | 'createdAt'>): CareerProfile => {
    const db = loadDB();
    // Delete existing to act as an upsert
    db.careerProfiles = db.careerProfiles.filter((d) => d.userId !== data.userId);

    const newData: CareerProfile = {
      ...data,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
    };
    normalizeCareerProfile(newData);
    db.careerProfiles.push(newData);
    saveDB(db);
    return newData;
  },

  updateCareerProfile: (userId: string, data: Partial<CareerProfile>): CareerProfile => {
    const db = loadDB();
    const index = db.careerProfiles.findIndex((d) => d.userId === userId);
    if (index === -1) {
      throw new Error(`No profile data found for user ID: ${userId}`);
    }
    const updated = {
      ...db.careerProfiles[index],
      ...data,
      personalInfo: data.personalInfo ?? db.careerProfiles[index].personalInfo,
      education: data.education ?? db.careerProfiles[index].education,
      experience: data.experience ?? db.careerProfiles[index].experience,
      skills: data.skills ?? db.careerProfiles[index].skills,
      certifications: data.certifications ?? db.careerProfiles[index].certifications,
      projects: data.projects ?? db.careerProfiles[index].projects,
      achievements: data.achievements ?? db.careerProfiles[index].achievements,
      publications: data.publications ?? db.careerProfiles[index].publications,
      workSamples: data.workSamples ?? db.careerProfiles[index].workSamples,
      extensions: data.extensions ?? db.careerProfiles[index].extensions,
    };
    normalizeCareerProfile(updated);
    db.careerProfiles[index] = updated;
    saveDB(db);
    return updated;
  },

  // Portfolios
  getPortfolioByUserId: (userId: string): Portfolio | undefined => {
    const db = loadDB();
    return db.portfolios.find((p) => p.userId === userId);
  },

  getPortfolioBySubdomain: (subdomain: string): { portfolio: Portfolio; user: User; careerProfile?: CareerProfile } | undefined => {
    const db = loadDB();
    const portfolio = db.portfolios.find((p) => p.subdomain === subdomain);
    if (!portfolio) return undefined;
    const user = db.users.find((u) => u.id === portfolio.userId);
    if (!user) return undefined;
    const careerProfile = db.careerProfiles.find((d) => d.userId === portfolio.userId);
    if (migrateProfileBlueprint(careerProfile, db)) {
      saveDB(db);
    }
    return { portfolio, user, careerProfile };
  },

  savePortfolio: (portfolio: Omit<Portfolio, 'id' | 'updatedAt'>): Portfolio => {
    const db = loadDB();
    db.portfolios = db.portfolios.filter((p) => p.userId !== portfolio.userId);

    const newPortfolio: Portfolio = {
      ...portfolio,
      id: Math.random().toString(36).substring(2, 11),
      updatedAt: new Date().toISOString(),
    };
    db.portfolios.push(newPortfolio);
    saveDB(db);
    return newPortfolio;
  },

  updatePortfolio: (userId: string, data: Partial<Portfolio>): Portfolio => {
    const db = loadDB();
    const index = db.portfolios.findIndex((p) => p.userId === userId);
    if (index === -1) {
      throw new Error(`No portfolio found for user ID: ${userId}`);
    }
    const updated = {
      ...db.portfolios[index],
      ...data,
      sectionToggles: data.sectionToggles ?? db.portfolios[index].sectionToggles,
      updatedAt: new Date().toISOString(),
    };
    db.portfolios[index] = updated;
    saveDB(db);
    return updated;
  },

  // Interview Questions
  getInterviewQuestionsByUserId: (userId: string): InterviewQuestion[] => {
    const db = loadDB();
    return db.interviewQuestions.filter((q) => q.userId === userId);
  },

  saveInterviewQuestions: (userId: string, questions: Omit<InterviewQuestion, 'id' | 'userId' | 'createdAt'>[]): InterviewQuestion[] => {
    const db = loadDB();
    // Clear out old questions
    db.interviewQuestions = db.interviewQuestions.filter((q) => q.userId !== userId);

    const savedQuestions = questions.map((q) => ({
      ...q,
      id: Math.random().toString(36).substring(2, 11),
      userId,
      createdAt: new Date().toISOString(),
    }));

    db.interviewQuestions.push(...savedQuestions);
    saveDB(db);
    return savedQuestions;
  },

  // Reset all profile details for re-onboarding/testing
  resetProfileData: (userId: string): void => {
    const db = loadDB();
    db.careerProfiles = db.careerProfiles.filter((d) => d.userId !== userId);
    db.portfolios = db.portfolios.filter((p) => p.userId !== userId);
    db.interviewQuestions = db.interviewQuestions.filter((q) => q.userId !== userId);
    saveDB(db);
  },

  // --- PREMIUM SYSTEM ---
  addPremiumCredit: (userId: string, amount: number = 1): void => {
    const db = loadDB();
    const user = db.users.find(u => u.id === userId);
    if (user) {
      user.premiumCredits = (user.premiumCredits || 0) + amount;
      saveDB(db);
    }
  },
  
  consumePremiumCredit: (userId: string): boolean => {
    const db = loadDB();
    const user = db.users.find(u => u.id === userId);
    if (user && (user.premiumCredits || 0) > 0) {
      user.premiumCredits = user.premiumCredits! - 1;
      saveDB(db);
      return true;
    }
    return false;
  },
  
  createPremiumSession: (userId: string, profileId: string, paymentId?: string): PremiumGenerationSession => {
    const db = loadDB();
    const session: PremiumGenerationSession = {
      id: Math.random().toString(36).substring(2, 11),
      userId,
      profileId,
      status: 'pending',
      paymentId,
      createdAt: new Date().toISOString()
    };
    db.premiumGenerations.push(session);
    saveDB(db);
    return session;
  },

  getPremiumSessionById: (sessionId: string): PremiumGenerationSession | undefined => {
    const db = loadDB();
    return db.premiumGenerations.find(s => s.id === sessionId);
  },
  
  updatePremiumSessionStatus: (sessionId: string, status: 'completed' | 'failed'): void => {
    const db = loadDB();
    const session = db.premiumGenerations.find(s => s.id === sessionId);
    if (session) {
      session.status = status;
      if (status === 'completed') session.completedAt = new Date().toISOString();
      saveDB(db);
    }
  },
  
  saveGeneratedAssets: (assets: Omit<GeneratedAsset, 'id' | 'createdAt'>[]): GeneratedAsset[] => {
    const db = loadDB();
    const newAssets: GeneratedAsset[] = assets.map(a => ({
      ...a,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString()
    }));
    db.generatedAssets.push(...newAssets);
    saveDB(db);
    return newAssets;
  },

  updateGeneratedAsset: (assetId: string, newContent: any): void => {
    const db = loadDB();
    const asset = db.generatedAssets.find(a => a.id === assetId);
    if (asset) {
      asset.generatedContent = newContent;
      saveDB(db);
    }
  },
  
  getGeneratedAssetsByUserId: (userId: string): GeneratedAsset[] => {
    const db = loadDB();
    return db.generatedAssets.filter(a => a.userId === userId);
  },

  getGeneratedAssetsByStackId: (stackId: string): GeneratedAsset[] => {
    const db = loadDB();
    return db.generatedAssets.filter(a => a.stackId === stackId);
  },

  getIdentityStacksByUserId: (userId: string): IdentityStack[] => {
    const db = loadDB();
    return db.identityStacks.filter(s => s.userId === userId);
  },

  createIdentityStack: (stack: Omit<IdentityStack, 'id' | 'createdAt'>): IdentityStack => {
    const db = loadDB();
    
    // If this new stack is active, deactivate others for this user
    if (stack.isActive) {
      db.identityStacks.forEach(s => {
        if (s.userId === stack.userId) {
          s.isActive = false;
        }
      });
    }

    const newStack: IdentityStack = {
      ...stack,
      id: 'stack_' + Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString()
    };
    db.identityStacks.push(newStack);
    saveDB(db);
    return newStack;
  },

  updateIdentityStackStatus: (stackId: string, isActive: boolean): void => {
    const db = loadDB();
    const target = db.identityStacks.find(s => s.id === stackId);
    if (target) {
      if (isActive) {
        db.identityStacks.forEach(s => {
          if (s.userId === target.userId) {
            s.isActive = false;
          }
        });
      }
      target.isActive = isActive;
      saveDB(db);
    }
  }
};
