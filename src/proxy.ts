import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export function proxy(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname (e.g., 'akku.careerforge.com', 'localhost:3000')
  const hostname = req.headers.get('host') || '';

  // Get the root domain from environment variables or default to localhost:3000
  // Note: For local testing, you might need to use something like `akku.localhost:3000`
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';
  
  // Extract subdomain
  let subdomain: string | null = null;
  
  if (
    hostname !== rootDomain && 
    hostname !== `www.${rootDomain}` && 
    hostname.endsWith(`.${rootDomain}`)
  ) {
    subdomain = hostname.replace(`.${rootDomain}`, '');
  }

  // If we found a subdomain, rewrite the request to the dynamic route
  if (subdomain) {
    // Prevent access to internal dashboard routes via a portfolio subdomain
    if (url.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/dashboard', `http://${rootDomain}`));
    }
    
    // We rewrite the URL to /u/[subdomain]/[...path]
    // If the path is just '/', it becomes '/u/[subdomain]'
    const path = url.pathname === '/' ? '' : url.pathname;
    return NextResponse.rewrite(new URL(`/u/${subdomain}${path}`, req.url));
  }

  return NextResponse.next();
}
