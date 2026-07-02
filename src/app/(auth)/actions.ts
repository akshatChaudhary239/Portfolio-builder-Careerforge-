'use server';

import { LocalDB } from '@/db/local-db';
import { hashPassword, setSessionCookie } from '@/lib/auth';
import { 
  generateVerificationCode, 
  savePendingVerification, 
  getPendingVerification, 
  removePendingVerification, 
  sendVerificationEmail 
} from '@/lib/verification';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Missing credentials' };
  }

  const existingUser = await LocalDB.getUserByEmail(email);
  if (!existingUser) {
    return { error: 'Invalid email or password' };
  }

  const hashed = hashPassword(password);
  if (existingUser.passwordHash !== hashed) {
    return { error: 'Invalid email or password' };
  }

  await setSessionCookie(existingUser.id);
  return { success: true };
}

export async function registerAction(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { error: 'Please fill in all fields' };
  }

  const existingUser = await LocalDB.getUserByEmail(email);
  if (existingUser) {
    return { error: 'Email address is already in use' };
  }

  // Hash password and prepare verification code
  const hashed = hashPassword(password);
  const code = generateVerificationCode();

  try {
    await savePendingVerification(email, name, hashed, code);
    await sendVerificationEmail(email, code);
    return { success: true, email, step: 'verify' };
  } catch (err) {
    return { error: 'Failed to send verification email. Please try again.' };
  }
}

export async function verifyAndCreateAccountAction(email: string, code: string) {
  if (!email || !code) {
    return { error: 'Please provide all verification fields' };
  }

  const pending = await getPendingVerification(email);
  if (!pending) {
    return { error: 'Verification code has expired or is invalid. Please restart register process.' };
  }

  if (pending.code !== code.trim()) {
    return { error: 'Invalid verification code' };
  }

  try {
    // Create the confirmed user record in the DB
    const newUser = await LocalDB.createUser({
      email: pending.email,
      name: pending.name,
      passwordHash: pending.passwordHash,
    });

    await setSessionCookie(newUser.id);
    await removePendingVerification(pending.email);
    return { success: true };
  } catch (err) {
    return { error: 'Failed to create account. Please try again.' };
  }
}

export async function resendVerificationCodeAction(email: string) {
  if (!email) {
    return { error: 'Email address is required' };
  }

  const pending = await getPendingVerification(email);
  if (!pending) {
    return { error: 'Register session not found. Please restart register process.' };
  }

  const newCode = generateVerificationCode();
  try {
    await savePendingVerification(pending.email, pending.name, pending.passwordHash, newCode);
    await sendVerificationEmail(pending.email, newCode);
    return { success: true };
  } catch (err) {
    return { error: 'Failed to resend code. Please try again.' };
  }
}