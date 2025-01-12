import ThemeProvider  from "@/components/subDomain/theme-provider"
import { getRestaurantBySubdomain } from "@/lib/db"
import { notFound } from "next/navigation"

interface DomainLayoutProps {
  children: React.ReactNode
  params: {
    domain: string,
    id:string
  }
}

export default async function DomainLayout({ children, params }: DomainLayoutProps) {
  
  const restaurant = await getRestaurantBySubdomain(params.domain)

  if (!restaurant) {
    notFound()
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}

