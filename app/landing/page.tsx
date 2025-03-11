"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { ArrowRight, WashingMachine, Clock, ThumbsUp, Phone, Shirt, Droplets, Timer, Star, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function LandingPage() {
  const [landingContent, setLandingContent] = useState({
    title: "Fresh Clothes, Zero Effort",
    subtitle: "Professional laundry service, delivered to your door",
    description: "Let us handle your laundry while you focus on what matters most. Professional cleaning, pickup & delivery, all at affordable prices.",
    ctaText: "Schedule Pickup",
  })
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchLandingContent = async () => {
      try {
        const { data, error } = await supabase
          .from('landing_page_content')
          .select('*')
          .eq('id', 1)
          .single()
        
        if (error) throw error
        
        if (data) {
          setLandingContent({
            title: data.title,
            subtitle: data.subtitle,
            description: data.description,
            ctaText: data.cta_text,
          })
        }
      } catch (error) {
        console.error("Error fetching landing page content:", error)
      }
    }

    fetchLandingContent()
  }, [])

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Store lead in database
      const { data, error } = await supabase
        .from('leads')
        .insert([{ name, email, phone, source: 'facebook_campaign' }])
      
      if (error) throw error

      // Show success message
      toast({
        title: "Success!",
        description: "Thank you for your interest. We'll be in touch soon!",
      })

      // Clear form
      setName("")
      setEmail("")
      setPhone("")
      
      // Redirect to registration page with prefilled data
      window.location.href = `/register?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Testimonials data
  const testimonials = [
    {
      quote: "I've been using this laundry service for over a year now, and I'm consistently impressed with the quality. My clothes always come back perfectly clean and neatly folded.",
      name: "Sarah Johnson",
      location: "Downtown",
    },
    {
      quote: "The stain removal service is incredible! They managed to get out a red wine stain I thought would ruin my favorite shirt. Highly recommend!",
      name: "Michael Rodriguez",
      location: "Westside",
    },
    {
      quote: "The pickup and delivery service has been a game-changer for my busy schedule. Professional, punctual, and the quality is outstanding.",
      name: "Emily Watson",
      location: "Northside",
    },
  ]

  // Pricing tiers
  const pricingTiers = [
    {
      name: "Basic Wash",
      price: "$49/month",
      description: "Perfect for individuals with minimal laundry needs",
      features: [
        "Weekly Pickup",
        "Standard Washing",
        "48-Hour Turnaround",
      ],
    },
    {
      name: "Premium Clean",
      price: "$89/month",
      description: "Ideal for families and busy professionals",
      features: [
        "Bi-Weekly Pickup",
        "Premium Washing",
        "24-Hour Turnaround",
        "Stain Treatment",
      ],
      highlight: true,
    },
    {
      name: "Business Service",
      price: "$149/month",
      description: "Complete solution for businesses and large families",
      features: [
        "Daily Pickup",
        "Executive Washing",
        "Same-Day Turnaround",
        "Ironing & Folding",
      ],
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">Laundry Service</div>
        <Link href="/login">
          <Button variant="outline">Login</Button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-24 px-4 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-7xl flex flex-col gap-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="flex flex-col gap-6">
              {/* Badge */}
              <Badge variant="outline" className="w-fit gap-2">
                <span className="text-muted-foreground">Professional Laundry Services</span>
              </Badge>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                {landingContent.title}
              </h1>
              
              <p className="text-xl text-gray-600">
                {landingContent.subtitle}
              </p>
              
              <p className="text-gray-600 leading-relaxed">
                {landingContent.description}
              </p>

              {/* Actions for mobile */}
              <div className="flex flex-col space-y-4 md:hidden">
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {landingContent.ctaText} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Lead Capture Form */}
            <div>
              <Card className="border-2 border-blue-100 shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4 text-center">Get Started Today</h2>
                  <p className="text-muted-foreground text-center mb-6">Sign up for your first laundry pickup and enjoy 20% off your first order.</p>
                  <form id="lead-form" onSubmit={handleLeadSubmit} className="space-y-4">
                    <div>
                      <Input
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="tel"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : landingContent.ctaText} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-semibold text-center mb-12">Why Choose Our Laundry Service?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <WashingMachine className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Professional Quality</h3>
              <p className="text-gray-600">Expert cleaning that treats your clothes with care and returns them fresh and spotless.</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Time-Saving</h3>
              <p className="text-gray-600">Free pickup and delivery service that fits your schedule, saving you precious time.</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <ThumbsUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Satisfaction Guaranteed</h3>
              <p className="text-gray-600">If you're not completely satisfied, we'll re-clean your items at no additional cost.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied customers have to say about our laundry services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <Star 
                      key={i} 
                      className="h-4 w-4 text-yellow-400" 
                      fill="currentColor"
                    />
                  ))}
                </div>
                
                <p className="text-gray-600 mb-6">"{testimonial.quote}"</p>
                
                <div className="flex items-center gap-3 mt-auto">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">{testimonial.name}</h5>
                    <p className="text-xs text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <Badge className="mb-2">Pricing</Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fresh & Clean Laundry Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the perfect laundry package for your needs. All services include free pickup and delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={`relative rounded-xl border ${
                  tier.highlight 
                    ? "border-blue-200 bg-blue-50 shadow-xl" 
                    : "border-gray-200 bg-white shadow-md"
                } hover:shadow-lg transition-all`}
              >
                {tier.highlight && (
                  <div className="absolute -top-4 left-6">
                    <Badge className="px-4 py-1.5 bg-blue-600 text-white">Most Popular</Badge>
                  </div>
                )}

                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${tier.highlight ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}>
                      {index === 0 ? (
                        <Shirt className="w-6 h-6" />
                      ) : index === 1 ? (
                        <Droplets className="w-6 h-6" />
                      ) : (
                        <Timer className="w-6 h-6" />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {tier.name}
                    </h3>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {tier.price}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {tier.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="mt-1 text-green-600">
                          <Check className="w-4 h-4" />
                        </div>
                        <div className="text-sm text-gray-600">
                          {feature}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <Button
                      className={`w-full ${
                        tier.highlight
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : ""
                      }`}
                      variant={tier.highlight ? "default" : "outline"}
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-2xl font-semibold mb-4">Questions? We're Here to Help</h2>
          <p className="text-gray-600 mb-6">Our customer service team is available 7 days a week</p>
          <Button variant="outline" size="lg" className="gap-2">
            <Phone className="h-4 w-4" />
            Contact Us
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Laundry Service</h3>
              <p className="text-gray-400">Making laundry simple and hassle-free with our professional services.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
              <p className="text-gray-400">Email: info@laundryservice.com</p>
              <p className="text-gray-400">Phone: (555) 123-4567</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Hours</h3>
              <p className="text-gray-400">Monday - Friday: 8am - 8pm</p>
              <p className="text-gray-400">Saturday: 9am - 6pm</p>
              <p className="text-gray-400">Sunday: Closed</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Laundry Service. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 