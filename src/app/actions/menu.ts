"use server"

import { createServerClient } from "@/lib/supabase"
import { ensureMenuItemImage } from "@/lib/image-gen"
import { MenuItem, Category } from "@/types/database"

export interface MenuFilters {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  isVegan?: boolean
  isGlutenFree?: boolean
  isSpicy?: boolean
  sortBy?: "name" | "price" | "created_at"
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}

export async function getMenuItems(filters: MenuFilters = {}): Promise<{
  items: MenuItem[]
  total: number
  categories: Category[]
}> {
  const supabase = createServerClient()
  
  let query = supabase
    .from("menu_items")
    .select(`
      *,
      category:categories(*)
    `, { count: "exact" })
    .eq("is_available", true)

  // Apply filters
  if (filters.category && filters.category !== "all") {
    query = query.eq("category_id", filters.category)
  }

  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  if (filters.minPrice !== undefined) {
    query = query.gte("price", filters.minPrice)
  }

  if (filters.maxPrice !== undefined) {
    query = query.lte("price", filters.maxPrice)
  }

  if (filters.isVegan) {
    query = query.eq("is_vegan", true)
  }

  if (filters.isGlutenFree) {
    query = query.eq("is_gluten_free", true)
  }

  if (filters.isSpicy) {
    query = query.eq("is_spicy", true)
  }

  // Sorting
  const sortBy = filters.sortBy || "created_at"
  const sortOrder = filters.sortOrder || "desc"
  query = query.order(sortBy, { ascending: sortOrder === "asc" })

  // Pagination
  const page = filters.page || 1
  const limit = filters.limit || 12
  const from = (page - 1) * limit
  const to = from + limit - 1

  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching menu items:", error)
    return { items: [], total: 0, categories: [] }
  }

  // Generate images for items missing image_url
  if (data && data.length) {
    await Promise.all(
      data
        .filter((it) => !it.image_url || String(it.image_url).trim() === "")
        .map(async (it) => {
          const url = await ensureMenuItemImage(it.id, it.name)
          if (url) it.image_url = url
        })
    )
  }

  // Get categories for filters
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  return {
    items: data || [],
    total: count || 0,
    categories: categories || []
  }
}

export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from("menu_items")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching menu item:", error)
    return null
  }

  return data
}

export async function getMenuItemBySlug(slug: string): Promise<MenuItem | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("menu_items")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("slug", slug)
    .single()

  if (error) {
    console.error("Error fetching menu item by slug:", error)
    return null
  }

  return data
}

export async function getRelatedItems(itemId: string, categoryId: string): Promise<MenuItem[]> {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from("menu_items")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("category_id", categoryId)
    .neq("id", itemId)
    .eq("is_available", true)
    .limit(4)

  if (error) {
    console.error("Error fetching related items:", error)
    return []
  }

  return data || []
}
