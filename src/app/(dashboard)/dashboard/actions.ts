'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { LocalDB, CareerProfile, Portfolio } from '@/db/local-db';
import { clearSessionCookie } from '@/lib/auth';
import Razorpay from 'razorpay';
import crypto from 'crypto';

export async function updateCareerProfileAction(data: CareerProfile) {
  try {
    await LocalDB.updateCareerProfile(data.userId, data);
    
    try {
      const { trackAppliedFieldsAction } = await import('@/app/onboarding/actions');
      await trackAppliedFieldsAction(data.userId, data);
    } catch (trackErr) {
      console.warn('[GetProspectra] trackAppliedFieldsAction error during profile edit:', trackErr);
    }

    revalidatePath('/dashboard/portfolio/editor');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err) {
    console.error('Error in updateCareerProfileAction:', err);
    throw new Error('Could not update profile data.');
  }
}

export async function savePortfolioStudioConfigAction(userId: string, draftConfig: any, publishedConfig?: any, enhancements?: any, templateId?: string) {
  try {
    const portfolio = await LocalDB.getPortfolioByUserId(userId);
    if (!portfolio) throw new Error("Portfolio not found");

    const currentEnhancements = (portfolio.enhancements as any) || {};

    // 1. If draftConfig has enhancements, merge it into enhancements
    if (draftConfig?.sections?.global?.customProps?.enhancements) {
      Object.assign(currentEnhancements, draftConfig.sections.global.customProps.enhancements);
    }
    
    // 2. Save draftConfig under enhancements.draftConfiguration
    currentEnhancements.draftConfiguration = draftConfig;

    if (templateId) {
      portfolio.templateId = templateId as any;
    }

    if (publishedConfig) {
      if (publishedConfig.sections?.global?.customProps?.enhancements) {
        Object.assign(currentEnhancements, publishedConfig.sections.global.customProps.enhancements);
      }
      // Save publishedConfig under enhancements.publishedConfiguration
      currentEnhancements.publishedConfiguration = publishedConfig;
      
      // Mirror customization fields into legacy portfolio fields for styling compatibility
      if (publishedConfig.themeId && !templateId && ['dev', 'corporate', 'creative', 'executive', 'product_builder', 'interactive_showcase', 'product'].includes(publishedConfig.themeId)) {
        portfolio.templateId = publishedConfig.themeId;
      }
      if (publishedConfig.accentColor) {
        portfolio.customAccentColor = publishedConfig.accentColor;
      }
      if (publishedConfig.sectionOrder) {
        portfolio.sectionOrder = publishedConfig.sectionOrder;
      }
    }

    if (enhancements) {
      Object.assign(currentEnhancements, enhancements);
    }

    portfolio.enhancements = currentEnhancements;
    portfolio.updatedAt = new Date().toISOString();

    await LocalDB.updatePortfolio(userId, portfolio);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err) {
    console.error('Error saving Portfolio configurations:', err);
    throw new Error('Could not save visual changes.');
  }
}

export async function updatePortfolioAction(data: Portfolio) {
  try {
    await LocalDB.updatePortfolio(data.userId, data);
    revalidatePath('/dashboard/portfolio/editor');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err) {
    console.error('Error in updatePortfolioAction:', err);
    throw new Error('Could not update portfolio.');
  }
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect('/login');
}

export async function resetProfileAction(userId: string) {
  try {
    await LocalDB.resetProfileData(userId);
  } catch (err) {
    console.error('Error in resetProfileAction:', err);
    throw new Error('Could not reset profile.');
  }
  revalidatePath('/', 'layout');
  redirect('/onboarding');
}


// --- PREMIUM SYSTEM ACTIONS ---

export async function getPremiumCreditsAction(userId: string) {
  try {
    const { getSessionUser } = await import('@/lib/auth');
    const user = await getSessionUser();
    if (user && user.id === userId) {
      return user.premiumCredits || 0;
    }
    return 0;
  } catch (err) {
    console.error('Error fetching credits:', err);
    return 0;
  }
}

export async function createRazorpayOrderAction(userId: string) {
  try {
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay keys not configured');
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: 19900, // Amount in paise
      currency: "INR",
      receipt: `rcpt_${userId.substring(0, 8)}_${Date.now()}`
    });

    return { success: true, orderId: order.id, amount: 199 };
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    const msg = error.error?.description || error.message || (typeof error === 'string' ? error : JSON.stringify(error));
    return { success: false, error: msg || 'Failed to create order' };
  }
}

export async function verifyRazorpayPaymentAction(userId: string, paymentId: string, orderId: string, signature: string) {
  try {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay secret not configured');
    }

    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(orderId + "|" + paymentId)
      .digest('hex');

    if (generated_signature !== signature) {
      throw new Error("Invalid signature");
    }
    
    await LocalDB.addPremiumCredit(userId, 1);
    
    return { success: true };
  } catch (err: any) {
    console.error('Error verifying payment:', err);
    throw new Error(err.message || 'Payment verification failed.');
  }
}

export async function startPremiumGenerationSessionAction(userId: string, profileId: string) {
  try {
    // Consume 1 credit
    const success = await LocalDB.consumePremiumCredit(userId);
    if (!success) {
      throw new Error('Insufficient premium credits.');
    }
    
    // Create session
    const session = await LocalDB.createPremiumSession(userId, profileId);
    return { success: true, sessionId: session.id };
  } catch (err) {
    console.error('Error starting premium session:', err);
    throw new Error('Failed to start generation session.');
  }
}

export async function markPremiumSessionCompletedAction(sessionId: string) {
  try {
    await LocalDB.updatePremiumSessionStatus(sessionId, 'completed');
    return { success: true };
  } catch (err) {
    console.error('Error marking session completed:', err);
    throw new Error('Failed to update session.');
  }
}


export async function getGeneratedAssetsByUserIdAction(userId: string) {
  try {
    const { LocalDB } = require('@/db/local-db');
    return await LocalDB.getGeneratedAssetsByUserId(userId);
  } catch (err) {
    return [];
  }
}

export async function getIdentityStacksByUserIdAction(userId: string) {
  try {
    const { LocalDB } = require('@/db/local-db');
    return await LocalDB.getIdentityStacksByUserId(userId);
  } catch (err) {
    return [];
  }
}

export async function getGeneratedAssetsByStackIdAction(stackId: string) {
  try {
    const { LocalDB } = require('@/db/local-db');
    return await LocalDB.getGeneratedAssetsByStackId(stackId);
  } catch (err) {
    return [];
  }
}

export async function updateIdentityStackStatusAction(stackId: string, isActive: boolean) {
  try {
    const { LocalDB } = require('@/db/local-db');
    await LocalDB.updateIdentityStackStatus(stackId, isActive);
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
}
