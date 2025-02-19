"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Send } from "lucide-react"
import { useActionState } from "react"
import { submitSupportIssue } from "@/lib/actions"
import type React from "react" // Added import for React

interface SupportScreenProps {
  onBack: () => void
}

export function SupportScreen({ onBack }: SupportScreenProps) {
  const [state, formAction] = useActionState(submitSupportIssue, {
    success: false,
    error: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    await formAction(formData)
    setIsSubmitting(false)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <div className="flex items-center">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle>Support</CardTitle>
            <CardDescription>Send us your issue and we'll get back to you as soon as possible.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {state.success ? (
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Thank you for your message!</h3>
            <p className="text-muted-foreground">We've received your issue and will respond shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issue">Describe your issue</Label>
              <Textarea id="issue" name="issue" rows={5} required />
            </div>
            {state.error && <p className="text-destructive text-sm">{state.error}</p>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Sending..." : "Send"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

