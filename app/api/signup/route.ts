import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { drizzle } from 'drizzle-orm/node-postgres';
import { users } from '@/backend/db/schema';
import { sql, eq, and } from 'drizzle-orm';
// import { sendVerificationEmail } from '@/backend/helpers/sendVerificationEmail';

// Initialize database connection
const db = drizzle(process.env.DATABASE_URL!);

// POST route handler for user registration
export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();
    console.log(password);
    
    // Validate that password is provided
    if (!password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Password is required',
        },
        { status: 400 }
      );
    }

    // Check if a verified user exists with the same email
    const existingVerifiedUser = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.email, email),
          eq(users.isVerified, true)
        )
      )
      .execute()
      .then((result) => result[0]);

    if (existingVerifiedUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email is already registered and verified',
        },
        { status: 400 }
      );
    }

    // Check for existing unverified user
    const existingUnverifiedUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute()
      .then((result) => result[0]);

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    if (existingUnverifiedUser) {
      // Update existing unverified user
      const updatedUser = await db
        .update(users)
        .set({
          name:name,
          passwordHash: await bcrypt.hash(password, 10),
          verifyCode:verificationCode,
          verifyCodeExpiry:verifyCodeExpiry,
          updatedAt: sql`CURRENT_TIMESTAMP`
        })
        .where(eq(users.email, email))
        .returning();

      // Send verification email
      // const emailResponse = await sendVerificationEmail(name, email, verificationCode);
      
      return NextResponse.json(
        {
          success: true,
          message: 'User updated successfully. Please verify your account.',
          data: updatedUser,
        },
        { status: 200 }
      );
    }

    // Create new user if no existing user found
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await db
      .insert(users)
      .values({
        name,
        email,
        passwordHash,
        verifyCode:verificationCode,
        verifyCodeExpiry:verifyCodeExpiry,
        isVerified: false,
        createdAt: sql`CURRENT_TIMESTAMP`,
      })
      .returning();

    // Send verification email
    // const emailResponse = await sendVerificationEmail(name, email, verificationCode);

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully. Please verify your account.',
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error registering user',
      },
      { status: 500 }
    );
  }
}