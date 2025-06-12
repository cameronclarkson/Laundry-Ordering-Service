"use client"

import * as React from "react"
import { useActionState, useTransition } from "react"
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { laundryOrderFormAction } from "@/lib/actions"
import { CustomerInfoStep } from "./form-steps/customer-info-step"
import { OrderDetailsStep } from "./form-steps/order-details-step"
import { AddressInstructionsStep } from "./form-steps/address-instructions-step"
import { OrderSummaryAndPaymentStep } from "./form-steps/order-summary-and-payment-step"
import { SuccessScreen } from "./form-steps/success-screen"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { Check } from "lucide-react"

interface MultiStepLaundryOrderFormProps extends React.ComponentProps<typeof Card> {
  onBack?: () => void
}

interface LaundryOrderFormState {
  name: string
  email: string
  phone: string
  weight: string
  serviceType: string
  schedulingOption: string
  scheduledDate: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  zipCode: string
  detergent: string
  waterTemp: string
  dryTemp: string
  bleachOption: string
  fabricSoftener: boolean
  dryerSheets: boolean
  scent: string
  specialInstructions: string
  success: boolean
  errors: any
  confirmationMessage: string
  orderTotal: string
}

const initialState = {
  name: "",
  email: "",
  phone: "",
  weight: "",
  serviceType: "delivery",
  schedulingOption: "asap",
  scheduledDate: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zipCode: "",
  detergent: "",
  waterTemp: "",
  dryTemp: "",
  bleachOption: "",
  fabricSoftener: false,
  dryerSheets: false,
  scent: "unscented",
  specialInstructions: "",
  success: false,
  errors: null,
  confirmationMessage: "",
  orderTotal: "",
}

const STEPS = [
  { title: "Customer Information", description: "Enter your contact details" },
  { title: "Order Details", description: "Specify your laundry order" },
  { title: "Address & Instructions", description: "Provide delivery information" },
  { title: "Review & Payment", description: "Review your order and complete payment" },
]

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

export function MultiStepLaundryOrderForm({ className, onBack }: MultiStepLaundryOrderFormProps) {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = React.useState(0)
  const [formData, setFormData] = React.useState<LaundryOrderFormState>({ ...initialState })
  const [errors, setErrors] = React.useState<any>({})
  const [step, setStep] = React.useState<"form" | "payment" | "success">("form")
  const [clientSecret, setClientSecret] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [paymentError, setPaymentError] = React.useState<string | null>(null)

  const steps = user
    ? [
        { title: "Order Details", description: "Specify your laundry order" },
        { title: "Address & Instructions", description: "Provide delivery information" },
        { title: "Review & Payment", description: "Review your order and complete payment" },
      ]
    : STEPS

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      setCurrentStep(stepIndex)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | { target: { name: string; value: any } }) => {
    console.log("handleInputChange called with:", e.target.name, e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateStep = (stepIndex: number) => {
    const newErrors: any = {}
    let actualStepIndex = stepIndex
    if (user) {
      actualStepIndex = stepIndex + 1 // Adjust index for logged-in users, as they skip CustomerInfoStep
    }

    if (actualStepIndex === 0) { // Customer Information
      if (!formData.name) newErrors.name = "Name is required"
      if (!formData.email) newErrors.email = "Email is required"
      if (!formData.phone) newErrors.phone = "Phone is required"
    } else if (actualStepIndex === 1) { // Order Details
      if (!formData.weight) newErrors.weight = "Weight is required"
    } else if (actualStepIndex === 2) { // Address & Instructions
      if (!formData.addressLine1) newErrors.addressLine1 = "Address is required"
      if (!formData.city) newErrors.city = "City is required"
      if (!formData.state) newErrors.state = "State is required"
      if (!formData.zipCode) newErrors.zipCode = "ZIP code is required"
      if (!formData.detergent) newErrors.detergent = "Detergent is required"
      if (!formData.waterTemp) newErrors.waterTemp = "Water temperature is required"
      if (!formData.dryTemp) newErrors.dryTemp = "Dryer temperature is required"
      if (!formData.bleachOption) newErrors.bleachOption = "Bleach option is required"
    }
    return newErrors
  }

  const validateAll = () => {
    const newErrors: any = {}
    if (!user) {
      if (!formData.name) newErrors.name = "Name is required"
      if (!formData.email) newErrors.email = "Email is required"
      if (!formData.phone) newErrors.phone = "Phone is required"
    }
    if (!formData.weight) newErrors.weight = "Weight is required"
    if (!formData.addressLine1) newErrors.addressLine1 = "Address is required"
    if (!formData.city) newErrors.city = "City is required"
    if (!formData.state) newErrors.state = "State is required"
    if (!formData.zipCode) newErrors.zipCode = "ZIP code is required"
    if (!formData.detergent) newErrors.detergent = "Detergent is required"
    if (!formData.waterTemp) newErrors.waterTemp = "Water temperature is required"
    if (!formData.dryTemp) newErrors.dryTemp = "Dryer temperature is required"
    if (!formData.bleachOption) newErrors.bleachOption = "Bleach option is required"
    return newErrors
  }

  const handleNextStep = () => {
    const validationErrors = validateStep(currentStep)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({}) // Clear errors if validation passes for current step
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
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
      console.log("Attempting to confirm payment...");
      if (!stripe || !elements) {
        console.error("Stripe or Elements not loaded.");
        setError("Stripe not loaded")
        setProcessing(false)
        return
      }
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        console.error("Card element not found.");
        setError("Card element not found")
        setProcessing(false)
        return
      }
      console.log("Calling stripe.confirmCardPayment with clientSecret:", clientSecret);
      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret!,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
            },
          },
        }
      );
      console.log("stripe.confirmCardPayment result: ", { paymentIntent, stripeError });

      if (stripeError) {
        setError(stripeError.message || "Payment failed")
        setProcessing(false)
        return
      }
      if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("Payment succeeded!");
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

  // Step content rendering
  function renderStepContent() {
    if (step === "form") {
      if ((!user && currentStep === 0)) {
        return <CustomerInfoStep formData={formData} onChange={handleInputChange} errors={errors} />
      }
      if ((user ? currentStep === 0 : currentStep === 1)) {
        return <OrderDetailsStep formData={formData} onChange={handleInputChange} errors={errors} />
      }
      if ((user ? currentStep === 1 : currentStep === 2)) {
        return <AddressInstructionsStep formData={formData} onChange={handleInputChange} errors={errors} />
      }
      if ((user ? currentStep === 2 : currentStep === 3)) {
        // Order summary and payment trigger
        return (
          <div>
            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <OrderSummaryAndPaymentStep
                  formData={formData}
                  errors={errors}
                  onPaymentSuccess={() => setStep("success")}
                  clientSecret={clientSecret}
                />
              </Elements>
            ) : (
              <>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                    <div className="space-y-2">
                      <p><strong>Name:</strong> {formData.name}</p>
                      <p><strong>Email:</strong> {user?.email || formData.email}</p>
                      <p><strong>Phone:</strong> {formData.phone}</p>
                      <p><strong>Estimated Weight:</strong> {formData.weight}</p>
                      <p><strong>Estimated Price:</strong> ${(() => {
                        const [min, max] = formData.weight.split("-").map(Number)
                        const averageWeight = max ? (min + max) / 2 : min
                        return Math.max(averageWeight * 1.75, 17.5).toFixed(2)
                      })()}</p>
                      <p><strong>Service Type:</strong> {formData.serviceType}</p>
                      <p><strong>Scheduling:</strong> {formData.schedulingOption === "asap" ? "ASAP" : `Preferred date: ${formData.scheduledDate}`}</p>
                      <p><strong>Address:</strong> {formData.addressLine1}, {formData.addressLine2 && `${formData.addressLine2}, `}{formData.city}, {formData.state} {formData.zipCode}</p>
                      {formData.specialInstructions && (
                        <p><strong>Special Instructions:</strong> {formData.specialInstructions}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                {paymentError && <div className="text-red-500 text-sm mt-4">{paymentError}</div>}
                <Button
                  type="button"
                  className="mt-6 w-full"
                  onClick={async () => {
                    setErrors({}) // Clear previous errors
                    setPaymentError(null)
                    const validationErrors = validateAll()
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
                      
                      // Log the payload before sending
                      const payload = {
                        amount: Math.round(price * 100),
                        email: user?.email || formData.email,
                        offer: `Laundry Order: ${formData.weight} lbs, ${formData.serviceType}`,
                        name: formData.name,
                        phone: formData.phone,
                      };
                      console.log("Sending payload to create-payment-intent:", payload);

                      // Create payment intent
                      const res = await fetch("/api/create-payment-intent", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                      })
                      
                      // Log the raw response
                      const rawResponse = await res.text();
                      console.log("Raw response from create-payment-intent:", rawResponse);

                      const data = JSON.parse(rawResponse);

                      if (!res.ok) {
                        throw new Error(data.error || "Failed to create payment intent.")
                      }
                      if (!data.clientSecret) throw new Error(data.error || "Could not start payment")
                      setClientSecret(data.clientSecret)
                    } catch (err: any) {
                      console.error("Error creating payment intent:", err);
                      setPaymentError(err.message || "An unexpected error occurred. Please try again.")
                    } finally {
                      setIsLoading(false)
                    }
                  }}
                  disabled={isLoading || !!clientSecret}
                >
                  {isLoading ? "Processing..." : "Continue to Payment"}
                </Button>
              </>
            )}
          </div>
        )
      }
    }
    if (step === "success") {
      return (
        <div className="text-center py-8">
          <Check className="size-8 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Thank you for your order!</h3>
          <p className="text-muted-foreground">Your payment was successful. We will contact you soon to schedule your pickup.</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-white to-white px-4 pt-8 flex justify-center">
      <div className="w-full max-w-2xl mx-auto">
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mb-4 hover:bg-blue-200/60 -ml-2 text-blue-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        <Card className={cn("w-full shadow-2xl border-blue-300 bg-white/95 rounded-2xl")}> 
          <CardHeader>
            <CardTitle className="text-blue-900">Laundry Wash & Fold Order</CardTitle>
            <CardDescription className="text-blue-700">Place your order for our convenient laundry service.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8">
            {/* Stepper */}
            <div className="flex items-center justify-between mb-6">
              {steps.map((stepObj, idx) => (
                <div key={stepObj.title} className="flex-1 flex flex-col items-center">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${currentStep === idx ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-blue-900 border-blue-300'} font-bold mb-1`}>{idx + 1}</div>
                  <span className={`text-xs ${currentStep === idx ? 'text-blue-900 font-semibold' : 'text-blue-500'}`}>{stepObj.title}</span>
                </div>
              ))}
            </div>
            {/* Step Content */}
            {renderStepContent()}
            {/* Navigation Buttons */}
            {step === "form" && (
              <div className="flex justify-between mt-6">
                {currentStep > 0 && (
                  <Button type="button" variant="outline" onClick={handlePrevStep} className="border-blue-300 text-blue-900 hover:bg-blue-200">
                    Previous
                  </Button>
                )}
                {currentStep < steps.length - 1 && (
                  <Button type="button" onClick={handleNextStep} className="bg-blue-900 hover:bg-blue-800 text-white shadow-md">
                    Next
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

