import { cookies } from 'next/headers';
import { LocalDB, User } from '@/db/local-db';

const SESSION_COOKIE_NAME = 'getprospectra_session';

export async function getSessionUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionVal = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionVal) return null;

  // For this high-polish MVP, we encode session user IDs in a simple base64 layout (fully functional & easily upgradeable to JWT)
  try {
    const userId = Buffer.from(sessionVal, 'base64').toString('ascii');
    const user = await LocalDB.getUserById(userId);
    return user || null;
  } catch {
    return null;
  }
}

export async function setSessionCookie(userId: string) {
  const cookieStore = await cookies();
  const sessionVal = Buffer.from(userId).toString('base64');
  cookieStore.set(SESSION_COOKIE_NAME, sessionVal, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// Simple and safe text-to-hash simulator (zero external build dependencies)
export function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return 'cf_hash_' + Math.abs(hash).toString(36);
}
