import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bike, CheckCircle2, Utensils, Truck } from "lucide-react"
import Stepper from "@/components/orders/Stepper"

export default async function OrdersPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data, error } = await supabase
    .from("orders")
    .select(`*`)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) notFound()

  let itemsByOrder: any[] = []
  if (data && data.length > 0) {
    const { data: oi } = await supabase
      .from("order_items")
      .select(`*, menu_item:menu_items(*)`)
      .in("order_id", data.map(o => o.id))
    itemsByOrder = oi || []
  }

  const orderItemsMap = itemsByOrder.reduce((acc: Record<string, any[]>, it: any) => {
    const k = it.order_id
    if (!acc[k]) acc[k] = []
    acc[k].push(it)
    return acc
  }, {})

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      {(!data || data.length === 0) ? (
        <p className="text-gray-600">No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {data.map((order) => {
            const orderItems = orderItemsMap[order.id] || []
            const calcSubtotal = orderItems.reduce((sum: number, it: any) => sum + Number(it.price || 0) * Number(it.quantity || 0), 0)
            const breakdown = (order.metadata?.breakdown) || null
            const subtotal = breakdown?.subtotal ?? (calcSubtotal > 0 ? calcSubtotal : Number(order.total_amount || 0))
            const tax = breakdown?.tax ?? subtotal * 0.08
            const discount = breakdown?.discount ?? 0
            const deliveryFee = breakdown?.delivery_fee ?? (subtotal > 30 ? 0 : 5.99)
            const grand = breakdown?.total ?? (subtotal + tax + deliveryFee - discount)
            const metaItems = Array.isArray(order.items_summary) ? order.items_summary : (Array.isArray(order.metadata?.items) ? order.metadata.items : [])
            const metaById = Object.fromEntries(metaItems.map((m: any) => [m.id, m]))
            const adjustedOrderItems = orderItems.map((oi: any) => ({
              ...oi,
              price: typeof metaById[oi.menu_item_id]?.price === 'number' ? Number(metaById[oi.menu_item_id].price) : oi.price,
              name: metaById[oi.menu_item_id]?.name || oi.menu_item?.name
            }))
            const displayItems = (adjustedOrderItems.length > 0 ? adjustedOrderItems : metaItems)
            const steps = [
              { key: "placed", label: "Order Placed", icon: Utensils },
              { key: "accepted", label: "Accepted", icon: CheckCircle2 },
              { key: "preparing", label: "Preparing", icon: Utensils },
              { key: "out_for_delivery", label: "Out for Delivery", icon: Bike },
              { key: "delivered", label: "Delivered", icon: Truck },
            ]
            const statusKey = (order.status || "pending") as string
            const activeIndex = (
              statusKey === "pending" ? 0 :
              statusKey === "accepted" ? 1 :
              statusKey === "preparing" ? 2 :
              statusKey === "out_for_delivery" ? 3 :
              statusKey === "delivered" ? 4 : 0
            )
            return (
              <Card key={order.id}>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold">Order #{order.id.slice(0, 8)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{new Date(order.created_at).toLocaleString()}</div>
                      <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">Payment: {order.payment_status || "unpaid"}</div>
                    </div>
                    <Link href={`/orders/track?orderId=${order.id}`}>
                      <Button className="bg-orange-500 hover:bg-orange-600">Track Status</Button>
                    </Link>
                  </div>

                    <div className="border rounded-lg p-3">
                      <div className="font-medium mb-2">Items</div>
                      <div className="space-y-1">
                      {displayItems.map((it: any, idx: number) => (
                        <div key={it.id} className="flex justify-between text-sm">
                          <span>{it.menu_item?.name || it.name || it.menu_item_id} × {it.quantity}</span>
                          <span>${Number((it.price || 0) * (it.quantity || 0)).toFixed(2)}</span>
                        </div>
                      ))}
                      </div>
                      <div className="mt-3 space-y-1 text-sm">
                        <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                        {deliveryFee > 0 && (
                          <div className="flex justify-between"><span>Delivery</span><span>${deliveryFee.toFixed(2)}</span></div>
                        )}
                        <div className="flex justify-between"><span>Discount</span><span>${discount.toFixed(2)}</span></div>
                        <div className="flex justify-between font-semibold border-t pt-2"><span>Total</span><span>${grand.toFixed(2)}</span></div>
                      </div>
                    </div>

                  <Stepper orderId={order.id} labels={steps.map(s => s.label)} initialIndex={activeIndex} />
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
