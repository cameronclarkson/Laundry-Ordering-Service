import { Metadata } from "next"
import RegisterClient from "../components/register-client"

export const metadata: Metadata = {
  title: "Sign Up - Laundry Service",
  description: "Create a new account for our laundry service",
}

// Configure this page to be dynamically rendered
export const dynamic = 'force-dynamic'

// This is a server component that can be statically generated
export default function SignupPage() {
  return <RegisterClient />
}