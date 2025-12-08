"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Bike, Home, Utensils, CheckCircle2 } from "lucide-react"
import { updateOrderStatus } from "@/app/actions/orders"
import "leaflet/dist/leaflet.css"

export default function TrackOrderPage() {
  const params = useSearchParams()
  const router = useRouter()
  const orderId = params.get("orderId") || ""
  const [progress, setProgress] = useState(0)
  const steps = useMemo(() => [
    { key: "placed", label: "Order Placed", icon: Utensils },
    { key: "accepted", label: "Accepted", icon: CheckCircle2 },
    { key: "preparing", label: "Preparing", icon: Utensils },
    { key: "pickup", label: "Picked Up", icon: Bike },
    { key: "delivering", label: "On the way", icon: Bike },
    { key: "delivered", label: "Delivered", icon: Home },
  ], [])

  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstance = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const route = useRef<any[]>([
    [12.9716, 77.5946],
    [12.9720, 77.5970],
    [12.9730, 77.6000],
    [12.9740, 77.6030],
    [12.9755, 77.6060],
    [12.9770, 77.6090],
  ])

  useEffect(() => {
    const init = async () => {
      if (!mapRef.current || mapInstance.current) return
      const L = await import("leaflet")
      const map = L.map(mapRef.current).setView(route.current[0] as any, 14)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap" }).addTo(map)
      L.polyline(route.current as any[], { color: "#f97316" }).addTo(map)
      const marker = L.marker(route.current[0] as any, {
        icon: L.divIcon({ className: "", html: '<div style="background:#f97316;border-radius:50%;width:18px;height:18px;box-shadow:0 0 0 2px #fff"></div>' })
      }).addTo(map)
      markerRef.current = marker
      mapInstance.current = map
    }
    init()
  }, [])

  useEffect(() => {
    const t = setInterval(() => setProgress(p => Math.min(100, p + 3)), 900)
    return () => clearInterval(t)
  }, [])

  const activeIndex = Math.min(steps.length - 1, Math.floor(progress / (100 / (steps.length - 1))))

  useEffect(() => {
    // Move marker along route
    if (!markerRef.current) return
    const idx = Math.min(route.current.length - 1, Math.floor((progress / 100) * (route.current.length - 1)))
    markerRef.current.setLatLng(route.current[idx] as any)
    // Persist tracking info for orders list
    try { localStorage.setItem(`order_tracking_${orderId}`, JSON.stringify({ progress, statusIndex: activeIndex })) } catch {}
    if (progress >= 100) {
      updateOrderStatus(orderId, "delivered").catch(() => {})
    }
  }, [progress, orderId, activeIndex])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Track Order #{orderId.slice(0,8)}</h1>
          <Link href="/orders"><Button variant="outline">Back to Orders</Button></Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5"/> Live Map (Dummy)</CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={mapRef} className="relative h-80 rounded-lg overflow-hidden" />
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">ETA: {Math.max(3, Math.ceil((100-progress)/5))} min</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-3">
                {steps.map((s, idx) => (
                  <span key={s.key} className={idx <= activeIndex ? "font-semibold text-orange-500" : ""}>{s.label}</span>
                ))}
              </div>
              <div className="relative h-2 bg-gray-200 dark:bg-gray-800 rounded-full">
                <div className="absolute inset-y-0 left-0 bg-orange-500 rounded-full" style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }} />
                <div className="absolute inset-0 flex justify-between">
                  {steps.map((s, idx) => (
                    <span key={s.key} className={`-mt-1 h-3 w-3 rounded-full ${idx <= activeIndex ? "bg-orange-500" : "bg-gray-400 dark:bg-gray-700"}`} />
                  ))}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border p-2">
                  <div className="font-medium">Delivery Person</div>
                  <div className="text-gray-600 dark:text-gray-400">Alex (Dummy)</div>
                </div>
                <div className="rounded-lg border p-2">
                  <div className="font-medium">Payment</div>
                  <div className="text-gray-600 dark:text-gray-400">Paid</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
