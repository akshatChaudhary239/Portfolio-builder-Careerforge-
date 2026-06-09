import { CareerProfile, ProfessionCategory, ShowcaseItem } from '@/db/local-db';

export interface NormalizedShowcaseItem {
  title: string;
  description: string;
  techStack?: string[];
  link?: string;
  highlights?: string[];
  problemSolved?: string;
  keyImpact?: string;
}

export function normalizeShowcaseItems(careerProfile: CareerProfile): NormalizedShowcaseItem[] {
  const projects = careerProfile.projects || [];
  const category = careerProfile.professionCategory || 'General Professional';

  return projects.map((proj: any) => {
    const baseItem: NormalizedShowcaseItem = {
      title: proj.title || proj.name || 'Untitled Showcase',
      description: proj.description || '',
      link: proj.link || proj.supportingUrl || '',
      techStack: proj.technologies || [],
      highlights: proj.highlights || [],
      problemSolved: proj.problemSolved || '',
      keyImpact: proj.impact || proj.outcome || '',
    };

    switch (category) {
      case 'Developer':
        if (proj.githubUrl) baseItem.link = proj.githubUrl;
        if (proj.liveUrl && !baseItem.link) baseItem.link = proj.liveUrl;
        if (proj.techStack) baseItem.techStack = proj.techStack;
        if (proj.openSourceLinks && proj.openSourceLinks.length > 0) {
          baseItem.highlights = [...(baseItem.highlights || []), `Open Source: ${proj.openSourceLinks.join(', ')}`];
        }
        break;
      case 'Designer':
        if (proj.behanceUrl) baseItem.link = proj.behanceUrl;
        else if (proj.dribbbleUrl) baseItem.link = proj.dribbbleUrl;
        else if (proj.figmaUrl) baseItem.link = proj.figmaUrl;
        if (proj.designTools) baseItem.techStack = proj.designTools;
        break;
      case 'Law':
        if (proj.caseType) baseItem.highlights = [...(baseItem.highlights || []), `Type: ${proj.caseType}`];
        if (proj.practiceArea) baseItem.highlights = [...(baseItem.highlights || []), `Practice Area: ${proj.practiceArea}`];
        if (proj.publicationUrl) baseItem.link = proj.publicationUrl;
        break;
      case 'Finance':
        if (proj.valuationType) baseItem.highlights = [...(baseItem.highlights || []), `Valuation: ${proj.valuationType}`];
        if (proj.reportUrl) baseItem.link = proj.reportUrl;
        if (proj.modelType) baseItem.techStack = [...(baseItem.techStack || []), proj.modelType];
        break;
      case 'HR':
        if (proj.initiativeType) baseItem.highlights = [...(baseItem.highlights || []), `Initiative: ${proj.initiativeType}`];
        if (proj.participants) baseItem.keyImpact = `Participants: ${proj.participants}`;
        break;
      case 'MBA / Business':
        if (proj.domain) baseItem.highlights = [...(baseItem.highlights || []), `Domain: ${proj.domain}`];
        if (proj.teamSize) baseItem.highlights = [...(baseItem.highlights || []), `Team Size: ${proj.teamSize}`];
        if (proj.presentationUrl) baseItem.link = proj.presentationUrl;
        break;
      case 'Marketing':
        if (proj.campaignUrl) baseItem.link = proj.campaignUrl;
        if (proj.campaignType) baseItem.highlights = [...(baseItem.highlights || []), `Campaign Type: ${proj.campaignType}`];
        if (proj.reach) baseItem.keyImpact = `Reach: ${proj.reach}`;
        if (proj.conversions) baseItem.highlights = [...(baseItem.highlights || []), `Conversions: ${proj.conversions}`];
        break;
      case 'Data Analyst':
        if (proj.dashboardUrl) baseItem.link = proj.dashboardUrl;
        if (proj.tools) baseItem.techStack = proj.tools;
        if (proj.datasetType) baseItem.highlights = [...(baseItem.highlights || []), `Dataset: ${proj.datasetType}`];
        break;
      case 'General Professional':
        if (proj.category) baseItem.highlights = [...(baseItem.highlights || []), `Category: ${proj.category}`];
        break;
    }

    return baseItem;
  });
}
