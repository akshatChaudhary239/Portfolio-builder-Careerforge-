import { DEDICATED_PROFESSION_POOLS, CROSS_FUNCTIONAL_ROLE_WEIGHTS, GRANULAR_SUB_ROLE_POOLS, PCEQuestionGroup, PCEDiscoveryConfig } from './pce-config';
import { resolveRoleTitle, resolveProjectTypeTitle, RoleResolution } from './role-resolver';

export interface PCEContextResult {
  configId: string;
  title: string;
  isCrossFunctional: boolean;
  primaryCategory: string;
  secondaryCategory?: string;
  primaryWeight: number;
  secondaryWeight: number;
  groups: PCEQuestionGroup[];
}

export interface ResolutionResult {
  isResolved: boolean;
  resolvedTitle: string;
  resolvedCategory?: string;
  candidateSuggestions: string[];
  reason?: string;
}

export interface ItemDiscoveryState {
  itemId: string;
  status: 'uninitiated' | 'clarifying' | 'active' | 'completed';
  resolvedRole: string;
  context?: PCEContextResult | null;
  selectedOptions: Record<string, string[]>;
  followUpSelections: Record<string, string[]>;
  additionalNotes: string;
  generatedBullets: string;
  insightCount: number;
  completedAt?: string;
}

/**
 * Normalizes user-selected profession category string to matching pool key
 */
export function normalizeProfessionKey(prof: string): string {
  const p = (prof || '').toLowerCase().trim();
  if (p.includes('design')) return 'designer';
  if (p.includes('data')) return 'data';
  if (p.includes('marketing')) return 'marketing';
  if (p.includes('law')) return 'law';
  if (p.includes('hr') || p.includes('human')) return 'hr';
  if (p.includes('finance') || p.includes('accountant')) return 'finance';
  if (p.includes('mba') || p.includes('business')) return 'mba';
  if (p.includes('dev') || p.includes('software')) return 'developer';
  return 'general';
}

/**
 * Strict Role & Project Type Resolver Gateway
 * FORBIDDEN from silently guessing or mapping invalid strings like "Akku" or "123".
 */
export function resolveRoleOrProjectType(
  rawTitle: string,
  professionCategory: string,
  type: 'experience' | 'project'
): ResolutionResult {
  const resolution: RoleResolution = type === 'experience'
    ? resolveRoleTitle(rawTitle, professionCategory)
    : resolveProjectTypeTitle(rawTitle, professionCategory);

  return {
    isResolved: resolution.status === 'known',
    resolvedTitle: resolution.matchedRole || rawTitle,
    resolvedCategory: resolution.category || professionCategory,
    candidateSuggestions: resolution.suggestedRoles,
    reason: resolution.reason
  };
}

/**
 * Professional Context Engine (PCE) Evaluation Pipeline
 * Generates role-specific, skill-aware, and sub-role-adapted question sets.
 */
export function evaluateProfessionalContext(
  professionCategory: string,
  roleTitle: string,
  type: 'experience' | 'project',
  currentSkills: { name: string }[] = []
): PCEContextResult {
  const resolution: RoleResolution = type === 'experience'
    ? resolveRoleTitle(roleTitle, professionCategory)
    : resolveProjectTypeTitle(roleTitle, professionCategory);

  const roleCategory = resolution.category || professionCategory;
  const primaryKey = normalizeProfessionKey(roleCategory);
  const titleLower = (roleTitle || '').toLowerCase().trim();

  // 1. Check Granular Sub-Role Specific Overrides
  let subRoleOverride: Partial<PCEDiscoveryConfig> | undefined;
  for (const [subKey, subPool] of Object.entries(GRANULAR_SUB_ROLE_POOLS)) {
    if (subPool.keywords?.some(kw => titleLower.includes(kw))) {
      subRoleOverride = subPool;
      break;
    }
  }

  // 2. Base Primary Profession Pool
  const primaryPool = DEDICATED_PROFESSION_POOLS[primaryKey] || DEDICATED_PROFESSION_POOLS['general'];
  let baseGroups: PCEQuestionGroup[] = JSON.parse(JSON.stringify(
    type === 'experience' ? primaryPool.experienceGroups : primaryPool.projectGroups
  ));

  // If sub-role override exists, replace matching question groups with sub-role specific options
  if (subRoleOverride && subRoleOverride.experienceGroups && type === 'experience') {
    subRoleOverride.experienceGroups.forEach(overrideGroup => {
      const existingIdx = baseGroups.findIndex(g => g.id === overrideGroup.id);
      if (existingIdx !== -1) {
        baseGroups[existingIdx] = JSON.parse(JSON.stringify(overrideGroup));
      } else {
        baseGroups.unshift(JSON.parse(JSON.stringify(overrideGroup)));
      }
    });
  }

  // 3. Skill-Aware Adaptations: Dynamically prepend user skills to tools/stack question groups
  const userSkillNames = currentSkills.map(s => s.name).filter(Boolean);
  if (userSkillNames.length > 0) {
    baseGroups = baseGroups.map(g => {
      if (g.id.includes('stack') || g.id.includes('tool') || g.subtitle.toLowerCase().includes('tool') || g.question.toLowerCase().includes('tool')) {
        const uniqueOptions = Array.from(new Set([...userSkillNames, ...g.options]));
        return { ...g, options: uniqueOptions };
      }
      return g;
    });
  }

  // 4. Cross-Functional Role Check
  let crossRule = CROSS_FUNCTIONAL_ROLE_WEIGHTS.find(rule =>
    rule.roleKeywords.some(kw => titleLower.includes(kw) || kw.includes(titleLower))
  );

  const displayTitle = subRoleOverride?.title || primaryPool.title;

  if (!crossRule || crossRule.secondaryRoleCategory === primaryKey) {
    return {
      configId: subRoleOverride ? `sub_${roleTitle}` : primaryPool.configId,
      title: `${displayTitle} (${roleTitle || 'Validated Role'})`,
      isCrossFunctional: false,
      primaryCategory: primaryKey,
      primaryWeight: 1.0,
      secondaryWeight: 0.0,
      groups: baseGroups
    };
  }

  // Blended Cross-Functional Context
  const secondaryKey = crossRule.secondaryRoleCategory;
  const secondaryPool = DEDICATED_PROFESSION_POOLS[secondaryKey] || DEDICATED_PROFESSION_POOLS['general'];
  const secondaryGroups: PCEQuestionGroup[] = JSON.parse(JSON.stringify(
    type === 'experience' ? secondaryPool.experienceGroups : secondaryPool.projectGroups
  ));

  const blended: PCEQuestionGroup[] = [];

  secondaryGroups.forEach(g => {
    blended.push({
      ...g,
      subtitle: `${g.subtitle} (${secondaryPool.title} Context)`
    });
  });

  baseGroups.forEach(g => {
    if (!blended.some(existing => existing.id === g.id)) {
      blended.push({
        ...g,
        subtitle: `${g.subtitle} (${displayTitle} Collaboration)`
      });
    }
  });

  return {
    configId: `blended_${primaryKey}_${secondaryKey}`,
    title: `${roleTitle || 'Cross-Functional Role'} [${secondaryPool.title} × ${displayTitle}]`,
    isCrossFunctional: true,
    primaryCategory: primaryKey,
    secondaryCategory: secondaryKey,
    primaryWeight: crossRule.primaryContextWeight,
    secondaryWeight: crossRule.secondaryContextWeight,
    groups: blended
  };
}

import { getWritingProfile, formatItemList } from './writing-profiles';

/**
 * Synthesizes structured PCE discovery responses into recruiter-ready resume bullets
 * Powered by Human-Like Writing Engine V2 with domain writing profiles & layout rotation.
 */
export function synthesizePCEBullets(
  selections: Record<string, string[]>,
  followUps: Record<string, string[]>,
  additionalNotes: string,
  type: 'experience' | 'project',
  context: PCEContextResult
): string {
  const profileKey = context.primaryCategory || 'general';
  const profile = getWritingProfile(profileKey);

  const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const selectionContents = Object.values(selections).flat().join('_');
  const compositeKey = `${context.title}_${type}_${selectionContents}_${additionalNotes}`;
  const seed = hashString(compositeKey);

  const features = selections['features'] || selections['architecture'] || selections['design_assets'] || selections['data_deliverables'] || selections['mkt_channels'] || selections['fin_deliverables'] || selections['law_deliverables'] || selections['hr_deliverables'] || selections['biz_deliverables'] || selections['gen_deliverables'] || selections['project_scope'] || [];
  const stack = selections['stack'] || selections['technologies'] || selections['design_tools'] || selections['data_stack'] || selections['mkt_tools'] || selections['fin_tools'] || selections['law_tools'] || selections['hr_tools'] || selections['biz_tools'] || selections['gen_tools'] || selections['project_stack'] || selections['project_tools'] || [];
  const duties = selections['responsibilities'] || selections['design_process'] || selections['data_duties'] || selections['mkt_duties'] || selections['fin_duties'] || selections['law_duties'] || selections['hr_duties'] || selections['biz_duties'] || selections['gen_duties'] || selections['challenges'] || [];
  const impact = selections['impact'] || selections['achievements'] || selections['design_impact'] || selections['data_impact'] || selections['mkt_impact'] || selections['fin_impact'] || selections['law_impact'] || selections['hr_impact'] || selections['biz_impact'] || selections['gen_impact'] || selections['project_outcomes'] || [];

  const delivPool = type === 'project' ? profile.projectDeliverablesTemplates : profile.deliverablesTemplates;
  const toolPool = type === 'project' ? profile.projectToolkitTemplates : profile.toolkitTemplates;
  const dutyPool = type === 'project' ? profile.projectDutiesTemplates : profile.dutiesTemplates;
  const impPool = type === 'project' ? profile.projectImpactTemplates : profile.impactTemplates;

  const candidateBullets: { category: 'features' | 'stack' | 'duties' | 'impact'; text: string }[] = [];

  if (features.length > 0) {
    const tpl = delivPool[(seed * 7) % delivPool.length];
    let text = tpl.replace('{items}', formatItemList(features));
    Object.entries(followUps).forEach(([trigger, opts]) => {
      if (opts.length > 0) {
        text += ` Specifically configured ${opts.join(', ')} to ensure operational precision.`;
      }
    });
    candidateBullets.push({ category: 'features', text });
  }

  if (stack.length > 0) {
    const tpl = toolPool[(seed * 13 + 3) % toolPool.length];
    let text = tpl.replace('{items}', formatItemList(stack));
    candidateBullets.push({ category: 'stack', text });
  }

  if (duties.length > 0) {
    const tpl = dutyPool[(seed * 17 + 5) % dutyPool.length];
    let text = tpl.replace('{items}', formatItemList(duties));
    candidateBullets.push({ category: 'duties', text });
  }

  if (impact.length > 0) {
    const tpl = impPool[(seed * 23 + 11) % impPool.length];
    let text = tpl.replace('{items}', formatItemList(impact));
    candidateBullets.push({ category: 'impact', text });
  }

  // Structural Layout Rotation Engine with Prime Offset
  const layoutMode = (seed * 31) % 4;
  let orderedBullets: string[] = [];

  if (layoutMode === 1) {
    // Impact-First Layout
    const imp = candidateBullets.find(b => b.category === 'impact');
    const feat = candidateBullets.find(b => b.category === 'features');
    const stk = candidateBullets.find(b => b.category === 'stack');
    const dut = candidateBullets.find(b => b.category === 'duties');
    [imp, feat, stk, dut].forEach(b => { if (b) orderedBullets.push(b.text); });
  } else if (layoutMode === 2) {
    // Toolkit-First Layout
    const stk = candidateBullets.find(b => b.category === 'stack');
    const feat = candidateBullets.find(b => b.category === 'features');
    const imp = candidateBullets.find(b => b.category === 'impact');
    const dut = candidateBullets.find(b => b.category === 'duties');
    [stk, feat, imp, dut].forEach(b => { if (b) orderedBullets.push(b.text); });
  } else if (layoutMode === 3) {
    // Process-First Layout
    const dut = candidateBullets.find(b => b.category === 'duties');
    const feat = candidateBullets.find(b => b.category === 'features');
    const stk = candidateBullets.find(b => b.category === 'stack');
    const imp = candidateBullets.find(b => b.category === 'impact');
    [dut, feat, stk, imp].forEach(b => { if (b) orderedBullets.push(b.text); });
  } else {
    // Deliverables-First Layout (Default)
    candidateBullets.forEach(b => orderedBullets.push(b.text));
  }

  if (additionalNotes && additionalNotes.trim()) {
    const cleanNote = additionalNotes.trim().replace(/^[\s•\-\*\u2022\u2023\u25E6\u2043\u2219]+/, '');
    orderedBullets.push(cleanNote);
  }

  if (orderedBullets.length === 0) {
    return '• Managed key operational initiatives aligned with standard corporate metrics and deliverables.';
  }

  return orderedBullets.join('\n');
}
