"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Category } from "@/types/database"
import {
  UtensilsCrossed,
  Coffee,
  Beer,
  CupSoda,
  IceCream2,
  Sandwich,
  Pizza,
  Salad,
  Soup,
  Cake,
} from "lucide-react"

interface CategoryChipsProps {
  categories: Category[]
}

export default function CategoryChips({ categories }: CategoryChipsProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No categories available</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max px-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={`/menu?category=${category.id}`}
                className="group relative inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600"
              >
                <div className="flex items-center gap-3">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-8 h-8 rounded-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-sm">
                      {(() => {
                        const Icon = iconFor(category.name)
                        return <Icon className="h-5 w-5 text-white" />
                      })()}
                    </div>
                  )}
                  <span className="font-medium text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {category.name}
                  </span>
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="flex justify-center mt-2">
        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
      </div>
    </div>
  )
}
  const iconFor = (name: string) => {
    const key = name.toLowerCase()
    if (key.includes("pizza")) return Pizza
    if (key.includes("burger")) return Sandwich
    if (key.includes("beverage") || key.includes("drinks") || key.includes("soft")) return CupSoda
    if (key.includes("coffee")) return Coffee
    if (key.includes("beer")) return Beer
    if (key.includes("dessert") || key.includes("sweet") || key.includes("cake")) return Cake
    if (key.includes("ice") || key.includes("cream")) return IceCream2
    if (key.includes("salad")) return Salad
    if (key.includes("soup")) return Soup
    if (key.includes("main")) return UtensilsCrossed
    if (key.includes("appetizer")) return UtensilsCrossed
    return UtensilsCrossed
  }
