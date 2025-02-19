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

import { laundryOrderFormAction } from "@/lib/actions"
import { Check } from "lucide-react"

export function LaundryOrderForm({ className }: React.ComponentProps<typeof Card>) {
  const [state, formAction, pending] = React.useActionState(laundryOrderFormAction, {
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      weight: "",
      serviceType: "pickup",
      address: "",
      specialInstructions: "",
    },
    success: false,
    errors: null,
  })

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader>
        <CardTitle>Laundry Wash & Fold Order</CardTitle>
        <CardDescription>Place your order for our convenient laundry service.</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="flex flex-col gap-4">
          {state.success ? (
            <p className="text-muted-foreground flex items-center gap-2 text-sm">
              <Check className="size-4" />
              Your order has been placed. Thank you!
            </p>
          ) : null}
          <div className="group/field grid gap-2" data-invalid={!!state.errors?.name}>
            <Label htmlFor="name" className="group-data-[invalid=true]/field:text-destructive">
              Name <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
              disabled={pending}
              aria-invalid={!!state.errors?.name}
              aria-errormessage="error-name"
              defaultValue={state.defaultValues.name}
            />
            {state.errors?.name && (
              <p id="error-name" className="text-destructive text-sm">
                {state.errors.name}
              </p>
            )}
          </div>
          <div className="group/field grid gap-2" data-invalid={!!state.errors?.email}>
            <Label htmlFor="email" className="group-data-[invalid=true]/field:text-destructive">
              Email <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
              disabled={pending}
              aria-invalid={!!state.errors?.email}
              aria-errormessage="error-email"
              defaultValue={state.defaultValues.email}
            />
            {state.errors?.email && (
              <p id="error-email" className="text-destructive text-sm">
                {state.errors.email}
              </p>
            )}
          </div>
          <div className="group/field grid gap-2" data-invalid={!!state.errors?.phone}>
            <Label htmlFor="phone" className="group-data-[invalid=true]/field:text-destructive">
              Phone <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(123) 456-7890"
              className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
              disabled={pending}
              aria-invalid={!!state.errors?.phone}
              aria-errormessage="error-phone"
              defaultValue={state.defaultValues.phone}
            />
            {state.errors?.phone && (
              <p id="error-phone" className="text-destructive text-sm">
                {state.errors.phone}
              </p>
            )}
          </div>
          <div className="group/field grid gap-2" data-invalid={!!state.errors?.weight}>
            <Label htmlFor="weight" className="group-data-[invalid=true]/field:text-destructive">
              Estimated Weight (lbs) <span aria-hidden="true">*</span>
            </Label>
            <Select name="weight" defaultValue={state.defaultValues.weight}>
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
            {state.errors?.weight && (
              <p id="error-weight" className="text-destructive text-sm">
                {state.errors.weight}
              </p>
            )}
          </div>
          <div className="group/field grid gap-2" data-invalid={!!state.errors?.serviceType}>
            <Label className="group-data-[invalid=true]/field:text-destructive">
              Service Type <span aria-hidden="true">*</span>
            </Label>
            <RadioGroup name="serviceType" defaultValue={state.defaultValues.serviceType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pickup" id="pickup" />
                <Label htmlFor="pickup">Pick Up</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="delivery" id="delivery" />
                <Label htmlFor="delivery">Delivery</Label>
              </div>
            </RadioGroup>
            {state.errors?.serviceType && (
              <p id="error-serviceType" className="text-destructive text-sm">
                {state.errors.serviceType}
              </p>
            )}
          </div>
          <div className="group/field grid gap-2" data-invalid={!!state.errors?.address}>
            <Label htmlFor="address" className="group-data-[invalid=true]/field:text-destructive">
              Address <span aria-hidden="true">*</span>
            </Label>
            <Textarea
              id="address"
              name="address"
              placeholder="Enter your address"
              className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
              disabled={pending}
              aria-invalid={!!state.errors?.address}
              aria-errormessage="error-address"
              defaultValue={state.defaultValues.address}
            />
            {state.errors?.address && (
              <p id="error-address" className="text-destructive text-sm">
                {state.errors.address}
              </p>
            )}
          </div>
          <div className="group/field grid gap-2" data-invalid={!!state.errors?.specialInstructions}>
            <Label htmlFor="specialInstructions" className="group-data-[invalid=true]/field:text-destructive">
              Special Instructions
            </Label>
            <Textarea
              id="specialInstructions"
              name="specialInstructions"
              placeholder="Any special instructions for your order?"
              className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
              disabled={pending}
              aria-invalid={!!state.errors?.specialInstructions}
              aria-errormessage="error-specialInstructions"
              defaultValue={state.defaultValues.specialInstructions}
            />
            {state.errors?.specialInstructions && (
              <p id="error-specialInstructions" className="text-destructive text-sm">
                {state.errors.specialInstructions}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Placing Order..." : "Place Order"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

