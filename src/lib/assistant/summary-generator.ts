import { getProfession } from "./profession-registry";

/**
 * Procedurally generates or enhances a professional summary.
 * Weaves in profile details, projects, experience, and ALL ATS keywords of the profession.
 */
export function generateSmartSummary(profile: any, existingSummary?: string): string {
  const professionCategory = profile.professionCategory || 'Professional';
  
  // Fetch profession info for keyword integration
  const profInfo = getProfession(professionCategory);
  const keywords = profInfo?.suggestedKeywords || [];
  
  // Extract top skills, filtering out empty ones
  const skills = profile.skills || [];
  const skillNames = skills.map((s: any) => s.name).filter(Boolean);
  
  // Extract experiences & projects, filtering out empty ones
  const experiences = (profile.experience || []).filter((e: any) => e.title || e.position);
  const latestRole = experiences[0]?.title || experiences[0]?.position;
  const company = experiences[0]?.company;
  
  const projects = (profile.projects || []).filter((p: any) => p.title || p.name);
  const latestProject = projects[0]?.title || projects[0]?.name;

  // Adjectives, transitions, and verbs for high-entropy randomization (ensures unique summary every time)
  const adjectives = ['Results-oriented', 'Innovative', 'Strategic', 'Forward-thinking', 'Dynamic', 'Adaptable', 'High-performing', 'Visionary', 'Analytical', 'Dedicated'];
  const verbs = ['delivering state-of-the-art solutions', 'driving operational excellence', 'spearheading digital transformation', 'fostering cross-functional collaboration', 'optimizing business growth', 'engineering robust frameworks'];
  const focusAreas = ['maximizing corporate efficiency', 'delivering top-tier client experiences', 'unlocking complex scaling problems', 'building sustainable architectures'];
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
  const randomFocus = focusAreas[Math.floor(Math.random() * focusAreas.length)];

  // Helper to ensure first letter is capitalized
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  // Helper to construct a natural sentence listing all keywords
  const generateKeywordIntegrationSentence = (kws: string[]): string => {
    if (kws.length === 0) return '';
    const templates = [
      `Adept at managing end-to-end deliverables with specialized competence across ${kws.slice(0, -1).join(', ')}, and ${kws[kws.length - 1]}.`,
      `Demonstrates strong hands-on capabilities across core domains including ${kws.slice(0, -1).join(', ')}, and ${kws[kws.length - 1]}.`,
      `Utilizes disciplined methodologies to execute tasks involving ${kws.slice(0, -1).join(', ')}, and ${kws[kws.length - 1]} to drive product value.`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  };

  // If the user has an existing summary, enhance it rather than overwriting it completely!
  if (existingSummary && existingSummary.trim().length > 10) {
    let enhanced = existingSummary.trim();
    if (!enhanced.endsWith('.')) {
      enhanced += '.';
    }
    
    // Find missing keywords
    const lowerSummary = enhanced.toLowerCase();
    const missingKeywords = keywords.filter(kw => !lowerSummary.includes(kw.toLowerCase()));
    
    if (missingKeywords.length > 0) {
      // Add missing keywords in a new random sentence
      const keywordSentence = generateKeywordIntegrationSentence(missingKeywords);
      enhanced += ` ${keywordSentence}`;
    } else {
      // If all keywords are already present, add a random professional outcome sentence to make it different
      const outcomeTemplates = [
        ` Continually aiming to leverage this background to streamline workflows and deliver next-level corporate milestones.`,
        ` Focused on driving continuous improvement, technical innovation, and strategic value at every level.`,
        ` Committed to delivering robust, scalable outcomes that align closely with organization-wide targets.`
      ];
      enhanced += outcomeTemplates[Math.floor(Math.random() * outcomeTemplates.length)];
    }

    // Add extra professional context if summary is on the shorter side
    if (enhanced.length < 220) {
      let extraInfo = '';
      if (skillNames.length > 0) {
        const skillList = skillNames.slice(0, 3).join(', ');
        extraInfo += ` Adept with tools and frameworks such as ${skillList}.`;
      }
      if (latestRole) {
        extraInfo += ` Experienced in execution as a ${latestRole}${company ? ` at ${company}` : ''}.`;
      }
      enhanced += extraInfo;
    }

    return enhanced;
  }

  // Otherwise, construct a brand new, highly customized, non-generic summary containing ALL keywords
  
  // Sentence 1: Intro with dynamic skills and randomization
  let sentence1 = '';
  const randNum = Math.random();
  if (skillNames.length >= 3) {
    sentence1 = `${randomAdjective} ${professionCategory} with specialized expertise in ${skillNames[0]}, ${skillNames[1]}, and ${skillNames[2]}, focusing on ${randomFocus}.`;
  } else if (skillNames.length > 0) {
    sentence1 = `${randomAdjective} ${professionCategory} offering proven proficiency in ${skillNames.join(' and ')} to support core operations.`;
  } else {
    sentence1 = `${randomAdjective} ${professionCategory} dedicated to ${randomVerb} and achieving outstanding business milestones.`;
  }

  // Sentence 2: Experience / Projects details
  let sentence2 = '';
  if (latestRole && latestProject) {
    const rolesTemplates = [
      `Brings hands-on leadership as a ${latestRole}, recently driving key successes in the "${latestProject}" project.`,
      `Leverages a solid background as a ${latestRole} to deploy complex solutions, including the "${latestProject}" initiative.`,
      `Demonstrated excellence in roles like ${latestRole}, executing key initiatives such as "${latestProject}".`
    ];
    sentence2 = rolesTemplates[Math.floor(Math.random() * rolesTemplates.length)];
  } else if (latestRole) {
    sentence2 = `Leverages extensive experience as a ${latestRole} to deliver high-quality outcomes and optimize workflows.`;
  } else if (latestProject) {
    sentence2 = `Proven capability in successfully orchestrating high-value initiatives like the "${latestProject}" project.`;
  } else {
    sentence2 = `Brings a solid dedication to operational excellence, project execution, and cross-functional success.`;
  }

  // Sentence 3: Keyword integration (Guarantees ALL keywords of the profession are present)
  const sentence3 = generateKeywordIntegrationSentence(keywords);

  // Sentence 4: Dynamic concluding vision statement
  const conclusionPhrases = [
    ` Passionate about building premium systems, fostering client relationships, and scaling project deliveries.`,
    ` Focused on aligning engineering and management best practices with immediate and long-term corporate vision.`,
    ` Dedicated to continuous technical refinement and implementing modern standards to elevate team results.`
  ];
  const sentence4 = conclusionPhrases[Math.floor(Math.random() * conclusionPhrases.length)];

  // Join them cleanly
  return [sentence1, sentence2, sentence3, sentence4].filter(Boolean).join(' ');
}
