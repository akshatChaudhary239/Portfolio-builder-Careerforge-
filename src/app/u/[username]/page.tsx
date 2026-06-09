import { notFound } from 'next/navigation';
import { LocalDB } from '@/db/local-db';
import DynamicPortfolioClient from './DynamicPortfolioClient';

export const revalidate = 0; // Dynamic server page

export default async function PublicPortfolioPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ theme?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const username = resolvedParams.username;
  const theme = resolvedSearchParams.theme;
  
  const record = LocalDB.getPortfolioBySubdomain(username);
  if (!record || record.portfolio.visibility === 'private') {
    notFound();
  }

  return (
    <div className="min-h-screen bg-warm-bg">
      <DynamicPortfolioClient
        portfolio={record.portfolio}
        user={record.user}
        careerProfile={record.careerProfile!}
        overrideTheme={theme}
      />
    </div>
  );
}
