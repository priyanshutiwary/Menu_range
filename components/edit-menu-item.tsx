'use client'

import { useState } from 'react'
import { MenuItem } from '@/types/MenuTypes'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ImageUpload } from './image-upload'
import { toast } from 'sonner'

interface EditMenuItemProps {
  item: MenuItem
  isOpen: boolean
  onClose: () => void
  onSave: (updatedItem: MenuItem) => void
}

export function EditMenuItem({ item, isOpen, onClose, onSave }: EditMenuItemProps) {
  const [editedItem, setEditedItem] = useState<MenuItem>(item)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    try {
      setIsLoading(true)
      await onSave(editedItem)
      toast.success('Item updated successfully')
      onClose()
    } catch (error) {
      toast.error('Failed to update item')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Menu Item</SheetTitle>
          <SheetDescription>
            Make changes to your menu item here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={editedItem.name}
              onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
              placeholder="Item name"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editedItem.description}
              onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
              placeholder="Briefly describe the menu item"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
          <Label htmlFor="price">Display Order</Label>
            <Input
              id="displayOrder"
              type="number"
              step="1"
              value={editedItem.displayOrder}
              onChange={(e) => setEditedItem({ ...editedItem, displayOrder: parseFloat(e.target.value) })}
              placeholder=""
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="1"
              value={editedItem.price}
              onChange={(e) => setEditedItem({ ...editedItem, price: parseFloat(e.target.value) })}
              placeholder="0.00"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label>Photo</Label>
            <ImageUpload
              onImageUpload={(url) => setEditedItem({ ...editedItem, photoUrl: url })}
              currentImage={editedItem.photoUrl}
              itemId={editedItem.id}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

