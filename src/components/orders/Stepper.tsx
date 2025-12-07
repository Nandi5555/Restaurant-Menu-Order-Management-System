"use client"

import { useEffect, useState } from "react"

interface Props {
  orderId: string
  labels: string[]
  initialIndex: number
}

export default function Stepper({ orderId, labels, initialIndex }: Props) {
  const [active, setActive] = useState(initialIndex)

  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem(`order_tracking_${orderId}`)
        if (raw) {
          const obj = JSON.parse(raw)
          if (typeof obj.statusIndex === "number") setActive(obj.statusIndex)
        }
      } catch {}
    }
    read()
    const onStorage = (e: StorageEvent) => { if (e.key === `order_tracking_${orderId}`) read() }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [orderId])

  return (
    <div className="pt-2">
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
        {labels.map((label, idx) => (
          <span key={label} className={idx <= active ? "font-semibold text-orange-500" : ""}>{label}</span>
        ))}
      </div>
      <div className="relative h-2 bg-gray-200 dark:bg-gray-800 rounded-full">
        <div className="absolute inset-y-0 left-0 bg-orange-500 rounded-full" style={{ width: `${(active / (labels.length - 1)) * 100}%` }} />
        <div className="absolute inset-0 flex justify-between">
          {labels.map((label, idx) => (
            <span key={label} className={`-mt-1 h-3 w-3 rounded-full ${idx <= active ? "bg-orange-500" : "bg-gray-400 dark:bg-gray-700"}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

