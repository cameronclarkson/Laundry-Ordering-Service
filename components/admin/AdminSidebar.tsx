"use client"

import { Home, ShoppingBasket, Users, Shirt, Truck, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function AdminSidebar() {
  const router = useRouter()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen p-4 flex flex-col">
      <div className="px-2">
        <h2 className="text-xl font-bold mb-4">Laundry Admin</h2>
      </div>
      <Separator className="mb-4" />
      <nav className="flex-1 px-2">
        <div className="space-y-1">
          <Link href="/admin" className="flex items-center p-2 rounded-md hover:bg-gray-100 text-sm">
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
          <Separator className="my-2" />
          <Link href="/admin/orders" className="flex items-center p-2 rounded-md hover:bg-gray-100 text-sm">
            <ShoppingBasket className="mr-2 h-4 w-4" />
            Orders
          </Link>
          <Link href="/admin/customers" className="flex items-center p-2 rounded-md hover:bg-gray-100 text-sm">
            <Users className="mr-2 h-4 w-4" />
            Customers
          </Link>
          <Link href="/admin/services" className="flex items-center p-2 rounded-md hover:bg-gray-100 text-sm">
            <Shirt className="mr-2 h-4 w-4" />
            Services
          </Link>
          <Link href="/admin/deliveries" className="flex items-center p-2 rounded-md hover:bg-gray-100 text-sm">
            <Truck className="mr-2 h-4 w-4" />
            Deliveries
          </Link>
        </div>
      </nav>
      <Separator className="my-4" />
      <div className="px-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customer View
        </Button>
      </div>
    </aside>
  )
}

