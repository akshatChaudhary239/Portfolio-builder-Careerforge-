'use server';

import { LocalDB, CareerProfile, GeneratedAsset } from '@/db/local-db';
import { AIService } from '@/lib/ai-service';
import { revalidatePath } from 'next/cache';

export async function processPremiumGenerationAction(sessionId: string, careerProfile: CareerProfile) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY || '';

    console.log('[Premium Generation] Starting pipeline for session:', sessionId);

    // 1. Resumes
    console.log('[Premium Generation] Generating Leadership Resume...');
    const leadershipData = await AIService.generatePremiumResumeVariant(careerProfile, 'leadership', apiKey);
    
    console.log('[Premium Generation] Generating Technical Resume...');
    const technicalData = await AIService.generatePremiumResumeVariant(careerProfile, 'technical', apiKey);
    
    console.log('[Premium Generation] Generating Balanced Resume...');
    const balancedData = await AIService.generatePremiumResumeVariant(careerProfile, 'balanced', apiKey);
    
    // 2. Analysis
    console.log('[Premium Generation] Generating Career Analysis...');
    const analysisData = await AIService.generatePremiumCareerAnalysis(careerProfile, apiKey);

    // 3. Create Premium Interview Prep
    console.log('[Premium Generation] Generating Interview Prep...');
    const interviewData = await AIService.generatePremiumInterviewPrep(careerProfile, apiKey);

    // 4. Create Single Identity Stack
    console.log('[Premium Generation] Creating Premium Portfolio Stack & Assets...');
    
    const premiumStack = LocalDB.createIdentityStack({
      userId: careerProfile.userId,
      profileId: careerProfile.id,
      stackName: 'Premium Portfolio',
      stackType: 'premium',
      generationTier: 'premium',
      profileVersion: careerProfile.createdAt || new Date().toISOString(),
      generationSessionId: sessionId,
      isActive: true // Make this the newly active stack
    });

    // 5. Save Assets
    const assetsToSave: Omit<GeneratedAsset, 'id' | 'createdAt'>[] = [
      // Resumes
      {
        userId: careerProfile.userId,
        stackId: premiumStack.id,
        assetType: 'resume',
        assetVariant: 'leadership',
        generatedContent: leadershipData
      },
      {
        userId: careerProfile.userId,
        stackId: premiumStack.id,
        assetType: 'resume',
        assetVariant: 'technical',
        generatedContent: technicalData
      },
      {
        userId: careerProfile.userId,
        stackId: premiumStack.id,
        assetType: 'resume',
        assetVariant: 'balanced',
        generatedContent: balancedData
      },
      // Analysis
      {
        userId: careerProfile.userId,
        stackId: premiumStack.id,
        assetType: 'analysis',
        assetVariant: 'premium',
        generatedContent: analysisData
      },
      // Interview Prep
      {
        userId: careerProfile.userId,
        stackId: premiumStack.id,
        assetType: 'questions',
        assetVariant: 'premium',
        generatedContent: interviewData
      }
    ];

    LocalDB.saveGeneratedAssets(assetsToSave);
    LocalDB.updatePremiumSessionStatus(sessionId, 'completed');

    console.log('[Premium Generation] Pipeline complete!');

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    console.error('Generation failed:', err);
    LocalDB.updatePremiumSessionStatus(sessionId, 'failed');
    return { success: false, error: err.message || 'Generation failed.' };
  }
}
export async function regenerateSingleVariantAction(assetId: string, careerProfile: CareerProfile, variant: 'leadership' | 'technical' | 'balanced') {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY || '';
    const newData = await AIService.generatePremiumResumeVariant(careerProfile, variant, apiKey);
    LocalDB.updateGeneratedAsset(assetId, newData);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    console.error('Error regenerating single variant:', err);
    return { success: false, error: err.message || 'Failed to regenerate variant' };
  }
}
