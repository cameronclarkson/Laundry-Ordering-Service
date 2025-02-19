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

interface MultiStepLaundryOrderFormProps extends React.ComponentProps<typeof Card> {
  onBack?: () => void
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
  const [currentStep, setCurrentStep] = React.useState(0)
  const [state, dispatch] = useActionState(laundryOrderFormAction, initialState)
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
    if (result.success) {
      setCurrentStep(STEPS.length) // Set to a step beyond the last one to show success screen
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 lg:mt-8 px-4 lg:px-0">
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="mb-4 hover:bg-muted/50 -ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      )}
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle>Laundry Wash & Fold Order</CardTitle>
          <CardDescription>Place your order for our convenient laundry service.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {state.success ? (
            <SuccessScreen
              formData={state}
              confirmationMessage={state.confirmationMessage}
              orderTotal={state.orderTotal}
            />
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex justify-between mb-4 overflow-x-auto">
                {STEPS.map((step, index) => (
                  <button
                    key={step.title}
                    onClick={() => handleStepClick(index)}
                    className={cn(
                      "flex flex-col items-center text-center px-2",
                      index <= currentStep ? "cursor-pointer" : "cursor-not-allowed opacity-50",
                    )}
                    disabled={index > currentStep}
                    aria-current={index === currentStep ? "step" : undefined}
                    type="button"
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2",
                        index < currentStep
                          ? "bg-primary text-primary-foreground"
                          : index === currentStep
                            ? "bg-primary text-primary-foreground ring-2 ring-offset-2 ring-primary"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {index + 1}
                    </div>
                    <div className="text-xs max-w-[80px]">{step.title}</div>
                  </button>
                ))}
              </div>
              <div className="text-lg font-semibold mb-2">{STEPS[currentStep].title}</div>
              <div className="text-sm text-muted-foreground mb-4">{STEPS[currentStep].description}</div>
              {currentStep === 0 && (
                <CustomerInfoStep formData={state} onChange={handleInputChange} errors={state.errors} />
              )}
              {currentStep === 1 && (
                <OrderDetailsStep formData={state} onChange={handleInputChange} errors={state.errors} />
              )}
              {currentStep === 2 && (
                <AddressInstructionsStep formData={state} onChange={handleInputChange} errors={state.errors} />
              )}
              {currentStep === 3 && (
                <OrderSummaryAndPaymentStep formData={state} errors={state.errors} onSubmit={handleSubmit} />
              )}
              {currentStep < STEPS.length - 1 ? (
                <div className="flex justify-between mt-6">
                  {currentStep > 0 && (
                    <Button type="button" variant="outline" onClick={handlePrevStep}>
                      Previous
                    </Button>
                  )}
                  <Button type="button" onClick={handleNextStep}>
                    Next
                  </Button>
                </div>
              ) : (
                <div className="flex justify-start mt-6">
                  {currentStep > 0 && (
                    <Button type="button" variant="outline" onClick={handlePrevStep}>
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
  )
}

