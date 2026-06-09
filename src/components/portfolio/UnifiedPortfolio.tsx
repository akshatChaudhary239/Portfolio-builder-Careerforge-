import React from 'react';
import { CareerProfile, Portfolio } from '@/db/local-db';

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
  // Use the sectionOrder if defined, otherwise fall back to default
  const defaultOrder = ['hero', 'experience', 'projects', 'skills', 'certifications', 'contact'];
  const activeOrder = (portfolio.sectionOrder?.length ? portfolio.sectionOrder : defaultOrder)
    .filter(key => (portfolio.sectionToggles as Record<string, boolean>)[key] !== false);

  const renderSection = (sectionKey: string) => {
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

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] font-sans selection:bg-[var(--color-primary)] selection:text-white pb-20">
      <Navbar profile={profile} portfolio={portfolio} />
      
      <main className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="flex flex-col gap-32">
          {activeOrder.map(renderSection)}
        </div>
      </main>
    </div>
  );
}
