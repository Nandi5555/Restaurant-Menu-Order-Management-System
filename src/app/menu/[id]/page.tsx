import { notFound } from "next/navigation"
import { getMenuItemById, getRelatedItems, getMenuItemBySlug } from "@/app/actions/menu"
import MenuItemDetail from "@/components/menu-item-detail"
import RelatedItems from "@/components/related-items"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export const dynamic = "force-dynamic"

interface MenuItemPageProps {
  params: { id: string }
}

export default async function MenuItemPage({ params }: MenuItemPageProps) {
  const { id } = params

  const item = (await getMenuItemById(id)) || (await getMenuItemBySlug(id))
  if (!item) {
    notFound()
  }

  const relatedItems = await getRelatedItems(item.id, item.category_id as string)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<ItemDetailSkeleton />}>
          <MenuItemDetail item={item} />
        </Suspense>

        {relatedItems.length > 0 && (
          <section className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">You Might Also Like</h2>
              <p className="text-gray-600 dark:text-gray-400">More delicious options from our menu</p>
            </div>
            <Suspense fallback={<RelatedItemsSkeleton />}>
              <RelatedItems items={relatedItems} />
            </Suspense>
          </section>
        )}
      </div>
    </div>
  )
}

function ItemDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <Skeleton className="h-96 w-full rounded-lg" />
        <div className="grid grid-cols-4 gap-2 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-12 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

function RelatedItemsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
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
