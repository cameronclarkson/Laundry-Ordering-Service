"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface Customer {
  id: string
  created_at: string
  name: string
  email: string
  phone: string
  orders?: {
    id: string
    status: string
    total_amount: number
  }[]
}

export interface CustomerUpdateData {
  name?: string
  email?: string
  phone?: string
}

export interface CustomerCreateData {
  name: string
  email: string
  phone: string
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          orders (
            id,
            status,
            total_amount
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCustomers(data || [])
    } catch (err) {
      console.error('Error fetching customers:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch customers')
    } finally {
      setIsLoading(false)
    }
  }

  const createCustomer = async (customerData: CustomerCreateData) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select(`
          *,
          orders (
            id,
            status,
            total_amount
          )
        `)
        .single()

      if (error) throw error

      // Update local state after successful creation
      setCustomers([data, ...customers])
      
      return { success: true, data }
    } catch (err) {
      console.error('Error creating customer:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create customer'
      }
    }
  }

  const updateCustomer = async (id: string, updateData: CustomerUpdateData) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          orders (
            id,
            status,
            total_amount
          )
        `)
        .single()

      if (error) throw error

      // Update local state after successful update
      setCustomers(customers.map(customer => 
        customer.id === id ? { ...customer, ...data } : customer
      ))
      
      return { success: true, data }
    } catch (err) {
      console.error('Error updating customer:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update customer'
      }
    }
  }

  const deleteCustomer = async (id: string) => {
    try {
      // First check if customer has any orders
      const { data: customerData } = await supabase
        .from('customers')
        .select(`
          *,
          orders (
            id,
            status,
            total_amount
          )
        `)
        .eq('id', id)
        .single()

      if (customerData?.orders && customerData.orders.length > 0) {
        return { 
          success: false, 
          error: 'Cannot delete customer with existing orders. Please delete their orders first.' 
        }
      }

      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Update local state after successful deletion
      setCustomers(customers.filter(customer => customer.id !== id))
      return { success: true }
    } catch (err) {
      console.error('Error deleting customer:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete customer' }
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  return { 
    customers, 
    isLoading, 
    error, 
    createCustomer,
    updateCustomer,
    deleteCustomer, 
    refreshCustomers: fetchCustomers 
  }
} 