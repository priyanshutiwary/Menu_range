'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Rocket, Stars, Timer, Users, Zap, Shield, Smartphone, PenTool, BarChart, Gift } from 'lucide-react'
import Link from "next/link"
import { useState } from "react"

export default function EarlyAccess() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 backdrop-blur-sm"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="bg-white/10 backdrop-blur-md fixed w-full z-20 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link href="/" className="flex-shrink-0 flex items-center">
                  <span className="text-2xl font-bold text-white">MenuCreator</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="pt-32 px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-6 py-2 mb-6 border border-white/20">
              <Stars className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="text-white font-medium">Limited Early Access - 50% Off Launch Price</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Transform Your Menu Management
            </h1>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join the revolution in restaurant menu management. Early access members receive exclusive lifetime benefits and shape the future of MenuCreator.
            </p>
          </div>

          {/* Early Access Form */}
          <Card className="max-w-xl mx-auto bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-8">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-white/90">
                      Reserve your spot now - Limited time offer
                    </label>
                    <div className="flex space-x-2">
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@restaurant.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        required
                      />
                      <Button 
                        type="submit"
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8"
                      >
                        <Rocket className="mr-2 h-5 w-5" />
                        Join Now
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-white/80 text-center">🔒 No credit card required. Cancel anytime.</p>
                </form>
              ) : (
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
                    <Stars className="h-8 w-8 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Welcome to the Future!</h3>
                  <p className="text-white/80">You've secured a spot in our early access program. We'll be in touch soon!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Video Demo Section */}
          <div className="max-w-6xl mx-auto mt-32 px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">See MenuCreator in Action</h2>
              <p className="text-xl text-white/80">Watch how easy it is to create and manage your digital menu</p>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  className="w-full h-[600px]"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&controls=1&rel=0&showinfo=0"
                  title="MenuCreator Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="max-w-7xl mx-auto mt-32 px-4">
            <h2 className="text-3xl font-bold text-center text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-center text-white/80 mb-16 max-w-2xl mx-auto">
              Everything you need to create and manage your restaurant menu efficiently
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<PenTool />}
                title="Drag & Drop Editor"
                description="Create beautiful menus with our intuitive drag & drop interface"
              />
              <FeatureCard
                icon={<Smartphone />}
                title="Mobile Optimized"
                description="Perfect viewing experience on all devices with QR code integration"
              />
              <FeatureCard
                icon={<Zap />}
                title="Real-time Updates"
                description="Update prices and items instantly across all your digital menus"
              />
              <FeatureCard
                icon={<Shield />}
                title="Secure Platform"
                description="Enterprise-grade security to protect your menu and customer data"
              />
              <FeatureCard
                icon={<BarChart />}
                title="Analytics Dashboard"
                description="Track menu performance and customer preferences"
              />
              <FeatureCard
                icon={<Gift />}
                title="Special Offers"
                description="Easily manage promotions and special menu items"
              />
            </div>
          </div>

          {/* Benefits Section */}
          <div className="max-w-4xl mx-auto mt-32 px-4 pb-24">
            <h2 className="text-3xl font-bold text-center text-white mb-4">Early Access Benefits</h2>
            <p className="text-xl text-center text-white/80 mb-16 max-w-2xl mx-auto">
              Join now and receive exclusive benefits forever
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <BenefitCard
                icon={<Timer />}
                title="Priority Access"
                description="Be the first to access new features and updates"
              />
              <BenefitCard
                icon={<Users />}
                title="50% Lifetime Discount"
                description="Lock in our best pricing forever"
              />
              <BenefitCard
                icon={<Stars />}
                title="VIP Support"
                description="Direct access to our support team 24/7"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group p-8 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300">
        <div className="text-blue-400">{icon}</div>
      </div>
      <h3 className="font-semibold text-white mb-2 text-lg">{title}</h3>
      <p className="text-white/80">{description}</p>
    </div>
  )
}

function BenefitCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center group">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 backdrop-blur-md">
        <div className="h-8 w-8 text-blue-400">{icon}</div>
      </div>
      <h3 className="font-semibold text-white mb-2 text-xl">{title}</h3>
      <p className="text-white/80">{description}</p>
    </div>
  )
}