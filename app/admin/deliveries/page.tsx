"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Mock data for deliveries
const initialDeliveries = [
  {
    id: "1",
    orderId: "ORD001",
    customer: "John Doe",
    address: "123 Main St, Anytown, USA",
    driver: "Mike Johnson",
    status: "In Transit",
    scheduledTime: "2023-06-10 14:00",
  },
  {
    id: "2",
    orderId: "ORD002",
    customer: "Jane Smith",
    address: "456 Elm St, Othertown, USA",
    driver: "Sarah Lee",
    status: "Delivered",
    scheduledTime: "2023-06-09 10:30",
  },
  {
    id: "3",
    orderId: "ORD003",
    customer: "Bob Brown",
    address: "789 Oak St, Somewhere, USA",
    driver: "Tom Wilson",
    status: "Scheduled",
    scheduledTime: "2023-06-11 16:45",
  },
  {
    id: "4",
    orderId: "ORD004",
    customer: "Alice Green",
    address: "321 Pine St, Nowhere, USA",
    driver: "Emma Davis",
    status: "Delayed",
    scheduledTime: "2023-06-10 09:15",
  },
  {
    id: "5",
    orderId: "ORD005",
    customer: "Charlie White",
    address: "654 Maple St, Elsewhere, USA",
    driver: "Chris Taylor",
    status: "In Transit",
    scheduledTime: "2023-06-10 13:30",
  },
]

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState(initialDeliveries)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDeliveries = deliveries.filter(
    (delivery) =>
      delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.driver.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteDelivery = (id: string) => {
    setDeliveries(deliveries.filter((delivery) => delivery.id !== id))
  }

  const getStatusBadge = (status: string) => {
    let className = "px-2 py-1 text-xs font-semibold rounded-full "
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
        <Dialog>
          <DialogTrigger asChild>
            <Button>Schedule New Delivery</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Delivery</DialogTitle>
            </DialogHeader>
            {/* Add form fields here */}
            <p>Delivery scheduling form fields go here</p>
          </DialogContent>
        </Dialog>
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
                <TableCell>{delivery.orderId}</TableCell>
                <TableCell>{delivery.customer}</TableCell>
                <TableCell>{delivery.address}</TableCell>
                <TableCell>{delivery.driver}</TableCell>
                <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                <TableCell>{delivery.scheduledTime}</TableCell>
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
    </div>
  )
}

