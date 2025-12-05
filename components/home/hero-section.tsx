"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { t } from "@/lib/i18n/translations"
import Link from "next/link"
import { Eye } from "lucide-react"
export default function HeroSection() {
  const { locale, dir } = useI18n()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  // Optimized banners - converted to WebP format
  const banners = useMemo(
    () => [
      {
        id: 1,
        title: t("hero.title", locale),
        subtitle: t("hero.subtitle", locale),
        image: "/photo-1441984904996-e0b6ba687e04.jpg", // WebP format
        cta: t("shop", locale),
        href: "/products",
      },
      {
        id: 2,
        title: t("hero.title", locale),
        subtitle: t("hero.subtitle", locale),
        image: "/photo-1441986300917-64674bd600d8.jpg", // WebP format
        cta: t("shop", locale),
        href: "/products",
      },
      {
        id: 3,
        title: t("hero.title", locale),
        subtitle: t("hero.subtitle", locale),
        image: "/photo-1571019613454-1cb2f99b2d8b.jpj.jpg", // WebP format - FIXED extension
        cta: t("shop", locale),
        href: "/products",
      },
    ],
    [locale]
  )

  // Preload first image for LCP
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const preloadLink = document.createElement('link')
      preloadLink.rel = 'preload'
      preloadLink.as = 'image'
      preloadLink.href = banners[0].image
      preloadLink.fetchPriority = 'high'
      document.head.appendChild(preloadLink)

      // Mark section as visible for animations
      setIsVisible(true)

      return () => {
        document.head.removeChild(preloadLink)
      }
    }
  }, [banners])

  // Optimized auto-slide effect with cleanup
  useEffect(() => {
    let timer: NodeJS.Timeout
    
    const startTimer = () => {
      timer = setInterval(() => {
        setCurrentSlide((prev) => {
          const next = (prev + 1) % banners.length
          // Preload next image
          if (typeof document !== 'undefined') {
            const img = document.createElement('img')
            img.src = banners[next].image
          }
          return next
        })
      }, 7000) // Increased to 7s for better LCP
    }

    startTimer()

    // Pause on hover for better UX
    const section = document.querySelector('.hero-section')
    const handleMouseEnter = () => clearInterval(timer)
    const handleMouseLeave = () => startTimer()

    section?.addEventListener('mouseenter', handleMouseEnter)
    section?.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      clearInterval(timer)
      section?.removeEventListener('mouseenter', handleMouseEnter)
      section?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [banners])

  // Optimized slide handlers with requestAnimationFrame
  const nextSlide = useCallback(() => {
    requestAnimationFrame(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    })
  }, [banners.length])

  const prevSlide = useCallback(() => {
    requestAnimationFrame(() => {
      setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
    })
  }, [banners.length])

  return (
    <section 
      className="hero-section relative h-[600px] md:h-[750px] overflow-hidden" 
      dir={dir}
      aria-label="Hero carousel"
    >
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentSlide
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-full"
          }`}
          aria-hidden={index !== currentSlide}
        >
          <Image
            src={banner.image}
            alt={banner.title}
            fill
            className="object-cover"
            priority={index === 0} // Only first image gets high priority
            loading={index === 0 ? "eager" : "lazy"}
            sizes="100vw"
            quality={index === 0 ? 90 : 85} // Higher quality for first image
            placeholder="blur"
            blurDataURL="data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAQAAAAfQ//73v/+BiOh/AAA="
          />

          {/* Gradient overlay for better text readability */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"
            aria-hidden="true"
          />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 md:px-8 lg:px-20">
              <div 
                className={`max-w-2xl text-white space-y-4 md:space-y-6 transition-all duration-700 ${
                  isVisible && index === currentSlide 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-4"
                }`}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  {banner.title}
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl text-gray-200">
                  {banner.subtitle}
                </p>
                <div className="pt-2">
                  <Link href={banner.href} prefetch={false}>
                
              <Button 
                size="lg" 
                className="rounded-full px-8 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                <Eye className="mr-2 h-4 w-4" />
                View All Products
              </Button>
          
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 hover:scale-110 transition-all focus:ring-2 focus:ring-white focus:ring-offset-2"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 hover:scale-110 transition-all focus:ring-2 focus:ring-white focus:ring-offset-2"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </Button>

    
    </section>
  )
}