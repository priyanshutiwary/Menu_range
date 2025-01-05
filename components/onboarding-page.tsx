'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function OnboardingPage({ isUpdate = false }) {
  const [restaurantName, setRestaurantName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [location, setLocation] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [cuisineType, setCuisineType] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Load existing data if available
    const savedDetails = localStorage.getItem('restaurantDetails')
    if (savedDetails) {
      const parsedDetails = JSON.parse(savedDetails)
      setRestaurantName(parsedDetails.restaurantName || '')
      setOwnerName(parsedDetails.ownerName || '')
      setLocation(parsedDetails.location || '')
      setPhoneNumber(parsedDetails.phoneNumber || '')
      setCuisineType(parsedDetails.cuisineType || '')
    } else {
      // If no saved data, initialize with empty strings
      localStorage.setItem('restaurantDetails', JSON.stringify({
        restaurantName: '',
        ownerName: '',
        location: '',
        phoneNumber: '',
        cuisineType: ''
      }))
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Save the data to local storage
    localStorage.setItem('restaurantDetails', JSON.stringify({ restaurantName, ownerName, location, phoneNumber, cuisineType }))
    
    if (isUpdate) {
      toast.success('Profile updated successfully')
    } else {
      router.push('/create-menu')
    }
  }

  const handleSkip = () => {
    // Set default empty values in localStorage
    localStorage.setItem('restaurantDetails', JSON.stringify({
      restaurantName: '',
      ownerName: '',
      location: '',
      phoneNumber: '',
      cuisineType: ''
    }))
    
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

