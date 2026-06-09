'use server';

import { getSessionUser } from '@/lib/auth';
import { LocalDB, PortfolioEnhancements } from '@/db/local-db';

export async function updatePortfolioEnhancementsAction(enhancements: PortfolioEnhancements) {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthorized");

  const portfolio = LocalDB.getPortfolioByUserId(user.id);
  if (!portfolio) throw new Error("Portfolio not found");

  portfolio.enhancements = enhancements;
  portfolio.updatedAt = new Date().toISOString();

  LocalDB.updatePortfolio(user.id, portfolio);
  
  return { success: true };
}
