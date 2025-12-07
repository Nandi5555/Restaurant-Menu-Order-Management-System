"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Address { id: string; line1: string; city: string; zip: string }

export default function ProfileAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [line1, setLine1] = useState("")
  const [city, setCity] = useState("")
  const [zip, setZip] = useState("")
  const [defaultId, setDefaultId] = useState<string>("")

  useEffect(() => {
    const raw = localStorage.getItem("addresses")
    const def = localStorage.getItem("default_address_id") || ""
    if (raw) setAddresses(JSON.parse(raw))
    setDefaultId(def)
  }, [])

  const save = (list: Address[], def?: string) => {
    setAddresses(list)
    localStorage.setItem("addresses", JSON.stringify(list))
    if (def !== undefined) {
      setDefaultId(def)
      localStorage.setItem("default_address_id", def)
    }
  }

  const add = () => {
    if (!line1 || !city) return
    const a: Address = { id: crypto.randomUUID(), line1, city, zip }
    const list = [...(addresses || []), a]
    const def = defaultId || a.id
    save(list, def)
    setLine1(""); setCity(""); setZip("")
  }

  const remove = (id: string) => {
    const list = addresses.filter(a => a.id !== id)
    let def = defaultId
    if (def === id) def = list[0]?.id || ""
    save(list, def)
  }

  const makeDefault = (id: string) => save(addresses, id)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Address</CardTitle>
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
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => makeDefault(a.id)}
                  disabled={defaultId === a.id ? true : false}
                >
                  {defaultId === a.id ? "Default" : "Make Default"}
                </Button>
                <Button variant="outline" onClick={() => remove(a.id)}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
