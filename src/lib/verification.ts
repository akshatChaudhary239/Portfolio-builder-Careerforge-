import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';

export interface PendingVerification {
  email: string;
  name: string;
  passwordHash: string;
  code: string;
  expiresAt: number; // timestamp
}

export function generateVerificationCode(): string {
  // Generate a random 6-digit numeric code
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function savePendingVerification(
  email: string,
  name: string,
  passwordHash: string,
  code: string
): Promise<void> {
  const normalizedEmail = email.toLowerCase().trim();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  
  await prisma.pendingVerification.upsert({
    where: { email: normalizedEmail },
    update: {
      name,
      passwordHash,
      code,
      expiresAt
    },
    create: {
      email: normalizedEmail,
      name,
      passwordHash,
      code,
      expiresAt
    }
  });
}

export async function getPendingVerification(email: string): Promise<PendingVerification | null> {
  const normalizedEmail = email.toLowerCase().trim();
  
  try {
    const pending = await prisma.pendingVerification.findUnique({
      where: { email: normalizedEmail }
    });
    
    if (!pending) return null;
    
    // Check expiration
    if (new Date() > pending.expiresAt) {
      await removePendingVerification(normalizedEmail);
      return null;
    }
    
    return {
      email: pending.email,
      name: pending.name,
      passwordHash: pending.passwordHash,
      code: pending.code,
      expiresAt: pending.expiresAt.getTime()
    };
  } catch {
    return null;
  }
}

export async function removePendingVerification(email: string): Promise<void> {
  const normalizedEmail = email.toLowerCase().trim();
  
  try {
    await prisma.pendingVerification.delete({
      where: { email: normalizedEmail }
    });
  } catch (error) {
    // Ignore if not found
  }
}

/**
 * Simulates sending an email verification code.
 * Logs the code clearly in the server console for easy retrieval during testing.
 */
export async function sendVerificationEmail(email: string, code: string): Promise<void> {
  // Always log to console for development visibility
  console.log('\n' + '='.repeat(60));
  console.log(`✉️  [Dev Console] EMAIL VERIFICATION CODE: ${email}`);
  console.log(`🔑 CODE: ${code}`);
  console.log('='.repeat(60) + '\n');

  const smtpUser = process.env.SMTP_EMAIL;
  const smtpPass = process.env.SMTP_PASSWORD;

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      await transporter.sendMail({
        from: `"GetProspectra Support" <${smtpUser}>`,
        to: email,
        subject: `[GetProspectra] Your Email Verification Code`,
        text: `Your email verification code is: ${code}. It expires in 15 minutes.`,
        html: `
          <div style="font-family: sans-serif; padding: 24px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #0f172a; margin-bottom: 16px;">Verify your email</h2>
            <p style="color: #475569; font-size: 14px; line-height: 24px;">Thank you for registering on GetProspectra! Please use the following 6-digit code to complete your registration:</p>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center; margin: 24px 0;">
              <span style="font-family: monospace; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #6366f1;">${code}</span>
            </div>
            <p style="color: #64748b; font-size: 12px; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">If you did not request this code, you can safely ignore this email.</p>
          </div>
        `
      });
      console.log(`✅ Real email successfully sent via SMTP to: ${email}`);
    } catch (smtpError) {
      console.error('❌ Failed to send real SMTP email:', smtpError);
    }
  } else {
    console.log('ℹ️  SMTP_EMAIL / SMTP_PASSWORD not set in .env. Real email delivery skipped (logged above).');
  }
}
