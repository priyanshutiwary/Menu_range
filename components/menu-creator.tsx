'use client'

import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Plus, Settings, ChevronDown, ChevronUp, Menu, User } from 'lucide-react'
import { MenuItem, MenuSection, MenuTheme, Table } from '@/lib/validations/menu'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeCustomizer } from '@/components/theme-customizer'
import MenuPreview from '@/components/menu-preview'
import { MenuItemForm } from './menu-item-form'
import { ErrorBoundary } from './error-boundary'
import { LoadingState } from './loading-state'
import { menuStorage } from '@/lib/menu-storage'
import { toast } from 'sonner'
import TableManager from '@/components/table-manager'
import { IncomingOrders } from './incoming-orders'
import { OnboardingPage } from './onboarding-page'

export default function MenuCreator() {
  const [isLoading, setIsLoading] = useState(true)
  const [menuSections, setMenuSections] = useState<MenuSection[]>([])
  const [newSection, setNewSection] = useState<string>('')
  const [theme, setTheme] = useState<MenuTheme>({
    backgroundType: 'color',
    backgroundColor: '#f0f4f8',
    backgroundImage: '',
    fontFamily: 'Inter, sans-serif',
    primaryColor: '#2d3748',
    secondaryColor: '#ffffff',
    accentColor: '#4299e1',
    headerFontSize: '48px',
    sectionFontSize: '28px',
    itemFontSize: '16px',
    headerFontWeight: '800',
    sectionFontWeight: '600',
    itemFontWeight: '400',
    borderRadius: '12px',
    itemSpacing: '24px',
  })
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'tables' | 'orders'>('edit')
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [tables, setTables] = useState<Table[]>([])
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [incomingOrders, setIncomingOrders] = useState<any[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showProfileUpdate, setShowProfileUpdate] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedSections = await menuStorage.getSections()
        const savedTheme = await menuStorage.getTheme()
        const savedTables = await menuStorage.getTables()
        
        if (savedSections.length > 0) {
          setMenuSections(savedSections)
          setExpandedSections(savedSections.map(section => section.id))
        }
        
        if (savedTheme) {
          setTheme(savedTheme)
        }
        
        if (savedTables.length > 0) {
          setTables(savedTables)
        }
        
        const savedDetails = localStorage.getItem('restaurantDetails')
        if (!savedDetails || JSON.parse(savedDetails).restaurantName === '') {
          setShowProfileUpdate(true)
        }
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error('Failed to load data. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSectionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSection(e.target.value)
  }

  const addSection = () => {
    if (newSection.trim()) {
      const newSectionId = uuidv4()
      setMenuSections((prev) => [
        ...prev,
        { id: newSectionId, name: newSection.trim(), items: [] },
      ])
      setExpandedSections((prev) => [...prev, newSectionId])
      setNewSection('')
      toast.success('Section added successfully')
    }
  }

  const handleAddMenuItem = (sectionId: string, item: MenuItem) => {
    setMenuSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: [...section.items, { ...item, id: uuidv4() }],
            }
          : section
      )
    )
  }

  const handleUpdateMenuItem = (sectionId: string, item: MenuItem) => {
    setMenuSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((i) =>
                i.id === item.id ? item : i
              ),
            }
          : section
      )
    )
  }

  const handleDeleteMenuItem = (sectionId: string, itemId: string) => {
    setMenuSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.filter((item) => item.id !== itemId),
            }
          : section
      )
    )
    toast.success('Item deleted successfully')
  }

  const handleDeleteSection = (sectionId: string) => {
    setMenuSections((prev) => prev.filter((section) => section.id !== sectionId))
    setExpandedSections((prev) => prev.filter((id) => id !== sectionId))
    toast.success('Section deleted successfully')
  }

  const handleAddTable = (table: Table) => {
    setTables(prev => [...prev, table])
    toast.success('Table added successfully')
  }

  const handleUpdateTable = (updatedTable: Table) => {
    setTables(prev => prev.map(table => 
      table.id === updatedTable.id ? updatedTable : table
    ))
    toast.success('Table updated successfully')
  }

  const handleDeleteTable = (tableId: string) => {
    setTables(prev => prev.filter(table => table.id !== tableId))
    toast.success('Table deleted successfully')
  }

  const toggleSectionExpansion = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setIncomingOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    )
    toast.success(`Order status updated to ${newStatus}`)
  }

  const handlePlaceOrder = (order: any) => {
    setIncomingOrders(prev => [...prev, order])
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'edit' | 'preview' | 'tables' | 'orders')
    setIsMobileMenuOpen(false)
  }

  const handleUpdateProfile = () => {
    setShowProfileUpdate(true)
  }

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#f0f4f8] p-4 md:p-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-[#2d3748]">
              Restaurant Menu Creator
            </h1>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleUpdateProfile}
                className="border-[#3b82f6] text-[#3b82f6] hover:bg-[#334155]"
              >
                <User className="h-6 w-6" />
              </Button>
              <div className="md:hidden">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="border-[#3b82f6] text-[#3b82f6] hover:bg-[#334155]"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="hidden md:grid w-full grid-cols-4 bg-white p-1">
              <TabsTrigger 
                value="edit"
                className="data-[state=active]:bg-[#4299e1] data-[state=active]:text-white"
              >
                Edit Menu
              </TabsTrigger>
              <TabsTrigger 
                value="tables"
                className="data-[state=active]:bg-[#4299e1] data-[state=active]:text-white"
              >
                Manage Tables
              </TabsTrigger>
              <TabsTrigger 
                value="orders"
                className="data-[state=active]:bg-[#4299e1] data-[state=active]:text-white"
              >
                Incoming Orders
              </TabsTrigger>
              <TabsTrigger 
                value="preview"
                className="data-[state=active]:bg-[#4299e1] data-[state=active]:text-white"
              >
                Preview Menu
              </TabsTrigger>
            </TabsList>

            {isMobileMenuOpen && (
              <div className="md:hidden space-y-2 mb-4">
                <Button
                  variant={activeTab === 'edit' ? 'default' : 'outline'}
                  className="w-full justify-start bg-[#3b82f6] text-[#1e293b]"
                  onClick={() => handleTabChange('edit')}
                >
                  Edit Menu
                </Button>
                <Button
                  variant={activeTab === 'tables' ? 'default' : 'outline'}
                  className="w-full justify-start bg-[#3b82f6] text-[#1e293b]"
                  onClick={() => handleTabChange('tables')}
                >
                  Manage Tables
                </Button>
                <Button
                  variant={activeTab === 'orders' ? 'default' : 'outline'}
                  className="w-full justify-start bg-[#3b82f6] text-[#1e293b]"
                  onClick={() => handleTabChange('orders')}
                >
                  Incoming Orders
                </Button>
                <Button
                  variant={activeTab === 'preview' ? 'default' : 'outline'}
                  className="w-full justify-start bg-[#3b82f6] text-[#1e293b]"
                  onClick={() => handleTabChange('preview')}
                >
                  Preview Menu
                </Button>
              </div>
            )}

            <TabsContent value="edit" className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="border-[#3b82f6] text-[#3b82f6] hover:bg-[#334155]">
                      <Settings className="mr-2 h-4 w-4" />
                      Customize Theme
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="bg-[#1e293b] border-l border-[#3b82f6]">
                    <SheetHeader>
                      <SheetTitle className="text-[#f8fafc]">Customize Menu Theme</SheetTitle>
                      <SheetDescription className="text-[#a0aec0]">
                        Adjust the visual style of your menu
                      </SheetDescription>
                    </SheetHeader>
                    <ThemeCustomizer theme={theme} onThemeChange={setTheme} />
                  </SheetContent>
                </Sheet>
              </div>

              <Card className="bg-white border-[#e2e8f0]">
                <CardHeader>
                  <CardTitle className="text-[#2d3748]">Create Menu Section</CardTitle>
                  <CardDescription className="text-[#a0aec0]">Add a new section to your menu</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <Input
                      value={newSection}
                      onChange={handleSectionInputChange}
                      placeholder="Section Name"
                      onKeyDown={(e) => e.key === 'Enter' && addSection()}
                      className="flex-grow bg-white border-[#e2e8f0] text-[#2d3748] placeholder-[#a0aec0]"
                    />
                    <Button 
                      onClick={addSection} 
                      className="w-full md:w-auto bg-[#4299e1] text-white hover:bg-[#3182ce]"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Section
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                {menuSections.map((section) => (
                  <Card key={section.id} className="bg-white border-[#e2e8f0]">
                    <CardHeader className="flex flex-row items-center justify-between cursor-pointer" onClick={() => toggleSectionExpansion(section.id)}>
                      <div>
                        <CardTitle className="text-[#2d3748]">{section.name}</CardTitle>
                        <CardDescription className="text-[#a0aec0]">
                          {section.items.length} items
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteSection(section.id)
                          }}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete Section
                        </Button>
                        {expandedSections.includes(section.id) ? (
                          <ChevronUp className="text-[#4299e1]" />
                        ) : (
                          <ChevronDown className="text-[#4299e1]" />
                        )}
                      </div>
                    </CardHeader>
                    {expandedSections.includes(section.id) && (
                      <CardContent>
                        <MenuItemForm
                          onSubmit={(data) => handleAddMenuItem(section.id, data)}
                          onCancel={() => setEditingSectionId(null)}
                        />
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
                          {section.items.map((item) => (
                            <Card key={item.id} className="bg-white border-[#e2e8f0]">
                              <CardHeader>
                                <CardTitle className="text-[#2d3748]">{item.name}</CardTitle>
                                <CardDescription className="text-[#a0aec0]">{item.description}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <p className="text-2xl font-bold mb-2 text-[#4299e1]">
                                  ${item.price.toFixed(2)}
                                </p>
                                {item.photoUrl && (
                                  <div className="relative w-full h-40 mb-4">
                                    <img
                                      src={item.photoUrl}
                                      alt={item.name}
                                      className="object-cover rounded-md w-full h-full"
                                    />
                                  </div>
                                )}
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingSectionId(section.id)
                                      handleUpdateMenuItem(section.id, item)
                                    }}
                                    className="border-[#4299e1] text-[#4299e1] hover:bg-[#334155]"
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteMenuItem(section.id, item.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tables">
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-4xl font-bold text-[#2d3748]">
                    Table Management
                  </h1>
                </div>
                <TableManager
                  tables={tables}
                  onAddTable={handleAddTable}
                  onUpdateTable={handleUpdateTable}
                  onDeleteTable={handleDeleteTable}
                />
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-4xl font-bold text-[#2d3748]">
                    Incoming Orders
                  </h1>
                </div>
                <IncomingOrders
                  orders={incomingOrders}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                />
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <MenuPreview 
                sections={menuSections} 
                theme={theme} 
                tables={tables} 
                onPlaceOrder={handlePlaceOrder}
              />
            </TabsContent>
          </Tabs>

          {showProfileUpdate && (
            <Sheet open={showProfileUpdate} onOpenChange={setShowProfileUpdate}>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Update Restaurant Profile</SheetTitle>
                  <SheetDescription>
                    You can update your restaurant details here
                  </SheetDescription>
                </SheetHeader>
                <OnboardingPage isUpdate={true} />
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}

