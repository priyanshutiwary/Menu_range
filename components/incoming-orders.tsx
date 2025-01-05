import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

interface Order {
  id: string
  tableId: string
  items: Array<{ id: string; name: string; quantity: number; price: number }>
  total: number
  status: 'pending' | 'preparing' | 'ready' | 'delivered'
  createdAt: Date
}

interface IncomingOrdersProps {
  orders: Order[]
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void
}

export function IncomingOrders({ orders, onUpdateOrderStatus }: IncomingOrdersProps) {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="bg-white border-[#e2e8f0]">
          <CardHeader>
            <CardTitle className="text-[#2d3748]">Order #{order.id.slice(0, 8)}</CardTitle>
            <CardDescription className="text-[#718096]">
              Table: {order.tableId || 'No table'}, Status: {order.status}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {order.items.map((item, index) => (
                <li key={index} className="flex justify-between text-[#2d3748]">
                  <span>{item.quantity}x {item.name}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between items-center">
              <span className="font-bold text-[#4299e1]">
                Total: {formatPrice(order.total)}
              </span>
              <div className="space-x-2">
                {order.status === 'pending' && (
                  <Button 
                    onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                    className="bg-[#4299e1] text-white hover:bg-[#3182ce]"
                  >
                    Start Preparing
                  </Button>
                )}
                {order.status === 'preparing' && (
                  <Button 
                    onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                    className="bg-[#4299e1] text-white hover:bg-[#3182ce]"
                  >
                    Mark as Ready
                  </Button>
                )}
                {order.status === 'ready' && (
                  <Button 
                    onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                    className="bg-[#4299e1] text-white hover:bg-[#3182ce]"
                  >
                    Mark as Delivered
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

