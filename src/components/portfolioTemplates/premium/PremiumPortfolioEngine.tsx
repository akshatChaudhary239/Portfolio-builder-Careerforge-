'use client';

import React, { useMemo, useEffect } from 'react';
import { CareerProfile, Portfolio } from '@/db/local-db';
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
  const category = profile.professionCategory || 'Developer';
  
  // 1. Procedural Engine Initialization
  const prng = useMemo(() => new PRNG(portfolio.subdomain || profile.personalInfo.fullName || 'premium_default'), [portfolio.subdomain, profile.personalInfo.fullName]);

  // 2. Smooth Scrolling Setup (Lenis) - The hallmark of Awwwards sites
  useEffect(() => {
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
  }, []);

  // 3. Dynamic Layout Ordering Engine
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

  // 4. Generative Block Assignment (Premium Mix)
  const sectionFlavors = useMemo(() => {
    const flavors: Record<SectionName, StyleFlavor> = {} as any;
    const available: StyleFlavor[] = ['Cinematic', 'Brutalist', 'Ethereal'];

    layoutOrder.forEach(sec => {
      flavors[sec] = prng.pick(available);
    });
    return flavors;
  }, [layoutOrder, prng]);

  // 5. Dynamic Section Renderer Pipeline
  const renderSection = (section: SectionName) => {
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

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] overflow-x-hidden selection:bg-[var(--color-primary)] selection:text-[var(--color-background)]">
      {/* Global CSS Noise Overlay for Premium feel */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <main className="flex flex-col items-center w-full">
        {layoutOrder.map((sectionName) => renderSection(sectionName))}
      </main>
    </div>
  );
}
