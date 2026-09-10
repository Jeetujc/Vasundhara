import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATH_PREFIXES = [
  '/',
  '/login',
  '/unauthorized',
  '/forgot-password',
  '/_next',
  '/favicon.ico',
];

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/projects',
  '/parcels',
  '/workflow',
  '/compensation',
  '/possession',
  '/r-and-r',
  '/documents',
  '/audit',
  '/notifications',
  '/reports',
  '/admin',
  '/gis',
];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('vasundhara_access_token')?.value;

  if (!accessToken) {
    const loginUrl = new URL('/login/mainlogin', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};