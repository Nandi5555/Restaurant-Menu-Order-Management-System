"use client"

import { motion } from "framer-motion"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart, 
  ArrowRight,
  Tag
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart()
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const router = useRouter()

  const subtotal = getTotalPrice()
  const deliveryFee = subtotal > 30 ? 0 : 5.99
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + deliveryFee + tax - discount

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleApplyPromo = () => {
    // Simple promo code logic - in real app, this would validate against backend
    if (promoCode.toUpperCase() === "SAVE10") {
      setDiscount(subtotal * 0.1)
    } else if (promoCode.toUpperCase() === "FREEDELIVERY") {
      setDiscount(deliveryFee)
    } else {
      setDiscount(0)
    }
  }

  const handleCheckout = () => {
    if (items.length === 0) return
    router.push("/checkout")
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Your cart is empty
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add some delicious items to get started
          </p>
          <Link href="/menu">
            <Button className="bg-orange-500 hover:bg-orange-600">
              Browse Menu
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Shopping Cart
            </h1>
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((cartItem, index) => (
                <motion.div
                  key={cartItem.item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {/* Item Image */}
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                          {cartItem.item.image_url ? (
                            <img
                              src={cartItem.item.image_url}
                              alt={cartItem.item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="text-orange-600 dark:text-orange-400 text-2xl font-bold">
                                {cartItem.item.name.charAt(0).toUpperCase()}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Item Details */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                            {cartItem.item.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                            {cartItem.item.description}
                          </p>
                          <p className="text-orange-600 dark:text-orange-400 font-semibold">
                            ${cartItem.item.price.toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col items-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(cartItem.item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(cartItem.item.id, cartItem.quantity - 1)}
                              disabled={cartItem.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            
                            <span className="w-8 text-center font-medium">
                              {cartItem.quantity}
                            </span>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(cartItem.item.id, cartItem.quantity + 1)}
                              disabled={cartItem.quantity >= 99}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <p className="font-semibold text-gray-900 dark:text-white">
                            ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="sticky top-4"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Promo Code */}
                    <div>
                      <Label htmlFor="promo" className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Promo Code
                      </Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="promo"
                          placeholder="Enter code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <Button
                          variant="outline"
                          onClick={handleApplyPromo}
                          size="sm"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>

                    {/* Order Breakdown */}
                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      {deliveryFee > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Delivery Fee</span>
                          <span>${deliveryFee.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span>Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <Button
                      className="w-full bg-orange-500 hover:bg-orange-600"
                      onClick={handleCheckout}
                      disabled={items.length === 0}
                    >
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>

                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      Free delivery on orders over $30
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}