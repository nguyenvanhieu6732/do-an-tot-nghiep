"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import Link from "next/link";
import Loading from "../../../(routes)/loading";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  color?: string | null;
  size?: string | null;
  product: {
    id: string;
    name: string;
    price: number;
    image?: string | null;
  };
  imageUrl?: string | null; // Thêm trường để lưu URL hình ảnh
}

interface Order {
  id: string;
  userId: string;
  user?: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
  };
  createdAt: string;
  totalPrice: number;
  status: "PROCESSING" | "COMPLETED" | "CANCELLED";
  shippingMethod: string;
  paymentMethod: string;
  name: string;
  address: string;
  phone: string;
  items: OrderItem[];
}

export default function AdminOrderDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const { userId, isLoaded } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    if (!userId) {
      setError("Bạn cần đăng nhập để xem chi tiết đơn hàng");
      setLoading(false);
      return;
    }

    if (!params.id) {
      setError("Không tìm thấy id trong URL");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/orders/${params.id}`);
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error && typeof errorData.error === "object"
          ? JSON.stringify(errorData.error)
          : errorData.error || "Không thể tải chi tiết đơn hàng";
        throw new Error(errorMessage);
      }
      const data: Order = await response.json();

      // Fetch hình ảnh cho từng sản phẩm trong đơn hàng
      const updatedItems = await Promise.all(
        data.items.map(async (item) => {
          let imageUrl = null;
          if (item.productId) {
            try {
              const productResponse = await fetch(`/api/products/${item.productId}`);
              if (productResponse.ok) {
                const productData = await productResponse.json();
                imageUrl = productData.image || null;
                if (imageUrl && !imageUrl.startsWith("data:image")) {
                  imageUrl = `data:image/jpeg;base64,${imageUrl}`;
                }
              }
            } catch (err) {
              console.error(`Lỗi khi lấy ảnh cho sản phẩm ${item.productId}:`, err);
            }
          }
          return { ...item, imageUrl };
        })
      );

      setOrder({ ...data, items: updatedItems });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      toast.error("Lỗi", {
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    if (!order) return;

    try {
      const response = await fetch(`/api/orders/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Không thể hủy đơn hàng";
        throw new Error(errorMessage);
      }

      setOrder({ ...order, status: "CANCELLED" });
      toast.success("Thành công", {
        description: "Đơn hàng đã được hủy",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error("Lỗi", {
        description: message,
      });
    }
  };

  useEffect(() => {
    if (isLoaded) {
      fetchOrder();
    }
  }, [isLoaded, userId, params.id]);

  const formatPrice = (price: number | undefined | null): string => {
    if (price === undefined || price === null || isNaN(price)) {
      return "Không xác định";
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!isLoaded || loading) return <Loading />;

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Chi tiết đơn hàng</h1>
        <p className="text-red-500">{error || "Đơn hàng không tồn tại"}</p>
        {!userId && (
          <Link href="/sign-in">
            <Button className="mt-4">Đăng nhập</Button>
          </Link>
        )}
        {userId && (
          <Link href="/admin/orders">
            <Button className="mt-4">Quay lại danh sách đơn hàng</Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Chi tiết đơn hàng #{order.id}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Thông tin đơn hàng</h2>
          <div className="space-y-2">
            <p><strong>Người đặt:</strong> {order.user?.email || "Không xác định"}</p>
            <p><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
            <p><strong>Tổng tiền:</strong> {formatPrice(order.totalPrice)}</p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <span
                className={
                  order.status === "COMPLETED"
                    ? "text-green-600"
                    : order.status === "CANCELLED"
                    ? "text-red-600"
                    : "text-yellow-600"
                }
              >
                {order.status === "COMPLETED" ? "Hoàn thành" : order.status === "CANCELLED" ? "Đã hủy" : "Đang xử lý"}
              </span>
            </p>
            <p><strong>Hình thức vận chuyển:</strong> {order.shippingMethod === "fast" ? "Giao hàng nhanh" : "Giao hàng tiết kiệm"}</p>
            <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod === "cash" ? "Thanh toán khi nhận hàng" : "Thanh toán bằng VNPay"}</p>
          </div>
        </div>

        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Thông tin giao hàng</h2>
          <div className="space-y-2">
            <p><strong>Tên người nhận:</strong> {order.name}</p>
            <p><strong>Địa chỉ:</strong> {order.address}</p>
            <p><strong>Số điện thoại:</strong> {order.phone}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Sản phẩm trong đơn hàng</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hình ảnh</TableHead>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Màu sắc</TableHead>
              <TableHead>Kích cỡ</TableHead>
              <TableHead>Tổng</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items.map((item: OrderItem) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.product.name || "Sản phẩm"}
                      className="size-20 object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='gray'%3E%3Cpath d='M10 0a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-11h2v6H9V7zm1 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z'/%3E%3C/svg%3E";
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
                      Không có ảnh
                    </div>
                  )}
                </TableCell>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{formatPrice(item.product.price)}</TableCell>
                <TableCell>{item.color || "Không có"}</TableCell>
                <TableCell>{item.size || "Không có"}</TableCell>
                <TableCell>{formatPrice(item.product.price * item.quantity)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 flex gap-4">
        <Link href="/admin/orders">
          <Button variant="outline">Quay lại danh sách đơn hàng</Button>
        </Link>
        {order.status === "PROCESSING" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Hủy đơn hàng</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận hủy đơn hàng</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn hủy đơn hàng #{order.id} không? Hành động này không thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Không</AlertDialogCancel>
                <AlertDialogAction onClick={cancelOrder}>Có</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}