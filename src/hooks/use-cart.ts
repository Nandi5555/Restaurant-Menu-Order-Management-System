import { useCartStore } from "@/stores/cart-store"
import { MenuItem } from "@/types/database"

export const useCart = () => {
  const store = useCartStore()
  
  return {
    items: store.items,
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    getTotalPrice: store.getTotalPrice,
    getTotalItems: store.getTotalItems,
    getItemQuantity: store.getItemQuantity,
  }
}