"use client"

import { useEffect, useState } from "react"
import { RegisterForm } from "@/components/register-form"
import { useSearchParams } from "next/navigation"

export default function RegisterPage() {
  const [showRegistrationForm, setShowRegistrationForm] = useState(true)
  const searchParams = useSearchParams()

  // Handle registration success
  const handleRegistrationSuccess = () => {
    setShowRegistrationForm(false)
  }

  // Handle back button click
  const handleBack = () => {
    window.history.back()
  }

  // Pre-fill registration form with query parameters from landing page
  useEffect(() => {
    // This effect is only for client-side prefilling from URL params
    const name = searchParams.get('name')
    const email = searchParams.get('email')
    const phone = searchParams.get('phone')
    
    // These values will be used by the RegisterForm component
    // which should check for these URL parameters
  }, [searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {showRegistrationForm ? (
          <RegisterForm 
            onSuccess={handleRegistrationSuccess} 
            onBack={handleBack} 
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