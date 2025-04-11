"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/formatPrice"

interface RelatedProductsProps {
  categoryId: string
  currentProductId: number
}

export default function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)

  // Giả lập dữ liệu sản phẩm liên quan
  const relatedProducts = Array.from({ length: 4 }).map((_, i) => ({
    id: i + 10,
    name: `Sản phẩm liên quan ${i + 1}`,
    price: Math.floor(Math.random() * 1000000) + 500000,
    salePrice: Math.random() > 0.7 ? Math.floor(Math.random() * 800000) + 400000 : null,
    image: "/placeholder.svg?height=600&width=400",
    link: `/products/related-product-${i + 1}`,
  }))


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {relatedProducts.map((product) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
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
              <h3 className="font-medium hover:text-primary transition-colors">{product.name}</h3>
            </Link>

            <div className="mt-2">
              {product.salePrice ? (
                <div className="flex items-center gap-2">
                  <span className="font-medium">{formatPrice(product.salePrice)}</span>
                  <span className="text-sm text-muted-foreground line-through">{formatPrice(product.price)}</span>
                </div>
              ) : (
                <span className="font-medium">{formatPrice(product.price)}</span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

