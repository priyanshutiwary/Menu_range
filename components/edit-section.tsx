'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {MenuSection} from '@/types/MenuTypes'
interface EditSectionProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { name: string; description?: string }) => void
  initialData?: {
    name: string
    description?: string
  }
}

export function EditSection({ isOpen, onClose, onSave, initialData }: EditSectionProps) {
    console.log("hello baby",initialData);
    
  const [isLoading, setIsLoading] = useState(false)
  const [editedSection, setEditedSection] = useState<MenuSection>(initialData)

  const handleSave = async () => {
    if (!editedSection.name.trim()) {
      toast.error('Section name is required')
      return
    }

    try {
      setIsLoading(true)
      await onSave(editedSection)
      toast.success('Section updated successfully')
      onClose()
    } catch (error) {
      toast.error('Failed to update section')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>Edit Section</SheetTitle>
          <SheetDescription>
            Make changes to your section here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={editedSection.name}
              onChange={(e) => setEditedSection({ ...editedSection, name: e.target.value })}
              placeholder="Section name"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editedSection.description}
              onChange={(e) => setEditedSection({ ...editedSection, description: e.target.value })}
              placeholder="Section description"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
          <Label htmlFor="price">Display Order</Label>
            <Input
              id="displayOrder"
              type="number"
              step="1"
              value={editedSection.displayOrder}
              onChange={(e) => setEditedSection({ ...editedSection, displayOrder: parseFloat(e.target.value) })}
              placeholder=""
              disabled={isLoading}
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