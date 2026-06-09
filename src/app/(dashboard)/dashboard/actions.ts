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
    return { success: true };
  } catch (err) {
    console.error('Error in updateCareerProfileAction:', err);
    throw new Error('Could not update profile data.');
  }
}

export async function updatePortfolioAction(data: Portfolio) {
  try {
    await LocalDB.updatePortfolio(data.userId, data);
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
      receipt: `receipt_${userId}_${Date.now()}`
    });

    return { success: true, orderId: order.id, amount: 199 };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return { success: false, error: 'Failed to create order' };
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
