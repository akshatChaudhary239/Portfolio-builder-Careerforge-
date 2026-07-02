'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { registerAction, verifyAndCreateAccountAction, resendVerificationCodeAction, getDevVerificationCodeAction } from '../actions';

interface RegisterFormProps {
  initialError?: string;
}

export default function RegisterForm({ initialError }: RegisterFormProps) {
  const router = useRouter();
  
  // Registration state
  const [error, setError] = useState<string | undefined>(initialError);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Verification state
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [pendingEmail, setPendingEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | undefined>(undefined);
  
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [devCode, setDevCode] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLocalhost(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    }
  }, []);

  async function fetchDevCode(email: string) {
    try {
      const devRes = await getDevVerificationCodeAction(email);
      if (devRes && 'code' in devRes && devRes.code) {
        setDevCode(devRes.code);
      }
    } catch {
      // Ignore
    }
  }

  async function handleRegisterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(undefined);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const emailVal = formData.get('email') as string;

    try {
      const result = await registerAction(formData);
      if (result?.error) {
        setError(result.error);
        setIsSubmitting(false);
      } else if (result?.step === 'verify') {
        setPendingEmail(emailVal);
        setStep('verify');
        setIsSubmitting(false);
        await fetchDevCode(emailVal);
      } else if (result?.success) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  }

  async function handleVerifySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(undefined);
    setResendMessage(undefined);
    setIsSubmitting(true);

    try {
      const result = await verifyAndCreateAccountAction(pendingEmail, verificationCode);
      if (result?.error) {
        setError(result.error);
        setIsSubmitting(false);
      } else if (result?.success) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred during verification.');
      setIsSubmitting(false);
    }
  }

  async function handleResendCode(e: React.MouseEvent) {
    e.preventDefault();
    if (isResending) return;
    
    setError(undefined);
    setResendMessage(undefined);
    setIsResending(true);

    try {
      const result = await resendVerificationCodeAction(pendingEmail);
      if (result?.error) {
        setError(result.error);
      } else {
        setResendMessage('Verification code resent successfully! Check your server console.');
        await fetchDevCode(pendingEmail);
      }
    } catch (err) {
      setError('Failed to resend verification code. Please try again.');
    } finally {
      setIsResending(false);
    }
  }

  const handleSignInClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsRedirecting(true);
    router.push('/login');
  };

  return (
    <main className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-warm-bg">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2 text-primary">
          <div className="w-10 h-10 rounded-xl overflow-hidden relative shadow-sm border border-warm-border">
            <Image src="/images/getprospectra_logo.png" alt="GetProspectra Logo" fill className="object-cover" />
          </div>
          <span className="font-sans font-bold text-xl tracking-tight">GetProspectra</span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-serif font-semibold text-primary">
          {step === 'verify' ? 'Confirm your email' : 'Start your transformation'}
        </h2>
        <p className="mt-2 text-center text-sm text-primary-light">
          {step === 'verify' 
            ? `We've sent a 6-digit verification code to ${pendingEmail}`
            : 'Set up an account to create your professional identity package'
          }
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-warm-surface py-8 px-4 border border-warm-border rounded-2xl shadow-sm sm:px-10">
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {resendMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl font-medium">
              {resendMessage}
            </div>
          )}

          {step === 'register' ? (
            <form key="register-form" onSubmit={handleRegisterSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-primary uppercase tracking-wider">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Alex Mercer"
                    className="w-full px-4 py-3 rounded-xl bg-warm-bg border border-warm-border text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-primary uppercase tracking-wider">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-warm-bg border border-warm-border text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-primary uppercase tracking-wider">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-warm-bg border border-warm-border text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || isRedirecting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-xs text-sm font-semibold text-white bg-primary hover:bg-primary-light focus:outline-none transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending code...' : 'Send Verification Code'}
                </button>
              </div>
            </form>
          ) : (
            <form key="verify-form" onSubmit={handleVerifySubmit} className="space-y-5">
              <div>
                <label htmlFor="code" className="block text-xs font-semibold text-primary uppercase tracking-wider">
                  Verification Code
                </label>
                <div className="mt-1">
                  <input
                    id="code"
                    name="code"
                    type="text"
                    required
                    maxLength={6}
                    pattern="[0-9]*"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-4 py-3 rounded-xl bg-warm-bg border border-warm-border text-center text-lg font-mono tracking-widest text-primary placeholder:text-gray-400 focus:outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || isRedirecting || verificationCode.length < 6}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-xs text-sm font-semibold text-white bg-primary hover:bg-primary-light focus:outline-none transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating your account....' : 'Verify & Create Account'}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="font-semibold text-brand hover:text-brand-hover transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isResending ? 'Resending...' : 'Resend Code'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('register');
                    setError(undefined);
                    setResendMessage(undefined);
                  }}
                  className="text-primary-light hover:text-primary transition-colors cursor-pointer"
                >
                  Change Email
                </button>
              </div>

              {isLocalhost && devCode && (
                <div className="mt-5 p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 space-y-1.5 shadow-sm">
                  <div className="font-bold text-indigo-700 flex items-center gap-1.5">
                    <span>🔧 Local Development Helper</span>
                  </div>
                  <p className="leading-relaxed text-indigo-950/80">
                    Since you are running locally, you can use the verification code below:
                  </p>
                  <div className="font-mono text-center text-sm font-bold tracking-widest text-indigo-700 bg-indigo-100 py-2 rounded-lg select-all border border-indigo-200">
                    {devCode}
                  </div>
                </div>
              )}
            </form>
          )}

          <div className="mt-6 text-center text-xs border-t border-warm-border pt-4">
            <span className="text-primary-light">Already have an account?</span>{' '}
            <a
              href="/login"
              onClick={handleSignInClick}
              className={`font-semibold text-brand hover:text-brand-hover transition-colors ${
                isRedirecting ? 'pointer-events-none opacity-80' : ''
              }`}
            >
              {isRedirecting ? 'Redirecting...' : 'Sign in'}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
