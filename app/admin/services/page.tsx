"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useServices, type Service } from "@/lib/hooks/use-services"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useToast } from "@/components/ui/use-toast"

export default function ServicesPage() {
  const { services, isLoading, error, deleteService } = useServices()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  const filteredServices = services.filter((service) => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (service: Service) => {
    setSelectedService(service)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedService) return

    const result = await deleteService(selectedService.id)
    if (result.success) {
      toast({
        title: "Service deleted",
        description: `${selectedService.name} has been deleted.`,
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete service",
        variant: "destructive",
      })
    }
    setDeleteDialogOpen(false)
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
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Service</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
            </DialogHeader>
            {/* Add form fields here */}
            <p>Service form fields go here</p>
          </DialogContent>
        </Dialog>
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
                <Button variant="outline" size="sm" className="mr-2">
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Service"
        description={`Are you sure you want to delete ${selectedService?.name}? This action cannot be undone.`}
      />
    </div>
  )
}

