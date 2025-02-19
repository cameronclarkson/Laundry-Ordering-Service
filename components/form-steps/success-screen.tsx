import { Check } from "lucide-react"

export function SuccessScreen({ formData, confirmationMessage, orderTotal }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-green-100">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-semibold mb-4">Order Placed Successfully!</h2>
      <p className="text-muted-foreground mb-6">{confirmationMessage}</p>
      <div className="text-left max-w-md mx-auto">
        <h3 className="font-semibold mb-2">Order Details:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Order ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</li>
          <li>Estimated Weight: {formData.weight}</li>
          <li>Service Type: {formData.serviceType}</li>
          <li>
            Address: {formData.addressLine1}, {formData.city}, {formData.state} {formData.zipCode}
          </li>
          <li>Total Amount: ${orderTotal}</li>
        </ul>
      </div>
    </div>
  )
}

