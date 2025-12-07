"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { MenuItem } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Plus, Star } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

interface RelatedItemsProps {
  items: MenuItem[]
}

export default function RelatedItems({ items }: RelatedItemsProps) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (item: MenuItem) => {
    addItem(item, 1)
    toast({
      title: "Added to cart",
      description: `${item.name} added to your cart`,
      duration: 2000,
    })
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {items.map((item) => (
        <motion.div
          key={item.id}
          variants={itemVariants}
          whileHover={{ y: -8, transition: { duration: 0.3 } }}
          className="group"
        >
          <Link href={`/menu/${item.slug}`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-600">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                    <div className="text-orange-600 dark:text-orange-400 text-4xl font-bold">
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
                
                {/* Featured Badge */}
                {item.is_featured && (
                  <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Featured
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
                  
                  <Button
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 group-hover:scale-110"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleAddToCart(item)
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}