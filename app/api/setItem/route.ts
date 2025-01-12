import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/node-postgres';
import { menuItems } from '@/backend/db/schema';
import { sql, eq } from 'drizzle-orm';

// Initialize database connection
const db = drizzle(process.env.DATABASE_URL!);

// POST route handler for creating a new menu item
export async function POST(request: NextRequest) {
  try {
    const { sectionId, name, description, price, photoUrl, displayOrder } = await request.json();
    
    
    
    
    
    // Validate that required fields are provided
    if (!sectionId || !name || price === undefined || displayOrder === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: 'Section ID, name, price, and display order are required',
        },
        { status: 400 }
      );
    }

    // Create new menu item
    const newItem = await db
      .insert(menuItems)
      .values({
        sectionId,
        name,
        description,
        price,
        photoUrl,
        displayOrder,
        createdAt: sql`CURRENT_TIMESTAMP`,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: 'Menu item created successfully',
        data: newItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error creating menu item',
      },
      { status: 500 }
    );
  }
}

// PUT route handler for updating an existing menu item
export async function PUT(request: NextRequest) {
  try {

    const { id, sectionId, name, description, price, photoUrl, displayOrder } = await request.json();
    
    
    
    
    
    
    
    
    // Validate that required fields are provided
    if (!id || !sectionId || !name || price === undefined || displayOrder === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: 'ID, Section ID, name, price, and display order are required',
        },
        { status: 400 }
      );
    }

    // Update existing menu item
    const updatedItem = await db
      .update(menuItems)
      .set({
        sectionId,
        name,
        description,
        price,
        photoUrl,
        displayOrder,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      })
      .where(eq(menuItems.id, id))
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: 'Menu item updated successfully',
        data: updatedItem,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error updating menu item',
      },
      { status: 500 }
    );
  }
}

// GET route handler for retrieving a menu item
export async function GET(request: NextRequest) {
  try {
    
    
    const id = request.nextUrl.searchParams.get('id');
    
    
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

    // Retrieve menu item by ID
    const item = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.sectionId, Number(id)))
      .execute();

    if (item.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Menu item not found',
        },
        { status: 404 }
      );
    }
    const formattedItem = item.map(i => ({
        ...i,
        price: Number(i.price), // Ensure price is a number
      }));

    return NextResponse.json(
      {
        success: true,
        data: formattedItem,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving menu item:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error retrieving menu item',
      },
      { status: 500 }
    );
  }
}

// DELETE route handler for deleting a menu item
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    console.log(id);
    
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

    // Delete menu item by ID
    const deletedItem = await db
      .delete(menuItems)
      .where(eq(menuItems.id, id))
      .returning();

    if (deletedItem.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Menu item not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Menu item deleted successfully',
        data: deletedItem,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error deleting menu item',
      },
      { status: 500 }
    );
  }
}
