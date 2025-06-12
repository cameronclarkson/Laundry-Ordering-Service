import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"

interface AddressInstructionsStepProps {
  formData: any; // Using any for now, will refine if necessary
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | { target: { name: string; value: any } }) => void;
  errors: any;
}

export function AddressInstructionsStep({ formData, onChange, errors }: AddressInstructionsStepProps) {
  console.log("AddressInstructionsStep received formData:", formData);
  return (
    <div className="space-y-6">
      {/* Address Section */}
      <div className="space-y-4">
        <h3 className="text-base font-medium">Delivery Address</h3>
        <div className="group/field grid gap-2" data-invalid={!!errors?.addressLine1}>
          <Label htmlFor="addressLine1" className="group-data-[invalid=true]/field:text-destructive">
            Address Line 1 <span aria-hidden="true">*</span>
          </Label>
          <Input
            id="addressLine1"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={onChange}
            placeholder="123 Main St"
            className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
            aria-invalid={!!errors?.addressLine1}
            aria-errormessage="error-addressLine1"
          />
          {errors?.addressLine1 && (
            <p id="error-addressLine1" className="text-destructive text-sm">
              {errors.addressLine1}
            </p>
          )}
        </div>
        <div className="group/field grid gap-2" data-invalid={!!errors?.addressLine2}>
          <Label htmlFor="addressLine2" className="group-data-[invalid=true]/field:text-destructive">
            Address Line 2
          </Label>
          <Input
            id="addressLine2"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={onChange}
            placeholder="Apt 4B"
            className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
            aria-invalid={!!errors?.addressLine2}
            aria-errormessage="error-addressLine2"
          />
          {errors?.addressLine2 && (
            <p id="error-addressLine2" className="text-destructive text-sm">
              {errors.addressLine2}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="group/field grid gap-2" data-invalid={!!errors?.city}>
            <Label htmlFor="city" className="group-data-[invalid=true]/field:text-destructive">
              City <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={onChange}
              placeholder="New York"
              className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
              aria-invalid={!!errors?.city}
              aria-errormessage="error-city"
            />
            {errors?.city && (
              <p id="error-city" className="text-destructive text-sm">
                {errors.city}
              </p>
            )}
          </div>
          <div className="group/field grid gap-2" data-invalid={!!errors?.state}>
            <Label htmlFor="state" className="group-data-[invalid=true]/field:text-destructive">
              State <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="state"
              name="state"
              value={formData.state}
              onChange={onChange}
              placeholder="NY"
              className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
              aria-invalid={!!errors?.state}
              aria-errormessage="error-state"
            />
            {errors?.state && (
              <p id="error-state" className="text-destructive text-sm">
                {errors.state}
              </p>
            )}
          </div>
        </div>
        <div className="group/field grid gap-2" data-invalid={!!errors?.zipCode}>
          <Label htmlFor="zipCode" className="group-data-[invalid=true]/field:text-destructive">
            ZIP Code <span aria-hidden="true">*</span>
          </Label>
          <Input
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={onChange}
            placeholder="10001"
            className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
            aria-invalid={!!errors?.zipCode}
            aria-errormessage="error-zipCode"
          />
          {errors?.zipCode && (
            <p id="error-zipCode" className="text-destructive text-sm">
              {errors.zipCode}
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
          <Select
            name="waterTemp"
            value={formData.waterTemp}
            onValueChange={(value) => onChange({ target: { name: "waterTemp", value } })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select water temperature" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cold">Cold</SelectItem>
              <SelectItem value="warm">Warm</SelectItem>
              <SelectItem value="hot">Hot</SelectItem>
            </SelectContent>
          </Select>
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
          <Select
            name="dryTemp"
            value={formData.dryTemp}
            onValueChange={(value) => onChange({ target: { name: "dryTemp", value } })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select dryer temperature" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
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
          <Select
            name="bleachOption"
            value={formData.bleachOption}
            onValueChange={(value) => onChange({ target: { name: "bleachOption", value } })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select bleach option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no_bleach">No Bleach</SelectItem>
              <SelectItem value="color_safe">Color-Safe</SelectItem>
              <SelectItem value="chlorine">Chlorine</SelectItem>
            </SelectContent>
          </Select>
          {errors?.bleachOption && (
            <p id="error-bleachOption" className="text-destructive text-sm">
              {errors.bleachOption}
            </p>
          )}
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-base font-medium">Other Preferences</h3>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="fabricSoftener"
              name="fabricSoftener"
              checked={formData.fabricSoftener}
              onCheckedChange={(checked) => onChange({ target: { name: "fabricSoftener", value: checked } })}
            />
            <Label htmlFor="fabricSoftener">Add fabric softener</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dryerSheets"
              name="dryerSheets"
              checked={formData.dryerSheets}
              onCheckedChange={(checked) => onChange({ target: { name: "dryerSheets", value: checked } })}
            />
            <Label htmlFor="dryerSheets">Add dryer sheets</Label>
          </div>
        </div>

        <div className="group/field grid gap-2" data-invalid={!!errors?.scent}>
          <Label htmlFor="scent" className="group-data-[invalid=true]/field:text-destructive">
            Scent
          </Label>
          <Select
            name="scent"
            value={formData.scent}
            onValueChange={(value) => onChange({ target: { name: "scent", value } })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select scent (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unscented">Unscented</SelectItem>
              <SelectItem value="fresh_linen">Fresh Linen</SelectItem>
              <SelectItem value="lavender">Lavender</SelectItem>
            </SelectContent>
          </Select>
          {errors?.scent && (
            <p id="error-scent" className="text-destructive text-sm">
              {errors.scent}
            </p>
          )}
        </div>

        <div className="group/field grid gap-2" data-invalid={!!errors?.specialInstructions}>
          <Label htmlFor="specialInstructions" className="group-data-[invalid=true]/field:text-destructive">
            Special Instructions
          </Label>
          <Textarea
            id="specialInstructions"
            name="specialInstructions"
            value={formData.specialInstructions}
            onChange={onChange}
            placeholder="e.g., separate delicates, hang dry, etc."
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

