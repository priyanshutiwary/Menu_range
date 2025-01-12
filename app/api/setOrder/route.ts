import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/node-postgres';
import { orders, orderItems } from '@/backend/db/schema';
import { sql, eq } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL!);

// POST route handler for creating a new order
export async function POST(request: NextRequest) {
  try {
    const { restaurantId, tableId, orderItems: items } = await request.json();
    // Validate required fields
    if (!restaurantId || !tableId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Restaurant ID, table ID, and order items are required',
        },
        { status: 400 }
      );
    }

    // Calculate total amount from order items
    const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

    // Create new order
    const [newOrder] = await db
      .insert(orders)
      .values({
        restaurantId,
        tableId,
        status: 'pending',
        totalAmount,
        createdAt: sql`CURRENT_TIMESTAMP`,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      })
      .returning();

    // Create order items
    const orderItemsToInsert = items.map(item => ({
      orderId: newOrder.id,
      menuItemId: item.menuItemId,
      itemName:item.itemName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.quantity * item.unitPrice,
      specialInstructions: item.specialInstructions,
      createdAt: sql`CURRENT_TIMESTAMP`,
    }));
    console.log(orderItemsToInsert);
    

    await db
      .insert(orderItems)
      .values(orderItemsToInsert);

    return NextResponse.json(
      {
        success: true,
        message: 'Order created successfully',
        data: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error creating order',
      },
      { status: 500 }
    );
  }
}

// PUT route handler for updating an existing order
export async function PUT(request: NextRequest) {
  try {
    const { id, status, orderItems: items } = await request.json();

    // Validate required fields
    if (!id || !status) {
      return NextResponse.json(
        {
          success: false,
          message: 'Order ID and status are required',
        },
        { status: 400 }
      );
    }

    // Update order status
    const [updatedOrder] = await db
      .update(orders)
      .set({
        status,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      })
      .where(eq(orders.id, id))
      .returning();

    // If new items are provided, update order items
    if (items && Array.isArray(items) && items.length > 0) {
      // Delete existing order items
      await db
        .delete(orderItems)
        .where(eq(orderItems.orderId, id));

      // Calculate new total amount
      const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

      // Create new order items
      const orderItemsToInsert = items.map(item => ({
        orderId: id,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.quantity * item.unitPrice,
        specialInstructions: item.specialInstructions,
        createdAt: sql`CURRENT_TIMESTAMP`,
      }));

      await db
        .insert(orderItems)
        .values(orderItemsToInsert);

      // Update order total
      await db
        .update(orders)
        .set({ totalAmount })
        .where(eq(orders.id, id));
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Order updated successfully',
        data: updatedOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error updating order',
      },
      { status: 500 }
    );
  }
}

// GET route handler for retrieving orders
export async function GET(request: NextRequest) {
  try {
    const restaurantId = request.nextUrl.searchParams.get('restaurantId');
    const tableId = request.nextUrl.searchParams.get('tableId');
    
    if (!restaurantId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Restaurant ID is required',
        },
        { status: 400 }
      );
    }

    let query = db
      .select()
      .from(orders)
      .where(eq(orders.restaurantId, Number(restaurantId)));

    if (tableId) {
      query = query.where(eq(orders.tableId, Number(tableId)));
    }

    const allOrders = await query.execute();

    // For each order, get its items
    const ordersWithItems = await Promise.all(
      allOrders.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id))
          .execute();

        return {
          ...order,
          items,
          totalAmount: Number(order.totalAmount), // Ensure totalAmount is a number
        };
      })
    );

    return NextResponse.json(
      {
        success: true,
        data: ordersWithItems,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving orders:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error retrieving orders',
      },
      { status: 500 }
    );
  }
}

// DELETE route handler for canceling/deleting an order
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Order ID is required',
        },
        { status: 400 }
      );
    }

    // Delete order items first (cascade will handle this, but being explicit)
    await db
      .delete(orderItems)
      .where(eq(orderItems.orderId, id));

    // Delete the order
    const deletedOrder = await db
      .delete(orders)
      .where(eq(orders.id, id))
      .returning();

    if (deletedOrder.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Order not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Order deleted successfully',
        data: deletedOrder[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error deleting order',
      },
      { status: 500 }
    );
  }
}