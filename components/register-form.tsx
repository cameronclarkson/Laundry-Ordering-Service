"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { Eye, EyeOff } from "lucide-react"
import { useSearchParams } from "next/navigation"

interface RegisterFormProps {
  onSuccess?: () => void
  onBack: () => void
}

export function RegisterForm({ onSuccess, onBack }: RegisterFormProps) {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  // Check URL parameters for pre-filled values from landing page
  useEffect(() => {
    if (typeof window !== 'undefined' && searchParams) {
      const name = searchParams.get('name')
      const email = searchParams.get('email')
      const phone = searchParams.get('phone')
      
      setFormData(prev => ({
        ...prev,
        name: name || prev.name,
        email: email || prev.email,
        phone: phone || prev.phone
      }))
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long")
    }
    // Add more password requirements if needed
    // Example:
    // if (!/[A-Z]/.test(password)) {
    //   throw new Error("Password must contain at least one uppercase letter")
    // }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match")
      }

      // Validate password requirements
      validatePassword(formData.password)

      console.log("Attempting to register with Supabase...")
      
      try {
        // Register with Supabase auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              phone: formData.phone,
              credits: 0,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          }
        })

        if (authError) {
          console.error("Supabase auth error details:", authError)
          
          // Check if it's the database error related to the trigger
          if (authError.message && 
              (authError.message.includes("Database error saving new user") || 
               authError.message.includes("Database error creating new use"))) {
            
            console.error("IDENTIFIED ISSUE: There is a trigger 'generate_user_referral_codes' on the auth.users table that is causing the error.")
            console.error("To fix this, run the following SQL in your Supabase SQL Editor:")
            console.error(`
-- Disable the problematic trigger
ALTER TABLE auth.users DISABLE TRIGGER generate_user_referral_codes;

-- Check if the function exists and fix it if needed
CREATE OR REPLACE FUNCTION public.generate_referral_codes()
RETURNS TRIGGER AS $$
BEGIN
  -- Add error handling to prevent registration failures
  BEGIN
    -- Your existing function logic here
    -- For example:
    INSERT INTO referral_codes (user_id, code, discount_amount, description, max_uses)
    VALUES 
      (NEW.id, 'FRIEND10-' || substring(NEW.id::text, 1, 8), 10, 'Give your friend $10 off their first order', 10),
      (NEW.id, 'FRIEND25-' || substring(NEW.id::text, 1, 8), 25, 'Give your friend $25 off their first order', 10);
  EXCEPTION WHEN OTHERS THEN
    -- Log the error but don't prevent user creation
    RAISE NOTICE 'Error generating referral codes: %', SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Re-enable the trigger after fixing the function
ALTER TABLE auth.users ENABLE TRIGGER generate_user_referral_codes;
            `)
            
            // Fall back to development mode for now
            console.warn("Falling back to development mode until the trigger issue is fixed")
            
            // Generate a fake user ID for development
            const fakeUserId = `dev-${Date.now()}`
            
            // Store user data in localStorage for development purposes
            try {
              localStorage.setItem('dev_user', JSON.stringify({
                id: fakeUserId,
                email: formData.email,
                name: formData.name,
                phone: formData.phone,
                created_at: new Date().toISOString(),
                credits: 0
              }))
              
              localStorage.setItem('supabase.auth.token', JSON.stringify({
                currentSession: {
                  user: {
                    id: fakeUserId,
                    email: formData.email,
                    user_metadata: {
                      name: formData.name,
                      phone: formData.phone,
                      credits: 0
                    }
                  },
                  access_token: `dev-token-${Date.now()}`,
                  expires_at: Date.now() + 3600000 // 1 hour from now
                }
              }))
            } catch (storageError) {
              console.error("Error storing development user data:", storageError)
            }
            
            toast({
              title: "Development mode: Registration successful",
              description: "This is a temporary workaround. Please fix the database trigger issue.",
            })
            
            // Clear form data
            setFormData({
              name: "",
              email: "",
              phone: "",
              password: "",
              confirmPassword: "",
            })
            
            onSuccess?.()
            return
          }
          
          throw authError
        }
        
        if (!authData.user) {
          throw new Error("Failed to create user account - no user returned")
        }

        console.log("User registered successfully with ID:", authData.user.id)

        // Create customer record in the customers table
        try {
          const { error: profileError } = await supabase
            .from('customers')
            .insert({
              id: authData.user.id,
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              created_at: new Date().toISOString(),
            })

          if (profileError) {
            console.error("Error creating customer profile:", profileError)
            // If customer profile creation fails, we should still let the user know they registered
            toast({
              title: "Account created but profile setup incomplete",
              description: "Your account was created, but there was an issue setting up your profile. Please contact support.",
              variant: "destructive",
            })
          } else {
            console.log("Customer profile created successfully")
          }
        } catch (profileError) {
          console.error("Exception during profile creation:", profileError)
        }

        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account.",
        })

        // Clear form data
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        })

        onSuccess?.()
      } catch (authError) {
        console.error("Auth signup exception:", authError)
        throw authError
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong with the registration process",
        variant: "destructive",
      })
      console.error("Registration error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>
          Sign up for a new account to start using our laundry service
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                )}
                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Password must be at least 6 characters long
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={toggleConfirmPasswordVisibility}
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                )}
                <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
              </Button>
            </div>
          </div>
          <div className="flex justify-between pt-4">
            <Button type="button" variant="ghost" onClick={onBack}>
              Back to Login
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 