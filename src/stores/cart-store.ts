import { create } from "zustand"
import { persist } from "zustand/middleware"
import { MenuItem } from "@/types/database"

export interface CartItem {
  item: MenuItem
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: MenuItem, quantity: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
  getItemQuantity: (itemId: string) => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item: MenuItem, quantity: number) => {
        const currentItems = get().items
        const existingItem = currentItems.find(cartItem => cartItem.item.id === item.id)
        
        if (existingItem) {
          set({
            items: currentItems.map(cartItem =>
              cartItem.item.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + quantity }
                : cartItem
            )
          })
        } else {
          set({
            items: [...currentItems, { item, quantity }]
          })
        }
      },
      
      removeItem: (itemId: string) => {
        set({
          items: get().items.filter(cartItem => cartItem.item.id !== itemId)
        })
      },
      
      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }
        
        set({
          items: get().items.map(cartItem =>
            cartItem.item.id === itemId
              ? { ...cartItem, quantity }
              : cartItem
          )
        })
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, cartItem) => {
          return total + (cartItem.item.price * cartItem.quantity)
        }, 0)
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, cartItem) => {
          return total + cartItem.quantity
        }, 0)
      },
      
      getItemQuantity: (itemId: string) => {
        const cartItem = get().items.find(item => item.item.id === itemId)
        return cartItem?.quantity || 0
      }
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
)