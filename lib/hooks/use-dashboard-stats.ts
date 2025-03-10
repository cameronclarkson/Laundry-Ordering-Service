"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  activeCustomers: number
  growthRate: number
  orderGrowth: number
  revenueGrowth: number
  customerGrowth: number
  isLoading: boolean
  error: string | null
}

export function useDashboardStats(): DashboardStats {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    activeCustomers: 0,
    growthRate: 0,
    orderGrowth: 0,
    revenueGrowth: 0,
    customerGrowth: 0,
    isLoading: true,
    error: null
  })

  const fetchStats = async () => {
    try {
      // Get current date and date 30 days ago
      const now = new Date()
      const thirtyDaysAgo = new Date(now)
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const sixtyDaysAgo = new Date(now)
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

      // Format dates for Supabase queries
      const nowStr = now.toISOString()
      const thirtyDaysAgoStr = thirtyDaysAgo.toISOString()
      const sixtyDaysAgoStr = sixtyDaysAgo.toISOString()

      // Get total orders
      const { count: totalOrders, error: ordersError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })

      if (ordersError) throw ordersError

      // Get total revenue
      const { data: revenueData, error: revenueError } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'completed')

      if (revenueError) throw revenueError

      const totalRevenue = revenueData.reduce((sum, order) => sum + order.total_amount, 0)

      // Get active customers (customers with at least one order)
      const { count: activeCustomers, error: customersError } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })

      if (customersError) throw customersError

      // Get orders from last 30 days
      const { count: recentOrders, error: recentOrdersError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgoStr)
        .lte('created_at', nowStr)

      if (recentOrdersError) throw recentOrdersError

      // Get orders from 30-60 days ago
      const { count: previousOrders, error: previousOrdersError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sixtyDaysAgoStr)
        .lt('created_at', thirtyDaysAgoStr)

      if (previousOrdersError) throw previousOrdersError

      // Get revenue from last 30 days
      const { data: recentRevenueData, error: recentRevenueError } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'completed')
        .gte('created_at', thirtyDaysAgoStr)
        .lte('created_at', nowStr)

      if (recentRevenueError) throw recentRevenueError

      const recentRevenue = recentRevenueData.reduce((sum, order) => sum + order.total_amount, 0)

      // Get revenue from 30-60 days ago
      const { data: previousRevenueData, error: previousRevenueError } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'completed')
        .gte('created_at', sixtyDaysAgoStr)
        .lt('created_at', thirtyDaysAgoStr)

      if (previousRevenueError) throw previousRevenueError

      const previousRevenue = previousRevenueData.reduce((sum, order) => sum + order.total_amount, 0)

      // Get customers from last 30 days
      const { count: recentCustomers, error: recentCustomersError } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgoStr)
        .lte('created_at', nowStr)

      if (recentCustomersError) throw recentCustomersError

      // Get customers from 30-60 days ago
      const { count: previousCustomers, error: previousCustomersError } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sixtyDaysAgoStr)
        .lt('created_at', thirtyDaysAgoStr)

      if (previousCustomersError) throw previousCustomersError

      // Calculate growth rates
      const safeRecentOrders = recentOrders || 0
      const safePreviousOrders = previousOrders || 0
      const safeRecentCustomers = recentCustomers || 0
      const safePreviousCustomers = previousCustomers || 0

      const orderGrowth = safePreviousOrders > 0 
        ? ((safeRecentOrders - safePreviousOrders) / safePreviousOrders) * 100 
        : safeRecentOrders > 0 ? 100 : 0

      const revenueGrowth = previousRevenue > 0 
        ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 
        : recentRevenue > 0 ? 100 : 0

      const customerGrowth = safePreviousCustomers > 0 
        ? ((safeRecentCustomers - safePreviousCustomers) / safePreviousCustomers) * 100 
        : safeRecentCustomers > 0 ? 100 : 0

      // Overall growth rate (average of the three)
      const growthRate = (orderGrowth + revenueGrowth + customerGrowth) / 3

      setStats({
        totalOrders: totalOrders || 0,
        totalRevenue,
        activeCustomers: activeCustomers || 0,
        growthRate,
        orderGrowth,
        revenueGrowth,
        customerGrowth,
        isLoading: false,
        error: null
      })
    } catch (err) {
      console.error('Error fetching dashboard stats:', err)
      setStats({
        ...stats,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch dashboard statistics'
      })
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return stats
} 