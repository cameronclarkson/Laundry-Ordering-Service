"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Settings } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"

interface Order {
  id: string
  created_at: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  total_amount: number
  customer_id: string
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

interface OrdersProps {
  onBack: () => void
}

export function Orders({ onBack }: OrdersProps) {
  const router = useRouter()
  const [currentOrders, setCurrentOrders] = useState<Order[]>([])
  const [pastOrders, setPastOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        console.log('Fetching orders...');
        const { data: orders, error } = await supabase
          .from('orders')
          .select(`
            *,
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

        // Add detailed logging
        console.log('Raw Supabase response:', { data: orders, error });
        
        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        if (!orders || orders.length === 0) {
          console.log('No orders found in the database');
        }

        // Make sure orders is an array before filtering
        const ordersArray = Array.isArray(orders) ? orders : [];

        const current = ordersArray.filter(order => {
          const status = order.status?.toLowerCase() || '';
          return ['pending', 'processing', 'in progress'].includes(status);
        });
        
        const past = ordersArray.filter(order => {
          const status = order.status?.toLowerCase() || '';
          return ['completed', 'cancelled'].includes(status);
        });
        
        console.log('Current orders:', current);
        console.log('Past orders:', past);
        
        setCurrentOrders(current);
        setPastOrders(past);
      } catch (error) {
        console.error('Error fetching orders:', error)
        // Add more detailed error logging
        if (error instanceof Error) {
          console.error('Error details:', error.message);
          console.error('Error stack:', error.stack);
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleAdminView = () => {
    router.push('/admin/orders')
  }

  const OrderList = ({ orders }: { orders: Order[] }) => (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="mb-4">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">Order #{order.id.slice(0, 8)}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleString()}
                </p>
                <div className="mt-2">
                  <p className="font-medium">{order.customers?.name}</p>
                  <p className="text-sm">{order.customers?.email}</p>
                  <p className="text-sm">{order.customers?.phone}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">${order.total_amount.toFixed(2)}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.order_items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.services.name}</TableCell>
                    <TableCell>{item.services.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      ${(item.quantity * item.price).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  if (isLoading) {
    return <div>Loading orders...</div>
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle>My Orders</CardTitle>
              <CardDescription>View your current and past orders</CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAdminView}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            Admin View
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">Current Orders</TabsTrigger>
            <TabsTrigger value="past">Past Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            <OrderList orders={currentOrders} />
          </TabsContent>
          <TabsContent value="past">
            <OrderList orders={pastOrders} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

