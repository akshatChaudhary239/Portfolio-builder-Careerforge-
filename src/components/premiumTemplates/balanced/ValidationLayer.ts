import { BalancedResumeResult } from '@/lib/ai-service';

export const BalancedValidationLayer = {
  validate: (profile: any): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    if (!profile) return { isValid: false, errors: ['Profile is undefined'] };
    
    if (!profile.fullName) errors.push('Missing fullName');
    if (!profile.professionalProfile) errors.push('Missing professionalProfile');
    
    if (!profile.coreCompetencies || !Array.isArray(profile.coreCompetencies.technical) || !Array.isArray(profile.coreCompetencies.leadership)) {
      errors.push('Missing or invalid coreCompetencies (requires technical and leadership arrays)');
    }

    if (profile.experience && Array.isArray(profile.experience)) {
      profile.experience.forEach((e: any, idx: number) => {
        if (!e.achievements || e.achievements.length < 3) {
          errors.push(`Experience "${e.company || idx}" must have at least 3 achievements`);
        }
      });
    }

    if (profile.projects && Array.isArray(profile.projects)) {
      profile.projects.forEach((p: any, idx: number) => {
        if (!p.title) errors.push(`Project ${idx} is missing a title`);
        if (!p.achievements || p.achievements.length < 3) {
          errors.push(`Project "${p.title || idx}" must have at least 3 achievements`);
        }
      });
    }

    return { isValid: errors.length === 0, errors };
  },

  upgrade: (profile: any, careerProfile: any): BalancedResumeResult => {
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

    // 2. Profile
    result.professionalProfile = result.professionalProfile || result.summary || careerProfile?.summary || 'Experienced professional specializing in delivery and technical execution.';

    // 3. Competencies
    if (!result.coreCompetencies) {
      result.coreCompetencies = { technical: [], leadership: [] };
    }
    if (!result.coreCompetencies.technical || !Array.isArray(result.coreCompetencies.technical)) {
      const origSkills = careerProfile?.skills?.map((s: any) => typeof s === 'string' ? s : s.name) || [];
      result.coreCompetencies.technical = origSkills.length > 0 ? origSkills.slice(0, 8) : ['Software Development', 'Technical Integration'];
    }
    if (!result.coreCompetencies.leadership || !Array.isArray(result.coreCompetencies.leadership)) {
      result.coreCompetencies.leadership = ['Project Delivery', 'Team Collaboration', 'Problem Solving', 'Stakeholder Communication'];
    }

    // 4. Experience
    const expArray = Array.isArray(result.experience) ? result.experience : (Array.isArray(careerProfile?.experience) ? careerProfile.experience : []);
    result.experience = expArray.map((e: any, idx: number) => {
      const origExp = careerProfile?.experience?.[idx] || {};
      const achievements = e.achievements || e.highlights || origExp.achievements || origExp.highlights || [];
      const combined = Array.isArray(achievements) ? [...achievements] : [];

      while (combined.length < 3) {
        if (combined.length === 0) {
          combined.push(`Executed key deliverables and met milestones for ${e.company || origExp.company || 'the organization'}.`);
        } else if (combined.length === 1) {
          combined.push(`Collaborated within cross-functional teams to ensure high quality and standard output.`);
        } else {
          combined.push(`Contributed to continuous improvement and optimized workflow processes.`);
        }
      }

      return {
        company: e.company || origExp.company || '',
        position: e.position || origExp.position || '',
        location: e.location || origExp.location || '',
        startDate: e.startDate || origExp.startDate || '',
        endDate: e.endDate || origExp.endDate || '',
        current: e.current !== undefined ? e.current : (e.currentlyWorking || origExp.currentlyWorking || false),
        achievements: combined
      };
    });

    // 5. Projects
    const projArray = Array.isArray(result.projects) ? result.projects : (Array.isArray(careerProfile?.projects) ? careerProfile.projects : []);
    result.projects = projArray.map((p: any, idx: number) => {
      const origProj = careerProfile?.projects?.[idx] || {};
      const title = p.title || p.name || origProj.title || origProj.name || `Project ${idx + 1}`;
      const achievements = p.achievements || p.highlights || origProj.achievements || origProj.highlights || [];
      const combined = Array.isArray(achievements) ? [...achievements] : [];

      const overview = p.overview || p.description || origProj.description || '';
      const techStack = p.techStack || p.technologies || origProj.technologies || [];
      const link = p.link || p.liveUrl || origProj.liveUrl || '';
      const github = p.github || p.githubUrl || origProj.githubUrl || '';

      while (combined.length < 3) {
        if (combined.length === 0) {
          combined.push(overview ? `Developed: ${overview}` : `Spearheaded design and construction of the ${title} initiative.`);
        } else if (combined.length === 1) {
          const problemText = p.problemSolved || origProj.problemSolved || '';
          combined.push(problemText ? `Resolved: ${problemText}` : `Leveraged modern tools including ${techStack.join(', ') || 'standard stacks'} to implement codebase.`);
        } else {
          const impactText = p.keyImpact || p.outcome || origProj.impact || '';
          combined.push(impactText ? `Resulted in: ${impactText}` : `Ensured clean system testing, optimization, and documentation.`);
        }
      }

      return {
        title,
        overview,
        achievements: combined,
        techStack,
        link,
        github
      };
    });

    // 6. Certifications & Achievements
    result.certifications = (result.certifications && result.certifications.length > 0) ? result.certifications : (careerProfile?.certifications || []);
    result.achievements = (result.achievements && result.achievements.length > 0) ? result.achievements : (careerProfile?.achievements || []);

    // 7. Dynamic Personalization Properties
    result.professionalBlueprint = careerProfile?.professionalBlueprint || result.professionalBlueprint;
    result.extensions = careerProfile?.extensions || result.extensions;
    result.publications = careerProfile?.publications || result.publications || [];
    result.workSamples = careerProfile?.workSamples || result.workSamples || [];
    result.professionCategory = careerProfile?.professionCategory || result.professionCategory;

    return result as BalancedResumeResult;
  }
};
