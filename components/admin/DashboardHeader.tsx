"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, Download, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { DateRange } from "react-day-picker"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Select as UiSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { saveAs } from "file-saver"
import { supabase } from '@/lib/supabase'
import ReportDownloadModal from './ReportDownloadModal'

function toCsv(rows: any[], fields: string[]): string {
  const header = fields.join(",")
  const csvRows = rows.map(row =>
    fields.map(f => {
      let val = row[f]
      if (typeof val === "string" && (val.includes(",") || val.includes("\""))) {
        val = '"' + val.replace(/"/g, '""') + '"'
      }
      return val
    }).join(",")
  )
  return [header, ...csvRows].join("\n")
}

export function DashboardHeader() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  })

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedFields, setSelectedFields] = useState<string[]>(["orderId", "customerName", "email", "total", "status", "date"])
  const [reportFormat, setReportFormat] = useState("csv")
  const fieldOptions = [
    { label: "Order ID", value: "orderId" },
    { label: "Customer Name", value: "customerName" },
    { label: "Email", value: "email" },
    { label: "Total", value: "total" },
    { label: "Status", value: "status" },
    { label: "Date", value: "date" },
  ]

  const handleRefresh = () => {
    setIsRefreshing(true)
    // In a real app, you would trigger a refresh of your data here
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  const handleFieldChange = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    )
  }

  const handleReportDownload = async ({ fields, startDate, endDate, fileFormat }) => {
    // Fetch orders from Supabase
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id,
        created_at,
        status,
        total_amount,
        customers (
          name,
          email
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      alert('Failed to fetch orders: ' + error.message)
      return
    }

    // Filter by date range
    let filtered = orders
    if (startDate && endDate) {
      const from = new Date(startDate).getTime()
      const to = new Date(endDate).getTime()
      filtered = orders.filter((order) => {
        const orderDate = new Date(order.created_at).getTime()
        return orderDate >= from && orderDate <= to
      })
    }

    // Map to selected fields
    const fieldMap = {
      user_id: o => o.id,
      username: o => o.customers?.name || '',
      email: o => o.customers?.email || '',
      registration_date: o => o.created_at,
      last_login: o => '', // Not available
      activity_count: o => '', // Not available
      subscription_status: o => '', // Not available
      orderId: o => o.id,
      customerName: o => o.customers?.name || '',
      total: o => o.total_amount,
      status: o => o.status,
      date: o => o.created_at,
    }
    const rows = filtered.map((order) => {
      const row = {}
      fields.forEach(f => {
        row[f] = fieldMap[f] ? fieldMap[f](order) : ''
      })
      return row
    })

    // Generate file
    let fileContent
    let fileName
    if (fileFormat === "csv") {
      fileContent = toCsv(rows, fields)
      fileName = `orders-report-${Date.now()}.csv`
    } else {
      fileContent = toCsv(rows, fields)
      fileName = `orders-report-${Date.now()}.csv`
    }
    const blob = new Blob([fileContent], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, fileName)
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 className="text-3xl font-bold tracking-tight text-blue-900">Dashboard</h1>
      <div className="flex flex-wrap items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal text-blue-900 border-blue-300 bg-blue-100 hover:bg-blue-200",
                !date && "text-slate-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-blue-900" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <Button variant="outline" size="icon" onClick={handleRefresh} className="border-blue-300 text-blue-900 bg-blue-100 hover:bg-blue-200">
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")}/>
        </Button>
        <ReportDownloadModal onDownload={handleReportDownload} />
      </div>
    </div>
  )
}

