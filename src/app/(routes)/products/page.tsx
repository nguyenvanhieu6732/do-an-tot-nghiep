import { Suspense } from "react"
import ProductList from "@/components/products/product-list"
import ProductFilters from "@/components/products/product-filters"
import ProductSorting from "@/components/products/product-sorting"
import ProductsLoading from "@/components/products/products-loading"

export const metadata = {
  title: "Sản phẩm - LUXMEN",
  description: "Khám phá bộ sưu tập thời trang nam cao cấp của LUXMEN",
}

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Sản phẩm</h1>
        <p className="text-muted-foreground max-w-3xl">
          Khám phá bộ sưu tập thời trang nam cao cấp của LUXMEN với các thiết kế hiện đại và chất liệu cao cấp
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        <div className="w-full lg:w-1/4">
          <ProductFilters />
        </div>

        <div className="w-full lg:w-3/4">
          <ProductSorting />

          <Suspense fallback={<ProductsLoading />}>
            <ProductList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

