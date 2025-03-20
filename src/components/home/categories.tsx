"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

const categories = [
  {
    id: 1,
    name: "Áo",
    image: "/placeholder.svg?height=400&width=300",
    link: "/products/shirts",
  },
  {
    id: 2,
    name: "Quần",
    image: "/placeholder.svg?height=400&width=300",
    link: "/products/pants",
  },
  {
    id: 3,
    name: "Giày",
    image: "/placeholder.svg?height=400&width=300",
    link: "/products/shoes",
  },
  {
    id: 4,
    name: "Phụ kiện",
    image: "/placeholder.svg?height=400&width=300",
    link: "/products/accessories",
  },
]

export default function Categories() {
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
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Danh mục sản phẩm</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Khám phá các danh mục sản phẩm đa dạng của chúng tôi, từ trang phục đến phụ kiện thời trang nam
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {categories.map((category) => (
          <motion.div key={category.id} variants={item}>
            <Link href={category.link} className="group block overflow-hidden rounded-lg">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

