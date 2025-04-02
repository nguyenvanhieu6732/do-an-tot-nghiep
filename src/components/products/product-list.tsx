"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Loading from "@/app/(routes)/loading";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Định nghĩa interface cho Product
interface Product {
  id: string;
  name: string;
  price: number;
  image?: string | null;
  salePrice?: number;
  rating?: number;
  reviewCount?: number;
  colors?: string[];
  isNew?: boolean;
  isSale?: boolean;
}

// Interface cho thông tin phân trang từ API
interface Pagination {
  currentPage: number;
  pageSize: number;
  totalProducts: number;
  totalPages: number;
}

const sortOptions = [
  { id: "newest", label: "Mới nhất" },
  { id: "price-asc", label: "Giá: Thấp đến cao" },
  { id: "price-desc", label: "Giá: Cao đến thấp" },
];

export default function ProductList({ sort: initialSort }: { sort?: string | null }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSort, setSelectedSort] = useState(
    sortOptions.find((option) => option.id === initialSort) || sortOptions[0]
  ); // Khởi tạo với initialSort hoặc mặc định "newest"

  const fetchProducts = async (page: number, sortValue: string | null) => {
    try {
      const url = sortValue
        ? `/api/products?page=${page}&sort=${sortValue}`
        : `/api/products?page=${page}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Không thể lấy dữ liệu sản phẩm");
      const data = await response.json();
      console.log("Fetched products:", data); // Debug dữ liệu trả về
      setProducts(Array.isArray(data.products) ? data.products : []); // Ensure products is always an array
      setPagination(data.pagination); // Thông tin phân trang từ API
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, selectedSort.id);
  }, [currentPage, selectedSort]);

  const handleSortChange = (option: typeof sortOptions[0]) => {
    setSelectedSort(option);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi sắp xếp
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn lên đầu trang
    }
  };

  const handleNext = () => {
    if (pagination && currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn lên đầu trang
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground mr-2">Sắp xếp theo:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                {selectedSort.label}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {sortOptions.map((option) => (
                <DropdownMenuItem key={option.id} onClick={() => handleSortChange(option)}>
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
        >
          {products.length === 0 ? (
            <div className="text-center col-span-full">Không có sản phẩm nào!</div>
          ) : (
            products.map((product) => (
              <motion.div
                key={product.id}
                variants={item}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                className="group"
              >
                <div className="relative rounded-lg overflow-hidden">
                  <Link href={`/products/${product.id}`}>
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </Link>

                  <div className="absolute top-2 left-2 flex flex-col gap-2">
                    {product.isNew && (
                      <Badge className="bg-primary text-primary-foreground">Mới</Badge>
                    )}
                    {product.isSale && (
                      <Badge className="bg-destructive text-destructive-foreground">Giảm giá</Badge>
                    )}
                  </div>

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

                  <div
                    className={cn(
                      "absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm p-4 transform translate-y-full transition-transform duration-300",
                      hoveredProduct === product.id && "translate-y-0"
                    )}
                  >
                    <Button className="w-full gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      Thêm vào giỏ hàng
                    </Button>
                  </div>
                </div>

                <div className="mt-4">
                  <Link href={`/products/${product.id}`} className="block">
                    <h3 className="font-medium text-lg hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center mt-1">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="ml-1 text-sm font-medium">{product.rating || "5"}</span>
                    </div>
                    <span className="mx-2 text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {product.reviewCount || 3} đánh giá
                    </span>
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
                    {(product.colors ?? []).map((color: string, index: number) => (
                      <span key={index} className="text-sm text-muted-foreground">
                        {color}
                        {index < ((product.colors ?? []).length - 1) ? ", " : ""}
                      </span>
                    )) || <span className="text-sm text-muted-foreground">Không có màu</span>}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Phân trang */}
        {pagination && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              variant="outline"
              className="px-4 py-2"
            >
              Trước
            </Button>

            <span className="text-muted-foreground">
              Trang {pagination.currentPage} / {pagination.totalPages}
            </span>

            <Button
              onClick={handleNext}
              disabled={currentPage === pagination.totalPages}
              variant="outline"
              className="px-4 py-2"
            >
              Sau
            </Button>
          </div>
        )}
      </div>
    </>
  );
}