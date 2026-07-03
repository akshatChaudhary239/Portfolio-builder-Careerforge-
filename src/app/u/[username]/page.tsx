import { notFound } from 'next/navigation';
import { LocalDB } from '@/db/local-db';
import { generatePortfolioData } from '@/lib/portfolio-enhancements';
import { getSessionUser } from '@/lib/auth';
import DynamicPortfolioClient from './DynamicPortfolioClient';

export const revalidate = 0; // Dynamic server page

export default async function PublicPortfolioPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ theme?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const username = resolvedParams.username;
  const theme = resolvedSearchParams.theme;
  
  const record = await LocalDB.getPortfolioBySubdomain(username);
  if (!record || record.portfolio.visibility === 'private' || !record.careerProfile) {
    notFound();
  }

  const currentUser = await getSessionUser();
  const isOwner = currentUser?.id === record.user.id;

  const identityStacks = await LocalDB.getIdentityStacksByUserId(record.user.id);
  const hasPremium = identityStacks && identityStacks.length > 0;

  const baseTemplates = ['dev', 'corporate', 'creative'];
  const premiumTemplates = ['executive', 'product_builder', 'interactive_showcase', 'product'];

  const isValidBase = baseTemplates.includes(record.portfolio.templateId || '');
  const isValidPremium = premiumTemplates.includes(record.portfolio.templateId || '');

  if (hasPremium && !isValidBase && !isValidPremium) {
    record.portfolio.templateId = 'interactive_showcase' as any;
  } else if (!isValidBase && !isValidPremium) {
    record.portfolio.templateId = 'dev' as any;
  }

  const activeTemplate = theme || record.portfolio.templateId || 'dev';
  const isPremiumTemplate = premiumTemplates.includes(activeTemplate);

  const enhancedProfile = isPremiumTemplate 
    ? generatePortfolioData(record.careerProfile, record.portfolio.enhancements)
    : record.careerProfile;

  return (
    <div className="min-h-screen bg-warm-bg">
      <DynamicPortfolioClient
        portfolio={record.portfolio}
        user={record.user}
        careerProfile={enhancedProfile}
        overrideTheme={theme}
        isOwner={isOwner}
        hasPremium={hasPremium}
      />
    </div>
  );
}
