"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { MenuFilters } from "@/app/actions/menu"

interface MenuPaginationProps {
  total: number
  currentPage: number
  limit: number
  baseUrl: string
  currentFilters: MenuFilters
}

export default function MenuPagination({ 
  total, 
  currentPage, 
  limit, 
  baseUrl, 
  currentFilters 
}: MenuPaginationProps) {
  const totalPages = Math.ceil(total / limit)
  const maxVisiblePages = 5
  
  if (totalPages <= 1) return null

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams()
    
    // Add existing filters
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== "all" && value !== false) {
        params.set(key, String(value))
      }
    })
    
    // Update page
    if (page > 1) {
      params.set("page", String(page))
    }
    
    return `${baseUrl}?${params.toString()}`
  }

  const getPageNumbers = () => {
    const pages = []
    const halfVisible = Math.floor(maxVisiblePages / 2)
    
    let startPage = Math.max(1, currentPage - halfVisible)
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }
    
    // First page
    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) {
        pages.push("ellipsis")
      }
    }
    
    // Middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    
    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("ellipsis")
      }
      pages.push(totalPages)
    }
    
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        asChild={currentPage > 1}
        className={currentPage <= 1 ? "opacity-50 cursor-not-allowed" : ""}
      >
        {currentPage > 1 ? (
          <Link href={getPageUrl(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        ) : (
          <span>
            <ChevronLeft className="h-4 w-4" />
          </span>
        )}
      </Button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => {
        if (page === "ellipsis") {
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-500 dark:text-gray-400">
              ...
            </span>
          )
        }

        const pageNumber = page as number
        const isActive = pageNumber === currentPage

        return (
          <Button
            key={pageNumber}
            variant={isActive ? "default" : "outline"}
            size="sm"
            asChild
          >
            <Link href={getPageUrl(pageNumber)}>
              {pageNumber}
            </Link>
          </Button>
        )
      })}

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        asChild={currentPage < totalPages}
        className={currentPage >= totalPages ? "opacity-50 cursor-not-allowed" : ""}
      >
        {currentPage < totalPages ? (
          <Link href={getPageUrl(currentPage + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span>
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </Button>
    </div>
  )
}