'use client'

import React, { useState, useCallback } from 'react'
import { MenuSection, MenuTheme, Table, MenuItem } from '@/lib/validations/menu'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { PlusCircle, MinusCircle, ChevronDown, ChevronUp, Receipt } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

interface OrderItem extends MenuItem {
  quantity: number;
}

interface MenuPreviewProps {
  sections: MenuSection[];
  theme: MenuTheme;
  tables: Table[];
}

export default function MenuPreview({ sections, theme, tables }: MenuPreviewProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(sections.map(s => s.id))
  const [selectedTable, setSelectedTable] = useState<string>('')
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])

  const getMenuStyle = () => ({
    fontFamily: theme.fontFamily,
    backgroundColor: theme.backgroundType === 'color' ? theme.backgroundColor : 'transparent',
    backgroundImage: theme.backgroundType === 'image' ? `url(${theme.backgroundImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: theme.primaryColor,
    padding: '2rem',
    minHeight: '100vh',
  })

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const addToOrder = useCallback((item: MenuItem) => {
    setOrderItems(prev => {
      const existingItem = prev.find(i => i.id === item.id)
      if (existingItem) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
    toast.success(`Added ${item.name} to order`)
  }, [])

  const removeFromOrder = useCallback((item: MenuItem) => {
    setOrderItems(prev => {
      const existingItem = prev.find(i => i.id === item.id)
      if (!existingItem) return prev
      if (existingItem.quantity === 1) {
        return prev.filter(i => i.id !== item.id)
      }
      return prev.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
      )
    })
  }, [])

  const getItemQuantity = useCallback((itemId: string) => {
    return orderItems.find(item => item.id === itemId)?.quantity || 0
  }, [orderItems])

  const calculateTotal = useCallback(() => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }, [orderItems])

  const handlePlaceOrder = () => {
    if (!selectedTable) {
      toast.error('Please select a table first')
      return
    }
    if (orderItems.length === 0) {
      toast.error('Please add items to your order')
      return
    }
    
    // Here you would typically send the order to your backend
    const order = {
      tableId: selectedTable,
      items: orderItems,
      total: calculateTotal(),
      status: 'pending',
      createdAt: new Date(),
    }
    
    console.log('Placing order:', order)
    toast.success('Order placed successfully!')
    setOrderItems([])
  }

  return (
    <div style={getMenuStyle()} className="flex flex-col">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          fontSize: theme.headerFontSize,
          fontWeight: theme.headerFontWeight,
          textAlign: 'center',
          marginBottom: '2rem',
          color: theme.accentColor,
        }}
      >
        Restaurant Menu
      </motion.h1>
      <div className="flex justify-between mb-4">
        <Select value={selectedTable} onValueChange={setSelectedTable}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a table" />
          </SelectTrigger>
          <SelectContent>
            {tables.map((table) => (
              <SelectItem key={table.id} value={table.id}>
                {table.name} (Capacity: {table.capacity})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-1 gap-6">
        <div className="w-3/4">
          {sections.map((section) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ marginBottom: '2rem' }}
            >
              <div 
                style={{
                  fontSize: theme.sectionFontSize,
                  fontWeight: theme.sectionFontWeight,
                  borderBottom: `2px solid ${theme.accentColor}`,
                  paddingBottom: '0.5rem',
                  marginBottom: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onClick={() => toggleSection(section.id)}
              >
                {section.name}
                {expandedSections.includes(section.id) ? <ChevronUp /> : <ChevronDown />}
              </div>
              <AnimatePresence>
                {expandedSections.includes(section.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                      gap: theme.itemSpacing,
                    }}
                  >
                    {section.items.map((item) => (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        key={item.id}
                        style={{
                          backgroundColor: theme.secondaryColor,
                          padding: '1rem',
                          borderRadius: theme.borderRadius,
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        {item.photoUrl && (
                          <div style={{ position: 'relative', width: '100%', height: '150px', marginBottom: '1rem' }}>
                            <Image
                              src={item.photoUrl}
                              alt={item.name}
                              fill
                              style={{ objectFit: 'cover', borderRadius: theme.borderRadius }}
                            />
                          </div>
                        )}
                        <h3 style={{
                          fontSize: theme.itemFontSize,
                          fontWeight: theme.itemFontWeight,
                          marginBottom: '0.5rem',
                          color: theme.accentColor,
                        }}>
                          {item.name}
                        </h3>
                        <p style={{ fontSize: '0.9em', marginBottom: '0.5rem', color: theme.primaryColor }}>
                          {item.description}
                        </p>
                        <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: theme.accentColor }}>
                          {formatPrice(item.price)}
                        </p>
                        <div className="flex justify-between items-center">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => removeFromOrder(item)}
                            disabled={getItemQuantity(item.id) === 0}
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                          <span className="font-medium">{getItemQuantity(item.id)}</span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => addToOrder(item)}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        <div className="w-1/4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundColor: theme.secondaryColor,
              color: theme.primaryColor,
              padding: '1.5rem',
              borderRadius: theme.borderRadius,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              position: 'sticky',
              top: '1rem',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Receipt className="h-5 w-5" style={{ color: theme.accentColor }} />
              <h2 style={{
                fontSize: theme.sectionFontSize,
                fontWeight: theme.sectionFontWeight,
                color: theme.accentColor,
              }}>
                Bill Summary
              </h2>
            </div>
            
            <div className="space-y-4">
              {orderItems.length === 0 ? (
                <p className="text-muted-foreground text-sm">No items in order</p>
              ) : (
                <>
                  <div className="space-y-2">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <p style={{ fontSize: theme.itemFontSize, fontWeight: theme.itemFontWeight }}>
                            {item.name} x {item.quantity}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(item.price)} each
                          </p>
                        </div>
                        <p style={{ fontWeight: theme.itemFontWeight }}>
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4" style={{ borderColor: theme.accentColor }}>
                    <div className="flex justify-between items-center">
                      <p style={{ 
                        fontSize: theme.itemFontSize, 
                        fontWeight: theme.sectionFontWeight,
                        color: theme.accentColor 
                      }}>
                        Total
                      </p>
                      <p style={{ 
                        fontSize: theme.itemFontSize, 
                        fontWeight: theme.sectionFontWeight,
                        color: theme.accentColor 
                      }}>
                        {formatPrice(calculateTotal())}
                      </p>
                    </div>
                  </div>
                </>
              )}
              
              <Button 
                className="w-full"
                onClick={handlePlaceOrder}
                disabled={!selectedTable || orderItems.length === 0}
                style={{
                  backgroundColor: theme.accentColor,
                  color: theme.secondaryColor,
                }}
              >
                Place Order
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

