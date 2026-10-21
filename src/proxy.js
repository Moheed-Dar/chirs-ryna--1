// src/proxy.js

import { NextResponse } from 'next/server';

const protectedRoutes = ['/admin/dashboard'];
const authRoutes = ['/admin/login'];

export function proxy(request) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));
  const isAuth = authRoutes.some((r) => pathname.startsWith(r));

  // ⬇️ YE NAAM APNE BACKEND KA COOKIE NAME SE MATCH KARO
  const token = request.cookies.get('admin_token')?.value;

  if (isProtected && !token) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuth && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*', '/admin/login/:path*'],
};