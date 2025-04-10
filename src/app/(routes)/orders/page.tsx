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
import { toast } from "sonner";
import Link from "next/link";
import Loading from "../loading";

export default function OrdersPage() {
    const { userId, isLoaded } = useAuth(); // Thêm isLoaded để kiểm tra trạng thái xác thực
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async () => {
        if (!userId) {
            setError("Bạn cần đăng nhập để xem đơn hàng");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`/api/orders?userId=${userId}`);
            if (!response.ok) {
                throw new Error("Không thể tải danh sách đơn hàng");
            }
            const data = await response.json();
            console.log("Dữ liệu đơn hàng từ API:", data);
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
            toast.error("Lỗi", {
                description: err instanceof Error ? err.message : "Không thể tải đơn hàng",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Chỉ fetch khi Clerk đã tải xong và có userId
        if (isLoaded) {
            fetchOrders();
        }
    }, [userId, isLoaded]);

    const formatPrice = (price: number | undefined | null) => {
        if (price === undefined || price === null || isNaN(price)) {
            return "Không xác định";
        }
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
        }).format(price);
    };

    // Hiển thị loading khi Clerk chưa tải xong
    if (!isLoaded || loading) return <Loading />;

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4">Đơn hàng của tôi</h1>
                <p className="text-red-500">{error}</p>
                {!userId && (
                    <Link href="/sign-in">
                        <Button className="mt-4">Đăng nhập</Button>
                    </Link>
                )}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>

            {orders.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Bạn chưa có đơn hàng nào.</p>
                    <Link href="/products">
                        <Button>Bắt đầu mua sắm</Button>
                    </Link>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mã đơn hàng</TableHead>
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
                                <TableCell>{order.shippingMethod === "economy" ?"Giao hàng tiết kiệm" : "Giao hàng nhanh"}</TableCell>
                                <TableCell>{order.paymentMethod === "cash" ? "Thanh toán khi nhận hàng" : "Thanh toán bằng VNPay"}</TableCell>
                                <TableCell>
                                    <Link href={`/orders/${order.id}`}>
                                        <Button variant="outline" size="sm">
                                            Xem chi tiết
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}