"use client"

import * as React from "react"
import { Card, CardTitle, CardHeader, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

export function LaundryOrderForm({ className }: React.ComponentProps<typeof Card>) {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    weight: "",
    serviceType: "pickup",
    address: "",
    specialInstructions: "",
  })
  const [errors, setErrors] = React.useState<any>({})
  const [step, setStep] = React.useState<"form" | "payment" | "success">("form")
  const [clientSecret, setClientSecret] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [paymentError, setPaymentError] = React.useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, weight: value })
  }

  const handleRadioChange = (value: string) => {
    setFormData({ ...formData, serviceType: value })
  }

  const validate = () => {
    const newErrors: any = {}
    if (!formData.name) newErrors.name = "Name is required"
    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.phone) newErrors.phone = "Phone is required"
    if (!formData.weight) newErrors.weight = "Weight is required"
    if (!formData.address) newErrors.address = "Address is required"
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setPaymentError(null)
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setIsLoading(true)
    try {
      // Calculate price (example: $1.75/lb, min $17.50)
      const [min, max] = formData.weight.split("-").map(Number)
      const averageWeight = max ? (min + max) / 2 : min
      const price = Math.max(averageWeight * 1.75, 17.5)
      // Create payment intent
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(price * 100),
          email: formData.email,
          offer: `Laundry Order: ${formData.weight} lbs, ${formData.serviceType}`,
          name: formData.name,
          phone: formData.phone,
        }),
      })
      const data = await res.json()
      if (!data.clientSecret) throw new Error(data.error || "Could not start payment")
      setClientSecret(data.clientSecret)
      setStep("payment")
    } catch (err: any) {
      setPaymentError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  function StripePaymentForm({ onSuccess }: { onSuccess: () => void }) {
    const stripe = useStripe()
    const elements = useElements()
    const [processing, setProcessing] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const handlePayment = async (e: React.FormEvent) => {
      e.preventDefault()
      setProcessing(true)
      setError(null)
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
      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret!, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
        },
      })
      if (stripeError) {
        setError(stripeError.message || "Payment failed")
        setProcessing(false)
        return
      }
      if (paymentIntent && paymentIntent.status === "succeeded") {
        onSuccess()
      } else {
        setError("Payment did not succeed")
      }
      setProcessing(false)
    }

    return (
      <form onSubmit={handlePayment} className="space-y-6">
        <CardElement options={{ hidePostalCode: true }} className="p-3 border rounded-md bg-white" />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" className="w-full" disabled={processing}>{processing ? "Processing..." : "Pay Now"}</Button>
      </form>
    )
  }

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader>
        <CardTitle>Laundry Wash & Fold Order</CardTitle>
        <CardDescription>Place your order for our convenient laundry service.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {step === "form" && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="group/field grid gap-2" data-invalid={!!errors?.name}>
              <Label htmlFor="name" className="group-data-[invalid=true]/field:text-destructive">
                Name <span aria-hidden="true">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
                value={formData.name}
                onChange={handleChange}
                aria-invalid={!!errors?.name}
                aria-errormessage="error-name"
              />
              {errors?.name && (
                <p id="error-name" className="text-destructive text-sm">
                  {errors.name}
                </p>
              )}
            </div>
            <div className="group/field grid gap-2" data-invalid={!!errors?.email}>
              <Label htmlFor="email" className="group-data-[invalid=true]/field:text-destructive">
                Email <span aria-hidden="true">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={!!errors?.email}
                aria-errormessage="error-email"
              />
              {errors?.email && (
                <p id="error-email" className="text-destructive text-sm">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="group/field grid gap-2" data-invalid={!!errors?.phone}>
              <Label htmlFor="phone" className="group-data-[invalid=true]/field:text-destructive">
                Phone <span aria-hidden="true">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="(123) 456-7890"
                className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
                value={formData.phone}
                onChange={handleChange}
                aria-invalid={!!errors?.phone}
                aria-errormessage="error-phone"
              />
              {errors?.phone && (
                <p id="error-phone" className="text-destructive text-sm">
                  {errors.phone}
                </p>
              )}
            </div>
            <div className="group/field grid gap-2" data-invalid={!!errors?.weight}>
              <Label htmlFor="weight" className="group-data-[invalid=true]/field:text-destructive">
                Estimated Weight (lbs) <span aria-hidden="true">*</span>
              </Label>
              <Select name="weight" value={formData.weight} onValueChange={handleSelectChange}>
                <SelectTrigger className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive">
                  <SelectValue placeholder="Select estimated weight" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-10">0-10 lbs</SelectItem>
                  <SelectItem value="11-20">11-20 lbs</SelectItem>
                  <SelectItem value="21-30">21-30 lbs</SelectItem>
                  <SelectItem value="31+">31+ lbs</SelectItem>
                </SelectContent>
              </Select>
              {errors?.weight && (
                <p id="error-weight" className="text-destructive text-sm">
                  {errors.weight}
                </p>
              )}
            </div>
            <div className="group/field grid gap-2" data-invalid={!!errors?.serviceType}>
              <Label className="group-data-[invalid=true]/field:text-destructive">
                Service Type <span aria-hidden="true">*</span>
              </Label>
              <RadioGroup name="serviceType" value={formData.serviceType} onValueChange={handleRadioChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup">Pick Up</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery">Delivery</Label>
                </div>
              </RadioGroup>
              {errors?.serviceType && (
                <p id="error-serviceType" className="text-destructive text-sm">
                  {errors.serviceType}
                </p>
              )}
            </div>
            <div className="group/field grid gap-2" data-invalid={!!errors?.address}>
              <Label htmlFor="address" className="group-data-[invalid=true]/field:text-destructive">
                Address <span aria-hidden="true">*</span>
              </Label>
              <Textarea
                id="address"
                name="address"
                placeholder="Enter your address"
                className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
                value={formData.address}
                onChange={handleChange}
                aria-invalid={!!errors?.address}
                aria-errormessage="error-address"
              />
              {errors?.address && (
                <p id="error-address" className="text-destructive text-sm">
                  {errors.address}
                </p>
              )}
            </div>
            <div className="group/field grid gap-2" data-invalid={!!errors?.specialInstructions}>
              <Label htmlFor="specialInstructions" className="group-data-[invalid=true]/field:text-destructive">
                Special Instructions
              </Label>
              <Textarea
                id="specialInstructions"
                name="specialInstructions"
                placeholder="Any special instructions for your order?"
                className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
                value={formData.specialInstructions}
                onChange={handleChange}
                aria-invalid={!!errors?.specialInstructions}
                aria-errormessage="error-specialInstructions"
              />
              {errors?.specialInstructions && (
                <p id="error-specialInstructions" className="text-destructive text-sm">
                  {errors.specialInstructions}
                </p>
              )}
            </div>
            {paymentError && <div className="text-red-500 text-sm">{paymentError}</div>}
            <Button type="submit" size="sm" disabled={isLoading}>
              {isLoading ? "Placing Order..." : "Continue to Payment"}
            </Button>
          </form>
        )}
        {step === "payment" && clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <StripePaymentForm onSuccess={() => setStep("success")} />
          </Elements>
        )}
        {step === "success" && (
          <div className="text-center py-8">
            <Check className="size-8 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Thank you for your order!</h3>
            <p className="text-muted-foreground">Your payment was successful. We will contact you soon to schedule your pickup.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

