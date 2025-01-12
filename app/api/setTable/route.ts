import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/node-postgres';
import { restaurantTables } from '@/backend/db/schema';
import { sql, eq } from 'drizzle-orm';

// Initialize database connection
const db = drizzle(process.env.DATABASE_URL!);

// POST route handler for creating a new restaurant table
export async function POST(request: NextRequest) {
  try {
    const { restaurantId, tableNumber, seatingCapacity, isAvailable } = await request.json();

    
    
    
    
    // Validate that required fields are provided
    if (!restaurantId || !tableNumber || seatingCapacity === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: 'Restaurant ID, table number, and seating capacity are required',
        },
        { status: 400 }
      );
    }

    // Create new restaurant table
    const newTable = await db
      .insert(restaurantTables)
      .values({
        restaurantId,
        tableNumber,
        seatingCapacity,
        isAvailable,
        createdAt: sql`CURRENT_TIMESTAMP`,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: 'Restaurant table created successfully',
        data: newTable,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating restaurant table:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error creating restaurant table',
      },
      { status: 500 }
    );
  }
}

// PUT route handler for updating an existing restaurant table
export async function PUT(request: NextRequest) {
  try {
    const { id, restaurantId, tableNumber, seatingCapacity, isAvailable } = await request.json();

    // Validate that required fields are provided
    if (!id || !restaurantId || !tableNumber || seatingCapacity === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: 'ID, Restaurant ID, table number, and seating capacity are required',
        },
        { status: 400 }
      );
    }

    // Update existing restaurant table
    const updatedTable = await db
      .update(restaurantTables)
      .set({
        restaurantId,
        tableNumber,
        seatingCapacity,
        isAvailable,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      })
      .where(eq(restaurantTables.id, id))
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: 'Restaurant table updated successfully',
        data: updatedTable,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating restaurant table:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error updating restaurant table',
      },
      { status: 500 }
    );
  }
}

// GET route handler for retrieving a restaurant table
export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('restaurantId');
    console.log(id);
    
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

    // Retrieve restaurant table by ID
    const table = await db
      .select()
      .from(restaurantTables)
      .where(eq(restaurantTables.restaurantId, Number(id)))
      .execute();

    if (table.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Restaurant table not found',
        },
        { status: 404 }
      );
    }
    console.log(table);
    

    return NextResponse.json(
      {
        success: true,
        data: table,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving restaurant table:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error retrieving restaurant table',
      },
      { status: 500 }
    );
  }
}

// DELETE route handler for deleting a restaurant table
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

    // Delete restaurant table by ID
    const deletedTable = await db
      .delete(restaurantTables)
      .where(eq(restaurantTables.id, id))
      .returning();

    if (deletedTable.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Restaurant table not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Restaurant table deleted successfully',
        data: deletedTable,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting restaurant table:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error deleting restaurant table',
      },
      { status: 500 }
    );
  }
}