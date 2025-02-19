"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useCustomers } from "@/lib/hooks/use-customers"
import { formatDistanceToNow } from "date-fns"

export default function CustomersPage() {
  const { customers, isLoading, error } = useCustomers()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.phone.toLowerCase().includes(searchLower)
    )
  })

  if (isLoading) return <div>Loading customers...</div>
  if (error) return <div>Error loading customers: {error}</div>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Customers</h1>
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Customer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            {/* Add form fields here */}
            <p>Customer form fields go here</p>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Total Orders</TableHead>
            <TableHead>Total Spent</TableHead>
            <TableHead>Customer Since</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCustomers.map((customer) => {
            const totalOrders = customer.orders?.length || 0
            const totalSpent = customer.orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

            return (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{totalOrders}</TableCell>
                <TableCell>${totalSpent.toFixed(2)}</TableCell>
                <TableCell>{formatDistanceToNow(new Date(customer.created_at), { addSuffix: true })}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2">
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

