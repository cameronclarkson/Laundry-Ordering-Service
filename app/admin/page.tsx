import { DashboardHeader } from "@/components/admin/DashboardHeader"
import { DashboardSummary } from "@/components/admin/DashboardSummary"
import { RecentOrders } from "@/components/admin/RecentOrders"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <DashboardSummary />
      <RecentOrders />
    </div>
  )
}

