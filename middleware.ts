import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/create-menu', '/onboarding', '/login', '/signup', '/', '/verify/:path*'],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  console.log(token);
  
  const url = request.nextUrl;

  // Redirect to dashboard if the user is already authenticated
  // and trying to access sign-in, sign-up, or home page
  if (
    token &&
    (url.pathname.startsWith('/login') ||
    url.pathname.startsWith('/signup') ||
    url.pathname.startsWith('/verify') ||
    url.pathname === '/')
  ) {
    return NextResponse.redirect(new URL('/create-menu', request.url));
  }

  // Check if the user is trying to access the /pendingPayments or /dashboard route
  if (
    url.pathname.startsWith('/create-menu') ||
    url.pathname.startsWith('/onboarding')
  ) {
    // If the user is not authenticated, redirect them to the sign-in page
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}