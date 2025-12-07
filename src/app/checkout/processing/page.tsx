"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function ProcessingPage() {
  const params = useSearchParams()
  const router = useRouter()
  const orderId = params.get("orderId") || ""

  useEffect(() => {
    const t = setTimeout(() => {
      router.push(`/orders/success?orderId=${orderId}`)
    }, 2000)
    return () => clearTimeout(t)
  }, [orderId, router])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-orange-500 rounded-full border-t-transparent mx-auto mb-6" />
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Processing Payment...</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Order <span className="font-mono">#{orderId.slice(0,8)}</span></p>
      </div>
    </div>
  )
}

