import { NextRequest, NextResponse } from 'next/server';
import db  from '@/backend/db';
import { restaurants } from '@/backend/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const subdomain = url.searchParams.get('subdomain');
  let encodedSubdomain = null;
  console.log('Received subdomain:', subdomain);
  
  if (subdomain) {
    encodedSubdomain = encodeURIComponent(subdomain);
  }
  console.log('Encoded subdomain:', encodedSubdomain);
  
  if (!encodedSubdomain) {
    return NextResponse.json({ 
      success: false, 
      message: 'Subdomain is required' 
    }, { status: 400 });
  }

  try {
    const restaurant = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.subDomain, encodedSubdomain))
      .limit(1);

    // Check if the array is empty
    if (restaurant && restaurant.length > 0) {
      return NextResponse.json({ 
        success: true, 
        data: restaurant 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Subdomain not found' 
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Error checking subdomain:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}