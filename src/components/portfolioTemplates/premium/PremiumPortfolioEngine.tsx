'use client';

import React, { useMemo, useEffect } from 'react';
import { CareerProfile, Portfolio } from '@/db/local-db';
import { usePortfolioLiveConfig } from '@/components/portfolio/editor/LiveEditorContext';
import SectionEditOverlay from '@/components/portfolio/editor/SectionEditOverlay';
import { THEME_PALETTES, TYPOGRAPHY_PACKS } from '@/types/portfolio-customization';

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
}

import { PRNG } from '@/lib/visual-dna';
import Lenis from 'lenis';

// Cinematic Components
import CinematicNavbar from '../sections/premium/cinematic/CinematicNavbar';
import CinematicHero from '../sections/premium/cinematic/CinematicHero';
import CinematicAbout from '../sections/premium/cinematic/CinematicAbout';
import CinematicSkills from '../sections/premium/cinematic/CinematicSkills';
import CinematicExperience from '../sections/premium/cinematic/CinematicExperience';
import CinematicProjects from '../sections/premium/cinematic/CinematicProjects';
import CinematicDifferentiator from '../sections/premium/cinematic/CinematicDifferentiator';
import CinematicEducation from '../sections/premium/cinematic/CinematicEducation';
import CinematicCertifications from '../sections/premium/cinematic/CinematicCertifications';
import CinematicFooter from '../sections/premium/cinematic/CinematicFooter';

// Brutalist Components
import BrutalistNavbar from '../sections/premium/brutalist/BrutalistNavbar';
import BrutalistHero from '../sections/premium/brutalist/BrutalistHero';
import BrutalistAbout from '../sections/premium/brutalist/BrutalistAbout';
import BrutalistSkills from '../sections/premium/brutalist/BrutalistSkills';
import BrutalistExperience from '../sections/premium/brutalist/BrutalistExperience';
import BrutalistProjects from '../sections/premium/brutalist/BrutalistProjects';
import BrutalistDifferentiator from '../sections/premium/brutalist/BrutalistDifferentiator';
import BrutalistEducation from '../sections/premium/brutalist/BrutalistEducation';
import BrutalistCertifications from '../sections/premium/brutalist/BrutalistCertifications';
import BrutalistFooter from '../sections/premium/brutalist/BrutalistFooter';

// Ethereal Components
import EtherealNavbar from '../sections/premium/ethereal/EtherealNavbar';
import EtherealHero from '../sections/premium/ethereal/EtherealHero';
import EtherealAbout from '../sections/premium/ethereal/EtherealAbout';
import EtherealSkills from '../sections/premium/ethereal/EtherealSkills';
import EtherealExperience from '../sections/premium/ethereal/EtherealExperience';
import EtherealProjects from '../sections/premium/ethereal/EtherealProjects';
import EtherealDifferentiator from '../sections/premium/ethereal/EtherealDifferentiator';
import EtherealEducation from '../sections/premium/ethereal/EtherealEducation';
import EtherealCertifications from '../sections/premium/ethereal/EtherealCertifications';
import EtherealFooter from '../sections/premium/ethereal/EtherealFooter';

interface Props {
  profile: CareerProfile;
  portfolio: Portfolio;
}

type SectionName = 'Navbar' | 'Hero' | 'About' | 'Skills' | 'Experience' | 'Projects' | 'Differentiator' | 'Education' | 'Certifications' | 'Footer';
type StyleFlavor = 'Cinematic' | 'Brutalist' | 'Ethereal';

export default function PremiumPortfolioEngine({ profile, portfolio }: Props) {
  const { isEditorActive, customization } = usePortfolioLiveConfig();
  const category = profile.professionCategory || 'Developer';

  const activeTheme = THEME_PALETTES[customization.themeId || 'dev'] || THEME_PALETTES['dev'];
  const activeTypo = TYPOGRAPHY_PACKS[customization.typographyPack || 'modern'] || TYPOGRAPHY_PACKS['modern'];
  const primaryColor = customization.accentColor || activeTheme.primary;
  
  // 1. Procedural Engine Initialization
  const prng = useMemo(() => new PRNG(portfolio.subdomain || profile.personalInfo?.fullName || 'premium_default'), [portfolio.subdomain, profile.personalInfo?.fullName]);

  // 2. Smooth Scrolling Setup (Lenis) - The hallmark of Awwwards sites
  useEffect(() => {
    if (isEditorActive) return; // Disable Lenis smooth scrolling inside iframe/editor canvas to avoid conflict with drag/mouse scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [isEditorActive]);

  // 3. Dynamic Layout Ordering Engine
  const layoutOrder = useMemo((): SectionName[] => {
    // Custom order from customization if present
    const baseOrder = customization.sectionOrder || [];
    const ordered: SectionName[] = [];
    
    // Map base lowercase order to Premium Capitalized names
    const mapKeyToName: Record<string, SectionName> = {
      hero: 'Hero',
      about: 'About',
      skills: 'Skills',
      experience: 'Experience',
      projects: 'Projects',
      certifications: 'Certifications',
      education: 'Education',
      differentiator: 'Differentiator'
    };

    // Always keep Navbar first
    ordered.push('Navbar');

    baseOrder.forEach(key => {
      const name = mapKeyToName[key];
      if (name && !ordered.includes(name)) {
        ordered.push(name);
      }
    });

    // Make sure we include Differentiator if not in base order
    if (!ordered.includes('Differentiator')) {
      ordered.push('Differentiator');
    }

    ordered.push('Footer');
    return ordered;
  }, [customization.sectionOrder]);

  // 4. Generative Block Assignment (Premium Mix / Custom Override)
  const sectionFlavors = useMemo(() => {
    const flavors: Record<SectionName, StyleFlavor> = {} as any;
    const available: StyleFlavor[] = ['Cinematic', 'Brutalist', 'Ethereal'];

    layoutOrder.forEach(sec => {
      const secKey = sec.toLowerCase();
      // Read selected flavor from customization
      const customizedFlavor = customization?.sections?.[secKey]?.flavor || customization?.sections?.[secKey]?.customProps?.flavor;
      if (customizedFlavor && available.includes(customizedFlavor as StyleFlavor)) {
        flavors[sec] = customizedFlavor as StyleFlavor;
      } else {
        // Fallback to PRNG
        flavors[sec] = prng.pick(available);
      }
    });
    return flavors;
  }, [layoutOrder, prng, customization]);

  // 5. Dynamic Section Renderer Pipeline
  const renderSectionRaw = (section: SectionName) => {
    const key = section;
    const flavor = sectionFlavors[section];

    switch (section) {
      case 'Navbar': 
        if (flavor === 'Ethereal') return <EtherealNavbar key={key} profile={profile} />;
        if (flavor === 'Brutalist') return <BrutalistNavbar key={key} profile={profile} />;
        return <CinematicNavbar key={key} profile={profile} />;
      
      case 'Hero': 
        if (flavor === 'Ethereal') return <EtherealHero key={key} profile={profile} />;
        if (flavor === 'Brutalist') return <BrutalistHero key={key} profile={profile} />;
        return <CinematicHero key={key} profile={profile} />;
      
      case 'About': 
        if (flavor === 'Ethereal') return <EtherealAbout key={key} profile={profile} />;
        if (flavor === 'Brutalist') return <BrutalistAbout key={key} profile={profile} />;
        return <CinematicAbout key={key} profile={profile} />;
      
      case 'Skills': 
        if (flavor === 'Ethereal') return <EtherealSkills key={key} profile={profile} />;
        if (flavor === 'Brutalist') return <BrutalistSkills key={key} profile={profile} />;
        return <CinematicSkills key={key} profile={profile} />;
        
      case 'Experience': 
        if (flavor === 'Ethereal') return <EtherealExperience key={key} profile={profile} />;
        if (flavor === 'Brutalist') return <BrutalistExperience key={key} profile={profile} />;
        return <CinematicExperience key={key} profile={profile} />;
      
      case 'Projects': 
        if (flavor === 'Ethereal') return <EtherealProjects key={key} profile={profile} />;
        if (flavor === 'Brutalist') return <BrutalistProjects key={key} profile={profile} />;
        return <CinematicProjects key={key} profile={profile} />;
      
      case 'Differentiator': 
        if (flavor === 'Ethereal') return <EtherealDifferentiator key={key} profile={profile} />;
        if (flavor === 'Brutalist') return <BrutalistDifferentiator key={key} profile={profile} />;
        return <CinematicDifferentiator key={key} profile={profile} />;
      
      case 'Education': 
        if (flavor === 'Ethereal') return <EtherealEducation key={key} profile={profile} />;
        if (flavor === 'Brutalist') return <BrutalistEducation key={key} profile={profile} />;
        return <CinematicEducation key={key} profile={profile} />;
        
      case 'Certifications': 
        if (flavor === 'Ethereal') return <EtherealCertifications key={key} profile={profile} />;
        if (flavor === 'Brutalist') return <BrutalistCertifications key={key} profile={profile} />;
        return <CinematicCertifications key={key} profile={profile} />;
      
      case 'Footer': 
        if (flavor === 'Ethereal') return <EtherealFooter key={key} profile={profile} />;
        if (flavor === 'Brutalist') return <BrutalistFooter key={key} profile={profile} />;
        return <CinematicFooter key={key} profile={profile} />;
        
      default: 
        return null;
    }
  };

  const renderSection = (section: SectionName) => {
    const secKey = section.toLowerCase();
    if (customization.sections[secKey]?.visible === false) return null;

    const content = renderSectionRaw(section);
    if (!content) return null;

    if (isEditorActive && section !== 'Navbar' && section !== 'Footer') {
      return (
        <div key={section} className="w-full">
          <SectionEditOverlay sectionKey={secKey} sectionTitle={section}>
            {content}
          </SectionEditOverlay>
        </div>
      );
    }

    return content;
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
      {/* Global CSS Noise Overlay for Premium feel */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <main className="flex flex-col items-center w-full">
        {layoutOrder.map((sectionName) => renderSection(sectionName))}
      </main>
    </div>
  );
}
