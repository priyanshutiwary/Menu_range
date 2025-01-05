import { LandingPage } from '@/components/landing-page'
import { ErrorBoundary } from '@/components/error-boundary'

export default function Home() {
  return (
    <ErrorBoundary>
      <main>
        <LandingPage />
      </main>
    </ErrorBoundary>
  )
}