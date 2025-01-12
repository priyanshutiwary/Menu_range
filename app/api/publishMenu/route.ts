import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
// import { db } from '@/backend/db/index';
import { drizzle } from 'drizzle-orm/node-postgres';

import { restaurants } from '@/backend/db/schema';
const db = drizzle(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  try {
    const { userId, isPublic, subdomain, action } = await request.json();

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    if (action === 'toggle') {
      const updatedRestaurant = await db
        .update(restaurants)
        .set({ isPublic })
        .where(eq(restaurants.userId, userId))
        .returning({ id: restaurants.id, name: restaurants.name, isPublic: restaurants.isPublic });

      if (updatedRestaurant.length === 0) {
        return NextResponse.json({ success: false, message: 'Restaurant not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `Menu is now ${isPublic ? 'public' : 'private'}`,
        data: updatedRestaurant[0]
      });
    } else if (action === 'publish') {
      if (!subdomain) {
        return NextResponse.json({ success: false, message: 'Subdomain is required for publishing' }, { status: 400 });
      }

      // Check if the subdomain is already in use
      const existingRestaurant = await db.select().from(restaurants).where(eq(restaurants.subDomain, subdomain)).execute();

      if (existingRestaurant.length > 0) {
        return NextResponse.json({ success: false, message: 'Subdomain is already in use' }, { status: 400 });
      }

      // Update the restaurant record
      const updatedRestaurant = await db
        .update(restaurants)
        .set({ subDomain: subdomain })
        .where(eq(restaurants.userId, userId))
        .returning({ id: restaurants.id, name: restaurants.name, subDomain: restaurants.subDomain });

      if (updatedRestaurant.length === 0) {
        return NextResponse.json({ success: false, message: 'Restaurant not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: 'Menu published successfully',
        data: updatedRestaurant[0]
      });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in publishMenu:', error);
    return NextResponse.json({ success: false, message: 'An error occurred while processing the request' }, { status: 500 });
  }
}

