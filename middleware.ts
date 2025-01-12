import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedRoutes = ['/create-menu', '/onboarding'];
const authRoutes = ['/login', '/signup', '/verify', '/'];

interface Business {
  id: string;
  subdomain: string;
}

async function verifyBusiness(subdomain: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/subdomainCheck?subdomain=${subdomain}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      console.error('API response not ok:', response.status);
      return null;
    }
    
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Error verifying business:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  const pathname = url.pathname;

  // Determine the main domain and protocol
  const currentEnv = process.env.NODE_ENV;
  const mainDomain = currentEnv === 'development' ? 'localhost:3000' : 'Qr_menu.com';
  const protocol = currentEnv === 'development' ? 'http' : 'https';
  const mainDomainUrl = `${protocol}://${mainDomain}`;

  // Check if it's a subdomain request
  const isSubdomain = hostname.includes(`.${mainDomain}`);
  
  // Handle authentication logic first
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', mainDomainUrl), { status: 301 });
    }
  }

  if (token && authRoutes.some(route => 
    route === '/' ? pathname === '/' : pathname.startsWith(route)
  )) {
    return NextResponse.redirect(new URL('/create-menu', mainDomainUrl), { status: 301 });
  }

  // Handle subdomain logic
  if (isSubdomain) {
    const subdomain = hostname.replace(`.${mainDomain}`, '');
    console.log("Checking subdomain:", subdomain);
    
    try {
      const business = await verifyBusiness(subdomain);
      console.log("Business data:", business);
      
      if (!business || business.length === 0) {
        console.log("Redirecting to main domain:", mainDomainUrl);
        // Use 308 for permanent redirect with preserved method
        return NextResponse.next();
      }

      const tenant = business[0];
      
      // Set headers before rewrite
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-business-id', tenant.id);
      requestHeaders.set('x-business-subdomain', tenant.subDomain || tenant.subdomain);

      // Create absolute URL for rewrite
      const rewritePath = `/domain/${tenant.id}${pathname}${url.hash}`;
      const rewriteUrl = new URL(rewritePath, mainDomainUrl);

      return NextResponse.rewrite(rewriteUrl, {
        headers: requestHeaders,
      });
    } catch (error) {
      console.error('Subdomain verification error:', error);
      return NextResponse.redirect(mainDomainUrl, { status: 308 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/create-menu',
    '/onboarding',
    '/login',
    '/signup',
    '/',
    '/verify/:path*'
  ]
};