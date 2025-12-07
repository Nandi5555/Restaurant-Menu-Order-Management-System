"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useMemo } from "react"

export default function OrderSuccessPage() {
  const params = useSearchParams()
  const orderId = params.get("orderId") || ""
  const particles = useMemo(() => Array.from({ length: 28 }).map((_, i) => {
    const angle = Math.random() * Math.PI * 2
    const radius = 50 + Math.random() * 70
    const size = 4 + Math.floor(Math.random() * 10)
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    const delay = `${Math.random() * 0.8}s`
    return { key: i, x, y, size, delay }
  }), [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="relative text-center p-8">
        <div className="relative mx-auto mb-6 h-28 w-28">
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-orange-400 to-orange-500 flex items-center justify-center animate-[pulse_1.8s_ease-in-out_infinite]">
            <svg width="72" height="72" viewBox="0 0 24 24" className="text-white">
              <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-[orbit_10s_linear_infinite]">
            {particles.slice(0,14).map(p => (
              <span
                key={p.key}
                style={{ transform: `rotate(${(p.key as number)*25}deg) translate(70px)`, width: p.size, height: p.size, animationDelay: p.delay }}
                className="absolute rounded-full bg-orange-400/90"
              />
            ))}
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-[orbit_14s_linear_infinite]">
            {particles.slice(14).map(p => (
              <span
                key={p.key}
                style={{ transform: `rotate(${(p.key as number)*27}deg) translate(84px)`, width: Math.max(3, p.size-1), height: Math.max(3, p.size-1), animationDelay: p.delay }}
                className="absolute rounded-full bg-orange-300/90"
              />
            ))}
          </div>
          <style jsx>{`
            @keyframes orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.04); } }
          `}</style>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Thank you for ordering!</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Order <span className="font-mono">#{orderId.slice(0,8)}</span> confirmed. Enjoy your meal.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/orders">
            <Button variant="outline">View Order</Button>
          </Link>
          <Link href="/menu">
            <Button className="bg-orange-500 hover:bg-orange-600">Return to Menu</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
