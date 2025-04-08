"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, ShoppingBag, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import ProductList from "../products/product-list"
import { useRouter } from "next/navigation" // Sửa import từ next/navigation

export default function FeaturedProducts() {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)
  const router = useRouter()  // Khai báo router

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <h2 className="text-3xl font-bold mb-4">Sản phẩm nổi bật</h2>
          <p className="text-muted-foreground max-w-2xl">
            Những sản phẩm được yêu thích nhất và bán chạy nhất của chúng tôi
          </p>
        </div>
      </div>
      <div className="relative h-[50vh] overflow-hidden">
        <Image
          src="/about/banner-about-2.jpg"
          alt="LUXMEN - Thời trang nam cao cấp"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sản phẩm của chúng tôi</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              LUXMEN - Thương hiệu thời trang nam cao cấp hàng đầu Việt Nam
            </p>
            <Button
              onClick={() => router.push("/products")}
              className="mt-4 px-4 py-2 text-muted-foreground bg-muted"
            >
              Khám phá sản phẩm
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}