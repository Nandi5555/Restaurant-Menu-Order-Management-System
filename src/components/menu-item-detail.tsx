"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MenuItem } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Plus, 
  Minus, 
  Star, 
  Flame, 
  Leaf, 
  Wheat,
  ShoppingCart,
  Heart,
  Share2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"

interface MenuItemDetailProps {
  item: MenuItem
}

export default function MenuItemDetail({ item }: MenuItemDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const { toast } = useToast()
  const { addItem } = useCart()

  const images = item.image_url ? [item.image_url] : []
  const hasMultipleImages = images.length > 1

  const handleAddToCart = () => {
    addItem(item, quantity)
    toast({
      title: "Added to cart",
      description: `${quantity} ${item.name}${quantity > 1 ? 's' : ''} added to your cart`,
      duration: 3000,
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.name,
          text: item.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Item link copied to clipboard",
        duration: 2000,
      })
    }
  }

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 99))
  }

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1))
  }

  const getDietaryBadges = () => {
    const badges = []
    
    if (item.is_vegan) {
      badges.push(
        <div key="vegan" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
          <Leaf className="h-4 w-4" />
          Vegan
        </div>
      )
    }
    
    if (item.is_gluten_free) {
      badges.push(
        <div key="gluten-free" className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
          <Wheat className="h-4 w-4" />
          Gluten-Free
        </div>
      )
    }
    
    if (item.is_spicy) {
      badges.push(
        <div key="spicy" className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
          <Flame className="h-4 w-4" />
          Spicy
        </div>
      )
    }
    
    return badges
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
    >
      {/* Image Gallery */}
      <div className="space-y-4">
        <motion.div 
          className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {images.length > 0 ? (
            <img
              src={images[selectedImageIndex]}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-orange-600 dark:text-orange-400 text-6xl font-bold">
                {item.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {item.is_featured && (
              <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                <Star className="h-4 w-4 fill-current" />
                Featured
              </div>
            )}
            {getDietaryBadges()}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"
              onClick={() => setIsFavorited(!isFavorited)}
            >
              <Heart 
                className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'}`} 
              />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </Button>
          </div>
        </motion.div>

        {/* Thumbnail Images */}
        {hasMultipleImages && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImageIndex === index 
                    ? "border-orange-500 ring-2 ring-orange-200 dark:ring-orange-900" 
                    : "border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600"
                }`}
              >
                <img
                  src={image}
                  alt={`${item.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2"
          >
            {item.name}
          </motion.h1>
          
          {item.category && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-lg text-orange-600 dark:text-orange-400 font-medium mb-4"
            >
              {item.category.name}
            </motion.p>
          )}
        </div>

        {/* Pricing */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex items-center gap-4 mb-6"
        >
          <span className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            ${item.price}
          </span>
          {item.original_price && item.original_price > item.price && (
            <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
              ${item.original_price}
            </span>
          )}
        </motion.div>

        {/* Description */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="prose prose-gray dark:prose-invert max-w-none"
        >
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {item.description}
          </p>
        </motion.div>

        {/* Quantity Selector */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="space-y-4"
        >
          <Label className="text-sm font-medium text-gray-900 dark:text-white">
            Quantity
          </Label>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="h-10 w-10"
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
              className="w-20 text-center h-10"
              min="1"
              max="99"
            />
            
            <Button
              variant="outline"
              size="icon"
              onClick={incrementQuantity}
              disabled={quantity >= 99}
              className="h-10 w-10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Add to Cart Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="space-y-3"
        >
          <Button
            size="lg"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-6 text-lg transition-all duration-300 hover:scale-105"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart - ${(item.price * quantity).toFixed(2)}
          </Button>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Free delivery on orders over $30
          </p>
        </motion.div>

        {/* Additional Info */}
        {item.allergens && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4"
          >
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
              Allergen Information
            </h4>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              {item.allergens}
            </p>
          </motion.div>
        )}

        {/* Nutritional Info */}
        {item.nutritional_info && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
          >
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Nutritional Information
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {item.nutritional_info}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}