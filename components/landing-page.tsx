'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, Edit, QrCode, ClipboardList } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-[#4299e1]">MenuCreator</span>
              </div>
            </div>
            <div className="flex items-center">
              <Link href="/login">
                <Button variant="ghost" className="text-[#4299e1]">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button className="ml-4 bg-[#4299e1] text-white hover:bg-[#3182ce]">Sign up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-[#2d3748] mb-6">
          Create Your Restaurant Menu with Ease
        </h1>
        <p className="text-xl text-[#4a5568] mb-8 max-w-2xl mx-auto">
          Design, customize, and manage your restaurant menu effortlessly with our intuitive Menu Creator.
        </p>
        <Link href="/signup">
          <Button className="bg-[#4299e1] hover:bg-[#3182ce] text-white text-lg px-8 py-3 rounded-full">
            Get Started <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-6 bg-white">
        <h2 className="text-3xl font-bold text-center text-[#2d3748] mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Edit className="h-10 w-10 text-[#4299e1]" />}
            title="Easy Menu Editing"
            description="Create and edit menu items with a user-friendly interface. Add descriptions, prices, and images effortlessly."
          />
          <FeatureCard
            icon={<QrCode className="h-10 w-10 text-[#4299e1]" />}
            title="QR Code Generation"
            description="Generate unique QR codes for each table, allowing customers to view your menu instantly on their devices."
          />
          <FeatureCard
            icon={<ClipboardList className="h-10 w-10 text-[#4299e1]" />}
            title="Order Management"
            description="Keep track of incoming orders, update order statuses, and manage your restaurant operations efficiently."
          />
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-16 px-4 md:px-6 bg-[#f0f4f8]">
        <h2 className="text-3xl font-bold text-center text-[#2d3748] mb-12">See It in Action</h2>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          <Image
            src="/placeholder.svg?height=600&width=800"
            alt="Restaurant Menu Creator Preview"
            width={800}
            height={600}
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 text-center bg-[#4299e1]">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Revolutionize Your Restaurant Menu?
        </h2>
        <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
          Join thousands of restaurants already using our Menu Creator to streamline their operations.
        </p>
        <Link href="/signup">
          <Button className="bg-white text-[#4299e1] hover:bg-[#e2e8f0] text-lg px-8 py-3 rounded-full">
            Start Creating Your Menu
          </Button>
        </Link>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="bg-white border-[#e2e8f0]">
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle className="text-xl font-semibold text-[#2d3748]">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-[#4a5568]">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

