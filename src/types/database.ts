export type UserRole = 'admin' | 'staff' | 'customer'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  created_at: string
}

export interface Category {
  id: string
  name: string
  description: string | null
  image_url?: string | null
  created_at: string
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image_url: string | null
  category_id: string | null
  tags: string[]
  is_available: boolean
  inventory_count: number | null
  created_at: string
  category?: Category
  slug?: string
  is_featured?: boolean
  original_price?: number
  is_vegan?: boolean
  is_gluten_free?: boolean
  is_spicy?: boolean
  allergens?: string | null
  nutritional_info?: string | null
}

export interface Cart {
  id: string
  user_id: string
}

export interface CartItem {
  id: string
  cart_id: string
  menu_item_id: string
  quantity: number
  created_at: string
  menu_item?: MenuItem
}

export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
export type PaymentStatus = 'unpaid' | 'paid'

export interface Order {
  id: string
  user_id: string
  total_amount: number
  status: OrderStatus
  payment_status: PaymentStatus
  delivery_address: {
    street: string
    city: string
    zipCode: string
    phone: string
    instructions?: string
  }
  metadata: Record<string, any> | null
  created_at: string
  user?: User
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  menu_item_id: string
  quantity: number
  price: number
  created_at: string
  menu_item?: MenuItem
}

export interface AdminAudit {
  id: string
  admin_id: string
  action_type: string
  resource_id: string | null
  resource_type: string | null
  delta: Record<string, any> | null
  timestamp: string
}

export interface CartWithItems extends Cart {
  items: CartItem[]
  total: number
}
