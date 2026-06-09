'use client';

import React, { useMemo } from 'react';
import { CareerProfile, Portfolio } from '@/db/local-db';
import { PRNG } from '@/lib/visual-dna';

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
  const category = profile.professionCategory || 'Developer';
  
  // 1. Procedural Engine Initialization
  const prng = useMemo(() => new PRNG(portfolio.subdomain || profile.personalInfo?.fullName || 'default'), [portfolio.subdomain, profile.personalInfo?.fullName]);

  // 2. Dynamic Layout Ordering Engine
  const layoutOrder = useMemo((): SectionName[] => {
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

  // 3. Generative Block Assignment
  // For each section, deterministically pick which flavor of component to render
  const sectionFlavors = useMemo(() => {
    const flavors: Record<SectionName, StyleFlavor> = {} as any;
    const available: StyleFlavor[] = ['Modern', 'Corporate', 'Creative'];
    
    // We weight the user's explicit preference slightly if they have one
    const userPref = profile.professionalBlueprint?.stylePreference;
    if (userPref === 'Creative' || userPref === 'Corporate' || userPref === 'Modern') {
      available.push(userPref as StyleFlavor, userPref as StyleFlavor); // Double weight
    }

    layoutOrder.forEach(sec => {
      flavors[sec] = prng.pick(available);
    });
    return flavors;
  }, [layoutOrder, profile.professionalBlueprint?.stylePreference, prng]);

  // 4. Dynamic Section Renderer Pipeline
  const renderSection = (section: SectionName) => {
    const key = section;
    const flavor = sectionFlavors[section];

    switch (section) {
      case 'Navbar': 
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
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] overflow-x-hidden selection:bg-[var(--color-primary)] selection:text-[var(--color-background)]">
      <main className="flex flex-col items-center w-full">
        {layoutOrder.map((sectionName) => renderSection(sectionName))}
      </main>
    </div>
  );
}
