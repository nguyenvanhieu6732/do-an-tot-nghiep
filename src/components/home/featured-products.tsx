"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, ShoppingBag, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const products = [
  {
    id: 1,
    name: "Áo sơ mi Oxford",
    price: 850000,
    salePrice: null,
    rating: 4.8,
    reviewCount: 124,
    image: "/placeholder.svg?height=600&width=400",
    colors: ["Trắng", "Xanh nhạt", "Xám"],
    isNew: true,
    isSale: false,
    link: "/products/oxford-shirt",
  },
  {
    id: 2,
    name: "Quần Chinos Slim-fit",
    price: 950000,
    salePrice: 750000,
    rating: 4.6,
    reviewCount: 98,
    image: "/placeholder.svg?height=600&width=400",
    colors: ["Đen", "Xanh navy", "Be"],
    isNew: false,
    isSale: true,
    link: "/products/slim-fit-chinos",
  },
  {
    id: 3,
    name: "Áo khoác Bomber",
    price: 1250000,
    salePrice: null,
    rating: 4.9,
    reviewCount: 156,
    image: "/placeholder.svg?height=600&width=400",
    colors: ["Đen", "Xanh rêu", "Nâu"],
    isNew: true,
    isSale: false,
    link: "/products/bomber-jacket",
  },
  {
    id: 4,
    name: "Giày Chelsea Boots",
    price: 1850000,
    salePrice: 1550000,
    rating: 4.7,
    reviewCount: 87,
    image: "/placeholder.svg?height=600&width=400",
    colors: ["Đen", "Nâu"],
    isNew: false,
    isSale: true,
    link: "/products/chelsea-boots",
  },
]

export default function FeaturedProducts() {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price)
  }

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
        <Link href="/products" className="mt-4 md:mt-0 text-primary font-medium hover:underline">
          Xem tất cả sản phẩm
        </Link>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            variants={item}
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
            className="group"
          >
            <div className="relative rounded-lg overflow-hidden">
              <Link href={product.link}>
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </Link>

              {/* Product badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-2">
                {product.isNew && <Badge className="bg-primary text-primary-foreground">Mới</Badge>}
                {product.isSale && <Badge className="bg-destructive text-destructive-foreground">Giảm giá</Badge>}
              </div>

              {/* Quick actions */}
              <div className="absolute top-2 right-2 flex flex-col gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                >
                  <Heart className="h-4 w-4" />
                  <span className="sr-only">Thêm vào yêu thích</span>
                </Button>
              </div>

              {/* Add to cart button */}
              <div
                className={cn(
                  "absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm p-4 transform translate-y-full transition-transform duration-300",
                  hoveredProduct === product.id && "translate-y-0",
                )}
              >
                <Button className="w-full gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Thêm vào giỏ hàng
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <Link href={product.link} className="block">
                <h3 className="font-medium text-lg hover:text-primary transition-colors">{product.name}</h3>
              </Link>

              <div className="flex items-center mt-1">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="ml-1 text-sm font-medium">{product.rating}</span>
                </div>
                <span className="mx-2 text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{product.reviewCount} đánh giá</span>
              </div>

              <div className="mt-2 flex items-center">
                {product.salePrice ? (
                  <>
                    <span className="font-medium">{formatPrice(product.salePrice)}</span>
                    <span className="ml-2 text-sm text-muted-foreground line-through">
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="font-medium">{formatPrice(product.price)}</span>
                )}
              </div>

              <div className="mt-2 flex items-center gap-1">
                {product.colors.map((color, index) => (
                  <span key={index} className="text-sm text-muted-foreground">
                    {color}
                    {index < product.colors.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

