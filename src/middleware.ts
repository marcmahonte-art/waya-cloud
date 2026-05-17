import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Guard the dashboard path
  if (path.startsWith('/dashboard')) {
    // Look for our waya_session cookie or standard Supabase tokens
    const hasSessionCookie = request.cookies.has('waya_session');
    const hasSupabaseCookie = request.cookies.getAll().some(c => c.name.startsWith('sb-'));

    if (!hasSessionCookie && !hasSupabaseCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Target matcher config
export const config = {
  matcher: ['/dashboard/:path*'],
};
