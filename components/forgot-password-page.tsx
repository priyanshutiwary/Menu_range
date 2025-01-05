'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from 'next/navigation'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle the password reset logic
    console.log('Password reset requested for:', email)
    // For now, we'll just show an alert
    alert(`Password reset link sent to ${email}`)
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#2d3748]">Forgot Password</CardTitle>
          <CardDescription className="text-center text-[#4a5568]">
            Enter your email to receive a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
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
                />
              </div>
              <Button type="submit" className="w-full bg-[#4299e1] hover:bg-[#3182ce] text-white">
                Send Reset Link
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-[#4a5568] text-center w-full">
            Remember your password?{' '}
            <Link href="/login" className="text-[#4299e1] hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

