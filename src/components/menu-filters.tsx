"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Search, 
  Filter, 
  X, 
  SlidersHorizontal,
  Leaf,
  Wheat,
  Flame
} from "lucide-react"
import { Category } from "@/types/database"
import { MenuFilters } from "@/app/actions/menu"

interface MenuFiltersComponentProps {
  categories: Category[]
  currentFilters: MenuFilters
}

export default function MenuFiltersComponent({ categories, currentFilters }: MenuFiltersComponentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const updateFilters = (newFilters: Partial<MenuFilters>) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === undefined || value === "" || value === "all" || value === false) {
          params.delete(key)
        } else {
          params.set(key, String(value))
        }
      })
      
      // Reset to page 1 when filters change
      params.set("page", "1")
      
      router.push(`/menu?${params.toString()}`)
    })
  }

  const clearFilters = () => {
    startTransition(() => {
      router.push("/menu")
    })
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <Label htmlFor="search" className="text-sm font-medium mb-2 block">
          Search
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="search"
            placeholder="Search dishes..."
            value={currentFilters.search || ""}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Category</Label>
        <div className="space-y-2">
          <Button
            variant={currentFilters.category === "all" || !currentFilters.category ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => updateFilters({ category: "all" })}
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={currentFilters.category === category.id ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => updateFilters({ category: category.id })}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Price Range</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={currentFilters.minPrice || ""}
            onChange={(e) => updateFilters({ minPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
            className="text-sm"
          />
          <Input
            type="number"
            placeholder="Max"
            value={currentFilters.maxPrice || ""}
            onChange={(e) => updateFilters({ maxPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
            className="text-sm"
          />
        </div>
      </div>

      {/* Dietary Preferences */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Dietary</Label>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="vegan"
              checked={currentFilters.isVegan || false}
              onCheckedChange={(checked) => updateFilters({ isVegan: checked as boolean })}
            />
            <Label htmlFor="vegan" className="flex items-center gap-2 cursor-pointer">
              <Leaf className="h-4 w-4 text-green-500" />
              Vegan
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="glutenFree"
              checked={currentFilters.isGlutenFree || false}
              onCheckedChange={(checked) => updateFilters({ isGlutenFree: checked as boolean })}
            />
            <Label htmlFor="glutenFree" className="flex items-center gap-2 cursor-pointer">
              <Wheat className="h-4 w-4 text-amber-600" />
              Gluten-Free
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="spicy"
              checked={currentFilters.isSpicy || false}
              onCheckedChange={(checked) => updateFilters({ isSpicy: checked as boolean })}
            />
            <Label htmlFor="spicy" className="flex items-center gap-2 cursor-pointer">
              <Flame className="h-4 w-4 text-red-500" />
              Spicy
            </Label>
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Sort By</Label>
        <div className="space-y-2">
          <Button
            variant={currentFilters.sortBy === "created_at" ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => updateFilters({ sortBy: "created_at" })}
          >
            Newest
          </Button>
          <Button
            variant={currentFilters.sortBy === "name" ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => updateFilters({ sortBy: "name" })}
          >
            Name
          </Button>
          <Button
            variant={currentFilters.sortBy === "price" ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => updateFilters({ sortBy: "price", sortOrder: currentFilters.sortOrder === "asc" ? "desc" : "asc" })}
          >
            Price {currentFilters.sortBy === "price" && (currentFilters.sortOrder === "asc" ? "↑" : "↓")}
          </Button>
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={clearFilters}
        disabled={isPending}
      >
        <X className="h-4 w-4 mr-2" />
        Clear All
      </Button>
    </div>
  )

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setShowMobileFilters(true)}
          className="w-full"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-4"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </h3>
          </div>
          <FilterContent />
        </motion.div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Filters
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileFilters(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <FilterContent />
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
