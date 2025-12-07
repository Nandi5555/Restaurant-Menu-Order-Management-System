"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Address { id: string; line1: string; city: string; zip: string }

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [line1, setLine1] = useState("")
  const [city, setCity] = useState("")
  const [zip, setZip] = useState("")

  useEffect(() => {
    const raw = localStorage.getItem("addresses")
    if (raw) setAddresses(JSON.parse(raw))
  }, [])

  const save = (list: Address[]) => {
    setAddresses(list)
    localStorage.setItem("addresses", JSON.stringify(list))
  }

  const add = () => {
    if (!line1 || !city) return
    const a: Address = { id: crypto.randomUUID(), line1, city, zip }
    save([...(addresses || []), a])
    setLine1(""); setCity(""); setZip("")
  }

  const remove = (id: string) => save(addresses.filter(a => a.id !== id))

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Addresses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Input placeholder="Street / Line" value={line1} onChange={(e) => setLine1(e.target.value)} />
            <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
            <Input placeholder="ZIP" value={zip} onChange={(e) => setZip(e.target.value)} />
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600" onClick={add}>Add Address</Button>

          <div className="space-y-2">
            {addresses.length === 0 && <div className="text-sm text-gray-500">No saved addresses.</div>}
            {addresses.map(a => (
              <div key={a.id} className="flex items-center justify-between rounded border p-3">
                <div>
                  <div className="font-medium">{a.line1}</div>
                  <div className="text-sm text-gray-500">{a.city} {a.zip}</div>
                </div>
                <Button variant="outline" onClick={() => remove(a.id)}>Remove</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

