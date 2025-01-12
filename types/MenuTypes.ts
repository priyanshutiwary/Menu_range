// export interface MenuItem {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   imageUrl: string;
//   displayOrder: number;
//   imageFileId:string
// }

// export interface MenuSection {
//   id: string;
//   name: string;
//   description: string;
//   displayOrder:number;
//   items: MenuItem[];
// }

// export interface MenuTheme {
//   backgroundType: 'color' | 'image';
//   backgroundColor: string;
//   backgroundImage: string;
//   fontFamily: string;
//   primaryColor: string;
//   secondaryColor: string;
//   accentColor: string;
//   headerFontSize: string;
//   sectionFontSize: string;
//   itemFontSize: string;
//   headerFontWeight: string;
//   sectionFontWeight: string;
//   itemFontWeight: string;
//   borderRadius: string;
//   itemSpacing: string;
// }

// export interface OrderItem extends MenuItem {
//   quantity: number;
// }

// export interface Order {
//   id: string;
//   tableId: string;
//   items: OrderItem[];
//   total: number;
//   status: 'pending' | 'completed' | 'cancelled';
//   createdAt: Date;
// }

// export interface Table {
//   id: string;
//   name: string;
//   capacity: number;
//   status: 'available' | 'occupied' | 'reserved';
//   tableNumber: number;

// }

export interface User {
  id: number;
  name: string;
  email: string;
  isVerified: boolean;
}

export interface Restaurant {
  id: number;
  userId: number;
  name: string;
  ownerName?: string;
  location: string;
  phoneNumber?: string;
  cuisineType?: string;
  isPublic: boolean;
  subDomain: string;
  menu: Menu;
  tables: Table[];
}

export interface Menu {
  sections: MenuSection[];
}

export interface MenuSection {
  id: number;
  restaurantId: number;
  name: string;
  description?: string;
  displayOrder?: number;
  items: MenuItem[];
}

export interface MenuItem {
  id: number;
  sectionId: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  imageFileId?: string;
  isAvailable: 'Available' | 'Unavailable';
  displayOrder: number;
}

export interface Table {
  id: number;
  restaurantId: number;
  tableNumber: number;
  seatingCapacity: number;
  isAvailable: 'Available' | 'Unavailable';
}

export interface Order {
  id: number;
  restaurantId: number;
  tableId: number;
  status: string;
  totalAmount: number;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  specialInstructions?: string;
}

