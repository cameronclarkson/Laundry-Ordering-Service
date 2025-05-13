import React, { useState, useEffect } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
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
  const { user } = useAuth()
  const [step, setStep] = useState<"info" | "payment" | "success">(user ? "payment" : "info")
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (open && user) setStep("payment")
    if (open && !user) setStep("info")
  }, [open, user])

  // Collect info and proceed to payment
  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Fetch payment intent client secret from your API
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: price * 100, email: formData.email, offer: offerDescription, name: formData.name, phone: formData.phone }),
      })
      const data = await res.json()
      setClientSecret(data.clientSecret)
      setStep("payment")
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  // Stripe payment form
  function StripePaymentForm({ onSuccess }: { onSuccess: () => void }) {
    const stripe = useStripe()
    const elements = useElements()
    const [processing, setProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setProcessing(true)
      setError(null)
      try {
        if (!stripe || !elements) {
          setError("Stripe not loaded")
          setProcessing(false)
          return
        }
        const cardElement = elements.getElement(CardElement)
        if (!cardElement) {
          setError("Card element not found")
          setProcessing(false)
          return
        }
        console.log("Confirming Stripe payment...")
        const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret!, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: formData.name || user?.user_metadata?.name || user?.email,
              email: formData.email || user?.email,
              phone: formData.phone || user?.user_metadata?.phone,
            },
          },
        })
        if (stripeError) {
          console.error("Stripe payment error:", stripeError)
          setError(stripeError.message || "Payment failed")
          setProcessing(false)
          return
        }
        if (paymentIntent && paymentIntent.status === "succeeded") {
          let justRegistered = false
          // Register user in Supabase if not logged in
          if (!user) {
            const randomPassword = Math.random().toString(36).slice(-10) + "!Aa1"
            console.log("Registering user in Supabase...")
            const { error: signUpError } = await supabase.auth.signUp({
              email: formData.email,
              password: randomPassword,
              options: {
                data: {
                  name: formData.name,
                  phone: formData.phone,
                },
                emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
              },
            })
            if (signUpError) {
              console.error("Supabase registration error:", signUpError)
              setError("Payment succeeded, but registration failed: " + signUpError.message)
              setProcessing(false)
              return
            }
            justRegistered = true
            // Do NOT attempt to log in automatically. Instruct user to check email.
            toast({
              title: "Account created!",
              description: "Please check your email to confirm your account before logging in.",
            })
            setStep("success")
            setProcessing(false)
            return
          }
          // Send order confirmation email
          try {
            console.log("Sending order confirmation email...")
            const emailRes = await fetch("/api/send-order-confirmation", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: formData.email || user?.email,
                name: formData.name || user?.user_metadata?.name || user?.email,
                offer: offerDescription,
                price,
              }),
            })
            if (!emailRes.ok) {
              const err = await emailRes.json()
              console.error("Order confirmation email error:", err)
            }
          } catch (emailError) {
            console.error("Order confirmation email exception:", emailError)
          }
          toast({
            title: "Order confirmed!",
            description: "A confirmation email has been sent.",
          })
          setStep("success")
          // Only redirect if user is already logged in
          if (user) {
            setTimeout(() => {
              console.log("Redirecting to customer dashboard...")
              router.push("/my-account")
            }, 1200)
          }
        } else {
          setError("Payment did not succeed")
        }
      } catch (err) {
        console.error("Order flow error:", err)
        setError("An unexpected error occurred. Please try again.")
      }
      setProcessing(false)
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <CardElement options={{ hidePostalCode: true }} className="p-3 border rounded-md bg-white" />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" className="w-full" disabled={processing}>{processing ? "Processing..." : `Pay $${price}`}</Button>
      </form>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Claim Special Offer</DialogTitle>
          <DialogDescription>{offerDescription}</DialogDescription>
        </DialogHeader>
        {step === "info" && !user && (
          <form onSubmit={handleInfoSubmit} className="space-y-4">
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
              <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Loading..." : "Continue to Payment"}</Button>
            </DialogFooter>
          </form>
        )}
        {step === "payment" && clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <StripePaymentForm onSuccess={() => setStep("success")}/>
          </Elements>
        )}
        {step === "success" && (
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Thank you for claiming the special offer!</h3>
            <p className="text-muted-foreground">
              Your payment was successful.<br />
              {user
                ? "You are logged in. Redirecting to your dashboard..."
                : "Your account has been created. Please check your email to confirm your account before logging in."
              }
            </p>
            <DialogClose asChild>
              <Button className="mt-6 w-full">Close</Button>
            </DialogClose>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 