import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { LocalDB } from '@/db/local-db';
import PremiumGenerateClient from './generate-client';

export default async function PremiumGeneratePage({ searchParams }: { searchParams: Promise<{ sessionId?: string }> }) {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const { sessionId } = await searchParams;
  if (!sessionId) redirect('/dashboard');

  const db = require('@/db/local-db').LocalDB;
  const session = await db.getPremiumSessionById(sessionId);
  
  if (!session) redirect('/dashboard');

  const careerProfile = await db.getCareerProfileByUserId(user.id);
  if (!careerProfile) redirect('/onboarding');

  return (
    <PremiumGenerateClient 
      user={user} 
      session={session} 
      careerProfile={careerProfile} 
    />
  );
}
