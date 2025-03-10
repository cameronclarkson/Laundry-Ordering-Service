"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface Service {
  id: string
  name: string
  description: string
  price: number
  turnaround_time: string
  created_at: string
}

export interface ServiceUpdateData {
  name?: string
  description?: string
  price?: number
  turnaround_time?: string
}

export interface ServiceCreateData {
  name: string
  description: string
  price: number
  turnaround_time: string
}

interface OrderItemWithOrder {
  id: string
  order_id: string
  orders: {
    id: string
    order_items: Array<{
      id: string
      service_id: string
    }>
  }
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setServices(data || [])
    } catch (err) {
      console.error('Error fetching services:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch services')
    } finally {
      setIsLoading(false)
    }
  }

  const createService = async (serviceData: ServiceCreateData) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([serviceData])
        .select()
        .single()

      if (error) throw error

      // Update local state after successful creation
      setServices([data, ...services])
      
      return { success: true, data }
    } catch (err) {
      console.error('Error creating service:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create service'
      }
    }
  }

  const updateService = async (id: string, updateData: ServiceUpdateData) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Update local state after successful update
      setServices(services.map(service => 
        service.id === id ? { ...service, ...data } : service
      ))
      
      return { success: true, data }
    } catch (err) {
      console.error('Error updating service:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update service'
      }
    }
  }

  const canDeleteService = async (id: string) => {
    try {
      // Check if there are any order items using this service
      const { data: orderItems, error: checkError } = await supabase
        .from('order_items')
        .select('id')
        .eq('service_id', id)
        .limit(1)

      if (checkError) throw checkError

      // If there are order items using this service, return false
      if (orderItems && orderItems.length > 0) {
        return { 
          canDelete: false, 
          error: 'Cannot delete this service because it is being used in one or more orders. Please remove all orders using this service first.'
        }
      }

      // If no order items are using this service, return true
      return { canDelete: true }
    } catch (err) {
      console.error('Error checking if service can be deleted:', err)
      return { 
        canDelete: false, 
        error: err instanceof Error ? err.message : 'Failed to check if service can be deleted'
      }
    }
  }

  const deleteService = async (id: string) => {
    try {
      // First, get all order IDs that use this service
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select('order_id')
        .eq('service_id', id)

      if (itemsError) throw itemsError

      if (orderItems && orderItems.length > 0) {
        // Get unique order IDs
        const orderIds = [...new Set(orderItems.map(item => item.order_id))]

        // First delete deliveries for all affected orders
        const { error: deliveriesError } = await supabase
          .from('deliveries')
          .delete()
          .in('order_id', orderIds)

        if (deliveriesError) throw deliveriesError

        // Delete all order items for these orders
        const { error: deleteItemsError } = await supabase
          .from('order_items')
          .delete()
          .in('order_id', orderIds)

        if (deleteItemsError) throw deleteItemsError

        // Delete all affected orders
        const { error: deleteOrdersError } = await supabase
          .from('orders')
          .delete()
          .in('id', orderIds)

        if (deleteOrdersError) throw deleteOrdersError
      }

      // Finally, delete the service
      const { error: deleteServiceError } = await supabase
        .from('services')
        .delete()
        .eq('id', id)

      if (deleteServiceError) throw deleteServiceError

      setServices(services.filter(service => service.id !== id))
      return { success: true }
    } catch (err) {
      console.error('Error deleting service:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete service and related records.'
      }
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  return { 
    services, 
    isLoading, 
    error, 
    createService,
    updateService,
    canDeleteService,
    deleteService, 
    refreshServices: fetchServices 
  }
} 