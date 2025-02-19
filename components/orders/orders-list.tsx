"use client"

import { useEffect, useState } from 'react'
import { fetchOrders, type Order } from '@/lib/db'

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await fetchOrders()
        setOrders(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [])

  if (isLoading) return <div>Loading orders...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Orders</h2>
      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order.id} className="p-4 border rounded-lg">
            <div className="flex justify-between">
              <div>
                <p className="font-medium">Order #{order.id}</p>
                <p className="text-sm text-gray-500">
                  Status: {order.status}
                </p>
              </div>
              <p className="font-medium">
                ${order.total_amount.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 