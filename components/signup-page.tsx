'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import axios from 'axios' 
import { AxiosError } from 'axios' 
import { useToast } from '@/hooks/use-toast'
interface ApiResponse {
  message: string;
  
  // Add other properties as needed
}
export function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const {toast} = useToast()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/signup', { name, email, password, confirmPassword })
      console.log(response);
      
      toast({
        title: 'Success',
        description: response.data.message,
      })

      router.replace(`/verify/${response.data.data[0].email}`)
    } catch (error) {
      console.error('Error during sign-up:', error)
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message || 'There was a problem with your sign-up. Please try again.'

      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#2d3748]">Sign Up</CardTitle>
          <CardDescription className="text-center text-[#4a5568]">
            Create an account to start creating your menu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#4299e1] hover:bg-[#3182ce] text-white" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Sign Up'}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-[#4a5568] text-center w-full">
            Already have an account?{' '}
            <Link href="/login" className="text-[#4299e1] hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

