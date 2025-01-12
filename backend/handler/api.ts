import { MenuSection, MenuItem, Table, Order } from '@/types/MenuTypes'

// Fetch restaurant data
export async function fetchRestaurantData(userId: string) {
  const response = await fetch(`/api/setRestroProfile?userId=${userId}`)
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch restaurant data')
  }
  return result.data
}

// Fetch menu sections
export async function fetchMenuSections(restaurantId: string) {
  const response = await fetch(`/api/setSection?id=${restaurantId}`)
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch menu sections')
  }
  return result.data
}

// Fetch tables
export async function fetchTables(restaurantId: string) {
  const response = await fetch(`/api/setTable?restaurantId=${restaurantId}`)
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch tables')
  }
  return result.data
}

// Fetch orders
export async function fetchOrders(restaurantId: string) {
  const response = await fetch(`/api/setOrder?restaurantId=${restaurantId}`)
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch orders')
  }
  return result.data
}

// Add section
export async function addSection(restaurantId: string, sectionData: Partial<MenuSection>) {
  const response = await fetch('/api/setSection', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ restaurantId, ...sectionData }),
  })
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || 'Failed to add section')
  }
  return result.data
}

// Update section
export async function updateSection(sectionId: string, sectionData: Partial<MenuSection>) {
  const response = await fetch('/api/setSection', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: sectionId, ...sectionData }),
  })
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || 'Failed to update section')
  }
  return result.data
}

// Delete section
export async function deleteSection(sectionId: string) {
  const response = await fetch('/api/setSection', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: sectionId }),
  })
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || 'Failed to delete section')
  }
  return result.data
}

// Add menu item
export async function addMenuItem(sectionId: string, itemData: Partial<MenuItem>) {
  const response = await fetch('/api/setItem', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sectionId, ...itemData }),
  })
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || 'Failed to add menu item')
  }
  return result.data
}

// Update menu item
export async function updateMenuItem(itemId: string, itemData: Partial<MenuItem>) {
  const response = await fetch('/api/setItem', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: itemId, ...itemData }),
  })
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || 'Failed to update menu item')
  }
  return result.data
}

// Delete menu item
export async function deleteMenuItem(itemId: string) {
  const response = await fetch('/api/setItem', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: itemId }),
  })
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || 'Failed to delete menu item')
  }
  return result.data
}

// Add table
export async function addTable(restaurantId: string, tableData: Partial<Table>) {
  const response = await fetch('/api/setTable', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ restaurantId, ...tableData }),
  })
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || 'Failed to add table')
  }
  return result.data
}

// Update table
export async function updateTable(tableId: string, tableData: Partial<Table>) {
  const response = await fetch('/api/setTable', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: tableId, ...tableData }),
  })
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || 'Failed to update table')
  }
  return result.data
}

// Delete table
export async function deleteTable(tableId: string) {
  const response = await fetch('/api/setTable', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: tableId }),
  })
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || 'Failed to delete table')
  }
  return result.data
}

// Update order status
export async function updateOrderStatus(orderId: string, status: string) {
  const response = await fetch('/api/setOrder', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: orderId, status }),
  })
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || 'Failed to update order status')
  }
  return result.data
}

// Place order
export async function placeOrder(restaurantId: string, tableId: string, orderItems: any[]) {
  const response = await fetch('/api/setOrder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ restaurantId, tableId, orderItems }),
  })
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || 'Failed to place order')
  }
  return result.data
}

