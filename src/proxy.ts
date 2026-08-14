import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const hasAuthCookie = request.cookies.has('c_delivery_auth');
  const isLoginPage = request.nextUrl.pathname === '/login';

  // If the user is unauthenticated and tries to access a protected route
  // Note: We consider everything except /login to be protected in this phase.
  if (!hasAuthCookie && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If the user is authenticated and tries to access the login page
  if (hasAuthCookie && isLoginPage) {
    return NextResponse.redirect(new URL('/delivery', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
