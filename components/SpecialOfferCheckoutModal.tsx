import React, { useState } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
// Import your Stripe Elements wrapper (assume it's set up in your project)
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
// You may need to adjust the import path for your PaymentForm
// import PaymentForm from "./PaymentForm"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

interface SpecialOfferCheckoutModalProps {
  price: number
  offerDescription: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SpecialOfferCheckoutModal({ price, offerDescription, open, onOpenChange }: SpecialOfferCheckoutModalProps) {
  const [step, setStep] = useState<"register" | "payment" | "success">("register")
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  // Handle registration with Supabase magic link
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          data: { name: formData.name, phone: formData.phone },
          shouldCreateUser: true,
        },
      })
      if (error) throw error
      toast({ title: "Check your email!", description: "We've sent you a magic link to sign in." })
      // Optionally, you can wait for the user to click the link, or proceed to payment
      // For demo, proceed to payment
      // Fetch payment intent client secret from your API
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: price * 100, email: formData.email, offer: offerDescription }),
      })
      const data = await res.json()
      setClientSecret(data.clientSecret)
      setStep("payment")
    } catch (err: any) {
      toast({ title: "Registration error", description: err.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  // Payment form submission handler
  const handlePaymentSuccess = () => {
    setStep("success")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Claim Special Offer</DialogTitle>
          <DialogDescription>{offerDescription}</DialogDescription>
        </DialogHeader>
        {step === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" value={formData.phone} onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))} required />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Sending..." : "Continue to Payment"}</Button>
            </DialogFooter>
          </form>
        )}
        {step === "payment" && clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            {/* Replace with your actual payment form component */}
            {/* <PaymentForm onSuccess={handlePaymentSuccess} amount={price} /> */}
            <div className="text-center py-8">Stripe Payment Form Goes Here</div>
            <Button className="w-full mt-4" onClick={handlePaymentSuccess}>Simulate Payment Success</Button>
          </Elements>
        )}
        {step === "success" && (
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Thank you for claiming the special offer!</h3>
            <p className="text-muted-foreground">Check your email for your magic link and payment confirmation.</p>
            <DialogClose asChild>
              <Button className="mt-6 w-full">Close</Button>
            </DialogClose>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 