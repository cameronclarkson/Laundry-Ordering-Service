"use client"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import type React from "react"
import { useAuth } from "@/lib/auth-context"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()

  if (!user) {
    return <div className="flex items-center justify-center h-screen text-xl">Please log in to access the admin dashboard.</div>
  }

  if (!user.user_metadata?.isAdmin) {
    return <div className="flex items-center justify-center h-screen text-xl text-red-600">Unauthorized: Admin access only.</div>
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  )
}

