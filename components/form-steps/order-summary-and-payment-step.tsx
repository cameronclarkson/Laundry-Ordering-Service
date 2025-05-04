"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const calculatePrice = (weight: string) => {
  const pricePerPound = 1.75
  const [min, max] = weight.split("-").map(Number)
  const averageWeight = max ? (min + max) / 2 : min
  return Math.max(averageWeight * pricePerPound, 17.5).toFixed(2)
}

export function OrderSummaryAndPaymentStep({ formData, errors, onSubmit }) {
  const [cardNumber, setCardNumber] = React.useState("")
  const [expiryDate, setExpiryDate] = React.useState("")
  const [cvc, setCvc] = React.useState("")
  const [error, setError] = React.useState(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handlePayNowClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!cardNumber || !expiryDate || !cvc) {
      setError("Please fill in all payment details")
      return
    }
    setError(null)
    setIsSubmitting(true)
    await onSubmit(e)
    setIsSubmitting(false)
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
      <div>
        <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="cvc">CVC</Label>
              <Input id="cvc" placeholder="123" value={cvc} onChange={(e) => setCvc(e.target.value)} />
            </div>
          </div>
        </div>
        {error && <div className="text-red-500 mt-4">{error}</div>}
        <Button onClick={handlePayNowClick} className="mt-6 w-full" variant="default" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </div>
  )
}

