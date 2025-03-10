"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { useServices, type Service, ServiceUpdateData, ServiceCreateData } from "@/lib/hooks/use-services"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"

export default function ServicesPage() {
  const { services, isLoading, error, createService, updateService, canDeleteService, deleteService } = useServices()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isCheckingDelete, setIsCheckingDelete] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState<ServiceUpdateData>({
    name: "",
    description: "",
    price: 0,
    turnaround_time: ""
  })

  const [newServiceData, setNewServiceData] = useState<ServiceCreateData>({
    name: "",
    description: "",
    price: 0,
    turnaround_time: ""
  })

  const filteredServices = services.filter((service) => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      turnaround_time: service.turnaround_time
    })
  }

  const handleDelete = async (service: Service) => {
    setSelectedService(service)
    setDeleteDialogOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }))
  }

  const handleNewServiceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewServiceData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingService) return

    setIsSubmitting(true)
    
    try {
      const result = await updateService(editingService.id, formData)
      
      if (result.success) {
        toast({
          title: "Service updated",
          description: "Service information has been updated successfully.",
        })
        setEditingService(null)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update service",
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

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsCreating(true)
    
    try {
      const result = await createService(newServiceData)
      
      if (result.success) {
        toast({
          title: "Service created",
          description: "New service has been created successfully.",
        })
        setAddDialogOpen(false)
        // Reset form
        setNewServiceData({
          name: "",
          description: "",
          price: 0,
          turnaround_time: ""
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create service",
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
    if (!selectedService) return

    try {
      const result = await deleteService(selectedService.id)
      if (result.success) {
        toast({
          title: "Service deleted",
          description: `${selectedService.name} has been deleted along with all related orders.`,
        })
      } else {
        toast({
          title: "Error deleting service",
          description: result.error || "Failed to delete service",
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
      setSelectedService(null)
    }
  }

  if (isLoading) return <div>Loading services...</div>
  if (error) return <div>Error loading services: {error}</div>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Services</h1>
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setAddDialogOpen(true)}>Add New Service</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Turnaround Time</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredServices.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell>{service.description}</TableCell>
              <TableCell>${service.price.toFixed(2)}</TableCell>
              <TableCell>{service.turnaround_time}</TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mr-2"
                  onClick={() => handleEdit(service)}
                >
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(service)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Service Dialog */}
      <Dialog open={!!editingService} onOpenChange={(open) => !open && setEditingService(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
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
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price ($)
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="turnaround_time" className="text-right">
                  Turnaround Time
                </Label>
                <Input
                  id="turnaround_time"
                  name="turnaround_time"
                  value={formData.turnaround_time}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="e.g. 24 hours, 2-3 days"
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

      {/* Add New Service Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateService}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="new-name"
                  name="name"
                  value={newServiceData.name}
                  onChange={handleNewServiceInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-description" className="text-right">
                  Description
                </Label>
                <Input
                  id="new-description"
                  name="description"
                  value={newServiceData.description}
                  onChange={handleNewServiceInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-price" className="text-right">
                  Price ($)
                </Label>
                <Input
                  id="new-price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newServiceData.price}
                  onChange={handleNewServiceInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-turnaround_time" className="text-right">
                  Turnaround Time
                </Label>
                <Input
                  id="new-turnaround_time"
                  name="turnaround_time"
                  value={newServiceData.turnaround_time}
                  onChange={handleNewServiceInputChange}
                  className="col-span-3"
                  placeholder="e.g. 24 hours, 2-3 days"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Service"}
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
        title="Delete Service"
        description={`Are you sure you want to delete ${selectedService?.name}? This will also delete all orders that use this service. This action cannot be undone.`}
      />
    </div>
  )
}

