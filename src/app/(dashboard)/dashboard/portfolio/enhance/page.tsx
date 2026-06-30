import { redirect } from 'next/navigation';

export default async function EnhancePortfolioPage() {
  redirect('/dashboard/portfolio/editor');
}
