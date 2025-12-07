"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import MenuItemImage from "@/components/menu-item-image"
import { MenuItem } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Plus, Star, Flame, Leaf, Wheat, Search, Minus } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface MenuGridProps {
  items: MenuItem[]
}

export default function MenuGrid({ items }: MenuGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Search className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No items found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your filters or search terms
        </p>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const getDietaryBadges = (item: MenuItem) => {
    const badges = []
    
    if (item.is_vegan) {
      badges.push(
        <div key="vegan" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs flex items-center gap-1">
          <Leaf className="h-3 w-3" />
          Vegan
        </div>
      )
    }
    
    if (item.is_gluten_free) {
      badges.push(
        <div key="gluten-free" className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full text-xs flex items-center gap-1">
          <Wheat className="h-3 w-3" />
          GF
        </div>
      )
    }
    
    if (item.is_spicy) {
      badges.push(
        <div key="spicy" className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded-full text-xs flex items-center gap-1">
          <Flame className="h-3 w-3" />
          Spicy
        </div>
      )
    }
    
    return badges
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {items.map((item) => (
        <motion.div
          key={item.id}
          variants={itemVariants}
          whileHover={{ y: -8, transition: { duration: 0.3 } }}
          className="group"
        >
          <Link href={`/menu/${item.id}`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-600">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <MenuItemImage
                  src={item.image_url || undefined}
                  alt={item.name}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {item.is_featured && (
                    <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Featured
                    </div>
                  )}
                  {getDietaryBadges(item)}
                </div>

                {/* Category Badge */}
                {item.category && (
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {item.category.name}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${item.price}
                    </span>
                    {item.original_price && item.original_price > item.price && (
                      <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                        ${item.original_price}
                      </span>
                    )}
                  </div>
                  
                  <ItemQuantityControl item={item} />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}

function ItemQuantityControl({ item }: { item: MenuItem }) {
  const { items, addItem, updateQuantity, getItemQuantity } = useCart()
  const { toast } = useToast()
  const qty = getItemQuantity(item.id)

  const inc = () => {
    addItem(item, 1)
    toast({ title: "Added to cart", description: `${item.name} added` })
  }

  const dec = () => {
    const next = Math.max(qty - 1, 0)
    updateQuantity(item.id, next)
    toast({ title: next === 0 ? "Removed from cart" : "Updated quantity", description: `${item.name} ${next}` })
  }

  if (qty <= 0) {
    return (
      <Button
        size="sm"
        className="bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 group-hover:scale-110"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); inc(); }}
      >
        <Plus className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
      <Button size="sm" variant="outline" className="h-8 w-8" onClick={dec}>
        <Minus className="h-4 w-4" />
      </Button>
      <span className="min-w-[1.5rem] text-center font-semibold">{qty}</span>
      <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white h-8 w-8" onClick={inc}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
