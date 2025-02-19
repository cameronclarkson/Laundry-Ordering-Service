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

  const deleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)

      if (error) throw error

      setServices(services.filter(service => service.id !== id))
      return { success: true }
    } catch (err) {
      console.error('Error deleting service:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete service'
      }
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  return { services, isLoading, error, deleteService, refreshServices: fetchServices }
} 