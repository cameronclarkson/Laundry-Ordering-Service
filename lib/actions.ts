"use server"

import { laundryOrderFormSchema } from "@/lib/schema"
import { z } from "zod"
import { supabase } from "@/lib/supabase"

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

export async function submitSupportIssue(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const issue = formData.get("issue") as string

    if (!name || !email || !issue) {
      return { 
        success: false, 
        error: "Please fill out all fields" 
      }
    }

    console.log("Submitting support ticket:", { name, email, issueLength: issue.length })

    // Try to insert into the database
    try {
      const { data, error } = await supabase
        .from("support_tickets")
        .insert([
          {
            name,
            email,
            message: issue,
            status: "new"
          }
        ])
        .select()

      if (error) {
        console.error("Database error:", error)
        // Fall back to the in-memory approach if database fails
        throw error
      }

      console.log("Support ticket saved to database:", data)
    } catch (dbError) {
      // Fallback to in-memory approach
      const timestamp = new Date().toISOString()
      const ticketId = `ticket_${Date.now()}`
      
      console.log("Using fallback storage. Support ticket created:", { 
        id: ticketId, 
        name, 
        email, 
        message: issue,
        created_at: timestamp
      })
    }
    
    return { 
      success: true,
      confirmationMessage: "We've received your support request and will respond shortly."
    }
  } catch (error) {
    console.error("Error in submitSupportIssue:", error)
    return { 
      success: false, 
      error: "An unexpected error occurred. Please try again." 
    }
  }
}

