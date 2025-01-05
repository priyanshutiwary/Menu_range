// import db from '@/backend/db';
import {users} from '@/backend/db/schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql, eq, and } from 'drizzle-orm';

export async function POST(request: Request) {
  // Connect to the database
  const db = drizzle(process.env.DATABASE_URL!);

  try {
    const { contact, code } = await request.json();
    // const decodedUsername = decodeURIComponent(username);
    const decodedContact = decodeURIComponent(contact)
    
    // console.log(decodedUsername);
    
    
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email,decodedContact))
      .execute();

    if (!user.length) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    

    // Check if the code is correct and not expired
    const isCodeValid = user[0].verifyCode === code;
    const isCodeNotExpired = new Date(user[0].verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      // Update the user's verification status
      await db
        .update(users)
        .set({ isVerified: true })
        .where(eq(users.id,user[0].id))
        .execute();

      return Response.json(
        { success: true, message: 'Account verified successfully' },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      // Code has expired
      return Response.json(
        {
          success: false,
          message:
            'Verification code has expired. Please sign up again to get a new code.',
        },
        { status: 400 }
      );
    } else {
      // Code is incorrect
      
      return Response.json(
        { success: false, message: 'Incorrect verification code' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying user:', error);
    return Response.json(
      { success: false, message: 'Error verifying user' },
      { status: 500 }
    );
  }
}