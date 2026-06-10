import { Suspense } from 'react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { LocalDB } from '@/db/local-db';
import DashboardClient from './dashboard-client';

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  // Load user data
  const [
    careerProfile,
    portfolio,
    interviewQuestions,
    identityStacks,
    generatedAssets
  ] = await Promise.all([
    LocalDB.getCareerProfileByUserId(user.id),
    LocalDB.getPortfolioByUserId(user.id),
    LocalDB.getInterviewQuestionsByUserId(user.id),
    LocalDB.getIdentityStacksByUserId(user.id),
    LocalDB.getGeneratedAssetsByUserId(user.id)
  ]);

  // If parsed data doesn't exist or is not confirmed, redirect to onboarding
  if (!careerProfile || !careerProfile.confirmed) {
    redirect('/onboarding');
  }

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col justify-between">
      {/* Header bar */}
      <header className="no-print py-4 px-6 md:px-8 border-b border-warm-border bg-white/70 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden relative shadow-sm border border-warm-border">
            <Image src="/images/getprospectra_logo.png" alt="GetProspectra Logo" fill className="object-cover" />
          </div>
          <span className="font-sans font-bold tracking-tight text-primary">GetProspectra</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
            Premium Stacks
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-primary-light font-medium">Hello, {user.name}</span>
        </div>
      </header>

      {/* Main client workspace */}
      <main className="flex-1 p-4 md:p-8">
        <Suspense fallback={<div>Loading Workspace...</div>}>
          <DashboardClient 
            user={user} 
            initialCareerProfile={careerProfile}
            initialPortfolio={portfolio}
            initialInterviewQuestions={interviewQuestions} 
            initialIdentityStacks={identityStacks}
            initialGeneratedAssets={generatedAssets}
          />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="no-print py-4 border-t border-warm-border bg-white/20 text-center text-xs text-primary-light">
        &copy; {new Date().getFullYear()} GetProspectra. Premium career package engineer.
      </footer>
    </div>
  );
}
