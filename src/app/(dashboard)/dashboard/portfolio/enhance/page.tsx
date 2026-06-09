import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { LocalDB } from '@/db/local-db';
import EnhancePortfolioClient from './enhance-client';
import { Suspense } from 'react';

export default async function EnhancePortfolioPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  const careerProfile = LocalDB.getCareerProfileByUserId(user.id);
  const portfolio = LocalDB.getPortfolioByUserId(user.id);

  if (!careerProfile || !portfolio) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col">
      <header className="py-4 px-6 md:px-8 border-b border-warm-border bg-white/70 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold">
            CF
          </div>
          <span className="font-sans font-bold tracking-tight text-primary">Portfolio Enhancement</span>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
        <Suspense fallback={<div className="animate-pulse h-64 bg-slate-100 rounded-2xl"></div>}>
          <EnhancePortfolioClient 
            careerProfile={careerProfile} 
            portfolio={portfolio} 
          />
        </Suspense>
      </main>
    </div>
  );
}
