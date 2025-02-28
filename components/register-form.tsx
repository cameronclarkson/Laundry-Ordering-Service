"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"

interface RegisterFormProps {
  onSuccess?: () => void
  onBack: () => void
}

export function RegisterForm({ onSuccess, onBack }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
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

      // Register with Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
            credits: 0, // Initialize credits for the referral system
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      })

      if (authError) throw authError
      
      if (!authData.user) {
        throw new Error("Failed to create user account")
      }

      // Create customer record in the customers table
      const { error: profileError } = await supabase
        .from('customers')
        .insert([
          {
            id: authData.user.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            created_at: new Date().toISOString(),
          }
        ])

      if (profileError) {
        console.error("Error creating customer profile:", profileError)
        // If customer profile creation fails, we should still let the user know they registered
        // but log the error for debugging
        toast({
          title: "Account created but profile setup incomplete",
          description: "Your account was created, but there was an issue setting up your profile. Please contact support.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account.",
        })
      }

      // Clear form data
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      })

      onSuccess?.()
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
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
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <p className="text-sm text-muted-foreground">
              Password must be at least 6 characters long
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
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