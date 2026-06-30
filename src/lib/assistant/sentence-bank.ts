export interface ProjectAnswers {
  // Developer
  hasAuth?: boolean;
  hasPayments?: boolean;
  hasAdminPanel?: boolean;
  hasOrderManagement?: boolean;
  hasProductManagement?: boolean;
  isDeployed?: boolean;
  deploymentTarget?: string;
  // Designer
  conductedResearch?: boolean;
  builtDesignSystem?: boolean;
  createdPrototypes?: boolean;
  // Data Analyst
  builtDashboards?: boolean;
  performedStatisticalAnalysis?: boolean;
  cleanedData?: boolean;
  // Marketing
  ranAdCampaigns?: boolean;
  improvedSeo?: boolean;
  managedSocialMedia?: boolean;
  // MBA
  conductedMarketResearch?: boolean;
  developedStrategy?: boolean;
  managedBudget?: boolean;
}

export interface ExperienceAnswers {
  // Developer
  builtRestApis?: boolean;
  implementedAuth?: boolean;
  designedDatabase?: boolean;
  builtResponsiveUi?: boolean;
  managedDeployment?: boolean;
  wroteTests?: boolean;
  // Designer
  ledUserResearch?: boolean;
  createdWireframes?: boolean;
  conductedUsabilityTesting?: boolean;
  // Data
  createdDataPipelines?: boolean;
  presentedToStakeholders?: boolean;
  builtMachineLearningModels?: boolean;
  // Marketing
  increasedConversionRate?: boolean;
  managedContentCalendar?: boolean;
  optimizedFunnel?: boolean;
  // MBA / Biz
  ledCrossFunctionalTeams?: boolean;
  reducedCosts?: boolean;
  improvedProcesses?: boolean;
}

/**
 * Generates a structured project description from Q&A answers.
 */
export function generateProjectDescription(title: string, answers: ProjectAnswers): string {
  const sentences: string[] = [];
  sentences.push(`A comprehensive ${title} project.`);

  // Developer
  if (answers.hasAuth) sentences.push("Implemented secure user authentication and authorization.");
  if (answers.hasPayments) sentences.push("Integrated seamless payment processing infrastructure.");
  if (answers.hasAdminPanel) sentences.push("Developed a dedicated admin panel for content and user management.");
  if (answers.hasOrderManagement || answers.hasProductManagement) {
    const features = [];
    if (answers.hasProductManagement) features.push("product catalog management");
    if (answers.hasOrderManagement) features.push("order tracking functionality");
    sentences.push(`Engineered robust ${features.join(" and ")}.`);
  }
  if (answers.isDeployed) {
    const target = answers.deploymentTarget ? ` on ${answers.deploymentTarget}` : "";
    sentences.push(`Successfully deployed to production${target}.`);
  }

  // Designer
  if (answers.conductedResearch) sentences.push("Conducted extensive user research to inform design decisions.");
  if (answers.builtDesignSystem) sentences.push("Established a scalable design system for consistent UI components.");
  if (answers.createdPrototypes) sentences.push("Created high-fidelity interactive prototypes for stakeholder review.");

  // Data
  if (answers.builtDashboards) sentences.push("Built interactive dashboards to visualize key performance metrics.");
  if (answers.performedStatisticalAnalysis) sentences.push("Performed rigorous statistical analysis to uncover actionable insights.");
  if (answers.cleanedData) sentences.push("Engineered robust data cleaning and preprocessing pipelines.");

  // Marketing
  if (answers.ranAdCampaigns) sentences.push("Managed and optimized high-performing digital ad campaigns.");
  if (answers.improvedSeo) sentences.push("Implemented technical and content SEO strategies to drive organic growth.");
  if (answers.managedSocialMedia) sentences.push("Developed and executed a comprehensive social media engagement strategy.");

  // MBA / Biz
  if (answers.conductedMarketResearch) sentences.push("Conducted comprehensive market research to identify expansion opportunities.");
  if (answers.developedStrategy) sentences.push("Formulated strategic go-to-market plans to drive revenue growth.");
  if (answers.managedBudget) sentences.push("Effectively managed project budgets to maximize ROI.");

  return sentences.join(" ");
}

/**
 * Generates structured bullet points for experience entries from a checklist.
 */
export function generateExperienceBullets(role: string, answers: ExperienceAnswers): string[] {
  const bullets: string[] = [];

  // Developer
  if (answers.builtRestApis) bullets.push("Architected and implemented scalable RESTful APIs to serve high-traffic endpoints.");
  if (answers.implementedAuth) bullets.push("Engineered secure authentication systems incorporating modern security standards.");
  if (answers.designedDatabase) bullets.push("Designed efficient database schemas and optimized queries for performance.");
  if (answers.builtResponsiveUi) bullets.push("Developed responsive, accessible, and highly interactive user interfaces.");
  if (answers.managedDeployment) bullets.push("Managed CI/CD pipelines and orchestrated reliable production deployments.");
  if (answers.wroteTests) bullets.push("Maintained high code quality through comprehensive unit and integration testing.");

  // Designer
  if (answers.ledUserResearch) bullets.push("Led qualitative and quantitative user research to drive product strategy.");
  if (answers.createdWireframes) bullets.push("Created comprehensive wireframes and user flows for complex application features.");
  if (answers.conductedUsabilityTesting) bullets.push("Conducted extensive usability testing to iteratively refine the user experience.");

  // Data
  if (answers.createdDataPipelines) bullets.push("Architected robust ETL data pipelines to ensure data integrity and availability.");
  if (answers.presentedToStakeholders) bullets.push("Translated complex data sets into actionable insights for executive stakeholders.");
  if (answers.builtMachineLearningModels) bullets.push("Developed and deployed predictive machine learning models to optimize business operations.");

  // Marketing
  if (answers.increasedConversionRate) bullets.push("Optimized marketing funnels, significantly increasing overall conversion rates.");
  if (answers.managedContentCalendar) bullets.push("Managed editorial content calendars and coordinated cross-channel marketing campaigns.");
  if (answers.optimizedFunnel) bullets.push("Conducted A/B testing and optimized user acquisition funnels for maximum efficiency.");

  // MBA / Biz
  if (answers.ledCrossFunctionalTeams) bullets.push("Led cross-functional teams to deliver critical strategic initiatives on schedule.");
  if (answers.reducedCosts) bullets.push("Identified operational inefficiencies and implemented process improvements to reduce costs.");
  if (answers.improvedProcesses) bullets.push("Streamlined core business workflows, enhancing overall organizational productivity.");

  if (bullets.length === 0) {
    bullets.push(`Contributed to the core development and operations as a ${role}.`);
  }

  return bullets;
}

/**
 * Detects project type context from title or description.
 */
export function detectProjectType(text: string): 'commerce' | 'admin' | 'generic' {
  const normalized = text.toLowerCase();
  if (normalized.includes('e-commerce') || normalized.includes('shop') || normalized.includes('store') || normalized.includes('cart')) {
    return 'commerce';
  }
  if (normalized.includes('dashboard') || normalized.includes('admin') || normalized.includes('cms')) {
    return 'admin';
  }
  return 'generic';
}

/**
 * Detects experience context from job title.
 */
export function detectExperienceRole(title: string): 'frontend' | 'backend' | 'fullstack' | 'data' | 'generic' {
  const normalized = title.toLowerCase();
  if (normalized.includes('front') || normalized.includes('ui') || normalized.includes('react')) return 'frontend';
  if (normalized.includes('back') || normalized.includes('api') || normalized.includes('node')) return 'backend';
  if (normalized.includes('full') || normalized.includes('mern') || normalized.includes('mean')) return 'fullstack';
  if (normalized.includes('data') || normalized.includes('machine learning') || normalized.includes('analyst')) return 'data';
  return 'generic';
}
