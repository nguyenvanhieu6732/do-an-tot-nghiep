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
import Loading from "../../(routes)/loading";

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

export default function AdminOrdersPage() {
  const { userId, isLoaded } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    if (!userId) {
      setError("Bạn cần đăng nhập để xem đơn hàng");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/orders", {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorData = await response.json();
        // Xử lý lỗi từ API thành chuỗi
        const errorMessage = errorData.error && typeof errorData.error === "object"
          ? JSON.stringify(errorData.error)
          : errorData.error || "Không thể tải danh sách đơn hàng";
        throw new Error(errorMessage);
      }
      const data: Order[] = await response.json();
      setOrders(Array.isArray(data) ? data : []);
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

  const cancelOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Không thể hủy đơn hàng";
        throw new Error(errorMessage);
      }

      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: "CANCELLED" } : order
      ));
      
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
      fetchOrders();
    }
  }, [userId, isLoaded]);

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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Quản lý đơn hàng</h1>
        <p className="text-red-500">{error}</p>
        {!userId && (
          <Link href="/sign-in">
            <Button className="mt-4">Đăng nhập</Button>
          </Link>
        )}
        {userId && (
          <Link href="/">
            <Button className="mt-4">Quay lại trang chủ</Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h1>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Chưa có đơn hàng nào.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn hàng</TableHead>
              <TableHead>Người đặt</TableHead>
              <TableHead>Ngày đặt</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Hình thức vận chuyển</TableHead>
              <TableHead>Phương thức thanh toán</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.name || "Không xác định"}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell>{formatPrice(order.totalPrice)}</TableCell>
                <TableCell>
                  <span
                    className={
                      order.status === "COMPLETED"
                        ? "text-green-600"
                        : order.status === "CANCELLED"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }
                  >
                    {order.status === "COMPLETED"
                      ? "Hoàn thành"
                      : order.status === "CANCELLED"
                      ? "Đã hủy"
                      : "Đang xử lý"}
                  </span>
                </TableCell>
                <TableCell>
                  {order.shippingMethod === "fast" ? "Giao hàng nhanh" : "Giao hàng tiết kiệm"}
                </TableCell>
                <TableCell>
                  {order.paymentMethod === "cash" ? "Thanh toán khi nhận hàng" : "Thanh toán bằng VNPay"}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Link href={`/admin/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      Xem chi tiết
                    </Button>
                  </Link>
                  {order.status === "PROCESSING" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Hủy đơn
                        </Button>
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
                          <AlertDialogAction onClick={() => cancelOrder(order.id)}>
                            Có
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}