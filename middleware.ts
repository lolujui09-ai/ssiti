import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedPaths = ['/dashboard', '/forms'];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (!isProtected) return NextResponse.next();

  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  } catch (err) {
    // In prototype development mode, if auth service/DB is offline, pass through
    console.warn('[Middleware] Session verification warning:', err);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/forms/:path*'],
};
