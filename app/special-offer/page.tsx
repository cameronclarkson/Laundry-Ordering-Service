"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { ArrowRight, CheckCircle, Clock, Star, Shield, Sparkles, ArrowUpRight } from "lucide-react"
import Image from "next/image"
import { ZipCodeChecker } from "@/components/zip-code-checker"
import { CountdownTimer } from "@/components/countdown-timer"

export default function SpecialOfferPage() {
  const router = useRouter()
  const [showBookingForm, setShowBookingForm] = useState(false)
  
  // Set end date to 3 days from now
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + 3)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30" />
        </div>
        
        <div className="relative">
          <div className="container mx-auto px-4 pt-20 pb-16">
            <div className="max-w-4xl mx-auto text-center">
              {/* Trust Bar */}
              <div className="flex justify-center gap-8 mb-12">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>Satisfaction Guaranteed</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="h-5 w-5 text-blue-600" />
                  <span>4.9/5 from 2000+ reviews</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>24-48hr turnaround</span>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6">
                Refresh & Sanitize 
                <span className="text-blue-600"> 5 Comforters</span>
                <br />for Just $99
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Remove 99% of dust mites & allergens—delivered back to your door in 24–48 hrs
              </p>

              {/* Primary CTA Button */}
              <div className="mb-12">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xl py-8 px-12 rounded-full shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 group"
                  onClick={() => router.push("/register")}
                >
                  Book Your Cleaning Now - Save $100
                  <ArrowUpRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  Serving all Atlanta metro area ZIP codes (30000-31999)
                </p>
              </div>

              {/* Timer Bar */}
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-50 to-red-50 px-4 py-2 rounded-full text-orange-700 mb-12">
                <Clock className="h-5 w-5" />
                <span className="font-medium">Spring Special Ends in: </span>
                <div className="text-orange-800">
                  <CountdownTimer targetDate={endDate} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Left Column - Offer Details & Form */}
            <div>
              <Card className="border-2 border-blue-100 shadow-xl bg-white/50 backdrop-blur">
                <CardHeader className="border-b border-blue-50 bg-gradient-to-r from-blue-50 to-blue-50/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <CardTitle className="text-3xl font-bold text-blue-900">$99</CardTitle>
                      <CardDescription className="text-blue-700 text-lg">
                        <span className="line-through text-gray-500">$199</span>
                        {" "}Save $100 today
                      </CardDescription>
                    </div>
                    <div className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                      Limited Time
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      "Professional deep cleaning for up to 5 comforters",
                      "Free pickup & delivery included",
                      "Eco-friendly, hypoallergenic cleaning",
                      "100% satisfaction guarantee"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  {!showBookingForm ? (
                    <div className="space-y-4">
                      <label className="text-sm font-medium text-gray-700">Enter your ZIP code to get started</label>
                      <ZipCodeChecker />
                    </div>
                  ) : (
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg group"
                      onClick={() => router.push("/register")}
                    >
                      Book My Pickup Now 
                      <ArrowUpRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Button>
                  )}

                  {/* Trust Elements */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-500" />
                        <span>Satisfaction Guaranteed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-green-500" />
                        <span>Eco-Certified</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Proof */}
              <div className="mt-6">
                <div className="flex items-center gap-4 p-4 bg-white/50 backdrop-blur border border-gray-100 rounded-lg">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
                    ))}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      Joined 2,000+ customers who trust us with their comforters
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Social Proof & Benefits */}
            <div className="space-y-8">
              {/* Before/After Comparison */}
              <div className="relative aspect-[4/3] bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-400">Before/After Comparison</p>
                </div>
              </div>

              {/* Featured Reviews */}
              <div className="grid gap-4">
                {[
                  {
                    text: "My comforters came back looking and smelling amazing! The service was quick and professional.",
                    author: "Sarah M.",
                    location: "Verified Customer"
                  },
                  {
                    text: "Outstanding service! They picked up my comforters and returned them fresh and clean the next day.",
                    author: "James R.",
                    location: "Verified Customer"
                  }
                ].map((review, i) => (
                  <Card key={i} className="bg-white/50 backdrop-blur">
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-2">{review.text}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{review.author}</p>
                          <p className="text-xs text-gray-500">{review.location}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Process Section */}
          <div className="py-16 border-y border-gray-100">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  step: "1",
                  title: "Schedule Pickup",
                  description: "Book in 2 clicks - we'll handle the rest"
                },
                {
                  step: "2",
                  title: "Professional Cleaning",
                  description: "Deep clean & sanitize your comforters"
                },
                {
                  step: "3",
                  title: "Fast Delivery",
                  description: "Back to you in 24-48 hours"
                }
              ].map((step, i) => (
                <div key={i} className="relative text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-6">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                  {i < 2 && (
                    <ArrowRight className="absolute top-6 -right-6 w-12 h-6 text-gray-300 hidden md:block" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="py-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Common Questions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  q: "What types of comforters do you clean?",
                  a: "We expertly clean all types: down, synthetic, quilted, and decorative comforters of any size."
                },
                {
                  q: "How do you ensure quality?",
                  a: "Each comforter undergoes a 3-point inspection and is cleaned using eco-certified detergents."
                },
                {
                  q: "What if I'm not satisfied?",
                  a: "We'll re-clean for free or refund your money - no questions asked."
                },
                {
                  q: "How do I prepare my comforters?",
                  a: "Just have them ready for pickup - we'll handle everything else!"
                }
              ].map((faq, i) => (
                <div key={i} className="bg-white/50 backdrop-blur rounded-lg p-6 border border-gray-100">
                  <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready for Fresh, Clean Comforters?</h2>
            <p className="text-xl text-gray-600 mb-8">Limited time offer - Only 25 slots remaining!</p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white py-6 px-8 text-lg group"
              onClick={() => router.push("/register")}
            >
              Get My Comforters Fresh Now 
              <ArrowUpRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 p-4 shadow-lg backdrop-blur">
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 group"
          onClick={() => router.push("/register")}
        >
          Book Now - Save $100 
          <ArrowUpRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Button>
      </div>
    </div>
  )
} 