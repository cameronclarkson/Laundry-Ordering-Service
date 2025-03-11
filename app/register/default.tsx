import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterDefault() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Create an Account</CardTitle>
            <CardDescription>
              Sign up for a new account to start using our laundry service
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p>Loading registration form...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 