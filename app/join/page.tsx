import { Metadata } from "next"
import RegisterClient from "../components/register-client"

export const metadata: Metadata = {
  title: "Join - Laundry Service",
  description: "Create a new account for our laundry service",
}

// This is a server component that can be statically generated
export default function JoinPage() {
  return <RegisterClient />
}