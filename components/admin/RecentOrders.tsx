"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useOrders } from "@/lib/hooks/use-orders"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

export function RecentOrders() {
  const { orders, isLoading, error } = useOrders()
  const router = useRouter()
  
  // Take only the 5 most recent orders
  const recentOrders = orders.slice(0, 5)

  if (isLoading) return <div>Loading orders...</div>
  if (error) return <div>Error loading orders: {error}</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Recent Orders</h2>
        <Button variant="outline" onClick={() => router.push('/admin/orders')}>
          View All Orders
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id.slice(0, 8)}</TableCell>
              <TableCell>{order.customers?.name}</TableCell>
              <TableCell>
                {order.order_items?.[0]?.services.name}
                {order.order_items?.length > 1 && ` +${order.order_items.length - 1} more`}
              </TableCell>
              <TableCell>${order.total_amount.toFixed(2)}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`
                }>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>{formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

