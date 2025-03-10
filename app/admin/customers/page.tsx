"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { useCustomers, CustomerUpdateData, CustomerCreateData, Customer } from "@/lib/hooks/use-customers"
import { formatDistanceToNow } from "date-fns"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

export default function CustomersPage() {
  const { customers, isLoading, error, createCustomer, updateCustomer, deleteCustomer } = useCustomers()
  const [searchTerm, setSearchTerm] = useState("")
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [formData, setFormData] = useState<CustomerUpdateData>({
    name: "",
    email: "",
    phone: ""
  })
  const [newCustomerData, setNewCustomerData] = useState<CustomerCreateData>({
    name: "",
    email: "",
    phone: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const { toast } = useToast()

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.phone.toLowerCase().includes(searchLower)
    )
  })

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone
    })
  }

  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer)
    setDeleteDialogOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNewCustomerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewCustomerData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCustomer) return

    setIsSubmitting(true)
    
    try {
      const result = await updateCustomer(editingCustomer.id, formData)
      
      if (result.success) {
        toast({
          title: "Customer updated",
          description: "Customer information has been updated successfully.",
        })
        setEditingCustomer(null)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update customer",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsCreating(true)
    
    try {
      const result = await createCustomer(newCustomerData)
      
      if (result.success) {
        toast({
          title: "Customer created",
          description: "New customer has been created successfully.",
        })
        setAddDialogOpen(false)
        // Reset form
        setNewCustomerData({
          name: "",
          email: "",
          phone: ""
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create customer",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const confirmDelete = async () => {
    if (!selectedCustomer) return

    try {
      const result = await deleteCustomer(selectedCustomer.id)
      
      if (result.success) {
        toast({
          title: "Customer deleted",
          description: `${selectedCustomer.name} has been deleted.`,
        })
      } else {
        toast({
          title: "Cannot delete customer",
          description: result.error || "Failed to delete customer",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
    }
  }

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
        <Button onClick={() => setAddDialogOpen(true)}>Add New Customer</Button>
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
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(customer)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(customer)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {/* Edit Customer Dialog */}
      <Dialog open={!!editingCustomer} onOpenChange={(open) => !open && setEditingCustomer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add New Customer Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateCustomer}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="new-name"
                  name="name"
                  value={newCustomerData.name}
                  onChange={handleNewCustomerInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="new-email"
                  name="email"
                  type="email"
                  value={newCustomerData.email}
                  onChange={handleNewCustomerInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="new-phone"
                  name="phone"
                  value={newCustomerData.phone}
                  onChange={handleNewCustomerInputChange}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Customer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title={
          selectedCustomer?.orders && selectedCustomer.orders.length > 0
            ? "Cannot Delete Customer"
            : "Delete Customer"
        }
        description={
          selectedCustomer?.orders && selectedCustomer.orders.length > 0
            ? `This customer has ${selectedCustomer.orders.length} active order${
                selectedCustomer.orders.length === 1 ? '' : 's'
              }. You must delete their orders first before deleting the customer.`
            : `Are you sure you want to delete ${selectedCustomer?.name}? This action cannot be undone.`
        }
        actionText={
          selectedCustomer?.orders && selectedCustomer.orders.length > 0
            ? "Ok"
            : "Delete"
        }
      />
    </div>
  )
}

