'use client'

import Image from 'next/image'
import { MenuItem } from '@/lib/menu'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useImageUrl } from './image-handler'
import { ErrorBoundary } from './error-boundary'
import { EditMenuItem } from './edit-menu-item'
import { formatPrice } from '@/lib/utils'
interface MenuItemCardProps {
  item: MenuItem
  onEdit: () => void
  onDelete: () => void
  handleUpdateMenuItem: (sectionId: string, updatedItem: MenuItem) => Promise<void>
}

export function MenuItemCard({ item, onEdit, onDelete, handleUpdateMenuItem }: MenuItemCardProps) {
  const imageUrl = useImageUrl(item.photoUrl)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleSave = async (updatedItem: MenuItem) => {
    await handleUpdateMenuItem(item.sectionId, updatedItem)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold mb-2">
          {formatPrice(item.price)}
          {/* ${item.price.toFixed(2)}  */}

        </p>
        <ErrorBoundary fallback={
          <div className="relative w-full h-40 mb-4 bg-muted flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Image unavailable</p>
          </div>
        }>
          <div className="relative w-full h-40 mb-4">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <img src="/path/to/loading-image.gif" alt="Loading..." />
              </div>
            )}
            {item.photoUrl ? (
              <Image
                src={imageUrl}
                alt={item.name}
                fill
                className="object-cover rounded-md"
                onLoadingComplete={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
              />
            ) : (
              <div className="w-full h-full bg-transparent" />
            )}
          </div>
        </ErrorBoundary>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            className="border-[#4299e1] text-[#4299e1] hover:bg-[#334155]"
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

      <EditMenuItem
        item={item}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
      />
    </Card>
  )
}

