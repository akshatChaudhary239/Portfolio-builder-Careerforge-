import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { LocalDB } from '@/db/local-db';
import PortfolioStudioClient from './PortfolioStudioClient';
import PremiumPortfolioStudioClient from './PremiumPortfolioStudioClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PortfolioStudioPage({
  searchParams,
}: {
  searchParams?: Promise<{ premium?: string; templateId?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  const [careerProfile, portfolio, identityStacks] = await Promise.all([
    LocalDB.getCareerProfileByUserId(user.id),
    LocalDB.getPortfolioByUserId(user.id),
    LocalDB.getIdentityStacksByUserId(user.id)
  ]);

  if (!careerProfile) {
    redirect('/onboarding');
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const isPremiumParam = resolvedSearchParams.premium === 'true' || ['executive', 'product_builder', 'interactive_showcase', 'product'].includes(resolvedSearchParams.templateId || '');

  const safePortfolio = portfolio || {
    id: 'temp_portfolio',
    userId: user.id,
    templateId: 'dev',
    visibility: 'public',
    subdomain: user.name ? user.name.toLowerCase().replace(/[^a-z0-9]/g, '') : 'user',
    sectionToggles: {
      hero: true,
      skills: true,
      experience: true,
      education: true,
      projects: true,
      certifications: true,
      achievements: true,
      publications: true,
      workSamples: true
    },
    updatedAt: new Date().toISOString()
  };

  const hasPremium = identityStacks && identityStacks.length > 0;
  const baseTemplates = ['dev', 'corporate', 'creative'];
  const premiumTemplates = ['executive', 'product_builder', 'interactive_showcase', 'product'];

  const isValidBase = baseTemplates.includes(safePortfolio.templateId || '');
  const isValidPremium = premiumTemplates.includes(safePortfolio.templateId || '');

  let isPremium = false;
  if (resolvedSearchParams.premium === 'false') {
    isPremium = false;
  } else if (resolvedSearchParams.premium === 'true') {
    isPremium = true;
  } else {
    isPremium = isValidPremium;
  }

  if (hasPremium && !isValidBase && !isValidPremium) {
    isPremium = resolvedSearchParams.premium !== 'false';
    safePortfolio.templateId = (resolvedSearchParams.templateId as any) || (isPremium ? 'interactive_showcase' : 'dev');
  } else if (!isValidBase && !isValidPremium) {
    isPremium = false;
    safePortfolio.templateId = 'dev';
  }

  if (isPremium && !premiumTemplates.includes(safePortfolio.templateId || '')) {
    const requestedTemplate = resolvedSearchParams.templateId || '';
    safePortfolio.templateId = premiumTemplates.includes(requestedTemplate) 
      ? (requestedTemplate as any) 
      : 'interactive_showcase';
  } else if (!isPremium && !baseTemplates.includes(safePortfolio.templateId || '')) {
    const requestedTemplate = resolvedSearchParams.templateId || '';
    safePortfolio.templateId = baseTemplates.includes(requestedTemplate) 
      ? (requestedTemplate as any) 
      : 'dev';
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Portfolio Studio...</div>}>
      {isPremium ? (
        <PremiumPortfolioStudioClient 
          user={user} 
          careerProfile={careerProfile} 
          portfolio={safePortfolio as any} 
        />
      ) : (
        <PortfolioStudioClient 
          user={user} 
          careerProfile={careerProfile} 
          portfolio={safePortfolio as any} 
        />
      )}
    </Suspense>
  );
}
