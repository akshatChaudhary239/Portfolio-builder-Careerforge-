import { ProfessionCategory } from '@/db/local-db';

export interface ShowcaseLabels {
  sectionTitle: string;
  itemLabel: string;
  link1: string;
  link2: string;
  tech: string;
  metrics: string;
  metricLabel: string; // E.g. "Projects Built", "Cases Managed"
  actionVerb: string; // E.g. "Built", "Managed", "Designed"
}

export function getShowcaseLabels(category?: ProfessionCategory | string): ShowcaseLabels {
  switch (category) {
    case 'Developer':
      return { 
        sectionTitle: 'Projects', 
        itemLabel: 'Project', 
        link1: 'GitHub', 
        link2: 'Live Demo', 
        tech: 'Tech Stack', 
        metrics: 'Impact',
        metricLabel: 'Projects Delivered',
        actionVerb: 'Built'
      };
    case 'Designer':
      return { 
        sectionTitle: 'Portfolio', 
        itemLabel: 'Design Showcase', 
        link1: 'Behance', 
        link2: 'Live Site', 
        tech: 'Design Tools', 
        metrics: 'Outcome',
        metricLabel: 'Designs Crafted',
        actionVerb: 'Designed'
      };
    case 'Law':
      return { 
        sectionTitle: 'Key Cases', 
        itemLabel: 'Legal Case', 
        link1: 'Case Study', 
        link2: 'Publication', 
        tech: 'Practice Areas', 
        metrics: 'Resolution',
        metricLabel: 'Cases Managed',
        actionVerb: 'Managed'
      };
    case 'Marketing':
      return { 
        sectionTitle: 'Campaigns', 
        itemLabel: 'Campaign', 
        link1: 'Campaign Link', 
        link2: 'Live Demo', 
        tech: 'Tools', 
        metrics: 'ROI / Reach',
        metricLabel: 'Campaigns Launched',
        actionVerb: 'Launched'
      };
    case 'MBA / Business':
      return { 
        sectionTitle: 'Strategic Initiatives', 
        itemLabel: 'Initiative', 
        link1: 'Presentation', 
        link2: 'Live Demo', 
        tech: 'Frameworks', 
        metrics: 'Business Impact',
        metricLabel: 'Initiatives Led',
        actionVerb: 'Led'
      };
    case 'Data Analyst':
      return { 
        sectionTitle: 'Data Projects', 
        itemLabel: 'Dashboard', 
        link1: 'Dashboard', 
        link2: 'Live Demo', 
        tech: 'Tools', 
        metrics: 'Insights',
        metricLabel: 'Models Built',
        actionVerb: 'Developed'
      };
    case 'Finance':
      return { 
        sectionTitle: 'Financial Models', 
        itemLabel: 'Report', 
        link1: 'Report', 
        link2: 'Live Demo', 
        tech: 'Tools', 
        metrics: 'Valuation',
        metricLabel: 'Models Executed',
        actionVerb: 'Executed'
      };
    case 'HR':
      return { 
        sectionTitle: 'HR Initiatives', 
        itemLabel: 'Program', 
        link1: 'Report', 
        link2: 'Live Demo', 
        tech: 'Tools', 
        metrics: 'Participants',
        metricLabel: 'Initiatives Led',
        actionVerb: 'Directed'
      };
    case 'General Professional':
    default:
      return { 
        sectionTitle: 'Professional Showcase', 
        itemLabel: 'Highlight', 
        link1: 'Reference', 
        link2: 'Live Demo', 
        tech: 'Tools', 
        metrics: 'Outcome',
        metricLabel: 'Deliverables Completed',
        actionVerb: 'Completed'
      };
  }
}
