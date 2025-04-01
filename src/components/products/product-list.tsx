"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Không thể lấy dữ liệu sản phẩm");
      const data = await response.json();
      console.log("Fetched products:", data); // Debug dữ liệu trả về
      setProducts(Array.isArray(data) ? data : [data]); // Đảm bảo data là mảng
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
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
    return <div className="text-center mt-6">Đang tải sản phẩm...</div>;
  }

  return (
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
                  <span className="ml-1 text-sm font-medium">{product.rating || "N/A"}</span>
                </div>
                <span className="mx-2 text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">
                  {product.reviewCount || 0} đánh giá
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
  );
}