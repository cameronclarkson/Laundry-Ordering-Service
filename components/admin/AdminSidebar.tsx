"use client"

import { Home, ShoppingBasket, Users, Shirt, Truck, ArrowLeft, Globe, Phone, Tag } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function AdminSidebar() {
  const router = useRouter()

  return (
    <aside className="h-screen w-[220px] flex flex-col border-r bg-gradient-to-b from-blue-200 via-white to-white shadow-xl">
      <div className="flex items-center justify-center h-20 border-b border-blue-300">
        <h2 className="text-2xl font-bold text-blue-900">Admin</h2>
      </div>
      <nav className="flex-1 px-2 py-4">
        <div className="space-y-1">
          <Link href="/admin" className="flex items-center p-2 rounded-md hover:bg-blue-100 text-sm text-blue-900">
            <Home className="mr-2 h-4 w-4 text-blue-900" />
            Dashboard
          </Link>
          <Separator className="my-2" />
          <Link href="/admin/orders" className="flex items-center p-2 rounded-md hover:bg-blue-100 text-sm text-blue-900">
            <ShoppingBasket className="mr-2 h-4 w-4 text-blue-900" />
            Orders
          </Link>
          <Link href="/admin/customers" className="flex items-center p-2 rounded-md hover:bg-blue-100 text-sm text-blue-900">
            <Users className="mr-2 h-4 w-4 text-blue-900" />
            Customers
          </Link>
          <Link href="/admin/services" className="flex items-center p-2 rounded-md hover:bg-blue-100 text-sm text-blue-900">
            <Shirt className="mr-2 h-4 w-4 text-blue-900" />
            Services
          </Link>
          <Link href="/admin/deliveries" className="flex items-center p-2 rounded-md hover:bg-blue-100 text-sm text-blue-900">
            <Truck className="mr-2 h-4 w-4 text-blue-900" />
            Deliveries
          </Link>
          <Separator className="my-2" />
          <Link href="/admin/leads" className="flex items-center p-2 rounded-md hover:bg-blue-100 text-sm text-blue-900">
            <Phone className="mr-2 h-4 w-4 text-blue-900" />
            Leads
          </Link>
          <Link href="/admin/landing" className="flex items-center p-2 rounded-md hover:bg-blue-100 text-sm text-blue-900">
            <Globe className="mr-2 h-4 w-4 text-blue-900" />
            Landing Page
          </Link>
          <Link href="/special-offer" className="flex items-center p-2 rounded-md hover:bg-blue-100 text-sm bg-blue-100 text-blue-900 font-semibold">
            <Tag className="mr-2 h-4 w-4 text-blue-900" />
            Special Offer Page
          </Link>
        </div>
      </nav>
      <Separator className="my-4 border-blue-300" />
      <div className="px-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-blue-900 hover:text-blue-800 hover:bg-blue-100"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customer View
        </Button>
      </div>
    </aside>
  )
}

