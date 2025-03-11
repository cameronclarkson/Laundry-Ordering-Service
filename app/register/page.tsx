import { redirect } from 'next/navigation'

// This page simply redirects to the new signup page
export default function RegisterRedirect() {
  redirect('/signup')
}