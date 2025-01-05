import { useState, useEffect } from 'react'

export function useImageUrl(imageUrl: string | undefined) {
  const [processedUrl, setProcessedUrl] = useState<string>('/placeholder.svg?height=160&width=240')

  useEffect(() => {
    if (!imageUrl) return

    if (imageUrl.startsWith('data:')) {
      // For data URLs, use them directly
      setProcessedUrl(imageUrl)
    } else if (imageUrl.startsWith('blob:')) {
      // For blob URLs, use a placeholder
      setProcessedUrl('/placeholder.svg?height=160&width=240')
    } else {
      // For regular URLs, use them directly
      setProcessedUrl(imageUrl)
    }
  }, [imageUrl])

  return processedUrl
}

