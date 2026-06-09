import { CareerProfile, ProfessionalBlueprint } from '@/db/local-db';

export interface VisualDNA {
  theme: string;
  typography: string;
  animationPack: string;
  cardStyle: string;
  shadowStyle: string;
}

export interface PortfolioConfig {
  hero: string;
  navbar: string;
  about: string;
  experience: string;
  projects: string;
  skills: string;
  certifications: string;
  contact: string;

  theme: string;
  typography: string;
  animationPack: string;
  cardStyle: string;
  shadowStyle: string;
}

export interface ComponentMetadata {
  id: string;
  professions: string[]; // e.g. ["law", "finance", "developer", "*"]
  identities: string[];  // e.g. ["analytical", "leadership", "technical", "*"]
  styles: string[];      // e.g. ["corporate", "modern", "minimal", "creative", "*"]
}

export interface ComponentRegistryEntry {
  component: React.ComponentType<any>;
  metadata: ComponentMetadata;
}

// Global props interface for all rendering components
export interface BaseSectionProps {
  profile: CareerProfile;
  portfolio?: any; // The assembled portfolio data (if needed)
  dna?: any;       // The active visual DNA
  config?: PortfolioConfig; // The resolved config
}
