"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useOrders } from "@/lib/hooks/use-orders"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function RecentOrders() {
  const { orders, isLoading, error } = useOrders()
  const router = useRouter()
  
  // Take only the 5 most recent orders
  const recentOrders = orders.slice(0, 5)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Recent Orders</h2>
        <Button variant="outline" onClick={() => router.push('/admin/orders')}>
          View All Orders
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

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
          {isLoading ? (
            // Loading skeleton
            Array(5).fill(0).map((_, index) => (
              <TableRow key={`loading-${index}`}>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              </TableRow>
            ))
          ) : recentOrders.length === 0 ? (
            // No orders found
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            // Orders data
            recentOrders.map((order) => (
              <TableRow 
                key={order.id} 
                className="cursor-pointer hover:bg-muted/50" 
                onClick={() => router.push(`/admin/orders/${order.id}`)}
              >
                <TableCell>{order.id.slice(0, 8)}</TableCell>
                <TableCell>{order.customers?.name || 'Unknown'}</TableCell>
                <TableCell>
                  {order.order_items?.[0]?.services.name || 'N/A'}
                  {order.order_items && order.order_items.length > 1 && 
                    ` +${order.order_items.length - 1} more`}
                </TableCell>
                <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                <TableCell>
                  <span 
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`
                    }
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
} 