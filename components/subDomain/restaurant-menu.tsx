'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Restaurant, MenuSection, MenuItem, Table } from '@/types/MenuTypes'
import { ChevronDown, ChevronUp, Receipt, Minus, Plus, Search, ImageIcon } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ThemeToggle  from '@/components/subDomain/theme-toggle'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { formatPrice } from '@/lib/utils'

interface RestaurantMenuProps {
  restaurant: Restaurant
  menuSections: MenuSection[]
  tables: Table[]
}

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

export function RestaurantMenu({ restaurant, menuSections, tables }: RestaurantMenuProps) {
  const [expandedSections, setExpandedSections] = useState<number[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTable, setSelectedTable] = useState<string>('')
  const [specialInstructions, setSpecialInstructions] = useState<string>('')

  const toggleSection = (sectionId: number) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const updateQuantity = (item: MenuItem, delta: number) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id)
      if (existingItem) {
        const newQuantity = Math.max(0, existingItem.quantity + delta)
        if (newQuantity === 0) {
          return prev.filter(cartItem => cartItem.id !== item.id)
        }
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        )
      } else if (delta > 0) {
        return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }]
      }
      return prev
    })
  }

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const filteredSections = menuSections.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0)

  const handlePlaceOrder = () => {
    if (!selectedTable) {
      alert('Please select a table before placing your order.')
      return
    }
    // Here you would typically send the order to your backend
    console.log('Order placed for table', selectedTable, 'with items:', cart, 'Special Instructions:', specialInstructions)
    // Reset cart and close sheet after order is placed
    setCart([])
    setIsCartOpen(false)
    setSelectedTable('')
    setSpecialInstructions('')
  }

  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-primary/90 to-primary">
        <div className="absolute inset-0 bg-background/50 dark:bg-background/70" />
        <div className="relative h-full flex flex-col items-center justify-center text-background-foreground p-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-2">
            {restaurant.name}
          </h1>
          {restaurant.cuisineType && (
            <p className="text-muted-foreground text-center max-w-xl">
              {restaurant.cuisineType} Cuisine
            </p>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ScrollArea className="h-[calc(100vh-400px)]">
          {filteredSections.map((section) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between py-4 text-xl font-semibold text-foreground hover:text-primary transition-colors"
              >
                <span className="capitalize">{section.name}</span>
                {expandedSections.includes(section.id) ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
              
              <AnimatePresence>
                {expandedSections.includes(section.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid gap-4 mt-4"
                  >
                    {section.items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        className="flex gap-4 p-4 bg-card rounded-lg border border-border hover:border-border/80 transition-colors"
                      >
                        <div className="relative w-24 h-24 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium text-foreground">
                                {item.name}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {item.description}
                              </p>
                            </div>
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                              {formatPrice(item.price)}
                            </Badge>
                          </div>
                          <div className="flex justify-end items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item, -1)}
                              disabled={!cart.some(cartItem => cartItem.id === item.id)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item, 1)}
                              disabled={item.isAvailable === 'Unavailable'}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
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

      {/* Cart Button */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 h-16 px-6 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
            onClick={() => setIsCartOpen(true)}
          >
            <Receipt className="mr-2 h-5 w-5" />
            <span className="font-semibold">
              {getTotalItems()} items • {formatPrice(getTotalPrice())}
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Your Order</SheetTitle>
            <SheetDescription>
              Review your items before placing the order
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-300px)] mt-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-4 border-b"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(item.price)} × {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity({ id: item.id, name: item.name, price: item.price } as MenuItem, -1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity({ id: item.id, name: item.name, price: item.price } as MenuItem, 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </ScrollArea>
          <SheetFooter className="mt-6">
            <div className="w-full space-y-4">
              <Select value={selectedTable} onValueChange={setSelectedTable}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your table" />
                </SelectTrigger>
                <SelectContent>
                  {tables.map((table) => (
                    <SelectItem 
                      key={table.id} 
                      value={table.id.toString()}
                    >
                      Table {table.tableNumber} (Seats {table.seatingCapacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Special instructions..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-primary">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>
              <Button 
                className="w-full"
                onClick={handlePlaceOrder}
                disabled={!selectedTable || cart.length === 0}
              >
                Place Order
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

