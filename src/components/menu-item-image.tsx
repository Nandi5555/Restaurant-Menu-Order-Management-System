"use client"

import { useState, useMemo } from "react"
import Image from "next/image"

interface Props {
  src?: string | null
  alt: string
  className?: string
  width?: number
  height?: number
}

export default function MenuItemImage({ src, alt, className, width = 800, height = 600 }: Props) {
  const [error, setError] = useState(false)
  const sanitized = (src || "").trim()
  const encoded = useMemo(() => (sanitized ? encodeURI(sanitized) : ""), [sanitized])
  const fallback = useMemo(() => `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(alt + ' plated dish, professional food photography, soft lighting, shallow depth of field')}&image_size=landscape_4_3`, [alt])
  const finalSrc = !encoded || error ? fallback : encoded

  return (
    <Image
      src={finalSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized
      onError={() => setError(true)}
    />
  )
}

