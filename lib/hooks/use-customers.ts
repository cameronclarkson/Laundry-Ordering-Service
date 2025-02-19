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

  const deleteCustomer = async (id: string) => {
    try {
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

  return { customers, isLoading, error, deleteCustomer, refreshCustomers: fetchCustomers }
} 