import React from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

const calculatePrice = (weight: string) => {
  const pricePerPound = 1.99
  const [min, max] = weight.split("-").map(Number)
  const averageWeight = max ? (min + max) / 2 : min
  const basePrice = averageWeight * pricePerPound
  return Math.max(basePrice, 10).toFixed(2) // Ensure minimum $10 charge
}

export function OrderDetailsStep({ formData, onChange, errors }) {
  const [calculatedPrice, setCalculatedPrice] = React.useState(calculatePrice(formData.weight))

  return (
    <>
      <div className="group/field grid gap-2" data-invalid={!!errors?.weight}>
        <Label htmlFor="weight" className="group-data-[invalid=true]/field:text-destructive">
          Estimated Weight (lbs) <span aria-hidden="true">*</span>
        </Label>
        <Select
          name="weight"
          value={formData.weight}
          onValueChange={(value) => {
            onChange({ target: { name: "weight", value } })
            setCalculatedPrice(calculatePrice(value))
          }}
        >
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
        {errors?.weight && (
          <p id="error-weight" className="text-destructive text-sm">
            {errors.weight}
          </p>
        )}
        <div className="mt-2 text-sm text-muted-foreground">
          Estimated Price: ${calculatedPrice} (Minimum $10 charge)
        </div>
      </div>
      <div className="group/field grid gap-2" data-invalid={!!errors?.schedulingOption}>
        <Label className="group-data-[invalid=true]/field:text-destructive">
          Scheduling Option <span aria-hidden="true">*</span>
        </Label>
        <RadioGroup
          name="schedulingOption"
          value={formData.schedulingOption}
          onValueChange={(value) => onChange({ target: { name: "schedulingOption", value } })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="asap" id="asap" />
            <Label htmlFor="asap">ASAP</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="schedule" id="schedule" />
            <Label htmlFor="schedule">Schedule Ahead</Label>
          </div>
        </RadioGroup>
        {errors?.schedulingOption && (
          <p id="error-schedulingOption" className="text-destructive text-sm">
            {errors.schedulingOption}
          </p>
        )}
      </div>
      {formData.schedulingOption === "schedule" && (
        <>
          <div className="group/field grid gap-2" data-invalid={!!errors?.scheduledDate}>
            <Label htmlFor="scheduledDate" className="group-data-[invalid=true]/field:text-destructive">
              Preferred Date <span aria-hidden="true">*</span>
            </Label>
            <Input
              type="date"
              id="scheduledDate"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={onChange}
              min={new Date().toISOString().split("T")[0]}
              className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
              aria-invalid={!!errors?.scheduledDate}
              aria-errormessage="error-scheduledDate"
            />
            {errors?.scheduledDate && (
              <p id="error-scheduledDate" className="text-destructive text-sm">
                {errors.scheduledDate}
              </p>
            )}
          </div>
        </>
      )}
    </>
  )
}

