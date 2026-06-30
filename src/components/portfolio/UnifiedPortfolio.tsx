'use client';

import React from 'react';
import { CareerProfile, Portfolio } from '@/db/local-db';
import { usePortfolioLiveConfig } from './editor/LiveEditorContext';
import SectionEditOverlay from './editor/SectionEditOverlay';
import { THEME_PALETTES, TYPOGRAPHY_PACKS } from '@/types/portfolio-customization';

import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import Experience from './sections/Experience';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Certifications from './sections/Certifications';
import Contact from './sections/Contact';

export interface UnifiedPortfolioProps {
  profile: CareerProfile;
  portfolio: Portfolio;
}

export default function UnifiedPortfolio({ profile, portfolio }: UnifiedPortfolioProps) {
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

  const defaultOrder = ['hero', 'experience', 'projects', 'skills', 'certifications', 'contact'];
  const orderSource = customization.sectionOrder?.length ? customization.sectionOrder : (portfolio.sectionOrder?.length ? portfolio.sectionOrder : defaultOrder);
  
  const activeOrder = orderSource.filter(key => {
    const customSec = customization.sections[key];
    if (customSec && customSec.visible === false) return false;
    if (!customSec && portfolio.sectionToggles && (portfolio.sectionToggles as any)[key] === false) return false;
    return true;
  });

  const renderSectionContent = (sectionKey: string) => {
    switch (sectionKey) {
      case 'hero':
        return <Hero key="hero" profile={profile} portfolio={portfolio} />;
      case 'experience':
        return <Experience key="experience" profile={profile} portfolio={portfolio} />;
      case 'projects':
        return <Projects key="projects" profile={profile} portfolio={portfolio} />;
      case 'skills':
        return <Skills key="skills" profile={profile} portfolio={portfolio} />;
      case 'certifications':
        return <Certifications key="certifications" profile={profile} portfolio={portfolio} />;
      case 'contact':
        return <Contact key="contact" profile={profile} portfolio={portfolio} />;
      default:
        return null;
    }
  };

  const sectionTitlesMap: Record<string, string> = {
    hero: 'Hero',
    experience: 'Experience',
    projects: 'Projects',
    skills: 'Skills',
    certifications: 'Certifications',
    contact: 'Contact'
  };

  return (
    <div 
      className="min-h-screen transition-colors duration-300 bg-[var(--color-background)] text-[var(--color-text)] font-[var(--font-body)] selection:bg-[var(--color-primary)] selection:text-white pb-20 relative"
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
        '--radius-base': '12px'
      } as React.CSSProperties}
    >
      <style dangerouslySetInnerHTML={{ __html: `@import url('${activeTypo.importUrl}');` }} />
      
      {!isEditorActive && <Navbar profile={profile} portfolio={portfolio} />}
      
      <main className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="flex flex-col gap-24 md:gap-32 pt-8">
          {activeOrder.map(sectionKey => {
            const content = renderSectionContent(sectionKey);
            if (!content) return null;

            if (isEditorActive) {
              return (
                <SectionEditOverlay key={sectionKey} sectionKey={sectionKey} sectionTitle={sectionTitlesMap[sectionKey] || sectionKey}>
                  {content}
                </SectionEditOverlay>
              );
            }

            return content;
          })}
        </div>
      </main>
    </div>
  );
}
