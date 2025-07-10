import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_PHONES = ['6023969189', '9285511379'];

function normalizePhone(phone: string | undefined) {
  if (!phone) return '';
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  // If 11 digits and starts with 1, remove the leading 1
  if (digits.length === 11 && digits.startsWith('1')) return digits.slice(1);
  // If 10 digits, return as is
  if (digits.length === 10) return digits;
  return '';
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Allow /login, API routes, and peptide product pages
  if (pathname.startsWith('/login') || 
      pathname.startsWith('/api') || 
      pathname.startsWith('/aod-9604') ||
      pathname.startsWith('/bpc-157') ||
      pathname.startsWith('/cagrilintide') ||
      pathname.startsWith('/cjc-1295') ||
      pathname.startsWith('/epithalon') ||
      pathname.startsWith('/ghk-cu') ||
      pathname.startsWith('/ghrp-2') ||
      pathname.startsWith('/hcg') ||
      pathname.startsWith('/hexarelin') ||
      pathname.startsWith('/hgh') ||
      pathname.startsWith('/igf-1-lr3') ||
      pathname.startsWith('/kisspeptin') ||
      pathname.startsWith('/melanotan-2') ||
      pathname.startsWith('/mots-c') ||
      pathname.startsWith('/nad') ||
      pathname.startsWith('/peg-mgf')) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get('auth_phone');
  const normalized = normalizePhone(cookie?.value);

  if (normalized && ALLOWED_PHONES.includes(normalized)) {
    return NextResponse.next();
  }

  // Not authenticated or not allowed
  const loginUrl = new URL('/login', request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next|public|login|api|aod-9604|bpc-157|cagrilintide|cjc-1295|epithalon|ghk-cu|ghrp-2|hcg|hexarelin|hgh|igf-1-lr3|kisspeptin|melanotan-2|mots-c|nad|peg-mgf).*)'],
}; 