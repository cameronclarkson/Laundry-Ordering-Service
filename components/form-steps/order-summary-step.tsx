import { Card, CardContent } from "@/components/ui/card"

const calculatePrice = (weight: string) => {
  const pricePerPound = 1.75
  const [min, max] = weight.split("-").map(Number)
  const averageWeight = max ? (min + max) / 2 : min
  return Math.max(averageWeight * pricePerPound, 17.5).toFixed(2)
}

export function OrderSummaryStep({ formData }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        <div className="space-y-2">
          <p>
            <strong>Name:</strong> {formData.name}
          </p>
          <p>
            <strong>Email:</strong> {formData.email}
          </p>
          <p>
            <strong>Phone:</strong> {formData.phone}
          </p>
          <p>
            <strong>Estimated Weight:</strong> {formData.weight}
          </p>
          <p>
            <strong>Estimated Price:</strong> ${calculatePrice(formData.weight)}
          </p>
          <p>
            <strong>Service Type:</strong> {formData.serviceType}
          </p>
          <p>
            <strong>Scheduling:</strong>{" "}
            {formData.schedulingOption === "asap" ? "ASAP" : `Preferred date: ${formData.scheduledDate}`}
          </p>
          <p>
            <strong>Address:</strong> {formData.addressLine1}, {formData.addressLine2 && `${formData.addressLine2}, `}
            {formData.city}, {formData.state} {formData.zipCode}
          </p>
          <p>
            <strong>Bleach Option:</strong>{" "}
            {formData.bleachOption === "no_bleach"
              ? "No Bleach"
              : formData.bleachOption === "color_safe"
                ? "Color Safe Bleach"
                : "White Bleach"}
          </p>
          {formData.specialInstructions && (
            <p>
              <strong>Special Instructions:</strong> {formData.specialInstructions}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

