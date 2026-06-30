export type PropertyType = 
  | 'text' 
  | 'textarea' 
  | 'select' 
  | 'toggle' 
  | 'slider' 
  | 'color' 
  | 'spacing' 
  | 'alignment';

export interface PropertyField {
  name: string;
  label: string;
  type: PropertyType;
  default: any;
  options?: string[] | { label: string; value: any }[];
  min?: number;
  max?: number;
  step?: number;
}

export interface ComponentSchema {
  id: string;
  name: string;
  fields: PropertyField[];
}

export const COMPONENT_SCHEMAS: Record<string, ComponentSchema> = {
  hero: {
    id: 'hero',
    name: 'Hero Configuration',
    fields: [
      { name: 'headline', label: 'Main Headline', type: 'text', default: '' },
      { name: 'subtitle', label: 'Tagline / Category', type: 'text', default: '' },
      { name: 'description', label: 'Biography Summary', type: 'textarea', default: '' },
      { name: 'alignment', label: 'Text Alignment', type: 'alignment', default: 'left' },
      { name: 'paddingY', label: 'Vertical Spacing', type: 'select', default: 'normal', options: ['compact', 'normal', 'spacious'] },
      { name: 'animate', label: 'Enter Animation', type: 'select', default: 'fade', options: ['none', 'fade', 'slide', 'scale'] },
    ]
  },
  experience: {
    id: 'experience',
    name: 'Experience Configuration',
    fields: [
      { name: 'customTitle', label: 'Section Header Title', type: 'text', default: 'Professional History' },
      { name: 'customSubtitle', label: 'Section Tagline', type: 'text', default: '' },
      { name: 'layoutVariant', label: 'Timeline Layout Variant', type: 'select', default: 'timeline', options: ['timeline', 'cards', 'compact'] },
      { name: 'alignment', label: 'Header Alignment', type: 'alignment', default: 'left' },
      { name: 'showDots', label: 'Timeline Connectors', type: 'toggle', default: true },
      { name: 'animate', label: 'Glow Effects', type: 'toggle', default: false },
    ]
  },
  projects: {
    id: 'projects',
    name: 'Projects Configuration',
    fields: [
      { name: 'customTitle', label: 'Section Header Title', type: 'text', default: "Things I've Built" },
      { name: 'customSubtitle', label: 'Section Tagline', type: 'text', default: 'Featured Showcase' },
      { name: 'layoutVariant', label: 'Grid Layout Variant', type: 'select', default: 'grid3', options: ['grid2', 'grid3', 'list'] },
      { name: 'alignment', label: 'Header Alignment', type: 'alignment', default: 'left' },
      { name: 'cardGlow', label: 'Card Border Hover Glow', type: 'toggle', default: true },
      { name: 'animate', label: 'Reveal Animation', type: 'select', default: 'slide', options: ['none', 'fade', 'slide'] },
    ]
  },
  skills: {
    id: 'skills',
    name: 'Skills Configuration',
    fields: [
      { name: 'customTitle', label: 'Section Title', type: 'text', default: 'Skills & Expertise' },
      { name: 'customSubtitle', label: 'Section Subtitle', type: 'text', default: 'My Toolkit' },
      { name: 'alignment', label: 'Alignment', type: 'alignment', default: 'center' },
      { name: 'pillStyle', label: 'Skill Pill Shape', type: 'select', default: 'full', options: ['square', 'rounded', 'full'] },
    ]
  },
  contact: {
    id: 'contact',
    name: 'Contact Configuration',
    fields: [
      { name: 'customTitle', label: 'Section Title', type: 'text', default: "Let's Connect" },
      { name: 'customDescription', label: 'Short Call-to-Action Text', type: 'textarea', default: '' },
      { name: 'alignment', label: 'Alignment', type: 'alignment', default: 'center' },
      { name: 'showMap', label: 'Show Location Pins', type: 'toggle', default: true },
    ]
  }
};
