import { CareerProfile, PortfolioEnhancements } from '@/db/local-db';

/**
 * Merges a generated AI CareerProfile (resume data) with manual portfolio enhancements.
 * This guarantees the portfolio contains a superset of the resume data without modifying
 * the original resume/AI pipeline.
 *
 * @param resumeProfile The base AI-generated or manually filled career profile
 * @param enhancements The user-provided enhancements from the dashboard
 * @returns A new CareerProfile containing the merged data
 */
export function generatePortfolioData(
  resumeProfile: CareerProfile,
  enhancements?: PortfolioEnhancements
): CareerProfile {
  if (!enhancements) {
    return resumeProfile;
  }

  // Deep clone to prevent mutating the original resume data
  const mergedProfile = JSON.parse(JSON.stringify(resumeProfile)) as CareerProfile;

  // Merge Arrays (Projects, Certifications, Experience, Achievements, Publications, WorkSamples)
  if (enhancements.additionalProjects && enhancements.additionalProjects.length > 0) {
    mergedProfile.projects = [...(mergedProfile.projects || []), ...enhancements.additionalProjects];
  }

  if (enhancements.additionalCertifications && enhancements.additionalCertifications.length > 0) {
    mergedProfile.certifications = [...(mergedProfile.certifications || []), ...enhancements.additionalCertifications];
  }

  if (enhancements.additionalExperience && enhancements.additionalExperience.length > 0) {
    mergedProfile.experience = [...(mergedProfile.experience || []), ...enhancements.additionalExperience];
  }

  if (enhancements.additionalAchievements && enhancements.additionalAchievements.length > 0) {
    mergedProfile.achievements = [...(mergedProfile.achievements || []), ...enhancements.additionalAchievements];
  }

  if (enhancements.additionalPublications && enhancements.additionalPublications.length > 0) {
    mergedProfile.publications = [...(mergedProfile.publications || []), ...enhancements.additionalPublications];
  }

  if (enhancements.additionalWorkSamples && enhancements.additionalWorkSamples.length > 0) {
    mergedProfile.workSamples = [...(mergedProfile.workSamples || []), ...enhancements.additionalWorkSamples];
  }

  // Merge External Links seamlessly into the Personal Info
  if (enhancements.externalLinks) {
    mergedProfile.personalInfo = {
      ...(mergedProfile.personalInfo || {}),
      github: enhancements.externalLinks.github || mergedProfile.personalInfo?.github,
      linkedin: enhancements.externalLinks.linkedin || mergedProfile.personalInfo?.linkedin,
    };
    
    // Inject custom links into the website/portfolio link logic if needed
    // Assuming the user might want a primary showcase link to Behance or Dribbble 
    // depending on their profession, this can be managed by the specific renderer templates.
  }

  // Inject Profile Photo URL
  // We attach it to the `personalInfo` block or extensions for the renderer to read
  if (enhancements.profilePhotoUrl) {
    if (!mergedProfile.extensions) {
      mergedProfile.extensions = {};
    }
    (mergedProfile.extensions as any).profilePhotoUrl = enhancements.profilePhotoUrl;
  }

  return mergedProfile;
}
