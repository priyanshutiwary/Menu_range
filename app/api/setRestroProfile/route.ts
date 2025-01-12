import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/node-postgres';
import { restaurants } from '@/backend/db/schema';
import { sql, eq } from 'drizzle-orm';

// Initialize database connection
const db = drizzle(process.env.DATABASE_URL!);

// POST route handler for creating or updating a restaurant profile
export async function POST(request: NextRequest) {
  try {
    const { id, userId, name, ownerName, location, phoneNumber, cuisineType } = await request.json();
    
    // Validate that required fields are provided
    if (!userId || !name || !ownerName || !location || !phoneNumber || !cuisineType) {
      return NextResponse.json(
        {
          success: false,
          message: 'All fields are required',
        },
        { status: 400 }
      );
    }

    // Check if the restaurant already exists
    let existingRestaurant;
    if (userId) {
      existingRestaurant = await db
        .select()
        .from(restaurants)
        .where(eq(restaurants.userId, userId))
        .execute()
        .then((result) => result[0]);
    }
    console.log(existingRestaurant);
    

    if (existingRestaurant) {
      // Update existing restaurant profile
      const updatedRestaurant = await db
        .update(restaurants)
        .set({
          name,
          ownerName,
          location,
          phoneNumber,
          cuisineType,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(restaurants.userId, userId))
        .returning();

      return NextResponse.json(
        {
          success: true,
          message: 'Restaurant profile updated successfully',
          data: updatedRestaurant,
        },
        { status: 200 }
      );
    } else {
      // Create new restaurant profile
      const newRestaurant = await db
        .insert(restaurants)
        .values({
          userId,
          name,
          ownerName,
          location,
          phoneNumber,
          cuisineType,
          createdAt: sql`CURRENT_TIMESTAMP`,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .returning();

      return NextResponse.json(
        {
          success: true,
          message: 'Restaurant profile created successfully',
          data: newRestaurant,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Error setting restaurant profile:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error setting restaurant profile',
      },
      { status: 500 }
    );
  }
}

// GET route handler for fetching a restaurant profile
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId'); 
  
  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        message: 'User ID is required',
      },
      { status: 400 }
    );
  }

  try {
    const userIdNumber = Number(userId); // Convert userId to a number
    console.log(userIdNumber);
    
    if (isNaN(userIdNumber)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid User ID',
        },
        { status: 400 }
      );
    }
    
    const restaurant = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.userId, userId)) // Use the converted userId
      .execute()
      .then((result) => result[0]);
    
    if (!restaurant) {
        
      return NextResponse.json(
        {
          success: false,
          message: 'Restaurant not found for this user',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: restaurant,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching restaurant profile:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching restaurant profile',
      },
      { status: 500 }
    );
  }
}
