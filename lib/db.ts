import db from '@/backend/db'; 
import { eq, inArray } from 'drizzle-orm';
import { restaurants, menuSections, menuItems, restaurantTables } from '@/backend/db/schema';
import type { Restaurant, MenuSection, MenuItem, Table } from '@/types/MenuTypes';

export async function getRestaurantBySubdomain(subdomain: string): Promise<Restaurant | null> {
  if (!subdomain) throw new Error("Subdomain cannot be empty");
  const result = await db.select().from(restaurants).where(eq(restaurants.id, subdomain)).limit(1);
  return result[0] || null;
}

export async function getMenuSections(restaurantId: number): Promise<MenuSection[]> {
  return db.select().from(menuSections).where(eq(menuSections.restaurantId, restaurantId)).orderBy(menuSections.displayOrder);
}

export async function getMenuItems(sectionId: number): Promise<MenuItem[]> {
  return db.select().from(menuItems).where(eq(menuItems.sectionId, sectionId)).orderBy(menuItems.displayOrder);
}

export async function getRestaurantTables(restaurantId: number): Promise<Table[]> {
  return db.select().from(restaurantTables).where(eq(restaurantTables.restaurantId, restaurantId));
}

export async function getFullRestaurantData(subdomain: string): Promise<{
  restaurant: Restaurant;
  menuSections: (MenuSection & { items: MenuItem[] })[];
  tables: Table[];
} | null> {
  const restaurant = await getRestaurantBySubdomain(subdomain);
  if (!restaurant) return null;

  const sections = await getMenuSections(restaurant.id);
  const sectionIds = sections.map(section => section.id);
  const items = await db.select().from(menuItems).where(inArray(menuItems.sectionId, sectionIds)).orderBy(menuItems.displayOrder);
  const tables = await getRestaurantTables(restaurant.id);

  const menuSections = sections.map(section => ({
    ...section,
    items: items.filter(item => item.sectionId === section.id),
  }));

  return { restaurant, menuSections, tables };
}
