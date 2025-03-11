import { redirect } from 'next/navigation'

// Simple redirect page
export default function RegisterPage() {
  // Redirect to signup page
  redirect('/signup')
}