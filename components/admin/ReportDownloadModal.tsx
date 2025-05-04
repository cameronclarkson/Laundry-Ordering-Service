"use client"

import * as React from "react"
import { Calendar, Download, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface ReportDownloadModalProps {
  onDownload?: (data: ReportDownloadData) => void
}

interface ReportDownloadData {
  fields: string[]
  startDate: Date | undefined
  endDate: Date | undefined
  fileFormat: "csv" | "excel"
}

const ReportDownloadModal: React.FC<ReportDownloadModalProps> = ({ onDownload }) => {
  const [selectedFields, setSelectedFields] = React.useState<string[]>([])
  const [startDate, setStartDate] = React.useState<Date>()
  const [endDate, setEndDate] = React.useState<Date>()
  const [fileFormat, setFileFormat] = React.useState<"csv" | "excel">("csv")

  const availableFields = [
    { id: "user_id", label: "User ID" },
    { id: "username", label: "Username" },
    { id: "email", label: "Email" },
    { id: "registration_date", label: "Registration Date" },
    { id: "last_login", label: "Last Login" },
    { id: "activity_count", label: "Activity Count" },
    { id: "subscription_status", label: "Subscription Status" },
  ]

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldId) 
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    )
  }

  const handleDownload = () => {
    if (onDownload) {
      onDownload({
        fields: selectedFields,
        startDate,
        endDate,
        fileFormat,
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-blue-600">Download Report</DialogTitle>
          <DialogDescription>
            Customize your report by selecting the fields and date range you need.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <Label className="text-base font-medium">Select Fields</Label>
            <div className="grid grid-cols-2 gap-3">
              {availableFields.map((field) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={field.id} 
                    checked={selectedFields.includes(field.id)}
                    onCheckedChange={() => handleFieldToggle(field.id)}
                  />
                  <Label htmlFor={field.id} className="cursor-pointer">
                    {field.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">Date Range</Label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="startDate">Start Date</Label>
                <div className="relative">
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
                    onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : undefined)}
                    className="pr-10"
                  />
                  <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="endDate">End Date</Label>
                <div className="relative">
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
                    onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : undefined)}
                    className="pr-10"
                  />
                  <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="fileFormat" className="text-base font-medium">File Format</Label>
            <Select value={fileFormat} onValueChange={(value: "csv" | "excel") => setFileFormat(value)}>
              <SelectTrigger id="fileFormat" className="w-full">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button 
            type="button" 
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ReportDownloadModal 