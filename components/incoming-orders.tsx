import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Clock, Coffee, ShoppingBag, X, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatPrice } from '@/lib/utils';
interface Order {
  id: string;
  tableId: string;
  items: Array<{ id: string; name: string; quantity: number; price: number }>;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: Date;
}

interface Table {
  id: string;
  tableNumber: string;
}

interface MenuSection {
  id: string;
  name: string;
}

interface IncomingOrdersProps {
  orders: Order[];
  tables: Table[];
  menuSections: MenuSection[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
}

// Existing StatusDot component remains the same
const StatusDot = ({ 
  status, 
  currentStatus, 
  icon: Icon,
  label 
}: { 
  status: Order['status'];
  currentStatus: Order['status'];
  icon: React.ElementType;
  label: string;
}) => {
  const getStatusColor = () => {
    if (currentStatus === 'cancelled') return 'bg-red-500 text-white';
    
    const statusOrder = ['pending', 'preparing', 'ready', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(status);
    
    if (stepIndex < currentIndex) return 'bg-green-500 text-white';
    if (stepIndex === currentIndex) return 'bg-blue-500 text-white';
    return 'bg-gray-200 text-gray-500';
  };

  return (
    <div className="flex flex-col items-center mx-2">
      <div className={`rounded-full p-1.5 ${getStatusColor()}`}>
        <Icon size={14} />
      </div>
      <span className="text-xs mt-1">{label}</span>
    </div>
  );
};

// Existing OrderCard component remains the same
const OrderCard = ({ order, table, onUpdateOrderStatus }: { 
  order: Order; 
  table: Table | undefined;
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const initialItemsToShow = 2;
  const hasMoreItems = order.items.length > initialItemsToShow;

  const visibleItems = expanded ? order.items : order.items.slice(0, initialItemsToShow);

  return (
    <Card className="bg-white border-[#e2e8f0] h-auto">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-[#2d3748]">
                Order #{order.id}
              </CardTitle>
              {order.status === 'cancelled' && (
                <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                  Cancelled
                </span>
              )}
            </div>
            <CardDescription className="text-[#718096]">
              Table: {table?.tableNumber || 'No table'}
            </CardDescription>
          </div>
          
          <div className="flex">
            <StatusDot 
              status="pending"
              currentStatus={order.status}
              icon={ShoppingBag}
              label="Pending"
            />
            <StatusDot 
              status="preparing"
              currentStatus={order.status}
              icon={Coffee}
              label="Preparing"
            />
            <StatusDot 
              status="ready"
              currentStatus={order.status}
              icon={Clock}
              label="Ready"
            />
            <StatusDot 
              status="delivered"
              currentStatus={order.status}
              icon={Check}
              label="Delivered"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="min-h-[100px]">
          <ul className="space-y-2">
            {visibleItems.map((item, index) => (
              <li key={index} className="flex justify-between text-[#2d3748]">
                <span>{item.quantity}x {item.itemName}</span>
                <span>{formatPrice(item.quantity * item.unitPrice)}</span>
              </li>
            ))}
          </ul>
          
          {hasMoreItems && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-500 hover:text-blue-600 text-sm mt-2 flex items-center"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Show More ({order.items.length - initialItemsToShow} items)
                </>
              )}
            </button>
          )}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="font-bold text-[#4299e1]">
            Total: {formatPrice(order.totalAmount)}
          </span>
          <div className="space-x-2">
            {order.status !== 'cancelled' && order.status !== 'delivered' && (
              <Button 
                onClick={() => onUpdateOrderStatus(order.id, 'cancelled')}
                variant="destructive"
                className="bg-red-500 text-white hover:bg-red-600"
                size="sm"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel Order
              </Button>
            )}
            {order.status === 'pending' && (
              <Button 
                onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                className="bg-[#4299e1] text-white hover:bg-[#3182ce]"
                size="sm"
              >
                Start Preparing
              </Button>
            )}
            {order.status === 'preparing' && (
              <Button 
                onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                className="bg-[#4299e1] text-white hover:bg-[#3182ce]"
                size="sm"
              >
                Mark as Ready
              </Button>
            )}
            {order.status === 'ready' && (
              <Button 
                onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                className="bg-[#4299e1] text-white hover:bg-[#3182ce]"
                size="sm"
              >
                Mark as Delivered
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function IncomingOrders({ orders, tables, menuSections, onUpdateOrderStatus }: IncomingOrdersProps) {
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('default');
  
  const filteredAndSortedOrders = orders
    .filter(order => {
      if (statusFilter === 'default') {
        return order.status !== 'cancelled';
      }
      if (statusFilter === 'all') {
        return true;
      }
      return order.status === statusFilter;
    })
    .sort((a, b) => {
      // Always show pending orders first when using default filter
      if (statusFilter === 'default') {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (b.status === 'pending' && a.status !== 'pending') return 1;
      }
      // Sort by creation date (newest first) for same status orders
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Incoming Orders</h1>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as Order['status'] | 'all')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default View</SelectItem>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredAndSortedOrders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          table={tables.find(table => table.id === order.tableId)}
          onUpdateOrderStatus={onUpdateOrderStatus}
        />
      ))}
      
      {filteredAndSortedOrders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No orders found for the selected filter
        </div>
      )}
    </div>
  );
}

export default IncomingOrders;