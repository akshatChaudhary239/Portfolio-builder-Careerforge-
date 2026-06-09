/**
 * confidence.ts — Phase 11: Confidence Scoring Engine
 * Scores each field based on actual extraction quality.
 * Never fakes scores — low data = low score.
 */

import { ConfidenceScores } from './types';
import { Experience, Project, Education, Certification, Skill } from './types';

interface ConfidenceInput {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  skills: Skill[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
}

export function calculateConfidence(data: ConfidenceInput): ConfidenceScores {
  // Contact fields
  const email = data.email ? 100 : 0;
  const phone = data.phone ? 100 : 0;
  const location = data.location ? 85 : 0;

  // Name: higher confidence for 2+ word names
  const fullName = !data.fullName ? 0
    : data.fullName.split(' ').length >= 2 ? 95
    : 60;

  // Skills
  const sc = data.skills.length;
  const skills = sc >= 10 ? 90 : sc >= 6 ? 75 : sc >= 3 ? 55 : sc > 0 ? 35 : 0;

  // Education: both institution + degree = high confidence
  const edu = data.education[0];
  const education = !edu ? 0
    : edu.institution && edu.degree ? 90
    : edu.institution || edu.degree ? 60
    : 0;

  // Experience: company + role + bullets = high confidence
  const exp = data.experience[0];
  const experience = !exp ? 0
    : exp.achievements.length > 0 ? 88
    : exp.company && exp.position ? 70
    : exp.company || exp.position ? 45
    : 0;

  // Projects: title + description/bullets = high confidence
  const proj = data.projects[0];
  const projects = !proj ? 0
    : (proj.technologies.length > 0 || proj.description) ? 82
    : proj.name ? 50
    : 0;

  // Certifications
  const cc = data.certifications.length;
  const certifications = cc >= 3 ? 88 : cc >= 1 ? 65 : 0;

  // Overall weighted score
  const overall = Math.round(
    email        * 0.15 +
    phone        * 0.10 +
    fullName     * 0.20 +
    skills       * 0.15 +
    education    * 0.12 +
    experience   * 0.15 +
    projects     * 0.13
  );

  return { fullName, email, phone, location, skills, education, experience, projects, certifications, overall };
}
