export interface Restaurant {
    id: string
    name: string
    domain: string
    subdomain: string
    logo?: string
    theme: RestaurantTheme
    menu: Menu
  }
  
  export interface RestaurantTheme {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    backgroundColor: string
    fontFamily: string
    headerStyle: {
      fontSize: string
      fontWeight: string
      color: string
    }
    menuStyle: {
      sectionSpacing: string
      itemSpacing: string
      borderRadius: string
    }
  }
  
  export interface Menu {
    sections: MenuSection[]
  }
  
  export interface MenuSection {
    id: string
    name: string
    description?: string
    items: MenuItem[]
  }
  
  export interface MenuItem {
    id: string
    name: string
    description: string
    price: number
    image?: string
    dietary?: {
      vegetarian?: boolean
      vegan?: boolean
      glutenFree?: boolean
      spicy?: boolean
    }
  }
  
  