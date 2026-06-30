import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { LocalDB } from '@/db/local-db';
import PortfolioStudioClient from './PortfolioStudioClient';

export default async function PortfolioStudioPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  const [careerProfile, portfolio] = await Promise.all([
    LocalDB.getCareerProfileByUserId(user.id),
    LocalDB.getPortfolioByUserId(user.id)
  ]);

  if (!careerProfile) {
    redirect('/onboarding');
  }

  const safePortfolio = portfolio || {
    id: 'temp_portfolio',
    userId: user.id,
    templateId: 'dev',
    visibility: 'public',
    subdomain: user.username || 'user',
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

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Portfolio Studio...</div>}>
      <PortfolioStudioClient 
        user={user} 
        careerProfile={careerProfile} 
        portfolio={safePortfolio as any} 
      />
    </Suspense>
  );
}
