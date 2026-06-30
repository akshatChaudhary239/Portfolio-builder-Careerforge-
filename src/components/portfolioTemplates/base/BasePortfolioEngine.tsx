'use client';

import React, { useMemo } from 'react';
import { CareerProfile, Portfolio } from '@/db/local-db';
import { PRNG } from '@/lib/visual-dna';
import { usePortfolioLiveConfig } from '@/components/portfolio/editor/LiveEditorContext';
import SectionEditOverlay from '@/components/portfolio/editor/SectionEditOverlay';
import { THEME_PALETTES, TYPOGRAPHY_PACKS } from '@/types/portfolio-customization';

// Modern Components
import ModernNavbar from '../sections/modern/ModernNavbar';
import ModernHero from '../sections/modern/ModernHero';
import ModernAbout from '../sections/modern/ModernAbout';
import ModernSkills from '../sections/modern/ModernSkills';
import ModernExperience from '../sections/modern/ModernExperience';
import ModernProjects from '../sections/modern/ModernProjects';
import ModernDifferentiator from '../sections/modern/ModernDifferentiator';
import ModernEducation from '../sections/modern/ModernEducation';
import ModernCertifications from '../sections/modern/ModernCertifications';
import ModernFooter from '../sections/modern/ModernFooter';

// Corporate Components
import CorporateNavbar from '../sections/corporate/CorporateNavbar';
import CorporateHero from '../sections/corporate/CorporateHero';
import CorporateAbout from '../sections/corporate/CorporateAbout';
import CorporateSkills from '../sections/corporate/CorporateSkills';
import CorporateExperience from '../sections/corporate/CorporateExperience';
import CorporateProjects from '../sections/corporate/CorporateProjects';
import CorporateDifferentiator from '../sections/corporate/CorporateDifferentiator';
import CorporateEducation from '../sections/corporate/CorporateEducation';
import CorporateCertifications from '../sections/corporate/CorporateCertifications';
import CorporateFooter from '../sections/corporate/CorporateFooter';

// Creative Components
import CreativeNavbar from '../sections/creative/CreativeNavbar';
import CreativeHero from '../sections/creative/CreativeHero';
import CreativeAbout from '../sections/creative/CreativeAbout';
import CreativeSkills from '../sections/creative/CreativeSkills';
import CreativeExperience from '../sections/creative/CreativeExperience';
import CreativeProjects from '../sections/creative/CreativeProjects';
import CreativeDifferentiator from '../sections/creative/CreativeDifferentiator';
import CreativeEducation from '../sections/creative/CreativeEducation';
import CreativeCertifications from '../sections/creative/CreativeCertifications';
import CreativeFooter from '../sections/creative/CreativeFooter';

interface Props {
  profile: CareerProfile;
  portfolio: Portfolio;
}

type SectionName = 'Navbar' | 'Hero' | 'About' | 'Skills' | 'Experience' | 'Projects' | 'Differentiator' | 'Education' | 'Certifications' | 'Footer';
type StyleFlavor = 'Modern' | 'Corporate' | 'Creative';

export default function BasePortfolioEngine({ profile, portfolio }: Props) {
  const { isEditorActive, customization } = usePortfolioLiveConfig();

  const activeTheme = THEME_PALETTES[customization.themeId || 'dev'] || THEME_PALETTES['dev'];
  const activeTypo = TYPOGRAPHY_PACKS[customization.typographyPack || 'modern'] || TYPOGRAPHY_PACKS['modern'];
  const primaryColor = customization.accentColor || activeTheme.primary;

  const hexToRgb = (hex: string) => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
  };

  const category = profile.professionCategory || 'Developer';
  
  // 1. Procedural Engine Initialization
  const prng = useMemo(() => new PRNG(portfolio.subdomain || profile.personalInfo?.fullName || 'default'), [portfolio.subdomain, profile.personalInfo?.fullName]);

  // 2. Dynamic Layout Ordering Engine
  const defaultOrder = useMemo((): SectionName[] => {
    switch (category) {
      case 'Designer':
        return ['Navbar', 'Hero', 'Projects', 'Skills', 'Experience', 'About', 'Differentiator', 'Education', 'Certifications', 'Footer'];
      case 'Developer':
        return ['Navbar', 'Hero', 'About', 'Skills', 'Projects', 'Experience', 'Differentiator', 'Education', 'Certifications', 'Footer'];
      case 'MBA / Business':
        return ['Navbar', 'Hero', 'About', 'Experience', 'Differentiator', 'Projects', 'Skills', 'Education', 'Certifications', 'Footer'];
      case 'Marketing':
        return ['Navbar', 'Hero', 'Projects', 'Experience', 'Skills', 'Differentiator', 'About', 'Education', 'Certifications', 'Footer'];
      case 'Data Analyst':
        return ['Navbar', 'Hero', 'About', 'Skills', 'Experience', 'Projects', 'Education', 'Certifications', 'Differentiator', 'Footer'];
      default:
        return ['Navbar', 'Hero', 'About', 'Skills', 'Experience', 'Projects', 'Education', 'Certifications', 'Footer'];
    }
  }, [category]);

  const activeOrder = useMemo(() => {
    if (customization.sectionOrder && customization.sectionOrder.length > 0) {
      const mapped = customization.sectionOrder.map(s => (s.charAt(0).toUpperCase() + s.slice(1)) as SectionName);
      return Array.from(new Set([...mapped, ...defaultOrder]));
    }
    return defaultOrder;
  }, [customization.sectionOrder, defaultOrder]);

  // 3. Generative Block Assignment
  const sectionFlavors = useMemo(() => {
    const flavors: Record<SectionName, StyleFlavor> = {} as any;
    const available: StyleFlavor[] = ['Modern', 'Corporate', 'Creative'];
    
    const userPref = profile.professionalBlueprint?.stylePreference;
    if (userPref === 'Creative' || userPref === 'Corporate' || userPref === 'Modern') {
      available.push(userPref as StyleFlavor, userPref as StyleFlavor);
    }

    activeOrder.forEach(sec => {
      flavors[sec] = prng.pick(available);
    });
    return flavors;
  }, [activeOrder, profile.professionalBlueprint?.stylePreference, prng]);

  // 4. Dynamic Section Renderer Pipeline
  const renderSectionContent = (section: SectionName) => {
    const key = section;
    const flavor = sectionFlavors[section];

    switch (section) {
      case 'Navbar': 
        if (isEditorActive) return null;
        if (flavor === 'Creative') return <CreativeNavbar key={key} profile={profile} />;
        if (flavor === 'Corporate') return <CorporateNavbar key={key} profile={profile} />;
        return <ModernNavbar key={key} profile={profile} />;
      
      case 'Hero': 
        if (flavor === 'Creative') return <CreativeHero key={key} profile={profile} />;
        if (flavor === 'Corporate') return <CorporateHero key={key} profile={profile} />;
        return <ModernHero key={key} profile={profile} />;
      
      case 'About': 
        if (flavor === 'Creative') return <CreativeAbout key={key} profile={profile} />;
        if (flavor === 'Corporate') return <CorporateAbout key={key} profile={profile} />;
        return <ModernAbout key={key} profile={profile} />;
      
      case 'Skills': 
        if (flavor === 'Creative') return <CreativeSkills key={key} profile={profile} />;
        if (flavor === 'Corporate') return <CorporateSkills key={key} profile={profile} />;
        return <ModernSkills key={key} profile={profile} />;
        
      case 'Experience': 
        if (flavor === 'Creative') return <CreativeExperience key={key} profile={profile} />;
        if (flavor === 'Corporate') return <CorporateExperience key={key} profile={profile} />;
        return <ModernExperience key={key} profile={profile} />;
      
      case 'Projects': 
        if (flavor === 'Creative') return <CreativeProjects key={key} profile={profile} />;
        if (flavor === 'Corporate') return <CorporateProjects key={key} profile={profile} />;
        return <ModernProjects key={key} profile={profile} />;
      
      case 'Differentiator': 
        if (flavor === 'Creative') return <CreativeDifferentiator key={key} profile={profile} />;
        if (flavor === 'Corporate') return <CorporateDifferentiator key={key} profile={profile} />;
        return <ModernDifferentiator key={key} profile={profile} />;
      
      case 'Education': 
        if (flavor === 'Creative') return <CreativeEducation key={key} profile={profile} />;
        if (flavor === 'Corporate') return <CorporateEducation key={key} profile={profile} />;
        return <ModernEducation key={key} profile={profile} />;
        
      case 'Certifications': 
        if (flavor === 'Creative') return <CreativeCertifications key={key} profile={profile} />;
        if (flavor === 'Corporate') return <CorporateCertifications key={key} profile={profile} />;
        return <ModernCertifications key={key} profile={profile} />;
      
      case 'Footer': 
        if (flavor === 'Creative') return <CreativeFooter key={key} profile={profile} />;
        if (flavor === 'Corporate') return <CorporateFooter key={key} profile={profile} />;
        return <ModernFooter key={key} profile={profile} />;
        
      default: 
        return null;
    }
  };

  return (
    <div 
      className="min-h-screen transition-colors duration-300 bg-[var(--color-background)] text-[var(--color-text)] overflow-x-hidden selection:bg-[var(--color-primary)] selection:text-[var(--color-background)] font-[var(--font-body)]"
      style={{
        '--color-primary': primaryColor,
        '--color-primary-rgb': hexToRgb(primaryColor),
        '--color-secondary': activeTheme.secondary,
        '--color-background': activeTheme.background,
        '--color-surface': activeTheme.surface,
        '--color-text': activeTheme.text,
        '--color-muted': activeTheme.muted,
        '--font-heading': activeTypo.headingFont,
        '--font-body': activeTypo.bodyFont,
      } as React.CSSProperties}
    >
      <style dangerouslySetInnerHTML={{ __html: `@import url('${activeTypo.importUrl}');` }} />

      <main className="flex flex-col items-center w-full">
        {activeOrder.map((sectionName) => {
          const secKey = sectionName.toLowerCase();
          if (customization.sections[secKey]?.visible === false) return null;

          const content = renderSectionContent(sectionName);
          if (!content) return null;

          if (isEditorActive && sectionName !== 'Navbar' && sectionName !== 'Footer') {
            return (
              <div key={sectionName} className="w-full">
                <SectionEditOverlay sectionKey={secKey} sectionTitle={sectionName}>
                  {content}
                </SectionEditOverlay>
              </div>
            );
          }

          return content;
        })}
      </main>
    </div>
  );
}
