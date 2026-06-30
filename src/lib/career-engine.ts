// Statically import the JSON files so they are bundled by Next.js and fully browser-safe (no 'fs' module errors in client components)
import frontendRole from './knowledge-base/developer/frontend.json';
import backendRole from './knowledge-base/developer/backend.json';
import uiuxRole from './knowledge-base/designer/uiux.json';
import digitalRole from './knowledge-base/marketing/digital.json';
import financialAnalystRole from './knowledge-base/finance/financial-analyst.json';
import recruitmentRole from './knowledge-base/hr/recruitment.json';
import corporateLawRole from './knowledge-base/law/corporate-law.json';
import businessAnalystRole from './knowledge-base/data-analyst/business-analyst.json';
import generalRole from './knowledge-base/general/general.json';

export interface KBQuestion {
  topic: string;
  question: string;
  upgradedPoint: string;
}

export interface KBRoleConfig {
  role: string;
  supportedJobTitles: string[];
  alternativeJobTitles: string[];
  keywords: string[];
  relevantSkills: string[];
  responsibilities: string[];
  achievementTemplates: string[];
  experienceQuestions: KBQuestion[];
  projectQuestions: KBQuestion[];
  followUpQuestions: Record<string, string[]>;
  atsKeywords: string[];
  metrics: string[];
  relatedTopics: string[];
}

export const KNOWLEDGE_BASE: KBRoleConfig[] = [
  frontendRole as unknown as KBRoleConfig,
  backendRole as unknown as KBRoleConfig,
  uiuxRole as unknown as KBRoleConfig,
  digitalRole as unknown as KBRoleConfig,
  financialAnalystRole as unknown as KBRoleConfig,
  recruitmentRole as unknown as KBRoleConfig,
  corporateLawRole as unknown as KBRoleConfig,
  businessAnalystRole as unknown as KBRoleConfig,
  generalRole as unknown as KBRoleConfig
];

/**
 * Clean token-based fuzzy matching algorithm to identify the closest role config.
 * Fits browser client environment safely.
 */
export function detectRoleConfig(jobTitle: string, professionCategory: string): KBRoleConfig {
  const title = (jobTitle || '').toLowerCase().trim();
  if (title.length < 3) {
    return generalRole as unknown as KBRoleConfig;
  }

  const titleTokens = title.split(/\s+/);
  let bestMatch: KBRoleConfig = generalRole as unknown as KBRoleConfig;
  let highestScore = 0;

  for (const config of KNOWLEDGE_BASE) {
    let score = 0;
    
    // Exact or substring match in supported job titles
    for (const st of config.supportedJobTitles) {
      const stLower = st.toLowerCase();
      if (title === stLower) {
        score += 100;
      } else if (title.includes(stLower) || stLower.includes(title)) {
        score += 40;
      }
    }

    // Exact or substring match in alternative job titles
    for (const alt of config.alternativeJobTitles) {
      const altLower = alt.toLowerCase();
      if (title === altLower) {
        score += 80;
      } else if (title.includes(altLower) || altLower.includes(title)) {
        score += 30;
      }
    }

    // Token overlap matches
    for (const kw of config.keywords) {
      if (titleTokens.includes(kw.toLowerCase())) {
        score += 15;
      }
    }

    // Profession category alignment bonus
    const prof = (professionCategory || '').toLowerCase();
    if (config.role.toLowerCase().includes(prof) || prof.includes(config.role.toLowerCase())) {
      score += 10;
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = config;
    }
  }

  // Fallback category detection
  if (highestScore < 10) {
    const category = (professionCategory || '').toLowerCase();
    if (category.includes('dev') || category.includes('software')) return frontendRole as unknown as KBRoleConfig;
    if (category.includes('design')) return uiuxRole as unknown as KBRoleConfig;
    if (category.includes('data')) return businessAnalystRole as unknown as KBRoleConfig;
    if (category.includes('marketing')) return digitalRole as unknown as KBRoleConfig;
    if (category.includes('finance')) return financialAnalystRole as unknown as KBRoleConfig;
    if (category.includes('hr')) return recruitmentRole as unknown as KBRoleConfig;
    if (category.includes('law')) return corporateLawRole as unknown as KBRoleConfig;
  }

  return bestMatch;
}

export interface RankedSuggestion {
  topic: string;
  question: string;
  upgradedPoint: string;
  score: number;
  isFollowUp: boolean;
  followUpPrompt?: string;
}

export interface RankingParams {
  jobTitle: string;
  professionCategory: string;
  currentSkills: { name: string }[];
  currentDescription: string;
  experienceType: 'experience' | 'project';
  rejectedTopics: string[];
}

/**
 * Score and rank suggestion questions based on user details and description context.
 */
export function rankSuggestions(params: RankingParams): RankedSuggestion[] {
  const { jobTitle, professionCategory, currentSkills, currentDescription, experienceType, rejectedTopics } = params;
  const config = detectRoleConfig(jobTitle, professionCategory);
  
  const skillNames = currentSkills.map(s => s.name.toLowerCase().trim()).filter(Boolean);
  const descLower = (currentDescription || '').toLowerCase();

  const results: RankedSuggestion[] = [];
  
  // Select target question pool depending on experience type
  const targetQuestions = experienceType === 'experience' 
    ? (config.experienceQuestions || [])
    : (config.projectQuestions || []);

  for (const item of targetQuestions) {
    // Check if topic is completely rejected
    if (rejectedTopics.includes(item.topic)) {
      continue;
    }

    let score = 0;
    let isAlreadyMentioned = false;

    // 1. Topic/Keyword Match in current description
    const topicKeywords = [item.topic, ...config.keywords.filter(k => item.topic.includes(k) || k.includes(item.topic))];
    for (const kw of topicKeywords) {
      if (descLower.includes(kw.toLowerCase())) {
        isAlreadyMentioned = true;
      }
    }

    // 2. Score mapping
    // Base Match: Role matched
    score += 50;

    // Skills Match: matches entered skills
    const hasSkillMatch = config.relevantSkills.some(skill => {
      const match = skillNames.includes(skill.toLowerCase());
      return match && (item.topic.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(item.topic.toLowerCase()));
    });
    if (hasSkillMatch) {
      score += 30;
    }

    // Title keyword match
    const titleKeywords = jobTitle.toLowerCase().split(/\s+/);
    const hasTitleKeywordMatch = titleKeywords.some(tok => item.topic.toLowerCase().includes(tok) || tok.length > 3 && item.question.toLowerCase().includes(tok));
    if (hasTitleKeywordMatch) {
      score += 20;
    }

    // Already Mentioned penalty
    if (isAlreadyMentioned) {
      score -= 100;
    }

    // Compile dynamic question & follow-up version
    if (isAlreadyMentioned) {
      const prompts = config.followUpQuestions[item.topic] || ["What metrics or numbers can you add?", "How did this project impact the business outcome?"];
      const promptIndex = Math.min(prompts.length - 1, Math.max(0, currentDescription.length % prompts.length));
      
      results.push({
        topic: item.topic,
        question: `Follow-up: ${prompts[promptIndex]}`,
        upgradedPoint: item.upgradedPoint,
        score: score + 10,
        isFollowUp: true,
        followUpPrompt: prompts[promptIndex]
      });
    } else {
      results.push({
        topic: item.topic,
        question: item.question,
        upgradedPoint: item.upgradedPoint,
        score,
        isFollowUp: false
      });
    }
  }

  // Sort descending by score
  return results.sort((a, b) => b.score - a.score);
}

/**
 * Deterministic One-Click ATS Enhancer
 * Upgrades sentences/bullets based on role, section context ('experience' => job side, 'project' => project side)
 */
export function enhanceDescription(description: string, config: KBRoleConfig, type: 'experience' | 'project'): string {
  if (!description || description.trim().length === 0) {
    return '• Initiated core assignments aligned with standard professional metrics and deliverables.';
  }

  const lines = description.split('\n').map(l => l.trim()).filter(Boolean);
  const upgradedLines = lines.map(line => {
    let text = line.replace(/^[•\-\*\s]+/, '').trim();
    if (!text) return '';

    // If it already ends with a period, remove it temporarily to join phrases smoothly
    if (text.endsWith('.')) {
      text = text.slice(0, -1);
    }

    // Skip if already enhanced
    if (text.includes('leveraging') || text.includes('resulting in') || text.includes('increasing operational') || text.includes('deploying via')) {
      return `• ${text}.`;
    }

    // Deterministic enhancements depending on the section type
    if (type === 'experience') {
      // JOB/EXPERIENCE SIDE: Focuses on metrics, business impact, and stakeholder alignment
      const jobUpgrades = [
        `, improving operational efficiency by 22% and reducing project delivery timelines`,
        `, coordinating cross-functional squads to align deliverables with quarterly corporate business goals`,
        `, reducing recurring operational expenses by 15% through proactive task management`,
        `, enhancing user satisfaction ratings by 18% through strategic process optimizations`
      ];
      // Deterministically select an upgrade based on string code
      const upgrade = jobUpgrades[text.length % jobUpgrades.length];
      return `• ${text}${upgrade}.`;
    } else {
      // PROJECT/CAMPAIGN SIDE: Focuses on stack, architecture, github, and milestone deliverables
      const projectUpgrades = [
        `, utilizing modular system architectures and deploying via automated CI/CD pipeline environments`,
        `, integration testing all API nodes to guarantee 99.9% codebase structural integrity`,
        `, managing codebase version branches on GitHub with comprehensive technical documentations`,
        `, configuring modular service layers to facilitate seamless scaling and low-latency metrics`
      ];
      const upgrade = projectUpgrades[text.length % projectUpgrades.length];
      return `• ${text}${upgrade}.`;
    }
  }).filter(Boolean);

  return upgradedLines.join('\n');
}

/**
 * Substitutes placeholders dynamically inside template strings
 */
export function substituteTemplates(text: string, currentSkills: { name: string }[], config: KBRoleConfig): string {
  const skillNames = currentSkills.map(s => s.name).filter(Boolean);
  
  const skill1 = skillNames[0] || config.relevantSkills[0] || 'core technologies';
  const skill2 = skillNames[1] || config.relevantSkills[1] || 'modern frameworks';
  const skill3 = skillNames[2] || config.relevantSkills[2] || 'best practices';
  const combined = skillNames.length >= 2 ? `${skill1} and ${skill2}` : skill1;

  const metric = config.metrics[Math.floor(Math.random() * config.metrics.length)] || 'performance output';

  return text
    .replace(/\[Skill1\]/g, skill1)
    .replace(/\[Skill2\]/g, skill2)
    .replace(/\[Skill3\]/g, skill3)
    .replace(/\[SkillsCombined\]/g, combined)
    .replace(/\[Technology\]/g, skill1)
    .replace(/\[Tool\]/g, skill3)
    .replace(/\[Metric\]/g, `35% ${metric}`)
    .replace(/\[Application\]/g, 'high-performance application')
    .replace(/\[Component\]/g, 'reusable modules')
    .replace(/\[Users\]/g, 'over 10,000 active users')
    .replace(/\[Financial Model\]/g, 'discounted cash flow (DCF) model')
    .replace(/\[Business Metric\]/g, 'capital efficiency')
    .replace(/\[Campaign\]/g, 'growth acquisition campaign')
    .replace(/\[Platform\]/g, 'Meta Ads Manager')
    .replace(/\[KPI\]/g, 'ROAS click-through rate')
    .replace(/\[Legal Documents\]/g, 'commercial vendor agreements')
    .replace(/\[Regulation\]/g, 'GDPR/CCPA frameworks');
}
