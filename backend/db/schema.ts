import { pgTable, serial, varchar, integer, text, timestamp, decimal, boolean, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
    isVerified: boolean('is_verified').default(false),
    verifyCode: varchar('verify_code', { length: 255 }).notNull(),
    verifyCodeExpiry: timestamp('verify_code_expiry', { withTimezone: true }).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
});

export const restaurants = pgTable('restaurants', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 200 }).notNull(),
    ownerName: varchar('owner_name', { length: 100 }).notNull(),
    location: text('location').notNull(),
    phoneNumber: varchar('phone_number', { length: 20 }).notNull(),
    cuisineType: varchar('cuisine_type', { length: 50 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
});

export const menuSections = pgTable('menu_sections', {
    id: serial('id').primaryKey(),
    restaurantId: integer('restaurant_id').references(() => restaurants.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    displayOrder: integer('display_order').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
});

export const menuItems = pgTable('menu_items', {
    id: serial('id').primaryKey(),
    sectionId: integer('section_id').references(() => menuSections.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 200 }).notNull(),
    description: text('description'),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    imageUrl: varchar('image_url', { length: 255 }),
    isAvailable: boolean('is_available').default(true),
    displayOrder: integer('display_order').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
});

export const restaurantTables = pgTable('restaurant_tables', {
    id: serial('id').primaryKey(),
    restaurantId: integer('restaurant_id').references(() => restaurants.id, { onDelete: 'cascade' }),
    tableNumber: varchar('table_number', { length: 20 }).notNull(),
    seatingCapacity: integer('seating_capacity').notNull(),
    isAvailable: boolean('is_available').default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
    uniqueConstraint: uniqueIndex('unique_table_per_restaurant').on(table.restaurantId, table.tableNumber),
}));

export const orders = pgTable('orders', {
    id: serial('id').primaryKey(),
    restaurantId: integer('restaurant_id').references(() => restaurants.id, { onDelete: 'cascade' }),
    tableId: integer('table_id').references(() => restaurantTables.id),
    status: varchar('status', { length: 50 }).default('pending').notNull(),
    totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
});

export const orderItems = pgTable('order_items', {
    id: serial('id').primaryKey(),
    orderId: integer('order_id').references(() => orders.id, { onDelete: 'cascade' }),
    menuItemId: integer('menu_item_id').references(() => menuItems.id),
    quantity: integer('quantity').notNull(),
    unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
    subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
    specialInstructions: text('special_instructions'),
    createdAt: timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
});
