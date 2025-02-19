import { z } from "zod"

export const laundryOrderFormSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" })
      .max(50, { message: "Name must be at most 50 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
    weight: z.enum(["0-10", "11-20", "21-30", "31+"], {
      required_error: "Please select an estimated weight",
    }),
    deliveryAddress: z.object({
      addressLine1: z.string().min(5, { message: "Address line 1 must be at least 5 characters" }),
      addressLine2: z.string().optional(),
      city: z.string().min(2, { message: "City is required" }),
      state: z.string().min(2, { message: "State is required" }),
      zipCode: z.string().min(5, { message: "ZIP code is required" }),
    }),
    schedulingOption: z.enum(["asap", "schedule"], {
      required_error: "Please select a scheduling option",
    }),
    scheduledDate: z.string().optional(),
    addressLine1: z
      .string()
      .min(5, { message: "Address line 1 must be at least 5 characters" })
      .max(100, { message: "Address line 1 must be at most 100 characters" }),
    addressLine2: z.string().max(100, { message: "Address line 2 must be at most 100 characters" }).optional(),
    city: z
      .string()
      .min(2, { message: "City must be at least 2 characters" })
      .max(50, { message: "City must be at most 50 characters" }),
    state: z
      .string()
      .min(2, { message: "State must be at least 2 characters" })
      .max(50, { message: "State must be at most 50 characters" }),
    zipCode: z
      .string()
      .min(5, { message: "ZIP code must be at least 5 characters" })
      .max(10, { message: "ZIP code must be at most 10 characters" }),
    detergent: z.enum(["tide", "persil", "seventh_generation", "all"], {
      required_error: "Please select a detergent brand",
    }),
    waterTemp: z.enum(["cold", "warm", "hot"], {
      required_error: "Please select a water temperature",
    }),
    dryTemp: z.enum(["low", "medium", "high"], {
      required_error: "Please select a dryer temperature",
    }),
    specialInstructions: z
      .string()
      .max(500, { message: "Special instructions must be at most 500 characters" })
      .optional(),
    fabricSoftener: z.boolean().optional(),
    dryerSheets: z.boolean().optional(),
    scent: z.enum(["unscented", "fresh_linen", "lavender", "spring_meadow"]).optional(),
    bleachOption: z.enum(["no_bleach", "color_safe", "white_bleach"], {
      required_error: "Please select a bleach option",
    }),
  })
  .refine(
    (data) => {
      if (data.schedulingOption === "schedule") {
        return !!data.scheduledDate
      }
      return true
    },
    {
      message: "Scheduled date is required when scheduling ahead",
      path: ["scheduledDate"],
    },
  )

