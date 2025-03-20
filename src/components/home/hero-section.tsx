"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    id: 1,
    image: "/banner/banner-4.jpg",
    title: "Bộ sưu tập Thu Đông 2024",
    description: "Khám phá phong cách mới với những thiết kế độc đáo và sang trọng",
    cta: "Mua ngay",
    link: "/collections/autumn-winter-2024",
  },
  {
    id: 2,
    image: "/banner/banner-5.jpg",
    title: "Phong cách công sở",
    description: "Lịch lãm và chuyên nghiệp với các mẫu vest, áo sơ mi cao cấp",
    cta: "Khám phá",
    link: "/collections/office-wear",
  },
  {
    id: 3,
    image: "/banner/banner-3.jpg",
    title: "Thời trang dạo phố",
    description: "Thoải mái và phong cách với các thiết kế casual hiện đại",
    cta: "Xem ngay",
    link: "/collections/casual",
  },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  const nextSlide = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1)
  }

  const prevSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (autoplay) {
      interval = setInterval(() => {
        nextSlide()
      }, 5000)
    }

    return () => clearInterval(interval)
  }, [current, autoplay,nextSlide])

  return (
    <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
          onHoverStart={() => setAutoplay(false)}
          onHoverEnd={() => setAutoplay(true)}
        >
          <Image
            src={slides[current].image || "/placeholder.svg"}
            alt={slides[current].title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="max-w-xl text-center mx-auto text-white"
              >
                <h1 className="text-3xl md:text-5xl font-bold mb-4">{slides[current].title}</h1>
                <p className="text-lg md:text-xl mb-8">{slides[current].description}</p>
                <Button asChild size="lg" className="rounded-full px-8">
                  <Link href={slides[current].link}>{slides[current].cta}</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 z-10 rounded-full h-12 w-12"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Previous</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 z-10 rounded-full h-12 w-12"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Next</span>
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${index === current ? "w-8 bg-white" : "w-2 bg-white/50"}`}
            onClick={() => setCurrent(index)}
          >
            <span className="sr-only">Slide {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

