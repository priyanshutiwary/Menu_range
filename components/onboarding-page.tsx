'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

export function OnboardingPage({ isUpdate = false }) {
  const { data: session } = useSession()
  const [restaurantName, setRestaurantName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [location, setLocation] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [cuisineType, setCuisineType] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [subdomain, setSubdomain] = useState('')
  const router = useRouter()
  const userId = session?.user?.id

  useEffect(() => {
    const fetchRestaurantData = async () => {
      if (isUpdate && userId) {
        try {
          const response = await fetch(`/api/setRestroProfile?userId=${userId}`, {
            method: 'GET'
          })
          const result = await response.json()
          if (result.success) {
            const restaurant = result.data
            setRestaurantName(restaurant.name)
            setOwnerName(restaurant.ownerName)
            setLocation(restaurant.location)
            setPhoneNumber(restaurant.phoneNumber)
            setCuisineType(restaurant.cuisineType)
            setIsPublic(restaurant.isPublic || false)
            setSubdomain(restaurant.subDomain || '')
          } else {
            toast.error(result.message || 'Failed to fetch restaurant data')
          }
        } catch (error) {
          console.error('Error fetching restaurant data:', error)
          toast.error('An error occurred while fetching restaurant data')
        }
      }
    }

    fetchRestaurantData()
  }, [isUpdate, userId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const restaurantData = { 
      userId: session?.user?.id,
      name: restaurantName,
      ownerName,
      location,
      phoneNumber,
      cuisineType,
    }

    try {
      const response = await fetch('/api/setRestroProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(restaurantData),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(isUpdate ? 'Profile updated successfully' : 'Profile created successfully')
        if (!isUpdate) {
          router.push('/create-menu')
        }
      } else {
        toast.error(result.message || 'An error occurred')
      }
    } catch (error) {
      console.error('Error submitting restaurant profile:', error)
      toast.error('An error occurred while submitting the profile')
    }
  }

  const handleTogglePublic = async () => {
    try {
      const response = await fetch('/api/publishMenu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: session?.user?.id, isPublic: !isPublic, action: 'toggle' }),
      })

      const result = await response.json()

      if (result.success) {
        setIsPublic(!isPublic)
        toast.success(`Menu is now ${!isPublic ? 'public' : 'private'}`)
      } else {
        toast.error(result.message || 'Failed to update public status')
      }
    } catch (error) {
      console.error('Error toggling public status:', error)
      toast.error('An error occurred while updating public status')
    }
  }

  const handlePublish = async () => {
    if (!isPublic || !subdomain) {
      toast.error('Please make sure the menu is public and a subdomain is provided.')
      return
    }

    try {
      const response = await fetch('/api/publishMenu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: session?.user?.id, subdomain, action: 'publish' }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Menu published successfully!')
      } else {
        toast.error(result.message || 'Failed to publish menu')
      }
    } catch (error) {
      console.error('Error publishing menu:', error)
      toast.error('An error occurred while publishing the menu')
    }
  }

  const handleSkip = () => {
    if (!isUpdate) {
      router.push('/create-menu')
    }
  }

  return (
    <div className={`${isUpdate ? '' : 'min-h-screen bg-[#f0f4f8] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'}`}>
      <div className={`${isUpdate ? '' : 'w-full max-w-md'}`}>
        {!isUpdate && (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#2d3748]">Welcome to MenuCreator</h2>
            <p className="text-[#4a5568]">Let's set up your restaurant profile (you can always update this later)</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="restaurantName">Restaurant Name</Label>
            <Input
              id="restaurantName"
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="ownerName">Owner Name</Label>
            <Input
              id="ownerName"
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="cuisineType">Cuisine Type</Label>
            <Select value={cuisineType} onValueChange={setCuisineType}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select cuisine type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="italian">Italian</SelectItem>
                <SelectItem value="chinese">Chinese</SelectItem>
                <SelectItem value="indian">Indian</SelectItem>
                <SelectItem value="mexican">Mexican</SelectItem>
                <SelectItem value="japanese">Japanese</SelectItem>
                <SelectItem value="american">American</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex space-x-4">
            <Button type="submit" className="flex-1 bg-[#4299e1] hover:bg-[#3182ce] text-white">
              {isUpdate ? 'Update Profile' : 'Complete Profile'}
            </Button>
            {!isUpdate && (
              <Button type="button" onClick={handleSkip} variant="outline" className="flex-1">
                Skip for Now
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isPublic"
              checked={isPublic}
              onCheckedChange={handleTogglePublic}
            />
            <Label htmlFor="isPublic">Make Menu Public</Label>
          </div>
          {isPublic && (
            <div>
              <Label htmlFor="subdomain">Subdomain</Label>
              <Input
                id="subdomain"
                type="text"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                placeholder="your-restaurant"
                className="mt-1"
              />
            </div>
          )}
          {isPublic && subdomain && (
            <Button type="button" onClick={handlePublish} className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white">
              Publish Menu
            </Button>
          )}
        </form>
        {!isUpdate && (
          <p className="mt-4 text-sm text-[#4a5568] text-center">
            You can update this information anytime from your profile settings
          </p>
        )}
      </div>
    </div>
  )
}

