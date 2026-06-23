import React from 'react';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import SocialProofBar from '@/components/landing/SocialProofBar';
import BeforeAfterSection from '@/components/landing/BeforeAfterSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import TransformationShowcase from '@/components/landing/TransformationShowcase';
import PortfolioCarousel from '@/components/landing/PortfolioCarousel';
import WhatsIncludedSection from '@/components/landing/WhatsIncludedSection';
import PricingSection from '@/components/landing/PricingSection';
import TestimonialCarousel from '@/components/landing/TestimonialCarousel';
import FAQSection from '@/components/landing/FAQSection';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

export const metadata = {
  title: 'GetProspectra | Engineering Your Professional Identity Package',
  description: 'Create a complete professional identity package including your resume, portfolio website, interview preparation and career insights from a single verified career profile.',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-v2-bg)] selection:bg-[var(--color-v2-primary)] selection:text-white font-sans text-[var(--color-v2-text-primary)]">
      <Navbar />
      <main>
        <HeroSection />
        <SocialProofBar />
        <BeforeAfterSection />
        <HowItWorksSection />
        <TransformationShowcase />
        <PortfolioCarousel />
        <WhatsIncludedSection />
        <TestimonialCarousel />
        <PricingSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
