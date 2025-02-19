"use server"

import { laundryOrderFormSchema } from "@/lib/schema"
import { z } from "zod"

export async function laundryOrderFormAction(
  prevState: any,
  action: { type: string; field?: string; value?: string; formData?: any },
) {
  if (action.type === "UPDATE_FIELD") {
    return {
      ...prevState,
      [action.field!]: action.value,
    }
  }

  if (action.type === "SUBMIT") {
    try {
      const data = laundryOrderFormSchema.parse(action.formData)

      // Simulate a delay for processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Calculate the order total based on the weight
      const pricePerPound = 1.99 // $1.99 per pound
      const weightRange = data.weight.split("-").map(Number)
      const averageWeight = weightRange.length > 1 ? (weightRange[0] + weightRange[1]) / 2 : weightRange[0]
      const orderTotal = Math.max(averageWeight * pricePerPound, 10) // Ensure minimum $10 charge

      // Simulate generating a confirmation message
      const confirmationMessage = `Thank you, ${data.name}! Your delivery order for ${data.weight} lbs of laundry has been placed successfully. We'll ${data.schedulingOption === "asap" ? "process your order as soon as possible" : `schedule your service for ${data.scheduledDate}`}. Your total is $${orderTotal.toFixed(2)}.`

      console.log("Order placed:", {
        ...data,
        bleachOption: data.bleachOption,
      })

      return {
        ...prevState,
        ...data,
        success: true,
        errors: null,
        confirmationMessage,
        orderTotal: orderTotal.toFixed(2),
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          ...prevState,
          success: false,
          errors: Object.fromEntries(
            Object.entries(error.flatten().fieldErrors).map(([key, value]) => [key, value?.join(", ")]),
          ),
        }
      }

      return {
        ...prevState,
        success: false,
        errors: { form: "An unexpected error occurred. Please try again." },
      }
    }
  }

  return prevState
}

const supportFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  issue: z.string().min(10, "Please provide more details about your issue"),
})

export async function submitSupportIssue(prevState: any, formData: FormData) {
  try {
    const data = supportFormSchema.parse(Object.fromEntries(formData))

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Support issue submitted:", data)

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      }
    }

    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}

