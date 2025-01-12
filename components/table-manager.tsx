'use client'

import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { QRCodeCanvas } from 'qrcode.react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { QrCode } from 'lucide-react'
import { Restaurant,Table } from '@/types/MenuTypes'
// interface Table {
//   id: string
//   name: string
//   capacity: number
//   seats: number
//   status: 'available' | 'occupied' | 'reserved'
// }

interface TableManagerProps {
  restaurant: Restaurant
  tables: Table[]
  onAddTable: (table: Table) => void
  onUpdateTable: (table: Table) => void
  onDeleteTable: (tableId: string) => void
}

export default function TableManager({ restaurant, tables, onAddTable, onUpdateTable, onDeleteTable }: TableManagerProps) {
  const [newTable, setNewTable] = useState<Omit<Table, 'id'>>({
    name: '',
    capacity: 1,
    
    status: 'available',
  })
  const [selectedTableForQR, setSelectedTableForQR] = useState<Table | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewTable(prev => ({
      ...prev,
      [name]: name === 'capacity' || name === 'seats' ? parseInt(value) || 1 : value,
    }))
  }

  const handleStatusChange = (status: Table['status']) => {
    setNewTable(prev => ({ ...prev, status }))
  }

  const handleAddTable = () => {
    if (newTable.name) {
      onAddTable({ ...newTable, id: uuidv4() })
      setNewTable({ name: '', capacity: 1, seats: 1, status: 'available' })
    }
  }

  const getTableUrl = (tableId: string) => {
    const origin = window.location.origin
    // Extract the domain without protocol
    const domain = origin.replace(/^https?:\/\//, '')
    // Determine if we're in localhost
    const isLocalhost = domain.includes('localhost') || domain.includes('127.0.0.1')
    // Choose protocol based on environment
    const protocol = isLocalhost ? 'http://' : 'https://'
    // Construct the URL with appropriate protocol
    return `${protocol}${restaurant.subDomain}.${domain}?table=${tableId}`
  }

  const handleDownloadQR = () => {
    if (!selectedTableForQR) return

    const canvas = document.getElementById('table-qr-code') as HTMLCanvasElement
    if (!canvas) return

    const pngUrl = canvas.toDataURL('image/png')
    const downloadLink = document.createElement('a')
    downloadLink.href = pngUrl
    downloadLink.download = `table-${selectedTableForQR.name}-qr.png`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white border-[#e2e8f0]">
        <CardHeader>
          <CardTitle className="text-[#2d3748]">Add New Table</CardTitle>
          <CardDescription className="text-[#718096]">Create a new table for your restaurant</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            name="name"
            type="number"
            value={newTable.name}
            onChange={handleInputChange}
            placeholder="Table Name (e.g., 1 must be number)"
            className="bg-white border-[#e2e8f0] text-[#2d3748] placeholder-[#a0aec0]"
          />
          <Input
            name="capacity"
            type="number"
            
            onChange={handleInputChange}
            placeholder="Enter Capacity (e.g, 5)"
            
            className="bg-white border-[#e2e8f0] text-[#2d3748]"
          />
          {/* <Input
            name="seats"
            type="number"
            value={newTable.seats}
            onChange={handleInputChange}
            placeholder="Number of Seats"
            min={1}
            className="bg-white border-[#e2e8f0] text-[#2d3748]"
          /> */}
          <Select
            value={newTable.status}
            onValueChange={(value: Table['status']) => handleStatusChange(value)}
          >
            <SelectTrigger className="bg-white border-[#e2e8f0] text-[#2d3748]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-white border-[#e2e8f0]">
              <SelectItem value="available" className="text-[#2d3748]">Available</SelectItem>
              <SelectItem value="occupied" className="text-[#2d3748]">Occupied</SelectItem>
              <SelectItem value="reserved" className="text-[#2d3748]">Reserved</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddTable} className="bg-[#4299e1] text-white hover:bg-[#3182ce]">
            Add Table
          </Button>
        </CardFooter>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tables.map((table) => (
          <Card key={table.id} className="bg-white border-[#e2e8f0]">
            <CardHeader>
              <CardTitle className="text-[#2d3748]">{table.tableNumber}</CardTitle>
              <CardDescription className="text-[#718096]">
                Capacity: {table.seatingCapacity}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={table.isAvailable}
                onValueChange={(value: Table['status']) => onUpdateTable({ ...table, status: value })}
              >
                <SelectTrigger className="bg-white border-[#e2e8f0] text-[#2d3748]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#e2e8f0]">
                  <SelectItem value="available" className="text-[#2d3748]">Available</SelectItem>
                  <SelectItem value="occupied" className="text-[#2d3748]">Occupied</SelectItem>
                  <SelectItem value="reserved" className="text-[#2d3748]">Reserved</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="destructive" 
                onClick={() => onDeleteTable(table.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Table
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSelectedTableForQR(table)}
                className="border-[#c7a95d] text-[#c7a95d] hover:bg-[#2a2d3d]"
                disabled={!restaurant.isPublic}
              >
                <QrCode className="w-4 h-4 mr-2" />
                Show QR Code
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedTableForQR} onOpenChange={() => setSelectedTableForQR(null)}>
        <DialogContent className="bg-white border-black">
          <DialogHeader>
            <DialogTitle className="text-black">QR Code for {selectedTableForQR?.name}</DialogTitle>
            <DialogDescription className="text-[#a0aec0]">
              Scan this QR code to access the menu for this table
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            {selectedTableForQR && (
              <div className="bg-white p-4 rounded-lg">
                <QRCodeCanvas
                  id="table-qr-code"
                  value={getTableUrl(selectedTableForQR.id)}
                  size={200}
                  level="H"
                  includeMargin
                />
              </div>
            )}
            
            <Button 
              onClick={handleDownloadQR}
              className="bg-[#4299e1] text-white hover:bg-[#3182ce]"
            >
              Download QR Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

