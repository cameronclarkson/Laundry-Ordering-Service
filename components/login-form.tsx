"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { RegisterForm } from "./register-form"
import { Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  })
  const [resetEmail, setResetEmail] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(credentials.email, credentials.password)
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  // Forgot password handler
  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { supabase } = await import("@/lib/supabase")
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
      })
      if (error) throw error
      toast({
        title: "Password reset sent!",
        description: "Check your email for a link to reset your password.",
      })
      setShowForgot(false)
      setResetEmail("")
    } catch (error) {
      toast({
        title: "Reset failed",
        description: error instanceof Error ? error.message : "Could not send reset email",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (showRegister) {
    return <RegisterForm onBack={() => setShowRegister(false)} onSuccess={() => setShowRegister(false)} />
  }

  if (showForgot) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Forgot Password?</CardTitle>
          <CardDescription>Enter your email to receive a password reset link.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resetEmail">Email</Label>
              <Input
                id="resetEmail"
                name="resetEmail"
                type="email"
                required
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-2 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setShowForgot(false)}>
                Back to Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={credentials.email}
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
                value={credentials.password}
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
          </div>
          <div className="flex flex-col space-y-2 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowRegister(true)}>
              Don't have an account? Sign up
            </Button>
            <Button type="button" variant="link" className="text-blue-600 px-0" onClick={() => setShowForgot(true)}>
              Forgot password?
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

