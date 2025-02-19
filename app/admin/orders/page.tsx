"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useOrders } from "@/lib/hooks/use-orders"
import { formatDistanceToNow } from "date-fns"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useToast } from "@/components/ui/use-toast"

export default function OrdersPage() {
  const { orders, isLoading, error, deleteOrder } = useOrders()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const { toast } = useToast()

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      order.id.toLowerCase().includes(searchLower) ||
      order.customers?.name.toLowerCase().includes(searchLower) ||
      order.customers?.email.toLowerCase().includes(searchLower) ||
      order.status.toLowerCase().includes(searchLower)
    )
  })

  const handleDelete = async (order: Order) => {
    setSelectedOrder(order)
    setDeleteDialogOpen(true)
  }

  const handleView = (order: Order) => {
    setSelectedOrder(order)
    setViewDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedOrder) return

    const result = await deleteOrder(selectedOrder.id)
    if (result.success) {
      toast({
        title: "Order deleted",
        description: `Order #${selectedOrder.id.slice(0, 8)} has been deleted.`,
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete order",
        variant: "destructive",
      })
    }
    setDeleteDialogOpen(false)
  }

  if (isLoading) return <div>Loading orders...</div>
  if (error) return <div>Error loading orders: {error}</div>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Orders</h1>
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Order</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Order</DialogTitle>
            </DialogHeader>
            {/* Add form fields here */}
            <p>Order form fields go here</p>
          </DialogContent>
        </Dialog>
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
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id.slice(0, 8)}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{order.customers?.name}</div>
                  <div className="text-sm text-muted-foreground">{order.customers?.email}</div>
                </div>
              </TableCell>
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
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2" onClick={() => handleView(order)}>
                  View
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(order)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Customer Information</h3>
                  <p>{selectedOrder.customers?.name}</p>
                  <p>{selectedOrder.customers?.email}</p>
                  <p>{selectedOrder.customers?.phone}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Order Information</h3>
                  <p>Status: {selectedOrder.status}</p>
                  <p>Total: ${selectedOrder.total_amount.toFixed(2)}</p>
                  <p>Date: {new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Order Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.order_items?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.services.name}</TableCell>
                        <TableCell>{item.services.description}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          ${(item.quantity * item.price).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Order"
        description={`Are you sure you want to delete order #${selectedOrder?.id.slice(0, 8)}? This action cannot be undone.`}
      />
    </div>
  )
}

