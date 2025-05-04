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
  detergent: "tide",
  waterTemp: "cold",
  dryTemp: "medium",
  bleachOption: "no_bleach",
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

export function MultiStepLaundryOrderForm({ className, onBack }: MultiStepLaundryOrderFormProps) {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = React.useState(0)
  const [state, dispatch] = useActionState<LaundryOrderFormState, any>(laundryOrderFormAction, initialState)
  const [isPending, startTransition] = useTransition()

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      setCurrentStep(stepIndex)
    }
  }

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1))
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    startTransition(() => {
      dispatch({
        type: "UPDATE_FIELD",
        field: e.target.name,
        value: e.target.value,
      })
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = await dispatch({
      type: "SUBMIT",
      formData: state,
    })
    if ((result as unknown as LaundryOrderFormState).success) {
      setCurrentStep(STEPS.length) // Set to a step beyond the last one to show success screen
    }
  }

  if (!state || typeof state !== 'object' || !('success' in state)) {
    return null // or a loading spinner if desired
  }

  // Dynamically set steps based on login status
  const steps = user
    ? [
        { title: "Order Details", description: "Specify your laundry order" },
        { title: "Address & Instructions", description: "Provide delivery information" },
        { title: "Review & Payment", description: "Review your order and complete payment" },
      ]
    : STEPS

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
            {state.success ? (
              <SuccessScreen
                formData={state}
                confirmationMessage={state.confirmationMessage}
                orderTotal={state.orderTotal}
              />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Stepper */}
                <div className="flex items-center justify-between mb-6">
                  {steps.map((step, idx) => (
                    <div key={step.title} className="flex-1 flex flex-col items-center">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${currentStep === idx ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-blue-900 border-blue-300'} font-bold mb-1`}>{idx + 1}</div>
                      <span className={`text-xs ${currentStep === idx ? 'text-blue-900 font-semibold' : 'text-blue-500'}`}>{step.title}</span>
                    </div>
                  ))}
                </div>
                {/* Step Content */}
                {(!user && currentStep === 0) && (
                  <CustomerInfoStep formData={state} onChange={handleInputChange} errors={state.errors} />
                )}
                {(user ? currentStep === 0 : currentStep === 1) && (
                  <OrderDetailsStep formData={state} onChange={handleInputChange} errors={state.errors} />
                )}
                {(user ? currentStep === 1 : currentStep === 2) && (
                  <AddressInstructionsStep formData={state} onChange={handleInputChange} errors={state.errors} />
                )}
                {(user ? currentStep === 2 : currentStep === 3) && (
                  <OrderSummaryAndPaymentStep formData={state} errors={state.errors} onSubmit={handleSubmit} />
                )}
                {/* Navigation Buttons */}
                {currentStep < steps.length - 1 ? (
                  <div className="flex justify-between mt-6">
                    {currentStep > 0 && (
                      <Button type="button" variant="outline" onClick={handlePrevStep} className="border-blue-300 text-blue-900 hover:bg-blue-200">
                        Previous
                      </Button>
                    )}
                    <Button type="button" onClick={handleNextStep} className="bg-blue-900 hover:bg-blue-800 text-white shadow-md">
                      Next
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-start mt-6">
                    {currentStep > 0 && (
                      <Button type="button" variant="outline" onClick={handlePrevStep} className="border-blue-300 text-blue-900 hover:bg-blue-200">
                        Previous
                      </Button>
                    )}
                  </div>
                )}
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

