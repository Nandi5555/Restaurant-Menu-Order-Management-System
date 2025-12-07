"use server"

import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

interface OrderItemInput {
  id: string
  quantity: number
  price?: number
  name?: string
}

export async function placeOrder(items: OrderItemInput[], deliveryAddress?: Record<string, any>) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { ok: false, error: "AUTH_REQUIRED" }
  }

  if (!items || items.length === 0) {
    return { ok: false, error: "EMPTY_CART" }
  }

  const { data: menuItems, error: itemsErr } = await supabase
    .from("menu_items")
    .select("id, price")
    .in("id", items.map(i => i.id))

  const priceMap = new Map((menuItems || []).map(mi => [mi.id, Number(mi.price)]))
  const subtotal = items.reduce((sum, i) => {
    const chosenPrice = typeof i.price === 'number' ? Number(i.price) : (priceMap.get(i.id) ?? 0)
    return sum + chosenPrice * i.quantity
  }, 0)
  const deliveryFee = subtotal > 30 ? 0 : 5.99
  const tax = subtotal * 0.08
  const discount = 0
  const total = subtotal + tax + deliveryFee - discount
  const metaItems = items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: (typeof i.price === 'number' ? Number(i.price) : (priceMap.get(i.id) ?? 0)) }))

  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total_amount: subtotal,
      status: "pending",
      payment_status: "unpaid",
      delivery_address: deliveryAddress || { type: "pickup" },
      metadata: { breakdown: { subtotal, tax, discount, delivery_fee: deliveryFee, total } },
      items_summary: metaItems
    })
    .select("*")
    .single()

  if (orderErr || !order) {
    return { ok: false, error: "ORDER_CREATE_FAILED" }
  }

  const orderItems = items.map(i => ({
    order_id: order.id,
    menu_item_id: i.id,
    quantity: i.quantity,
    price: (typeof i.price === 'number' ? Number(i.price) : (priceMap.get(i.id) ?? 0))
  }))

  const { error: oiErr } = await supabase
    .from("order_items")
    .insert(orderItems)

  if (oiErr) {
    return { ok: false, error: "ORDER_ITEMS_FAILED" }
  }

  return { ok: true, orderId: order.id }
}

export async function payOrder(orderId: string) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "AUTH_REQUIRED" }

  const { data: order, error } = await supabase
    .from("orders")
    .update({ payment_status: "paid", status: "accepted" })
    .eq("id", orderId)
    .select("*")
    .single()

  if (error || !order) return { ok: false, error: "PAYMENT_UPDATE_FAILED" }
  return { ok: true }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "AUTH_REQUIRED" }

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select("*")
    .single()

  if (error || !data) return { ok: false, error: "STATUS_UPDATE_FAILED" }
  return { ok: true }
}
