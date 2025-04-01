"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: string[]
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })

  const handlePrevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleThumbnailClick = (index: number) => {
    setCurrentImage(index)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100

    setZoomPosition({ x, y })
  }

  const toggleZoom = () => {
    setIsZoomed(!isZoomed)
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div
        className={cn(
          "relative aspect-square overflow-hidden rounded-lg",
          isZoomed ? "cursor-zoom-out" : "cursor-zoom-in",
        )}
        onClick={toggleZoom}
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative h-full w-full"
          >
            <Image
              src={images[currentImage] || "/placeholder.svg"}
              alt={`Product image ${currentImage + 1}`}
              fill
              className={cn("object-cover transition-transform duration-300", isZoomed && "scale-150")}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }
                  : undefined
              }
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 text-foreground hover:bg-background/90 z-10 rounded-full h-8 w-8"
          onClick={(e) => {
            e.stopPropagation()
            handlePrevImage()
          }}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous image</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 text-foreground hover:bg-background/90 z-10 rounded-full h-8 w-8"
          onClick={(e) => {
            e.stopPropagation()
            handleNextImage()
          }}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next image</span>
        </Button>

        {/* Zoom indicator */}
        <div className="absolute bottom-2 right-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 text-foreground hover:bg-background/90 rounded-full h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              toggleZoom()
            }}
          >
            <ZoomIn className="h-4 w-4" />
            <span className="sr-only">Zoom image</span>
          </Button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={cn(
              "relative h-20 w-20 rounded-md overflow-hidden border-2 transition-all",
              currentImage === index ? "border-primary" : "border-transparent hover:border-primary/50",
            )}
            onClick={() => handleThumbnailClick(index)}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Product thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

