"use client"

import { Home, ShoppingBasket, Users, Shirt, Truck, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function AdminSidebar() {
  const router = useRouter()

  return (
    <aside className="w-64 bg-gray-100 h-screen p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-6">Laundry Admin</h2>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link href="/admin" className="flex items-center p-2 rounded hover:bg-gray-200">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/admin/orders" className="flex items-center p-2 rounded hover:bg-gray-200">
              <ShoppingBasket className="mr-2 h-4 w-4" />
              Orders
            </Link>
          </li>
          <li>
            <Link href="/admin/customers" className="flex items-center p-2 rounded hover:bg-gray-200">
              <Users className="mr-2 h-4 w-4" />
              Customers
            </Link>
          </li>
          <li>
            <Link href="/admin/services" className="flex items-center p-2 rounded hover:bg-gray-200">
              <Shirt className="mr-2 h-4 w-4" />
              Services
            </Link>
          </li>
          <li>
            <Link href="/admin/deliveries" className="flex items-center p-2 rounded hover:bg-gray-200">
              <Truck className="mr-2 h-4 w-4" />
              Deliveries
            </Link>
          </li>
        </ul>
      </nav>
      {/* Back to Customer View Button */}
      <div className="pt-4 mt-4 border-t border-gray-300">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-200"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customer View
        </Button>
      </div>
    </aside>
  )
}

