export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  photoUrl: string;
}

export interface MenuSection {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface MenuTheme {
  backgroundType: 'color' | 'image';
  backgroundColor: string;
  backgroundImage: string;
  fontFamily: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headerFontSize: string;
  sectionFontSize: string;
  itemFontSize: string;
  headerFontWeight: string;
  sectionFontWeight: string;
  itemFontWeight: string;
  borderRadius: string;
  itemSpacing: string;
}

export interface OrderItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface Table {
  id: string;
  name: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
}

