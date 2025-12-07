"use server"

import { createServerClient } from "@/lib/supabase"

async function fetchBytes(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`fetch ${url} failed`)
  const arrayBuffer = await res.arrayBuffer()
  return new Uint8Array(arrayBuffer)
}

export async function generateDishImage(name: string): Promise<Uint8Array | null> {
  const apiUrl = process.env.GEMINI_IMAGE_API_URL
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY

  if (apiUrl && apiKey) {
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({ prompt: `${name}, plated dish, professional food photography`, size: "landscape_4_3" })
      })
      if (!res.ok) throw new Error("gemini image api error")
      const data = await res.json()
      if (data.image_base64) {
        const buf = Buffer.from(data.image_base64, "base64")
        return new Uint8Array(buf)
      }
      if (data.image_url) {
        return await fetchBytes(data.image_url)
      }
    } catch (e) {
      // fall through to Trae
    }
  }

  try {
    const fallbackUrl = `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(name + ' plated dish, professional food photography, soft lighting, shallow depth of field')}&image_size=landscape_4_3`
    return await fetchBytes(fallbackUrl)
  } catch {
    return null
  }
}

export async function ensureMenuItemImage(id: string, name: string): Promise<string | null> {
  const supabase = createServerClient()

  const img = await generateDishImage(name)
  if (!img) return null

  // ensure bucket
  await supabase.storage.createBucket("menu-images", { public: true }).catch(() => {})
  const fileName = `${id}.png`
  const { error } = await supabase.storage.from("menu-images").upload(fileName, img, { contentType: "image/png", upsert: true })
  if (error) return null
  const { data: pub } = supabase.storage.from("menu-images").getPublicUrl(fileName)
  const publicUrl = pub?.publicUrl || null
  if (publicUrl) {
    await supabase.from("menu_items").update({ image_url: publicUrl }).eq("id", id)
  }
  return publicUrl
}
