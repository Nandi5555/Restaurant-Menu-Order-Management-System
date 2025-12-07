import { Suspense } from "react"
import { getMenuItems } from "@/app/actions/menu"
import MenuFilters from "@/components/menu-filters"
import MenuGrid from "@/components/menu-grid"
import MenuPagination from "@/components/menu-pagination"
import { Skeleton } from "@/components/ui/skeleton"

interface MenuPageProps {
  searchParams: Promise<{
    category?: string
    search?: string
    minPrice?: string
    maxPrice?: string
    isVegan?: string
    isGlutenFree?: string
    isSpicy?: string
    sortBy?: string
    sortOrder?: string
    page?: string
  }>
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const params = await searchParams
  
  const filters = {
    category: params.category || "all",
    search: params.search || "",
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
    isVegan: params.isVegan === "true",
    isGlutenFree: params.isGlutenFree === "true",
    isSpicy: params.isSpicy === "true",
    sortBy: params.sortBy as any || "created_at",
    sortOrder: params.sortOrder as any || "desc",
    page: params.page ? parseInt(params.page) : 1,
    limit: 12
  }

  const { items, total, categories } = await getMenuItems(filters)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Our Menu
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover our delicious selection of dishes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Suspense fallback={<FiltersSkeleton />}>
              <MenuFilters categories={categories} currentFilters={filters} />
            </Suspense>
          </div>

          {/* Menu Grid */}
          <div className="lg:col-span-3">
            <Suspense fallback={<MenuGridSkeleton />}>
              <MenuGrid items={items} />
            </Suspense>
            
            {/* Pagination */}
            {total > filters.limit && (
              <Suspense fallback={<PaginationSkeleton />}>
                <MenuPagination 
                  total={total} 
                  currentPage={filters.page} 
                  limit={filters.limit}
                  baseUrl="/menu"
                  currentFilters={filters}
                />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function FiltersSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-32" />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  )
}

function MenuGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
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

function PaginationSkeleton() {
  return (
    <div className="flex justify-center mt-8">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-10 w-10" />
        ))}
      </div>
    </div>
  )
}