import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_PHONES = ['602-396-9189', '928-551-1379'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Allow /login and API routes
  if (pathname.startsWith('/login') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get('auth_phone');
  const phone = cookie?.value;

  if (phone && ALLOWED_PHONES.includes(phone)) {
    return NextResponse.next();
  }

  // Not authenticated or not allowed
  const loginUrl = new URL('/login', request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next|public|login|api).*)'],
}; 