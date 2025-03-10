"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface Order {
  id: string
  created_at: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  total_amount: number
  customer_id: string
  delivery_address?: string
  customers?: {
    name: string
    email: string
    phone: string
  }
  order_items?: {
    id: string
    quantity: number
    price: number
    services: {
      name: string
      description: string
    }
  }[]
}

interface SupabaseOrder {
  id: string
  created_at: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  total_amount: number
  customer_id: string
  customers: {
    name: string
    email: string
    phone: string
  } | null
  order_items: Array<{
    id: string
    quantity: number
    price: number
    services: {
      name: string
      description: string
    }
  }> | null
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          status,
          total_amount,
          customer_id,
          customers (
            name,
            email,
            phone
          ),
          order_items (
            id,
            quantity,
            price,
            services (
              name,
              description
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Type assertion to ensure data matches our Order interface
      const rawData = data as unknown
      const typedData = (rawData as SupabaseOrder[])?.map(order => ({
        ...order,
        delivery_address: '', // Add empty string as default
        customers: order.customers || undefined,
        order_items: order.order_items || undefined
      })) as Order[]

      setOrders(typedData || [])
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteOrder = async (id: string) => {
    try {
      // First delete related deliveries
      const { error: deliveriesError } = await supabase
        .from('deliveries')
        .delete()
        .eq('order_id', id)

      if (deliveriesError) throw deliveriesError

      // Then delete related order_items
      const { error: itemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', id)

      if (itemsError) throw itemsError

      // Finally delete the order
      const { error: orderError } = await supabase
        .from('orders')
        .delete()
        .eq('id', id)

      if (orderError) throw orderError

      // Update local state after successful deletion
      setOrders(orders.filter(order => order.id !== id))
      return { success: true }
    } catch (err) {
      console.error('Error deleting order:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete order and related records.'
      }
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return { orders, isLoading, error, deleteOrder, refreshOrders: fetchOrders }
} 