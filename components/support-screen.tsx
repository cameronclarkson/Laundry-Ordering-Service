"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Send } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { startTransition } from "react"
import { submitSupportIssue } from "@/lib/actions"

interface SupportScreenProps {
  onBack: () => void
}

export function SupportScreen({ onBack }: SupportScreenProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      startTransition(async () => {
        const result = await submitSupportIssue(formData)
        
        if (result.success) {
          setIsSuccess(true)
          toast({
            title: "Support request submitted",
            description: "We'll get back to you as soon as possible.",
          })
        } else {
          setError(result.error || "Something went wrong. Please try again.")
          toast({
            title: "Error",
            description: result.error || "Failed to submit support request",
            variant: "destructive",
          })
        }
        setIsSubmitting(false)
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      setIsSubmitting(false)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to submit support request",
        variant: "destructive",
      })
    }
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
        {isSuccess ? (
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
            {error && <p className="text-destructive text-sm">{error}</p>}
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

