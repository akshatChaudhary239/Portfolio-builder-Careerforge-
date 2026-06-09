import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { LocalDB } from '@/db/local-db';
import { hashPassword, setSessionCookie, getSessionUser } from '@/lib/auth';
import { Sparkles, ArrowRight } from 'lucide-react';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // If already logged in, redirect to dashboard
  const user = await getSessionUser();
  if (user) {
    redirect('/dashboard');
  }

  const resolvedParams = await searchParams;
  const error = typeof resolvedParams.error === 'string' ? resolvedParams.error : undefined;

  async function loginAction(formData: FormData) {
    'use server';

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      redirect('/login?error=Missing credentials');
    }

    const existingUser = await LocalDB.getUserByEmail(email);
    if (!existingUser) {
      redirect('/login?error=Invalid email or password');
    }

    const hashed = hashPassword(password);
    if (existingUser.passwordHash !== hashed) {
      redirect('/login?error=Invalid email or password');
    }

    await setSessionCookie(existingUser.id);
    redirect('/dashboard');
  }

  async function demoLoginAction() {
    'use server';

    // Find or create demo user
    let demoUser = await LocalDB.getUserByEmail('demo.user@careerforge.com');
    if (!demoUser) {
      demoUser = await LocalDB.createUser({
        email: 'demo.user@careerforge.com',
        name: 'Alex Mercer',
        passwordHash: hashPassword('password123'),
      });
    }

    await setSessionCookie(demoUser.id);
    redirect('/dashboard');
  }

  return (
    <main className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-warm-bg">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2 text-primary">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
            <Sparkles size={20} className="text-amber-500" />
          </div>
          <span className="font-sans font-bold text-xl tracking-tight">CareerForge</span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-serif font-semibold text-primary">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-primary-light">
          Sign in to manage your professional identity package
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-warm-surface py-8 px-4 border border-warm-border rounded-2xl shadow-sm sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <form action={loginAction} className="space-y-5">
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
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-warm-bg border border-warm-border text-sm text-primary placeholder:text-gray-400 focus:outline-none focus:border-brand transition-colors"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-xs text-sm font-semibold text-white bg-primary hover:bg-primary-light focus:outline-none transition-colors cursor-pointer"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-warm-border"></div>
              </div>
              <span className="relative px-3 bg-warm-surface text-xs font-semibold text-primary-light uppercase tracking-widest">
                Or try it instantly
              </span>
            </div>

            <div className="mt-5">
              <form action={demoLoginAction}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-warm-border rounded-xl text-sm font-semibold text-primary bg-warm-bg hover:bg-warm-border-hover transition-colors cursor-pointer"
                >
                  Sign In with Demo Account
                  <ArrowRight size={16} className="text-primary-light" />
                </button>
              </form>
            </div>
          </div>

          <div className="mt-6 text-center text-xs">
            <span className="text-primary-light">New to CareerForge?</span>{' '}
            <Link href="/register" className="font-semibold text-brand hover:text-brand-hover transition-colors">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
