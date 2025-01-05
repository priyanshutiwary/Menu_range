'use client'

import React, { useState, useCallback, useEffect } from 'react'
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
import { OrderPreview } from './order-preview'
import { ScrollArea } from '@/components/ui/scroll-area'

interface OrderItem extends MenuItem {
  quantity: number;
}

interface MenuPreviewProps {
  sections: MenuSection[];
  theme: MenuTheme;
  tables: Table[];
  onPlaceOrder: (order: any) => void;
}

export default function MenuPreview({ sections, theme, tables, onPlaceOrder }: MenuPreviewProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(sections.map(s => s.id))
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [selectedTable, setSelectedTable] = useState<string>('')
  const [showOrderPreview, setShowOrderPreview] = useState(false)

  const getMenuStyle = () => ({
    fontFamily: theme.fontFamily,
    backgroundColor: theme.backgroundColor,
    backgroundImage: theme.backgroundType === 'image' ? `url(${theme.backgroundImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: theme.primaryColor,
    padding: '2rem',
    minHeight: '100vh',
  })

  const getCardStyle = () => {
    switch (theme.cardStyle) {
      case 'raised':
        return 'shadow-lg'
      case 'glassmorphic':
        return 'backdrop-filter backdrop-blur-lg bg-opacity-30'
      default:
        return ''
    }
  }

  const getButtonStyle = () => {
    switch (theme.buttonStyle) {
      case 'gradient':
        return `bg-gradient-to-r from-${theme.accentColor} to-${theme.primaryColor} text-white`
      case 'outline':
        return `border-2 border-${theme.accentColor} text-${theme.accentColor}`
      default:
        return `bg-${theme.accentColor} text-white`
    }
  }

  const getAnimationDuration = () => {
    switch (theme.animationSpeed) {
      case 'slow':
        return 0.7
      case 'fast':
        return 0.3
      default:
        return 0.5
    }
  }

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
    if (orderItems.length === 0) {
      toast.error('Please add items to your order')
      return
    }
    setShowOrderPreview(true)
  }

  const handleConfirmOrder = () => {
    const order = {
      id: Math.random().toString(36).substr(2, 9),
      tableId: selectedTable,
      items: orderItems,
      total: calculateTotal(),
      status: 'pending',
      createdAt: new Date(),
    }
    
    onPlaceOrder(order)
    toast.success('Order placed successfully!')
    setOrderItems([])
    setShowOrderPreview(false)
  }

  useEffect(() => {
    console.log('Current state:', {
      selectedTable,
      orderItemsLength: orderItems.length,
      isButtonDisabled: !selectedTable || orderItems.length === 0
    });
  }, [selectedTable, orderItems]);

  return (
    <div style={getMenuStyle()} className="flex flex-col h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: getAnimationDuration() }}
        style={{
          fontSize: theme.headerFontSize,
          fontWeight: theme.headerFontWeight,
          fontStyle: theme.headerFontStyle,
          textAlign: 'center',
          marginBottom: '2rem',
          color: theme.accentColor,
          textShadow: theme.textShadow,
        }}
      >
        Restaurant Menu
      </motion.h1>
      <div className="flex justify-between mb-4">
        <Select value={selectedTable} onValueChange={(value) => {
          console.log('Selected table:', value);
          setSelectedTable(value);
        }}>
          <SelectTrigger className="w-[200px] bg-white text-[#2d3748]">
            <SelectValue placeholder="Select a table" />
          </SelectTrigger>
          <SelectContent>
            {tables.map((table) => (
              <SelectItem key={table.id} value={table.id}>
                {table.name} (Seats: {table.seats})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pb-40">
          {sections.map((section) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: getAnimationDuration() }}
              style={{ marginBottom: '2rem' }}
            >
              <div 
                style={{
                  fontSize: theme.sectionFontSize,
                  fontWeight: theme.sectionFontWeight,
                  fontStyle: theme.sectionFontStyle,
                  borderBottom: `2px solid ${theme.accentColor}`,
                  paddingBottom: '0.5rem',
                  marginBottom: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textShadow: theme.textShadow,
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
                    transition={{ duration: getAnimationDuration() }}
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
                        transition={{ duration: getAnimationDuration() }}
                        key={item.id}
                        style={{
                          backgroundColor: theme.secondaryColor,
                          padding: '1rem',
                          borderRadius: theme.borderRadius,
                        }}
                        className={getCardStyle()}
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
                          fontStyle: theme.itemFontStyle,
                          marginBottom: '0.5rem',
                          color: theme.accentColor,
                          textShadow: theme.textShadow,
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
                            className={getButtonStyle()}
                            style={{ borderRadius: theme.buttonRadius }}
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                          <span className="font-medium">{getItemQuantity(item.id)}</span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => addToOrder(item)}
                            className={getButtonStyle()}
                            style={{ borderRadius: theme.buttonRadius }}
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
        </ScrollArea>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: getAnimationDuration() }}
        style={{
          backgroundColor: theme.secondaryColor,
          color: theme.primaryColor,
          padding: '1.5rem',
          borderRadius: theme.borderRadius,
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
        className={getCardStyle()}
      >
        <div className="flex items-center gap-2 mb-4">
          <Receipt className="h-5 w-5" style={{ color: theme.accentColor }} />
          <h2 style={{
            fontSize: theme.sectionFontSize,
            fontWeight: theme.sectionFontWeight,
            fontStyle: theme.sectionFontStyle,
            color: theme.accentColor,
            textShadow: theme.textShadow,
          }}>
            Order Summary
          </h2>
        </div>
        
        <div className="space-y-4">
          {orderItems.length === 0 ? (
            <p className="text-muted-foreground text-sm">No items in order</p>
          ) : (
            <>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p style={{ fontSize: theme.itemFontSize, fontWeight: theme.itemFontWeight, fontStyle: theme.itemFontStyle }}>
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
                    fontStyle: theme.sectionFontStyle,
                    color: theme.accentColor,
                    textShadow: theme.textShadow,
                  }}>
                    Total
                  </p>
                  <p style={{ 
                    fontSize: theme.itemFontSize, 
                    fontWeight: theme.sectionFontWeight,
                    fontStyle: theme.sectionFontStyle,
                    color: theme.accentColor,
                    textShadow: theme.textShadow,
                  }}>
                    {formatPrice(calculateTotal())}
                  </p>
                </div>
              </div>
            </>
          )}
          
          <Button 
            className={`w-full ${getButtonStyle()}`}
            onClick={handlePlaceOrder}
            disabled={orderItems.length === 0}
            style={{
              borderRadius: theme.buttonRadius,
              opacity: orderItems.length === 0 ? 0.5 : 1
            }}
          >
            Place Order
          </Button>
        </div>
      </motion.div>
      <OrderPreview
        isOpen={showOrderPreview}
        onClose={() => setShowOrderPreview(false)}
        items={orderItems}
        tableId={selectedTable}
        onConfirm={handleConfirmOrder}
      />
    </div>
  )
}

