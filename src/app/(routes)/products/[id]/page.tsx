"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, ShoppingBag, Star } from "lucide-react";
import ProductGallery from "@/components/products/product-gallery";
// Removed unused RelatedProducts import
import ProductReviews from "@/components/products/product-reviews";
import NotFound from "@/app/not-found";
import Loading from "../../loading";

export default function ProductDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hàm lấy dữ liệu sản phẩm từ API theo ID
  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (!response.ok) {
        if (response.status === 404) throw new Error("Không tìm thấy sản phẩm");
        if (response.status === 400) throw new Error("ID sản phẩm không hợp lệ");
        throw new Error("Lỗi không thể tải sản phẩm tải sản phẩm");
      }
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    } else {
      setError("ID sản phẩm không được cung cấp");
      setLoading(false);
    }
  }, [params.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        <NotFound />
      </div>
    );
  }

  // Điều chỉnh dữ liệu từ DB cho phù hợp với giao diện
  const adaptedProduct = {
    ...product,
    salePrice: product.discountPrice || null,
    rating: product.rating || 5,
    reviewCount: product.reviewCount || 0,
    images: product.image ? [product.image] : ["/placeholder.svg?height=600&width=400"],
    colors: product.colors || [{ name: "Mặc định", value: "default" }],
    sizes: product.sizes || ["M"],
    features: product.features || ["Chất liệu cao cấp", "Thiết kế hiện đại"],
    categories: product.categories || ["Sản phẩm"],
    tags: product.tags || ["Mặc định"],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Gallery */}
        <div className="w-full md:w-1/2">
          <ProductGallery images={adaptedProduct.images} />
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2">
          <div className="flex flex-col space-y-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                {adaptedProduct.categories.map((category: string, index: number) => (
                  <span key={index}>
                    <Link href={`/products/category/${category.toLowerCase()}`} className="hover:text-primary">
                      {category}
                    </Link>
                    {index < adaptedProduct.categories.length - 1 && " / "}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl font-bold">{adaptedProduct.name}</h1>

              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="ml-1 text-sm font-medium">{adaptedProduct.rating}</span>
                </div>
                <span className="mx-2 text-muted-foreground">•</span>
                <Link href="#reviews" className="text-sm text-muted-foreground hover:text-primary">
                  {adaptedProduct.reviewCount || 3} đánh giá
                </Link>
              </div>
            </div>

            <div className="mt-4">
              {adaptedProduct.salePrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{formatPrice(adaptedProduct.salePrice)}</span>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(adaptedProduct.price)}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold">{formatPrice(adaptedProduct.price)}</span>
              )}
            </div>

            <div className="mt-6">
              <p className="text-muted-foreground">{adaptedProduct.description || "Không có mô tả"}</p>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-2">Màu sắc</h3>
              <div className="flex gap-2">
                {adaptedProduct.colors.map((color: { name: string; value: string }) => (
                  <Button key={color.value} variant="outline" className="rounded-md h-10 px-4">
                    {color.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-2">Kích cỡ</h3>
              <div className="flex gap-2">
                {adaptedProduct.sizes.map((size: string) => (
                  <Button key={size} variant="outline" className="rounded-md h-10 w-10">
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-sm text-muted-foreground">
                  Tình trạng:{" "}
                  <span className={adaptedProduct.stock > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {adaptedProduct.stock > 0 ? "Còn hàng" : "Hết hàng"}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button size="lg" className="flex-1 gap-2" disabled={adaptedProduct.stock <= 0}>
                  <ShoppingBag className="h-5 w-5" />
                  Thêm vào giỏ hàng
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Thêm vào yêu thích</span>
                </Button>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t">
              <h3 className="font-medium mb-2">Đặc điểm sản phẩm</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {adaptedProduct.features.map((feature: string, index: number) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {adaptedProduct.tags.map((tag: string, index: number) => (
                <Link
                  key={index}
                  href={`/products/tag/${tag.toLowerCase()}`}
                  className="text-xs bg-muted px-2 py-1 rounded-md hover:bg-primary/10"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start border-b rounded-none">
            <TabsTrigger value="description">Mô tả</TabsTrigger>
            <TabsTrigger value="reviews" id="reviews">
              Đánh giá ({adaptedProduct.reviewCount || 3})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-6">
            <div className="prose max-w-none">
              <h3>Giới thiệu về {adaptedProduct.name}</h3>
              <br />
              <p>{adaptedProduct.description || "Không có mô tả chi tiết cho sản phẩm này."}</p>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="py-6">
            <Suspense fallback={<div>Đang tải đánh giá...</div>}>
              <ProductReviews productId={adaptedProduct.id} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>

      {/* <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">Sản phẩm liên quan</h2>
        <Suspense fallback={<div>Đang tải sản phẩm liên quan...</div>}>
          <RelatedProducts
            categoryId={adaptedProduct.categories[0]}
            currentProductId={adaptedProduct.id}
          />
        </Suspense>
      </div> */}
    </div>
  );
}