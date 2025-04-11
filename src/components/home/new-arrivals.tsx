"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/formatPrice"

const products = [
  {
    id: 1,
    name: "Áo len cashmere",
    price: 1250000,
    image: "/placeholder.svg?height=600&width=400",
    link: "/products/cashmere-sweater",
  },
  {
    id: 2,
    name: "Áo khoác denim",
    price: 1450000,
    image: "/placeholder.svg?height=600&width=400",
    link: "/products/denim-jacket",
  },
  {
    id: 3,
    name: "Quần jeans slim-fit",
    price: 950000,
    image: "/placeholder.svg?height=600&width=400",
    link: "/products/slim-fit-jeans",
  },
  {
    id: 4,
    name: "Áo polo cotton",
    price: 650000,
    image: "/placeholder.svg?height=600&width=400",
    link: "/products/cotton-polo",
  },
  {
    id: 5,
    name: "Giày loafer da",
    price: 1850000,
    image: "/placeholder.svg?height=600&width=400",
    link: "/products/leather-loafers",
  },
  {
    id: 6,
    name: "Áo thun graphic",
    price: 450000,
    image: "/placeholder.svg?height=600&width=400",
    link: "/products/graphic-tshirt",
  },
]

export default function NewArrivals() {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)


  return (
    <section className="bg-muted py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Sản phẩm mới</h2>
            <p className="text-muted-foreground max-w-2xl">
              Khám phá những sản phẩm mới nhất trong bộ sưu tập của chúng tôi
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10"
              id="prev-new-arrivals"
              aria-label="Previous products"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10"
              id="next-new-arrivals"
              aria-label="Next products"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              className="group bg-background rounded-lg overflow-hidden shadow-sm"
            >
              <div className="relative">
                <Link href={product.link}>
                  <div className="aspect-[3/4] overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </Link>

                <div className="absolute top-2 left-2">
                  <Badge className="bg-primary text-primary-foreground">Mới</Badge>
                </div>

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

              <div className="p-4">
                <Link href={product.link} className="block">
                  <h3 className="font-medium text-lg hover:text-primary transition-colors">{product.name}</h3>
                </Link>

                <div className="mt-2">
                  <span className="font-medium">{formatPrice(product.price)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild>
            <Link href="/products/new-arrivals">Xem tất cả sản phẩm mới</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

