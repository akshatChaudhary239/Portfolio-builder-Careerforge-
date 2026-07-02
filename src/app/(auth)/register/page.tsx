import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import RegisterForm from './RegisterForm';

export default async function RegisterPage({
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
  return <RegisterForm initialError={error} />;
}
