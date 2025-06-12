import { supabase } from './supabase'

// Define the Order type based on your Supabase table structure
export type Order = {
  id: string; // UUID
  customer_id: string; // UUID, foreign key to customers
  status: string; // e.g., 'pending', 'processing', 'completed', 'cancelled'
  total_amount: number;
  delivery_address: string;
  special_instructions?: string; // Optional
  created_at: string; // Handled by Supabase
};

export type Customer = {
  id: string; // UUID
  name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at?: string; // Handled by Supabase
};

export type OrderItem = {
  id: string; // UUID
  order_id: string; // UUID, foreign key to orders
  service_id: string; // UUID, foreign key to services (can be a placeholder for now)
  quantity: number;
  price: number; // Price for this item/service
};

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
export async function fetchOrderById(id: string) {
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
export async function createOrder(order: Omit<Order, 'id' | 'created_at'>) {
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
export async function updateOrder(id: string, updates: Partial<Order>) {
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
export async function deleteOrder(id: string) {
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

// Fetch a customer by email
export async function fetchCustomerByEmail(email: string): Promise<Customer | null> {
  const { data, error } = await supabase
    .from('customers')
    .select('id, name, email, phone, address, created_at')
    .eq('email', email)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // PGRST116: 'No rows found'
      return null;
    }
    throw new Error(`Error fetching customer by email: ${error.message}`);
  }

  return data as Customer | null;
}

// Get or create a customer
export async function getOrCreateCustomer(customerData: Omit<Customer, 'id' | 'created_at'>): Promise<string> {
  // Check if customer exists
  const { data: existingCustomer, error: selectError } = await supabase
    .from('customers')
    .select('id')
    .eq('email', customerData.email)
    .single()

  if (selectError && selectError.code !== 'PGRST116') { // PGRST116: 'No rows found'
    throw new Error(`Error querying customer: ${selectError.message}`)
  }

  if (existingCustomer) {
    return existingCustomer.id
  }

  // Create new customer
  const { data: newCustomer, error: insertError } = await supabase
    .from('customers')
    .insert({
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      address: customerData.address,
    })
    .select('id')
    .single()

  if (insertError) {
    throw new Error(`Error creating customer: ${insertError.message}`)
  }

  if (!newCustomer) {
    throw new Error('Failed to create customer and retrieve ID.')
  }

  return newCustomer.id
}

// Create order items
export async function createOrderItems(orderItemsData: Array<Omit<OrderItem, 'id'>>): Promise<OrderItem[]> {
  const { data, error } = await supabase
    .from('order_items')
    .insert(orderItemsData)
    .select()

  if (error) {
    throw new Error(`Error creating order items: ${error.message}`)
  }

  return data as OrderItem[]
}