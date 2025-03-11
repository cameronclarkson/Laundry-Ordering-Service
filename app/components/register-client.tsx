"use client"

import { useState, useEffect } from "react"
import { RegisterForm } from "@/components/register-form"

export default function RegisterClient() {
  const [showRegistrationForm, setShowRegistrationForm] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  
  // Extract URL parameters only on the client side
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      try {
        const searchParams = new URLSearchParams(window.location.search)
        const name = searchParams.get('name')
        const email = searchParams.get('email')
        const phone = searchParams.get('phone')
        
        if (name || email || phone) {
          setFormData({
            name: name || "",
            email: email || "",
            phone: phone || ""
          })
        }
      } catch (error) {
        console.error("Error parsing search params:", error)
      }
    }
  }, [])

  // Handle registration success
  const handleRegistrationSuccess = () => {
    setShowRegistrationForm(false)
  }

  // Handle back button click
  const handleBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {showRegistrationForm ? (
          <RegisterForm 
            onSuccess={handleRegistrationSuccess} 
            onBack={handleBack}
            initialData={formData}
          />
        ) : (
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Registration Successful!</h2>
            <p className="mt-2 text-sm text-gray-600">
              Thank you for registering. You can now log in to your account.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}