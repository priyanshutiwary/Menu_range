import React from 'react'
import { Order, Table, MenuTheme } from '../types/MenuTypes'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface OrderSummaryProps {
  orders: Order[];
  tables: Table[];
  theme: MenuTheme;
}

export function OrderSummary({ orders, tables, theme }: OrderSummaryProps) {
  const getTableName = (tableId: string) => {
    const table = tables.find(t => t.id === tableId)
    return table ? table.name : 'Unknown Table'
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            backgroundColor: theme.secondaryColor,
            color: theme.primaryColor,
            padding: '1rem',
            borderRadius: theme.borderRadius,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3 style={{
            fontSize: theme.sectionFontSize,
            fontWeight: theme.sectionFontWeight,
            marginBottom: '0.5rem',
            color: theme.accentColor,
          }}>
            Order for {getTableName(order.tableId)}
          </h3>
          <p style={{ fontSize: theme.itemFontSize, marginBottom: '0.5rem' }}>
            Status: {order.status}
          </p>
          <p style={{ fontSize: theme.itemFontSize, marginBottom: '0.5rem' }}>
            Created: {order.createdAt.toLocaleString()}
          </p>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between" style={{ fontSize: theme.itemFontSize }}>
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-2 mt-2" style={{ borderColor: theme.accentColor }}>
            <div className="flex justify-between font-bold" style={{ fontSize: theme.itemFontSize }}>
              <span>Total:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              style={{
                borderColor: theme.accentColor,
                color: theme.accentColor,
              }}
            >
              Update Status
            </Button>
            <Button
              variant="destructive"
              size="sm"
            >
              Cancel Order
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

