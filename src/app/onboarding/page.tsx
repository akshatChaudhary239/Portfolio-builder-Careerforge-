import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { LocalDB } from '@/db/local-db';
import OnboardingClient from './onboarding-client';

export default async function OnboardingPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  // Check if they already have confirmed onboarding data
  const existingData = await LocalDB.getCareerProfileByUserId(user.id);
  if (existingData && existingData.confirmed) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col justify-between">
      {/* Mini header */}
      <header className="py-6 px-8 border-b border-warm-border bg-white/50 backdrop-blur-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold">
            CF
          </div>
          <span className="font-sans font-bold tracking-tight text-primary">CareerForge</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-primary-light font-medium">Logged in as {user.name}</span>
        </div>
      </header>

      {/* Dynamic client wizard */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl bg-warm-surface border border-warm-border rounded-2xl shadow-xs p-6 md:p-10">
          <OnboardingClient userId={user.id} userName={user.name} />
        </div>
      </main>

      {/* Mini footer */}
      <footer className="py-6 border-t border-warm-border bg-white/20 text-center text-xs text-primary-light">
        &copy; {new Date().getFullYear()} CareerForge. Premium Career Identity Engineering.
      </footer>
    </div>
  );
}
