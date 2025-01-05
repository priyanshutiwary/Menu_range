'use client'

import { ErrorBoundary } from '@/components/error-boundary'
import MenuCreator from '@/components/menu-creator'
import { useState } from 'react'

export default function CreateMenuPage() {
  const [error, setError] = useState<Error | null>(null)

  if (error) {
    return <div>An error occurred: {error.message}</div>
  }

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-[#f0f4f8] py-8">
        <MenuCreator />
      </main>
    </ErrorBoundary>
  )
}

