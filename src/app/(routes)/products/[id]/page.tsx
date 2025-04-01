"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, ShoppingBag, Star } from "lucide-react";
import ProductGallery from "@/components/products/product-gallery";
import RelatedProducts from "@/components/products/related-products";
import ProductReviews from "@/components/products/product-reviews";



export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hàm lấy dữ liệu sản phẩm từ API
  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products?slug=${params.slug}`); // Giả sử API hỗ trợ tìm theo slug
      if (!response.ok) throw new Error("Không thể tải sản phẩm");
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setProduct(data[0]); // Lấy sản phẩm đầu tiên nếu API trả về mảng
      } else {
        throw new Error("Sản phẩm không tồn tại");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [params.slug]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Đang tải sản phẩm...</div>;
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        {error || "Sản phẩm không tồn tại"}
      </div>
    );
  }

  // Điều chỉnh dữ liệu từ DB cho phù hợp với giao diện
  const adaptedProduct = {
    ...product,
    salePrice: product.discountPrice || null,
    rating: product.rating || 4.5, // Giả lập nếu không có trong DB
    reviewCount: product.reviewCount || 0, // Giả lập nếu không có
    images: product.image ? [product.image] : ["/placeholder.svg?height=600&width=400"], // Chỉ 1 ảnh từ DB
    colors: product.colors || [{ name: "Mặc định", value: "default" }], // Giả lập nếu không có
    sizes: product.sizes || ["M"], // Giả lập nếu không có
    features: product.features || ["Chất liệu cao cấp", "Thiết kế hiện đại"], // Giả lập
    sku: product.sku || `SKU-${product.id.slice(0, 8)}`, // Tạo SKU từ ID nếu không có
    categories: product.categories || ["Sản phẩm"], // Giả lập
    tags: product.tags || ["Mặc định"], // Giả lập
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
                  {adaptedProduct.reviewCount} đánh giá
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
                <div className="text-sm text-muted-foreground">
                  SKU: <span className="font-medium">{adaptedProduct.sku}</span>
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
            <TabsTrigger value="specifications">Thông số</TabsTrigger>
            <TabsTrigger value="reviews" id="reviews">
              Đánh giá ({adaptedProduct.reviewCount})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-6">
            <div className="prose max-w-none">
              <h3>Giới thiệu về {adaptedProduct.name}</h3>
              <p>{adaptedProduct.description || "Không có mô tả chi tiết cho sản phẩm này."}</p>
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Thông số chi tiết</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 border-b pb-2">
                    <span className="text-muted-foreground">Thương hiệu</span>
                    <span>LUXMEN</span>
                  </div>
                  <div className="grid grid-cols-2 border-b pb-2">
                    <span className="text-muted-foreground">Chất liệu</span>
                    <span>{adaptedProduct.material || "Không xác định"}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="py-6">
            <Suspense fallback={<div>Đang tải đánh giá...</div>}>
              <ProductReviews productId={adaptedProduct.id} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">Sản phẩm liên quan</h2>
        <Suspense fallback={<div>Đang tải sản phẩm liên quan...</div>}>
          <RelatedProducts
            categoryId={adaptedProduct.categories[0]}
            currentProductId={adaptedProduct.id}
          />
        </Suspense>
      </div>
    </div>
  );
}