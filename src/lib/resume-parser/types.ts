/**
 * types.ts — GetProspectra Resume Parser v4
 * All shared TypeScript interfaces for the resume-parser module.
 */

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

export interface Project {
  name: string;
  technologies: string[];
  description: string;
  problemSolved: string;
  impact: string;
  githubUrl: string;
  liveUrl: string;
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
  github: string;
  linkedin: string;
  website: string;
}

export interface ConfidenceScores {
  fullName: number;
  email: number;
  phone: number;
  location: number;
  skills: number;
  education: number;
  experience: number;
  projects: number;
  certifications: number;
  overall: number;
}

export interface DetectedSections {
  headerLines: string[];
  summaryLines: string[];
  skillsLines: string[];
  projectsLines: string[];
  experienceLines: string[];
  educationLines: string[];
  certificationLines: string[];
  achievementLines: string[];
  publicationLines: string[];
}

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

export interface ParserDebugInfo {
  sectionsDetected: string[];
  projectsAccepted: string[];
  projectsRejected: { item: string; reason: string }[];
  experienceAccepted: string[];
  experienceRejected: { item: string; reason: string }[];
  aiUsed: boolean;
  aiStatus: 'success' | 'failed' | 'skipped';
  confidenceScores: ConfidenceScores;
  validationErrors: string[];
}

/** The final output of parseResume() */
export interface ParsedResumeResult {
  personalInfo: PersonalInfo;
  summary: string;
  skills: Skill[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  achievements: Achievement[];
  confidenceScores: ConfidenceScores;
  rawText: string;
  extractedAt: string;
  originalFileName?: string;
  isPartialExtraction: boolean;
  parserDebug?: ParserDebugInfo;
}
