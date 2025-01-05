'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const result = await signIn('credentials', {
        redirect: false,
        email: email,
        password: password,
      })
      console.log(result);
      

      if (result?.error) {
        toast({
          title: 'Login Failed',
          description: result.error === 'CredentialsSignin' 
            ? 'Incorrect email or password'
            : result.error,
          variant: 'destructive',
        })
        setIsLoading(false)
        return
      }

      if (result?.ok) {
        // Wait for a moment before redirecting
        await new Promise(resolve => setTimeout(resolve, 100))
        // Redirect to create-menu page
        window.location.href = '/create-menu'
      }
    } catch (error) {
      setIsLoading(false)
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#2d3748]">Login</CardTitle>
          <CardDescription className="text-center text-[#4a5568]">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#4299e1] hover:bg-[#3182ce] text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Log In'}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link href="/forgot-password" className="text-sm text-[#4299e1] hover:underline">
            Forgot your password?
          </Link>
          <div className="text-sm text-[#4a5568]">
            Don't have an account?{' '}
            <Link href="/signup" className="text-[#4299e1] hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}