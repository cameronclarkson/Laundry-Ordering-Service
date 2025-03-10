"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBasket, DollarSign, Users, TrendingUp } from "lucide-react"
import { useDashboardStats } from "@/lib/hooks/use-dashboard-stats"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSummary() {
  const { 
    totalOrders, 
    totalRevenue, 
    activeCustomers, 
    growthRate,
    orderGrowth,
    revenueGrowth,
    customerGrowth,
    isLoading, 
    error 
  } = useDashboardStats()

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-md">
        Error loading dashboard data: {error}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ShoppingBasket className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <>
              <div className="text-2xl font-bold">{totalOrders.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {orderGrowth >= 0 ? "+" : ""}{orderGrowth.toFixed(1)}% from last month
              </p>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <p className="text-xs text-muted-foreground">
                {revenueGrowth >= 0 ? "+" : ""}{revenueGrowth.toFixed(1)}% from last month
              </p>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <>
              <div className="text-2xl font-bold">{activeCustomers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {customerGrowth >= 0 ? "+" : ""}{customerGrowth.toFixed(1)}% from last month
              </p>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <>
              <div className="text-2xl font-bold">{growthRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Overall business growth
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

