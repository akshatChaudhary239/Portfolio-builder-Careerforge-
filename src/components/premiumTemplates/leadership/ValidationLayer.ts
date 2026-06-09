import { LeadershipResumeResult } from '@/lib/ai-service';

export class LeadershipValidationLayer {
  static validate(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data) {
      return { isValid: false, errors: ['No data provided'] };
    }

    if (!data.fullName) errors.push('Missing fullName');
    if (!data.leadershipProfile) errors.push('Missing leadershipProfile');
    
    if (!data.leadershipHighlights || !Array.isArray(data.leadershipHighlights)) {
      errors.push('Missing or invalid leadershipHighlights');
    } else if (data.leadershipHighlights.length < 3) {
      errors.push(`Not enough leadershipHighlights (found ${data.leadershipHighlights.length}, need >= 3)`);
    }

    if (!data.coreStrengths || !Array.isArray(data.coreStrengths)) {
      errors.push('Missing or invalid coreStrengths');
    }

    if (data.projects && Array.isArray(data.projects)) {
      data.projects.forEach((p: any, idx: number) => {
        if (!p.title) errors.push(`Project at index ${idx} is missing a title`);
        if (!p.role) errors.push(`Project "${p.title || idx}" is missing a leadership role`);
        if (!p.achievements || !Array.isArray(p.achievements) || p.achievements.length < 3) {
          errors.push(`Project "${p.title || idx}" must have at least 3 achievements`);
        }
      });
    }

    if (data.experience && Array.isArray(data.experience)) {
      data.experience.forEach((e: any, idx: number) => {
        if (!e.company) errors.push(`Experience at index ${idx} is missing a company`);
        if (!e.position) errors.push(`Experience "${e.company || idx}" is missing a position`);
        if (!e.achievements || !Array.isArray(e.achievements) || e.achievements.length < 3) {
          errors.push(`Experience "${e.company || idx}" must have at least 3 achievements`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static upgrade(profile: any, careerProfile: any): LeadershipResumeResult {
    if (!profile) profile = {};
    const result = { ...profile };

    // 1. Basic Info
    result.fullName = result.fullName || careerProfile?.personalInfo?.fullName || '';
    result.email = result.email || careerProfile?.personalInfo?.email || '';
    result.phone = result.phone || careerProfile?.personalInfo?.phone || '';
    result.location = result.location || careerProfile?.personalInfo?.location || '';
    result.title = result.title || careerProfile?.professionCategory || 'Professional';
    result.website = result.website || careerProfile?.personalInfo?.website || '';
    result.github = result.github || careerProfile?.personalInfo?.github || '';
    result.linkedin = result.linkedin || careerProfile?.personalInfo?.linkedin || '';

    // 2. Leadership Profile
    result.leadershipProfile = result.leadershipProfile || result.summary || careerProfile?.summary || 'Executive leader with a track record of driving strategic goals and team success.';

    // 3. Leadership Highlights (need >= 3)
    const highlights = result.leadershipHighlights || result.highlights || [];
    const combinedHighlights = Array.isArray(highlights) ? [...highlights] : [];
    while (combinedHighlights.length < 3) {
      if (combinedHighlights.length === 0) {
        combinedHighlights.push('Steered critical project delivery aligning with organizational objectives.');
      } else if (combinedHighlights.length === 1) {
        combinedHighlights.push('Fostered collaborative team culture resulting in improved workflow efficiency.');
      } else {
        combinedHighlights.push('Championed problem-solving initiatives to resolve complex operational blockers.');
      }
    }
    result.leadershipHighlights = combinedHighlights;

    // 4. Core Strengths
    if (!result.coreStrengths || !Array.isArray(result.coreStrengths)) {
      const origSkills = careerProfile?.skills?.map((s: any) => typeof s === 'string' ? s : s.name) || [];
      result.coreStrengths = origSkills.length > 0 ? origSkills.slice(0, 8) : ['Strategic Planning', 'Team Leadership', 'Project Ownership'];
    }

    // 5. Experience
    const expArray = Array.isArray(result.experience) ? result.experience : (Array.isArray(careerProfile?.experience) ? careerProfile.experience : []);
    result.experience = expArray.map((e: any, idx: number) => {
      const origExp = careerProfile?.experience?.[idx] || {};
      const achievements = e.achievements || e.highlights || origExp.achievements || origExp.highlights || [];
      const combined = Array.isArray(achievements) ? [...achievements] : [];

      while (combined.length < 3) {
        if (combined.length === 0) {
          combined.push(`Spearheaded operations and took initiative to manage key outcomes for ${e.company || origExp.company || 'the division'}.`);
        } else if (combined.length === 1) {
          combined.push(`Coordinated group efforts and directed resources to meet timeline constraints.`);
        } else {
          combined.push(`Owned execution and accountability for delivering high-impact business solutions.`);
        }
      }

      return {
        company: e.company || origExp.company || '',
        position: e.position || origExp.position || '',
        location: e.location || origExp.location || '',
        startDate: e.startDate || origExp.startDate || '',
        endDate: e.endDate || origExp.endDate || '',
        current: e.current !== undefined ? e.current : (e.currentlyWorking || origExp.currentlyWorking || false),
        achievements: combined,
        leadershipSkills: e.leadershipSkills || 'Leadership, Ownership, Project Delivery'
      };
    });

    // 6. Projects
    const projArray = Array.isArray(result.projects) ? result.projects : (Array.isArray(careerProfile?.projects) ? careerProfile.projects : []);
    result.projects = projArray.map((p: any, idx: number) => {
      const origProj = careerProfile?.projects?.[idx] || {};
      const title = p.title || p.name || origProj.title || origProj.name || `Project Initiative ${idx + 1}`;
      const role = p.role || 'Project Lead';
      const achievements = p.achievements || p.highlights || origProj.achievements || origProj.highlights || [];
      const combined = Array.isArray(achievements) ? [...achievements] : [];

      const overview = p.overview || p.description || origProj.description || '';
      const technologies = p.technologies || p.techStack || origProj.technologies || [];
      const link = p.link || p.liveUrl || origProj.liveUrl || '';
      const github = p.github || p.githubUrl || origProj.githubUrl || '';

      while (combined.length < 3) {
        if (combined.length === 0) {
          combined.push(overview ? `Led: ${overview}` : `Directed the conceptualization and strategic rollout of the ${title} initiative.`);
        } else if (combined.length === 1) {
          const problemText = p.problemSolved || origProj.problemSolved || '';
          combined.push(problemText ? `Resolved: ${problemText}` : `Managed project milestones using ${technologies.join(', ') || 'standard resources'}.`);
        } else {
          const impactText = p.keyImpact || p.outcome || origProj.impact || '';
          combined.push(impactText ? `Achieved: ${impactText}` : `Delegated tasks, coordinated review sessions, and ensured project success.`);
        }
      }

      return {
        title,
        role,
        overview,
        achievements: combined,
        technologies,
        link,
        github
      };
    });

    // 7. Certifications & Achievements
    result.certifications = (result.certifications && result.certifications.length > 0) ? result.certifications : (careerProfile?.certifications || []);
    result.achievements = (result.achievements && result.achievements.length > 0) ? result.achievements : (careerProfile?.achievements || []);

    // 8. Dynamic Personalization Properties
    result.professionalBlueprint = careerProfile?.professionalBlueprint || result.professionalBlueprint;
    result.extensions = careerProfile?.extensions || result.extensions;
    result.publications = careerProfile?.publications || result.publications || [];
    result.workSamples = careerProfile?.workSamples || result.workSamples || [];
    result.professionCategory = careerProfile?.professionCategory || result.professionCategory;

    return result as LeadershipResumeResult;
  }
}
