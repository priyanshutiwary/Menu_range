'use client'

import Image from 'next/image'
import { MenuItem } from '@/lib/validations/menu'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useImageUrl } from './image-handler'
import { ErrorBoundary } from './error-boundary'

interface MenuItemCardProps {
  item: MenuItem
  onEdit: () => void
  onDelete: () => void
}

export function MenuItemCard({ item, onEdit, onDelete }: MenuItemCardProps) {
  const imageUrl = useImageUrl(item.photoUrl)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold mb-2">
          ${item.price.toFixed(2)}
        </p>
        {item.photoUrl && (
          <ErrorBoundary fallback={
            <div className="relative w-full h-40 mb-4 bg-muted flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Image unavailable</p>
            </div>
          }>
            <div className="relative w-full h-40 mb-4">
              <Image
                src={imageUrl}
                alt={item.name}
                fill
                className="object-cover rounded-md"
              />
            </div>
          </ErrorBoundary>
        )}
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

