"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useOrders } from "@/lib/hooks/use-orders"
import { supabase } from "@/lib/supabase"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface Order {
  id: string
  created_at: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  total_amount: number
  customer_id: string
  delivery_address?: string
  customers?: {
    name: string
    email: string
    phone: string
  }
  order_items?: {
    id: string
    quantity: number
    price: number
    services: {
      name: string
      description: string
    }
  }[]
}

interface Delivery {
  id: string
  order_id: string
  address: string
  driver: string
  status: "Scheduled" | "In Transit" | "Delivered" | "Delayed"
  scheduled_time: string
  customer_name?: string
  orders?: {
    customers?: {
      name: string
    }
  }
}

interface NewDeliveryData {
  order_id: string
  driver: string
  scheduled_time: string
}

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { orders } = useOrders()
  const { toast } = useToast()
  const [newDelivery, setNewDelivery] = useState<NewDeliveryData>({
    order_id: "",
    driver: "",
    scheduled_time: new Date().toISOString().slice(0, 16) // Format: YYYY-MM-DDThh:mm
  })

  // Fetch deliveries when component mounts
  useEffect(() => {
    fetchDeliveries()
  }, [])

  async function fetchDeliveries() {
    const { data: deliveriesData, error: deliveriesError } = await supabase
      .from('deliveries')
      .select(`
        *,
        orders (
          customers (
            name
          )
        )
      `)
      .order('scheduled_time', { ascending: false })

    if (!deliveriesError && deliveriesData) {
      setDeliveries(deliveriesData.map(delivery => ({
        ...delivery,
        customer_name: delivery.orders?.customers?.name
      })))
    }
    setIsLoading(false)
  }

  const handleNewDeliveryChange = (field: keyof NewDeliveryData, value: string) => {
    setNewDelivery(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Get the order's address from the selected order
    const selectedOrder = orders.find(order => order.id === newDelivery.order_id)
    if (!selectedOrder?.delivery_address) {
      toast({
        title: "Error",
        description: "Selected order does not have a delivery address. Please update the order with a delivery address first.",
        variant: "destructive"
      })
      setIsSubmitting(false)
      return
    }

    try {
      const { error: insertError } = await supabase
        .from('deliveries')
        .insert([{
          order_id: newDelivery.order_id,
          driver: newDelivery.driver,
          scheduled_time: newDelivery.scheduled_time,
          status: "Scheduled",
          address: selectedOrder.delivery_address
        }])

      if (insertError) throw insertError

      toast({
        title: "Success",
        description: "Delivery scheduled successfully"
      })

      // Refresh deliveries list
      await fetchDeliveries()
      setDialogOpen(false)
      
      // Reset form
      setNewDelivery({
        order_id: "",
        driver: "",
        scheduled_time: new Date().toISOString().slice(0, 16)
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule delivery",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredDeliveries = deliveries.filter(
    (delivery) =>
      delivery.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.driver.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteDelivery = async (id: string) => {
    const { error } = await supabase
      .from('deliveries')
      .delete()
      .eq('id', id)

    if (!error) {
      setDeliveries(deliveries.filter((delivery) => delivery.id !== id))
    }
  }

  const getStatusBadge = (status: string) => {
    let className = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium "
    switch (status) {
      case "In Transit":
        className += "bg-blue-100 text-blue-800"
        break
      case "Delivered":
        className += "bg-green-100 text-green-800"
        break
      case "Scheduled":
        className += "bg-yellow-100 text-yellow-800"
        break
      case "Delayed":
        className += "bg-red-100 text-red-800"
        break
      default:
        className += "bg-gray-100 text-gray-800"
    }
    return <span className={className}>{status}</span>
  }

  if (isLoading) return <div>Loading deliveries...</div>

  const undeliveredOrders = orders.filter(order => 
    !deliveries.some(delivery => delivery.order_id === order.id) &&
    order.status !== 'cancelled' &&
    order.delivery_address // Only show orders that have a delivery address
  )

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Deliveries</h1>
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search deliveries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setDialogOpen(true)}>Schedule New Delivery</Button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Scheduled Time</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDeliveries.map((delivery) => (
              <TableRow key={delivery.id}>
                <TableCell>{delivery.order_id.slice(0, 8)}</TableCell>
                <TableCell>{delivery.customer_name || 'Unknown'}</TableCell>
                <TableCell>{delivery.address}</TableCell>
                <TableCell>{delivery.driver}</TableCell>
                <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                <TableCell>{new Date(delivery.scheduled_time).toLocaleString()}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2">
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteDelivery(delivery.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Schedule New Delivery Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule New Delivery</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="order" className="text-right">
                  Order
                </Label>
                <Select
                  value={newDelivery.order_id}
                  onValueChange={(value) => handleNewDeliveryChange('order_id', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select an order" />
                  </SelectTrigger>
                  <SelectContent>
                    {undeliveredOrders.map((order) => (
                      <SelectItem key={order.id} value={order.id}>
                        #{order.id.slice(0, 8)} - {order.customers?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="driver" className="text-right">
                  Driver
                </Label>
                <Input
                  id="driver"
                  value={newDelivery.driver}
                  onChange={(e) => handleNewDeliveryChange('driver', e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="scheduled_time" className="text-right">
                  Scheduled Time
                </Label>
                <Input
                  id="scheduled_time"
                  type="datetime-local"
                  value={newDelivery.scheduled_time}
                  onChange={(e) => handleNewDeliveryChange('scheduled_time', e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Scheduling..." : "Schedule Delivery"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

