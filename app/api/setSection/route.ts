import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/node-postgres';
import { menuSections,restaurants } from '@/backend/db/schema';
import { sql,eq } from 'drizzle-orm';

// Initialize database connection
const db = drizzle(process.env.DATABASE_URL!);

// POST route handler for creating a new menu section
export async function POST(request: NextRequest) {
  try {
    const { restaurantId, name, description, displayOrder } = await request.json();

    // Validate that required fields are provided
    if (!restaurantId || !name || displayOrder === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: 'Restaurant ID, name, and display order are required',
        },
        { status: 400 }
      );
    }

    // Create new menu section
    const newSection = await db
      .insert(menuSections)
      .values({
        restaurantId,
        name,
        description,
        displayOrder,
        createdAt: sql`CURRENT_TIMESTAMP`,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: 'Menu section created successfully',
        data: newSection,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating menu section:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error creating menu section',
      },
      { status: 500 }
    );
  }
}

// PUT route handler for updating an existing menu section
export async function PUT(request: NextRequest) {
  try {
    const { id, restaurantId, name, description, displayOrder } = await request.json();

    // Validate that required fields are provided
    if (!id || !restaurantId || !name || displayOrder === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: 'ID, Restaurant ID, name, and display order are required',
        },
        { status: 400 }
      );
    }

    // Update existing menu section
    const updatedSection = await db
      .update(menuSections)
      .set({
        restaurantId,
        name,
        description,
        displayOrder,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      })
      .where(sql`id = ${id}`)
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: 'Menu section updated successfully',
        data: updatedSection,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating menu section:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error updating menu section',
      },
      { status: 500 }
    );
  }
}

// GET route handler for retrieving a menu section
export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    console.log('Received ID:', id);

    // Validate that ID is provided and is a valid number
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        {
          success: false,
          message: 'A valid ID is required',
        },
        { status: 400 }
      );
    }

    // Retrieve menu section by ID
    const section = await db
      .select()
      .from(menuSections)
      .where(eq(menuSections.restaurantId, Number(id)))
      .execute();
      
      

    if (section.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Menu section not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: section,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving menu section:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error retrieving menu section',
      },
      { status: 500 }
    );
  }
}


// DELETE route handler for deleting a menu section
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    // Validate that ID is provided
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'ID is required',
        },
        { status: 400 }
      );
    }

    // Delete menu section by ID
    const deletedSection = await db
      .delete(menuSections)
      .where(eq(menuSections.id, id))
      .returning();

    if (deletedSection.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Menu section not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Menu section deleted successfully',
        data: deletedSection,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting menu section:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error deleting menu section',
      },
      { status: 500 }
    );
  }
}



