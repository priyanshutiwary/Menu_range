'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { OrderItem } from '@/lib/validations/menu'
import { ScrollArea } from '@/components/ui/scroll-area'

interface OrderPreviewProps {
  isOpen: boolean
  onClose: () => void
  items: OrderItem[]
  tableId: string
  onConfirm: () => void
}

export function OrderPreview({ isOpen, onClose, items, tableId, onConfirm }: OrderPreviewProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Order Preview</DialogTitle>
          <DialogDescription>
            Review your order for Table {tableId}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-start py-2">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(item.price)} × {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <p className="font-semibold">Total</p>
                <p className="font-semibold">{formatPrice(total)}</p>
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            Confirm Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

