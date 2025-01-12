import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getRestaurantByDomain } from '@/lib/domain'
import { RestaurantMenu } from '@/components/subDomain/restaurant-menu'

interface DomainSlugPageProps {
  params: {
    domain: string
    slug: string
  }
}

export async function generateMetadata({ params }: DomainSlugPageProps): Promise<Metadata> {
  const restaurant = await getRestaurantByDomain(params.domain)
  console.log(params?.slug);
  
  if (!restaurant) {
    return {
      title: 'Restaurant Not Found',
    }
  }

  // Find the menu section that matches the slug
  const section = restaurant.menu.sections.find(
    section => section.name.toLowerCase().replace(/\s+/g, '-') === params.slug
  )

  const title = section
    ? `${section.name} - ${restaurant.name}`
    : `${params.slug} - ${restaurant.name}`

  const description = section
    ? `${section.name} menu items for ${restaurant.name}`
    : `${params.slug} menu for ${restaurant.name}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [restaurant.logo || '/placeholder.svg?height=600&width=600'],
    },
  }
}

export default async function DomainSlugPage({ params }: DomainSlugPageProps) {
  const restaurant = await getRestaurantByDomain(params.domain)

  if (!restaurant) {
    notFound()
  }

  // Find the menu section that matches the slug
  const section = restaurant.menu.sections.find(
    section => section.name.toLowerCase().replace(/\s+/g, '-') === params.slug
  )

  // If the section doesn't exist, you might want to show a 404 or redirect
  if (!section) {
    notFound()
  }

  return <RestaurantMenu 
    restaurant={restaurant} 
    initiallyExpandedSection={section.id}
  />
}

