import { createServerClient } from "@/lib/supabase"
import { Category, MenuItem } from "@/types/database"
import HeroCarousel from "@/components/hero-carousel"
import CategoryChips from "@/components/category-chips"
import FeaturedItems from "@/components/featured-items"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

async function getCategories(): Promise<Category[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name")
  
  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }
  
  return data || []
}

async function getFeaturedItems(): Promise<MenuItem[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from("menu_items")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("is_available", true)
    .limit(8)
  
  if (error) {
    console.error("Error fetching featured items:", error)
    return []
  }
  
  return data || []
}

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  const categories = user ? await getCategories() : []
  const featuredItems = user ? await getFeaturedItems() : []

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <section className="relative">
        <Suspense fallback={<HeroCarouselSkeleton />}>
          <HeroCarousel autoPlay={!!user} ctaHref={user ? "/menu" : "/auth/login"} />
        </Suspense>
      </section>

      {/* Category Chips - only for logged in */}
      {user && (
        <section className="py-8 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <Suspense fallback={<CategoryChipsSkeleton />}>
              <CategoryChips categories={categories} />
            </Suspense>
          </div>
        </section>
      )}

      {user && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Trending Now
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Discover our most popular dishes
              </p>
            </div>
            <Suspense fallback={<FeaturedItemsSkeleton />}>
              <FeaturedItems items={featuredItems} />
            </Suspense>
          </div>
        </section>
      )}
    </div>
  )
}

function HeroCarouselSkeleton() {
  return (
    <div className="relative h-[520px] bg-gray-200 dark:bg-gray-800 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-full mb-6" />
          <Skeleton className="h-12 w-48" />
        </div>
      </div>
    </div>
  )
}

function CategoryChipsSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton key={i} className="h-12 w-32 rounded-full flex-shrink-0" />
      ))}
    </div>
  )
}

function FeaturedItemsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <div className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-3" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
