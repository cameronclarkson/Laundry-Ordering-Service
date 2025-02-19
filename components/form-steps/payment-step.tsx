import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function PaymentStep({ formData, onPaymentSuccess, onSubmit }) {
  const [cardNumber, setCardNumber] = React.useState("")
  const [expiryDate, setExpiryDate] = React.useState("")
  const [cvc, setCvc] = React.useState("")
  const [processing, setProcessing] = React.useState(false)
  const [error, setError] = React.useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setProcessing(true)
    setError(null)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate a successful payment (you can add conditions to simulate failures as well)
    if (cardNumber && expiryDate && cvc) {
      onPaymentSuccess()
    } else {
      setError("Please fill in all payment details")
    }

    setProcessing(false)
  }

  return (
    <form onSubmit={onSubmit}>
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
      <Button type="submit" className="mt-6 w-full" disabled={processing}>
        {processing ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  )
}

