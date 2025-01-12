

'use client'

import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { v4 as uuidv4 } from 'uuid'
import {
  Plus,
  Settings,
  ChevronDown,
  ChevronUp,
  Menu,
  User,
} from 'lucide-react'
import { MenuItem, MenuSection, MenuTheme, Table } from '@/types/MenuTypes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { EditMenuItem } from './edit-menu-item'
import { AddMenuItem } from './add-menu-item'
import { EditSection } from './edit-section'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image';

export default function MenuCreator() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [menuSections, setMenuSections] = useState<MenuSection[]>([])
  const [newSection, setNewSection] = useState<string>('')
  const [newSectionDescription, setNewSectionDescription] = useState<string>('')
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
  const [activeTab, setActiveTab] = useState<
    'edit' | 'preview' | 'tables' | 'orders'
  >('edit')
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [tables, setTables] = useState<Table[]>([])
  const [incomingOrders, setIncomingOrders] = useState<any[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showProfileUpdate, setShowProfileUpdate] = useState(false)
  const [userName, setUserName] = useState<string | undefined>(undefined)
  const [userid, setUserid] = useState<string | undefined>(undefined)
  const [restaurant, setRestaurant] = useState<any | null>(null)
  const [editingSectionName, setEditingSectionName] = useState<{
    id: string
    name: string
  } | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState<{
    [key: string]: boolean
  }>({})
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [showAddItemForm, setShowAddItemForm] = useState<{
    [key: string]: boolean
  }>({})
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const [isEditSectionModalOpen, setIsEditSectionModalOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [images, setImages] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    const fetchUserId = async () => {
      await setUserName(session?.user?.name)
      await setUserid(session?.user?.id)
    }
    fetchUserId()
  }, [session])

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await fetch(`/api/setRestroProfile?userId=${userid}`, {
          method: 'GET',
        })
        const result = await response.json()
        if (result.success) {
          const restaurantData = result.data
          setRestaurant(restaurantData)

          if (restaurantData && restaurantData.id) {
            // Fetch sections
            const sectionsResponse = await fetch(
              `/api/setSection?id=${restaurantData.id}`,
              {
                method: 'GET',
              }
            )
            const sectionsResult = await sectionsResponse.json()

            if (sectionsResult.success) {
              setMenuSections(sectionsResult.data)

              // Fetch menu items for each section
              const itemsPromises = sectionsResult.data.map(async (section) => {
                const itemsResponse = await fetch(
                  `/api/setItem?id=${section.id}`,
                  {
                    method: 'GET',
                  }
                )
                const itemsData = await itemsResponse.json()
                if (itemsData.success) {
                  return { ...section, items: itemsData.data }
                } else {
                  toast.error(itemsData.message || 'Failed to fetch menu items')
                  return { ...section, items: [] }
                }
              })

              const updatedSections = await Promise.all(itemsPromises)
              setMenuSections(updatedSections)
            } else {
              toast.error(
                sectionsResult.message || 'Failed to fetch menu sections'
              )
            }

            // Fetch tables for the restaurant
            const tablesResponse = await fetch(
              `/api/setTable?restaurantId=${restaurantData.id}`,
              {
                method: 'GET',
              }
            )
            const tablesResult = await tablesResponse.json()

            if (tablesResult.success) {
              setTables(tablesResult.data)
            } else {
              toast.error(tablesResult.message || 'Failed to fetch tables')
            }
            const ordersResponse = await fetch(
              `/api/setOrder?restaurantId=${restaurantData.id}`,
              {
                method: 'GET',
              }
            )
            const ordersResult = await ordersResponse.json();
            if (ordersResult.success) {
              setIncomingOrders(ordersResult.data);
              console.log("incoming orders baby", ordersResult.data);

            }
            else {
              toast.error(tablesResult.message || 'Failed to fetch tables')
            }
          } else {
            toast.error('Restaurant ID is not available')
          }
        } else {
          toast.error(result.message || 'Failed to fetch restaurant data')
        }
      } catch (error) {
        console.error('Error fetching restaurant data:', error)
        toast.error('An error occurred while fetching restaurant data')
      }
    }

    if (userid) {
      fetchRestaurantDetails()
    }
  }, [userid])

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedSections = await menuStorage.getSections()
        const savedTheme = await menuStorage.getTheme()
        const savedTables = await menuStorage.getTables()

        if (savedSections.length > 0) {
          setMenuSections(savedSections)
          setExpandedSections(savedSections.map((section) => section.id))
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
  // useEffect(() => {
  //   const fetchImages = async (sectionId: string) => {
  //     const section = menuSections.find(sec => sec.id === sectionId);
  //     if (!section) return;

  //     // Filter out any empty or undefined imageFileIds
  //     const fileIds = section.items
  //       .map(item => item.imageFileId)
  //       .filter(id => id && id.trim() !== '')
  //       .join(',');

  //     if (!fileIds) {
  //       console.error('No valid file IDs to fetch images for.');
  //       return;
  //     }

  //     try {
  //       const response = await fetch(`/api/itemImage?fileIds=${fileIds}`);
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch images');
  //       }
  //       const data = await response.json();
  //       console.log(data);

  //       setImages((prev) => ({ ...prev, [sectionId]: data }));
  //       console.log(images);

  //     } catch (error) {
  //       console.error('Error fetching images:', error);
  //     }
  //   };

  //   expandedSections.forEach((sectionId) => {
  //     if (!images[sectionId]) {
  //       fetchImages(sectionId);
  //     }
  //   });
  // }, [expandedSections, menuSections]);

  const toggleSectionExpansion = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleSectionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSection(e.target.value)
  }

  const addSection = async () => {
    if (newSection.trim()) {
      const newSectionId = uuidv4()
      const displayOrder = menuSections.length + 1

      const response = await fetch('/api/setSection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurantId: restaurant.id,
          name: newSection.trim(),
          description: newSectionDescription.trim(),
          displayOrder,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMenuSections((prev) => [
          ...prev,
          {
            id: newSectionId,
            name: newSection.trim(),
            description: newSectionDescription.trim(),
            items: [],
          },
        ])
        setExpandedSections((prev) => [...prev, newSectionId])
        setNewSection('')
        setNewSectionDescription('')
        toast.success('Section added successfully')
      } else {
        toast.error(data.message || 'Failed to add section')
      }
    }
  }

  const handleEditSection = async (sectionId: string, data: MenuSection) => {
    try {
      const response = await fetch('/api/setSection', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: data.id,
          restaurantId: data.restaurantId,
          name: data.name,
          description: data.description,
          displayOrder: data.displayOrder
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update section')
      }

      const updatedSection = await response.json()

      setMenuSections((prev) =>
        prev.map((section) =>
          section.id === sectionId
            ? {
              ...section,
              name: data.name,
              description: data.description,
              displayOrder: data.displayOrder
            }
            : section
        )
      )
      setEditingSectionName(null)
      toast.success('Section updated successfully')
    } catch (error) {
      console.error('Error updating section:', error)
      toast.error('Failed to update section')
    }
  }
  const handleAddMenuItem = async (sectionId: string, item: MenuItem) => {
    try {
      console.log(sectionId)
      console.log(MenuItemForm)

      const response = await fetch('/api/setItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sectionId,
          ...item,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMenuSections((prev) =>
          prev.map((section) =>
            section.id === sectionId
              ? {
                ...section,
                items: [
                  ...(section.items || []),
                  { ...item, id: data.data.id },
                ],
              }
              : section
          )
        )
        toast.success('Menu item added successfully')
      } else {
        toast.error(data.message || 'Failed to add menu item')
      }
    } catch (error) {
      console.error('Error adding menu item:', error)
      toast.error('An error occurred while adding the menu item')
    }
  }

  const handleUpdateMenuItem = async (
    sectionId: string,
    updatedItem: MenuItem
  ) => {
    console.log(sectionId);
    console.log(updatedItem);


    try {
      const response = await fetch('/api/setItem?sectionId=${sectionId}', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sectionId,
          id: updatedItem.id,
          name: updatedItem.name,
          description: updatedItem.description,
          price: updatedItem.price,
          photoUrl: updatedItem.photoUrl,
          displayOrder: updatedItem.displayOrder
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMenuSections((prev) =>
          prev.map((section) =>
            section.id === sectionId
              ? {
                ...section,
                items: section.items.map((item) =>
                  item.id === updatedItem.id ? updatedItem : item
                ),
              }
              : section
          )
        )
        toast.success('Menu item updated successfully')
      } else {
        toast.error(data.message || 'Failed to update menu item')
      }
    } catch (error) {
      console.error('Error updating menu item:', error)
      toast.error('An error occurred while updating the menu item')
    }
  }

  const handleDeleteMenuItem = async (sectionId: string, itemId: string) => {
    try {
      const response = await fetch('/api/setItem', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: itemId }),
      })

      const data = await response.json()

      if (data.success) {
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
      } else {
        toast.error(data.message || 'Failed to delete item')
      }
    } catch (error) {
      console.error('Error deleting menu item:', error)
      toast.error('An error occurred while deleting the menu item')
    }
  }

  const handleDeleteSection = async (sectionId: string) => {
    try {
      const response = await fetch('/api/setSection', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: sectionId }),
      })

      const data = await response.json()

      if (data.success) {
        setMenuSections((prev) =>
          prev.filter((section) => section.id !== sectionId)
        )
        setExpandedSections((prev) => prev.filter((id) => id !== sectionId))
        toast.success('Section deleted successfully')
      } else {
        toast.error(data.message || 'Failed to delete section')
      }
    } catch (error) {
      console.error('Error deleting section:', error)
      toast.error('An error occurred while deleting the section')
    }
  }

  const handleAddTable = async (table: Table) => {
    try {
      const response = await fetch('/api/setTable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurantId: restaurant.id,
          tableNumber: table.name,
          seatingCapacity: table.capacity,
          isAvailable: table.status,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setTables((prev) => [...prev, data.data])
        toast.success('Table added successfully')
      } else {
        toast.error(data.message || 'Failed to add table')
      }
    } catch (error) {
      console.error('Error adding table:', error)
      toast.error('An error occurred while adding the table')
    }
  }

  const handleUpdateTable = (updatedTable: Table) => {
    setTables((prev) =>
      prev.map((table) => (table.id === updatedTable.id ? updatedTable : table))
    )
    toast.success('Table updated successfully')
  }

  const handleDeleteTable = async (tableId: string) => {
    try {
      const response = await fetch(`/api/setTable`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: tableId }),
      })

      const result = await response.json()

      if (result.success) {
        setTables((prev) => prev.filter((table) => table.id !== tableId))
        toast.success('Table deleted successfully')
      } else {
        toast.error(result.message || 'Failed to delete table')
      }
    } catch (error) {
      console.error('Error deleting table:', error)
      toast.error('An error occurred while deleting the table')
    }
  }



  // const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
  // 	setIncomingOrders((prev) =>
  // 		prev.map((order) =>
  // 			order.id === orderId ? { ...order, status: newStatus } : order
  // 		)
  // 	)
  // 	toast.success(`Order status updated to ${newStatus}`)
  // }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {


      // Send the update to the API
      const response = await fetch('/api/setOrder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: orderId,
          status: newStatus
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Revert the optimistic update if the API call fails
        setIncomingOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: data.status || 'pending' } : order
          )
        );
        throw new Error(data.message || 'Failed to update order status');
      }

      // Optimistically update the UI
      setIncomingOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Show success message
      toast.success(`Order status updated to ${newStatus}`);

      return data.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
      throw error;
    }
  }


  const handlePlaceOrder = async (order: any) => {
    try {
      // Format the order data
      const orderData = {
        restaurantId: restaurant.id,
        tableId: order.tableId,
        orderItems: order.items.map((item) => ({
          menuItemId: item.id,
          itemName: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          specialInstructions: item.specialInstructions || '',
        })),
      }
      console.log('he', orderData)

      // Send the order to the API
      const response = await fetch('/api/setOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order')
      }

      // Add the new order to the state with the returned data
      setIncomingOrders((prev) => [
        ...prev,
        {
          ...data.data,
          items: orderData.orderItems,
          status: 'pending',
        },
      ])

      // Show success message
      toast.success('Order placed successfully')

      // Optional: Clear the current order or reset related state
      // setCurrentOrder(null);
      // resetOrderForm();

      return data.data
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Failed to place order')
      throw error
    } finally {
      setIsLoading(false)
    }
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
                className="border-[#3b82f6] text-[#3b82f6] hover:bg-[#334155]">
                <User className="h-6 w-6" />
              </Button>
              <div className="md:hidden">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="border-[#3b82f6] text-[#3b82f6] hover:bg-[#334155]">
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="hidden md:grid w-full grid-cols-4 bg-white p-1">
              <TabsTrigger
                value="edit"
                className="data-[state=active]:bg-[#4299e1] data-[state=active]:text-white">
                Edit Menu
              </TabsTrigger>
              <TabsTrigger
                value="tables"
                className="data-[state=active]:bg-[#4299e1] data-[state=active]:text-white">
                Manage Tables
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="data-[state=active]:bg-[#4299e1] data-[state=active]:text-white">
                Incoming Orders
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="data-[state=active]:bg-[#4299e1] data-[state=active]:text-white">
                Preview Menu
              </TabsTrigger>
            </TabsList>

            {isMobileMenuOpen && (
              <div className="md:hidden space-y-2 mb-4">
                <Button
                  variant={activeTab === 'edit' ? 'default' : 'outline'}
                  className="w-full justify-start bg-[#3b82f6] text-[#1e293b]"
                  onClick={() => handleTabChange('edit')}>
                  Edit Menu
                </Button>
                <Button
                  variant={activeTab === 'tables' ? 'default' : 'outline'}
                  className="w-full justify-start bg-[#3b82f6] text-[#1e293b]"
                  onClick={() => handleTabChange('tables')}>
                  Manage Tables
                </Button>
                <Button
                  variant={activeTab === 'orders' ? 'default' : 'outline'}
                  className="w-full justify-start bg-[#3b82f6] text-[#1e293b]"
                  onClick={() => handleTabChange('orders')}>
                  Incoming Orders
                </Button>
                <Button
                  variant={activeTab === 'preview' ? 'default' : 'outline'}
                  className="w-full justify-start bg-[#3b82f6] text-[#1e293b]"
                  onClick={() => handleTabChange('preview')}>
                  Preview Menu
                </Button>
              </div>
            )}

            <TabsContent value="edit" className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-[#3b82f6] text-[#3b82f6] hover:bg-[#334155]">
                      <Settings className="mr-2 h-4 w-4" />
                      Customize Theme
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="bg-[#1e293b] border-l border-[#3b82f6]">
                    <SheetHeader>
                      <SheetTitle className="text-[#f8fafc]">
                        Customize Menu Theme
                      </SheetTitle>
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
                  <CardTitle className="text-[#2d3748]">
                    Create Menu Section
                  </CardTitle>
                  <CardDescription className="text-[#a0aec0]">
                    Add a new section to your menu
                  </CardDescription>
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
                    <Input
                      value={newSectionDescription}
                      onChange={(e) => setNewSectionDescription(e.target.value)}
                      placeholder="Section Description"
                      className="flex-grow bg-white border-[#e2e8f0] text-[#2d3748] placeholder-[#a0aec0]"
                    />
                    <Button
                      onClick={addSection}
                      className="w-full md:w-auto bg-[#4299e1] text-white hover:bg-[#3182ce]">
                      <Plus className="mr-2 h-4 w-4" /> Add Section
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                {Array.isArray(menuSections) &&
                  menuSections.map((section) => (
                    <Card
                      key={section.id}
                      className="bg-white border-[#e2e8f0]">
                      <CardHeader
                        className="flex flex-row items-center justify-between cursor-pointer"
                        onClick={() => toggleSectionExpansion(section.id)}>
                        <div>
                          <CardTitle className="text-[#2d3748]">
                            {section.name}
                            <h2 className="text-[#a0aec0] text-sm">
                              {section.description}
                            </h2>
                          </CardTitle>
                          <CardDescription className="text-[#a0aec0]">
                            {section.items ? section.items.length : 0} items
                          </CardDescription>
                        </div>

                        <div
                          className="relative flex items-center space-x-2"
                          onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setActiveSectionId(section.id)
                              setIsAddModalOpen(true)
                            }}
                            className="border-[#4299e1] text-[#4299e1] hover:bg-[#334155]">
                            <Plus className="h-4 w-4" />
                          </Button>
                          <div className="relative">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setIsDropdownOpen((prev) => ({
                                  ...prev,
                                  [section.id]: !prev[section.id],
                                }))
                              }}
                              className="border-[#4299e1] text-[#4299e1] hover:bg-[#334155]">
                              ...
                            </Button>
                            {isDropdownOpen[section.id] && (
                              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-300 rounded shadow-lg z-10">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingSectionId(section.id)
                                    setIsEditSectionModalOpen(true)
                                    setIsDropdownOpen((prev) => ({
                                      ...prev,
                                      [section.id]: false,
                                    }))
                                  }}
                                  className="w-full text-left border-[#4299e1] text-[#4299e1] hover:bg-[#f0f4f8] rounded-t-md py-2">
                                  Edit Section
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    handleDeleteSection(section.id)
                                  }}
                                  className="w-full text-left bg-red-600 hover:bg-red-700 rounded-b-md py-2">
                                  Delete Section
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      {expandedSections.includes(section.id) && (
                        <CardContent>
                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {Array.isArray(section.items) &&
                              section.items.map((item) => (
                                <Card
                                  key={item.id}
                                  className="bg-white border-[#e2e8f0]">
                                  <CardHeader>
                                    <CardTitle className="text-[#2d3748]">
                                      {item.name}
                                    </CardTitle>
                                    <CardDescription className="text-[#a0aec0]">
                                      {item.description}
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-2xl font-bold mb-2 text-[#4299e1]">
                                      {formatPrice(item.price)}
                                    </p>
                                    {item.imageUrl && (
                                      <div className="relative w-full h-40 mb-4">
                                        <Image
  src={item.imageUrl}
  alt={item.name}
  fill
  style={{
    objectFit: 'contain', // Change to 'contain' to show the full image
    objectPosition: 'center', // Center the image
    borderRadius: theme.borderRadius,
    border: '1px solid #e2e8f0', // Add a border

  }}
/>
                                      </div>
                                    )}
                                    <div className="flex justify-end space-x-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setEditingItem(item)
                                          setIsEditModalOpen(true)
                                        }}
                                        className="border-[#4299e1] text-[#4299e1] hover:bg-[#334155]">
                                        Edit
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() =>
                                          handleDeleteMenuItem(
                                            section.id,
                                            item.id
                                          )
                                        }
                                        className="bg-red-600 hover:bg-red-700">
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
                  restaurant={restaurant}
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
                  tables={tables}
                  menuSections={menuSections}
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

          {activeSectionId && (
            <AddMenuItem
              isOpen={isAddModalOpen}
              onClose={() => {
                setIsAddModalOpen(false)
                setActiveSectionId(null)
              }}
              onSave={(newItem) => {
                handleAddMenuItem(activeSectionId, newItem)
                setIsAddModalOpen(false)
                setActiveSectionId(null)
              }}
            />
          )}

          {editingItem && (
            <EditMenuItem
              item={editingItem}
              isOpen={isEditModalOpen}
              onClose={() => {
                setIsEditModalOpen(false)
                setEditingItem(null)
              }}
              onSave={(updatedItem) => {
                handleUpdateMenuItem(updatedItem.sectionId, updatedItem)
                setIsEditModalOpen(false)
                setEditingItem(null)
              }}
            />
          )}
          {editingSectionId && (
            <EditSection
              isOpen={isEditSectionModalOpen}
              onClose={() => {
                setIsEditSectionModalOpen(false)
                setEditingSectionId(null)
              }}
              onSave={async (data) => {
                await handleEditSection(editingSectionId, data)
                setIsEditSectionModalOpen(false)
                setEditingSectionId(null)
              }}
              initialData={menuSections.find(
                (section) => section.id === editingSectionId
              )}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}

