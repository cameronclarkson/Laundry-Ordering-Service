import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <Button>Download Report</Button>
    </div>
  )
}

