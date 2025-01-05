import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Table } from '../types/MenuTypes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TableManagerProps {
  tables: Table[];
  onAddTable: (table: Table) => void;
  onUpdateTable: (table: Table) => void;
  onDeleteTable: (tableId: string) => void;
}

export function TableManager({ tables, onAddTable, onUpdateTable, onDeleteTable }: TableManagerProps) {
  const [newTable, setNewTable] = useState<Omit<Table, 'id'>>({
    name: '',
    capacity: 1,
    status: 'available',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewTable(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 1 : value,
    }))
  }

  const handleStatusChange = (status: Table['status']) => {
    setNewTable(prev => ({ ...prev, status }))
  }

  const handleAddTable = () => {
    if (newTable.name) {
      onAddTable({ ...newTable, id: uuidv4() })
      setNewTable({ name: '', capacity: 1, status: 'available' })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Table</CardTitle>
          <CardDescription>Create a new table for your restaurant</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            name="name"
            value={newTable.name}
            onChange={handleInputChange}
            placeholder="Table Name (e.g., Table 1)"
          />
          <Input
            name="capacity"
            type="number"
            value={newTable.capacity}
            onChange={handleInputChange}
            placeholder="Capacity"
            min={1}
          />
          <Select
            value={newTable.status}
            onValueChange={(value: Table['status']) => handleStatusChange(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddTable}>Add Table</Button>
        </CardFooter>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tables.map((table) => (
          <Card key={table.id}>
            <CardHeader>
              <CardTitle>{table.name}</CardTitle>
              <CardDescription>Capacity: {table.capacity}</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={table.status}
                onValueChange={(value: Table['status']) => onUpdateTable({ ...table, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" onClick={() => onDeleteTable(table.id)}>Delete Table</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

