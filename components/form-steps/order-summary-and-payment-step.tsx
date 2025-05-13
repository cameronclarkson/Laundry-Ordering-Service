"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"

const calculatePrice = (weight: string) => {
  const pricePerPound = 1.75
  const [min, max] = weight.split("-").map(Number)
  const averageWeight = max ? (min + max) / 2 : min
  return Math.max(averageWeight * pricePerPound, 17.5).toFixed(2)
}

interface OrderSummaryAndPaymentStepProps {
  formData: any
  errors: any
  onPaymentSuccess: () => void
}

export function OrderSummaryAndPaymentStep({ formData, errors, onPaymentSuccess }: OrderSummaryAndPaymentStepProps) {
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
    const clientSecret = (stripe as any)?._clientSecret || undefined
    if (!clientSecret) {
      setError("No payment intent available")
      setProcessing(false)
      return
    }
    const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
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
      onPaymentSuccess()
    } else {
      setError("Payment did not succeed")
    }
    setProcessing(false)
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {formData.name}
            </p>
            <p>
              <strong>Email:</strong> {formData.email}
            </p>
            <p>
              <strong>Phone:</strong> {formData.phone}
            </p>
            <p>
              <strong>Estimated Weight:</strong> {formData.weight}
            </p>
            <p>
              <strong>Estimated Price:</strong> ${calculatePrice(formData.weight)}
            </p>
            <p>
              <strong>Service Type:</strong> {formData.serviceType}
            </p>
            <p>
              <strong>Scheduling:</strong>{" "}
              {formData.schedulingOption === "asap" ? "ASAP" : `Preferred date: ${formData.scheduledDate}`}
            </p>
            <p>
              <strong>Address:</strong> {formData.addressLine1}, {formData.addressLine2 && `${formData.addressLine2}, `}
              {formData.city}, {formData.state} {formData.zipCode}
            </p>
            {formData.specialInstructions && (
              <p>
                <strong>Special Instructions:</strong> {formData.specialInstructions}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      <form onSubmit={handlePayment} className="space-y-6">
        <CardElement options={{ hidePostalCode: true }} className="p-3 border rounded-md bg-white" />
        {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
        <Button type="submit" className="w-full" disabled={processing}>
          {processing ? "Processing..." : "Pay Now"}
        </Button>
      </form>
    </div>
  )
}

