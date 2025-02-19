import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for admin access

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedDatabase() {
  // First, create a test customer
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .upsert([
      {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '123-456-7890'
      }
    ])
    .select()
    .single()

  if (customerError) {
    console.error('Error creating customer:', customerError)
    return
  }

  // Create a test service
  const { data: service, error: serviceError } = await supabase
    .from('services')
    .upsert([
      {
        name: 'Test Service',
        description: 'A test service description',
        price: 99.99
      }
    ])
    .select()
    .single()

  if (serviceError) {
    console.error('Error creating service:', serviceError)
    return
  }

  // Create a test order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .upsert([
      {
        customer_id: customer.id,
        status: 'pending',
        total_amount: 99.99
      }
    ])
    .select()
    .single()

  if (orderError) {
    console.error('Error creating order:', orderError)
    return
  }

  // Create order items
  const { error: orderItemError } = await supabase
    .from('order_items')
    .upsert([
      {
        order_id: order.id,
        service_id: service.id,
        quantity: 1,
        price: 99.99
      }
    ])

  if (orderItemError) {
    console.error('Error creating order items:', orderItemError)
    return
  }

  console.log('Database seeded successfully!')
}

seedDatabase()
  .catch(console.error) 