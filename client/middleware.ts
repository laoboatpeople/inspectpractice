import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // English-only site: redirect any /fr/* URL to its EN equivalent
  if (pathname.startsWith('/fr')) {
    const enPath = pathname.replace(/^\/fr/, '') || '/';
    return NextResponse.redirect(new URL(enPath, request.url));
  }

  // Set locale on the request so RootLayout can read it via headers()
  // and set <html lang="en"> server-side
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', 'en');

  // Only intercept /admin/* routes for auth check
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // Allow static files under admin/public patterns
  if (pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|woff2?)$/)) {
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  const authRole = request.cookies.get('auth_role')?.value;

  if (!authRole) {
    const loginUrl = new URL('/auth/admin-login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (authRole !== 'ADMIN' && authRole !== 'INSTRUCTOR') {
    const appUrl = new URL('/app', request.url);
    return NextResponse.redirect(appUrl);
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ['/admin/:path*', '/fr/:path*'],
};
