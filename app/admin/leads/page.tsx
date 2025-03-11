"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [filteredLeads, setFilteredLeads] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [selectedLeadNotes, setSelectedLeadNotes] = useState("")
  const [showConverted, setShowConverted] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchLeads()
  }, [])

  useEffect(() => {
    if (leads.length > 0) {
      const filtered = leads.filter(lead => {
        // Filter by search term
        const matchesSearch = 
          lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.phone?.toLowerCase().includes(searchTerm.toLowerCase())
        
        // Filter by conversion status
        const matchesConversion = showConverted || !lead.converted
        
        return matchesSearch && matchesConversion
      })
      
      setFilteredLeads(filtered)
    }
  }, [leads, searchTerm, showConverted])

  const fetchLeads = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      setLeads(data || [])
      setFilteredLeads(data || [])
    } catch (error: any) {
      console.error("Error fetching leads:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to load leads",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenLeadDetails = (lead: any) => {
    setSelectedLead(lead)
    setSelectedLeadNotes(lead.notes || "")
  }

  const handleCloseLeadDetails = () => {
    setSelectedLead(null)
    setSelectedLeadNotes("")
  }

  const handleSaveNotes = async () => {
    if (!selectedLead) return
    
    try {
      const { error } = await supabase
        .from('leads')
        .update({ 
          notes: selectedLeadNotes,
          updated_at: new Date()
        })
        .eq('id', selectedLead.id)
      
      if (error) throw error
      
      // Update the lead in the local state
      const updatedLeads = leads.map(lead => 
        lead.id === selectedLead.id ? { ...lead, notes: selectedLeadNotes } : lead
      )
      setLeads(updatedLeads)
      
      toast({
        title: "Success",
        description: "Lead notes updated successfully",
      })
      
      handleCloseLeadDetails()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update lead notes",
        variant: "destructive",
      })
    }
  }

  const handleToggleConvertedStatus = async (lead: any) => {
    try {
      const newStatus = !lead.converted
      
      const { error } = await supabase
        .from('leads')
        .update({ 
          converted: newStatus,
          updated_at: new Date()
        })
        .eq('id', lead.id)
      
      if (error) throw error
      
      // Update the lead in the local state
      const updatedLeads = leads.map(l => 
        l.id === lead.id ? { ...l, converted: newStatus } : l
      )
      setLeads(updatedLeads)
      
      toast({
        title: "Success",
        description: `Lead marked as ${newStatus ? 'converted' : 'not converted'}`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update lead status",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Leads Management</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={fetchLeads}>
            Refresh
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Leads</CardTitle>
          <CardDescription>Search and filter your leads</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="showConverted" 
              checked={showConverted}
              onCheckedChange={(checked) => setShowConverted(checked as boolean)}
            />
            <Label htmlFor="showConverted">Show converted leads</Label>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading leads...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p>No leads found. Try adjusting your filters or check back later.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableCaption>A list of leads collected from your landing page.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id} className={lead.converted ? "bg-gray-50" : ""}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.phone || "—"}</TableCell>
                    <TableCell>{lead.source || "landing_page"}</TableCell>
                    <TableCell>
                      {lead.created_at && format(new Date(lead.created_at), "PP")}
                    </TableCell>
                    <TableCell>
                      <span className={lead.converted ? "text-green-600" : "text-yellow-600"}>
                        {lead.converted ? "Converted" : "Pending"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleOpenLeadDetails(lead)}
                        >
                          Details
                        </Button>
                        <Button
                          variant={lead.converted ? "ghost" : "outline"}
                          size="sm"
                          onClick={() => handleToggleConvertedStatus(lead)}
                        >
                          {lead.converted ? "Mark Pending" : "Mark Converted"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Lead Details Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && handleCloseLeadDetails()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>
              View and manage lead information
            </DialogDescription>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <p className="border p-2 rounded-md bg-gray-50">{selectedLead.name}</p>
              </div>
              
              <div className="space-y-2">
                <Label>Email</Label>
                <p className="border p-2 rounded-md bg-gray-50">{selectedLead.email}</p>
              </div>
              
              <div className="space-y-2">
                <Label>Phone</Label>
                <p className="border p-2 rounded-md bg-gray-50">{selectedLead.phone || "—"}</p>
              </div>
              
              <div className="space-y-2">
                <Label>Source</Label>
                <p className="border p-2 rounded-md bg-gray-50">{selectedLead.source || "landing_page"}</p>
              </div>
              
              <div className="space-y-2">
                <Label>Date</Label>
                <p className="border p-2 rounded-md bg-gray-50">
                  {selectedLead.created_at && format(new Date(selectedLead.created_at), "PPpp")}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={selectedLeadNotes}
                  onChange={(e) => setSelectedLeadNotes(e.target.value)}
                  placeholder="Add notes about this lead..."
                  rows={4}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseLeadDetails}>
              Cancel
            </Button>
            <Button onClick={handleSaveNotes}>
              Save Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 