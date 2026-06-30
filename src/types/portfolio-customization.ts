export interface SectionCustomization {
  visible: boolean;
  variant?: 'variantA' | 'variantB' | 'variantC';
  customTitle?: string;
  customSubtitle?: string;
  customDescription?: string;
  accentColor?: string;
  alignment?: 'left' | 'center' | 'right';
  paddingY?: 'compact' | 'normal' | 'spacious';
  customProps?: Record<string, any>;
  itemOverrides?: Record<string, Record<string, any>>;
}

export type TypographyPack = 'modern' | 'editorial' | 'technical' | 'elegant';

export interface ThemePalette {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
}

export const THEME_PALETTES: Record<string, ThemePalette> = {
  dev: { id: 'dev', name: 'Developer Dark', primary: '#6366F1', secondary: '#A855F7', background: '#090D16', surface: '#111827', text: '#F9FAFB', muted: '#9CA3AF' },
  corporate: { id: 'corporate', name: 'Corporate Blue', primary: '#2563EB', secondary: '#0EA5E9', background: '#0F172A', surface: '#1E293B', text: '#F8FAFC', muted: '#94A3B8' },
  creative: { id: 'creative', name: 'Creative Neon', primary: '#EC4899', secondary: '#8B5CF6', background: '#0F0E17', surface: '#1A1829', text: '#FFFFFE', muted: '#A7A9BE' },
  executive: { id: 'executive', name: 'Executive Gold', primary: '#D97706', secondary: '#B45309', background: '#0C0A09', surface: '#1C1917', text: '#FAFAF9', muted: '#A8A29E' },
  emerald: { id: 'emerald', name: 'Emerald Minimal', primary: '#10B981', secondary: '#059669', background: '#064E3B', surface: '#065F46', text: '#ECFDF5', muted: '#A7F3D0' },
  warm: { id: 'warm', name: 'Warm Sunset', primary: '#F97316', secondary: '#E11D48', background: '#431407', surface: '#7C2D12', text: '#FFFBFA', muted: '#FDBA74' }
};

export const TYPOGRAPHY_PACKS: Record<TypographyPack, { name: string; headingFont: string; bodyFont: string; importUrl: string }> = {
  modern: { name: 'Modern Sans', headingFont: "'Inter', sans-serif", bodyFont: "'Inter', sans-serif", importUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap' },
  editorial: { name: 'Editorial Serif', headingFont: "'Playfair Display', serif", bodyFont: "'Plus Jakarta Sans', sans-serif", importUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap' },
  technical: { name: 'Tech Mono', headingFont: "'JetBrains Mono', monospace", bodyFont: "'Inter', sans-serif", importUrl: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&family=Inter:wght@400;500;600&display=swap' },
  elegant: { name: 'Elegant Display', headingFont: "'Outfit', sans-serif", bodyFont: "'Outfit', sans-serif", importUrl: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap' }
};

export interface PortfolioCustomizationState {
  themeId: string;
  typographyPack: TypographyPack;
  accentColor?: string;
  sectionOrder: string[];
  sections: Record<string, SectionCustomization>;
  syncNotificationDismissed?: boolean;
}

export const DEFAULT_SECTION_ORDER = [
  'hero',
  'experience',
  'projects',
  'skills',
  'certifications',
  'contact'
];

export const DEFAULT_CUSTOMIZATION: PortfolioCustomizationState = {
  themeId: 'dev',
  typographyPack: 'modern',
  sectionOrder: DEFAULT_SECTION_ORDER,
  sections: {
    hero: { visible: true, variant: 'variantA', alignment: 'left', paddingY: 'normal' },
    experience: { visible: true, variant: 'variantA', alignment: 'left', paddingY: 'normal' },
    projects: { visible: true, variant: 'variantA', alignment: 'left', paddingY: 'normal' },
    skills: { visible: true, variant: 'variantA', alignment: 'left', paddingY: 'normal' },
    certifications: { visible: true, variant: 'variantA', alignment: 'left', paddingY: 'normal' },
    contact: { visible: true, variant: 'variantA', alignment: 'center', paddingY: 'normal' }
  }
};
