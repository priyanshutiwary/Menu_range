'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void
  currentImage?: string
}

export function ImageUpload({ onImageUpload, currentImage }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPreviewUrl(result)
        onImageUpload(result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-4">
      <Input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {previewUrl && (
        <div className="relative w-40 h-40">
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            className="object-cover rounded-md"
          />
        </div>
      )}
    </div>
  )
}

