import { notFound } from 'next/navigation';
import { getFullRestaurantData } from '@/lib/db';
import { RestaurantMenu } from '@/components/subDomain/restaurant-menu';

interface DomainPageProps {
  params: {
    domain: string;
  };
}

export default async function DomainPage({ params }: DomainPageProps) {
    console.log(params);
    
  const data = await getFullRestaurantData(params.domain);
  console.log(data);
  
  if (!data) {
    notFound();
  }

  const { restaurant, menuSections, tables } = data;

  return <RestaurantMenu restaurant={restaurant} menuSections={menuSections} tables={tables} />;
}

