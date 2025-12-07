"use client"

import { useMemo, useState } from "react"
import { useCart } from "@/hooks/use-cart"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { placeOrder } from "@/app/actions/orders"
import { ArrowRight, ShoppingBag, Pencil } from "lucide-react"
import { useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart()
  const router = useRouter()
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [placing, setPlacing] = useState(false)
  const [editable, setEditable] = useState(false)

  const subtotal = getTotalPrice()
  const deliveryFee = subtotal > 30 ? 0 : 5.99
  const tax = subtotal * 0.08
  const total = subtotal + deliveryFee + tax

  const orderItems = useMemo(() => items.map(ci => ({ id: ci.item.id, quantity: ci.quantity, price: ci.item.price, name: ci.item.name })), [items])

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const profileName = user?.user_metadata?.name || user?.email || ""
      setName(profileName)
      try {
        const raw = localStorage.getItem("addresses")
        const def = localStorage.getItem("default_address_id") || ""
        if (raw) {
          const list = JSON.parse(raw)
          const defAddr = list.find((a: any) => a.id === def) || list[0]
          if (defAddr) setAddress(`${defAddr.line1}, ${defAddr.city} ${defAddr.zip || ''}`.trim())
        }
      } catch {}
    })()
  }, [])

  const onPlaceOrder = async () => {
    if (items.length === 0 || placing) return
    setPlacing(true)
    const res = await placeOrder(orderItems, { name, address })
    setPlacing(false)
    if (res.ok && res.orderId) {
      router.push(`/checkout/payment?orderId=${res.orderId}`)
      return
    }
    const tempId = (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}`
    try {
      localStorage.setItem("pending_order_id", tempId)
      localStorage.setItem("pending_order_address", JSON.stringify({ name, address }))
    } catch {}
    router.push(`/checkout/payment?orderId=${tempId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>
                <div>
                  <Label className="flex items-center justify-between">
                    <span>Address</span>
                    <Button variant="outline" size="icon" onClick={() => setEditable(!editable)}><Pencil className="h-4 w-4" /></Button>
                  </Label>
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, City" disabled={!editable} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.map(ci => (
                  <div key={ci.item.id} className="flex justify-between text-sm">
                    <span>{ci.item.name} × {ci.quantity}</span>
                    <span>${(ci.item.price * ci.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-sm"><span>Delivery</span><span>${deliveryFee.toFixed(2)}</span></div>
                )}
                <div className="flex justify-between text-sm"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
                <Button className="w-full bg-orange-500 hover:bg-orange-600" disabled={items.length === 0 || placing} onClick={onPlaceOrder}>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  {placing ? "Placing..." : "Place Order"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
