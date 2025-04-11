"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { ChevronDown, ChevronUp, Filter } from "lucide-react"
import { formatPrice } from "@/lib/formatPrice"

const categories = [
  { id: "shirts", label: "Áo" },
  { id: "pants", label: "Quần" },
  { id: "jackets", label: "Áo khoác" },
  { id: "shoes", label: "Giày" },
  { id: "accessories", label: "Phụ kiện" },
]

const colors = [
  { id: "black", label: "Đen" },
  { id: "white", label: "Trắng" },
  { id: "blue", label: "Xanh" },
  { id: "gray", label: "Xám" },
  { id: "brown", label: "Nâu" },
  { id: "green", label: "Xanh lá" },
]

const sizes = [
  { id: "s", label: "S" },
  { id: "m", label: "M" },
  { id: "l", label: "L" },
  { id: "xl", label: "XL" },
  { id: "xxl", label: "XXL" },
]

export default function ProductFilters() {
  const [priceRange, setPriceRange] = useState([0, 2000000])
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    colors: true,
    sizes: true,
  })
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections({
      ...openSections,
      [section]: !openSections[section],
    })
  }


  return (
    <div className="sticky top-20">
      {/* Mobile filter button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          className="w-full flex items-center justify-between"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
        >
          <span className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Bộ lọc
          </span>
          {mobileFiltersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {/* Filter sections */}
      <AnimatePresence>
        {(mobileFiltersOpen || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Categories */}
            <div className="border-b pb-6">
              <div
                className="flex justify-between items-center cursor-pointer mb-4"
                onClick={() => toggleSection("categories")}
              >
                <h3 className="font-medium">Danh mục</h3>
                {openSections.categories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>

              <AnimatePresence>
                {openSections.categories && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox id={`category-${category.id}`} />
                        <label
                          htmlFor={`category-${category.id}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category.label}
                        </label>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Price Range */}
            <div className="border-b pb-6">
              <div
                className="flex justify-between items-center cursor-pointer mb-4"
                onClick={() => toggleSection("price")}
              >
                <h3 className="font-medium">Giá</h3>
                {openSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>

              <AnimatePresence>
                {openSections.price && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <Slider
                      defaultValue={[0, 2000000]}
                      max={2000000}
                      step={50000}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="mt-6"
                    />

                    <div className="flex items-center justify-between">
                      <span className="text-sm">{formatPrice(priceRange[0])}</span>
                      <span className="text-sm">{formatPrice(priceRange[1])}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Colors */}
            <div className="border-b pb-6">
              <div
                className="flex justify-between items-center cursor-pointer mb-4"
                onClick={() => toggleSection("colors")}
              >
                <h3 className="font-medium">Màu sắc</h3>
                {openSections.colors ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>

              <AnimatePresence>
                {openSections.colors && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    {colors.map((color) => (
                      <div key={color.id} className="flex items-center space-x-2">
                        <Checkbox id={`color-${color.id}`} />
                        <label
                          htmlFor={`color-${color.id}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {color.label}
                        </label>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sizes */}
            <div>
              <div
                className="flex justify-between items-center cursor-pointer mb-4"
                onClick={() => toggleSection("sizes")}
              >
                <h3 className="font-medium">Kích cỡ</h3>
                {openSections.sizes ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>

              <AnimatePresence>
                {openSections.sizes && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    {sizes.map((size) => (
                      <div key={size.id} className="flex items-center space-x-2">
                        <Checkbox id={`size-${size.id}`} />
                        <label
                          htmlFor={`size-${size.id}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {size.label}
                        </label>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Apply filters button */}
            <Button className="w-full">Áp dụng bộ lọc</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

