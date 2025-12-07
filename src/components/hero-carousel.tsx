"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const heroSlides = [
  {
    id: 1,
    title: "Authentic Italian Cuisine",
    subtitle: "Experience the taste of Italy with our handcrafted pasta and wood-fired pizzas",
    image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Italian%20restaurant%20interior%20with%20wood-fired%20pizza%20oven%2C%20warm%20lighting%2C%20rustic%20decor%2C%20professional%20food%20photography&image_size=landscape_16_9",
    cta: "Explore Menu",
    href: "/menu"
  },
  {
    id: 2,
    title: "Fresh Ingredients Daily",
    subtitle: "Locally sourced, organic produce delivered fresh every morning",
    image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Fresh%20colorful%20vegetables%20and%20herbs%20in%20a%20professional%20kitchen%2C%20natural%20lighting%2C%20food%20photography%20style&image_size=landscape_16_9",
    cta: "Order Now",
    href: "/menu"
  },
  {
    id: 3,
    title: "Chef's Special Selection",
    subtitle: "Discover our signature dishes crafted by award-winning chefs",
    image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Gourmet%20restaurant%20dish%20presentation%2C%20elegant%20plating%2C%20professional%20food%20photography%2C%20studio%20lighting&image_size=landscape_16_9",
    cta: "View Specials",
    href: "/menu"
  }
]

interface HeroCarouselProps {
  autoPlay?: boolean
  ctaHref?: string
}

export default function HeroCarousel({ autoPlay = true, ctaHref = "/menu" }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div 
      className="relative h-[520px] overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <AnimatePresence initial={false} custom={currentSlide}>
        {heroSlides.map((slide, index) => (
          index === currentSlide && (
            <motion.div
              key={slide.id}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-black/30 z-10" />
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 z-20 flex items-center">
                <div className="container mx-auto px-4">
                  <motion.div
                    className="max-w-2xl text-white"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                  >
                    <motion.h1
                      className="text-5xl md:text-6xl font-bold mb-4"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                    >
                      {slide.title}
                    </motion.h1>
                    <motion.p
                      className="text-xl md:text-2xl mb-8 text-gray-200"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
                    >
                      {slide.subtitle}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
                    >
                      <Link href={ctaHref}>
                        <Button 
                          size="lg" 
                          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
                        >
                          {slide.cta}
                        </Button>
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-white scale-125" 
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
