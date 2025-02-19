import { supabase } from './supabase'

// Define the Order type based on your Supabase table structure
export type Order = {
  id: number
  customer_id: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  total_amount: number
  created_at: string
  updated_at: string
  delivery_address?: string
  special_instructions?: string
}

// Fetch all orders
export async function fetchOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customers (
        id,
        name,
        email,
        phone
      ),
      order_items (
        id,
        service_id,
        quantity,
        price,
        services (
          id,
          name,
          description,
          price
        )
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Error fetching orders: ${error.message}`)
  }

  return data
}

// Fetch a single order by ID
export async function fetchOrderById(id: number) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customers (
        id,
        name,
        email,
        phone
      ),
      order_items (
        id,
        service_id,
        quantity,
        price,
        services (
          id,
          name,
          description,
          price
        )
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(`Error fetching order: ${error.message}`)
  }

  return data
}

// Create a new order
export async function createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single()

  if (error) {
    throw new Error(`Error creating order: ${error.message}`)
  }

  return data
}

// Update an order
export async function updateOrder(id: number, updates: Partial<Order>) {
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Error updating order: ${error.message}`)
  }

  return data
}

// Delete an order
export async function deleteOrder(id: number) {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Error deleting order: ${error.message}`)
  }
}

// Generic function to fetch all data from a given table
export async function fetchTableData(tableName: string) {
  const { data, error } = await supabase.from(tableName).select('*')
  if (error) {
    throw new Error(`Error fetching ${tableName}: ${error.message}`)
  }
  return data
}

// Helper function to load data for all specified tables
export async function loadAllData() {
  const tables = ["orders", "order_items", "services", "deliveries", "customers"]
  const results = await Promise.all(tables.map(table => fetchTableData(table)))
  return tables.reduce((acc, table, index) => {
    acc[table] = results[index]
    return acc
  }, {} as Record<string, any[]>)
} 