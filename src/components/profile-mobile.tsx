"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface Props { initial?: string }

export default function ProfileMobile({ initial = "" }: Props) {
  const [value, setValue] = useState(initial)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const save = async () => {
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ data: { phone: value } })
    setSaving(false)
    toast({ title: error ? "Failed to update" : "Mobile updated", description: error?.message || value })
  }

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-500">Mobile</div>
      <div className="flex gap-2">
        <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter mobile number" />
        <Button className="bg-orange-500 hover:bg-orange-600" onClick={save} disabled={saving}>Save</Button>
      </div>
    </div>
  )
}

