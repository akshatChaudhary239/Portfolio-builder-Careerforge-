import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { LocalDB } from '@/db/local-db';
import OnboardingClient from '@/app/onboarding/onboarding-client';

export default async function EditProfilePage() {
  const user = await getSessionUser();
  
  if (!user) {
    redirect('/login');
  }

  const careerProfile = LocalDB.getCareerProfileByUserId(user.id);

  if (!careerProfile) {
    redirect('/onboarding');
  }

  return (
    <div className="min-h-screen bg-warm-bg pb-12">
      <OnboardingClient 
        userId={user.id} 
        userName={user.name} 
        isEditMode={true} 
        initialProfile={careerProfile} 
      />
    </div>
  );
}
