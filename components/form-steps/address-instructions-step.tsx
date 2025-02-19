import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"

export function AddressInstructionsStep({ formData, onChange, errors }) {
  return (
    <div className="space-y-6">
      {/* Address Section */}
      <div className="space-y-4">
        <h3 className="text-base font-medium">Delivery Address</h3>
        <div className="group/field grid gap-2" data-invalid={!!errors?.deliveryAddress?.addressLine1}>
          <Label htmlFor="addressLine1" className="group-data-[invalid=true]/field:text-destructive">
            Address Line 1 <span aria-hidden="true">*</span>
          </Label>
          <Input
            id="addressLine1"
            name="deliveryAddress.addressLine1"
            value={formData.deliveryAddress?.addressLine1}
            onChange={onChange}
            placeholder="123 Main St"
            className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
            aria-invalid={!!errors?.deliveryAddress?.addressLine1}
            aria-errormessage="error-addressLine1"
          />
          {errors?.deliveryAddress?.addressLine1 && (
            <p id="error-addressLine1" className="text-destructive text-sm">
              {errors.deliveryAddress.addressLine1}
            </p>
          )}
        </div>
        <div className="group/field grid gap-2" data-invalid={!!errors?.deliveryAddress?.addressLine2}>
          <Label htmlFor="addressLine2" className="group-data-[invalid=true]/field:text-destructive">
            Address Line 2
          </Label>
          <Input
            id="addressLine2"
            name="deliveryAddress.addressLine2"
            value={formData.deliveryAddress?.addressLine2}
            onChange={onChange}
            placeholder="Apt 4B"
            className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
            aria-invalid={!!errors?.deliveryAddress?.addressLine2}
            aria-errormessage="error-addressLine2"
          />
          {errors?.deliveryAddress?.addressLine2 && (
            <p id="error-addressLine2" className="text-destructive text-sm">
              {errors.deliveryAddress.addressLine2}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="group/field grid gap-2" data-invalid={!!errors?.deliveryAddress?.city}>
            <Label htmlFor="city" className="group-data-[invalid=true]/field:text-destructive">
              City <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="city"
              name="deliveryAddress.city"
              value={formData.deliveryAddress?.city}
              onChange={onChange}
              placeholder="New York"
              className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
              aria-invalid={!!errors?.deliveryAddress?.city}
              aria-errormessage="error-city"
            />
            {errors?.deliveryAddress?.city && (
              <p id="error-city" className="text-destructive text-sm">
                {errors.deliveryAddress.city}
              </p>
            )}
          </div>
          <div className="group/field grid gap-2" data-invalid={!!errors?.deliveryAddress?.state}>
            <Label htmlFor="state" className="group-data-[invalid=true]/field:text-destructive">
              State <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="state"
              name="deliveryAddress.state"
              value={formData.deliveryAddress?.state}
              onChange={onChange}
              placeholder="NY"
              className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
              aria-invalid={!!errors?.deliveryAddress?.state}
              aria-errormessage="error-state"
            />
            {errors?.deliveryAddress?.state && (
              <p id="error-state" className="text-destructive text-sm">
                {errors.deliveryAddress.state}
              </p>
            )}
          </div>
        </div>
        <div className="group/field grid gap-2" data-invalid={!!errors?.deliveryAddress?.zipCode}>
          <Label htmlFor="zipCode" className="group-data-[invalid=true]/field:text-destructive">
            ZIP Code <span aria-hidden="true">*</span>
          </Label>
          <Input
            id="zipCode"
            name="deliveryAddress.zipCode"
            value={formData.deliveryAddress?.zipCode}
            onChange={onChange}
            placeholder="10001"
            className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
            aria-invalid={!!errors?.deliveryAddress?.zipCode}
            aria-errormessage="error-zipCode"
          />
          {errors?.deliveryAddress?.zipCode && (
            <p id="error-zipCode" className="text-destructive text-sm">
              {errors.deliveryAddress.zipCode}
            </p>
          )}
        </div>
      </div>

      <Separator />

      {/* Laundry Preferences Section */}
      <div className="space-y-4">
        <h3 className="text-base font-medium">Laundry Preferences</h3>

        <div className="group/field grid gap-2" data-invalid={!!errors?.detergent}>
          <Label htmlFor="detergent" className="group-data-[invalid=true]/field:text-destructive">
            Detergent Brand <span aria-hidden="true">*</span>
          </Label>
          <Select
            name="detergent"
            value={formData.detergent}
            onValueChange={(value) => onChange({ target: { name: "detergent", value } })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select detergent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tide">Tide</SelectItem>
              <SelectItem value="persil">Persil</SelectItem>
              <SelectItem value="seventh_generation">Seventh Generation</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
          {errors?.detergent && (
            <p id="error-detergent" className="text-destructive text-sm">
              {errors.detergent}
            </p>
          )}
        </div>

        <div className="group/field grid gap-2" data-invalid={!!errors?.waterTemp}>
          <Label className="group-data-[invalid=true]/field:text-destructive">
            Water Temperature <span aria-hidden="true">*</span>
          </Label>
          <RadioGroup
            name="waterTemp"
            value={formData.waterTemp}
            onValueChange={(value) => onChange({ target: { name: "waterTemp", value } })}
            className="grid grid-cols-3 gap-2"
          >
            <Label
              htmlFor="water-cold"
              className="flex items-center justify-center border rounded-md p-3 cursor-pointer hover:bg-muted [&:has(:checked)]:bg-primary/10"
            >
              <RadioGroupItem value="cold" id="water-cold" className="sr-only" />
              Cold
            </Label>
            <Label
              htmlFor="water-warm"
              className="flex items-center justify-center border rounded-md p-3 cursor-pointer hover:bg-muted [&:has(:checked)]:bg-primary/10"
            >
              <RadioGroupItem value="warm" id="water-warm" className="sr-only" />
              Warm
            </Label>
            <Label
              htmlFor="water-hot"
              className="flex items-center justify-center border rounded-md p-3 cursor-pointer hover:bg-muted [&:has(:checked)]:bg-primary/10"
            >
              <RadioGroupItem value="hot" id="water-hot" className="sr-only" />
              Hot
            </Label>
          </RadioGroup>
          {errors?.waterTemp && (
            <p id="error-waterTemp" className="text-destructive text-sm">
              {errors.waterTemp}
            </p>
          )}
        </div>

        <div className="group/field grid gap-2" data-invalid={!!errors?.dryTemp}>
          <Label className="group-data-[invalid=true]/field:text-destructive">
            Dryer Temperature <span aria-hidden="true">*</span>
          </Label>
          <RadioGroup
            name="dryTemp"
            value={formData.dryTemp}
            onValueChange={(value) => onChange({ target: { name: "dryTemp", value } })}
            className="grid grid-cols-3 gap-2"
          >
            <Label
              htmlFor="dry-low"
              className="flex items-center justify-center border rounded-md p-3 cursor-pointer hover:bg-muted [&:has(:checked)]:bg-primary/10"
            >
              <RadioGroupItem value="low" id="dry-low" className="sr-only" />
              Low
            </Label>
            <Label
              htmlFor="dry-medium"
              className="flex items-center justify-center border rounded-md p-3 cursor-pointer hover:bg-muted [&:has(:checked)]:bg-primary/10"
            >
              <RadioGroupItem value="medium" id="dry-medium" className="sr-only" />
              Medium
            </Label>
            <Label
              htmlFor="dry-high"
              className="flex items-center justify-center border rounded-md p-3 cursor-pointer hover:bg-muted [&:has(:checked)]:bg-primary/10"
            >
              <RadioGroupItem value="high" id="dry-high" className="sr-only" />
              High
            </Label>
          </RadioGroup>
          {errors?.dryTemp && (
            <p id="error-dryTemp" className="text-destructive text-sm">
              {errors.dryTemp}
            </p>
          )}
        </div>

        <div className="group/field grid gap-2" data-invalid={!!errors?.bleachOption}>
          <Label className="group-data-[invalid=true]/field:text-destructive">
            Bleach Option <span aria-hidden="true">*</span>
          </Label>
          <RadioGroup
            name="bleachOption"
            value={formData.bleachOption}
            onValueChange={(value) => onChange({ target: { name: "bleachOption", value } })}
            className="grid grid-cols-3 gap-2"
          >
            <Label
              htmlFor="no-bleach"
              className="flex items-center justify-center border rounded-md p-3 cursor-pointer hover:bg-muted [&:has(:checked)]:bg-primary/10"
            >
              <RadioGroupItem value="no_bleach" id="no-bleach" className="sr-only" />
              No Bleach
            </Label>
            <Label
              htmlFor="color-safe"
              className="flex items-center justify-center border rounded-md p-3 cursor-pointer hover:bg-muted [&:has(:checked)]:bg-primary/10"
            >
              <RadioGroupItem value="color_safe" id="color-safe" className="sr-only" />
              Color Safe
            </Label>
            <Label
              htmlFor="white-bleach"
              className="flex items-center justify-center border rounded-md p-3 cursor-pointer hover:bg-muted [&:has(:checked)]:bg-primary/10"
            >
              <RadioGroupItem value="white_bleach" id="white-bleach" className="sr-only" />
              White Bleach
            </Label>
          </RadioGroup>
          {errors?.bleachOption && (
            <p id="error-bleachOption" className="text-destructive text-sm">
              {errors.bleachOption}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Additional Options</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="fabricSoftener"
              name="fabricSoftener"
              checked={formData.fabricSoftener}
              onCheckedChange={(checked) => onChange({ target: { name: "fabricSoftener", value: checked } })}
            />
            <Label htmlFor="fabricSoftener">Use Fabric Softener</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dryerSheets"
              name="dryerSheets"
              checked={formData.dryerSheets}
              onCheckedChange={(checked) => onChange({ target: { name: "dryerSheets", value: checked } })}
            />
            <Label htmlFor="dryerSheets">Use Dryer Sheets</Label>
          </div>
        </div>

        <div className="group/field grid gap-2" data-invalid={!!errors?.scent}>
          <Label htmlFor="scent" className="group-data-[invalid=true]/field:text-destructive">
            Scent Preference
          </Label>
          <Select
            name="scent"
            value={formData.scent}
            onValueChange={(value) => onChange({ target: { name: "scent", value } })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select scent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unscented">Unscented</SelectItem>
              <SelectItem value="fresh_linen">Fresh Linen</SelectItem>
              <SelectItem value="lavender">Lavender</SelectItem>
              <SelectItem value="spring_meadow">Spring Meadow</SelectItem>
            </SelectContent>
          </Select>
          {errors?.scent && (
            <p id="error-scent" className="text-destructive text-sm">
              {errors.scent}
            </p>
          )}
        </div>
      </div>

      <Separator />

      {/* Special Instructions Section */}
      <div className="space-y-4">
        <h3 className="text-base font-medium">Additional Instructions</h3>
        <div className="group/field grid gap-2" data-invalid={!!errors?.specialInstructions}>
          <Label htmlFor="specialInstructions" className="group-data-[invalid=true]/field:text-destructive">
            Special Instructions
          </Label>
          <Textarea
            id="specialInstructions"
            name="specialInstructions"
            value={formData.specialInstructions}
            onChange={onChange}
            placeholder="Any special instructions for your order?"
            className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
            aria-invalid={!!errors?.specialInstructions}
            aria-errormessage="error-specialInstructions"
          />
          {errors?.specialInstructions && (
            <p id="error-specialInstructions" className="text-destructive text-sm">
              {errors.specialInstructions}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

