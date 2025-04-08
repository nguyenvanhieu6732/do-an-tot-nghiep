"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, ShoppingBag, Star, Plus, Minus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ProductGallery from "@/components/products/product-gallery";
import ProductReviews from "@/components/products/product-reviews";
import NotFound from "@/app/not-found";
import Loading from "../../loading";
import { useAuth } from "@clerk/nextjs";

export default function ProductDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { userId } = useAuth();

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (!response.ok) {
        if (response.status === 404) throw new Error("Không tìm thấy sản phẩm");
        if (response.status === 400) throw new Error("ID sản phẩm không hợp lệ");
        throw new Error("Lỗi không thể tải sản phẩm");
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
    if (params.id) fetchProduct();
    else {
      setError("ID sản phẩm không được cung cấp");
      setLoading(false);
    }
  }, [params.id]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 }).format(price);

  if (loading) return <Loading />;
  if (error || !product) return <NotFound />;

  const basicColors = [
    { name: "Đen", value: "black" },
    { name: "Trắng", value: "white" },
    { name: "Đỏ", value: "red" },
    { name: "Vàng", value: "yellow" },
    { name: "Xám", value: "gray" },
  ];

  const fullSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const adaptedProduct = {
    ...product,
    salePrice: product.discountPrice || null,
    rating: product.rating || 5,
    reviewCount: product.reviewCount || 0,
    images: product.image ? [product.image] : ["/placeholder.svg?height=600&width=400"],
    colors: product.colors?.length > 0 ? product.colors : basicColors,
    sizes: product.sizes?.length > 0 ? product.sizes : fullSizes,
    features: product.features || ["Chất liệu cao cấp", "Thiết kế hiện đại"],
    categories: product.categories || ["Sản phẩm"],
  };

  const resetDialog = () => {
    setQuantity(1);
    setSelectedColor(adaptedProduct.colors[0].value);
    setSelectedSize(adaptedProduct.sizes[0]);
    setIsAddDialogOpen(false);
  };

  const handleAddToCart = async () => {
    if (!userId) {
      toast.error("Yêu cầu đăng nhập", {
        description: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng",
      });
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId: adaptedProduct.id,
          quantity: quantity,
          color: selectedColor,
          size: selectedSize,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Không thể thêm sản phẩm vào giỏ hàng");
      }

      resetDialog();
      toast.success("Thành công", {
        description: "Sản phẩm đã được thêm vào giỏ hàng!",
        action: {
          label: "Xem giỏ hàng",
          onClick: () => window.location.href = "/cart",
        },
      });
      
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Lỗi", {
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi khi thêm sản phẩm",
      });
    }
  };

  if (!selectedColor && !selectedSize && adaptedProduct) {
    setSelectedColor(adaptedProduct.colors[0].value);
    setSelectedSize(adaptedProduct.sizes[0]);
  }

  const increaseQuantity = () => {
    if (quantity < adaptedProduct.stock) setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <ProductGallery images={adaptedProduct.images} />
        </div>

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
                  <Button
                    key={color.value}
                    variant={selectedColor === color.value ? "default" : "outline"}
                    className="rounded-md h-10 px-4"
                    onClick={() => setSelectedColor(color.value)}
                  >
                    {color.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-2">Kích cỡ</h3>
              <div className="flex gap-2">
                {adaptedProduct.sizes.map((size: string) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    className="rounded-md h-10 w-10"
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-sm text-muted-foreground">
                  Tình trạng:
                  <span className={adaptedProduct.stock > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {adaptedProduct.stock > 0 ? " Còn hàng" : " Hết hàng"}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                  setIsAddDialogOpen(open);
                  if (!open) resetDialog();
                }}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="flex-1 gap-2" disabled={adaptedProduct.stock <= 0}>
                      <ShoppingBag className="h-5 w-5" />
                      Thêm vào giỏ hàng
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Thêm sản phẩm vào giỏ hàng</DialogTitle>
                      <DialogDescription>
                        Vui lòng xác nhận thông tin sản phẩm trước khi thêm vào giỏ hàng
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Sản phẩm
                        </Label>
                        <div className="col-span-3">{adaptedProduct.name}</div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="color" className="text-right">
                          Màu sắc
                        </Label>
                        <select
                          className="col-span-3 bg-muted rounded-md border p-2"
                          value={selectedColor}
                          onChange={(e) => setSelectedColor(e.target.value)}
                        >
                          {adaptedProduct.colors.map((color: { name: string; value: string }) => (
                            <option key={color.value} value={color.value}>
                              {color.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="size" className="text-right">
                          Kích cỡ
                        </Label>
                        <select
                          className="col-span-3 bg-muted rounded-md border p-2"
                          value={selectedSize}
                          onChange={(e) => setSelectedSize(e.target.value)}
                        >
                          {adaptedProduct.sizes.map((size: string) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="quantity" className="text-right">
                          Số lượng
                        </Label>
                        <div className="col-span-3 flex items-center gap-2">
                          <Button variant="outline" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            max={adaptedProduct.stock}
                            value={quantity}
                            onChange={(e) =>
                              setQuantity(Math.max(1, Math.min(adaptedProduct.stock, parseInt(e.target.value) || 1)))
                            }
                            className="w-16 text-center"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={increaseQuantity}
                            disabled={quantity >= adaptedProduct.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleAddToCart}>
                        Xác nhận thêm vào giỏ hàng
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

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
          </div>
        </div>
      </div>

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
    </div>
  );
}