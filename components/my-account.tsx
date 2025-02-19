import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CreditCard } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"

interface MyAccountProps {
  onBack: () => void
}

export function MyAccount({ onBack }: MyAccountProps) {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  // Placeholder for payment methods
  const paymentMethods = [{ id: 1, last4: "4242", brand: "Visa", expMonth: 12, expYear: 2024 }]

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle>My Account</CardTitle>
            <CardDescription>Manage your account details and payment methods</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Account Information</h3>
          <div className="grid gap-4">
            <div className="grid gap-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={user?.name} readOnly={!isEditing} />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue={user?.email} readOnly={!isEditing} />
            </div>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)}>{isEditing ? "Save Changes" : "Edit Information"}</Button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Payment Methods</h3>
          {paymentMethods.map((method) => (
            <Card key={method.id}>
              <CardContent className="flex items-center p-4">
                <CreditCard className="h-6 w-6 mr-4" />
                <div>
                  <p className="font-medium">
                    {method.brand} ending in {method.last4}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Expires {method.expMonth}/{method.expYear}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline">Add Payment Method</Button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Account Credits</h3>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">${user?.credits || 0}</p>
              <p className="text-sm text-muted-foreground">Available credits</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

