import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CustomerInfoStep({ formData, onChange, errors }) {
  return (
    <>
      <div className="group/field grid gap-2" data-invalid={!!errors?.name}>
        <Label htmlFor="name" className="group-data-[invalid=true]/field:text-destructive">
          Name <span aria-hidden="true">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          placeholder="John Doe"
          className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
          aria-invalid={!!errors?.name}
          aria-errormessage="error-name"
        />
        {errors?.name && (
          <p id="error-name" className="text-destructive text-sm">
            {errors.name}
          </p>
        )}
      </div>
      <div className="group/field grid gap-2" data-invalid={!!errors?.email}>
        <Label htmlFor="email" className="group-data-[invalid=true]/field:text-destructive">
          Email <span aria-hidden="true">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          placeholder="john@example.com"
          className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
          aria-invalid={!!errors?.email}
          aria-errormessage="error-email"
        />
        {errors?.email && (
          <p id="error-email" className="text-destructive text-sm">
            {errors.email}
          </p>
        )}
      </div>
      <div className="group/field grid gap-2" data-invalid={!!errors?.phone}>
        <Label htmlFor="phone" className="group-data-[invalid=true]/field:text-destructive">
          Phone <span aria-hidden="true">*</span>
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={onChange}
          placeholder="(123) 456-7890"
          className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
          aria-invalid={!!errors?.phone}
          aria-errormessage="error-phone"
        />
        {errors?.phone && (
          <p id="error-phone" className="text-destructive text-sm">
            {errors.phone}
          </p>
        )}
      </div>
    </>
  )
}

