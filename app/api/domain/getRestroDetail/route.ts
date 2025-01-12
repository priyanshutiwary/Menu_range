import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/node-postgres';
import { restaurants } from '@/backend/db/schema';
import { sql, eq } from 'drizzle-orm';
import db from '@/backend/db';
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id'); 
    console.log("rece",userId);
    
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
        .where(eq(restaurants.id, userIdNumber)) // Use the converted userId
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
      console.log(restaurant);
      
  
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