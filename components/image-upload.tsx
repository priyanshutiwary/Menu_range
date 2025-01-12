'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { ImageIcon, X } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  onImageUpload: (url: string) => void
  currentImage?: string
}

export function ImageUpload({ onImageUpload, currentImage,itemId }: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('itemId', itemId); // Append itemId to the form data

      const response = await fetch('/api/itemImage', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }
      


      const data = await response.json()
      onImageUpload(data.url)
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setIsLoading(false)
    }
  }, [onImageUpload])

  const handleRemove = useCallback(() => {
    onImageUpload('')
  }, [onImageUpload])

  return (
    <div className="flex flex-col items-center gap-4">
      {currentImage ? (
        <div className="relative w-40 h-40">
          <Image
            src={currentImage}
            alt="Uploaded image"
            className="object-cover rounded-md"
            fill
          />
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="w-40 h-40 flex items-center justify-center border-2 border-dashed rounded-md">
          <ImageIcon className="h-10 w-10 text-gray-400" />
        </div>
      )}
      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          className="relative"
          onClick={() => document.getElementById('imageUpload')?.click()}
        >
          {isLoading ? 'Uploading...' : 'Upload Image'}
          <input
            id="imageUpload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={isLoading}
          />
        </Button>
      </div>
    </div>
  )
}